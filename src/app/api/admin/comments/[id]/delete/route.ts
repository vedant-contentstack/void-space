import { NextRequest, NextResponse } from "next/server";
import { deleteComment } from "@/lib/supabase-service";

export async function DELETE(
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

    const result = await deleteComment(resolvedParams.id);

    if (!result.success) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting comment:", error);

    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
