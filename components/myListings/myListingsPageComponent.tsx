"use client";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Eye, Pencil, Trash2, CircleDollarSign } from "lucide-react";
import { MyListingCardData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type MyListingsPageComponentProps = {
  products: MyListingCardData[];
};

export function MyListingsPageComponent({
  products,
}: MyListingsPageComponentProps) {
  const router = useRouter();

  async function toggleStatus(id: string, status: "AVAILABLE" | "SOLD") {
    const confirmed = window.confirm(
      `Mark this product as ${status.toLowerCase()}?`,
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to update status");
      }

      router.refresh();
      toast.success(
        status === "SOLD"
          ? "Product marked as sold."
          : "Product marked as available.",
      );
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to update product status.");
      }
    }
  }
  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      router.refresh();
      toast.success("Product deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    }
  }
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}

      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">My Listings</h1>

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

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex h-72 flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-semibold">No Products Yet</h2>

            <p className="text-muted-foreground">
              Start selling your first product.
            </p>

            <Link href="/sell">
              <Button>Add Product</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden transition hover:shadow-lg"
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5">
                  {/* Image */}

                  <div className="relative h-60 md:h-full">
                    <Image
                      src={product.images[0]?.imageUrl || "/placeholder.jpg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}

                  <div className="space-y-4 p-6 md:col-span-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">{product.title}</h2>

                        <p className="mt-2 text-3xl font-bold text-green-600">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>

                      <Badge
                        variant={
                          product.status === "AVAILABLE"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {product.status === "AVAILABLE" ? "Available" : "Sold"}
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

                      <Link href={`/myListings/${product.id}/edit`}>
                        <Button variant="secondary">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      {product.status === "AVAILABLE" ? (
                        <Button
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => toggleStatus(product.id, "SOLD")}
                        >
                          Mark as Sold
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => toggleStatus(product.id, "AVAILABLE")}
                        >
                          Mark as Available
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        onClick={() => deleteProduct(product.id)}
                      >
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
