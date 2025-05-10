import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const trackEngagement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Only track GET requests to project routes
    if (req.method !== "GET" || !req.params.projectId) {
      next();
      return;
    }

    const { projectId } = req.params;
    const userId = req.user?.id;

    // Skip tracking if no user is authenticated
    if (!userId) {
      next();
      return;
    }

    // Update or create project view
    await prisma.projectView.upsert({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      update: {
        viewCount: {
          increment: 1,
        },
        lastViewed: new Date(),
      },
      create: {
        userId,
        projectId,
        viewCount: 1,
        lastViewed: new Date(),
      },
    });

    next();
  } catch (error) {
    console.error("Error tracking engagement:", error);
    // Don't block the request if tracking fails
    next();
  }
};
