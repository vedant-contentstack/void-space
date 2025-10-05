import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/supabase-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://voidd.space";

  try {
    // Get all published blog posts
    const posts = await getAllBlogPosts();

    // Generate sitemap entries for blog posts
    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || post.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
    ];

    return [...staticPages, ...blogPosts];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback sitemap with just the homepage and blog
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
    ];
  }
}
