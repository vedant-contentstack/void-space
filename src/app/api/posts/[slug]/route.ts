import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/supabase-service";

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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    // Load post from Supabase
    const post = await getBlogPostBySlug(resolvedParams.slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const serializedPost = serializeDates(post);
    return NextResponse.json(serializedPost);
  } catch (error) {
    console.error("Error loading post:", error);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}
