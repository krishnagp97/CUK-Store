import Image from "next/image";
import Link from "next/link";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const wishlistProducts = [
  {
    id: "1",
    name: "iPhone 13 Pro",
    price: 42000,
    location: "Delhi",
    image: "/placeholder.png",
  },
  {
    id: "2",
    name: "Gaming Laptop",
    price: 65000,
    location: "Noida",
    image: "/placeholder.png",
  },
];

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Header */}

      <div className="mb-10 flex items-center gap-3">
        <Heart className="h-8 w-8 fill-red-500 text-red-500" />

        <div>
          <h1 className="text-4xl font-bold">
            My Wishlist
          </h1>

          <p className="text-muted-foreground">
            Products you've saved for later.
          </p>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <Card>

          <CardContent className="flex h-80 flex-col items-center justify-center gap-5">

            <Heart className="h-16 w-16 text-muted-foreground" />

            <h2 className="text-2xl font-semibold">
              Wishlist is Empty
            </h2>

            <p className="text-center text-muted-foreground">
              Save products by clicking the heart icon.
            </p>

            <Link href="/">
              <Button>
                Browse Products
              </Button>
            </Link>

          </CardContent>

        </Card>
      ) : (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {wishlistProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative flex h-60 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <span className="text-lg font-medium text-slate-500">
                      No Image
                    </span>

                    <button className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-lg transition hover:scale-110">
                      <Trash2 className="h-5 w-5 text-gray-500 " />
                    </button>
                  </div>

                  <CardContent className="space-y-2 p-5">
                    <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                      Electronics
                    </span>

                    <h2 className="line-clamp-1 text-lg font-semibold tracking-tight">
                      {product.name}
                    </h2>

                    <p className="text-3xl font-bold text-indigo-500">
                      ₹{product.price.toLocaleString()}
                    </p>
                    <Link href={`products/${product.id}`}>
                      <Button className="mt-2 w-full rounded-xl">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

      )}

    </div>
  );
}