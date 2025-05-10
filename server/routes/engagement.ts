import { Router, Request, Response, RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { PrismaClient, Prisma } from "@prisma/client";
import { sendNotification } from "../services/notification";

const router = Router();
const prisma = new PrismaClient();

// Get engagement stats for a user's projects (for founders)
router.get("/stats", (async (
  req: Request<{}, any, any, { projectId?: string; timeframe?: string }>,
  res: Response
) => {
  try {
    const user = req.user;
    const { projectId, timeframe = "week" } = req.query;

    // Check if requesting specific project or all projects
    if (projectId && typeof projectId === "string") {
      // Verify the user is the project owner
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { founderUserId: true },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      if (project.founderUserId !== user.id) {
        return res
          .status(403)
          .json({ error: "You do not have permission to view these stats" });
      }

      // Get project engagement stats
      const stats = await getProjectEngagementStats(
        projectId,
        timeframe as string
      );
      return res.status(200).json(stats);
    } else {
      // Get engagement stats for all user's projects
      const userProjects = await prisma.project.findMany({
        where: { founderUserId: user.id },
        select: { id: true, title: true },
      });

      const projectIds = userProjects.map((p) => p.id);

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
        recentActivity,
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
            recipientId: user.id,
            status: { not: "rejected" },
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
            views: { _count: "desc" },
          },
          take: 5,
        }),
        // Get recent engagement activity
        prisma.notification.findMany({
          where: {
            userId: user.id,
            relatedId: { in: projectIds },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      return res.status(200).json({
        totalViews: viewsCount,
        totalLikes: likesCount,
        totalComments: commentsCount,
        totalContactRequests: contactRequestsCount,
        projectsWithMostViews: topProjects.map((p) => ({
          id: p.id,
          title: p.title,
          views: p._count.views,
        })),
        recentActivity,
      });
    }
  } catch (error) {
    console.error("Error fetching engagement stats:", error);
    res.status(500).json({ error: "Failed to fetch engagement stats" });
  }
}) as unknown as RequestHandler);

// Like a project
router.post("/like", (async (
  req: Request<{}, any, { projectId: string }>,
  res: Response
) => {
  try {
    const user = req.user;
    const { projectId } = req.body;

    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, founderUserId: true, title: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if already liked
    const existingLike = await prisma.projectLike.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({ error: "Project already liked" });
    }

    // Create like
    await prisma.projectLike.create({
      data: {
        userId: user.id,
        projectId,
      },
    });

    // Create notification for the project owner
    if (project.founderUserId !== user.id) {
      await sendNotification({
        userId: project.founderUserId,
        type: "like",
        content: `${user.name} liked your ${project.title} project`,
        relatedId: projectId,
      });

      // Get the pusher instance
      const pusher = req.app.get("pusher");

      if (pusher) {
        // Broadcast like event to project channel
        pusher.trigger(`project-${projectId}`, "new-like", {
          user: {
            id: user.id,
            name: user.name,
          },
          timestamp: new Date().toISOString(),
        });

        // Broadcast to founder's user channel
        pusher.trigger(`user-${project.founderUserId}`, "new-notification", {
          type: "like",
          content: `${user.name} liked your ${project.title} project`,
          relatedId: projectId,
          timestamp: new Date().toISOString(),
        });
      }
    }

    res.status(201).json({ success: true, action: "like", projectId });
  } catch (error) {
    console.error("Error liking project:", error);
    res.status(500).json({ error: "Failed to like project" });
  }
}) as unknown as RequestHandler);

// Unlike a project
router.delete("/like/:projectId", (async (
  req: Request<{ projectId: string }>,
  res: Response
) => {
  try {
    const user = req.user;
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Delete like
    await prisma.projectLike.delete({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

    res.status(200).json({ success: true, action: "unlike", projectId });
  } catch (error) {
    console.error("Error unliking project:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ error: "Project not liked" });
    }
    res.status(500).json({ error: "Failed to unlike project" });
  }
}) as unknown as RequestHandler);

// Save a project
router.post("/save", (async (
  req: Request<{}, any, { projectId: string }>,
  res: Response
) => {
  try {
    const user = req.user;
    const { projectId } = req.body;

    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if already saved
    const existingSave = await prisma.savedProject.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

    if (existingSave) {
      return res.status(400).json({ error: "Project already saved" });
    }

    // Create save
    await prisma.savedProject.create({
      data: {
        userId: user.id,
        projectId,
      },
    });

    res.status(201).json({ success: true, action: "save", projectId });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ error: "Failed to save project" });
  }
}) as unknown as RequestHandler);

