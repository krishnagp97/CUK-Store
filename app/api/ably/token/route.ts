import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ably } from "@/lib/ably";

export async function GET() {
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

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: session.user.id,
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("Ably token error:", error);

    return NextResponse.json(
      { error: "Failed to generate Ably token" },
      { status: 500 }
    );
  }
}