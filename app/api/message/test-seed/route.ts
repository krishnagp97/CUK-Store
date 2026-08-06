import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { conversationId, senderId } = await req.json();

  if (!conversationId || !senderId) {
    return NextResponse.json(
      { error: "conversationId and senderId are required" },
      { status: 400 }
    );
  }

  const messages = Array.from({ length: 100 }, (_, i) => ({
    conversationId,
    senderId,
    text: `Test message ${i + 1}`,
    createdAt: new Date(Date.now() - (100 - i) * 60 * 1000), // 1 minute apart
  }));

  await prisma.message.createMany({
    data: messages,
  });

  return NextResponse.json({
    success: true,
    inserted: messages.length,
  });
}