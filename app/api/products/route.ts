import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/validations/product";
import { productCreateRateLimiter } from "@/lib/rate-limit";
import { getCache, setCache } from "@/lib/cache";
import { deleteCacheByPattern } from "@/lib/cache";

type CachedProduct = {
  id: string;
  title: string;
  price: number;
  category: string;
  createdAt: Date | string;
  images: {
    imageUrl: string;
  }[];
  seller: {
    id: string;
    name: string | null;
  };
};

type CachedProducts = {
  products: CachedProduct[];
  nextCursor: string | null;
};

async function addWishlistStatus(data: CachedProducts, userId?: string) {
  let wishlistedProductIds = new Set<string>();

  if (userId && data.products.length > 0) {
    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId,
        productId: {
          in: data.products.map((product) => product.id),
        },
      },
      select: {
        productId: true,
      },
    });

    wishlistedProductIds = new Set(
      wishlists.map((wishlist) => wishlist.productId),
    );
  }

  return {
    products: data.products.map((product) => ({
      ...product,
      isWishlisted: wishlistedProductIds.has(product.id),
    })),
    nextCursor: data.nextCursor,
  };
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";

    const requestedLimit = Number(searchParams.get("limit"));

    const limit = Number.isFinite(requestedLimit)
      ? Math.max(1, Math.min(requestedLimit, 50))
      : 12;

    const cacheKey = `products:${search}:${category}:${cursor ?? "none"}:${limit}`;

    const cachedProducts = await getCache<CachedProducts>(cacheKey);

    if (cachedProducts) {
      const responseData = await addWishlistStatus(
        cachedProducts,
        session?.user?.id,
      );

      return NextResponse.json(responseData, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
      
    }

    const products = await prisma.product.findMany({
      take: limit + 1,

      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),

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

      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],

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
            id: true,
            name: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;

    if (products.length > limit) {
      const nextItem = products.pop();
      nextCursor = nextItem!.id;
    }

    const cacheData: CachedProducts = {
      products,
      nextCursor,
    };

    await setCache(cacheKey, cacheData, 300);

    const responseData = await addWishlistStatus(cacheData, session?.user?.id);

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch products",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be signed in to create a listing" },
        { status: 401 },
      );
    }

    const { success } = await productCreateRateLimiter.limit(session.user.id);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many listings created. Please try again later.",
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = ProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid product data", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { title, description, price, category, images } = parsed.data;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category,
        sellerId: session.user.id,
        images: {
          create: images.map((img) => ({
            imageUrl: img.imageUrl,
            publicId: img.publicId,
          })),
        },
      },
      select: {
        id: true,
        title: true,
        images: true,
      },
    });
    await deleteCacheByPattern("products:*");
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create Product Error:", error);

    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 },
    );
  }
}
