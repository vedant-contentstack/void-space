"use client";

import { User } from "@/types";
import { Calendar, MapPin, Link as LinkIcon } from "lucide-react";

interface AuthorProfileProps {
  author: User;
  compact?: boolean;
}

export default function AuthorProfile({
  author,
  compact = false,
}: AuthorProfileProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 bg-void-dark border border-void-border rounded-lg">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-void-accent to-void-accent-light flex items-center justify-center">
          <span className="text-void-black font-semibold text-lg">
            {author.displayName.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="text-void-text font-medium">{author.displayName}</h3>
          <p className="text-void-muted text-sm">@{author.username}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-void-dark border border-void-border rounded-xl p-6 animate-fade-in">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-void-accent to-void-accent-light flex items-center justify-center flex-shrink-0">
          <span className="text-void-black font-bold text-xl">
            {author.displayName.charAt(0)}
          </span>
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-void-text mb-1">
            {author.displayName}
          </h2>
          <p className="text-void-accent text-sm font-medium mb-3">
            @{author.username}
          </p>

          {author.bio && (
            <p className="text-void-muted leading-relaxed mb-4">{author.bio}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-void-muted text-sm">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                Joined{" "}
                {author.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>The Void</span>
            </div>
          </div>
        </div>
      </div>

      {/* Author Links/Social (if we add them later) */}
      <div className="mt-6 pt-4 border-t border-void-border">
        <div className="flex items-center gap-2 text-void-muted text-sm">
          <LinkIcon size={14} />
          <span>
            Building tools for contemplation and meaningful connection
          </span>
        </div>
      </div>
    </div>
  );
}
