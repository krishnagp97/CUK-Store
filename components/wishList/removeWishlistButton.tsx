"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  productId: string;
};

export default function RemoveWishlistButton({ productId }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function remove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      toast.success("Removed from wishlist");

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      disabled={loading}
      onClick={remove}
      className="absolute right-3 top-3 z-10 rounded-full"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4 text-red-500" />
      )}
    </Button>
  );
}