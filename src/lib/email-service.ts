import { Resend } from "resend";
import { convertGoogleDriveUrlForEmail } from "./image-utils";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Email service not configured" };
  }

  try {
    // Use a verified domain or Resend's test domain for development
    const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
      text: text || stripHtml(html),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    return { success: false, error: "Failed to send email" };
  }
}

// Simple HTML to text converter
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Welcome email template
export function generateWelcomeEmail(
  email: string,
  baseUrl?: string
): {
  html: string;
  text: string;
} {
  const siteUrl = baseUrl || "https://voidd.space";
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="format-detection" content="telephone=no">
      <title>Welcome to the Void</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #e5e7eb;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        .email-wrapper {
          background-color: #f8fafc;
          padding: 40px 20px;
          min-height: 100vh;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #0a0a0a;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .header {
          text-align: center;
          padding: 40px 32px 20px;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
        }
        .logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #4a9eff, #60a5fa);
          border-radius: 20px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(74, 158, 255, 0.3);
        }
        .logo-dot {
          width: 24px;
          height: 24px;
          background-color: #0a0a0a;
          border-radius: 50%;
        }
        h1 {
          color: #ffffff;
          font-size: 32px;
          font-weight: 300;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .accent {
          color: #4a9eff;
          font-weight: 500;
        }
        .content {
          padding: 40px 32px;
          background-color: #0a0a0a;
        }
        .welcome-text {
          font-size: 20px;
          color: #d1d5db;
          margin-bottom: 32px;
          text-align: center;
          font-weight: 500;
        }
        .description {
          color: #9ca3af;
          margin-bottom: 28px;
          line-height: 1.7;
          font-size: 16px;
        }
        .cta {
          text-align: center;
          margin: 40px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #4a9eff, #60a5fa);
          color: #ffffff !important;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 14px rgba(74, 158, 255, 0.4);
          transition: all 0.2s ease;
        }
        .button:hover {
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          box-shadow: 0 6px 20px rgba(74, 158, 255, 0.5);
          transform: translateY(-1px);
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          padding: 32px;
          background-color: #111827;
          border-top: 1px solid #374151;
        }
        .footer a {
          color: #4a9eff;
          text-decoration: none;
        }
        .footer a:hover {
          color: #60a5fa;
          text-decoration: underline;
        }
        .quote {
          font-style: italic;
          color: #d1d5db;
          text-align: center;
          margin: 32px 0;
          padding: 24px;
          border-left: 4px solid #4a9eff;
          background: linear-gradient(135deg, #111827, #1f2937);
          border-radius: 12px;
          font-size: 18px;
          position: relative;
        }
        .quote::before {
          content: '"';
          font-size: 48px;
          color: #4a9eff;
          position: absolute;
          top: -8px;
          left: 16px;
          font-family: Georgia, serif;
        }
        .quote::after {
          content: '"';
          font-size: 48px;
          color: #4a9eff;
          position: absolute;
          bottom: -24px;
          right: 16px;
          font-family: Georgia, serif;
        }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .container {
            border-radius: 16px;
          }
          .header {
            padding: 32px 24px 16px;
          }
          .content {
            padding: 32px 24px;
          }
          .footer {
            padding: 24px;
          }
          h1 {
            font-size: 28px;
          }
          .welcome-text {
            font-size: 18px;
          }
          .logo {
            width: 70px;
            height: 70px;
          }
          .logo-dot {
            width: 20px;
            height: 20px;
          }
          .button {
            padding: 14px 28px;
            font-size: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">
              <div class="logo-dot"></div>
            </div>
            <h1>Welcome to the <span class="accent">Void</span></h1>
            <p style="color: #9ca3af; font-size: 14px; margin: 8px 0 0 0; font-weight: 500;">by vedant karle</p>
          </div>

          <div class="content">
          <div class="welcome-text">
            Thank you for joining our contemplative community
          </div>

          <div class="description">
            You've successfully subscribed to the void space newsletter. You'll now receive notifications when new thoughts, reflections, and insights emerge from the depths of digital contemplation.
          </div>

          <div class="quote">
            "In the space between thoughts, infinite possibilities emerge."
          </div>

          <div class="description">
            The void space is more than a blog—it's a digital sanctuary for those who seek meaning in our connected world. Each post is crafted with intention, exploring the intersections of consciousness, technology, and the human experience.
          </div>

          <div class="cta">
            <a href="${siteUrl}/blog" class="button">Explore the Void</a>
          </div>
        </div>

          <div class="footer">
            <p style="color: #60a5fa;">You're receiving this because you subscribed to the void space newsletter.</p>
            <p>
              <a href="${unsubscribeUrl}">Unsubscribe</a> | 
              <a href="${siteUrl}">Visit Void Space</a>
            </p>
            <p>© 2025 Void Space. For the People, By the People!</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to the Void

Thank you for joining our contemplative community!

You've successfully subscribed to the void space newsletter. You'll now receive notifications when new thoughts, reflections, and insights emerge from the depths of digital contemplation.

"In the space between thoughts, infinite possibilities emerge."

The void space is more than a blog—it's a digital sanctuary for those who seek meaning in our connected world. Each post is crafted with intention, exploring the intersections of consciousness, technology, and the human experience.

Explore the Void: ${siteUrl}/blog

---

You're receiving this because you subscribed to the void space newsletter.
Unsubscribe: ${unsubscribeUrl}
Visit Void Space: ${siteUrl}

© 2024 Void Space. Crafted with intention in the digital void.
  `;

  return { html, text };
}

// Newsletter email template for blog posts
export function generateNewsletterEmail(
  email: string,
  post: {
    title: string;
    excerpt: string;
    slug: string;
    author: string;
    publishedAt: string;
    bannerImage?: string;
  },
  baseUrl?: string
): { html: string; text: string } {
  const siteUrl = baseUrl || "https://voidd.space";
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(
    email
  )}`;
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="format-detection" content="telephone=no">
      <title>New Thought from the Void</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #e5e7eb;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        .email-wrapper {
          background-color: #f8fafc;
          padding: 40px 20px;
          min-height: 100vh;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #0a0a0a;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .header {
          text-align: center;
          padding: 32px 32px 16px;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
        }
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #4a9eff, #60a5fa);
          border-radius: 16px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 24px rgba(74, 158, 255, 0.3);
        }
        .logo-dot {
          width: 18px;
          height: 18px;
          background-color: #0a0a0a;
          border-radius: 50%;
        }
        .tagline {
          color: #9ca3af;
          font-size: 15px;
          margin: 0;
          font-weight: 500;
        }
        .content {
          padding: 40px 32px;
          background-color: #0a0a0a;
        }
        .new-post {
          color: #4a9eff;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          text-align: center;
        }
        h1 {
          color: #ffffff;
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 20px 0;
          line-height: 1.3;
          text-align: center;
          letter-spacing: -0.5px;
        }
        .meta {
          color: #6b7280;
          font-size: 15px;
          margin-bottom: 28px;
          text-align: center;
        }
        .excerpt {
          color: #d1d5db;
          font-size: 17px;
          line-height: 1.7;
          margin-bottom: 36px;
          text-align: center;
        }
        .cta {
          text-align: center;
          margin: 40px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #4a9eff, #60a5fa);
          color: #ffffff !important;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 14px rgba(74, 158, 255, 0.4);
          transition: all 0.2s ease;
        }
        .button:hover {
          background: linear-gradient(135deg, #60a5fa, #3b82f6);
          box-shadow: 0 6px 20px rgba(74, 158, 255, 0.5);
          transform: translateY(-1px);
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          padding: 32px;
          background-color: #111827;
          border-top: 1px solid #374151;
        }
        .footer a {
          color: #4a9eff;
          text-decoration: none;
        }
        .footer a:hover {
          color: #60a5fa;
          text-decoration: underline;
        }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .container {
            border-radius: 16px;
          }
          .header {
            padding: 24px 20px 12px;
          }
          .content {
            padding: 32px 24px;
          }
          .footer {
            padding: 24px;
          }
          h1 {
            font-size: 24px;
          }
          .logo {
            width: 50px;
            height: 50px;
          }
          .logo-dot {
            width: 16px;
            height: 16px;
          }
          .button {
            padding: 14px 28px;
            font-size: 15px;
          }
          .excerpt {
            font-size: 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <div class="header">
            <div class="logo">
              <div class="logo-dot"></div>
            </div>
            <p class="tagline">New thought from the void space</p>
            <p style="color: #9ca3af; font-size: 13px; margin: 4px 0 0 0; font-weight: 500;">by ${
              post.author
            }</p>
          </div>

          <div class="content">
          <div class="new-post">New Post</div>
          <h1>${post.title}</h1>
          <div class="meta">By ${post.author} • ${new Date(
    post.publishedAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}</div>

          ${
            post.bannerImage
              ? `
          <div style="text-align: center; margin: 24px 0;">
            <img src="${convertGoogleDriveUrlForEmail(
              post.bannerImage
            )}" alt="${
                  post.title
                }" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid #374151;" />
          </div>
          `
              : ""
          }

          <div class="excerpt">${post.excerpt}</div>
          <div class="cta">
            <a href="${postUrl}" class="button">Read Full Post</a>
          </div>
        </div>

          <div class="footer">
            <p style="color: #60a5fa;">You're receiving this because you subscribed to the void space newsletter.</p>
            <p>
              <a href="${unsubscribeUrl}">Unsubscribe</a> | 
              <a href="${siteUrl}">Visit Void Space</a>
            </p>
            <p>© 2025 Void Space. For the People, By the People!</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Thought from the Void Space

${post.title}

By ${post.author} • ${new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

${post.excerpt}

Read the full post: ${postUrl}

---

You're receiving this because you subscribed to the void space newsletter.
Unsubscribe: ${unsubscribeUrl}
Visit Void Space: ${siteUrl}
  `;

  return { html, text };
}
