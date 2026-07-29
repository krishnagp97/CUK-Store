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
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
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
      <div className="flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelected(index)}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
              selected === index
                ? "border-primary"
                : "border-transparent hover:border-gray-300"
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