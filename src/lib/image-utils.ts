/**
 * Utility functions for handling image URLs from various sources
 */

/**
 * Converts a Google Drive sharing URL to a direct image URL
 * @param url - Google Drive sharing URL
 * @returns Direct image URL or original URL if not a Google Drive URL
 */
export function convertGoogleDriveUrl(url: string): string {
  // Check if it's a Google Drive sharing URL
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);

  if (match && match[1]) {
    const fileId = match[1];
    // Try multiple Google Drive direct image URL formats
    // This format works better for emails and doesn't get proxied
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  return url;
}

/**
 * Converts Google Drive URL specifically for email compatibility
 * @param url - Google Drive sharing URL
 * @returns Email-compatible direct image URL
 */
export function convertGoogleDriveUrlForEmail(url: string): string {
  // Check if it's a Google Drive sharing URL
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);

  if (match && match[1]) {
    const fileId = match[1];
    // Use the thumbnail API which is more reliable in emails
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
  }

  return url;
}

/**
 * Processes image URL to ensure it's compatible with Next.js Image component
 * @param url - Original image URL
 * @returns Processed image URL
 */
export function processImageUrl(url: string): string {
  if (!url) return url;

  // Handle Google Drive URLs
  return convertGoogleDriveUrl(url);
}

/**
 * Checks if an image URL is from a supported domain
 * @param url - Image URL to check
 * @returns Boolean indicating if the domain is supported
 */
export function isSupportedImageDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    const supportedDomains = [
      "images.unsplash.com",
      "unsplash.com",
      "drive.google.com",
      "lh3.googleusercontent.com",
    ];

    return supportedDomains.includes(hostname);
  } catch {
    return false;
  }
}
