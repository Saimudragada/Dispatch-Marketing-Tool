# Assessment Context

## Who this is for

This app is being built as a take-home assessment for a GTM Marketer &
Engineer role at GenHealth.ai. The reviewer (Mike) will open the deployed
URL, log in with credentials provided separately, and evaluate both the
working app and the 3 pre-loaded content pieces.

## What GenHealth.ai actually does (researched directly from their site)

GenHealth builds AI Admin Agents for Providers and Plans — automating
healthcare operations tasks (intake, eligibility, prior authorization,
billing/RCM, denials, resupplies) via web, fax, and phone, with context
pulled from provider actions, plan policies, and patient charts.

Audience: RCM teams, health plans, providers, and DME (durable medical
equipment) companies. Product pages are literally segmented "For health
plans," "For RCM teams," "For providers and DMEs."

Their own site design language: off-white background, single muted-green
accent, status/verification UI everywhere (checkmarks, "MET" badges,
confidence percentages, citation footnotes pointing to source data),
monospace-leaning data labels, bordered cards showing live structured data
(chart notes, PA reviews, intake forms). This is a company whose visual
identity is built around trust and verifiability, not hype — see
`/docs/brand-voice.md` for the full writing-voice breakdown.

## Assessment requirements (verbatim intent, not to be altered)

Build and deploy a "Mini Marketing Command Center":

- Content library: create, edit, list, delete pieces. Each has title,
  channel (blog / LinkedIn / email newsletter), status (draft / scheduled /
  published), scheduled date.
- AI content generation: topic + channel in, first draft out, must sound
  like GenHealth, not generic AI.
- Calendar or pipeline view of what's scheduled and when.
- Persist everything to a real database.
- 3 finished, genuinely publishable pieces already in the app: 1 LinkedIn
  post, 1 email newsletter blurb, 1 blog post outline.
- Deployed somewhere publicly accessible.

## Grading signal (read between the lines)

The brief explicitly says: "We are evaluating your marketing judgment as
much as your build. Generic AI slop in the content pieces counts against
you." It also gives a long list of things to *consider* (auth, analytics,
SEO, rate limiting, etc.) but explicitly says to prioritize and choose
what's crucial for an MVP, not build everything. Under-scoping deliberately
and explaining why in the final note is treated as a positive signal, not
a negative one.

## Deliverable (separate from the app itself)

An email to mike@genhealth.ai containing: the public URL (plus login
credentials, since the app is gated), a link to the public GitHub repo,
and a 2-3 paragraph note explaining what was prioritized and why.

## Timebox

4 hours, self-reported. This is itself part of what's being evaluated —
work efficiently, don't gold-plate.