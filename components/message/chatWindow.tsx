"use client";

import { useEffect, useRef, useState } from "react";
import { Prisma } from "@prisma/client";
import { useAbly } from "ably/react";

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
};

export default function ChatWindow({
  conversationId,
  initialMessages,
  currentUserId,
}: Props) {
  const ably = useAbly();

  const [messages, setMessages] =
    useState<MessageWithSender[]>(initialMessages);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Subscribe to realtime messages
  useEffect(() => {
    const channel = ably.channels.get(`conversation:${conversationId}`);

    const listener = (message: any) => {
      const newMessage = message.data as MessageWithSender;

      setMessages((prev) => {
        // Prevent duplicates
        if (prev.some((m) => m.id === newMessage.id)) {
          return prev;
        }

        return [...prev, newMessage];
      });
    };

    channel.subscribe("message", listener);

    return () => {
      channel.unsubscribe("message", listener);
    };
  }, [ably, conversationId]);

  return (
    <div className="mx-auto flex h-[80vh] max-w-3xl flex-col">
      <h2 className="mb-4 text-xl font-bold">Conversation</h2>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border p-4">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="rounded-lg border p-3">
              <p className="font-semibold">
                {msg.sender.id === currentUserId
                  ? "You"
                  : (msg.sender.name ?? "Unknown")}
              </p>

              <p className="mt-1">{msg.text}</p>
            </div>
          ))
        )}

        <div ref={bottomRef} />
      </div>

      <div className="mt-4">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
