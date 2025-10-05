import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail, generateNewsletterEmail } from "@/lib/email-service";
import { getBlogPostBySlug } from "@/lib/supabase-service";
import { getBaseUrlFromRequest } from "@/lib/url-utils";

export async function POST(request: Request) {
  try {
    const { postSlug, apiKey } = await request.json();

    // Simple API key protection (you should set NEWSLETTER_API_KEY in your env)
    if (!apiKey || apiKey !== process.env.NEWSLETTER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!postSlug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    // Get the blog post
    const post = await getBlogPostBySlug(postSlug);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json({
        message: "Newsletter sending simulated (Demo mode)",
        post: post.title,
      });
    }

    // Get all active newsletter subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("is_active", true);

    if (subscribersError) {
      return NextResponse.json(
        { error: "Failed to fetch subscribers" },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        message: "No active subscribers found",
        count: 0,
      });
    }

    // Send emails to all subscribers
    const baseUrl = getBaseUrlFromRequest(request);
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        const { html, text } = generateNewsletterEmail(
          subscriber.email,
          {
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            author: post.author.displayName,
            publishedAt: (post.publishedAt || post.createdAt).toISOString(),
            bannerImage: post.bannerImage,
          },
          baseUrl
        );

        const result = await sendEmail({
          to: subscriber.email,
          subject: `New from Void Space: ${post.title}`,
          html,
          text,
        });

        return {
          email: subscriber.email,
          success: result.success,
          error: result.error,
        };
      } catch (error) {
        return {
          email: subscriber.email,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `Newsletter sent to ${successful} subscribers`,
      stats: {
        total: subscribers.length,
        successful,
        failed,
      },
      post: {
        title: post.title,
        slug: post.slug,
      },
      failures: failed > 0 ? results.filter((r) => !r.success) : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
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
