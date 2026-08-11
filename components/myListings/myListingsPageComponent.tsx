
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Eye,
  Pencil,
  Trash2,
  CircleDollarSign,
  PackageOpen,
  Plus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { MyListingCardData } from "@/lib/types";
import { toast } from "sonner";

type MyListingsPageComponentProps = {
  products: MyListingCardData[];
};

export function MyListingsPageComponent({
  products,
}: MyListingsPageComponentProps) {
  const router = useRouter();

  async function toggleStatus(
    id: string,
    status: "AVAILABLE" | "SOLD",
  ) {
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
        throw new Error(
          data.error ?? "Failed to update status",
        );
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
    <div className="w-full px-3 pb-24 pt-3 sm:px-4 sm:pb-8 sm:pt-4 lg:pb-8 lg:pt-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 border-b pb-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:pb-6 lg:mb-10 lg:pb-8">
          <div className="min-w-0">
            <h1 className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl lg:text-4xl">
              My Listings
            </h1>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm lg:text-base">
              Manage your posted products
            </p>
          </div>

          <Link
            href="/sell"
            className="w-full sm:w-auto"
          >
            <Button
              className="h-10 w-full gap-2 rounded-full shadow-sm sm:h-11 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <Card className="rounded-2xl border-dashed shadow-none">
            <CardContent className="flex min-h-80 flex-col items-center justify-center gap-4 px-4 py-8 text-center sm:min-h-90 sm:gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted sm:h-16 sm:w-16">
                <PackageOpen className="h-7 w-7 text-muted-foreground sm:h-8 sm:w-8" />
              </div>

              <h2 className="text-xl font-semibold sm:text-2xl">
                No Products Yet
              </h2>

              <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
                Start selling your first product and it will
                show up here.
              </p>

              <Link
                href="/sell"
                className="w-full sm:w-auto"
              >
                <Button className="mt-1 w-full rounded-full sm:w-auto">
                  Add Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Listings */
          <div className="grid gap-4 sm:gap-5 lg:gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden rounded-2xl border-muted/60 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-5">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-56 md:h-full md:min-h-62.5">
                      <Image
                        src={
                          product.images[0]?.imageUrl ||
                          "/placeholder.jpg"
                        }
                        alt={product.title}
                        fill
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 40vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-5 md:col-span-4 md:p-6">
                      {/* Title + Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="line-clamp-2 text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
                            {product.title}
                          </h2>

                          <p className="mt-1 flex items-center gap-1 text-xl font-bold text-primary sm:text-2xl">
                            ₹
                            {new Intl.NumberFormat(
                              "en-IN",
                            ).format(product.price)}
                          </p>
                        </div>

                        <Badge
                          variant={
                            product.status === "AVAILABLE"
                              ? "default"
                              : "secondary"
                          }
                          className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium sm:px-3 sm:text-xs"
                        >
                          {product.status === "AVAILABLE"
                            ? "Available"
                            : "Sold"}
                        </Badge>
                      </div>

                      {/* Category */}
                      <div>
                        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground sm:px-3 sm:text-sm">
                          {product.category}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex flex-wrap gap-2 sm:gap-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1 sm:flex-none"
                        >
                          <Button
                            variant="outline"
                            className="h-10 w-full rounded-full sm:h-11 sm:w-auto"
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                            View
                          </Button>
                        </Link>

                        <Link
                          href={`/myListings/${product.id}/edit`}
                          className="flex-1 sm:flex-none"
                        >
                          <Button
                            variant="outline"
                            className="h-10 w-full rounded-full sm:h-11 sm:w-auto"
                          >
                            <Pencil className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                            Edit
                          </Button>
                        </Link>

                        {product.status === "AVAILABLE" ? (
                          <Button
                            className="h-10 flex-1 rounded-full bg-green-600 text-xs text-white hover:bg-green-700 sm:h-11 sm:flex-none sm:text-sm"
                            onClick={() =>
                              toggleStatus(
                                product.id,
                                "SOLD",
                              )
                            }
                          >
                            Mark as Sold
                          </Button>
                        ) : (
                          <Button
                            className="h-10 flex-1 rounded-full bg-blue-600 text-xs text-white hover:bg-blue-700 sm:h-11 sm:flex-none sm:text-sm"
                            onClick={() =>
                              toggleStatus(
                                product.id,
                                "AVAILABLE",
                              )
                            }
                          >
                            Mark as Available
                          </Button>
                        )}

                        <Button
                          variant="destructive"
                          className="h-10 flex-1 rounded-full sm:h-11 sm:flex-none"
                          onClick={() =>
                            deleteProduct(product.id)
                          }
                        >
                          <Trash2 className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
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
    </div>
  );
}

