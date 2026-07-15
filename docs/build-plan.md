# Build Plan — work through in order, one step at a time

Do not start step N+1 until step N has been verified working in a browser
(see the Build Workflow section of `CLAUDE.md`).

- [ ] **Step 1 — Scaffold + deploy skeleton**
  Next.js + TypeScript + Tailwind + shadcn/ui init. Connect Prisma to
  Supabase using `.env.local` (values supplied by the user, see
  `.env.example` for variable names). Push to GitHub. Deploy to Vercel
  immediately — even with just a placeholder homepage — so the public
  URL exists from this point forward.

- [ ] **Step 2 — Data model + migration**
  Prisma schema: `ContentPiece` model (title, channel enum, status enum,
  scheduledDate, body, createdAt, updatedAt). Run migration against
  Supabase. Verify in Supabase's table editor that the table exists.

- [ ] **Step 3 — Auth gate**
  Supabase Auth login page at `/login`. Middleware protecting all other
  routes, including API routes. Verify: visiting any page while logged
  out redirects to `/login`; logging in with the pre-created user grants
  access to the rest of the app.

- [ ] **Step 4 — Content library UI**
  List view of all content pieces (cards, per design direction in
  `CLAUDE.md`). Create, edit, delete flows. No AI yet — just manual entry.
  Verify: create a test piece, edit it, delete it, confirm each persists
  correctly across a page refresh.

- [ ] **Step 5 — Status workflow**
  Status badges (Draft / Scheduled / Published) with the pill styling
  from `CLAUDE.md`. Ability to change status from the UI. Verify:
  changing status updates immediately and persists.

- [ ] **Step 6 — Calendar view**
  Month-grid view, pulling from the same data as the library. Empty-week
  gap highlighting (amber outline). Verify: pieces appear on the correct
  date; a week with nothing scheduled visually stands out.

- [ ] **Step 7 — AI draft generation**
  Form: topic + channel → calls Anthropic API with `/docs/brand-voice.md`
  injected into the system prompt (full contents, not summarized) plus
  the channel-specific structure rules from that same file. Loading
  state while generating. Error handling: if the API call fails, show a
  clear error message, don't crash the page. Verify: generate a draft for
  each of the 3 channels, confirm the output follows brand-voice rules
  (stat-led, no hype words, correct structure per channel).

- [ ] **Step 8 — Fact-anchored repurposing**
  "Repurpose to other channels" action on any piece. Prompt must
  explicitly instruct the model to preserve every number, name, and claim
  from the source content exactly, only changing structure/length per
  channel. Verify: repurpose a piece, confirm the numbers in the output
  match the source piece exactly.

- [ ] **Step 9 — Create the 3 required pieces through the app itself**
  Do NOT use a seed script with hardcoded text. Instead, use the deployed
  app's own AI generation (Step 7) and repurposing (Step 8) features to
  produce the 3 required pieces, then review and edit for quality before
  saving as final:

  1. Generate the LinkedIn post using the brief in `/docs/seed-content.md`
     as the topic input.
  2. Use "Repurpose to other channels" on that piece to generate the email
     and blog versions, OR generate them independently with their own
     briefs — either is fine, but at least one piece should go through the
     repurposing path so it's demonstrated working.
  3. Edit each generated draft by hand for quality and accuracy — the
     brand-voice system prompt gets you most of the way there, but human
     review before publishing is expected, same as a real workflow.
  4. Save each piece with the correct status (see `/docs/seed-content.md`
     for target statuses per piece) directly through the app's UI, on the
     production deployment.

  Verify by opening the deployed public URL, logging in, and confirming
  all 3 pieces are visible in both the library and calendar views, and
  that each one reads as genuinely publishable — not generic AI output.

- [ ] **Step 10 — Polish pass** (only if time remains)
  Mobile responsiveness check, empty states (e.g. "no content yet" in the
  library), loading skeletons, README with setup instructions.