import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentForm } from "@/components/content-form";
import { RepurposePanel } from "@/components/repurpose-panel";
import { updateContentPiece } from "@/lib/actions/content";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const piece = await prisma.contentPiece.findUnique({ where: { id } });

  if (!piece) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold tracking-tight text-foreground">Edit content piece</h1>
      <ContentForm
        action={updateContentPiece.bind(null, piece.id)}
        defaultValues={piece}
        submitLabel="Save changes"
      />
      <RepurposePanel piece={piece} />
    </div>
  );
}
