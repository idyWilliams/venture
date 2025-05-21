import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/src/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Schema validation for project updates
const projectUpdateSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(300).optional(),
  pitch: z.string().min(50).optional(),
  industry: z.string().min(1).optional(),
  fundingStage: z.string().min(1).optional(),
  fundingAmount: z.number().optional().nullable(),
  equity: z.number().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal('')),
  demo: z.string().url().optional().nullable().or(z.literal('')),
  deck: z.string().url().optional().nullable().or(z.literal('')),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  // GET specific project
  if (req.method === 'GET') {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          founder: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              openForContact: true,
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
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Record view if the viewer is different from the founder
      //@ts-ignore
      if (session.user.id !== project.founderUserId) {
        //@ts-ignore
        await recordProjectView(id, session.user.id);
      }

      // Check if the current user has liked or saved the project
      const userData = await prisma.$transaction([
        prisma.projectLike.findUnique({
          where: {
            userId_projectId: {
              //@ts-ignore
              userId: session.user.id,
              projectId: id,
            },
          },
        }),
        prisma.savedProject.findUnique({
          where: {
            userId_projectId: {
              //@ts-ignore
              userId: session.user.id,
              projectId: id,
            },
          },
        }),
      ]);

      return res.status(200).json({
        ...project,
        stats: {
          views: project._count.views,
          likes: project._count.likes,
          comments: project._count.comments,
        },
        userInteraction: {
          isLiked: !!userData[0],
          isSaved: !!userData[1],
        },
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }
  }

  // PUT/PATCH update project
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      // Check if project exists and user is the owner
      const project = await prisma.project.findUnique({
        where: { id },
        select: { founderUserId: true },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      //@ts-ignore
      if (project.founderUserId !== session.user.id) {
        return res
          .status(403)
          .json({ error: "You do not have permission to update this project" });
      }

      // Validate request body
      const validationResult = projectUpdateSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid project data",
          details: validationResult.error.format(),
        });
      }

      const data = validationResult.data;

      // Update project
      const updatedProject = await prisma.project.update({
        where: { id },
        data,
        include: {
          founder: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              openForContact: true,
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
      });

      return res.status(200).json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      return res.status(500).json({ error: 'Failed to update project' });
    }
  }

  // DELETE project
  if (req.method === 'DELETE') {
    try {
      // Check if project exists and user is the owner
      const project = await prisma.project.findUnique({
        where: { id },
        select: { founderUserId: true },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      //@ts-ignore
      if (project.founderUserId !== session.user.id) {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this project" });
      }

      // Delete project (cascade will delete related records)
      await prisma.project.delete({
        where: { id },
      });

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

// Helper function to record project view
async function recordProjectView(projectId: string, viewerId: string) {
  try {
    // Check if view exists
    const existingView = await prisma.projectView.findUnique({
      where: {
        projectId_viewerId: {
          projectId,
          viewerId,
        },
      },
    });

    if (existingView) {
      // Increment view count
      await prisma.projectView.update({
        where: {
          projectId_viewerId: {
            projectId,
            viewerId,
          },
        },
        data: {
          viewCount: { increment: 1 },
          lastViewed: new Date(),
        },
      });
    } else {
      // Create new view record
      await prisma.projectView.create({
        data: {
          projectId,
          viewerId,
          viewCount: 1,
        },
      });

      // Get project's founder ID to create notification
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { founderUserId: true, title: true },
      });

      if (project) {
        // Get viewer's name
        const viewer = await prisma.user.findUnique({
          where: { id: viewerId },
          select: { name: true },
        });

        // Create notification for the founder
        await prisma.notification.create({
          data: {
            userId: project.founderUserId,
            type: 'view',
            content: `${viewer?.name || 'Someone'} viewed your ${project.title} project`,
            relatedId: projectId,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error recording project view:', error);
    // Still return success since this is a background operation
    return true;
  }
}
