import { products } from "@/lib/products";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Heart,
  MapPin,
  MessageCircle,
  Star,
  User,
} from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <div className="grid gap-10 lg:grid-cols-2">

        {/* Left */}

        <div>

          <div className="overflow-hidden rounded-2xl border bg-muted">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={700}
              height={700}
              className="h-125 w-full object-cover"
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4">

            {product.images.map((image, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border"
              >
                <Image
                  src={image}
                  alt=""
                  width={200}
                  height={200}
                  className="h-32 w-full object-cover"
                />
              </div>
            ))}

          </div>

        </div>

        {/* Right */}

        <div className="space-y-6">

          <Badge>{product.category}</Badge>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-4xl font-bold text-green-600">
            ₹{product.price.toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-3">

            <Badge variant="secondary">
              {product.condition}
            </Badge>

            <Badge variant="outline">
              <MapPin className="mr-1 h-4 w-4" />
              {product.location}
            </Badge>

          </div>

          <Card>

            <CardContent className="space-y-4 p-6">

              <h2 className="text-xl font-semibold">
                Description
              </h2>

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

                  <h3 className="font-semibold">
                    {product.seller.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Joined {product.seller.joined}
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

          <div className="flex gap-4">

            <Button
              size="lg"
              className="flex-1"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat Seller
            </Button>

            <Button
              size="lg"
              variant="outline"
            >
              <Heart className="mr-2 h-5 w-5" />
              Wishlist
            </Button>

          </div>

        </div>

      </div>

      {/* Similar Products */}

      <section className="mt-20">

        <h2 className="mb-8 text-3xl font-bold">
          Similar Products
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {products
            .filter((p) => p.id !== product.id)
            .map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden"
              >
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="h-48 w-full object-cover"
                />

                <CardContent className="space-y-2 p-4">

                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-xl font-bold text-green-600">
                    ₹{item.price.toLocaleString()}
                  </p>

                  <Button
                    variant="secondary"
                    className="w-full"
                  >
                    View Details
                  </Button>

                </CardContent>
              </Card>
            ))}

        </div>

      </section>

    </div>
  );
}