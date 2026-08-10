import Image from "next/image";
import Link from "next/link";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";

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
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 flex items-center gap-3 border-b pb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Heart className="h-7 w-7 fill-red-500 text-red-500" />
        </div>

        <div>
          <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            My Wishlist
          </h1>

          <p className="text-muted-foreground">
            Products you've saved for later.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <Card className="rounded-2xl border-dashed shadow-none">
          <CardContent className="flex h-80 flex-col items-center justify-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="text-2xl font-semibold">Wishlist is Empty</h2>

            <p className="max-w-sm text-center text-muted-foreground">
              Save products by clicking the heart icon.
            </p>

            <Link href="/">
              <Button className="mt-2 rounded-full">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((item) => (
            <Link key={item.id} href={`/products/${item.product.id}`}>
              <Card className="group overflow-hidden rounded-2xl border-muted/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <Image
                    src={item.product.images[0]?.imageUrl || "/placeholder.jpg"}
                    alt={item.product.title}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                  {/* Remove Wishlist */}
                  <RemoveWishlistButton productId={item.product.id} />
                </div>

                {/* Content */}
                <CardContent className="space-y-3 p-5">
                  <span className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {item.product.category.charAt(0).toUpperCase() +
                      item.product.category.slice(1)}
                  </span>

                  <h2 className="line-clamp-2 text-base font-semibold tracking-tight">
                    {item.product.title}
                  </h2>

                  <p className="text-2xl font-bold text-primary">
                    ₹
                    {new Intl.NumberFormat("en-IN").format(
                      item.product.price,
                    )}
                  </p>

                  <Button variant="outline" className="w-full rounded-full">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    View Product
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    Seller • {item.product.seller.name ?? "Unknown"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}