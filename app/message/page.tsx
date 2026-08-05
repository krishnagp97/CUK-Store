import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { MessageCircle } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

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

      messages: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          text: true,
          createdAt: true,
          senderId: true,
        },
      },

      _count: {
        select: {
          messages: {
            where: {
              isRead: false,
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

  const priceFormatter = new Intl.NumberFormat("en-IN");
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-4xl font-bold">Messages</h1>

        <p className="text-muted-foreground">
          Your conversations with buyers and sellers.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center rounded-lg border text-center">
          <MessageCircle className="mb-4 h-16 w-16 text-muted-foreground" />

          <h2 className="text-xl font-semibold">No conversations yet</h2>

          <p className="mt-2 text-muted-foreground">
            Start a conversation by contacting a seller.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => {
            const isSeller = conversation.sellerId === session.user.id;
            const otherUser =
              conversation.buyerId === session.user.id
                ? conversation.seller
                : conversation.buyer;

            const lastMessage = conversation.messages[0];

            const unreadCount = conversation._count.messages;
            const displayDate =
              lastMessage?.createdAt ?? conversation.updatedAt;

            return (
              <Link
                key={conversation.id}
                href={`/message/${conversation.id}`}
                className="group block"
              >
                <div
                  className={`
          flex gap-4 rounded-xl border p-4 transition
          hover:bg-muted hover:shadow-sm
          ${unreadCount > 0 ? "border-primary/40 bg-primary/5" : ""}}
        `}
                >
                  {/* User Avatar */}
                  <div className="shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold">
                      {otherUser.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  </div>

                  {/* Conversation Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold">
                        {otherUser.name ?? "Unknown User"}
                      </h2>
                      <span className="rounded bg-muted px-2 py-1 text-xs">
                        {isSeller ? "Buyer" : "Seller"}
                      </span>
                    </div>

                    {/* Product */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs">
                        {conversation.product.title}
                      </span>
                      <span
                        className={`text-xs rounded px-2 py-1 ${
                          conversation.product.status === "AVAILABLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {conversation.product.status}
                      </span>
                      <p className="text-sm font-medium">
                        ₹{priceFormatter.format(conversation.product.price)}
                      </p>
                    </div>

                    {/* Message preview */}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="max-w-45 truncate sm:max-w-55">
                        {lastMessage
                          ? `${
                              lastMessage.senderId === session.user.id
                                ? "You: "
                                : ""
                            }${lastMessage.text}`
                          : "No messages yet"}
                      </p>

                      <div className="flex items-center gap-2">
                        {lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(displayDate).toLocaleDateString([], {
                              day: "2-digit",
                              month: "short",
                            })}
                          </span>
                        )}

                        {unreadCount > 0 && (
                          <span
                            className="
      flex h-5 min-w-5 items-center justify-center
      rounded-full bg-blue-600 px-1.5
      text-xs font-medium text-white
      "
                          >
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted">
                    {conversation.product.images[0] && (
                      <Image
                        src={conversation.product.images[0].imageUrl}
                        alt={conversation.product.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
