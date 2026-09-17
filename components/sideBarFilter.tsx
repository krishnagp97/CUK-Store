
"use client";

import { SlidersHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { useRouter, useSearchParams } from "next/navigation";

export default function SidebarFilter() {
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
  }

  return (
    <aside className="rounded-3xl border border-[#E5E5EF] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7F7FB]">
          <SlidersHorizontal className="h-4 w-4 text-[#1A1A2E]/70" />
        </div>

        <div>
          <h2 className="text-base font-bold text-[#1A1A2E]">
            Filters
          </h2>

          <p className="text-xs text-[#1A1A2E]/50">
            Choose a category
          </p>
        </div>
      </div>

      {/* Category label */}
      <div className="mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#1A1A2E]/40">
          Category
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-1.5">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.value;

          return (
            <Button
              key={category.value}
              type="button"
              variant="ghost"
              onClick={() => toggleCategory(category.value)}
              className={`h-auto min-h-11 w-full justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#6C5CE7] text-white shadow-sm hover:bg-[#6C5CE7]"
                  : "bg-[#F7F7FB] text-[#1A1A2E] hover:bg-[#EEEEF5] hover:text-[#1A1A2E]"
              }`}
            >
              <span>{category.label}</span>

              {isActive && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Clear */}
      {selectedCategory && (
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("category");

            router.replace(
              params.toString() ? `/?${params.toString()}` : "/",
            );
          }}
          className="mt-4 w-full text-center text-xs font-medium text-[#1A1A2E]/50 transition-colors hover:text-[#6C5CE7]"
        >
          Clear filter
        </button>
      )}
    </aside>
  );
}

