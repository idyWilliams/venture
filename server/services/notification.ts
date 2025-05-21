import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface NotificationData {
  userId: string;
  type: string;
  content: string;
  relatedId?: string;
}

export async function sendNotification(data: NotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        content: data.content,
        relatedId: data.relatedId,
        //@ts-ignore
        read: false,
      },
    });

    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
