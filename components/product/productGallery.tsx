"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: {
    imageUrl: string;
  }[];
};

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="group relative aspect-square overflow-hidden rounded-xl border border-[#E5E5EF] bg-[#F7F7FB] shadow-sm sm:rounded-2xl">
        <Image
          key={selected}
          src={images[selected]?.imageUrl || "/placeholder.jpg"}
          alt="Product"
          fill
          sizes="(max-width:768px)100vw, (max-width:1200px)50vw, 40vw"
          className="animate-in fade-in object-cover duration-300 group-hover:scale-105 transition-transform"
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
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 sm:h-20 sm:w-20 ${
              selected === index
                ? "border-[#6C5CE7] shadow-md ring-2 ring-[#6C5CE7]/20"
                : "border-transparent opacity-70 hover:opacity-100 hover:border-[#E5E5EF]"
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