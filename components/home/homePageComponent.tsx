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
      <div className="flex h-96 items-center justify-center">
        Loading products...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-3 sticky top-6 self-start">
            <Card className="sticky top-24 rounded-xl border shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Categories</h3>
                  <SidebarFilter />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products */}
          <main className="col-span-9">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Browse Products</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Buy and sell items within your campus.
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed">
                <ShoppingBag className="mb-4 h-14 w-14 text-gray-400" />
                <h2 className="text-2xl font-semibold">No Products Found</h2>
                <p className="mt-2 text-muted-foreground">
                  Be the first to sell something on Campus Marketplace.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id}>
                      <Card className="group overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                        <div className="relative h-60 overflow-hidden bg-slate-100">
                          <Image
                            src={
                              product.images[0]?.imageUrl || "/placeholder.jpg"
                            }
                            alt={product.title}
                            fill
                            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw,33vw"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                          <div className="absolute right-4 top-4">
                            <WishListButton
                              productId={product.id}
                              initialWishlisted={product.isWishlisted}
                            />
                          </div>
                        </div>
                        <CardContent className="space-y-3 p-5">
                          <span className="inline-block rounded-md border px-2 py-1 text-xs font-medium text-muted-foreground">
                            {product.category.charAt(0).toUpperCase() +
                              product.category.slice(1)}
                          </span>
                          <h2 className="line-clamp-2 text-base font-semibold">
                            {product.title}
                          </h2>
                          <p className="text-2xl font-bold">
                            ₹
                            {new Intl.NumberFormat("en-IN").format(
                              product.price,
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Seller • {product.seller.name ?? "Unknown"}
                          </p>
                          <Button variant="outline" className="w-full">
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
                  <div className="py-6 text-center text-muted-foreground">
                    Loading more products...
                  </div>
                )}

                {!hasNextPage && (
                  <div className="py-6 text-center text-muted-foreground">
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
