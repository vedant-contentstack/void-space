import { NextRequest, NextResponse } from "next/server";
import { getPendingComments } from "@/lib/supabase-service";

export async function GET(request: NextRequest) {
  try {
    // Check API key authentication
    const authHeader = request.headers.get("authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (!apiKey || apiKey !== process.env.NEWSLETTER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pendingComments = await getPendingComments();

    // Serialize dates for JSON response
    const serializedComments = pendingComments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      comments: serializedComments,
      count: serializedComments.length,
    });
  } catch (error: any) {
    console.error("Error fetching pending comments:", error);

    return NextResponse.json(
      { error: "Failed to fetch pending comments" },
      { status: 500 }
    );
  }
}
