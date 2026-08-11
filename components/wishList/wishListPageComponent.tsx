
import Image from "next/image";
import Link from "next/link";

import { Heart, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { WishlistCardData } from "@/lib/types";
import RemoveWishlistButton from "./removeWishlistButton";

type WishlistPageComponentProps = {
  wishlist: WishlistCardData[];
};

export default function WishListPageComponent({
  wishlist,
}: WishlistPageComponentProps) {
  return (
    <div className="w-full px-3 pb-24 pt-3 sm:px-4 sm:pb-8 sm:pt-4 lg:pt-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3 border-b pb-4 sm:mb-8 sm:pb-6 lg:mb-10 lg:pb-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 sm:h-14 sm:w-14">
            <Heart className="h-5 w-5 fill-red-500 text-red-500 sm:h-7 sm:w-7" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-3xl lg:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm lg:text-base">
              Products you've saved for later.
            </p>
          </div>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <Card className="rounded-2xl border-dashed shadow-none">
            <CardContent className="flex min-h-80 flex-col items-center justify-center gap-4 px-4 py-8 text-center sm:min-h-[360px] sm:gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted sm:h-16 sm:w-16">
                <Heart className="h-7 w-7 text-muted-foreground sm:h-8 sm:w-8" />
              </div>

              <h2 className="text-xl font-semibold sm:text-2xl">
                Wishlist is Empty
              </h2>

              <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
                Save products by clicking the heart icon.
              </p>

              <Link href="/" className="w-full sm:w-auto">
                <Button className="mt-1 w-full rounded-full sm:w-auto">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
            {wishlist.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.product.id}`}
                className="block"
              >
                <Card className="group h-full overflow-hidden rounded-xl border-muted/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-slate-100 sm:h-52 lg:h-56">
                    <Image
                      src={
                        item.product.images[0]?.imageUrl ||
                        "/placeholder.jpg"
                      }
                      alt={item.product.title}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                    <RemoveWishlistButton
                      productId={item.product.id}
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="space-y-2 p-3 sm:space-y-3 sm:p-5">
                    {/* Category */}
                    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:px-2.5 sm:py-1 sm:text-xs">
                      {item.product.category.charAt(0).toUpperCase() +
                        item.product.category.slice(1)}
                    </span>

                    {/* Product Name */}
                    <h2 className="line-clamp-2 text-sm font-semibold tracking-tight sm:text-base">
                      {item.product.title}
                    </h2>

                    {/* Price */}
                    <p className="text-lg font-bold text-primary sm:text-2xl">
                      ₹
                      {new Intl.NumberFormat("en-IN").format(
                        item.product.price,
                      )}
                    </p>

                    {/* View Product */}
                    <Button
                      variant="outline"
                      className="h-9 w-full rounded-full px-2 text-xs sm:h-11 sm:text-sm"
                    >
                      <ShoppingBag className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                      View Product
                    </Button>

                    {/* Seller */}
                    <p className="pt-0.5 text-[10px] text-muted-foreground sm:text-sm">
                      Seller •{" "}
                      {item.product.seller.name ?? "Unknown"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

