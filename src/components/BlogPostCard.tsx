"use client";

import { BlogPost } from "@/types";
import { Clock, Eye, Calendar, Tag, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogPostCardProps {
  post: BlogPost;
  onRead: (postId: string) => void;
  onTagClick?: (tag: string) => void;
  showExcerpt?: boolean;
}

export default function BlogPostCard({
  post,
  onRead,
  onTagClick,
  showExcerpt = true,
}: BlogPostCardProps) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(date);
  };

  return (
    <article
      className="group bg-void-dark/30 backdrop-blur-sm border border-void-border hover:border-void-border-light rounded-2xl p-6 transition-all duration-300 hover:bg-void-dark/50 cursor-pointer"
      onClick={() => {
        onRead(post.id);
        router.push(`/blog/${post.slug}`);
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-void-text group-hover:text-white transition-colors duration-200 mb-2 line-clamp-2">
            {post.title}
          </h2>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-void-muted-dark">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <time
                dateTime={
                  post.publishedAt?.toISOString() ||
                  post.createdAt.toISOString()
                }
              >
                {getTimeAgo(post.publishedAt || post.createdAt)}
              </time>
            </div>

            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readingTime} min journey</span>
            </div>

            {post.views && post.views > 0 && (
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span className="hidden sm:inline">
                  {post.views} souls visited
                </span>
                <span className="sm:hidden">{post.views} souls</span>
              </div>
            )}

            {post.resonates && post.resonates > 0 && (
              <div className="flex items-center gap-1 text-red-400">
                <Heart size={14} className="fill-current" />
                <span className="hidden sm:inline">
                  {post.resonates}{" "}
                  {post.resonates === 1 ? "soul resonates" : "souls resonate"}
                </span>
                <span className="sm:hidden">{post.resonates}</span>
              </div>
            )}
          </div>
        </div>

        {/* Draft indicator */}
        {post.isDraft && (
          <div className="px-2 py-1 bg-void-muted/20 text-void-muted text-xs rounded-lg">
            draft
          </div>
        )}
      </div>

      {/* Excerpt */}
      {showExcerpt && post.excerpt && (
        <div className="text-void-muted text-base leading-relaxed mb-4 line-clamp-3">
          {/* Strip markdown formatting for clean excerpt display */}
          <p>{post.excerpt.replace(/[#*`_~\[\]()]/g, "").trim()}</p>
        </div>
      )}

      {/* Read more button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t border-void-border">
        <div className="flex items-center gap-2">
          <span className="text-void-muted-dark text-sm">
            by {post.author.displayName}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRead(post.id);
            router.push(`/blog/${post.slug}`);
          }}
          className="text-sm text-void-accent hover:text-void-accent-light transition-colors font-medium self-start sm:self-auto"
        >
          read more →
        </button>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex items-start gap-2 mt-4">
          <Tag size={14} className="text-void-muted-dark mt-1" />
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="px-2 py-1 bg-void-gray/20 text-void-muted text-xs rounded-lg hover:bg-void-accent/20 hover:text-void-accent transition-all duration-200 cursor-pointer"
                title={`Filter by ${tag}`}
              >
                {tag}
              </button>
            ))}
            {post.tags.length > 3 && (
              <span className="text-void-muted-dark text-xs px-2 py-1">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
