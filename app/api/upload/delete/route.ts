import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { uploadRateLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } = await uploadRateLimiter.limit(session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: "Too many image deletion requests. Please try again later." },
        { status: 429 },
      );
    }
    
    const { public_id } = await req.json();

    if (!public_id || typeof public_id !== "string") {
      return NextResponse.json(
        { message: "public_id is required" },
        { status: 400 },
      );
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json(
        { message: "Failed to delete image", result },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Deleted", result }, { status: 200 });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);

    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 },
    );
  }
}
