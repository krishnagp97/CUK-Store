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
    <div className="space-y-2">
      {CATEGORIES.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => toggleCategory(category.value)}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
