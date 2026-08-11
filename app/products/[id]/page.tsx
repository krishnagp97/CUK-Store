
import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { User } from "lucide-react";

import ProductGallery from "@/components/product/productGallery";
import MessageSellerButton from "@/components/product/messageSellerButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const similarProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: {
        not: product.id,
      },
      status: "AVAILABLE",
    },
    include: {
      images: {
        take: 1,
      },
    },
    take: 4,
  });

  return (
    <div className="w-full px-3 pb-24 pt-3 sm:px-4 sm:pb-8 sm:pt-6 lg:pt-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Main Product Section */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Left - Gallery */}
          <div className="min-w-0">
            <ProductGallery images={product.images} />
          </div>

          {/* Right - Product Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Category */}
            <Badge className="rounded-full px-2.5 py-1 text-xs font-medium">
              {product.category}
            </Badge>

            {/* Title */}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {product.title}
            </h1>

            {/* Price */}
            <p className="text-2xl font-bold text-green-600 sm:text-3xl lg:text-4xl">
              ₹{new Intl.NumberFormat("en-IN").format(product.price)}
            </p>

            {/* Description */}
            <Card className="rounded-2xl border-muted/60 shadow-sm">
              <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Description
                </h2>

                <p className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            {/* Seller */}
            <Card className="rounded-2xl border-muted/60 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted sm:h-12 sm:w-12">
                    <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Seller
                    </p>

                    <h3 className="truncate text-sm font-semibold sm:text-base">
                      {product.seller.name ?? "Unknown"}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action */}
            <div className="pt-1">
              <MessageSellerButton productId={product.id} />
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <section className="mt-10 sm:mt-14 lg:mt-20">
          <h2 className="mb-4 text-xl font-bold tracking-tight sm:mb-6 sm:text-2xl lg:mb-8 lg:text-3xl">
            Similar Products
          </h2>

          {similarProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground sm:text-base">
              No similar products found.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-4">
              {similarProducts.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden rounded-xl border-muted/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl"
                >
                  {/* Image */}
                  <div className="relative h-32 overflow-hidden bg-slate-100 sm:h-48 lg:h-52">
                    <Image
                      src={
                        item.images[0]?.imageUrl ||
                        "/placeholder.jpg"
                      }
                      alt={item.title}
                      fill
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="space-y-2 p-3 sm:space-y-3 sm:p-4">
                    <h3 className="line-clamp-2 text-xs font-semibold sm:text-base">
                      {item.title}
                    </h3>

                    <p className="text-base font-bold text-green-600 sm:text-xl">
                      ₹
                      {new Intl.NumberFormat("en-IN").format(
                        item.price,
                      )}
                    </p>

                    <Link
                      href={`/products/${item.id}`}
                      className="block"
                    >
                      <Button
                        variant="secondary"
                        className="h-8 w-full rounded-full px-2 text-xs sm:h-10 sm:text-sm"
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

