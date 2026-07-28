import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ContentForm } from "@/components/content-form";
import { RepurposePanel } from "@/components/repurpose-panel";
import { ChannelChip } from "@/components/channel-chip";
import { StatusBadge } from "@/components/status-badge";
import { updateContentPiece } from "@/lib/actions/content";

export const dynamic = "force-dynamic";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const piece = await prisma.contentPiece.findUnique({ where: { id } });

  if (!piece) notFound();

  const updatedLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(piece.updatedAt);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-flame"
        >
          <ArrowLeft className="size-3.5" />
          Back to library
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <ChannelChip channel={piece.channel} />
          <StatusBadge status={piece.status} />
          <span className="font-mono text-[11px] text-muted-foreground">
            Last touched {updatedLabel}
          </span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {piece.title}
        </h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <ContentForm
          action={updateContentPiece.bind(null, piece.id)}
          defaultValues={piece}
          submitLabel="Save changes"
        />
      </div>

      <RepurposePanel piece={piece} />
    </div>
  );
}
