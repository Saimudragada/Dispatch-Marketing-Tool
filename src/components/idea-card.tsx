"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { PenLine, Sparkles, Trash2 } from "lucide-react";
import { Idea, IdeaStatus } from "@prisma/client";
import { deleteIdea, updateIdeaStatus } from "@/lib/actions/ideas";
import { CHANNEL_LABEL, IDEA_STATUSES, IDEA_STATUS_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

// Alternating slight tilts give the board a pinned-notes feel without chaos.
const TILT = ["-rotate-1", "rotate-1", "rotate-0"];

export function IdeaCard({ idea, index }: { idea: Idea; index: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function promote() {
    const topic = idea.notes ? `${idea.title} — ${idea.notes}` : idea.title;
    const params = new URLSearchParams({ topic });
    if (idea.channel) params.set("channel", idea.channel);
    startTransition(async () => {
      await updateIdeaStatus(idea.id, "DRAFTED");
      router.push(`/compose?${params.toString()}`);
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-[3px_3px_0_0_var(--color-border)] transition-transform hover:rotate-0",
        TILT[index % TILT.length],
        isPending && "opacity-60"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {idea.channel ? CHANNEL_LABEL[idea.channel] : "Any channel"}
        </span>
        {idea.source === "AI" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-flame-soft px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-flame">
            <Sparkles className="size-2.5" />
            AI pitch
          </span>
        ) : null}
      </div>

      <p className="text-sm font-semibold leading-snug text-foreground">{idea.title}</p>
      {idea.notes ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{idea.notes}</p>
      ) : null}

      <div className="mt-1 flex items-center justify-between gap-2 border-t border-dashed border-border pt-2">
        <select
          value={idea.status}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() => updateIdeaStatus(idea.id, e.target.value as IdeaStatus))
          }
          className="cursor-pointer rounded-md border border-border bg-background px-1.5 py-1 text-[11px] font-medium text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          {IDEA_STATUSES.map((s) => (
            <option key={s} value={s}>
              {IDEA_STATUS_LABEL[s]}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={isPending}
            onClick={promote}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-flame hover:bg-flame-soft"
            title="Send to the drafting studio"
          >
            <PenLine className="size-3" />
            Draft it
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (!confirm(`Toss "${idea.title}"?`)) return;
              startTransition(() => deleteIdea(idea.id));
            }}
            className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Delete idea"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
