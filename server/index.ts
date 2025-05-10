import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import Pusher from "pusher";
import projectRoutes from "./routes/projects";
import userRoutes from "./routes/users";
import engagementRoutes from "./routes/engagement";
import commentRoutes from "./routes/comments";
import contactRoutes from "./routes/contact";
import notificationRoutes from "./routes/notifications";
import { authMiddleware } from "./middleware/auth";
import { trackEngagement } from "./middleware/engagement";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "us2",
  useTLS: true,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/projects", authMiddleware, trackEngagement, projectRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/engagement", authMiddleware, engagementRoutes);
app.use("/api/comments", authMiddleware, commentRoutes);
app.use("/api/contact", authMiddleware, contactRoutes);
app.use("/api/notifications", authMiddleware, notificationRoutes);

// Socket.io setup
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  const userId = socket.handshake.auth.userId;
  if (userId) {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their personal room`);
  }

  // Handle joining community rooms
  socket.on("join_room", ({ room }) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  // Handle leaving rooms
  socket.on("leave_room", ({ room }) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room: ${room}`);
  });

  // Handle community messages
  socket.on("community_message", async ({ room, message }) => {
    if (!userId) return;

    try {
      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, role: true },
      });

      if (!user) return;

      // Extract project ID from room name (format: "community-{projectId}")
      const projectId = room.replace("community-", "");

      // Store message in database (optional)
      // await prisma.communityPost.create({
      //   data: {
      //     content: message,
      //     userId,
      //     projectId,
      //   }
      // });

      // Broadcast to all sockets in the room
      io.to(room).emit("community_message", {
        userId,
        userName: user.name,
        userRole: user.role,
        message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error handling community message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make Pusher and Socket.io available to routes
app.set("pusher", pusher);
app.set("io", io);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Start server
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Server closed");
    process.exit(0);
  });
});

export { app, io, pusher };
