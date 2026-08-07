"use client";

import { useEffect, useMemo } from "react";
import { useAbly } from "ably/react";
import { useSession } from "@/lib/auth-client";

export default function GlobalRealtime() {
  const { data: session } = useSession();
  const ably = useAbly();

  const userId = session?.user.id;

  const channel = useMemo(() => {
    if (!userId) return null;

    return ably.channels.get(`user:${userId}`);
  }, [ably, userId]);

  useEffect(() => {
    if (!channel || !userId) return;

    const listener = async (msg: any) => {
      const { message } = msg.data;

      // Ignore our own messages
      if (message.sender.id === userId) return;

      try {
        await fetch(`/api/message/${message.id}/delivered`, {
          method: "PATCH",
        });
      } catch (err) {
        console.error("Failed to mark message delivered:", err);
      }
    };

    channel.subscribe("conversation-updated", listener);

    return () => {
      channel.unsubscribe("conversation-updated", listener);
    };
  }, [channel, userId]);

  return null;
}