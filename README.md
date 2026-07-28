# Dispatch — Marketing Command Center

An enterprise-grade internal tool for marketing teams: one place to plan the calendar, draft
in brand voice with AI, bank and brainstorm ideas, and repurpose content across channels
without losing a single fact.

**Live:** https://dispatch-marketing-tool.vercel.app — no login required.

## What's inside

- **Dashboard** — pipeline health at a glance: drafts in the works, what's scheduled, what
  shipped, the channel mix, the next seven days, and a loud warning when the next two weeks
  are silent.
- **Content library** — every piece on file, full-text searchable, filterable by channel and
  status. Cards, not spreadsheets.
- **Drafting studio** — topic + channel in, first draft out. Every generation call injects the
  complete brand-voice reference file into the system prompt, so drafts sound like the house,
  not like generic AI. Generated drafts carry a citation tag ("Generated from: topic, channel").
- **Idea bank** — capture sparks before they evaporate, or let the AI brainstorm six stat-led
  angles at a time. Ideas move Spark → Shaping → Drafted, and promote straight into the
  drafting studio with one click.
- **Editorial calendar** — month grid with channel-coded entries. Weeks with nothing scheduled
  get flagged as gap weeks, because a quiet calendar is how audiences forget you exist.
- **Fact-anchored repurposing** — one story, three channels. The repurpose engine is explicitly
  instructed to preserve every number, name, and claim from the source exactly — only structure,
  length, and framing change per channel.

## Design

Editorial-studio personality rather than SaaS-template gray: warm paper canvas with a faint
dot grid, ink sidebar, Fraunces display serif for headlines and big numerals, one flame-orange
accent for action, channel-coded dots everywhere a piece appears, and status pills that read
at a glance. Microcopy has a point of view.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Postgres (Supabase) via Prisma ORM
- Anthropic API (`@anthropic-ai/sdk`, model `claude-sonnet-5`) for drafting, brainstorming,
  and repurposing — server-side only
- Deployed on Vercel

## Local setup

1. Copy `.env.example` to `.env.local` and fill in real values:
   - `DATABASE_URL` / `DIRECT_URL` — Postgres connection strings (for Supabase, use the
     transaction pooler on 6543 for `DATABASE_URL` and the session pooler on 5432 for `DIRECT_URL`).
   - `ANTHROPIC_API_KEY` — server-only, never exposed to the client.
2. Install dependencies: `npm install`
3. Push the schema: `npx dotenv -e .env.local -- npx prisma db push`
4. Run the dev server: `npm run dev`

On Vercel, the `vercel-build` script runs `prisma db push` before `next build`, so additive
schema changes apply to the production database automatically on deploy.

## A note on access

This deployment is intentionally public — it's a showcase build. There is no auth gate, which
means anyone with the URL can read and write content. Don't put anything in it you'd mind
losing or sharing.
