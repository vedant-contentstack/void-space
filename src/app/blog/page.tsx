"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BlogFeed from "@/components/BlogFeed";
import Header from "@/components/Header";
import ConstellationMode from "@/components/ConstellationMode";
import TagFilter from "@/components/TagFilter";
import StructuredData from "@/components/StructuredData";
import Newsletter from "@/components/Newsletter";
import { BlogPost } from "@/types";
import { Sparkles } from "lucide-react";

// Helper function to deserialize dates from API response
function deserializeDates(obj: any): any {
  if (
    typeof obj === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)
  ) {
    return new Date(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deserializeDates);
  }
  if (obj && typeof obj === "object") {
    const deserialized: any = {};
    for (const key in obj) {
      deserialized[key] = deserializeDates(obj[key]);
    }
    return deserialized;
  }
  return obj;
}

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initializedFromURL = useRef(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState("Initializing...");
  const [showConstellationMode, setShowConstellationMode] = useState(false);

  // Load posts on mount
  useEffect(() => {
    const loadPosts = async () => {
      setLoadingStep("Loading posts...");

      try {
        const response = await fetch("/api/posts");
        if (response.ok) {
          const posts = await response.json();
          const deserializedPosts = deserializeDates(posts);
          setBlogPosts(deserializedPosts);
          setFilteredPosts(deserializedPosts);
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (error) {
        setBlogPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoadingStep("Complete");
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Handle URL parameters for tag filtering (only on initial load)
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (tagParam && !initializedFromURL.current) {
      setSelectedTags([tagParam]);
      initializedFromURL.current = true;
    } else if (!tagParam && initializedFromURL.current) {
      // URL changed to remove tag parameter
      setSelectedTags([]);
    }
  }, [searchParams]);

  // Filter posts based on selected tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredPosts(blogPosts);
    } else {
      const filtered = blogPosts.filter((post) =>
        selectedTags.every((tag) => post.tags.includes(tag))
      );
      setFilteredPosts(filtered);
    }
  }, [selectedTags, blogPosts]);

  const handleReadPost = (postId: string) => {
    // Increment view count
    setBlogPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, views: (post.views || 0) + 1 } : post
      )
    );
  };

  const handleConstellationPostClick = (post: BlogPost) => {
    setShowConstellationMode(false);
    // Navigate to the post detail page
    window.location.href = `/blog/${post.slug}`;
  };

  const updateURL = useCallback(
    (tags: string[]) => {
      const url = new URL(window.location.href);
      if (tags.length > 0) {
        // For simplicity, we'll only support one tag in URL for now
        url.searchParams.set("tag", tags[0]);
      } else {
        url.searchParams.delete("tag");
      }
      router.replace(url.pathname + url.search, { scroll: false });
    },
    [router]
  );

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      updateURL(newTags);
    }
  };

  const handleTagRemove = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    updateURL(newTags);
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
    updateURL([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-center animate-fade-in">
          <div className="w-8 h-8 border-2 border-void-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-void-muted">Loading thoughts from the void...</p>
          <p className="text-void-muted-dark text-xs mt-2">{loadingStep}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <StructuredData type="blog" />
      <main className="min-h-screen bg-void-black relative overflow-hidden">
        {/* Sketch Elements - Left Side */}
        <div
          className="hidden xl:block fixed left-0 top-0 h-full w-32 pointer-events-none z-0 opacity-20"
          style={{ filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))" }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 128 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Subtle glow filter */}
              <filter
                id="glow-left"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Organic flowing lines */}
            <path
              d="M20 100 Q40 120 30 150 T50 200 Q70 220 45 250 T65 300 Q85 320 60 350 T80 400"
              stroke="currentColor"
              strokeWidth="0.8"
              className="text-void-accent animate-pulse"
              style={{ animationDuration: "4s" }}
              filter="url(#glow-left)"
            />
            <path
              d="M10 500 Q30 520 20 550 T40 600 Q60 620 35 650 T55 700 Q75 720 50 750"
              stroke="currentColor"
              strokeWidth="0.6"
              className="text-void-accent animate-pulse"
              style={{ animationDuration: "5s", animationDelay: "1s" }}
              filter="url(#glow-left)"
            />
          </svg>
        </div>

        {/* Sketch Elements - Right Side */}
        <div
          className="hidden xl:block fixed right-0 top-0 h-full w-32 pointer-events-none z-0 opacity-20"
          style={{ filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))" }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 128 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Subtle glow filter */}
              <filter
                id="glow-right"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Organic flowing lines */}
            <path
              d="M108 100 Q88 120 98 150 T78 200 Q58 220 83 250 T63 300 Q43 320 68 350 T48 400"
              stroke="currentColor"
              strokeWidth="0.8"
              className="text-void-accent animate-pulse"
              style={{ animationDuration: "4.5s", animationDelay: "0.5s" }}
              filter="url(#glow-right)"
            />
            <path
              d="M118 500 Q98 520 108 550 T88 600 Q68 620 93 650 T73 700 Q53 720 78 750"
              stroke="currentColor"
              strokeWidth="0.6"
              className="text-void-accent animate-pulse"
              style={{ animationDuration: "5.5s", animationDelay: "1.5s" }}
              filter="url(#glow-right)"
            />
          </svg>
        </div>

        <Header
          onSettingsClick={() => {}}
          onConstellationClick={() => setShowConstellationMode(true)}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          {showConstellationMode ? (
            <div className="relative">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <button
                  onClick={() => setShowConstellationMode(false)}
                  className="px-4 py-2 bg-void-dark border border-void-border rounded-lg text-void-muted hover:text-void-text hover:border-void-accent transition-all duration-200 text-sm"
                >
                  back to feed
                </button>
              </div>
              <ConstellationMode
                posts={filteredPosts}
                onClose={() => setShowConstellationMode(false)}
                onPostSelect={handleConstellationPostClick}
              />
            </div>
          ) : (
            <>
              <TagFilter
                posts={blogPosts}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagRemove={handleTagRemove}
                onClearAll={handleClearAllTags}
              />
              <BlogFeed
                posts={filteredPosts}
                onReadPost={handleReadPost}
                onTagClick={handleTagSelect}
              />

              {/* Newsletter Section */}
              <div className="mt-16">
                <Newsletter variant="inline" />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
