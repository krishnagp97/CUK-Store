import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {MyListingsPageComponent} from "@/components/myListings/myListingsPageComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MyListingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold">Please sign in</h1>
        <p className="mt-2 text-muted-foreground">
          Login to view your product.
        </p>

        <Button asChild className="mt-6">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: {
      sellerId: session.user.id,
    },
    include: {
      images: {
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <MyListingsPageComponent
      products={products}
    />
  );
}