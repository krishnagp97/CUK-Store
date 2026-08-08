"use client";

import { useAbly } from "ably/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";

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
   <div className="flex items-center gap-2 border-t border-[#E5E5EF] bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:gap-3 sm:p-4 sm:pb-4">
      <Input
        placeholder="Type a message..."
        value={text}
        disabled={sending}
        className="h-11 rounded-full border-[#E5E5EF] px-4 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#6C5CE7] focus-visible:ring-offset-0"
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

      <Button
        onClick={sendMessage}
        disabled={sending || !text.trim()}
        className="h-11 w-11 shrink-0 rounded-full bg-linear-to-r from-[#6C5CE7] to-[#8B7CF6] p-0 shadow-md shadow-[#6C5CE7]/30 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#6C5CE7]/40 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 lg:w-auto lg:gap-2 lg:px-5"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span className="hidden lg:inline">Send</span>
          </>
        )}
      </Button>
    </div>
  );
}