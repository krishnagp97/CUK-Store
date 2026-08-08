"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: {
    imageUrl: string;
  }[];
};

export default function ProductGallery({
  images,
}: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl border border-[#E5E5EF] bg-[#F7F7FB] sm:rounded-2xl">
        <Image
          src={images[selected]?.imageUrl || "/placeholder.jpg"}
          alt="Product"
          fill
          sizes="(max-width:768px)100vw, (max-width:1200px)50vw, 40vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelected(index)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-20 ${
              selected === index
                ? "border-[#6C5CE7]"
                : "border-transparent hover:border-[#E5E5EF]"
            }`}
          >
            <Image
              src={image.imageUrl}
              alt={`Product Image ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}