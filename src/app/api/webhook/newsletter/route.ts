import { NextResponse } from "next/server";

/**
 * Webhook endpoint for triggering newsletter sends
 * Can be called by:
 * - Supabase database triggers
 * - External services (Zapier, Make.com, etc.)
 * - Manual API calls
 * - Cron jobs
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postSlug, apiKey, event } = body;

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

    // Log the event for debugging
    console.log(`📧 Newsletter webhook triggered for post: ${postSlug}`, {
      event,
      timestamp: new Date().toISOString(),
    });

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
        success: true,
        message: "Newsletter sent successfully via webhook",
        data: newsletterData,
        webhook: {
          postSlug,
          event,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Newsletter webhook failed",
          error: newsletterData.error,
          webhook: {
            postSlug,
            event,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Newsletter webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error in newsletter webhook",
      },
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: "Newsletter webhook endpoint is active",
    usage: {
      method: "POST",
      body: {
        postSlug: "your-post-slug",
        apiKey: "your-newsletter-api-key",
        event: "post_published", // optional
      },
    },
    timestamp: new Date().toISOString(),
  });
}
