import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Eye,
  Pencil,
  Trash2,
  CircleDollarSign,
} from "lucide-react";

const myProducts = [
  {
    id: "1",
    name: "iPhone 13 Pro",
    price: 42000,
    status: "Available",
    category: "Electronics",
    image: "/placeholder.png",
  },
  {
    id: "2",
    name: "Gaming Laptop",
    price: 65000,
    status: "Sold",
    category: "Laptop",
    image: "/placeholder.png",
  },
];

export default function MyListingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Header */}

      <div className="mb-10 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            My Listings
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your posted products
          </p>
        </div>

        <Link href="/sell">
          <Button>
            <CircleDollarSign className="mr-2 h-4 w-4" />
            Sell Product
          </Button>
        </Link>

      </div>

      {/* Empty State */}

      {myProducts.length === 0 ? (
        <Card>
          <CardContent className="flex h-72 flex-col items-center justify-center gap-4">

            <h2 className="text-2xl font-semibold">
              No Products Yet
            </h2>

            <p className="text-muted-foreground">
              Start selling your first product.
            </p>

            <Link href="/sell">
              <Button>
                Add Product
              </Button>
            </Link>

          </CardContent>
        </Card>
      ) : (

        <div className="grid gap-6">

          {myProducts.map((product) => (

            <Card
              key={product.id}
              className="overflow-hidden transition hover:shadow-lg"
            >

              <CardContent className="p-0">

                <div className="grid md:grid-cols-5">

                  {/* Image */}

                  <div className="relative h-60 md:h-full">

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                  {/* Details */}

                  <div className="space-y-4 p-6 md:col-span-4">

                    <div className="flex flex-wrap items-center justify-between gap-4">

                      <div>

                        <h2 className="text-2xl font-bold">
                          {product.name}
                        </h2>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                          ₹{product.price.toLocaleString()}
                        </p>

                      </div>

                      <Badge
                        variant={
                          product.status === "Available"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {product.status}
                      </Badge>

                    </div>

                    <p className="text-muted-foreground">
                      Category: {product.category}
                    </p>

                    <div className="flex flex-wrap gap-3">

                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>

                      <Button variant="secondary">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>

                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}

    </div>
  );
}