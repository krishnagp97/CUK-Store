"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Prisma } from "@prisma/client";
import { useAbly } from "ably/react";
import Image from "next/image";
import { Check, CheckCheck, ArrowLeft } from "lucide-react";
import MessageInput from "./messageInput";
import Link from "next/link";

type MessageWithSender = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

type Props = {
  conversationId: string;
  initialMessages: MessageWithSender[];
  currentUserId: string;

  otherUser: {
    name: string | null;
  };

  product: {
    title: string;
    price: number;
    images: {
      imageUrl: string;
    }[];
  };
};

type DeliveredPayload = {
  messageId: string;
  deliveredAt: string;
};

type ReadPayload = {
  conversationId: string;
  readAt: string;
};

type TypingPayload = {
  userId: string;
  typing: boolean;
};

function sortByCreatedAt(messages: MessageWithSender[]) {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

function formatMessageDate(date: Date | string) {
  const messageDate = new Date(date);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(messageDate, today)) return "Today";
  if (isSameDay(messageDate, yesterday)) return "Yesterday";

  return messageDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ChatWindow({
  conversationId,
  initialMessages,
  currentUserId,
  otherUser,
  product,
}: Props) {
  const ably = useAbly();

  const channel = useMemo(
    () => ably.channels.get(`conversation:${conversationId}`),
    [ably, conversationId],
  );

  const [messages, setMessages] = useState<MessageWithSender[]>(
    sortByCreatedAt(initialMessages),
  );
  const [isOnline, setIsOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const previousMessageCount = useRef(messages.length);
  const loadingOlderRef = useRef(false);

  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showUnreadDividerState, setShowUnreadDividerState] = useState(false);
  const [unreadDividerIndex, setUnreadDividerIndex] = useState<number | null>(
    null,
  );

  const loadOlderMessages = async () => {
    if (loadingOlder || !hasMore || messages.length === 0) return;
    const container = messagesContainerRef.current;

    if (!container) return;

    const previousScrollHeight = container.scrollHeight;

    setLoadingOlder(true);
    loadingOlderRef.current = true;

    try {
      const oldestMessage = messages[0];

      const res = await fetch(
        `/api/message/conversation/${conversationId}?cursor=${oldestMessage.id}`,
      );

      if (!res.ok) {
        throw new Error("Failed to load older messages");
      }

      const data = await res.json();

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));

        const olderMessages = data.messages.filter(
          (m: MessageWithSender) => !existingIds.has(m.id),
        );

        return [...olderMessages, ...prev];
      });
      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;

        if (!container) return;

        const newScrollHeight = container.scrollHeight;

        container.scrollTop += newScrollHeight - previousScrollHeight;
      });
      setHasMore(data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOlder(false);
    }
  };

  // Auto scroll
  useEffect(() => {
    if (loadingOlderRef.current) {
      loadingOlderRef.current = false;
      previousMessageCount.current = messages.length;
      return;
    }

    if (messages.length > previousMessageCount.current) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }

    previousMessageCount.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        const unreadIndex = messages.findIndex(
          (msg) => msg.sender.id !== currentUserId && !msg.readAt,
        );

        if (unreadIndex !== -1) {
          setUnreadDividerIndex(unreadIndex);
          setShowUnreadDividerState(true);

          setTimeout(() => {
            setShowUnreadDividerState(false);
            setUnreadDividerIndex(null);
          }, 3000);
        }

        const res = await fetch("/api/message/read", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId,
          }),
        });

        if (!res.ok) {
          console.error("Failed to mark conversation as read", res.status);
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender.id !== currentUserId
              ? {
                  ...msg,
                  readAt: new Date(),
                }
              : msg,
          ),
        );
      } catch (err) {
        console.error("Error marking conversation as read", err);
      }
    };

    markAsRead();
  }, [conversationId, currentUserId]);

  // Ably realtime messages
  useEffect(() => {
    const listener = async (message: any) => {
      const newMessage = message.data as MessageWithSender;

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMessage.id)) {
          return prev;
        }

        return sortByCreatedAt([...prev, newMessage]);
      });

      if (newMessage.sender.id !== currentUserId) {
        try {
          // Mark as delivered
          const deliveredRes = await fetch(
            `/api/message/${newMessage.id}/delivered`,
            {
              method: "PATCH",
            },
          );

          if (!deliveredRes.ok) {
            console.error(
              "Failed to mark message as delivered",
              deliveredRes.status,
            );
          }

          // Since this chat is open, immediately mark as read
          const readRes = await fetch("/api/message/read", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              conversationId,
            }),
          });

          if (!readRes.ok) {
            console.error("Failed to mark message as read", readRes.status);
          }
        } catch (err) {
          console.error("Error updating delivered/read status", err);
        }
      }
    };

    channel.subscribe("message", listener);

    return () => {
      channel.unsubscribe("message", listener);
    };
  }, [channel, conversationId, currentUserId]);

  useEffect(() => {
    const listener = (message: any) => {
      const { messageId, deliveredAt } = message.data as DeliveredPayload;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                deliveredAt: new Date(deliveredAt),
              }
            : msg,
        ),
      );
    };

    channel.subscribe("message-delivered", listener);

    return () => {
      channel.unsubscribe("message-delivered", listener);
    };
  }, [channel]);

  useEffect(() => {
    const listener = (message: any) => {
      const { conversationId: eventConversationId, readAt } =
        message.data as ReadPayload;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.conversationId === eventConversationId &&
          msg.sender.id === currentUserId
            ? {
                ...msg,
                readAt: new Date(readAt),
              }
            : msg,
        ),
      );
    };

    channel.subscribe("message-read", listener);

    return () => {
      channel.unsubscribe("message-read", listener);
    };
  }, [channel, currentUserId]);

  useEffect(() => {
    const presenceListener = (msg: any) => {
      if (msg.clientId === currentUserId) return;

      if (msg.action === "enter") {
        setIsOnline(true);
      }

      if (msg.action === "leave" || msg.action === "absent") {
        setIsOnline(false);
      }
    };

    const initPresence = async () => {
      channel.presence.subscribe(presenceListener);

      await channel.presence.enter();

      const members = await channel.presence.get();
      setIsOnline(members.some((member) => member.clientId !== currentUserId));
    };

    initPresence();

    return () => {
      channel.presence.unsubscribe(presenceListener);
      channel.presence.leave();
    };
  }, [channel, currentUserId]);

  useEffect(() => {
    const listener = (message: any) => {
      const data = message.data as TypingPayload;

      if (data.userId === currentUserId) return;

      setIsTyping(data.typing);
    };

    channel.subscribe("typing", listener);

    return () => {
      channel.unsubscribe("typing", listener);
    };
  }, [channel, currentUserId]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop <= 20 && !loadingOlder && hasMore) {
        loadOlderMessages();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [loadingOlder, hasMore]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#E5E5EF] bg-white">
      {/* Header */}
      <div className="relative flex items-center gap-2 border-b border-[#E5E5EF] p-3 sm:gap-3 sm:p-4">
        {/* Back button */}
        <Link
          href="/message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#1A1A2E]/60 transition-colors hover:bg-[#F7F7FB] hover:text-[#6C5CE7]"
          aria-label="Back to messages"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* User avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/10 font-semibold text-[#6C5CE7] sm:h-10 sm:w-10">
          {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* User + Product */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-[#1A1A2E]">
            {otherUser.name ?? "User"}
          </h2>

          <p className="truncate text-xs text-[#1A1A2E]/50 sm:text-sm">
            Regarding: {product.title}
          </p>

          <p className="text-xs font-medium text-[#1A1A2E] sm:text-sm">
            ₹{new Intl.NumberFormat("en-IN").format(product.price)}
          </p>
        </div>

        {/* Center Status */}
        <div className="absolute left-1/2 top-3 hidden -translate-x-1/2 sm:block">
          <p className="text-sm font-medium">
            {isTyping ? (
              <span className="text-[#6C5CE7]">typing...</span>
            ) : isOnline ? (
              <span className="text-green-600">● Online</span>
            ) : (
              <span className="text-[#1A1A2E]/40">Offline</span>
            )}
          </p>
        </div>

        {/* Product image */}
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#F7F7FB] sm:h-12 sm:w-12">
          {product.images[0] && (
            <Image
              src={product.images[0].imageUrl}
              alt={product.title}
              fill
              sizes="48px"
              className="object-cover"
            />
          )}
        </div>
      </div>
      {/* Mobile-only status row, since center status is hidden on small screens */}
      <div className="border-b border-[#E5E5EF] px-3 py-1.5 sm:hidden">
        <p className="text-xs font-medium">
          {isTyping ? (
            <span className="text-[#6C5CE7]">typing...</span>
          ) : isOnline ? (
            <span className="text-green-600">● Online</span>
          ) : (
            <span className="text-[#1A1A2E]/40">Offline</span>
          )}
        </p>
      </div>
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain space-y-2.5 bg-[#F7F7FB] p-3 sm:space-y-3 sm:p-4"
      >
        {messages.length === 0 ? (
          <p className="text-center text-sm text-[#1A1A2E]/50">
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map((msg, index) => {
            const mine = msg.sender.id === currentUserId;

            const previousMessage = index > 0 ? messages[index - 1] : null;

            const showDate =
              !previousMessage ||
              new Date(previousMessage.createdAt).toDateString() !==
                new Date(msg.createdAt).toDateString();

            const showDivider =
              showUnreadDividerState && index === unreadDividerIndex;

            return (
              <div key={msg.id}>
                {showDivider && (
                  <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#E5E5EF]" />

                    <span className="rounded-full bg-[#6C5CE7] px-3 py-1 text-xs font-medium text-white shadow-sm shadow-[#6C5CE7]/30">
                      Unread messages
                    </span>

                    <div className="h-px flex-1 bg-[#E5E5EF]" />
                  </div>
                )}
                {showDate && (
                  <div className="sticky top-2 z-10 my-4 flex justify-center">
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-[#1A1A2E]/50 shadow-sm">
                      {formatMessageDate(msg.createdAt)}
                    </span>
                  </div>
                )}

                <div
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                    max-w-[80%] rounded-2xl px-3.5 py-2 sm:max-w-[75%] sm:px-4
                    ${mine ? "bg-linear-to-br from-[#6C5CE7] to-[#8B7CF6] text-white" : "bg-white text-[#1A1A2E] shadow-sm"}
                  `}
                  >
                    <p className="text-sm">{msg.text}</p>

                    <div
                      className={`
                      mt-1 flex items-center justify-end gap-1 text-[11px]
                      ${mine ? "text-white/70" : "text-[#1A1A2E]/40"}
                    `}
                    >
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {mine &&
                        (msg.readAt ? (
                          <CheckCheck className="h-3.5 w-3.5 text-cyan-300" />
                        ) : msg.deliveredAt ? (
                          <CheckCheck className="h-3 w-3 text-white/60" />
                        ) : (
                          <Check className="h-3 w-3 text-white/60" />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} className="h-1 scroll-mb-4" />
      </div>
      {/* Input */}
      <MessageInput
        conversationId={conversationId}
        currentUserId={currentUserId}
      />
    </div>
  );
}
