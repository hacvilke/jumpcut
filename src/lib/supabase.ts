import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'consumer' | 'creator';
  handle: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Pack = {
  id: string;
  creator_id: string;
  name: string;
  description: string | null;
  category: string;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  pack_items?: PackItem[];
  like_count?: number;
};

export type PackItem = {
  id: string;
  pack_id: string;
  name: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  sort_order: number;
  created_at: string;
};