import Link from "next/link";
import { ContentPiece } from "@prisma/client";
import { StatusSelect } from "@/components/status-select";
import { DeleteButton } from "@/components/delete-button";
import { CHANNEL_LABEL } from "@/lib/labels";

export function ContentCard({ piece }: { piece: ContentPiece }) {
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(piece.scheduledDate);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {CHANNEL_LABEL[piece.channel]}
          </span>
          <Link href={`/${piece.id}`} className="block">
            <h3 className="mt-0.5 text-base font-semibold leading-snug text-foreground hover:underline">
              {piece.title}
            </h3>
          </Link>
        </div>
        <StatusSelect id={piece.id} status={piece.status} />
      </div>

      <p className="line-clamp-3 text-sm text-muted-foreground whitespace-pre-line">
        {piece.body || "No draft content yet."}
      </p>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Scheduled {dateLabel}</span>
        <div className="flex items-center gap-1">
          <Link
            href={`/${piece.id}`}
            className="rounded-md px-2 py-1 text-xs font-medium text-foreground hover:bg-secondary"
          >
            Edit
          </Link>
          <DeleteButton id={piece.id} title={piece.title} />
        </div>
      </div>
    </div>
  );
}
