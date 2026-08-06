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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = await params;

    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        deliveredAt: new Date(),
      },
      include: {
        conversation: {
          select: {
            id: true,
          },
        },
      },
    });
    const channel = ably.channels.get(
      `conversation:${updatedMessage.conversation.id}`,
    );

    await channel.publish("message-delivered", {
      messageId: updatedMessage.id,
      deliveredAt: updatedMessage.deliveredAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
