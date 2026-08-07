import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ably } from "@/lib/ably";

const MAX_MESSAGE_LENGTH = 1000;

export async function POST(req: Request) {
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

    const { conversationId, text } = await req.json();

    const trimmedText = text?.trim();

    if (!conversationId || !trimmedText) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 },
      );
    }

    if (trimmedText.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
        },
        { status: 400 },
      );
    }


    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });


    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }


    if (
      conversation.buyerId !== session.user.id &&
      conversation.sellerId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }


    const message = await prisma.$transaction(async (tx) => {
      const createdMessage = await tx.message.create({
        data: {
          text: trimmedText,
          senderId: session.user.id,
          conversationId,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });


      await tx.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessage: createdMessage.text,
          lastMessageAt: createdMessage.createdAt,
          lastSenderId: createdMessage.senderId,
          updatedAt: new Date(),
        },
      });


      return createdMessage;
    });



    // Realtime updates
    try {
      const payload = {
        conversationId,
        message,
      };


      await Promise.all([
        // Update chat window
        ably.channels
          .get(`conversation:${conversationId}`)
          .publish("message", message),


        // Update buyer message list
        ably.channels
          .get(`user:${conversation.buyerId}`)
          .publish(
            "conversation-updated",
            payload,
          ),


        // Update seller message list
        ably.channels
          .get(`user:${conversation.sellerId}`)
          .publish(
            "conversation-updated",
            payload,
          ),
      ]);

    } catch (error) {
      console.error(
        "Ably publish failed:",
        error,
      );
    }


    return NextResponse.json(message);

  } catch (error) {
    console.error(
      "Send message error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}