"use client";

import { BlogPost } from "@/types";
import { Tag, X } from "lucide-react";

interface TagFilterProps {
  posts: BlogPost[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onClearAll: () => void;
}

export default function TagFilter({
  posts,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onClearAll,
}: TagFilterProps) {
  // Get all unique tags with their post counts
  const tagCounts = posts.reduce((acc, post) => {
    post.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Sort tags by frequency (most used first)
  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);

  if (sortedTags.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-void-accent" />
              <span className="text-void-text font-medium text-sm">
                Filtering by:
              </span>
            </div>
            <button
              onClick={onClearAll}
              className="text-void-muted hover:text-void-accent text-xs transition-colors self-start sm:self-auto"
            >
              clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagRemove(tag)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-void-accent/20 text-void-accent border border-void-accent/30 rounded-full text-xs font-medium hover:bg-void-accent/30 transition-all duration-200 group"
              >
                <span>{tag}</span>
                <X
                  size={12}
                  className="group-hover:text-void-accent-light transition-colors"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Available tags */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={16} className="text-void-muted" />
          <span className="text-void-muted font-medium text-sm">
            Explore topics:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(([tag, count]) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagSelect(tag)}
                disabled={isSelected}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-void-accent/20 text-void-accent border border-void-accent/30 cursor-not-allowed opacity-50"
                    : "bg-void-dark border border-void-border text-void-muted hover:text-void-accent hover:border-void-accent/30 hover:bg-void-dark/80"
                }`}
              >
                <span>{tag}</span>
                <span className="text-void-muted-dark">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter results summary */}
      {selectedTags.length > 0 && (
        <div className="text-center py-2">
          <p className="text-void-muted text-sm">
            {
              posts.filter((post) =>
                selectedTags.every((tag) => post.tags.includes(tag))
              ).length
            }{" "}
            {posts.filter((post) =>
              selectedTags.every((tag) => post.tags.includes(tag))
            ).length === 1
              ? "post"
              : "posts"}{" "}
            found
          </p>
        </div>
      )}
    </div>
  );
}
