"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { CATEGORIES } from "@/lib/categories";

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

    router.replace("/?" + params.toString());
  }

  return (
    <div className="space-y-1.5">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Categories
      </p>

      {CATEGORIES.map((category) => {
        const isActive = selectedCategory === category.value;

        return (
          <Button
            key={category.value}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start rounded-xl font-medium transition-all ${
              isActive
                ? "shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            onClick={() => toggleCategory(category.value)}
          >
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}