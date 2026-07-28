import Link from "next/link";
import { ContentPiece } from "@prisma/client";
import { StatusSelect } from "@/components/status-select";
import { DeleteButton } from "@/components/delete-button";
import { ChannelChip } from "@/components/channel-chip";

export function ContentCard({ piece }: { piece: ContentPiece }) {
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(piece.scheduledDate);

  const wordCount = piece.body.trim() ? piece.body.trim().split(/\s+/).length : 0;

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-[4px_4px_0_0_var(--color-border)]">
      <div className="flex items-start justify-between gap-3">
        <ChannelChip channel={piece.channel} />
        <StatusSelect id={piece.id} status={piece.status} />
      </div>

      <Link href={`/piece/${piece.id}`} className="block">
        <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground group-hover:text-flame">
          {piece.title}
        </h3>
      </Link>

      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
        {piece.body || "No draft content yet — a title in search of a story."}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-dashed border-border pt-3">
        <span className="font-mono text-[11px] text-muted-foreground">
          {dateLabel} · {wordCount} words
        </span>
        <div className="flex items-center gap-1">
          <Link
            href={`/piece/${piece.id}`}
            className="rounded-md px-2 py-1 text-xs font-medium text-foreground hover:bg-secondary"
          >
            Open →
          </Link>
          <DeleteButton id={piece.id} title={piece.title} />
        </div>
      </div>
    </div>
  );
}
