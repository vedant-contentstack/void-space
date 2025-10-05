import { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/supabase-service";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://voidd.space";
    const resolvedParams = await params;
    const post = await getBlogPostBySlug(resolvedParams.slug);

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const publishedDate = post.publishedAt || post.createdAt;
    const modifiedDate = post.updatedAt || publishedDate;

    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags,
      authors: [{ name: post.author.displayName }],
      creator: post.author.displayName,
      publisher: "Void Space",
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
        type: "article",
        locale: "en_US",
        url: `${baseUrl}/blog/${resolvedParams.slug}`,
        siteName: "Void Space",
        title: post.title,
        description: post.excerpt,
        publishedTime: publishedDate.toISOString(),
        modifiedTime: modifiedDate.toISOString(),
        authors: [post.author.displayName],
        tags: post.tags,
        images: post.bannerImage
          ? [
              {
                url: post.bannerImage,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : [
              {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: post.bannerImage ? [post.bannerImage] : ["/og-image.png"],
        creator: "@vedantkarle",
      },
      alternates: {
        canonical: `${baseUrl}/blog/${resolvedParams.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "A thoughtful post from the void space.",
    };
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
