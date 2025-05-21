import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/src/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { z } from 'zod';
import { moderateContent } from '@/src/lib/openai';

// Schema validation for comments
const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  projectId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
});

// Schema for moderation endpoint
const moderationSchema = z.object({
  content: z.string().min(1),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // POST moderate content
  if (req.method === 'POST' && req.url?.includes('/moderate')) {
    try {
      const validationResult = moderationSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Invalid data',
          details: validationResult.error.format()
        });
      }

      const { content } = validationResult.data;

      // Call OpenAI moderation API
      const moderationResult = await moderateContent(content);

      // Extract flagged categories with high scores
      const flaggedReasons: string[] = [];

      if (moderationResult.isFlagged) {
        Object.entries(moderationResult.categories).forEach(([category, isFlagged]) => {
          if (isFlagged) {
            // Format the category name nicely
            const formattedCategory = category
              .replace(/([A-Z])/g, ' $1')
              .replace(/-/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');

            flaggedReasons.push(formattedCategory);
          }
        });
      }

      return res.status(200).json({
        isFlagged: moderationResult.isFlagged,
        reasons: flaggedReasons,
        categories: moderationResult.categories,
        scores: moderationResult.scores,
      });
    } catch (error) {
      console.error('Error moderating content:', error);
      return res.status(500).json({ error: 'Failed to moderate content' });
    }
  }

  // GET comments for a project
  if (req.method === 'GET') {
    try {
      const { projectId } = req.query;

      if (!projectId || typeof projectId !== 'string') {
        return res.status(400).json({ error: 'Invalid project ID' });
      }

      // Fetch top-level comments with replies
      const comments = await prisma.comment.findMany({
        where: {
          projectId,
          parentId: null, // Only top-level comments
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              role: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  profileImage: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  // POST create a new comment
  if (req.method === 'POST' && !req.url?.includes('/moderate')) {
    try {
      //@ts-ignore
      const userId = session.user.id;

      // Validate request body
      const validationResult = commentSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Invalid comment data',
          details: validationResult.error.format()
        });
      }

      const data = validationResult.data;

      // Verify the project exists
      const project = await prisma.project.findUnique({
        where: { id: data.projectId },
        select: { id: true, founderUserId: true, title: true },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // If it's a reply, verify the parent comment exists
      if (data.parentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: data.parentId },
          select: { id: true, userId: true },
        });

        if (!parentComment) {
          return res.status(404).json({ error: 'Parent comment not found' });
        }
      }

      // Moderate the content
      const moderationResult = await moderateContent(data.content);

      if (moderationResult.isFlagged) {
        return res.status(400).json({
          error: 'Comment contains inappropriate content',
          moderationResult,
        });
      }

      // Create comment
      const comment = await prisma.comment.create({
        data: {
          content: data.content,
          userId,
          projectId: data.projectId,
          parentId: data.parentId || null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              role: true,
            },
          },
        },
      });

      // Create notification for the project owner or comment author if it's a reply
      if (data.parentId) {
        // Get parent comment author
        const parentComment = await prisma.comment.findUnique({
          where: { id: data.parentId },
          select: { userId: true },
        });

        if (parentComment && parentComment.userId !== userId) {
          // Create notification for parent comment author
          const commenter = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
          });

          await prisma.notification.create({
            data: {
              userId: parentComment.userId,
              type: 'comment',
              content: `${commenter?.name || 'Someone'} replied to your comment on ${project.title}`,
              relatedId: data.projectId,
            },
          });
        }
      } else if (project.founderUserId !== userId) {
        // Create notification for project owner
        const commenter = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });

        await prisma.notification.create({
          data: {
            userId: project.founderUserId,
            type: 'comment',
            content: `${commenter?.name || 'Someone'} commented on your ${project.title} project`,
            relatedId: data.projectId,
          },
        });
      }

      return res.status(201).json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: 'Failed to create comment' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
