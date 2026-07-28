import Link from "next/link";
import { Channel, Prisma, Status } from "@prisma/client";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { ContentCard } from "@/components/content-card";
import { CHANNELS, CHANNEL_LABEL, STATUSES, STATUS_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

function buildQuery(params: { q?: string; channel?: string; status?: string }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.channel) search.set("channel", params.channel);
  if (params.status) search.set("status", params.status);
  const s = search.toString();
  return s ? `/library?${s}` : "/library";
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; channel?: string; status?: string }>;
}) {
  const { q, channel, status } = await searchParams;

  const activeChannel = CHANNELS.includes(channel as Channel) ? (channel as Channel) : undefined;
  const activeStatus = STATUSES.includes(status as Status) ? (status as Status) : undefined;

  const where: Prisma.ContentPieceWhereInput = {
    ...(activeChannel ? { channel: activeChannel } : {}),
    ...(activeStatus ? { status: activeStatus } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { body: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [pieces, total] = await Promise.all([
    prisma.contentPiece.findMany({ where, orderBy: { scheduledDate: "desc" } }),
    prisma.contentPiece.count(),
  ]);

  const isFiltered = Boolean(q || activeChannel || activeStatus);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Content library"
        title="Every story,"
        titleAccent="on file"
        description={`${total} piece${total === 1 ? "" : "s"} across LinkedIn, email, and blog — searchable, filterable, and never lost in a shared drive.`}
      />

      <div className="flex flex-col gap-3">
        <form action="/library" method="GET" className="relative max-w-md">
          {activeChannel ? <input type="hidden" name="channel" value={activeChannel} /> : null}
          {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search titles and drafts…"
            className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Channel
          </span>
          <Link
            href={buildQuery({ q, status: activeStatus })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              !activeChannel
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-foreground/40"
            )}
          >
            All
          </Link>
          {CHANNELS.map((c) => (
            <Link
              key={c}
              href={buildQuery({ q, channel: c === activeChannel ? undefined : c, status: activeStatus })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                activeChannel === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/40"
              )}
            >
              {CHANNEL_LABEL[c]}
            </Link>
          ))}

          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Status
          </span>
          <Link
            href={buildQuery({ q, channel: activeChannel })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              !activeStatus
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-foreground/40"
            )}
          >
            All
          </Link>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={buildQuery({ q, channel: activeChannel, status: s === activeStatus ? undefined : s })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium",
                activeStatus === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/40"
              )}
            >
              {STATUS_LABEL[s]}
            </Link>
          ))}
        </div>
      </div>

      {pieces.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-xl italic text-muted-foreground">
            {isFiltered
              ? "No pieces match that filter. The story you want doesn't exist — yet."
              : "A blank library is just a launch waiting to happen."}
          </p>
          <Link
            href={isFiltered ? "/library" : "/compose"}
            className="mt-3 inline-block text-sm font-medium text-flame hover:underline"
          >
            {isFiltered ? "Clear filters →" : "Write the first piece →"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pieces.map((piece) => (
            <ContentCard key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    </div>
  );
}
