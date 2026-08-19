"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type WishlistButtonProps = {
  productId: string;
  initialWishlisted?: boolean;
};

export default function WishlistButton({
  productId,
  initialWishlisted = false,
}: WishlistButtonProps) {
  const queryClient = useQueryClient();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWishlisted(initialWishlisted);
  }, [initialWishlisted]);

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);

    const newValue = !wishlisted;

  
    setWishlisted(newValue);

    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: newValue ? "POST" : "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
       
        setWishlisted(!newValue);
        toast.error(data.error || "Something went wrong.");
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    } catch (error) {
     
      setWishlisted(!newValue);
      console.error(error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={loading}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      className="rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Heart
        className={`h-5 w-5 transition-all duration-200 ${
          wishlisted
            ? "scale-110 fill-red-500 text-red-500"
            : "text-gray-500 hover:fill-red-500 hover:text-red-500"
        }`}
      />
    </button>
  );
}