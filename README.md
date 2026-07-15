# Dispatch — GenHealth Marketing Command Center

Content library, AI drafting, and calendar tool for GenHealth's marketing team. Built as a
timeboxed take-home assessment.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui
- Supabase Postgres, accessed via Prisma ORM
- Supabase Auth (single pre-created user, full-app gate — no sign-up flow)
- Anthropic API (`@anthropic-ai/sdk`, model `claude-sonnet-5`) for draft generation and repurposing
- Deployed on Vercel

## Local setup

1. Copy `.env.example` to `.env.local` and fill in real values:
   - `DATABASE_URL` / `DIRECT_URL` — Supabase connection pooler strings (Settings → Database → Connect).
     Use the **transaction pooler** (port 6543) for `DATABASE_URL` and the **session pooler**
     (port 5432) for `DIRECT_URL` — the direct connection host is IPv6-only and won't resolve
     from most local networks or CI runners.
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` —
     Settings → API.
   - `ANTHROPIC_API_KEY` — server-only, never exposed to the client.
2. Install dependencies: `npm install`
3. Push the schema to your database: `npx dotenv -e .env.local -- npx prisma db push`
4. Run the dev server: `npm run dev`

The one auth user is created via the Supabase Admin API (or dashboard) — there's no sign-up route.

## What was prioritized

Core CRUD, the auth gate, calendar gap-highlighting, and the AI generation/repurposing pipeline
were treated as non-negotiable — everything else (analytics, SEO, rate limiting, richer editing)
was deliberately left out of scope for this timebox. See the note sent alongside the deployment
link for the full reasoning.
