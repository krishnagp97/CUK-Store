import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductCardData } from "@/lib/types";
import WishListButton from "@/components/wishList/wishListButton";
import SidebarFilter from "@/components/sideBarFilter";


type HomePageComponentProps = {
  products: ProductCardData[];
};

export default function HomePageComponent({
  products,
}: HomePageComponentProps) {
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
                {/* Categories */}
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

              <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-medium">
                {products.length} Products
              </span>
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
                          {new Intl.NumberFormat("en-IN").format(product.price)}
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
