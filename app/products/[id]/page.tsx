import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Heart, MapPin, MessageCircle, Star, User } from "lucide-react";
import Link from "next/link";
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
        not: product?.id,
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
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left */}
        <div>
          <ProductGallery images={product.images} />
        </div>

        {/* Right */}

        <div className="space-y-6">
          <Badge>{product.category}</Badge>

          <h1 className="text-4xl font-bold">{product.title}</h1>

          <p className="text-4xl font-bold text-green-600">
            ₹{product.price.toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-3"></div>

          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold">Description</h2>

              <p className="leading-7 text-muted-foreground">
                {product.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-3">
                  <User className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold">{product.seller.name}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <MessageSellerButton productId={product.id} />
          </div>
        </div>
      </div>

      {/* Similar Products */}

      <section className="mt-20">
        <h2 className="mb-8 text-3xl font-bold">Similar Products</h2>

        {similarProducts.length === 0 ? (
          <p className="text-muted-foreground">No similar products found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {similarProducts.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <Image
                  src={item.images[0]?.imageUrl || "/placeholder.jpg"}
                  alt={item.title}
                  width={300}
                  height={300}
                  className="h-48 w-full object-cover"
                />

                <CardContent className="space-y-3 p-4">
                  <h3 className="line-clamp-2 font-semibold">{item.title}</h3>

                  <p className="text-xl font-bold text-green-600">
                    ₹{new Intl.NumberFormat("en-IN").format(item.price)}
                  </p>

                  <Link href={`/products/${item.id}`}>
                    <Button variant="secondary" className="w-full">
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
  );
}
