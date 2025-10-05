import { NextResponse } from "next/server";
import { incrementPostViews } from "@/lib/supabase-service";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const result = await incrementPostViews(params.slug);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { error: "Failed to increment views" },
      { status: 500 }
    );
  }
}
