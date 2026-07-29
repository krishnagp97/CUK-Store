import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WishlistPageComponent from "@/components/wishList/wishListPageComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function WishlistPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold">Please sign in</h1>
        <p className="mt-2 text-muted-foreground">
          Login to view your wishlist.
        </p>

        <Button asChild className="mt-6">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  const wishlist = await prisma.wishlist.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      product: {
        include: {
          images: {
            take: 1,
          },
          seller: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <WishlistPageComponent wishlist={wishlist} />;
}