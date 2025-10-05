"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/types";
import { ArrowRight, BookOpen, Sparkles, Eye, Clock } from "lucide-react";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";

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

export default function LandingPage() {
  const router = useRouter();
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (response.ok) {
          const posts = await response.json();
          const deserializedPosts = deserializeDates(posts);
          // Get the 3 most recent posts as featured
          setFeaturedPosts(deserializedPosts.slice(0, 3));
        }
      } catch (error) {
        // Failed to load featured posts
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedPosts();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-void-accent/30 rounded-full animate-float"></div>
        <div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-void-accent/40 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-void-accent/20 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-1 h-1 bg-void-accent/50 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-void-accent/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-void-accent/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      <Header
        onSettingsClick={() => {}}
        onConstellationClick={() => router.push("/blog")}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-void-accent to-void-accent-light flex items-center justify-center animate-float shadow-2xl shadow-void-accent/20">
                  <div className="w-8 h-8 rounded-full bg-void-black"></div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-void-accent/20 to-void-accent-light/20 rounded-3xl blur-xl animate-pulse"></div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-light text-void-text mb-6 tracking-tight">
              void <span className="text-void-accent font-medium">space</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-void-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              A contemplative space for deep thoughts, mindful reflections, and
              meaningful connections
            </p>

            {/* Philosophy */}
            <div className="text-void-muted-dark text-sm md:text-base mb-12 max-w-3xl mx-auto leading-relaxed space-y-4">
              <p>
                Welcome to the void, not as emptiness, but as infinite
                possibility.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push("/blog")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-void-accent text-void-black rounded-2xl font-medium text-lg hover:bg-void-accent-light transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-void-accent/30"
            >
              <span>Enter the Void</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </section>

        {/* Featured Posts Section */}
        {!loading && featuredPosts.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-light text-void-text mb-4">
                  Recent <span className="text-void-accent">Thoughts</span>
                </h2>
                <p className="text-void-muted max-w-2xl mx-auto">
                  Glimpses from the depths of contemplation
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className="group bg-void-dark/30 backdrop-blur-sm border border-void-border hover:border-void-border-light rounded-2xl p-6 transition-all duration-300 hover:bg-void-dark/50 cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.2}s` }}
                    onClick={() => router.push(`/blog/${post.slug}`)}
                  >
                    {/* Post Meta */}
                    <div className="flex items-center gap-4 text-xs text-void-muted-dark mb-4">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{post.readingTime} min journey</span>
                      </div>
                      {post.views && post.views > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          <span>{post.views} souls</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-medium text-void-text group-hover:text-white transition-colors duration-200 mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-void-muted text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt.replace(/[#*`_~\[\]()]/g, "").trim()}
                    </p>

                    {/* Date */}
                    <div className="text-xs text-void-muted-dark">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-void-gray/20 text-void-muted text-xs rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-void-muted-dark text-xs px-2 py-1">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {/* View All Posts */}
              <div className="text-center mt-12">
                <button
                  onClick={() => router.push("/blog")}
                  className="inline-flex items-center gap-2 text-void-accent hover:text-void-accent-light transition-colors duration-200 font-medium"
                >
                  <BookOpen size={16} />
                  <span>Explore All Thoughts</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Newsletter />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-void-border/20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-void-muted-dark text-sm">
              © 2025 Void Space. For the People, By the People!
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
