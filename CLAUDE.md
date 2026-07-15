# Dispatch — GenHealth Marketing Command Center

You are building "Dispatch," a content library + AI drafting + calendar tool
for GenHealth's marketing team. Read `/docs/context.md` and `/docs/brand-voice.md`
in full before writing any code. This is a 4-hour timeboxed assessment project —
prioritize a fully working core over a partially working feature list.

## Stack (locked — do not deviate or suggest alternatives)

- Next.js 14+ App Router, TypeScript
- Tailwind CSS + shadcn/ui components
- Database: Supabase Postgres, accessed via Prisma ORM
- Auth: Supabase Auth, single pre-created user, full-app gate (see Auth section below)
- AI generation: Anthropic API (`@anthropic-ai/sdk`), model ID `claude-sonnet-5`
  (see "Anthropic API integration" section below for exact usage)
- Deployment target: Vercel
- Repo: public GitHub repo

## Non-negotiable requirements (from the assessment brief — do not simplify these away)

1. Content library: create / edit / list / delete. Each piece has exactly:
   `title` (string), `channel` (enum: `BLOG` | `LINKEDIN` | `EMAIL`),
   `status` (enum: `DRAFT` | `SCHEDULED` | `PUBLISHED`), `scheduledDate` (date), `body` (text).
2. AI generation: given a topic + channel, produce a first draft using the
   brand voice rules in `/docs/brand-voice.md`. Every generation call must
   inject the full contents of that file into the system prompt — never
   paraphrase or summarize it into the prompt from memory.
3. Calendar view: month-grid (not kanban), showing scheduled content by date.
   Empty weeks with zero scheduled content should be visually flagged
   (subtle amber outline) — this is the "gap highlighting" differentiator feature.
4. Persistence: real Postgres via Supabase, not in-memory, not SQLite.
5. The production database must contain 3 real, publishable pieces before
   the app is considered "done": 1 LinkedIn post, 1 email newsletter
   blurb, 1 blog post outline. These are NOT seeded via script — they are
   produced by actually using the app's own AI generation and repurposing
   features (see build-plan.md Step 9), then hand-edited for quality, then
   saved through the normal UI on the production deployment. This proves
   the generation pipeline actually works rather than just displaying
   static content next to an untested feature. Generation briefs are in
   `/docs/seed-content.md` — the fallback drafts in that file are
   reference only, not to be inserted verbatim unless generation fails.
6. Auth: single gate on the entire app. No public write access, no public
   read access either — the whole dashboard requires login. One pre-created
   Supabase user, no sign-up flow. See Auth section below.
7. Fact-anchored repurposing: a "repurpose to other channels" action on any
   finished piece that generates the other two channel versions, explicitly
   instructed (in the prompt) to preserve every specific number, name, and
   claim from the source piece exactly — never invent or drift stats between
   versions.

## Design direction — imitate GenHealth's actual site, not generic SaaS

Reference: genhealth.ai (already researched, see `/docs/context.md` for details).

- Background: off-white/cream (~`#FAF9F5`), not stark white
- Single accent color: muted green (~`#a8fc8f` family), used sparingly for
  primary actions and positive/published states only
- Status badges as small pills, not colorful chips: Draft = neutral gray,
  Scheduled = amber outline, Published = green accent + checkmark
- Content displayed in bordered cards with generous padding, not dense tables
- Clean sans-serif type, confident tight headlines, no decorative fonts
- No gradients, no dark mode, no illustration-heavy hero sections — restraint
  IS the design decision here, matching GenHealth's own calm, data-forward UI
- When AI generates a draft, show a small citation-style footnote tag
  ("Generated from: topic, channel") echoing GenHealth's own citation UI pattern

## Auth implementation notes

- Do NOT build a sign-up flow. One user is pre-created manually in the
  Supabase dashboard.
- Use Supabase Auth's `signInWithPassword` on a simple `/login` page.
- Use Next.js middleware to check session on every route under the app —
  redirect to `/login` if no valid session. This includes API routes.
- `.env.local` holds real secrets (gitignored). `.env.example` in the repo
  root lists the required keys with blank values — see that file for the
  exact variable names to use.

## Anthropic API integration — exact usage, do not deviate

Install: `npm install @anthropic-ai/sdk`

Use this exact model ID string: `claude-sonnet-5`
Do not substitute any other model name, alias, or a dated snapshot ID —
use exactly this string.

Server-side only (inside a Next.js API route, e.g. `/app/api/generate/route.ts`
or `/app/api/repurpose/route.ts`). Never call this from client components.

Minimum required call shape — `max_tokens` is a required field, not optional:

```ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // server-only env var, no NEXT_PUBLIC_ prefix
});

const response = await anthropic.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  system: fullBrandVoiceFileContents, // inject the ENTIRE contents of docs/brand-voice.md here, not a summary
  messages: [
    { role: "user", content: `Topic: ${topic}\nChannel: ${channel}\n\nWrite a first draft.` },
  ],
});

const draftText = response.content
  .filter((block) => block.type === "text")
  .map((block) => block.text)
  .join("\n");
```

If a generation call fails, catch the error and surface a clear message in
the UI (see Step 7 in build-plan.md) — do not let it crash the page or
fail silently. Common causes of failure to check for for if this comes up:
wrong/mistyped model ID, missing `max_tokens`, `ANTHROPIC_API_KEY` not
present in the server environment (check `.env.local` variable name
matches exactly), or attempting to call this from client-side code.


## Build workflow — follow this exactly, do not skip ahead

Work through `/docs/build-plan.md` one numbered step at a time, in order.
After completing each step:

1. Run the dev server.
2. Use the Playwright browser tool to open the app and actually click through
   the feature you just built — don't just eyeball the code.
3. Take a screenshot and report what you see, including any errors in the
   browser console or terminal.
4. Explicitly state "Step N complete, verified working" before moving to
   step N+1.
5. If something is broken, fix it before proceeding — do not build on top
   of a known-broken feature.

Deploy the empty skeleton to Vercel immediately after step 1 in the build
plan (before most features exist) so the public URL is locked in early.
Re-deploy after each major step so the live URL always reflects current progress.

## Things to avoid

- Do not add authentication providers other than Supabase Auth (no NextAuth,
  no Clerk, no custom JWT signing).
- Do not use SQLite or any local-file database — Vercel's filesystem is
  ephemeral and this would lose data on every deploy.
- Do not build features not listed in `/docs/build-plan.md` without asking
  first — scope creep is the main risk in a 4-hour build.
- Do not soften, generalize, or "improve" the brand voice rules — GenHealth's
  actual documented tone is deliberately plain and stat-led; do not make
  generated content sound more like generic marketing copy.
- Do not expose the Supabase secret key or Anthropic API key to client-side
  code. Both are server-only.