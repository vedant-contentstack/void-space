import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a safe Supabase client that handles missing configuration
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : null;

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          banner_image: string | null;
          category: string | null;
          tags: string[];
          author_id: string;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          reading_time: number;
          is_published: boolean;
          is_draft: boolean;
          views: number;
          resonates: number;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          banner_image?: string | null;
          category?: string | null;
          tags?: string[];
          author_id: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          reading_time: number;
          is_published?: boolean;
          is_draft?: boolean;
          views?: number;
          resonates?: number;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          banner_image?: string | null;
          category?: string | null;
          tags?: string[];
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          reading_time?: number;
          is_published?: boolean;
          is_draft?: boolean;
          views?: number;
          resonates?: number;
        };
      };
      comments: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          post_id: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
          resonates: number;
        };
        Insert: {
          id?: string;
          content: string;
          author_id: string;
          post_id: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
          resonates?: number;
        };
        Update: {
          id?: string;
          content?: string;
          author_id?: string;
          post_id?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
          resonates?: number;
        };
      };
      post_resonates: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      comment_resonates: {
        Row: {
          id: string;
          user_id: string;
          comment_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          comment_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          comment_id?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
