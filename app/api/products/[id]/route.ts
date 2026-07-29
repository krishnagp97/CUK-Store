import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProductSchema } from "@/lib/validators/product";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();
    const values = ProductSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    if (product.sellerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.productImage.deleteMany({
      where: {
        productId: id,
      },
    });

    const updatedProduct = await prisma.product.update({
      where: { id },

      data: {
        title: values.title,
        description: values.description,
        price: values.price,
        category: values.category,

        images: {
          create: values.images.map((image) => ({
            imageUrl: image.imageUrl,
            publicId: image.publicId,
          })),
        },
      },

      include: {
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.productImage.deleteMany({
      where: {
        productId: id,
      },
    });
    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 },
    );
  }
}
