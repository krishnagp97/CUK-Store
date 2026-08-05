import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/validations/product";

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

        wishlists: {
          where: {
            userId: session?.user.id ?? "",
          },
          select: {
            id: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;

    if (products.length > limit) {
      const nextItem = products.pop();
      nextCursor = nextItem!.id;
    }

    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      createdAt: product.createdAt,
      images: product.images,
      seller: product.seller,
      isWishlisted: product.wishlists.length > 0,
    }));

    return NextResponse.json(
      {
        products: formattedProducts,
        nextCursor,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
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

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create Product Error:", error);

    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 },
    );
  }
}
