"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "@/types";
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
} from "lucide-react";
import Header from "@/components/Header";

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

export default function NewsletterAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<string>("");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (response.ok) {
          const postsData = await response.json();
          const deserializedPosts = deserializeDates(postsData);
          setPosts(deserializedPosts);
        }
      } catch (error) {
        // Failed to load posts
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPost || !apiKey) {
      setStatus("error");
      setMessage("Please select a post and enter the API key");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postSlug: selectedPost,
          apiKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setStats(data.stats);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send newsletter");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }

    // Reset status after 10 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
      setStats(null);
    }, 10000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-center animate-fade-in">
          <div className="w-8 h-8 border-2 border-void-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-void-muted">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-void-black">
      <Header
        onSettingsClick={() => {}}
        onConstellationClick={() => (window.location.href = "/blog")}
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-void-accent/20 to-void-accent-light/20 flex items-center justify-center">
              <Mail size={28} className="text-void-accent" />
            </div>
          </div>

          <h1 className="text-3xl font-light text-void-text mb-4">
            Newsletter{" "}
            <span className="text-void-accent font-medium">Admin</span>
          </h1>

          <p className="text-void-muted leading-relaxed max-w-2xl mx-auto">
            Send newsletter emails to subscribers when you publish new thoughts
            from the void.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Quick Stats */}
          <div className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users size={20} className="text-void-accent" />
              <h3 className="text-lg font-medium text-void-text">
                Subscribers
              </h3>
            </div>
            <p className="text-void-muted text-sm">
              Newsletter functionality is active. Subscribers will receive
              welcome emails upon signup.
            </p>
          </div>

          <div className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp size={20} className="text-void-accent" />
              <h3 className="text-lg font-medium text-void-text">
                Email Service
              </h3>
            </div>
            <p className="text-void-muted text-sm">
              {process.env.RESEND_API_KEY
                ? "Resend configured and ready"
                : "Configure RESEND_API_KEY to send emails"}
            </p>
          </div>
        </div>

        {/* Send Newsletter Form */}
        <div className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-8">
          <h2 className="text-xl font-medium text-void-text mb-6">
            Send Newsletter
          </h2>

          <form onSubmit={handleSendNewsletter} className="space-y-6">
            <div>
              <label
                htmlFor="post"
                className="block text-sm font-medium text-void-text mb-2"
              >
                Select Post
              </label>
              <select
                id="post"
                value={selectedPost}
                onChange={(e) => setSelectedPost(e.target.value)}
                className="w-full px-4 py-3 bg-void-black/50 border border-void-border rounded-xl text-void-text focus:outline-none focus:border-void-accent transition-colors"
                required
              >
                <option value="">Choose a post to send...</option>
                {posts.map((post) => (
                  <option key={post.id} value={post.slug}>
                    {post.title} (
                    {new Date(
                      post.publishedAt || post.createdAt
                    ).toLocaleDateString()}
                    )
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-void-text mb-2"
              >
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter NEWSLETTER_API_KEY"
                className="w-full px-4 py-3 bg-void-black/50 border border-void-border rounded-xl text-void-text placeholder-void-muted-dark focus:outline-none focus:border-void-accent transition-colors"
                required
              />
              <p className="text-void-muted-dark text-xs mt-2">
                This should match your NEWSLETTER_API_KEY environment variable
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-6 py-3 bg-void-accent text-void-black rounded-xl font-medium hover:bg-void-accent-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-void-black/30 border-t-void-black rounded-full animate-spin" />
                  <span>Sending Newsletter...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Send Newsletter</span>
                </>
              )}
            </button>

            {message && (
              <div
                className={`flex items-center gap-2 p-4 rounded-lg ${
                  status === "success"
                    ? "bg-green-900/20 border border-green-700/30 text-green-400"
                    : "bg-red-900/20 border border-red-700/30 text-red-400"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            {stats && (
              <div className="bg-void-black/30 border border-void-border rounded-lg p-4">
                <h4 className="text-void-text font-medium mb-2">
                  Sending Results
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-void-accent">
                      {stats.total}
                    </div>
                    <div className="text-xs text-void-muted">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {stats.successful}
                    </div>
                    <div className="text-xs text-void-muted">Sent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {stats.failed}
                    </div>
                    <div className="text-xs text-void-muted">Failed</div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-void-muted-dark text-sm">
            ⚠️ This is a simple admin interface. In production, implement proper
            authentication.
          </p>
        </div>
      </div>
    </main>
  );
}
