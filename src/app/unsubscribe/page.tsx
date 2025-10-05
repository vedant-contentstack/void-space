"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/Header";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get email from URL params if provided
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(
          "You have been successfully unsubscribed from our newsletter."
        );
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <main className="min-h-screen bg-void-black">
      <Header
        onSettingsClick={() => {}}
        onConstellationClick={() => (window.location.href = "/blog")}
      />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-void-dark border border-void-border flex items-center justify-center">
              <Mail size={28} className="text-void-muted" />
            </div>
          </div>

          <h1 className="text-3xl font-light text-void-text mb-4">
            Unsubscribe from Newsletter
          </h1>

          <p className="text-void-muted leading-relaxed">
            We're sorry to see you go. Enter your email address below to
            unsubscribe from the void space newsletter.
          </p>
        </div>

        <div className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-8">
          <form onSubmit={handleUnsubscribe} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-void-text mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-void-black/50 border border-void-border rounded-xl text-void-text placeholder-void-muted-dark focus:outline-none focus:border-void-accent transition-colors"
                disabled={status === "loading" || status === "success"}
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Unsubscribing...</span>
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle size={20} />
                  <span>Unsubscribed</span>
                </>
              ) : (
                <span>Unsubscribe</span>
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
          </form>

          {status === "success" && (
            <div className="text-center mt-8 pt-6 border-t border-void-border">
              <p className="text-void-muted text-sm mb-4">
                Changed your mind? You can always subscribe again.
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="text-void-accent hover:text-void-accent-light transition-colors text-sm font-medium"
              >
                Return to Void Space
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-void-muted-dark text-sm">
            If you have any questions, feel free to reach out to us.
          </p>
        </div>
      </div>
    </main>
  );
}
