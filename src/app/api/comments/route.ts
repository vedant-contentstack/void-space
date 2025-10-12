import { NextRequest, NextResponse } from "next/server";
import { submitComment } from "@/lib/supabase-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, guestName, content } = body;

    // Validation
    if (!postSlug || typeof postSlug !== "string") {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    if (
      !guestName ||
      typeof guestName !== "string" ||
      guestName.trim().length === 0
    ) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Additional validation
    const trimmedName = guestName.trim();
    const trimmedContent = content.trim();

    if (trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Name must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 2000) {
      return NextResponse.json(
        { error: "Comment must be 2000 characters or less" },
        { status: 400 }
      );
    }

    if (trimmedContent.length < 1) {
      return NextResponse.json(
        { error: "Comment must be at least 1 character" },
        { status: 400 }
      );
    }

    // Basic spam prevention - check for URLs in name
    if (trimmedName.includes("http") || trimmedName.includes("www.")) {
      return NextResponse.json(
        { error: "URLs are not allowed in names" },
        { status: 400 }
      );
    }

    // Get IP address for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip");

    // Submit comment
    const result = await submitComment(
      postSlug,
      trimmedName,
      trimmedContent,
      ip || undefined
    );

    return NextResponse.json({
      success: true,
      message:
        "Comment submitted successfully! It will appear after moderation.",
      commentId: result.commentId,
    });
  } catch (error: any) {
    console.error("Error submitting comment:", error);

    // Handle specific errors
    if (error.message?.includes("Rate limit exceeded")) {
      return NextResponse.json(
        { error: "You're commenting too frequently. Please wait a moment." },
        { status: 429 }
      );
    }

    if (error.message?.includes("Post not found")) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to submit comment. Please try again." },
      { status: 500 }
    );
  }
}
