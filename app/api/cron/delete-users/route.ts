import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req: Request) {
  // Protect the endpoint
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const users = await prisma.user.findMany({
    where: {
      deleteRequested: true,
      deleteScheduledAt: {
        lte: now,
      },
    },
    select: {
      id: true,
    },
  });

  for (const user of users) {
    // Delete related data first
    await prisma.product.deleteMany({
      where: {
        sellerId: user.id,
      },
    });

    await prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // await prisma.message.deleteMany({
    //   where: {
    //     userId: user.id,
    //   },
    // });

    // Finally delete the user
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }

  return NextResponse.json({
    deletedUsers: users.length,
  });
}