"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
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
      className="h-12 flex-1 rounded-full bg-[#6C5CE7] text-sm font-medium hover:bg-[#6C5CE7]/90 sm:h-11 sm:text-base"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin sm:h-5 sm:w-5" />
      ) : (
        <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
      )}

      {loading ? "Opening..." : "Chat Seller"}
    </Button>
  );
}