"use client";

import { Prisma } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useAbly } from "ably/react";

type Conversation = Prisma.ConversationGetPayload<{
  select: {
    id: true;
    buyerId: true;
    sellerId: true;
    updatedAt: true;

    lastMessage: true;
    lastMessageAt: true;
    lastSenderId: true;

    buyer: {
      select: {
        id: true;
        name: true;
      };
    };

    seller: {
      select: {
        id: true;
        name: true;
      };
    };

    product: {
      select: {
        id: true;
        title: true;
        price: true;
        status: true;
        images: {
          select: {
            imageUrl: true;
          };
        };
      };
    };

    _count: {
      select: {
        messages: true;
      };
    };
  };
}>;

type Props = {
  initialConversations: Conversation[];
  currentUserId: string;
};

export default function MessageList({
  initialConversations,
  currentUserId,
}: Props) {
  const [conversations, setConversations] = useState(initialConversations);
  const ably = useAbly();

  const channel = useMemo(
    () => ably.channels.get(`user:${currentUserId}`),
    [ably, currentUserId],
  );

useEffect(() => {
  const listener = (msg: any) => {
    const { conversationId, message } = msg.data;

    setConversations((prev) => {
      const updated = prev.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        return {
          ...conversation,
          updatedAt: new Date(message.createdAt),
          lastMessage: message.text,
          lastMessageAt: message.createdAt,
          lastSenderId: message.sender.id,
          _count: {
            messages:
              message.sender.id === currentUserId
                ? conversation._count.messages
                : conversation._count.messages + 1,
          },
        };
      });

      updated.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),
      );

      return updated;
    });
  };

  channel.subscribe("conversation-updated", listener);

  return () => {
    channel.unsubscribe("conversation-updated", listener);
  };
}, [channel, currentUserId]);

  const priceFormatter = new Intl.NumberFormat("en-IN");
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#1A1A2E] sm:text-4xl">Messages</h1>

        <p className="mt-1 text-sm text-[#1A1A2E]/50 sm:text-base">
          Your conversations with buyers and sellers.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E5EF] px-4 text-center sm:h-80">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6C5CE7]/10">
            <MessageCircle className="h-7 w-7 text-[#6C5CE7]" />
          </div>

          <h2 className="text-lg font-semibold text-[#1A1A2E] sm:text-xl">No conversations yet</h2>

          <p className="mt-2 text-sm text-[#1A1A2E]/50 sm:text-base">
            Start a conversation by contacting a seller.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {conversations.map((conversation) => {
            const isSeller = conversation.sellerId === currentUserId;
            const otherUser =
              conversation.buyerId === currentUserId
                ? conversation.seller
                : conversation.buyer;

            const lastMessage = conversation.lastMessage;
            const lastMessageAt = conversation.lastMessageAt;
            const lastSenderId = conversation.lastSenderId;
            const unreadCount = conversation._count.messages;
            const displayDate = lastMessageAt ?? conversation.updatedAt;

            return (
              <Link
                key={conversation.id}
                href={`/message/${conversation.id}`}
                className="group block"
              >
                <div
                  className={`
          flex gap-3 rounded-2xl border border-[#E5E5EF] p-3 transition-all duration-200
          hover:border-[#6C5CE7]/30 hover:bg-[#6C5CE7]/3 hover:shadow-sm
          active:scale-[0.99]
          sm:gap-4 sm:p-4
          ${unreadCount > 0 ? "border-[#6C5CE7]/40 bg-[#6C5CE7]/5" : ""}
        `}
                >
                  {/* User Avatar */}
                  <div className="shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6C5CE7]/10 font-semibold text-[#6C5CE7] sm:h-12 sm:w-12">
                      {otherUser.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  </div>

                  {/* Conversation Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="truncate font-semibold text-[#1A1A2E]">
                        {otherUser.name ?? "Unknown User"}
                      </h2>
                      <span className="shrink-0 rounded-full bg-[#F7F7FB] px-2 py-1 text-[10px] font-medium text-[#1A1A2E]/60 sm:text-xs">
                        {isSeller ? "Buyer" : "Seller"}
                      </span>
                    </div>

                    {/* Product */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:mt-2 sm:gap-2">
                      <span className="rounded-full bg-[#F7F7FB] px-2 py-0.5 text-[10px] text-[#1A1A2E]/60 sm:px-2 sm:py-1 sm:text-xs">
                        {conversation.product.title}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] sm:py-1 sm:text-xs ${
                          conversation.product.status === "AVAILABLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {conversation.product.status}
                      </span>
                      <p className="text-xs font-medium text-[#1A1A2E] sm:text-sm">
                        ₹{priceFormatter.format(conversation.product.price)}
                      </p>
                    </div>

                    {/* Message preview */}
                    <div className="mt-1.5 flex items-center justify-between gap-2 sm:mt-2">
                      <p className="max-w-40 truncate text-sm text-[#1A1A2E]/60 sm:max-w-55">
                        {lastMessage
                          ? `${lastSenderId === currentUserId ? "You: " : ""}${lastMessage}`
                          : "No messages yet"}
                      </p>

                      <div className="flex shrink-0 items-center gap-2">
                        {lastMessageAt && (
                          <span className="text-[10px] text-[#1A1A2E]/40 sm:text-xs">
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
      rounded-full bg-linear-to-r from-[#6C5CE7] to-[#8B7CF6] px-1.5
      text-[10px] font-medium text-white shadow-sm shadow-[#6C5CE7]/30 sm:text-xs
      "
                          >
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7F7FB] sm:h-14 sm:w-14">
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