// Unsave a project
router.delete("/save/:projectId", (async (
  req: Request<{ projectId: string }>,
  res: Response
) => {
  try {
    const user = req.user;
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Delete save
    await prisma.savedProject.delete({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

    res.status(200).json({ success: true, action: "unsave", projectId });
  } catch (error) {
    console.error("Error unsaving project:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ error: "Project not saved" });
    }
    res.status(500).json({ error: "Failed to unsave project" });
  }
}) as unknown as RequestHandler);

// Get saved projects
router.get("/saved", async (req, res) => {
  try {
    const user = req.user;

    const savedProjects = await prisma.savedProject.findMany({
      where: { userId: user.id },
      include: {
        project: {
          include: {
            founder: {
              select: {
                id: true,
                name: true,
                companyName: true,
                profileImage: true,
              },
            },
            _count: {
              select: {
                views: true,
                comments: true,
                likes: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format response
    const formattedProjects = savedProjects.map((saved) => ({
      id: saved.project.id,
      title: saved.project.title,
      description: saved.project.description,
      industry: saved.project.industry,
      fundingStage: saved.project.fundingStage,
      fundingAmount: saved.project.fundingAmount,
      equity: saved.project.equity,
      createdAt: saved.project.createdAt,
      updatedAt: saved.project.updatedAt,
      founder: saved.project.founder,
      stats: {
        views: saved.project._count.views,
        likes: saved.project._count.likes,
        comments: saved.project._count.comments,
      },
      savedAt: saved.createdAt,
    }));

    res.status(200).json(formattedProjects);
  } catch (error) {
    console.error("Error fetching saved projects:", error);
    res.status(500).json({ error: "Failed to fetch saved projects" });
  }
});

// Helper function to get engagement stats for a specific project
async function getProjectEngagementStats(projectId: string, timeframe: string) {
  let startDate: Date;
  const now = new Date();

  // Determine the start date based on timeframe
  switch (timeframe) {
    case "day":
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case "week":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "month":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "year":
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
    throw new Error("Project not found");
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
    orderBy: { lastViewed: "desc" },
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
    orderBy: { createdAt: "desc" },
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
    orderBy: { createdAt: "desc" },
  });

  // Get top viewers
  const topViewers = await prisma.projectView.groupBy({
    by: ["viewerId"],
    where: { projectId },
    _sum: { viewCount: true },
    orderBy: { _sum: { viewCount: "desc" } },
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
  const viewsOverTime = await getTimeSeriesData(projectId, timeframe, "view");
  const likesOverTime = await getTimeSeriesData(projectId, timeframe, "like");
  const commentsOverTime = await getTimeSeriesData(
    projectId,
    timeframe,
    "comment"
  );

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
  type: "view" | "like" | "comment"
) {
  let interval: string;
  let dateField: string;
  let groupBy: string;

  // Set the appropriate interval and date field based on type
  switch (type) {
    case "view":
      dateField = "lastViewed";
      break;
    case "like":
      dateField = "createdAt";
      break;
    case "comment":
      dateField = "createdAt";
      break;
    default:
      dateField = "createdAt";
  }

  // Set the appropriate interval and groupBy based on timeframe
  switch (timeframe) {
    case "day":
      interval = "hour";
      groupBy = `date_trunc('hour', "${dateField}")`;
      break;
    case "week":
      interval = "day";
      groupBy = `date_trunc('day', "${dateField}")`;
      break;
    case "month":
      interval = "day";
      groupBy = `date_trunc('day', "${dateField}")`;
      break;
    case "year":
      interval = "month";
      groupBy = `date_trunc('month', "${dateField}")`;
      break;
    default:
      interval = "day";
      groupBy = `date_trunc('day', "${dateField}")`;
  }

  // Build the appropriate query based on type
  let query: string;

  switch (type) {
    case "view":
      query = `
        SELECT ${groupBy} as date, SUM("viewCount") as count
        FROM "ProjectView"
        WHERE "projectId" = $1
        GROUP BY date
        ORDER BY date ASC
      `;
      break;
    case "like":
      query = `
        SELECT ${groupBy} as date, COUNT(*) as count
        FROM "ProjectLike"
        WHERE "projectId" = $1
        GROUP BY date
        ORDER BY date ASC
      `;
      break;
    case "comment":
      query = `
        SELECT ${groupBy} as date, COUNT(*) as count
        FROM "Comment"
        WHERE "projectId" = $1
        GROUP BY date
        ORDER BY date ASC
      `;
      break;
    default:
      throw new Error("Invalid type");
  }

  // Execute the raw query
  const results = await prisma.$queryRawUnsafe(query, projectId);

  return results;
}

export default router;
