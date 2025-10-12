"use client";

import { useState, useEffect } from "react";
import { PendingComment, AllComment } from "@/types";
import {
  MessageSquare,
  Check,
  X,
  Clock,
  ExternalLink,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Header from "@/components/Header";

type TabType = "all" | "pending";

export default function AdminCommentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
  const [allComments, setAllComments] = useState<AllComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moderatingIds, setModeratingIds] = useState<Set<string>>(new Set());
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchPendingComments = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/comments/pending", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          setError("Invalid API key. Please check your credentials.");
          return;
        }
        throw new Error(data.error || "Failed to fetch pending comments");
      }

      const commentsWithDates = data.comments.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
      }));

      setPendingComments(commentsWithDates);
    } catch (error: any) {
      console.error("Error fetching pending comments:", error);
      setError(error.message || "Failed to load pending comments");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComments = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/comments/all", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          setError("Invalid API key. Please check your credentials.");
          return;
        }
        throw new Error(data.error || "Failed to fetch all comments");
      }

      const commentsWithDates = data.comments.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        moderatedAt: comment.moderatedAt
          ? new Date(comment.moderatedAt)
          : undefined,
      }));

      setAllComments(commentsWithDates);
    } catch (error: any) {
      console.error("Error fetching all comments:", error);
      setError(error.message || "Failed to load all comments");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = () => {
    if (activeTab === "pending") {
      fetchPendingComments();
    } else {
      fetchAllComments();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchComments();
    }
  }, [isAuthenticated, activeTab]);

  const handleModerate = async (
    commentId: string,
    action: "approve" | "reject" | "delete"
  ) => {
    if (moderatingIds.has(commentId)) return;

    setModeratingIds((prev) => new Set(prev).add(commentId));

    try {
      const response = await fetch(
        `/api/admin/comments/${commentId}/${action}`,
        {
          method: action === "delete" ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          alert("Session expired. Please re-authenticate.");
          return;
        }
        throw new Error(data.error || `Failed to ${action} comment`);
      }

      // Remove the comment from the appropriate list and refresh
      if (activeTab === "pending") {
        setPendingComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      } else {
        // For all comments tab, refresh the data to show updated status
        fetchAllComments();
      }
    } catch (error: any) {
      console.error(`Error ${action}ing comment:`, error);
      alert(`Failed to ${action} comment: ${error.message}`);
    } finally {
      setModeratingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const generateAvatar = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    return { letter: firstLetter, colorClass: colors[colorIndex] };
  };

  const getStatusIcon = (comment: AllComment) => {
    if (comment.isApproved) {
      return <CheckCircle size={16} className="text-green-400" />;
    } else if (comment.isRejected) {
      return <XCircle size={16} className="text-red-400" />;
    } else {
      return <AlertCircle size={16} className="text-yellow-400" />;
    }
  };

  const getStatusText = (comment: AllComment) => {
    if (comment.isApproved) return "Approved";
    if (comment.isRejected) return "Rejected";
    return "Pending";
  };

  const getStatusColor = (comment: AllComment) => {
    if (comment.isApproved)
      return "text-green-400 bg-green-400/10 border-green-400/30";
    if (comment.isRejected)
      return "text-red-400 bg-red-400/10 border-red-400/30";
    return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setIsAuthenticated(true);
      setLoading(true);
    }
  };

  const renderCommentCard = (
    comment: PendingComment | AllComment,
    isPending: boolean = false
  ) => {
    const avatar = generateAvatar(comment.guestName);
    const isModeratingThis = moderatingIds.has(comment.id);

    return (
      <div
        key={comment.id}
        className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className={`w-10 h-10 ${avatar.colorClass} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-white font-semibold text-sm">
                {avatar.letter}
              </span>
            </div>

            {/* Comment Info */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-medium text-void-text">
                  {comment.guestName}
                </span>
                <div className="flex items-center gap-1 text-void-muted text-sm">
                  <Clock size={12} />
                  <time dateTime={comment.createdAt.toISOString()}>
                    {formatTimeAgo(comment.createdAt)}
                  </time>
                </div>
                {!isPending && (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border ${getStatusColor(
                      comment as AllComment
                    )}`}
                  >
                    {getStatusIcon(comment as AllComment)}
                    {getStatusText(comment as AllComment)}
                  </div>
                )}
              </div>

              {/* Post Info */}
              <div className="flex items-center gap-2 text-sm text-void-muted">
                <span>on</span>
                <a
                  href={`/blog/${comment.postSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-void-accent hover:text-void-accent-light transition-colors flex items-center gap-1"
                >
                  {comment.postTitle}
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* IP Address (if available) */}
          {comment.ipAddress && (
            <div className="text-xs text-void-muted font-mono bg-void-black/50 px-2 py-1 rounded">
              {comment.ipAddress}
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="mb-6 p-4 bg-void-black/30 rounded-lg border border-void-border/50">
          <div className="text-void-text leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isPending && (
            <>
              <button
                onClick={() => handleModerate(comment.id, "approve")}
                disabled={isModeratingThis}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isModeratingThis ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Approve
              </button>

              <button
                onClick={() => handleModerate(comment.id, "reject")}
                disabled={isModeratingThis}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isModeratingThis ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <X size={16} />
                )}
                Reject
              </button>
            </>
          )}

          <button
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to permanently delete this comment? This action cannot be undone."
                )
              ) {
                handleModerate(comment.id, "delete");
              }
            }}
            disabled={isModeratingThis}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            title="Permanently delete this comment"
          >
            {isModeratingThis ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header onSettingsClick={() => {}} />

      <main className="min-h-screen bg-void-black text-void-text">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-8 relative z-10">
          {/* Header */}
          {isAuthenticated && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-void-accent/20 rounded-full flex items-center justify-center">
                    <MessageSquare size={20} className="text-void-accent" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-void-text">
                      Comment Management
                    </h1>
                    <p className="text-void-muted">
                      {loading
                        ? "Loading..."
                        : activeTab === "pending"
                        ? `${pendingComments.length} pending comments`
                        : `${allComments.length} total comments`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={fetchComments}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-void-dark/50 hover:bg-void-dark border border-void-border hover:border-void-accent/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-void-dark/30 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "pending"
                      ? "bg-void-accent text-void-black"
                      : "text-void-muted hover:text-void-text hover:bg-void-dark/50"
                  }`}
                >
                  Pending Comments
                  {pendingComments.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {pendingComments.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "all"
                      ? "bg-void-accent text-void-black"
                      : "text-void-muted hover:text-void-text hover:bg-void-dark/50"
                  }`}
                >
                  All Comments
                  {allComments.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-void-muted text-void-black text-xs rounded-full">
                      {allComments.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Authentication Form */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto">
              <div className="bg-void-dark/30 backdrop-blur-sm border border-void-border rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-void-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={24} className="text-void-accent" />
                  </div>
                  <h2 className="text-xl font-semibold text-void-text mb-2">
                    Admin Authentication
                  </h2>
                  <p className="text-void-muted text-sm">
                    Enter your API key to access comment management
                  </p>
                </div>

                <form onSubmit={handleAuthenticate} className="space-y-4">
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
                      className="w-full px-4 py-3 bg-void-black/50 border border-void-border rounded-lg text-void-text placeholder-void-muted focus:outline-none focus:border-void-accent focus:ring-1 focus:ring-void-accent transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!apiKey.trim()}
                    className="w-full px-6 py-3 bg-void-accent hover:bg-void-accent-light disabled:bg-void-muted disabled:cursor-not-allowed text-void-black font-medium rounded-lg transition-colors"
                  >
                    Access Admin Panel
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div>
              {/* Content */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-void-accent border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-void-muted">
                    Loading {activeTab === "pending" ? "pending" : "all"}{" "}
                    comments...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button
                    onClick={fetchComments}
                    className="px-4 py-2 bg-void-accent hover:bg-void-accent-light text-void-black font-medium rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : activeTab === "pending" ? (
                pendingComments.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-void-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={24} className="text-void-muted" />
                    </div>
                    <p className="text-void-muted font-mono text-sm">
                      No pending comments
                    </p>
                    <p className="text-void-muted-dark text-xs mt-2">
                      All caught up! New comments will appear here for
                      moderation.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingComments.map((comment) =>
                      renderCommentCard(comment, true)
                    )}
                  </div>
                )
              ) : allComments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-void-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={24} className="text-void-muted" />
                  </div>
                  <p className="text-void-muted font-mono text-sm">
                    No comments found
                  </p>
                  <p className="text-void-muted-dark text-xs mt-2">
                    Comments will appear here once users start commenting.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {allComments.map((comment) =>
                    renderCommentCard(comment, false)
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
