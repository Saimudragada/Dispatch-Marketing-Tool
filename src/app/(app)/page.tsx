import { prisma } from "@/lib/prisma";
import { ContentCard } from "@/components/content-card";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const pieces = await prisma.contentPiece.findMany({
    orderBy: { scheduledDate: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Content library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pieces.length} piece{pieces.length === 1 ? "" : "s"}
        </p>
      </div>

      {pieces.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No content yet. Create your first piece to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pieces.map((piece) => (
            <ContentCard key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    </div>
  );
}
