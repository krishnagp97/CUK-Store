import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function MessagesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold">Please sign in</h1>
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
        { buyerId: session.user.id },
        { sellerId: session.user.id },
      ],
    },
    include: {
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
          title: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          senderId: true,
          isRead: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Messages</h1>

      {conversations.length === 0 ? (
        <p className="text-muted-foreground">
          No conversations yet.
        </p>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => {
            const otherUser =
              conversation.buyerId === session.user.id
                ? conversation.seller
                : conversation.buyer;

            const lastMessage = conversation.messages[0];

            const unreadCount = conversation.messages.filter(
              (message) =>
                !message.isRead &&
                message.senderId !== session.user.id
            ).length;

            return (
              <Link
                key={conversation.id}
                href={`/message/${conversation.id}`}
                className={`block rounded-lg border p-4 transition hover:bg-muted ${
                  unreadCount > 0
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">
                      {otherUser.name ?? "Unknown User"}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Product: {conversation.product.title}
                    </div>
                  </div>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div className="mt-3 truncate text-sm text-gray-700">
                  {lastMessage
                    ? lastMessage.text
                    : "No messages yet"}
                </div>

                {lastMessage && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(
                      lastMessage.createdAt
                    ).toLocaleString()}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}