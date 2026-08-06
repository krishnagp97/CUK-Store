import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const PAGE_SIZE = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;

  const cursor = request.nextUrl.searchParams.get("cursor");

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { buyerId: session.user.id },
        { sellerId: session.user.id },
      ],
    },
    select: {
      id: true,
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: PAGE_SIZE,
    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1,
    }),
    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json({
    messages: messages.reverse(),
    hasMore: messages.length === PAGE_SIZE,
  });
}