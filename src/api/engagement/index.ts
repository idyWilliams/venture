import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/src/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { Prisma } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
//@ts-ignore
  const userId = session.user.id;

  // GET engagement stats for a user's projects (for founders)
  if (req.method === 'GET') {
    try {
      const { projectId, timeframe = 'week' } = req.query;

      // Check if requesting specific project or all projects
      if (projectId && typeof projectId === 'string') {
        // Verify the user is the project owner
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: { founderUserId: true },
        });

        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }

        if (project.founderUserId !== userId) {
          return res.status(403).json({ error: 'You do not have permission to view these stats' });
        }

        // Get project engagement stats
        const stats = await getProjectEngagementStats(projectId, timeframe as string);
        return res.status(200).json(stats);
      } else {
        // Get engagement stats for all user's projects
        const userProjects = await prisma.project.findMany({
          where: { founderUserId: userId },
          select: { id: true },
        });

        const projectIds = userProjects.map(p => p.id);

        if (projectIds.length === 0) {
          return res.status(200).json({
            totalViews: 0,
            totalLikes: 0,
            totalComments: 0,
            totalContactRequests: 0,
            projectsWithMostViews: [],
            recentActivity: [],
          });
        }

        // Calculate aggregate stats
        const [
          viewsCount,
          likesCount,
          commentsCount,
          contactRequestsCount,
          topProjects,
          recentActivity
        ] = await Promise.all([
          prisma.projectView.count({
            where: { projectId: { in: projectIds } },
          }),
          prisma.projectLike.count({
            where: { projectId: { in: projectIds } },
          }),
          prisma.comment.count({
            where: { projectId: { in: projectIds } },
          }),
          prisma.contactRequest.count({
            where: {
              recipientId: userId,
              status: { not: 'rejected' },
            },
          }),
          // Get top projects by views
          prisma.project.findMany({
            where: { id: { in: projectIds } },
            select: {
              id: true,
              title: true,
              _count: {
                select: { views: true },
              },
            },
            orderBy: {
              views: { _count: 'desc' },
            },
            take: 5,
          }),
          // Get recent engagement activity
          prisma.notification.findMany({
            where: {
              userId,
              relatedId: { in: projectIds },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          }),
        ]);

        return res.status(200).json({
          totalViews: viewsCount,
          totalLikes: likesCount,
          totalComments: commentsCount,
          totalContactRequests: contactRequestsCount,
          projectsWithMostViews: topProjects.map(p => ({
            id: p.id,
            title: p.title,
            views: p._count.views,
          })),
          recentActivity,
        });
      }
    } catch (error) {
      console.error('Error fetching engagement stats:', error);
      return res.status(500).json({ error: 'Failed to fetch engagement stats' });
    }
  }

  // POST like a project
  if (req.method === 'POST') {
    try {
      const { projectId, action } = req.body;

      if (!projectId || typeof projectId !== 'string') {
        return res.status(400).json({ error: 'Invalid project ID' });
      }

      if (!action || (action !== 'like' && action !== 'save')) {
        return res.status(400).json({ error: 'Invalid action. Must be "like" or "save"' });
      }

      // Check if project exists
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, founderUserId: true, title: true },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      let result;

      if (action === 'like') {
        // Check if already liked
        const existingLike = await prisma.projectLike.findUnique({
          where: {
            userId_projectId: {
              userId,
              projectId,
            },
          },
        });

        if (existingLike) {
          return res.status(400).json({ error: 'Project already liked' });
        }

        // Create like
        result = await prisma.projectLike.create({
          data: {
            userId,
            projectId,
          },
        });

        // Create notification for the project owner
        if (project.founderUserId !== userId) {
          const liker = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
          });

          await prisma.notification.create({
            data: {
              userId: project.founderUserId,
              type: 'like',
              content: `${liker?.name || 'Someone'} liked your ${project.title} project`,
              relatedId: projectId,
            },
          });
        }
      } else {
        // action === 'save'
        // Check if already saved
        const existingSave = await prisma.savedProject.findUnique({
          where: {
            userId_projectId: {
              userId,
              projectId,
            },
          },
        });

        if (existingSave) {
          return res.status(400).json({ error: 'Project already saved' });
        }

        // Create save
        result = await prisma.savedProject.create({
          data: {
            userId,
            projectId,
          },
        });
      }

      return res.status(201).json({ success: true, action, projectId });
    } catch (error) {
      console.error(`Error ${req.body.action}ing project:`, error);
      return res.status(500).json({ error: `Failed to ${req.body.action} project` });
    }
  }

  // DELETE unlike/unsave a project
  if (req.method === 'DELETE') {
    try {
      const { projectId, action } = req.query;

      if (!projectId || typeof projectId !== 'string') {
        return res.status(400).json({ error: 'Invalid project ID' });
      }

      if (!action || (action !== 'like' && action !== 'save')) {
        return res.status(400).json({ error: 'Invalid action. Must be "like" or "save"' });
      }

      if (action === 'like') {
        // Delete like
        await prisma.projectLike.delete({
          where: {
            userId_projectId: {
              userId,
              projectId,
            },
          },
        });
      } else {
        // action === 'save'
        // Delete save
        await prisma.savedProject.delete({
          where: {
            userId_projectId: {
              userId,
              projectId,
            },
          },
        });
      }

      return res.status(200).json({ success: true, action, projectId });
    } catch (error) {
      console.error(`Error un${req.query.action}ing project:`, error);

      // Check if the error is a "record not found" error
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ error: `Project not ${req.query.action}d` });
      }

      return res.status(500).json({ error: `Failed to un${req.query.action} project` });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

