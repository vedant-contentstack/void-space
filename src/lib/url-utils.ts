/**
 * Get the base URL for the application
 * Works in both server and client environments
 */
export function getBaseUrl(): string {
  // Server-side: Use environment variable or construct from headers
  if (typeof window === "undefined") {
    // Production: Use environment variable
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // Development: Use localhost
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }

    // Fallback to production domain
    return "https://voidd.space";
  }

  // Client-side: Use window.location
  return `${window.location.protocol}//${window.location.host}`;
}

/**
 * Get the base URL from request headers (server-side only)
 */
export function getBaseUrlFromRequest(request: Request): string {
  // Try to get from environment first
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Extract from request headers
  const url = new URL(request.url);
  const protocol = request.headers.get("x-forwarded-proto") || url.protocol;
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    url.host;

  return `${protocol}://${host}`;
}
