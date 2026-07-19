import pg from 'pg';
const { Client } = pg;

async function setup() {
  const client = new Client({
    host: 'aws-0-us-west-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.zbujpvxlqpcfvboxawsw',
    password: 'BCTQBIohDD4AD0gz',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  await client.connect();
  console.log('Connected to Supabase PostgreSQL');

  // Create profiles table
  await client.query(`
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

    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Profiles policies
    CREATE POLICY "Profiles are viewable by everyone"
      ON public.profiles FOR SELECT
      USING (true);

    CREATE POLICY "Users can insert their own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);

    CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);

    CREATE POLICY "Users can delete their own profile"
      ON public.profiles FOR DELETE
      USING (auth.uid() = id);
  `);
  console.log('Created profiles table with RLS');

  // Create packs table
  await client.query(`
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

    CREATE POLICY "Packs are viewable by everyone if published"
      ON public.packs FOR SELECT
      USING (is_published = true OR auth.uid() = creator_id);

    CREATE POLICY "Creators can insert their own packs"
      ON public.packs FOR INSERT
      WITH CHECK (
        auth.uid() = creator_id
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'creator')
      );

    CREATE POLICY "Creators can update their own packs"
      ON public.packs FOR UPDATE
      USING (auth.uid() = creator_id)
      WITH CHECK (auth.uid() = creator_id);

    CREATE POLICY "Creators can delete their own packs"
      ON public.packs FOR DELETE
      USING (auth.uid() = creator_id);
  `);
  console.log('Created packs table with RLS');

  // Create pack_items table
  await client.query(`
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

    CREATE POLICY "Pack items are viewable with published packs"
      ON public.pack_items FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.packs
          WHERE packs.id = pack_items.pack_id
          AND (packs.is_published = true OR auth.uid() = packs.creator_id)
        )
      );

    CREATE POLICY "Creators can insert items in their own packs"
      ON public.pack_items FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.packs
          WHERE packs.id = pack_items.pack_id AND packs.creator_id = auth.uid()
        )
      );

    CREATE POLICY "Creators can update items in their own packs"
      ON public.pack_items FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.packs
          WHERE packs.id = pack_items.pack_id AND packs.creator_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.packs
          WHERE packs.id = pack_items.pack_id AND packs.creator_id = auth.uid()
        )
      );

    CREATE POLICY "Creators can delete items in their own packs"
      ON public.pack_items FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.packs
          WHERE packs.id = pack_items.pack_id AND packs.creator_id = auth.uid()
        )
      );
  `);
  console.log('Created pack_items table with RLS');

  // Create likes table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.likes (
      user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, pack_id)
    );

    ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Anyone authenticated can view likes"
      ON public.likes FOR SELECT
      USING (true);

    CREATE POLICY "Users can like packs"
      ON public.likes FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can unlike packs"
      ON public.likes FOR DELETE
      USING (auth.uid() = user_id);
  `);
  console.log('Created likes table with RLS');

  // Create function to handle new user creation
  await client.query(`
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
  `);

  // Drop existing trigger if exists, then create
  await client.query(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);
  await client.query(`
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `);
  console.log('Created handle_new_user trigger');

  // Create updated_at trigger function
  await client.query(`
    CREATE OR REPLACE FUNCTION public.update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await client.query(`DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;`);
  await client.query(`CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();`);

  await client.query(`DROP TRIGGER IF EXISTS packs_updated_at ON public.packs;`);
  await client.query(`CREATE TRIGGER packs_updated_at BEFORE UPDATE ON public.packs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();`);

  console.log('Created updated_at triggers');

  await client.end();
  console.log('\nAll tables and RLS policies created successfully!');
}

setup().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});