import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
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