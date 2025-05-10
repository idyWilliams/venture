import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { sendNotification } from "../services/notification";

const router = Router();
const prisma = new PrismaClient();

// Get contact requests for a user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const contactRequests = await prisma.contactRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            companyName: true,
            profileImage: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            companyName: true,
            profileImage: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(contactRequests);
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    res.status(500).json({ error: "Failed to fetch contact requests" });
  }
});

// Create a contact request
router.post("/", async (req, res) => {
  try {
    const { recipientId, projectId, message } = req.body;
    const senderId = req.user.id;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, title: true, founderUserId: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if recipient is the project founder
    if (project.founderUserId !== recipientId) {
      return res.status(400).json({ error: "Invalid recipient" });
    }

    // Check if request already exists
    const existingRequest = await prisma.contactRequest.findFirst({
      where: {
        senderId,
        recipientId,
        projectId,
        status: { not: "rejected" },
      },
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Contact request already exists" });
    }

    // Create contact request
    const contactRequest = await prisma.contactRequest.create({
      data: {
        senderId,
        recipientId,
        projectId,
        message,
        status: "pending",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            companyName: true,
            profileImage: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Send notification to recipient
    await sendNotification({
      userId: recipientId,
      type: "contact_request",
      content: `${req.user.name} wants to connect about ${project.title}`,
      relatedId: projectId,
    });

    // Get the pusher instance
    const pusher = req.app.get("pusher");

    if (pusher) {
      // Broadcast to recipient's user channel
      pusher.trigger(`user-${recipientId}`, "new-contact-request", {
        request: contactRequest,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(201).json(contactRequest);
  } catch (error) {
    console.error("Error creating contact request:", error);
    res.status(500).json({ error: "Failed to create contact request" });
  }
});

// Update contact request status
router.patch("/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const request = await prisma.contactRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: "Contact request not found" });
    }

    if (request.recipientId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this request" });
    }

    const updatedRequest = await prisma.contactRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            companyName: true,
            profileImage: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            companyName: true,
            profileImage: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Send notification to sender
    await sendNotification({
      userId: request.sender.id,
      type: "contact_request_update",
      content: `Your contact request for ${request.project.title} was ${status}`,
      relatedId: request.project.id,
    });

    // Get the pusher instance
    const pusher = req.app.get("pusher");

    if (pusher) {
      // Broadcast to sender's user channel
      pusher.trigger(`user-${request.sender.id}`, "contact-request-update", {
        request: updatedRequest,
        timestamp: new Date().toISOString(),
      });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating contact request:", error);
    res.status(500).json({ error: "Failed to update contact request" });
  }
});

export default router;
