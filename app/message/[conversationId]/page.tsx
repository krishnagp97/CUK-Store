
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
    redirect("/sign-in");
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        {
          buyerId: session.user.id,
        },
        {
          sellerId: session.user.id,
        },
      ],
    },
    include: {
      messages: {
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },

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
          images: {
            take: 1,
            select: {
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

return (
  <div className="h-[calc(100dvh-64px)] overflow-hidden">
    <ChatWindow
      conversationId={conversation.id}
      initialMessages={conversation.messages}
      currentUserId={session.user.id}
      otherUser={
        conversation.buyerId === session.user.id
          ? conversation.seller
          : conversation.buyer
      }
      product={conversation.product}
    />
  </div>
);
}

