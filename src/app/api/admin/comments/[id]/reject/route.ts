import { NextRequest, NextResponse } from "next/server";
import { rejectComment } from "@/lib/supabase-service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check API key authentication
    const authHeader = request.headers.get("authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (!apiKey || apiKey !== process.env.NEWSLETTER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;

    if (!resolvedParams.id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const result = await rejectComment(resolvedParams.id);

    if (!result.success) {
      return NextResponse.json(
        { error: "Comment not found or already moderated" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment rejected successfully",
    });
  } catch (error: any) {
    console.error("Error rejecting comment:", error);

    return NextResponse.json(
      { error: "Failed to reject comment" },
      { status: 500 }
    );
  }
}
