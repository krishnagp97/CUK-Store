"use client";

import { useAbly } from "ably/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  conversationId: string;
  currentUserId: string;
};
export default function MessageInput({ conversationId, currentUserId }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const ably = useAbly();
  const channel = ably.channels.get(`conversation:${conversationId}`);

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const typing = useRef(false);

  async function sendMessage() {
    const message = text.trim();

    if (!message || sending) return;

    setSending(true);

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          text: message,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error);
        return;
      }

      typing.current = false;

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      await channel.publish("typing", {
        userId: currentUserId,
        typing: false,
      });
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      channel.publish("typing", {
        userId: currentUserId,
        typing: false,
      });
    };
  }, [channel, currentUserId]);

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Type a message..."
        value={text}
        disabled={sending}
        onChange={(e) => {
          const value = e.target.value;
          setText(value);

          if (value.trim() === "") {
            typing.current = false;

            if (typingTimeout.current) {
              clearTimeout(typingTimeout.current);
            }

            channel.publish("typing", {
              userId: currentUserId,
              typing: false,
            });

            return;
          }

          if (!typing.current) {
            typing.current = true;

            channel.publish("typing", {
              userId: currentUserId,
              typing: true,
            });
          }

          if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
          }

          typingTimeout.current = setTimeout(() => {
            typing.current = false;

            channel.publish("typing", {
              userId: currentUserId,
              typing: false,
            });
          }, 2000);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />

      <Button onClick={sendMessage} disabled={sending || !text.trim()}>
        {sending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}
