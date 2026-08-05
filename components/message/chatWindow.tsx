"use client";

import { useEffect, useRef, useState } from "react";
import { Prisma } from "@prisma/client";
import { useAbly } from "ably/react";
import Image from "next/image";

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

export default function ChatWindow({
  conversationId,
  initialMessages,
  currentUserId,
  otherUser,
  product,
}: Props) {
  const ably = useAbly();

  const [messages, setMessages] = useState<MessageWithSender[]>(
    [...initialMessages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime(),
    ),
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  // Ably realtime messages
  useEffect(() => {
    const channel = ably.channels.get(
      `conversation:${conversationId}`,
    );

    const listener = (message: any) => {
      const newMessage = message.data as MessageWithSender;

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMessage.id)) {
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
    <div className="flex h-[calc(100vh-120px)] flex-col rounded-lg border">

      {/* Header */}
      <div className="flex items-center gap-3 border-b p-4">

        {/* User avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold">
          {otherUser.name
            ? otherUser.name.charAt(0).toUpperCase()
            : "U"}
        </div>


        {/* User + Product */}
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">
            {otherUser.name ?? "User"}
          </h2>

          <p className="truncate text-sm text-muted-foreground">
            Regarding: {product.title}
          </p>

          <p className="text-sm font-medium">
            ₹
            {new Intl.NumberFormat("en-IN").format(
              product.price,
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

          messages.map((msg) => {

            const mine =
              msg.sender.id === currentUserId;


            return (
              <div
                key={msg.id}
                className={`flex ${
                  mine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`
                    max-w-[75%] rounded-2xl px-4 py-2
                    ${
                      mine
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }
                  `}
                >

                  <p className="text-sm">
                    {msg.text}
                  </p>


                  <p
                    className={`
                      mt-1 text-right text-[11px]
                      ${
                        mine
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    {new Date(
                      msg.createdAt,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

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
        />
      </div>

    </div>
  );
}