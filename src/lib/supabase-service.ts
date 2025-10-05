import { supabase } from "./supabase";
import { BlogPost } from "@/types";

// Helper function to get post UUID from slug
export async function getPostUUIDFromSlug(
  slug: string
): Promise<string | null> {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data?.id || null;
}

export async function incrementPostViews(slug: string) {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  // Use PostgreSQL function for atomic increment
  const { data, error } = await supabase.rpc("increment_post_views", {
    post_slug: slug,
  });

  if (error) throw error;
  return { views: data };
}

// New functions to fetch blog posts directly from Supabase
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id, slug, title, excerpt, content, banner_image, category, tags,
      published_at, reading_time, is_published, is_draft, created_at, updated_at,
      views,
      author:users(id, username, display_name, bio, created_at)
    `
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching all blog posts:", error);
    throw error;
  }

  return data.map((post: any) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    bannerImage: post.banner_image,
    authorId: post.author.id,
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
    publishedAt: post.published_at ? new Date(post.published_at) : undefined,
    readingTime: post.reading_time,
    category: post.category,
    tags: post.tags || [],
    isPublished: post.is_published,
    isDraft: post.is_draft,
    views: post.views || 0,
  }));
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `
      id, slug, title, excerpt, content, banner_image, category, tags,
      published_at, reading_time, is_published, is_draft, created_at, updated_at,
      views,
      author:users(id, username, display_name, bio, created_at)
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    bannerImage: data.banner_image,
    authorId: data.author.id,
    author: {
      id: data.author.id,
      username: data.author.username,
      displayName: data.author.display_name,
      bio: data.author.bio || "",
      createdAt: new Date(data.author.created_at),
      preferences: {
        typography: "mono",
        enableSeasonalThemes: true,
        enableSilenceAppreciation: true,
        enableBreathingSpace: true,
      },
    },
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    publishedAt: data.published_at ? new Date(data.published_at) : undefined,
    readingTime: data.reading_time,
    category: data.category,
    tags: data.tags || [],
    isPublished: data.is_published,
    isDraft: data.is_draft,
    views: data.views || 0,
  };
}

export async function getUniqueTagsWithCounts(): Promise<
  { tag: string; count: number }[]
> {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { data, error } = await supabase.rpc("get_unique_tags_with_counts");

  if (error) {
    console.error("Error fetching unique tags with counts:", error);
    throw error;
  }

  return data;
}

// Newsletter Management
export async function subscribeToNewsletter(email: string) {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if subscriber already exists
  const { data: existingSubscriber, error: checkError } = await supabase
    .from("newsletter_subscribers")
    .select("email, is_active")
    .eq("email", normalizedEmail)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    throw checkError;
  }

  if (existingSubscriber) {
    if (existingSubscriber.is_active) {
      throw new Error("Email is already subscribed");
    } else {
      // Reactivate inactive subscriber
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .update({
          is_active: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
        })
        .eq("email", normalizedEmail)
        .select()
        .single();

      if (error) throw error;
      return { data, reactivated: true };
    }
  } else {
    // Create new subscriber
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: normalizedEmail,
        subscribed_at: new Date().toISOString(),
        is_active: true,
        source: "website",
      })
      .select()
      .single();

    if (error) throw error;
    return { data, reactivated: false };
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { data, error } = await supabase.rpc("unsubscribe_newsletter", {
    subscriber_email: email.toLowerCase().trim(),
  });

  if (error) throw error;
  return data;
}

export async function getNewsletterStats() {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const { data, error } = await supabase.rpc("get_newsletter_stats");

  if (error) throw error;
  return data[0]; // Function returns a single row
}
