"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, User } from "lucide-react";

interface CommentFormProps {
  postSlug: string;
  onCommentSubmitted?: () => void;
}

export default function CommentForm({
  postSlug,
  onCommentSubmitted,
}: CommentFormProps) {
  const [guestName, setGuestName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load saved name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("void-space-commenter-name");
    if (savedName) {
      setGuestName(savedName);
    }
  }, []);

  // Save name to localStorage when it changes
  useEffect(() => {
    if (guestName.trim()) {
      localStorage.setItem("void-space-commenter-name", guestName.trim());
    }
  }, [guestName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validation
    const trimmedName = guestName.trim();
    const trimmedContent = content.trim();

    if (!trimmedName) {
      setMessage({ type: "error", text: "Please enter your name" });
      return;
    }

    if (!trimmedContent) {
      setMessage({ type: "error", text: "Please enter a comment" });
      return;
    }

    if (trimmedName.length > 100) {
      setMessage({
        type: "error",
        text: "Name must be 100 characters or less",
      });
      return;
    }

    if (trimmedContent.length > 2000) {
      setMessage({
        type: "error",
        text: "Comment must be 2000 characters or less",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postSlug,
          guestName: trimmedName,
          content: trimmedContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit comment");
      }

      // Success
      setMessage({
        type: "success",
        text: "Thanks! Your comment is awaiting moderation and will appear soon.",
      });
      setContent(""); // Clear content but keep name
      onCommentSubmitted?.();
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to submit comment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-void-accent/20 rounded-full flex items-center justify-center">
          <MessageSquare size={20} className="text-void-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-void-text">
            Share Your Thoughts
          </h3>
          <p className="text-sm text-void-muted">
            Comments are moderated and will appear after approval
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label
            htmlFor="guestName"
            className="block text-sm font-medium text-void-text mb-2"
          >
            Your Name
          </label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-void-muted"
            />
            <input
              type="text"
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              className="w-full pl-10 pr-4 py-3 bg-void-black/50 border border-void-border rounded-lg text-void-text placeholder-void-muted focus:outline-none focus:border-void-accent focus:ring-1 focus:ring-void-accent transition-colors"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-void-text mb-2"
          >
            Your Comment
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What are your thoughts on this post?"
            maxLength={2000}
            rows={4}
            className="w-full px-4 py-3 bg-void-black/50 border border-void-border rounded-lg text-void-text placeholder-void-muted focus:outline-none focus:border-void-accent focus:ring-1 focus:ring-void-accent transition-colors resize-vertical"
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-void-muted">
              {content.length}/2000 characters
            </span>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !guestName.trim() || !content.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-void-accent hover:bg-void-accent-light disabled:bg-void-muted disabled:cursor-not-allowed text-void-black font-medium rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-void-black border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Comment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
