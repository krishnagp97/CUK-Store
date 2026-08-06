import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ably } from "@/lib/ably";

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { conversationId } = await req.json();

    const readAt = new Date();

    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: {
          not: session.user.id,
        },
        readAt: null,
      },
      data: {
        readAt,
      },
    });

    const channel = ably.channels.get(
      `conversation:${conversationId}`
    );

    await channel.publish("message-read", {
      conversationId,
      userId: session.user.id,
      readAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}