"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

interface NewsletterProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export default function Newsletter({
  variant = "default",
  className = "",
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Welcome to the void! Check your email for confirmation.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  if (variant === "compact") {
    return (
      <div
        className={`bg-void-dark/50 backdrop-blur-sm border border-void-border rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-void-accent/20 flex items-center justify-center">
            <Mail size={20} className="text-void-accent" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-void-text">
              Stay in the Loop
            </h3>
            <p className="text-sm text-void-muted">
              Get notified of new thoughts
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 bg-void-black/50 border border-void-border rounded-lg text-void-text placeholder-void-muted-dark focus:outline-none focus:border-void-accent transition-colors text-sm"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-4 py-2 bg-void-accent text-void-black rounded-lg font-medium hover:bg-void-accent-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
            >
              {status === "loading" ? (
                <div className="w-4 h-4 border-2 border-void-black/30 border-t-void-black rounded-full animate-spin" />
              ) : status === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 text-sm ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {status === "success" ? (
                <CheckCircle size={14} />
              ) : (
                <AlertCircle size={14} />
              )}
              <span>{message}</span>
            </div>
          )}
        </form>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`border-t border-void-border/30 pt-8 ${className}`}>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-void-accent/20 flex items-center justify-center">
              <Mail size={24} className="text-void-accent" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-void-text mb-2">
            Join the <span className="text-void-accent">Void</span>
          </h3>
          <p className="text-void-muted max-w-md mx-auto">
            Get notified when new thoughts emerge from the digital void
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-void-dark/50 border border-void-border rounded-xl text-void-text placeholder-void-muted-dark focus:outline-none focus:border-void-accent transition-colors"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-3 bg-void-accent text-void-black rounded-xl font-medium hover:bg-void-accent-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {status === "loading" ? (
                <div className="w-5 h-5 border-2 border-void-black/30 border-t-void-black rounded-full animate-spin" />
              ) : status === "success" ? (
                <>
                  <CheckCircle size={18} />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </div>

          {message && (
            <div
              className={`flex items-center justify-center gap-2 text-sm ${
                status === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {status === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{message}</span>
            </div>
          )}
        </form>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-8 ${className}`}
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-void-accent/20 to-void-accent-light/20 flex items-center justify-center">
              <Mail size={28} className="text-void-accent" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-void-accent/10 to-void-accent-light/10 rounded-3xl blur-xl animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-light text-void-text mb-4">
          Subscribe to the{" "}
          <span className="text-void-accent font-medium">Void</span>
        </h2>

        <p className="text-void-muted leading-relaxed max-w-2xl mx-auto">
          Join fellow travelers in the digital void. Get notified when new
          thoughts, reflections, and insights emerge.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 bg-void-black/50 border border-void-border rounded-xl text-void-text placeholder-void-muted-dark focus:outline-none focus:border-void-accent transition-colors"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-6 py-3 bg-void-accent text-void-black rounded-xl font-medium hover:bg-void-accent-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-void-accent/30"
          >
            {status === "loading" ? (
              <div className="w-5 h-5 border-2 border-void-black/30 border-t-void-black rounded-full animate-spin" />
            ) : status === "success" ? (
              <>
                <CheckCircle size={20} />
                <span>Subscribed!</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </div>

        {message && (
          <div
            className={`flex items-center justify-center gap-2 text-sm ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
