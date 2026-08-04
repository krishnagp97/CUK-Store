"use client";

import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

      if (!res.ok) return;

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={remove}
      className=" absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow-lg"
    >
      <Trash2 className="h-5 w-5 text-red-500" />
    </button>
  );
}
