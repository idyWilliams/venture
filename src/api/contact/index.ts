import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { moderateContent } from '@/lib/openai';

// Schema validation for contact requests
const contactRequestSchema = z.object({
  recipientId: z.string().uuid(),
  message: z.string().min(20).max(1000),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  // GET contact requests for the user
  if (req.method === 'GET') {
    try {
      const { status, role } = req.query;
      
      let where: any = {};
      
      // Filter by status if provided
      if (status && ['pending', 'accepted', 'rejected'].includes(status as string)) {
        where.status = status;
      }
      
      // Filter by role (sent or received)
      if (role === 'sender') {
        where.senderId = userId;
      } else if (role === 'recipient') {
        where.recipientId = userId;
      } else {
        // Default: get both sent and received
        where.OR = [
          { senderId: userId },
          { recipientId: userId },
        ];
      }

      const contactRequests = await prisma.contactRequest.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              role: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(contactRequests);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      return res.status(500).json({ error: 'Failed to fetch contact requests' });
    }
  }

  // POST create a new contact request
  if (req.method === 'POST') {
    try {
      // Validate request body
      const validationResult = contactRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid contact request data', 
          details: validationResult.error.format() 
        });
      }

      const data = validationResult.data;
      
      // Check if the recipient exists
      const recipient = await prisma.user.findUnique({
        where: { id: data.recipientId },
        select: { id: true, openForContact: true, role: true },
      });

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      // Check if the recipient is open for contact
      if (!recipient.openForContact) {
        return res.status(403).json({ error: 'Recipient is not open for contact' });
      }
      
      // Verify sender is an investor if recipient is a founder, or vice versa
      const sender = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      
      if (!sender) {
        return res.status(404).json({ error: 'Sender not found' });
      }

      if (
        (sender.role === 'FOUNDER' && recipient.role === 'FOUNDER') ||
        (sender.role === 'INVESTOR' && recipient.role === 'INVESTOR')
      ) {
        return res.status(403).json({ 
          error: `Contact requests can only be sent between founders and investors, not between two ${sender.role.toLowerCase()}s` 
        });
      }

      // Check for existing contact request
      const existingRequest = await prisma.contactRequest.findFirst({
        where: {
          senderId: userId,
          recipientId: data.recipientId,
          status: { in: ['pending', 'accepted'] },
        },
      });

      if (existingRequest) {
        return res.status(400).json({ 
          error: 'A contact request already exists between these users',
          existingRequest,
        });
      }

      // Moderate the message content
      const moderationResult = await moderateContent(data.message);
      
      if (moderationResult.isFlagged) {
        return res.status(400).json({ 
          error: 'Message contains inappropriate content', 
          moderationResult,
        });
      }

      // Create contact request
      const contactRequest = await prisma.contactRequest.create({
        data: {
          senderId: userId,
          recipientId: data.recipientId,
          message: data.message,
          status: 'pending',
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              role: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              role: true,
            },
          },
        },
      });

      // Create notification for recipient
      await prisma.notification.create({
        data: {
          userId: data.recipientId,
          type: 'contact_request',
          content: `${contactRequest.sender.name} has requested to contact you`,
          relatedId: contactRequest.id,
        },
      });

      return res.status(201).json(contactRequest);
    } catch (error) {
      console.error('Error creating contact request:', error);
      return res.status(500).json({ error: 'Failed to create contact request' });
    }
  }

  // PATCH update contact request status
  if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid contact request ID' });
      }

      const { status } = req.body;
      
      if (!status || !['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be "accepted" or "rejected"' });
      }

      // Verify the contact request exists and the user is the recipient
      const contactRequest = await prisma.contactRequest.findUnique({
        where: { id },
        select: { id: true, recipientId: true, senderId: true, status: true },
      });

      if (!contactRequest) {
        return res.status(404).json({ error: 'Contact request not found' });
      }

      if (contactRequest.recipientId !== userId) {
        return res.status(403).json({ error: 'You do not have permission to update this contact request' });
      }

      if (contactRequest.status !== 'pending') {
        return res.status(400).json({ error: 'This contact request has already been processed' });
      }

      // Update contact request
      const updatedContactRequest = await prisma.contactRequest.update({
        where: { id },
        data: { status },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              role: true,
            },
          },
          recipient: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              role: true,
            },
          },
        },
      });

      // Create notification for sender
      await prisma.notification.create({
        data: {
          userId: contactRequest.senderId,
          type: 'contact_request',
          content: `${updatedContactRequest.recipient.name} has ${status} your contact request`,
          relatedId: contactRequest.id,
        },
      });

      return res.status(200).json(updatedContactRequest);
    } catch (error) {
      console.error('Error updating contact request:', error);
      return res.status(500).json({ error: 'Failed to update contact request' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
