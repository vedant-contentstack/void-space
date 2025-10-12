import { NextRequest, NextResponse } from "next/server";
import { getAllComments } from "@/lib/supabase-service";

export async function GET(request: NextRequest) {
  try {
    // Check API key authentication
    const authHeader = request.headers.get("authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (!apiKey || apiKey !== process.env.NEWSLETTER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allComments = await getAllComments();

    // Serialize dates for JSON response
    const serializedComments = allComments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      moderatedAt: comment.moderatedAt?.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      comments: serializedComments,
      count: serializedComments.length,
    });
  } catch (error: any) {
    console.error("Error fetching all comments:", error);

    return NextResponse.json(
      { error: "Failed to fetch all comments" },
      { status: 500 }
    );
  }
}
