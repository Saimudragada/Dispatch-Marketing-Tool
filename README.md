# Dispatch — GenHealth Marketing Command Center

A content library, AI drafting tool, and calendar for GenHealth's marketing team. Built as a
timeboxed take-home assessment.

## What this is

Most "AI content tool" demos generate a draft and stop there. Dispatch is built around the parts
of a real marketing workflow that actually break: keeping facts straight when the same story gets
told on three channels, keeping the brand voice consistent instead of drifting toward generic
AI copy, and being able to see at a glance where the content pipeline has gone quiet.

## Why it's different

- **Fact-anchored repurposing.** Turning a LinkedIn post into an email and a blog outline is
  the easiest place for AI tools to quietly invent or round a number. Repurposing here is
  explicitly instructed to preserve every stat, name, and quote from the source piece exactly —
  only structure and length change per channel.
- **The brand voice is grounded, not guessed.** Every generation call injects the full contents
  of the brand-voice reference file into the system prompt — the model never works from a
  paraphrased summary of the rules. Generated drafts carry a citation-style footnote ("Generated
  from: topic, channel"), so it's always traceable what a draft came from, echoing GenHealth's
  own citation-driven UI.
- **It looks like GenHealth, not a SaaS template.** Off-white background, one muted-green accent
  used sparingly, status as plain pills instead of colorful chips, bordered cards instead of dense
  tables — matching the calm, data-forward style of GenHealth's actual site rather than a generic
  admin dashboard.
- **The calendar flags gaps, not just dates.** A month can look "fine" in a list view while
  actually having two dead weeks with nothing scheduled. Empty weeks get a visible amber outline
  instead of silently doing nothing.

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
was deliberately left out of scope for this timebox.
