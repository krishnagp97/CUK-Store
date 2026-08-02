import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ChatWindow from "@/components/message/chatWindow";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function MessagePage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: {
        not: session.user.id,
      },
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      buyer: true,
      seller: true,
      product: true,
    },
  });

  if (!conversation) {
    notFound();
  }

  // Ensure only participants can access the chat
  if (
    conversation.buyerId !== session.user.id &&
    conversation.sellerId !== session.user.id
  ) {
    notFound();
  }

  return (
    <ChatWindow
      conversationId={conversation.id}
      initialMessages={conversation.messages}
      currentUserId={session.user.id}
    />
  );
}
