import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail, generateWelcomeEmail } from "@/lib/email-service";
import { getBaseUrlFromRequest } from "@/lib/url-utils";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!supabase) {
      // For demo mode, just return success
      return NextResponse.json({
        message:
          "Successfully subscribed! (Demo mode - no email was actually stored)",
      });
    }

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("email, is_active, subscribed_at")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new subscribers
      return NextResponse.json(
        { error: "Database error. Please try again later." },
        { status: 500 }
      );
    }

    let data;

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        // Already active subscriber
        return NextResponse.json(
          { error: "This email is already subscribed to our newsletter" },
          { status: 409 }
        );
      } else {
        // Reactivate inactive subscriber
        const { data: reactivatedData, error: reactivateError } = await supabase
          .from("newsletter_subscribers")
          .update({
            is_active: true,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
          })
          .eq("email", email.toLowerCase().trim())
          .select()
          .single();

        if (reactivateError) {
          return NextResponse.json(
            {
              error:
                "Failed to reactivate subscription. Please try again later.",
            },
            { status: 500 }
          );
        }

        data = reactivatedData;
      }
    } else {
      // Add new subscriber
      const { data: newData, error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: email.toLowerCase().trim(),
          subscribed_at: new Date().toISOString(),
          is_active: true,
          source: "website",
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: "Failed to subscribe. Please try again later." },
          { status: 500 }
        );
      }

      data = newData;
    }

    // Send welcome email
    try {
      const baseUrl = getBaseUrlFromRequest(request);
      const { html, text } = generateWelcomeEmail(data.email, baseUrl);
      const emailResult = await sendEmail({
        to: data.email,
        subject: "Welcome to the Void Space",
        html,
        text,
      });

      if (!emailResult.success) {
        // Don't fail the subscription if email fails
      }
    } catch (emailError) {
      // Don't fail the subscription if email fails
    }

    const isReactivation = existingSubscriber && !existingSubscriber.is_active;

    return NextResponse.json({
      message: isReactivation
        ? "Welcome back to the void! Your subscription has been reactivated. Check your email for confirmation."
        : "Successfully subscribed! Welcome to the void. Check your email for confirmation.",
      subscriber: {
        email: data.email,
        subscribedAt: data.subscribed_at,
      },
      reactivated: isReactivation,
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
