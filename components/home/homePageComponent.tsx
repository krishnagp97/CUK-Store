"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductCardData } from "@/lib/types";
import WishListButton from "@/components/wishList/wishListButton";
import SidebarFilter from "@/components/sideBarFilter";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";

const PAGE_SIZE = 12;

type ProductsResponse = {
  products: ProductCardData[];
  nextCursor: string | null;
};

type Props = {
  search: string;
  category: string;
};

async function getProducts({
  pageParam,
  search,
  category,
}: {
  pageParam?: string | null;
  search: string;
  category: string;
}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  params.set("limit", PAGE_SIZE.toString());
  if (pageParam) params.set("cursor", pageParam);
  if (search) params.set("search", search);
  if (category) params.set("category", category);

  const res = await fetch(`/api/products?${params}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return (await res.json()) as ProductsResponse;
}

export default function HomePageComponent({ search, category }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<
      ProductsResponse,
      Error,
      InfiniteData<ProductsResponse>,
      readonly ["products", string, string],
      string | null
    >({
      queryKey: ["products", search, category] as const,

      queryFn: ({ pageParam }) =>
        getProducts({
          pageParam,
          search,
          category,
        }),

      initialPageParam: null,

      getNextPageParam: (lastPage) => lastPage.nextCursor,

      staleTime: 1000 * 60 * 5,
    });
  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const current = loadMoreRef.current;

    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-[#1A1A2E]/50">
        Loading products...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F7F7FB]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 self-start">
            <Card className="rounded-2xl border border-[#E5E5EF] shadow-sm transition-shadow duration-300 hover:shadow-md lg:sticky lg:top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-[#1A1A2E] sm:text-2xl">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-4 text-base font-semibold text-[#1A1A2E] sm:text-lg">Categories</h3>
                  <SidebarFilter />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products */}
          <main className="lg:col-span-9">
            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#1A1A2E] sm:text-3xl">Browse Products</h1>
                <p className="mt-1 text-sm text-[#1A1A2E]/50">
                  Buy and sell items within your campus.
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E5EF] px-4 text-center sm:h-96">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6C5CE7]/10">
                  <ShoppingBag className="h-7 w-7 text-[#6C5CE7]" />
                </div>
                <h2 className="text-xl font-semibold text-[#1A1A2E] sm:text-2xl">No Products Found</h2>
                <p className="mt-2 text-sm text-[#1A1A2E]/50 sm:text-base">
                  Be the first to sell something on Campus Marketplace.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                  {products.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id}>
                      <Card className="group overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6C5CE7]/15">
                        <div className="relative h-52 overflow-hidden bg-[#F7F7FB] sm:h-60">
                          <Image
                            src={
                              product.images[0]?.imageUrl || "/placeholder.jpg"
                            }
                            alt={product.title}
                            fill
                            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw,33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                            <WishListButton
                              productId={product.id}
                              initialWishlisted={product.isWishlisted}
                            />
                          </div>
                        </div>
                        <CardContent className="space-y-2.5 p-4 sm:space-y-3 sm:p-5">
                          <span className="inline-block rounded-full bg-[#6C5CE7]/10 px-2.5 py-1 text-xs font-semibold text-[#6C5CE7]">
                            {product.category.charAt(0).toUpperCase() +
                              product.category.slice(1)}
                          </span>
                          <h2 className="line-clamp-2 text-base font-semibold text-[#1A1A2E]">
                            {product.title}
                          </h2>
                          <p className="text-xl font-bold text-[#1A1A2E] sm:text-2xl">
                            ₹
                            {new Intl.NumberFormat("en-IN").format(
                              product.price,
                            )}
                          </p>
                          <p className="text-sm text-[#1A1A2E]/50">
                            Seller • {product.seller.name ?? "Unknown"}
                          </p>
                          <Button
                            variant="outline"
                            className="h-11 w-full rounded-full border-[#E5E5EF] text-sm font-medium transition-all duration-200 hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7] active:scale-[0.98] sm:h-10"
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            View Product
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                <div ref={loadMoreRef} className="h-10" />

                {isFetchingNextPage && (
                  <div className="py-6 text-center text-sm text-[#1A1A2E]/50">
                    Loading more products...
                  </div>
                )}

                {!hasNextPage && (
                  <div className="py-6 text-center text-sm text-[#1A1A2E]/50">
                    No more products to show.
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProductsLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div
            key={i}
            className="h-96 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}