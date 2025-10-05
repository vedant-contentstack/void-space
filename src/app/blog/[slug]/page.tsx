"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { BlogPost } from "@/types";
import { ArrowLeft, Clock, Eye, Calendar, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Header from "@/components/Header";
import StructuredData from "@/components/StructuredData";
import { processImageUrl } from "@/lib/image-utils";

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

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const viewsIncrementedRef = useRef(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`);

        if (response.ok) {
          const foundPost = await response.json();
          const deserializedPost = deserializeDates(foundPost);
          setPost(deserializedPost);

          // Increment view count (only once per session)
          if (!viewsIncrementedRef.current) {
            viewsIncrementedRef.current = true;
            try {
              await fetch(`/api/posts/${params.slug}/views`, {
                method: "POST",
              });
            } catch (error) {
              // Failed to increment views
            }
          }
        } else {
          setPost(null);
        }
      } catch (error) {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-center animate-fade-in">
          <div className="w-8 h-8 border-2 border-void-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-void-muted">Loading from the void...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-center animate-fade-in">
          <h1 className="text-2xl font-light text-void-text mb-4">
            Post not found
          </h1>
          <p className="text-void-muted mb-6">
            This post may have been moved or deleted.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-void-accent text-void-black rounded-lg font-medium hover:bg-void-accent/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {post && <StructuredData type="article" post={post} />}
      <main className="min-h-screen bg-void-black relative overflow-hidden">
        {/* Sketch Elements - Left Side */}
        <div
          className="hidden xl:block fixed left-0 top-0 h-full w-32 pointer-events-none z-0 opacity-15"
          style={{ filter: "drop-shadow(0 0 6px rgba(96, 165, 250, 0.3))" }}
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
                id="subtleGlowBlog"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
              filter="url(#subtleGlowBlog)"
            />
            <path
              d="M10 500 Q30 520 20 550 T40 600 Q60 620 35 650 T55 700 Q75 720 50 750"
              stroke="currentColor"
              strokeWidth="0.6"
              className="text-void-accent animate-pulse"
              style={{ animationDuration: "5s", animationDelay: "1s" }}
              filter="url(#subtleGlowBlog)"
            />
          </svg>
        </div>

        {/* Sketch Elements - Right Side */}
        <div
          className="hidden xl:block fixed right-0 top-0 h-full w-32 pointer-events-none z-0 opacity-15"
          style={{ filter: "drop-shadow(0 0 6px rgba(96, 165, 250, 0.3))" }}
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
                id="subtleGlowBlogRight"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
              filter="url(#subtleGlowBlogRight)"
            />
            <path
              d="M118 500 Q98 520 108 550 T88 600 Q68 620 93 650 T73 700 Q53 720 78 750"
              stroke="currentColor"
              strokeWidth="0.6"
              className="text-void-accent animate-pulse"
              style={{ animationDuration: "5.5s", animationDelay: "1.5s" }}
              filter="url(#subtleGlowBlogRight)"
            />
          </svg>
        </div>

        <Header
          onSettingsClick={() => {}}
          onConstellationClick={() => router.push("/blog")} // Go back to blog for constellation
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-void-muted hover:text-void-text transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span className="font-mono text-sm">back to void</span>
          </button>

          {post.bannerImage && (
            <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden shadow-lg border border-void-border">
              <Image
                src={processImageUrl(post.bannerImage)}
                alt={post.title}
                fill
                className="object-cover"
                priority={false}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 768px"
              />
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-void-text mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-void-muted text-sm mb-8">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <time
                dateTime={
                  post.publishedAt?.toISOString() ||
                  post.createdAt.toISOString()
                }
              >
                <span className="hidden sm:inline">
                  {(post.publishedAt || post.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
                <span className="sm:hidden">
                  {(post.publishedAt || post.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readingTime} min journey</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span className="hidden sm:inline">
                {post.views || 0} souls visited
              </span>
              <span className="sm:hidden">{post.views || 0} souls</span>
            </div>
            <div className="flex items-center gap-2">
              <span>by {post.author.displayName}</span>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none text-void-text leading-relaxed mb-12">
            <ReactMarkdown
              components={{
                // Headings
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-void-text mb-6 mt-8 border-b border-void-border pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-void-text mb-4 mt-8 border-b border-void-border/50 pb-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-void-text mb-3 mt-6">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-lg font-medium text-void-text mb-2 mt-4">
                    {children}
                  </h4>
                ),
                // Paragraphs
                p: ({ children }) => (
                  <p className="text-void-muted leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                // Links
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-void-accent hover:text-void-accent-light underline decoration-void-accent/50 hover:decoration-void-accent transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // Lists
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-void-muted mb-4 space-y-2 ml-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-void-muted mb-4 space-y-2 ml-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-void-muted leading-relaxed">
                    {children}
                  </li>
                ),
                // Code blocks
                code: ({ children, className, ...props }) => {
                  const isInline = !className?.includes("language-");
                  if (isInline) {
                    return (
                      <code
                        className="bg-void-dark px-2 py-1 rounded text-void-accent font-mono text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code
                      className={`block bg-void-dark p-4 rounded-lg text-void-text font-mono text-sm overflow-x-auto mb-4 border border-void-border ${
                        className || ""
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-void-dark p-4 rounded-lg text-void-text font-mono text-sm overflow-x-auto mb-4 border border-void-border">
                    {children}
                  </pre>
                ),
                // Blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-void-accent pl-4 py-2 bg-void-dark/30 rounded-r-lg mb-4 italic text-void-muted">
                    {children}
                  </blockquote>
                ),
                // Images
                img: ({ src, alt }) => (
                  <div className="relative w-full mb-4 rounded-lg overflow-hidden border border-void-border shadow-lg">
                    <Image
                      src={processImageUrl(src || "")}
                      alt={alt || ""}
                      width={800}
                      height={400}
                      className="w-full h-auto"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                ),
                // Horizontal rule
                hr: () => <hr className="border-void-border my-8" />,
                // Tables
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-void-border rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-void-border bg-void-dark px-4 py-2 text-left text-void-text font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-void-border px-4 py-2 text-void-muted">
                    {children}
                  </td>
                ),
                // Strong and emphasis
                strong: ({ children }) => (
                  <strong className="font-semibold text-void-text">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-void-accent">{children}</em>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    // Navigate back to blog with tag filter
                    router.push(`/blog?tag=${encodeURIComponent(tag)}`);
                  }}
                  className="px-3 py-1 bg-void-dark border border-void-border rounded-full text-void-muted text-xs font-mono hover:bg-void-accent/20 hover:text-void-accent hover:border-void-accent/30 transition-all duration-200 cursor-pointer"
                  title={`View all posts tagged with ${tag}`}
                >
                  <Tag size={12} className="inline-block mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
