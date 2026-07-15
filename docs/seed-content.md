# Content Generation Briefs — 3 Required Pieces

These are NOT final copy. They are the topic/brief inputs to type into the
app's own AI generation feature at build-plan Step 9, so the 3 required
pieces are produced through the real pipeline rather than hardcoded.

Each brief is grounded in a real, already-published GenHealth case study
fact — this keeps the generated output honest (the AI isn't inventing
stats) while still proving the generation + brand-voice system works.

The fully-written drafts below each brief are FALLBACK REFERENCE ONLY —
use them only if the live generation output needs a strong starting point
to compare against, or if the AI/API is unavailable when this step runs.
Prefer the freshly generated + hand-edited version for the actual submission.

Target metadata per piece (apply regardless of which version is used):

| Piece | Channel | Status | Scheduled date |
|---|---|---|---|
| 1 | LINKEDIN | PUBLISHED | ~5 days before submission |
| 2 | EMAIL | SCHEDULED | ~3 days after submission |
| 3 | BLOG | DRAFT | ~10 days after submission |

---

## Piece 1 — LinkedIn Post

**Brief to type into the generator:**
Topic: "Piedmont Medical Solutions case study — 34.2% increase in
paid-to-date collections after switching to GenHealth for RCM billing,
replacing an outsourced team five times their size. Include the Jack
Bachman (CEO) quote about catching problems sooner and having more
transparency, no offshore billing workers."
Channel: LinkedIn

**Fallback reference draft (do not use verbatim — regenerate live):**

**title**: "Piedmont Medical Solutions: +34.2% collections after switching to GenHealth"
**channel**: LINKEDIN
**status**: PUBLISHED
**scheduledDate**: (set to a recent past date, e.g. 5 days before seed run)

**body**:
```
+34.2% increase in paid-to-date collections.

That's what Piedmont Medical Solutions saw after moving intake and billing
to GenHealth — replacing an outsourced team five times their size.

The difference wasn't more headcount. It was automating the parts of RCM
that don't need a human: reading faxed orders, filing claims, catching
denials before they become write-offs.

"They catch problems sooner and offer a level of transparency we never
had before," says Jack Bachman, CEO of Piedmont.

No offshore billing workers. No black box. Just an agent that works
inside the systems you already use.

Read the full case study — link in comments.
```

---

## Piece 2 — Email Newsletter Blurb

**Brief to type into the generator:**
Topic: "GuideHealth case study — up to 60% reduction in Utilization
Management workload using GenHealth's AI-native platform, $1.2M in annual
savings, decision consistency above 90%. Automated clinical data
extraction and policy evaluation across independent physician groups."
Channel: Email newsletter

**Fallback reference draft (do not use verbatim — regenerate live):**
```
Subject: 60% less UM workload, $1.2M saved annually — how GuideHealth did it

GuideHealth needed to scale utilization management without scaling
headcount. Independent physician groups were generating more prior auth
and medical necessity reviews than their team could keep up with.

GenHealth's AI-native platform automated clinical data extraction and
policy evaluation across their UM workflow — cutting workload by up to
60% and saving $1.2M annually, while keeping decision consistency above
90%.

The result: faster reviews, fewer bottlenecks, and a UM team that spends
its time on judgment calls instead of data entry.

Read the full GuideHealth case study →
```

---

## Piece 3 — Blog Post Outline

**Brief to type into the generator:**
Topic: "CMS's January 2026 prior authorization deadline — most health
plans are approaching compliance via the full Da Vinci standard (CRD,
DTR, PAS), which is a heavy integration lift. GenHealth's alternative
using FHIR DocumentReference + Binaries achieves >95% accuracy at 10x
lower cost with real-time turnaround, without the full Da Vinci buildout."
Channel: Blog (outline format)

**Fallback reference draft (do not use verbatim — regenerate live):**
```
## Outline

### H1: A Faster Path Through CMS's 2026 Prior Auth Mandates

**H2: The deadline health plans are racing toward**
- January 2026 CMS deadline for new prior authorization mandates
- Most plans are approaching this via the Da Vinci standard (CRD, DTR, PAS)
  — a heavier lift than it needs to be

**H2: Where the standard Da Vinci path breaks down**
- Da Vinci implementations require deep FHIR server integration work
- Long implementation timelines relative to the compliance deadline
- Named workflows affected: intake, eligibility, PA submission, concurrent
  review

**H2: The GenHealth approach — FHIR DocumentReference + Binaries**
- Achieves >95% accuracy without the full Da Vinci integration burden
- 10x lower implementation cost versus a full Da Vinci buildout
- Real-time turnaround instead of batch-cycle review

**H2: What this means for health plans and providers**
- Plans: meet the CMS deadline without a multi-quarter FHIR integration
  project
- Providers: faster PA turnaround on submissions, fewer denials from
  incomplete documentation
- Call to action: schedule a workflow review to see the faster path
  mapped against your current PA stack
```