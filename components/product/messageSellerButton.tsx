"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function MessageSellerButton({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleMessageSeller() {
    try {
      setLoading(true);

      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      router.push(`/message/${data.conversationId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleMessageSeller}
      disabled={loading}
      size="lg"
      className="flex-1"
    >
      <MessageCircle className="mr-2 h-5 w-5" />

      {loading ? "Opening..." : "Chat Seller"}
    </Button>
  );
}