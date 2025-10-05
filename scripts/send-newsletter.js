#!/usr/bin/env node

/**
 * Script to automatically send newsletter for a published post
 * Usage: node scripts/send-newsletter.js <post-slug>
 *
 * You can also call this from:
 * - GitHub Actions
 * - Vercel deployment hooks
 * - Supabase database triggers
 * - Manual execution
 */

const https = require("https");

async function sendNewsletter(postSlug) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://voidd.space";
  const apiKey = process.env.NEWSLETTER_API_KEY;

  if (!apiKey) {
    console.error("❌ NEWSLETTER_API_KEY environment variable is required");
    process.exit(1);
  }

  if (!postSlug) {
    console.error("❌ Post slug is required");
    console.log("Usage: node scripts/send-newsletter.js <post-slug>");
    process.exit(1);
  }

  const payload = JSON.stringify({
    postSlug,
    apiKey,
  });

  const options = {
    hostname: new URL(baseUrl).hostname,
    port: 443,
    path: "/api/posts/publish",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    console.log(`📧 Sending newsletter for post: ${postSlug}`);

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);

          if (res.statusCode === 200) {
            console.log("✅ Newsletter sent successfully!");
            console.log(
              `📊 Stats: ${
                response.newsletter?.stats?.successful || 0
              } emails sent`
            );
            resolve(response);
          } else {
            console.error("❌ Failed to send newsletter:", response.error);
            reject(new Error(response.error));
          }
        } catch (error) {
          console.error("❌ Failed to parse response:", error.message);
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      console.error("❌ Request failed:", error.message);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// Get post slug from command line arguments
const postSlug = process.argv[2];

if (require.main === module) {
  sendNewsletter(postSlug)
    .then(() => {
      console.log("🎉 Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Error:", error.message);
      process.exit(1);
    });
}

module.exports = { sendNewsletter };