// Helper function to get engagement stats for a specific project
async function getProjectEngagementStats(projectId: string, timeframe: string) {
  let startDate: Date;
  const now = new Date();

  // Determine the start date based on timeframe
  switch (timeframe) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7)); // Default to week
  }

  // Get project data
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      _count: {
        select: {
          views: true,
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Get recent views
  const recentViews = await prisma.projectView.findMany({
    where: {
      projectId,
      lastViewed: { gte: startDate },
    },
    include: {
      viewer: {
        select: {
          id: true,
          name: true,
          companyName: true,
        },
      },
    },
    orderBy: { lastViewed: 'desc' },
  });

  // Get recent likes
  const recentLikes = await prisma.projectLike.findMany({
    where: {
      projectId,
      createdAt: { gte: startDate },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          companyName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get recent comments
  const recentComments = await prisma.comment.findMany({
    where: {
      projectId,
      createdAt: { gte: startDate },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          companyName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get top viewers
  const topViewers = await prisma.projectView.groupBy({
    by: ['viewerId'],
    where: { projectId },
    _sum: { viewCount: true },
    orderBy: { _sum: { viewCount: 'desc' } },
    take: 5,
  });

  const topViewersWithDetails = await Promise.all(
    topViewers.map(async (viewer) => {
      const user = await prisma.user.findUnique({
        where: { id: viewer.viewerId },
        select: {
          id: true,
          name: true,
          companyName: true,
        },
      });
      return {
        user,
        views: viewer._sum.viewCount,
      };
    })
  );

  // Calculate time series data for views over time
  const viewsOverTime = await getTimeSeriesData(projectId, timeframe, 'view');
  const likesOverTime = await getTimeSeriesData(projectId, timeframe, 'like');
  const commentsOverTime = await getTimeSeriesData(projectId, timeframe, 'comment');

  return {
    totalStats: {
      views: project._count.views,
      likes: project._count.likes,
      comments: project._count.comments,
    },
    recentActivity: {
      views: recentViews,
      likes: recentLikes,
      comments: recentComments,
    },
    topViewers: topViewersWithDetails,
    timeSeriesData: {
      views: viewsOverTime,
      likes: likesOverTime,
      comments: commentsOverTime,
    },
  };
}

// Helper function to get time series data for various engagement metrics
async function getTimeSeriesData(
  projectId: string,
  timeframe: string,
  type: 'view' | 'like' | 'comment'
) {
  let interval: string;
  let dateField: string;
  let groupBy: string;

  // Set the appropriate interval and date field based on type
  switch (type) {
    case 'view':
      dateField = 'lastViewed';
      break;
    case 'like':
      dateField = 'createdAt';
      break;
    case 'comment':
      dateField = 'createdAt';
      break;
    default:
      dateField = 'createdAt';
  }

  // Set the appropriate interval and groupBy based on timeframe
  switch (timeframe) {
    case 'day':
      interval = 'hour';
      groupBy = `date_trunc('hour', "${dateField}")`;
      break;
    case 'week':
      interval = 'day';
      groupBy = `date_trunc('day', "${dateField}")`;
      break;
    case 'month':
      interval = 'day';
      groupBy = `date_trunc('day', "${dateField}")`;
      break;
    case 'year':
      interval = 'month';
      groupBy = `date_trunc('month', "${dateField}")`;
      break;
    default:
      interval = 'day';
      groupBy = `date_trunc('day', "${dateField}")`;
  }

  // Build the appropriate query based on type
  let query: string;

  switch (type) {
    case 'view':
      query = `
        SELECT ${groupBy} as date, SUM("viewCount") as count
        FROM "ProjectView"
        WHERE "projectId" = $1
        GROUP BY date
        ORDER BY date ASC
      `;
      break;
    case 'like':
      query = `
        SELECT ${groupBy} as date, COUNT(*) as count
        FROM "ProjectLike"
        WHERE "projectId" = $1
        GROUP BY date
        ORDER BY date ASC
      `;
      break;
    case 'comment':
      query = `
        SELECT ${groupBy} as date, COUNT(*) as count
        FROM "Comment"
        WHERE "projectId" = $1
        GROUP BY date
        ORDER BY date ASC
      `;
      break;
    default:
      throw new Error('Invalid type');
  }

  // Execute the raw query
  const results = await prisma.$queryRawUnsafe(query, projectId);

  return results;
}
