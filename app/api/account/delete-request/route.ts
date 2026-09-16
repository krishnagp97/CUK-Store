import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteRequestRateLimiter } from "@/lib/rate-limit";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { success } = await deleteRequestRateLimiter.limit(session.user.id);

  if (!success) {
    return NextResponse.json(
      {
        message: "Too many deletion requests. Please try again later.",
      },
      { status: 429 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      deleteRequested: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  if (user.deleteRequested) {
    return NextResponse.json(
      {
        message: "Account deletion is already scheduled.",
      },
      { status: 409 },
    );
  }

  const deleteDate = new Date();
  deleteDate.setDate(deleteDate.getDate() + 30);

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      deleteRequested: true,
      deleteScheduledAt: deleteDate,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Account scheduled for deletion.",
  });
}
