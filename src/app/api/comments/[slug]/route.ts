import { NextRequest, NextResponse } from "next/server";
import { getApprovedCommentsByPostSlug } from "@/lib/supabase-service";

export async function GET(
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

    const comments = await getApprovedCommentsByPostSlug(resolvedParams.slug);

    // Serialize dates for JSON response
    const serializedComments = comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      comments: serializedComments,
      count: serializedComments.length,
    });
  } catch (error: any) {
    console.error("Error fetching comments:", error);

    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
