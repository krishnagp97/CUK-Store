import { prisma } from "@/lib/prisma";

export async function getProducts() {
  return prisma.product.findMany({
    where: {
      status: "AVAILABLE",
    },

    include: {
      images: {
        take: 1,
      },
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}