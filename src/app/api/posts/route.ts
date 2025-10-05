import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper function to serialize dates properly
function serializeDates(obj: any): any {
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeDates);
  }
  if (obj && typeof obj === "object") {
    const serialized: any = {};
    for (const key in obj) {
      serialized[key] = serializeDates(obj[key]);
    }
    return serialized;
  }
  return obj;
}

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Fetch all published posts with author info and stats
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        author:users(id, username, display_name, bio, avatar_url, created_at)
      `
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch posts from database" },
        { status: 500 }
      );
    }

    // Transform Supabase data to match our BlogPost interface
    const transformedPosts =
      posts?.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        bannerImage: post.banner_image,
        authorId: post.author_id,
        author: {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.display_name,
          bio: post.author.bio || "",
          createdAt: new Date(post.author.created_at),
          preferences: {
            typography: "mono",
            enableSeasonalThemes: true,
            enableSilenceAppreciation: true,
            enableBreathingSpace: true,
          },
        },
        createdAt: new Date(post.created_at),
        updatedAt: post.updated_at ? new Date(post.updated_at) : undefined,
        publishedAt: post.published_at
          ? new Date(post.published_at)
          : undefined,
        readingTime: post.reading_time,
        category: post.category,
        tags: post.tags || [],
        isPublished: post.is_published,
        isDraft: post.is_draft,
        slug: post.slug,
        views: post.views || 0,
        comments: [], // Will be loaded separately when needed
        resonates: post.resonates || 0,
        resonatedBy: [], // Will be loaded separately when needed
      })) || [];

    const serializedPosts = serializeDates(transformedPosts);
    return NextResponse.json(serializedPosts);
  } catch (error) {
    console.error("Error loading posts:", error);
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 500 }
    );
  }
}
