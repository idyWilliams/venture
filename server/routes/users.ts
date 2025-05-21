import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

const router = Router();
const prisma = new PrismaClient();

// Type definition for authenticated request
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

// Schema validation for user creation
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(["founder", "investor"]),
  companyName: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  linkedin: z.string().url().optional().nullable().or(z.literal("")),
  twitter: z.string().url().optional().nullable().or(z.literal("")),
  openForContact: z.boolean().optional(),
});

// Schema validation for user updates
const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  companyName: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  linkedin: z.string().url().optional().nullable().or(z.literal("")),
  twitter: z.string().url().optional().nullable().or(z.literal("")),
  openForContact: z.boolean().optional(),
});

// Get current user profile
router.get("/me", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        bio: true,
        profileImage: true,
        website: true,
        linkedin: true,
        twitter: true,
        openForContact: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get additional stats based on role
    if (userProfile.role === "founder") {
      const founderStats = await getFounderStats(userProfile.id);
      return res.status(200).json({
        ...userProfile,
        stats: founderStats,
      });
    } else {
      const investorStats = await getInvestorStats(userProfile.id);
      return res.status(200).json({
        ...userProfile,
        stats: investorStats,
      });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Get user profile by ID
router.get("/:id", (async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userProfile = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        companyName: true,
        bio: true,
        profileImage: true,
        website: true,
        linkedin: true,
        twitter: true,
        openForContact: true,
        createdAt: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get additional stats based on role
    if (userProfile.role === "founder") {
      const projects = await prisma.project.findMany({
        where: { founderUserId: id },
        select: {
          id: true,
          title: true,
          description: true,
          industry: true,
          fundingStage: true,
          createdAt: true,
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        ...userProfile,
        projects,
      });
    } else {
      // For investors, don't return specific stats to maintain privacy
      return res.status(200).json(userProfile);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update user profile
router.put("/me", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate request body
    const validationResult = userUpdateSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid user data",
        details: validationResult.error.format(),
      });
    }

    const data = validationResult.data;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        bio: true,
        profileImage: true,
        website: true,
        linkedin: true,
        twitter: true,
        openForContact: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// Create a new user (registration)
router.post("/", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = userSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid user data",
        details: validationResult.error.format(),
      });
    }

    const data = validationResult.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
        companyName: data.companyName,
        bio: data.bio,
        website: data.website,
        linkedin: data.linkedin,
        twitter: data.twitter,
        openForContact: data.openForContact ?? false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        bio: true,
        profileImage: true,
        website: true,
        linkedin: true,
        twitter: true,
        openForContact: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Toggle "open for contact" status
router.patch(
  "/me/contact-status",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { openForContact } = req.body;

      if (typeof openForContact !== "boolean") {
        return res.status(400).json({ error: "Invalid contact status value" });
      }

      // Update user contact status
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { openForContact },
        select: {
          id: true,
          openForContact: true,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating contact status:", error);
      res.status(500).json({ error: "Failed to update contact status" });
    }
  }
);

// Helper function to get founder stats
async function getFounderStats(userId: string) {
  const projects = await prisma.project.findMany({
    where: { founderUserId: userId },
    select: { id: true },
  });

  const projectIds = projects.map((p) => p.id);

  if (projectIds.length === 0) {
    return {
      projectCount: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
    };
  }

  const [
    totalViews,
    totalViewCount,
    totalLikes,
    totalComments,
    pendingContactRequests,
  ] = await Promise.all([
    // Count unique viewers
    prisma.projectView.groupBy({
      by: ["viewerId"],
      where: { projectId: { in: projectIds } },
    }),
    // Count total views
    prisma.projectView.aggregate({
      where: { projectId: { in: projectIds } },
      _sum: { viewCount: true },
    }),
    // Count likes
    prisma.projectLike.count({
      where: { projectId: { in: projectIds } },
    }),
    // Count comments
    prisma.comment.count({
      where: { projectId: { in: projectIds } },
    }),
    // Count pending contact requests
    prisma.contactRequest.count({
      where: {
        recipientId: userId,
        status: "pending",
      },
    }),
  ]);

  return {
    projectCount: projectIds.length,
    uniqueViewers: totalViews.length,
    totalViews: totalViewCount._sum.viewCount || 0,
    totalLikes,
    totalComments,
    pendingContactRequests,
  };
}

// Helper function to get investor stats
async function getInvestorStats(userId: string) {
  const [
    savedProjects,
    likedProjects,
    comments,
    sentContactRequests,
    acceptedContactRequests,
  ] = await Promise.all([
    // Count saved projects
    prisma.savedProject.count({
      where: { userId },
    }),
    // Count liked projects
    prisma.projectLike.count({
      where: { userId },
    }),
    // Count comments
    prisma.comment.count({
      where: { userId },
    }),
    // Count sent contact requests
    prisma.contactRequest.count({
      where: {
        senderId: userId,
        status: "pending",
      },
    }),
    // Count accepted contact requests
    prisma.contactRequest.count({
      where: {
        senderId: userId,
        status: "accepted",
      },
    }),
  ]);

  return {
    savedProjects,
    likedProjects,
    comments,
    sentContactRequests,
    acceptedContactRequests,
  };
}

export const userRouter = router;
