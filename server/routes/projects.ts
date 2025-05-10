import { Router } from "express";
import type { Request, Response, RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
// import { moderateContent } from '../services/moderation';
import { sendNotification } from "../services/notification";
import { analyzeEngagementPotential, moderateContent } from "@/src/lib/openai";
// import { analyzeEngagementPotential } from '../services/analytics';

const router = Router();
const prisma = new PrismaClient();

// Schema validation for project creation
const projectSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(300),
  pitch: z.string().min(50),
  industry: z.string().min(1),
  fundingStage: z.string().min(1),
  fundingAmount: z.number().optional().nullable(),
  equity: z.number().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  demo: z.string().url().optional().nullable().or(z.literal("")),
  deck: z.string().url().optional().nullable().or(z.literal("")),
});

// Schema validation for project updates
const projectUpdateSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(300).optional(),
  pitch: z.string().min(50).optional(),
  industry: z.string().min(1).optional(),
  fundingStage: z.string().min(1).optional(),
  fundingAmount: z.number().optional().nullable(),
  equity: z.number().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  demo: z.string().url().optional().nullable().or(z.literal("")),
  deck: z.string().url().optional().nullable().or(z.literal("")),
});

// Analyze pitch for engagement potential
router.post("/analyze-pitch", (async (req: Request, res: Response) => {
  try {
    const { pitch } = req.body;

    if (!pitch || typeof pitch !== "string" || pitch.length < 50) {
      return res
        .status(400)
        .json({ error: "Invalid pitch. Minimum 50 characters required." });
    }

    const result = await analyzeEngagementPotential(pitch);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error analyzing pitch:", error);
    res.status(500).json({ error: "Failed to analyze pitch" });
  }
}) as RequestHandler<ParamsDictionary, any, any, any>);

