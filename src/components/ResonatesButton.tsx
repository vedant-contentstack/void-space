"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface ResonatesButtonProps {
  postSlug: string;
  initialResonates: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export default function ResonatesButton({
  postSlug,
  initialResonates,
  size = "md",
  showCount = true,
  className = "",
}: ResonatesButtonProps) {
  const [resonates, setResonates] = useState(initialResonates);
  const [hasResonated, setHasResonated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already resonated with this post
  useEffect(() => {
    const resonatedPosts = JSON.parse(
      localStorage.getItem("void-space-resonated-posts") || "[]"
    );
    setHasResonated(resonatedPosts.includes(postSlug));
  }, [postSlug]);

  const handleResonate = async () => {
    if (isLoading || hasResonated) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const response = await fetch(`/api/posts/${postSlug}/resonate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to resonate");
      }

      const data = await response.json();

      // Update local state
      setResonates(data.resonates);
      setHasResonated(true);

      // Store in localStorage to prevent duplicate resonates
      const resonatedPosts = JSON.parse(
        localStorage.getItem("void-space-resonated-posts") || "[]"
      );
      resonatedPosts.push(postSlug);
      localStorage.setItem(
        "void-space-resonated-posts",
        JSON.stringify(resonatedPosts)
      );
    } catch (error) {
      console.error("Error resonating with post:", error);
      // Optionally show error toast here
    } finally {
      setIsLoading(false);
      // Reset animation after a delay
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const sizeClasses = {
    sm: "text-xs gap-1 px-2 py-1",
    md: "text-sm gap-2 px-3 py-1.5",
    lg: "text-base gap-2 px-4 py-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <button
      onClick={handleResonate}
      disabled={isLoading || hasResonated}
      className={`
        flex items-center ${sizeClasses[size]} 
        bg-void-dark/30 rounded-lg border border-void-border/50
        hover:border-red-400/30 hover:bg-void-dark/50 
        transition-all duration-200
        ${
          hasResonated
            ? "border-red-400/50 bg-red-400/10 text-red-400"
            : "text-void-muted hover:text-red-400"
        }
        ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
        ${className}
      `}
      title={
        hasResonated
          ? "You resonated with this post"
          : "Resonate with this post"
      }
    >
      <Heart
        size={iconSizes[size]}
        className={`
          transition-all duration-300
          ${hasResonated ? "fill-current text-red-400" : ""}
          ${isAnimating ? "animate-pulse scale-125" : ""}
        `}
      />
      {showCount && (
        <span className="font-medium">
          <span className="hidden sm:inline">
            {resonates} {resonates === 1 ? "soul resonates" : "souls resonate"}
          </span>
          <span className="sm:hidden">{resonates}</span>
        </span>
      )}
    </button>
  );
}
