import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/supabase-service";

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

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  try {
    const tag = decodeURIComponent(params.tag);
    const allPosts = await getAllBlogPosts();

    // Filter posts by tag
    const filteredPosts = allPosts.filter((post) => post.tags.includes(tag));

    const serializedPosts = serializeDates(filteredPosts);
    return NextResponse.json(serializedPosts);
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts by tag" },
      { status: 500 }
    );
  }
}
