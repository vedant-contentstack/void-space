/**
 * Utility functions for tracking blog post views using localStorage
 */

const VIEWED_POSTS_KEY = "void-space-viewed-posts";

/**
 * Check if a user has already viewed a specific blog post
 * @param postSlug - The slug of the blog post
 * @returns boolean - true if the user has viewed this post before
 */
export function hasUserViewedPost(postSlug: string): boolean {
  if (typeof window === "undefined") {
    // Server-side rendering, return false
    return false;
  }

  try {
    const viewedPosts = JSON.parse(
      localStorage.getItem(VIEWED_POSTS_KEY) || "[]"
    );
    return viewedPosts.includes(postSlug);
  } catch (error) {
    // If localStorage is not available or data is corrupted, return false
    return false;
  }
}

/**
 * Mark a blog post as viewed by the current user
 * @param postSlug - The slug of the blog post to mark as viewed
 */
export function markPostAsViewed(postSlug: string): void {
  if (typeof window === "undefined") {
    // Server-side rendering, do nothing
    return;
  }

  try {
    const viewedPosts = JSON.parse(
      localStorage.getItem(VIEWED_POSTS_KEY) || "[]"
    );

    if (!viewedPosts.includes(postSlug)) {
      viewedPosts.push(postSlug);
      localStorage.setItem(VIEWED_POSTS_KEY, JSON.stringify(viewedPosts));
    }
  } catch (error) {
    // If localStorage is not available, fail silently
    console.warn("Failed to mark post as viewed:", error);
  }
}

/**
 * Get all viewed post slugs for the current user
 * @returns string[] - Array of post slugs that the user has viewed
 */
export function getViewedPosts(): string[] {
  if (typeof window === "undefined") {
    // Server-side rendering, return empty array
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(VIEWED_POSTS_KEY) || "[]");
  } catch (error) {
    // If localStorage is not available or data is corrupted, return empty array
    return [];
  }
}

/**
 * Clear all viewed posts for the current user (useful for testing or privacy)
 */
export function clearViewedPosts(): void {
  if (typeof window === "undefined") {
    // Server-side rendering, do nothing
    return;
  }

  try {
    localStorage.removeItem(VIEWED_POSTS_KEY);
  } catch (error) {
    // If localStorage is not available, fail silently
    console.warn("Failed to clear viewed posts:", error);
  }
}
