import { NextResponse } from "next/server";

/**
 * API endpoint to automatically send newsletter when a post is published
 * This can be called by your CMS, deployment hooks, or manually
 */
export async function POST(request: Request) {
  try {
    const { postSlug, apiKey } = await request.json();

    // Verify API key
    if (!apiKey || apiKey !== process.env.NEWSLETTER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!postSlug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    // Get the base URL for the request
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host") || "voidd.space";
    const baseUrl = `${protocol}://${host}`;

    // Call the newsletter send endpoint
    const newsletterResponse = await fetch(`${baseUrl}/api/newsletter/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postSlug,
        apiKey,
      }),
    });

    const newsletterData = await newsletterResponse.json();

    if (newsletterResponse.ok) {
      return NextResponse.json({
        message: "Post published and newsletter sent successfully",
        newsletter: newsletterData,
      });
    } else {
      return NextResponse.json(
        {
          message: "Post published but newsletter failed to send",
          error: newsletterData.error,
        },
        { status: 207 } // Multi-status: partial success
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to publish post and send newsletter" },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
