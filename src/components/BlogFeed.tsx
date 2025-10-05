"use client";

import { BlogPost } from "@/types";
import BlogPostCard from "./BlogPostCard";
import { BookOpen } from "lucide-react";

interface BlogFeedProps {
  posts: BlogPost[];
  onReadPost: (postId: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function BlogFeed({
  posts,
  onReadPost,
  onTagClick,
}: BlogFeedProps) {
  const publishedPosts = posts.filter((post) => post.isPublished);

  if (publishedPosts.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-16 h-16 border border-void-gray rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen size={24} className="text-void-muted" />
        </div>
        <p className="text-void-muted font-mono text-sm">
          no posts found in this filter
        </p>
        <p className="text-void-muted-dark text-xs mt-2">
          try exploring different tags or clear your filters
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8 animate-fade-in-up">
        {/* Posts grid */}
        <div className="grid gap-8">
          {publishedPosts.map((post, index) => (
            <div
              key={post.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BlogPostCard
                post={post}
                onRead={onReadPost}
                onTagClick={onTagClick}
                showExcerpt={true}
              />
            </div>
          ))}
        </div>

        {/* End indicator */}
        {publishedPosts.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-void-dark/50 rounded-full border border-void-border">
              <div className="w-2 h-2 rounded-full bg-void-muted animate-pulse"></div>
              <p className="text-void-muted text-sm font-medium">
                you&apos;ve reached the beginning of time
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
