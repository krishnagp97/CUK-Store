"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  conversationId: string;
};

export default function MessageInput({
  conversationId,
}: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

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

      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Type a message..."
        value={text}
        disabled={sending}
        onChange={(e) => setText(e.target.value)}
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
      >
        {sending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}