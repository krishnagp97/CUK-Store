"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  productId: string;
};

export default function RemoveWishlistButton({ productId }: Props) {
  const router = useRouter();
  async function remove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const res = await fetch(`/api/wishlist/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      className="absolute right-3 top-3 rounded-full bg-background/90 p-2 shadow backdrop-blur transition hover:scale-105"
    >
      <Trash2 className="h-5 w-5 text-red-500" />
    </button>
  );
}
