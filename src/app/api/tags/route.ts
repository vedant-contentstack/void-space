import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/supabase-service";

export async function GET() {
  try {
    const posts = await getAllBlogPosts();

    // Extract all unique tags with their counts
    const tagCounts = posts.reduce((acc, post) => {
      post.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by count (descending)
    const sortedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(sortedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
