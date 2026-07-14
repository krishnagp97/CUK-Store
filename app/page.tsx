import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Heart,ShoppingBag } from "lucide-react";
import Link from "next/link";

const categories = [
  "Electronics",
  "Furniture",
  "Books",
  "Fashion",
  "Laptop",
  "Mobile",
  "Vehicle",
  "Notes",
  "Sports",
  "Others",
];

const products = [
  {
    id: 1,
    name: "iPhone 13",
    price: 42000,
  },
  {
    id: 2,
    name: "Gaming Laptop",
    price: 65000,
  },
  {
    id: 3,
    name: "Study Notes",
    price: 250,
  },
  {
    id: 4,
    name: "Office Chair",
    price: 3500,
  },
  {
    id: 5,
    name: "Football",
    price: 900,
  },
  {
    id: 6,
    name: "Samsung S23",
    price: 48000,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-3 sticky top-6 self-start">
            <Card className="sticky top-24 rounded-2xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Filters</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Categories</h3>

                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-slate-100 hover:shadow-sm"
                      >
                        <Checkbox id={category} />

                        <label
                          htmlFor={category}
                          className="cursor-pointer text-sm"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Price Range</h3>

                  <Slider defaultValue={[50000]} max={100000} step={1000} />

                  <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                    <span>₹0</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </CardContent>
            </Card>
          </aside>

          {/* Products */}
          <main className="col-span-9">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Discover Products
                </h1>

                <p className="text-slate-500">Find the best deals around you</p>
              </div>

              <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-medium">
                {products.length} Products
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative flex h-60 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <span className="text-lg font-medium text-slate-500">
                      No Image
                    </span>

                    <button className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-lg transition hover:scale-110">
                      <Heart className="h-5 w-5 text-gray-500 transition hover:fill-red-500 hover:text-red-500" />
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
          </main>
        </div>
      </div>
    </div>
  );
}
