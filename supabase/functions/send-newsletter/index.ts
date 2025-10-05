// Supabase Edge Function to send newsletter when posts are published
// This runs on Supabase's edge runtime and can make HTTP requests

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { postSlug, apiKey } = await req.json();

    // Validate required fields
    if (!postSlug) {
      return new Response(JSON.stringify({ error: "Post slug is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get environment variables
    const NEWSLETTER_API_KEY = Deno.env.get("NEWSLETTER_API_KEY");
    const SITE_URL = Deno.env.get("SITE_URL") || "https://voidd.space";

    // Verify API key
    if (apiKey !== NEWSLETTER_API_KEY) {
      return new Response(JSON.stringify({ error: "Invalid API key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`📧 Sending newsletter for post: ${postSlug}`);

    // Call your newsletter API
    const response = await fetch(`${SITE_URL}/api/newsletter/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postSlug,
        apiKey,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Newsletter sent successfully for ${postSlug}`);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Newsletter sent successfully",
          data,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      console.error(
        `❌ Failed to send newsletter for ${postSlug}:`,
        data.error
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: data.error || "Failed to send newsletter",
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Newsletter edge function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
