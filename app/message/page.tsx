import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { MessageCircle } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import MessageList from "@/components/message/messageList";

export default async function MessagesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <MessageCircle className="mb-4 h-16 w-16 text-muted-foreground" />

        <h1 className="text-2xl font-bold">Please sign in</h1>

        <p className="mt-2 text-muted-foreground">
          Login to view your messages.
        </p>

        <Button asChild className="mt-6">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          buyerId: session.user.id,
        },
        {
          sellerId: session.user.id,
        },
      ],
    },

    select: {
      id: true,
      buyerId: true,
      sellerId: true,
      updatedAt: true,

      lastMessage: true,
      lastMessageAt: true,
      lastSenderId: true,

      buyer: {
        select: {
          id: true,
          name: true,
        },
      },

      seller: {
        select: {
          id: true,
          name: true,
        },
      },

      product: {
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          images: {
            take: 1,
            select: {
              imageUrl: true,
            },
          },
        },
      },

      _count: {
        select: {
          messages: {
            where: {
              readAt: null,
              senderId: {
                not: session.user.id,
              },
            },
          },
        },
      },
    },

    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <MessageList
      initialConversations={conversations}
      currentUserId={session.user.id}
    />
  );
}
