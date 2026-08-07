import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ably } from "@/lib/ably";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { messageId } = await params;

    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        conversation: {
          select: {
            id: true,
            buyerId: true,
            sellerId: true,
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 },
      );
    }

    const isParticipant =
      message.conversation.buyerId === session.user.id ||
      message.conversation.sellerId === session.user.id;

    if (!isParticipant) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    // Only the receiver can mark a message as delivered
    if (message.senderId === session.user.id) {
      return NextResponse.json(
        { error: "Sender cannot mark message as delivered" },
        { status: 403 },
      );
    }

    // Already delivered
    if (message.deliveredAt) {
      return NextResponse.json({ success: true });
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        deliveredAt: new Date(),
      },
    });

    await ably.channels
      .get(`conversation:${message.conversation.id}`)
      .publish("message-delivered", {
        conversationId: message.conversation.id,
        messageId: updatedMessage.id,
        deliveredAt: updatedMessage.deliveredAt,
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark delivered error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}