import type { Metadata } from "next";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: {
    default: "Void Space - Thoughts from the Digital Void",
    template: "%s | Void Space",
  },
  description:
    "A contemplative space for deep thoughts, mindful reflections, and meaningful connections. Exploring consciousness, technology, and the spaces between thoughts.",
  keywords: [
    "blog",
    "mindfulness",
    "deep work",
    "consciousness",
    "technology",
    "philosophy",
    "contemplation",
    "digital minimalism",
    "void space",
    "thoughts",
    "reflection",
  ],
  authors: [
    {
      name: "Vedant Karle",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://voidd.space",
    },
  ],
  creator: "Vedant Karle",
  publisher: "Void Space",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://voidd.space",
    siteName: "Void Space",
    title: "Void Space - Thoughts from the Digital Void",
    description:
      "A contemplative space for deep thoughts, mindful reflections, and meaningful connections.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Void Space - Contemplative Digital Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Void Space - Thoughts from the Digital Void",
    description:
      "A contemplative space for deep thoughts, mindful reflections, and meaningful connections.",
    images: ["/og-image.png"],
    creator: "@vedantkarle",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://voidd.space",
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <StructuredData type="website" />
        <meta
          name="google-site-verification"
          content="ywG3RmuPUwxbykDYfGPTIa4mPj6GYx69os1RNGyrcHQ"
        />
      </head>
      <body className="bg-void-black text-void-text antialiased">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
