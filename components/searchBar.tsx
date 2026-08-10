"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();

  // Read initial value only
  const [search, setSearch] = useState(() => {
    if (typeof window === "undefined") return "";

    return new URLSearchParams(window.location.search).get("search") ?? "";
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      const currentSearch = params.get("search") ?? "";
      const newSearch = search.trim();

      // IMPORTANT:
      // Don't navigate if URL already has this search
      if (currentSearch === newSearch) {
        return;
      }

      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }

      router.replace(`/?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, router]);

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="h-10 w-full rounded-full border border-input bg-muted/40 py-2 pl-10 pr-10 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
      />

      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}