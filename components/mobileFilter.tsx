"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { useRouter, useSearchParams } from "next/navigation";

export default function MobileFilter() {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category");

  function toggleCategory(category: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory === category) {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.replace(`/?${params.toString()}`);
    setOpen(false);
  }

  const selectedLabel = CATEGORIES.find(
    (category) => category.value === selectedCategory,
  )?.label;

  return (
    <>
      {/* Mobile filter bar */}
      <div className="mb-5 flex items-center gap-2 lg:hidden">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="h-11 rounded-full border-[#E5E5EF] bg-white px-4 shadow-sm"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>

        {selectedLabel && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("category");
              router.replace(`/?${params.toString()}`);
            }}
            className="flex h-11 items-center gap-2 rounded-full bg-[#6C5CE7]/10 px-4 text-sm font-medium text-[#6C5CE7]"
          >
            {selectedLabel}

            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setOpen(false)}
        >
          {/* Bottom sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A2E]">
                  Filters
                </h2>

                <p className="mt-1 text-sm text-[#1A1A2E]/50">
                  Choose a category
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F7FB] text-[#1A1A2E]/60 transition hover:bg-[#EDEDF5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.value;

                return (
                  <button
                    key={category.value}
                    onClick={() => toggleCategory(category.value)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#6C5CE7] text-white shadow-sm"
                        : "bg-[#F7F7FB] text-[#1A1A2E] hover:bg-[#EEEEF5]"
                    }`}
                  >
                    <span>{category.label}</span>

                    {isActive && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Clear */}
            {selectedCategory && (
              <Button
                variant="outline"
                onClick={() => {
                  const params = new URLSearchParams(
                    searchParams.toString(),
                  );

                  params.delete("category");

                  router.replace(`/?${params.toString()}`);
                  setOpen(false);
                }}
                className="mt-5 h-11 w-full rounded-full"
              >
                Clear Filters
              </Button>
            )}

            {/* Bottom safe area */}
            <div className="h-2" />
          </div>
        </div>
      )}
    </>
  );
}