# Jumpcut — Video Editing Community & Agency

Jumpcut is a creative community and post-production agency for video editors, colorists, sound designers, and motion artists. Built with Next.js 16, Clerk authentication, and Supabase.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Authentication**: Clerk (`@clerk/nextjs`) — Google, GitHub, Facebook OAuth
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Styling**: Custom CSS design system (Jumpcut Design System) + Tailwind CSS 4
- **Fonts**: Inter, Clash Display (Fontshare), JetBrains Mono
- **Animations**: Lenis smooth scroll, CSS keyframe animations, Intersection Observer

---

## What's Built

The entire Jumpcut site has been converted from static HTML to a **Next.js 16 App Router** project with **Clerk auth** and **Supabase** — while keeping the exact dark aesthetic, animations (Lenis scroll, parallax, card hover, ticker tape), and CSS design system (2,361 lines preserved).

### Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, ticker, creators grid, template filters, services, FAQ, join form |
| `/creators` | Featured creators grid |
| `/templates` | Packs browser with sidebar (14 categories, featured creators) |
| `/community` | Community page with Discord widget |
| `/dashboard` | **Creator-only** — create/edit/delete packs, manage items |
| `/profile` | **Auth required** — edit name, handle, bio; request creator role |

### User System

- **Consumer** (default): Browse, like, follow, request creator status
- **Creator**: Create packs, upload items, delete their own content

---

## Project Structure

```
src/
├── app/
│   ├── globals.css              # Imports tailwindcss + jumpcut.css
│   ├── jumpcut.css               # Complete Jumpcut design system (2,361 lines)
│   ├── layout.tsx                # Root layout with ClerkProvider, fonts, grain overlay
│   ├── page.tsx                  # Homepage (hero, ticker, creators, templates, services, FAQ, join)
│   ├── creators/page.tsx         # Featured creators grid
│   ├── templates/page.tsx        # Packs browser with sidebar (categories + featured creators)
│   ├── community/page.tsx        # Community page with Discord widget
│   ├── dashboard/page.tsx        # Creator dashboard (manage packs, items) [auth required]
│   ├── profile/page.tsx          # User profile settings [auth required]
│   └── api/
│       ├── webhooks/clerk/route.ts   # Clerk webhook (user created/updated/deleted)
│       ├── packs/
│       │   ├── route.ts              # GET all published packs, POST new pack
│       │   └── [id]/
│       │       ├── route.ts          # GET/PATCH/DELETE single pack
│       │       └── items/route.ts    # POST add item, DELETE remove item
│       ├── profile/
│       │   ├── route.ts              # GET/PATCH user profile
│       │   └── role/route.ts         # POST request creator role
│       └── likes/route.ts            # POST toggle like, GET check like status
├── components/
│   ├── Nav.tsx                   # Shared navigation (Clerk auth buttons)
│   ├── Footer.tsx                # Shared footer
│   ├── HomeAnimations.tsx        # Lenis scroll, parallax, reveal animations
│   └── ui/                       # shadcn/ui components (for dashboard/profile)
├── lib/
│   └── supabase.ts               # Supabase client + admin client + TypeScript types
└── middleware.ts                  # Clerk middleware (protects /dashboard, /profile)
```

---

## Vercel Environment Secrets (all 7)

Add every variable below in **Vercel → Project Settings → Environment Variables**:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...     ← Clerk Dashboard → API Keys
CLERK_SECRET_KEY=sk_test_...                       ← Clerk Dashboard → API Keys
CLERK_WEBHOOK_SECRET=whsec_...                     ← Clerk Dashboard → Webhooks
NEXT_PUBLIC_SUPABASE_URL=https://zbujpvxlqpcfvboxawsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...               ← Supabase Dashboard → Settings → API
SUPABASE_SERVICE_ROLE_KEY=eyJ...                   ← Supabase Dashboard → Settings → API
DATABASE_URL=postgresql://postgres:BCTQBIohDD4AD0gz@db.zbujpvxlqpcfvboxawsw.supabase.co:5432/postgres
```

| Variable | Required | Description | Where to get it |
|---|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Yes | Clerk webhook signing secret | Clerk Dashboard → Webhooks → Add Endpoint |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (bypasses RLS) | Supabase Dashboard → Settings → API |
| `DATABASE_URL` | No | Direct PostgreSQL connection string | Supabase Dashboard → Settings → Database |

---

## Before Deploying — 3 Steps

### 1. Run the SQL schema

Open `supabase-schema.sql` in your **Supabase SQL Editor** and execute it. This creates:

- `profiles` table (linked to Clerk user IDs, consumer/creator roles)
- `packs` table (template packs created by creators)
- `pack_items` table (individual files within packs)
- `likes` table (user likes on packs)
- `handle_new_user()` trigger (auto-creates profile on Clerk signup)
- `update_updated_at()` trigger (auto-timestamps rows)
- `pack-files` storage bucket (for creator uploads)
- **Row Level Security policies on every table**

### 2. Configure OAuth

In **Clerk Dashboard → User & Authentication → Social Connections**, add:

| Provider | Where to create the OAuth app | Callback URL format |
|----------|------------------------------|---------------------|
| **Google** | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials | `https://<your-clerk-instance>.clerk.accounts.google.com/v1/callback` |
| **GitHub** | [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App | `https://<your-clerk-instance>.clerk.accounts.github.com/v1/callback` |
| **Facebook** | [Meta for Developers](https://developers.facebook.com/) → My Apps → Create App → Add Facebook Login | `https://<your-clerk-instance>.clerk.accounts.facebook.com/v1/callback` |

> **Note**: Replace `<your-clerk-instance>` with your Clerk Frontend API domain (found in Clerk Dashboard → API Keys).

### 3. Set up the webhook

In **Clerk Dashboard → Webhooks → Add Endpoint**:

- **URL**: `https://your-app.vercel.app/api/webhooks/clerk`
- **Subscribe to**: `user.created`, `user.updated`, `user.deleted`
- Copy the **Signing Secret** → this is your `CLERK_WEBHOOK_SECRET`

---

## Local Development

```bash
# 1. Clone and install
git clone <your-repo>
cd jumpcut
bun install

# 2. Copy env file and fill in your keys
cp .env.example .env.local

# 3. Run the dev server
bun run dev
```

Visit `http://localhost:3000`

---

## User Roles

| Role | Access |
|------|--------|
| **consumer** (default) | Browse templates, like packs, view creators, request creator status |
| **creator** | Everything consumers can do, plus: create/edit/delete packs, add/remove pack items, publish/unpublish packs |

Users start as consumers and can request creator role from their **Profile** page.

---

## Design System

The complete Jumpcut design system lives in `src/app/jumpcut.css` (2,361 lines). Key characteristics:

- Almost-black backgrounds (`#080808`, `#0e0e0e`)
- Pure white text with opacity variations
- Monospace accents (JetBrains Mono)
- Display headings (Clash Display)
- Subtle borders, no blue/purple
- Noise grain overlay
- Lenis smooth scrolling with parallax effects

---

## License

© 2026 Jumpcut. All rights reserved.