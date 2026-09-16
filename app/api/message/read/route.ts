import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ably } from "@/lib/ably";
import { messageReadRateLimiter } from "@/lib/rate-limit";

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await messageReadRateLimiter.limit(session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: "Too many read requests. Please try again later." },
        { status: 429 },
      );
    }

    const { conversationId } = await req.json();

    const readAt = new Date();

    const result = await prisma.message.updateMany({
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

    if (result.count > 0) {
      const channel = ably.channels.get(`conversation:${conversationId}`);

      await channel.publish("message-read", {
        conversationId,
        userId: session.user.id,
        readAt,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
