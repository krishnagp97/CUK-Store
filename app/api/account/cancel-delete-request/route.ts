import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
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
      { message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  if (!user.deleteRequested) {
    return NextResponse.json(
      { message: "No deletion request found." },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      deleteRequested: false,
      deleteScheduledAt: null,
    },
  });

  return NextResponse.json({
    message: "Deletion request cancelled successfully.",
  });
}
