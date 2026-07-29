"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

type WishlistButtonProps = {
  productId: string;
  initialWishlisted?: boolean;
};

export default function WishlistButton({
  productId,
  initialWishlisted = false,
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  async function toggleWishlist(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: wishlisted ? "DELETE" : "POST",
      });

      if (!res.ok) {
        throw new Error("Failed");
      }

      setWishlisted(!wishlisted);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={loading}
      className="rounded-full bg-white p-2 shadow-lg transition hover:scale-110 disabled:opacity-50"
    >
      <Heart
        className={`h-5 w-5 transition ${
          wishlisted
            ? "fill-red-500 text-red-500"
            : "text-gray-500 hover:text-red-500 hover:fill-red-500"
        }`}
      />
    </button>
  );
}