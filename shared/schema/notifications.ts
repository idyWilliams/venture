import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.string(), // You can further restrict this if you want
  content: z.string(),
  isRead: z.boolean(),
  relatedId: z.string().nullable().optional(),
  createdAt: z.date(),
});

export type Notification = z.infer<typeof NotificationSchema>;
