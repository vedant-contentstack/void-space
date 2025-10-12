import { NextRequest, NextResponse } from "next/server";
import { incrementPostResonates } from "@/lib/supabase-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;

    if (!resolvedParams.slug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    const result = await incrementPostResonates(resolvedParams.slug);

    return NextResponse.json({
      success: true,
      resonates: result.resonates,
    });
  } catch (error: any) {
    console.error("Error incrementing post resonates:", error);

    if (error.message?.includes("not found")) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to increment resonates" },
      { status: 500 }
    );
  }
}
