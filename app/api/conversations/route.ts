import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find the product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Prevent seller from messaging themselves
    if (product.sellerId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot message yourself." },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        buyerId_productId: {
          buyerId: session.user.id,
          productId,
        },
      },
    });

    if (existingConversation) {
      return NextResponse.json({
        conversationId: existingConversation.id,
        exists: true,
      });
    }

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        buyerId: session.user.id,
        sellerId: product.sellerId,
        productId,
      },
    });

    return NextResponse.json({
      conversationId: conversation.id,
      exists: false,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}