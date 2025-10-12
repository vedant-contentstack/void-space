export interface User {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  createdAt: Date;
  lastPostAt?: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  typography: "mono" | "serif" | "minimal";
  enableSeasonalThemes: boolean;
  enableSilenceAppreciation: boolean;
  enableBreathingSpace: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string; // MDX content
  excerpt: string;
  bannerImage?: string; // URL to banner image
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  publishedAt?: Date;
  readingTime: number;
  category?: string;
  tags: string[];
  isPublished: boolean;
  isDraft: boolean;
  slug: string;
  views?: number;
  resonates?: number;
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalReadingTime: number;
  categoriesCount: number;
  tagsCount: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface ComingSoonFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  isLocked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  guestName: string;
  content: string;
  createdAt: Date;
  isApproved: boolean;
  isRejected: boolean;
  moderatedAt?: Date;
  ipAddress?: string;
}

export interface PendingComment {
  id: string;
  postTitle: string;
  postSlug: string;
  guestName: string;
  content: string;
  createdAt: Date;
  ipAddress?: string;
}

export interface ApprovedComment {
  id: string;
  guestName: string;
  content: string;
  createdAt: Date;
}

export interface AllComment {
  id: string;
  postTitle: string;
  postSlug: string;
  guestName: string;
  content: string;
  createdAt: Date;
  isApproved: boolean;
  isRejected: boolean;
  moderatedAt?: Date;
  ipAddress?: string;
}
