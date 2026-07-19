# Jumpcut — Video Editing Community & Agency

Jumpcut is a creative community and post-production agency for video editors, colorists, sound designers, and motion artists. Built with Next.js 16, Clerk authentication, and Supabase.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Authentication**: Clerk (`@clerk/nextjs`)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Custom CSS design system (Jumpcut Design System) + Tailwind CSS 4
- **Fonts**: Inter, Clash Display (Fontshare), JetBrains Mono
- **Animations**: Lenis smooth scroll, CSS keyframe animations, Intersection Observer

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Imports tailwindcss + jumpcut.css
│   ├── jumpcut.css           # Complete Jumpcut design system (2,361 lines)
│   ├── layout.tsx            # Root layout with ClerkProvider, fonts, grain overlay
│   ├── page.tsx              # Homepage (hero, ticker, creators, templates, services, FAQ, join)
│   ├── creators/page.tsx     # Featured creators grid
│   ├── templates/page.tsx    # Packs browser with sidebar (categories + featured creators)
│   ├── community/page.tsx    # Community page with Discord widget
│   ├── dashboard/page.tsx    # Creator dashboard (manage packs, items) [auth required]
│   ├── profile/page.tsx      # User profile settings [auth required]
│   └── api/
│       ├── webhooks/clerk/route.ts   # Clerk webhook (user created/updated/deleted)
│       ├── packs/
│       │   ├── route.ts              # GET all published packs, POST new pack
│       │   └── [id]/
│       │       ├── route.ts          # GET/PATCH/DELETE single pack
│       │       └── items/route.ts   # POST add item, DELETE remove item
│       ├── profile/
│       │   ├── route.ts              # GET/PATCH user profile
│       │   └── role/route.ts         # POST request creator role
│       └── likes/route.ts            # POST toggle like, GET check like status
├── components/
│   ├── Nav.tsx               # Shared navigation (Clerk auth buttons)
│   ├── Footer.tsx            # Shared footer
│   ├── HomeAnimations.tsx    # Lenis scroll, parallax, reveal animations
│   └── ui/                   # shadcn/ui components (for dashboard/profile)
├── lib/
│   └── supabase.ts           # Supabase client + admin client + TypeScript types
└── middleware.ts              # Clerk middleware (protects /dashboard, /profile)
```

## Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo>
cd my-project
bun install
```

### 2. Set up Clerk

1. Go to [clerk.com](https://clerk.com) and sign in (your app ID: `app_3GiZ1hXKDdWLEwVpTbt7kHz8uvY`)
2. In your Clerk dashboard, go to **API Keys** and copy:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`
3. Go to **Webhooks** → **Add Endpoint**:
   - URL: `https://your-domain.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy the **Signing Secret** → `CLERK_WEBHOOK_SECRET`

### 2b. Configure OAuth Providers (Google, GitHub, Facebook)

In your Clerk dashboard:

1. **Google**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Authorized redirect URI: `https://your-clerk-instance.clerk.accounts.google.com/v1/callback`
   - In Clerk Dashboard → **User & Authentication** → **Social Connections** → **Google** → paste Client ID + Secret

2. **GitHub**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App
   - Authorization callback URL: `https://your-clerk-instance.clerk.accounts.github.com/v1/callback`
   - In Clerk Dashboard → **Social Connections** → **GitHub** → paste Client ID + Secret

3. **Facebook**:
   - Go to [Meta for Developers](https://developers.facebook.com/) → My Apps → Create App
   - Add Facebook Login product
   - Valid OAuth Redirect URIs: `https://your-clerk-instance.clerk.accounts.facebook.com/v1/callback`
   - In Clerk Dashboard → **Social Connections** → **Facebook** → paste App ID + App Secret

> **Note**: The callback URLs above use your Clerk instance domain (found in Clerk Dashboard → **API Keys** → "Frontend API" domain). Replace `your-clerk-instance` with your actual domain.

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and open your project (ref: `zbujpvxlqpcfvboxawsw`)
2. In **Settings** → **API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (already set: `https://zbujpvxlqpcfvboxawsw.supabase.co`)
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
3. Run the database schema (see below)

### 4. Run the database schema

Execute the SQL in `supabase-schema.sql` in the Supabase SQL Editor:

```bash
# Or use the Supabase dashboard → SQL Editor → paste the contents of supabase-schema.sql
```

The schema creates:
- `profiles` table (linked to Clerk user IDs)
- `packs` table (template packs created by creators)
- `pack_items` table (individual files within packs)
- `likes` table (user likes on packs)

### 5. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

### 6. Run the dev server

```bash
bun run dev
```

Visit `http://localhost:3000`

## Environment Variables

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Yes | Clerk webhook signing secret | Clerk Dashboard → Webhooks → Add Endpoint |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (bypasses RLS) | Supabase Dashboard → Settings → API |
| `DATABASE_URL` | No | Direct PostgreSQL connection string | Supabase Dashboard → Settings → Database |

## User Roles

- **consumer** (default): Can browse templates, like packs, view creators, and request creator status
- **creator**: Can create/edit/delete packs, add/remove pack items, publish/unpublish packs

Users start as consumers and can request creator role from their profile page.

## Deployment to Vercel

1. Push your code to GitHub
2. Connect the repo in Vercel
3. Add these **Environment Variables** in Vercel project settings:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

4. Set up the Clerk webhook endpoint in your Clerk dashboard pointing to your Vercel URL:
   `https://your-app.vercel.app/api/webhooks/clerk`

5. Deploy!

## Design System

The complete Jumpcut design system lives in `src/app/jumpcut.css`. Key characteristics:
- Almost-black backgrounds (`#080808`, `#0e0e0e`)
- Pure white text with opacity variations
- Monospace accents (JetBrains Mono)
- Display headings (Clash Display)
- Subtle borders, no blue/purple
- Noise grain overlay
- Lenis smooth scrolling with parallax effects

## License

&copy; 2026 Jumpcut. All rights reserved.