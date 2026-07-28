import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { BrainstormPanel } from "@/components/brainstorm-panel";
import { IdeaCard } from "@/components/idea-card";
import { IDEA_STATUSES, IDEA_STATUS_LABEL } from "@/lib/labels";

export const dynamic = "force-dynamic";

const COLUMN_HINT: Record<string, string> = {
  SPARK: "Raw material. No judgment yet.",
  SHAPING: "Being worked into a real angle.",
  DRAFTED: "Graduated to the library.",
};

export default async function IdeasPage() {
  const ideas = await prisma.idea.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Idea bank"
        title="Where campaigns"
        titleAccent="begin"
        description="Capture sparks before they evaporate, let the AI pitch a batch, and promote the good ones straight into the drafting studio."
      />

      <BrainstormPanel />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {IDEA_STATUSES.map((status) => {
          const column = ideas.filter((i) => i.status === status);
          return (
            <section key={status} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between border-b-2 border-foreground pb-2">
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  {IDEA_STATUS_LABEL[status]}
                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                    {column.length}
                  </span>
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {COLUMN_HINT[status]}
                </span>
              </div>
              {column.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center font-display text-sm italic text-muted-foreground">
                  {status === "SPARK" ? "Empty. Go make trouble." : "Nothing here yet."}
                </p>
              ) : (
                column.map((idea, i) => <IdeaCard key={idea.id} idea={idea} index={i} />)
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
