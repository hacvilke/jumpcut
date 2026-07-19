-- ============================================================
-- JUMPCUT — Supabase Schema (run in Supabase SQL Editor)
-- All tables use Row Level Security (RLS)
-- ============================================================

-- 1. PROFILES TABLE
-- Stores Clerk user data + role (consumer/creator)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'consumer' CHECK (role IN ('consumer', 'creator')),
  handle TEXT UNIQUE,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE USING (auth.uid() = id);


-- 2. PACKS TABLE
-- Creators create packs (collections of template items)
CREATE TABLE IF NOT EXISTS public.packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'all',
  cover_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Packs viewable if published or owned"
  ON public.packs FOR SELECT
  USING (is_published = true OR auth.uid() = creator_id);

CREATE POLICY "Only creators can insert packs"
  ON public.packs FOR INSERT WITH CHECK (
    auth.uid() = creator_id
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'creator')
  );

CREATE POLICY "Creators can update own packs"
  ON public.packs FOR UPDATE
  USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own packs"
  ON public.packs FOR DELETE USING (auth.uid() = creator_id);


-- 3. PACK_ITEMS TABLE
-- Individual items within a pack (templates, files, etc.)
CREATE TABLE IF NOT EXISTS public.pack_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pack_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pack items viewable with published packs"
  ON public.pack_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.packs
    WHERE packs.id = pack_items.pack_id
    AND (packs.is_published = true OR auth.uid() = packs.creator_id)
  ));

CREATE POLICY "Creators insert items in own packs"
  ON public.pack_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.packs WHERE packs.id = pack_items.pack_id AND packs.creator_id = auth.uid())
  );

CREATE POLICY "Creators update items in own packs"
  ON public.pack_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.packs WHERE packs.id = pack_items.pack_id AND packs.creator_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.packs WHERE packs.id = pack_items.pack_id AND packs.creator_id = auth.uid()));

CREATE POLICY "Creators delete items in own packs"
  ON public.pack_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.packs WHERE packs.id = pack_items.pack_id AND packs.creator_id = auth.uid()));


-- 4. LIKES TABLE
-- Consumers can like packs
CREATE TABLE IF NOT EXISTS public.likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, pack_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON public.likes FOR SELECT USING (true);

CREATE POLICY "Users can like"
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike"
  ON public.likes FOR DELETE USING (auth.uid() = user_id);


-- 5. TRIGGER: Auto-create profile on Clerk user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 6. TRIGGER: Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS packs_updated_at ON public.packs;
CREATE TRIGGER packs_updated_at BEFORE UPDATE ON public.packs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- 7. STORAGE BUCKET for pack files
INSERT INTO storage.buckets (id, name, public) VALUES ('pack-files', 'pack-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view pack files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pack-files');

CREATE POLICY "Creators can upload pack files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pack-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Creators can update own pack files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'pack-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Creators can delete own pack files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pack-files' AND auth.uid() IS NOT NULL);