"use client";

import { useState, useEffect } from "react";
import { ApprovedComment } from "@/types";
import { MessageSquare, User, Clock } from "lucide-react";

interface CommentsListProps {
  postSlug: string;
  refreshTrigger?: number; // Used to trigger refresh when new comment is submitted
}

export default function CommentsList({
  postSlug,
  refreshTrigger,
}: CommentsListProps) {
  const [comments, setComments] = useState<ApprovedComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/comments/${postSlug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch comments");
      }

      // Deserialize dates
      const commentsWithDates = data.comments.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
      }));

      setComments(commentsWithDates);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      setError(error.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  // Refresh when trigger changes (e.g., new comment submitted)
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchComments();
    }
  }, [refreshTrigger]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const generateAvatar = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    return { letter: firstLetter, colorClass: colors[colorIndex] };
  };

  if (loading) {
    return (
      <div className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare size={20} className="text-void-accent" />
          <h3 className="text-lg font-semibold text-void-text">Comments</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-void-accent border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-void-muted">Loading comments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare size={20} className="text-void-accent" />
          <h3 className="text-lg font-semibold text-void-text">Comments</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchComments}
            className="px-4 py-2 bg-void-accent hover:bg-void-accent-light text-void-black font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={20} className="text-void-accent" />
        <h3 className="text-lg font-semibold text-void-text">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-void-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-void-muted" />
          </div>
          <p className="text-void-muted font-mono text-sm">No comments yet</p>
          <p className="text-void-muted-dark text-xs mt-2">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const avatar = generateAvatar(comment.guestName);

            return (
              <div key={comment.id} className="flex gap-4">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 ${avatar.colorClass} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white font-semibold text-sm">
                    {avatar.letter}
                  </span>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-void-text">
                      {comment.guestName}
                    </span>
                    <div className="flex items-center gap-1 text-void-muted text-sm">
                      <Clock size={12} />
                      <time dateTime={comment.createdAt.toISOString()}>
                        {formatTimeAgo(comment.createdAt)}
                      </time>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <div className="text-void-text leading-relaxed whitespace-pre-wrap break-words">
                    {comment.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
