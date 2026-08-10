"use client";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Eye, Pencil, Trash2, CircleDollarSign, PackageOpen, Plus } from "lucide-react";
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
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b pb-8">
        <div>
          <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            My Listings
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your posted products
          </p>
        </div>

        <Link href="/sell">
          <Button size="lg" className="gap-2 rounded-full shadow-sm">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Empty State */}

      {products.length === 0 ? (
        <Card className="rounded-2xl border-dashed shadow-none">
          <CardContent className="flex h-80 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="text-2xl font-semibold">No Products Yet</h2>

            <p className="max-w-sm text-muted-foreground">
              Start selling your first product and it will show up here.
            </p>

            <Link href="/sell">
              <Button className="mt-2 rounded-full">Add Product</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden rounded-2xl border-muted/60 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5">
                  {/* Image */}

                  <div className="relative h-60 overflow-hidden md:h-full">
                    <Image
                      src={product.images[0]?.imageUrl || "/placeholder.jpg"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  </div>

                  {/* Details */}

                  <div className="space-y-5 p-6 md:col-span-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">
                          {product.title}
                        </h2>

                        <p className="flex items-center gap-1 text-2xl font-bold text-primary">
                          <CircleDollarSign className="h-5 w-5 opacity-70" />
                          ₹
                          {new Intl.NumberFormat("en-IN").format(product.price)}
                        </p>
                      </div>

                      <Badge
                        variant={
                          product.status === "AVAILABLE"
                            ? "default"
                            : "secondary"
                        }
                        className="rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {product.status === "AVAILABLE" ? "Available" : "Sold"}
                      </Badge>
                    </div>

                    <p className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                      {product.category}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" className="rounded-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>

                      <Link href={`/myListings/${product.id}/edit`}>
                        <Button variant="outline" className="rounded-full">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      {product.status === "AVAILABLE" ? (
                        <Button
                          className="rounded-full bg-green-600 text-white hover:bg-green-700"
                          onClick={() => toggleStatus(product.id, "SOLD")}
                        >
                          Mark as Sold
                        </Button>
                      ) : (
                        <Button
                          className="rounded-full bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => toggleStatus(product.id, "AVAILABLE")}
                        >
                          Mark as Available
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        className="rounded-full"
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