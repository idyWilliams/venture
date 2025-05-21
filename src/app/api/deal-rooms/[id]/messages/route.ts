import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/src/lib/services/dealRoomService";

// POST /api/deal-rooms/[id]/messages - Send a message in the deal room
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise to get the actual values
    const { id: dealRoomId } = await params;
    const { content, userId, userName, userRole, attachments } =
      await req.json();

    if (!dealRoomId || !content || !userId || !userName || !userRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send message
    const message = await sendMessage(
      dealRoomId,
      userId,
      userName,
      userRole as "founder" | "investor",
      content,
      attachments
    );

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
