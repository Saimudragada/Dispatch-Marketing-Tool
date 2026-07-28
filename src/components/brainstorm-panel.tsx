"use client";

import { useState, useTransition } from "react";
import { Lightbulb, Plus, Sparkles } from "lucide-react";
import { createIdea } from "@/lib/actions/ideas";
import { CHANNEL_LABEL } from "@/lib/labels";
import { Channel } from "@prisma/client";

type Proposal = { title: string; angle: string; channel: string | null };

export function BrainstormPanel() {
  const [theme, setTheme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposal[] | null>(null);
  const [banked, setBanked] = useState<Set<number>>(new Set());
  const [isPending, startTransition] = useTransition();

  const [manualTitle, setManualTitle] = useState("");

  async function handleBrainstorm() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Brainstorm failed.");
      setProposals(data.ideas);
      setBanked(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Brainstorm failed.");
    } finally {
      setIsLoading(false);
    }
  }

  function bank(proposal: Proposal, index: number) {
    const formData = new FormData();
    formData.set("title", proposal.title);
    formData.set("notes", proposal.angle);
    formData.set("channel", proposal.channel ?? "");
    formData.set("source", "AI");
    startTransition(async () => {
      await createIdea(formData);
      setBanked((prev) => new Set(prev).add(index));
    });
  }

  function addManual() {
    if (!manualTitle.trim()) return;
    const formData = new FormData();
    formData.set("title", manualTitle.trim());
    startTransition(async () => {
      await createIdea(formData);
      setManualTitle("");
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-flame">
            <Lightbulb className="size-3.5" />
            Quick capture
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addManual();
              }}
              placeholder="That idea from the standup — write it down before it's gone"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={addManual}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/85 disabled:opacity-60"
            >
              <Plus className="size-4" />
              Bank it
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-flame">
            <Sparkles className="size-3.5" />
            AI brainstorm — six angles, house voice
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Optional theme — e.g. prior auth turnaround times"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={handleBrainstorm}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-flame px-3 py-2 text-sm font-semibold text-white hover:bg-flame/90 disabled:opacity-60"
            >
              <Sparkles className="size-4" />
              {isLoading ? "Thinking…" : "Brainstorm"}
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {proposals ? (
        <div className="grid grid-cols-1 gap-3 border-t border-dashed border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
          {proposals.map((proposal, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-border bg-background p-4"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {proposal.channel ? CHANNEL_LABEL[proposal.channel as Channel] : "Any channel"}
              </span>
              <p className="text-sm font-semibold leading-snug text-foreground">{proposal.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{proposal.angle}</p>
              <button
                type="button"
                disabled={banked.has(i) || isPending}
                onClick={() => bank(proposal, i)}
                className="mt-auto self-start rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-flame hover:text-flame disabled:opacity-50"
              >
                {banked.has(i) ? "✓ Banked" : "Bank this idea"}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