// Get all projects with optional filters
router.get("/", (async (req: Request, res: Response) => {
  try {
    const {
      industry,
      fundingStage,
      search,
      limit = "10",
      offset = "0",
      userId,
    } = req.query;

    const filters: any = {};

    if (industry) {
      filters.industry = industry as string;
    }

    if (fundingStage) {
      filters.fundingStage = fundingStage as string;
    }

    if (search) {
      filters.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Filter by user (founder) if userId is provided
    if (userId) {
      filters.founderUserId = userId as string;
    }

    const projects = await prisma.project.findMany({
      where: filters,
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
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalCount = await prisma.project.count({
      where: filters,
    });

    // Check if projects are saved/liked by current user
    const user = req.user;
    if (user && projects.length > 0) {
      const projectIds = projects.map((p) => p.id);

      const userInteractions = await Promise.all([
        prisma.projectLike.findMany({
          where: {
            userId: user.id,
            projectId: { in: projectIds },
          },
          select: {
            projectId: true,
          },
        }),
        prisma.savedProject.findMany({
          where: {
            userId: user.id,
            projectId: { in: projectIds },
          },
          select: {
            projectId: true,
          },
        }),
      ]);

      const likedProjects = new Set(
        userInteractions[0].map((like) => like.projectId)
      );
      const savedProjects = new Set(
        userInteractions[1].map((saved) => saved.projectId)
      );

      // Add user interaction data to each project
      const projectsWithUserData = projects.map((project) => ({
        ...project,
        stats: {
          views: project._count.views,
          likes: project._count.likes,
          comments: project._count.comments,
        },
        userInteraction: {
          isLiked: likedProjects.has(project.id),
          isSaved: savedProjects.has(project.id),
        },
      }));

      return res.status(200).json({
        projects: projectsWithUserData,
        totalCount,
        hasMore:
          parseInt(offset as string) + parseInt(limit as string) < totalCount,
      });
    }

    // Return without user interaction data
    const projectsWithStats = projects.map((project) => ({
      ...project,
      stats: {
        views: project._count.views,
        likes: project._count.likes,
        comments: project._count.comments,
      },
    }));

    res.status(200).json({
      projects: projectsWithStats,
      totalCount,
      hasMore:
        parseInt(offset as string) + parseInt(limit as string) < totalCount,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
}) as RequestHandler<ParamsDictionary, any, any, any>);

// Get a specific project by ID
router.get("/:id", (async (
  req: Request<ParamsDictionary & { id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const user = req.user;

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
      return res.status(404).json({ error: "Project not found" });
    }

    // Record view if user is logged in and not the project founder
    if (user && user.id !== project.founderUserId) {
      await recordProjectView(id, user.id);
    }

    // Check if the current user has liked or saved the project
    let userInteraction = {};

    if (user) {
      const interactions = await Promise.all([
        prisma.projectLike.findUnique({
          where: {
            userId_projectId: {
              userId: user.id,
              projectId: id,
            },
          },
        }),
        prisma.savedProject.findUnique({
          where: {
            userId_projectId: {
              userId: user.id,
              projectId: id,
            },
          },
        }),
      ]);

      userInteraction = {
        isLiked: !!interactions[0],
        isSaved: !!interactions[1],
      };
    }

    res.status(200).json({
      ...project,
      stats: {
        views: project._count.views,
        likes: project._count.likes,
        comments: project._count.comments,
      },
      userInteraction,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
}) as RequestHandler<ParamsDictionary & { id: string }, any, any, any>);

// Create a new project
router.post("/", async (req, res) => {
  try {
    const user = req.user;

    // Check if user is a founder
    if (user.role !== "FOUNDER") {
      return res
        .status(403)
        .json({ error: "Only founders can create projects" });
    }

    // Validate request body
    const validationResult = projectSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid project data",
        details: validationResult.error.format(),
      });
    }

    const data = validationResult.data;

    // Moderate the pitch content
    const moderationResult = await moderateContent(data.pitch);

    if (moderationResult.isFlagged) {
      return res.status(400).json({
        error: "Project pitch contains inappropriate content",
        moderationResult,
      });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        pitch: data.pitch,
        industry: data.industry,
        fundingStage: data.fundingStage,
        fundingAmount: data.fundingAmount,
        equity: data.equity,
        website: data.website || null,
        demo: data.demo || null,
        deck: data.deck || null,
        founderUserId: user.id,
      },
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
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Update a project
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if project exists and user is the owner
    const project = await prisma.project.findUnique({
      where: { id },
      select: { founderUserId: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.founderUserId !== user.id) {
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

    // If pitch is being updated, moderate the content
    if (data.pitch) {
      const moderationResult = await moderateContent(data.pitch);

      if (moderationResult.isFlagged) {
        return res.status(400).json({
          error: "Project pitch contains inappropriate content",
          moderationResult,
        });
      }
    }

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

    res.status(200).json({
      ...updatedProject,
      stats: {
        views: updatedProject._count.views,
        likes: updatedProject._count.likes,
        comments: updatedProject._count.comments,
      },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if project exists and user is the owner
    const project = await prisma.project.findUnique({
      where: { id },
      select: { founderUserId: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.founderUserId !== user.id) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this project" });
    }

    // Delete project (cascade will delete related records)
    await prisma.project.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Get FAQs for a project
router.get("/:id/faqs", async (req, res) => {
  try {
    const { id } = req.params;

    const faqs = await prisma.projectFAQ.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

// Add a FAQ to a project
router.post("/:id/faqs", async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const user = req.user;

    // Validate input
    if (!question || !answer) {
      return res
        .status(400)
        .json({ error: "Question and answer are required" });
    }

    // Check if project exists and user is the owner
    const project = await prisma.project.findUnique({
      where: { id },
      select: { founderUserId: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.founderUserId !== user.id) {
      return res
        .status(403)
        .json({ error: "Only the project owner can add FAQs" });
    }

    // Create FAQ
    const faq = await prisma.projectFAQ.create({
      data: {
        question,
        answer,
        projectId: id,
      },
    });

    res.status(201).json(faq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ error: "Failed to create FAQ" });
  }
});

// Update a FAQ
router.put("/:projectId/faqs/:faqId", async (req, res) => {
  try {
    const { projectId, faqId } = req.params;
    const { question, answer } = req.body;
    const user = req.user;

    // Validate input
    if (!question && !answer) {
      return res.status(400).json({ error: "Question or answer is required" });
    }

    // Check if project exists and user is the owner
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
        .json({ error: "Only the project owner can update FAQs" });
    }

    // Check if FAQ exists
    const faq = await prisma.projectFAQ.findUnique({
      where: { id: faqId },
      select: { id: true },
    });

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    // Update FAQ
    const updatedFAQ = await prisma.projectFAQ.update({
      where: { id: faqId },
      data: {
        question: question ?? undefined,
        answer: answer ?? undefined,
      },
    });

    res.status(200).json(updatedFAQ);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ error: "Failed to update FAQ" });
  }
});

// Delete a FAQ
router.delete("/:projectId/faqs/:faqId", async (req, res) => {
  try {
    const { projectId, faqId } = req.params;
    const user = req.user;

    // Check if project exists and user is the owner
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
        .json({ error: "Only the project owner can delete FAQs" });
    }

    // Delete FAQ
    await prisma.projectFAQ.delete({
      where: { id: faqId },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
});

// Record a view on a project
router.post("/:id/view", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ error: "Authentication required to record views" });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, founderUserId: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Don't record views from the project owner
    if (project.founderUserId === user.id) {
      return res
        .status(200)
        .json({ message: "View not recorded (project owner)" });
    }

    // Record the view
    await recordProjectView(id, user.id);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error recording view:", error);
    res.status(500).json({ error: "Failed to record view" });
  }
});

// Helper function to record project view
async function recordProjectView(projectId: string, viewerId: string) {
  try {
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
        await sendNotification({
          userId: project.founderUserId,
          type: "view",
          content: `${viewer?.name || "Someone"} viewed your ${
            project.title
          } project`,
          relatedId: projectId,
        });
      }
    }

    // Get the pusher instance from app
    const req: any = {};
    const pusher = req.app?.get("pusher");

    if (pusher) {
      // Get project details
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { founderUserId: true, title: true },
      });

      if (project) {
        // Get viewer details
        const viewer = await prisma.user.findUnique({
          where: { id: viewerId },
          select: { name: true, companyName: true },
        });

        // Broadcast view event to project channel
        pusher.trigger(`project-${projectId}`, "new-view", {
          viewer: {
            id: viewerId,
            name: viewer?.name,
            companyName: viewer?.companyName,
          },
          timestamp: new Date().toISOString(),
        });

        // Broadcast to founder's user channel
        pusher.trigger(`user-${project.founderUserId}`, "new-notification", {
          type: "view",
          content: `${viewer?.name || "Someone"} viewed your ${
            project.title
          } project`,
          relatedId: projectId,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return true;
  } catch (error) {
    console.error("Error recording project view:", error);
    throw error;
  }
}

export default router;
