"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Prisma } from "@prisma/client";
import { useAbly } from "ably/react";
import Image from "next/image";
import { Check, CheckCheck } from "lucide-react";
import MessageInput from "./messageInput";

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

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const markAsRead = async () => {
      try {
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
      } catch (err) {
        console.error("Error marking conversation as read", err);
      }
    };

    markAsRead();
  }, [conversationId]);

  // Ably realtime messages
  useEffect(() => {
    const listener = async (message: any) => {
      const newMessage = message.data as MessageWithSender;

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMessage.id)) {
          return prev;
        }

        // Insert in chronological order rather than assuming messages
        // always arrive in order.
        return sortByCreatedAt([...prev, newMessage]);
      });

      if (newMessage.sender.id !== currentUserId) {
        try {
          // Mark as delivered
          const deliveredRes = await fetch(
            `/api/message/${newMessage.id}/delivered`,
            { method: "PATCH" },
          );
          if (!deliveredRes.ok) {
            console.error(
              "Failed to mark message as delivered",
              deliveredRes.status,
            );
          }

          // Since this chat is currently open,
          // immediately mark the message as read.
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

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col rounded-lg border">
      {/* Header */}
      <div className="relative flex items-center gap-3 border-b p-4">
        {/* User avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold">
          {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* User + Product */}
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{otherUser.name ?? "User"}</h2>

          <p className="truncate text-sm text-muted-foreground">
            Regarding: {product.title}
          </p>

          <p className="text-sm font-medium">
            ₹{new Intl.NumberFormat("en-IN").format(product.price)}
          </p>
        </div>

        {/* Center Status */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <p className="text-sm font-medium">
            {isTyping ? (
              <span className="text-blue-600">typing...</span>
            ) : isOnline ? (
              <span className="text-green-600">● Online</span>
            ) : (
              <span className="text-muted-foreground">Offline</span>
            )}
          </p>
        </div>

        {/* Product image */}
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
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

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
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

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="sticky top-2 z-10 my-4 flex justify-center">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground shadow-sm">
                      {formatMessageDate(msg.createdAt)}
                    </span>
                  </div>
                )}

                <div
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                    max-w-[75%] rounded-2xl px-4 py-2
                    ${mine ? "bg-primary text-primary-foreground" : "bg-gray-200 dark:bg-gray-700"}
                  `}
                  >
                    <p className="text-sm">{msg.text}</p>

                    <div
                      className={`
                      mt-1 flex items-center justify-end gap-1 text-[11px]
                      ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}
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
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        ) : msg.deliveredAt ? (
                          <CheckCheck className="h-3 w-3 text-gray-400" />
                        ) : (
                          <Check className="h-3 w-3 text-gray-400" />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3">
        <MessageInput
          conversationId={conversationId}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
