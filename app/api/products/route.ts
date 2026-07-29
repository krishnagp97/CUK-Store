import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/validators/product";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be signed in to create a listing" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = ProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid product data", errors: parsed.error.flatten() },
        { status: 400 }
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
      include: {
        images: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create Product Error:", error);

    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}