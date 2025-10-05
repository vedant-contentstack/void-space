import { NextResponse } from "next/server";
import { unsubscribeFromNewsletter } from "@/lib/supabase-service";

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

    // Attempt to unsubscribe
    const result = await unsubscribeFromNewsletter(email);

    if (result) {
      console.log("Newsletter unsubscription:", email);
      return NextResponse.json({
        message: "Successfully unsubscribed from the newsletter.",
      });
    } else {
      return NextResponse.json(
        { error: "Email address not found or already unsubscribed" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Newsletter unsubscription error:", error);
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
