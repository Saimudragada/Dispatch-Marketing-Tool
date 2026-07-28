import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { ChannelChip } from "@/components/channel-chip";
import { StatusBadge } from "@/components/status-badge";
import { CHANNELS, CHANNEL_LABEL, CHANNEL_DOT } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { ArrowRight, CalendarDays, Lightbulb, PenLine, TriangleAlert } from "lucide-react";

export const dynamic = "force-dynamic";

function utcToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export default async function DashboardPage() {
  const today = utcToday();
  const in7 = new Date(today);
  in7.setUTCDate(in7.getUTCDate() + 7);
  const in14 = new Date(today);
  in14.setUTCDate(in14.getUTCDate() + 14);

  const [pieces, ideas] = await Promise.all([
    prisma.contentPiece.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.idea.findMany({ where: { status: { not: "DRAFTED" } } }),
  ]);

  const drafts = pieces.filter((p) => p.status === "DRAFT");
  const scheduled = pieces.filter((p) => p.status === "SCHEDULED");
  const published = pieces.filter((p) => p.status === "PUBLISHED");

  const upNext = pieces
    .filter(
      (p) => p.status === "SCHEDULED" && p.scheduledDate >= today && p.scheduledDate < in7
    )
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

  const scheduledNext14 = pieces.filter(
    (p) => p.status === "SCHEDULED" && p.scheduledDate >= today && p.scheduledDate < in14
  );

  const channelCounts = CHANNELS.map((channel) => ({
    channel,
    count: pieces.filter((p) => p.channel === channel).length,
  }));
  const maxChannel = Math.max(1, ...channelCounts.map((c) => c.count));

  const recent = pieces.slice(0, 5);

  const stats = [
    { label: "In the works", value: drafts.length, hint: "drafts on the bench" },
    { label: "Scheduled", value: scheduled.length, hint: "locked on the calendar" },
    { label: "Published", value: published.length, hint: "out in the world" },
    { label: "Ideas banked", value: ideas.length, hint: "waiting for their moment" },
  ];

  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(today);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Command center"
        title="Mission"
        titleAccent="control"
        description={`${todayLabel}. Every draft, slot, and idea across the pipeline — one glance, no tab-hopping.`}
      >
        <Link
          href="/compose"
          className="inline-flex items-center gap-2 rounded-lg bg-flame px-4 py-2.5 text-sm font-semibold text-white hover:bg-flame/90"
        >
          <PenLine className="size-4" />
          Start a draft
        </Link>
      </PageHeader>

      {scheduledNext14.length === 0 ? (
        <div className="flex items-start gap-3 rounded-xl border border-honey/40 bg-honey-soft px-4 py-3">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-honey" />
          <p className="text-sm text-foreground">
            <span className="font-semibold">Quiet fortnight ahead.</span>{" "}
            <span className="text-muted-foreground">
              Nothing is scheduled in the next 14 days — the pipeline goes silent.{" "}
              <Link href="/calendar" className="font-medium text-honey underline underline-offset-2">
                Fill the calendar →
              </Link>
            </span>
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-5xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight">Up next — 7 days</h2>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-flame"
            >
              <CalendarDays className="size-3.5" />
              Calendar
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {upNext.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="font-display text-lg italic text-muted-foreground">
                Nothing on the docket. Suspiciously quiet.
              </p>
              <Link
                href="/compose"
                className="mt-3 inline-block text-sm font-medium text-flame hover:underline"
              >
                Draft something worth shipping →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {upNext.map((piece) => (
                <li key={piece.id}>
                  <Link
                    href={`/piece/${piece.id}`}
                    className="group flex items-center gap-4 py-3"
                  >
                    <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      }).format(piece.scheduledDate)}
                    </span>
                    <span className={cn("size-2 shrink-0 rounded-full", CHANNEL_DOT[piece.channel])} />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground group-hover:text-flame">
                      {piece.title}
                    </span>
                    <span className="hidden font-mono text-[10px] uppercase tracking-wide text-muted-foreground sm:block">
                      {CHANNEL_LABEL[piece.channel]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold tracking-tight">Channel mix</h2>
            <div className="mt-4 flex flex-col gap-3">
              {channelCounts.map(({ channel, count }) => (
                <div key={channel} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    {CHANNEL_LABEL[channel]}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn("h-full rounded-full", CHANNEL_DOT[channel])}
                      style={{ width: `${(count / maxChannel) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-xs text-foreground">{count}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
              {pieces.length === 0
                ? "No pieces yet — the mix starts with the first draft."
                : "A healthy pipeline tells the same story three ways."}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold tracking-tight">Idea bank</h2>
              <Link
                href="/ideas"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-flame"
              >
                <Lightbulb className="size-3.5" />
                Ideas
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {ideas.length === 0 ? (
                <>The idea bank is empty. Brainstorm a batch before the well runs dry.</>
              ) : (
                <>
                  <span className="font-display text-2xl font-semibold text-foreground">
                    {ideas.length}
                  </span>{" "}
                  idea{ideas.length === 1 ? "" : "s"} waiting to become drafts.
                </>
              )}
            </p>
          </section>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">Recently touched</h2>
          <Link href="/library" className="text-xs font-medium text-muted-foreground hover:text-flame">
            Full library →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="font-display text-lg italic text-muted-foreground">
              A blank library is just a launch waiting to happen.
            </p>
            <Link
              href="/compose"
              className="mt-3 inline-block text-sm font-medium text-flame hover:underline"
            >
              Write the first piece →
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {recent.map((piece) => (
                <li key={piece.id}>
                  <Link
                    href={`/piece/${piece.id}`}
                    className="group flex items-center gap-4 px-5 py-3.5"
                  >
                    <ChannelChip channel={piece.channel} className="hidden sm:inline-flex" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground group-hover:text-flame">
                      {piece.title}
                    </span>
                    <StatusBadge status={piece.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
