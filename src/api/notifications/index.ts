import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/src/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';

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

  // GET notifications for the current user
  if (req.method === 'GET') {
    try {
      const { limit = '10', offset = '0', unreadOnly = 'false' } = req.query;

      const where = {
        userId,
        ...(unreadOnly === 'true' ? { isRead: false } : {}),
      };

      const [notifications, totalCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: parseInt(limit as string),
          skip: parseInt(offset as string),
        }),
        prisma.notification.count({ where }),
      ]);

      const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false },
      });

      return res.status(200).json({
        notifications,
        totalCount,
        unreadCount,
        hasMore: parseInt(offset as string) + parseInt(limit as string) < totalCount,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  // PATCH mark notifications as read
  if (req.method === 'PATCH') {
    try {
      const { id, all = false } = req.body;

      if (all) {
        // Mark all notifications as read
        await prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
        });

        return res.status(200).json({ success: true, message: 'All notifications marked as read' });
      } else if (id) {
        // Mark specific notification as read
        if (typeof id === 'string') {
          // Single ID
          await prisma.notification.updateMany({
            where: { id, userId }, // Ensure the notification belongs to the user
            data: { isRead: true },
          });
        } else if (Array.isArray(id)) {
          // Array of IDs
          await prisma.notification.updateMany({
            where: { id: { in: id }, userId }, // Ensure the notifications belong to the user
            data: { isRead: true },
          });
        } else {
          return res.status(400).json({ error: 'Invalid notification ID format' });
        }

        return res.status(200).json({ success: true, message: 'Notification(s) marked as read' });
      } else {
        return res.status(400).json({ error: 'Missing notification ID or "all" parameter' });
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
  }

  // DELETE notification
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Missing notification ID' });
      }

      // Delete specific notification
      if (typeof id === 'string') {
        // Single ID
        await prisma.notification.deleteMany({
          where: { id, userId }, // Ensure the notification belongs to the user
        });
      } else {
        // Array of IDs
        await prisma.notification.deleteMany({
          where: { id: { in: id }, userId }, // Ensure the notifications belong to the user
        });
      }

      return res.status(200).json({ success: true, message: 'Notification(s) deleted' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      return res.status(500).json({ error: 'Failed to delete notification' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
