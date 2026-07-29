import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { public_id } = await req.json();

    if (!public_id || typeof public_id !== "string") {
      return NextResponse.json(
        { message: "public_id is required" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json(
        { message: "Failed to delete image", result },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Deleted", result }, { status: 200 });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);

    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    );
  }
}