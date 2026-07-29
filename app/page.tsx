import { prisma } from "@/lib/prisma";
import HomePageComponent from "@/components/home/homePageComponent";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const products = await prisma.product.findMany({
    where: {
      status: "AVAILABLE",

      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(category && {
        category,
      }),
    },
    select: {
      id: true,
      title: true,
      price: true,
      category: true,
      createdAt: true,

      images: {
        take: 1,
        select: {
          imageUrl: true,
        },
      },

      seller: {
        select: {
          name: true,
        },
      },

      wishlists: {
        where: {
          userId: session?.user.id ?? "",
        },
        select: {
          id: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts = products.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    category: product.category,
    images: product.images,
    seller: product.seller,

    isWishlisted: product.wishlists.length > 0,
  }));
  return <HomePageComponent products={formattedProducts} />;
}
