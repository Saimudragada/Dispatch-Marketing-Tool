"use client";

import { useState } from "react";
import { Repeat, ShieldCheck } from "lucide-react";
import { ContentPiece, Channel } from "@prisma/client";
import { createContentPiece } from "@/lib/actions/content";
import { CHANNEL_LABEL } from "@/lib/labels";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

type RepurposeResult = { channel: Channel; body: string };

export function RepurposePanel({ piece }: { piece: ContentPiece }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RepurposeResult[] | null>(null);

  async function handleRepurpose() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: piece.title,
          sourceChannel: piece.channel,
          sourceBody: piece.body,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Repurposing failed.");

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Repurposing failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground">
            <Repeat className="size-4 text-flame" />
            One story, three channels
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-moss" />
            Fact-anchored: every number, name, and claim carries over exactly. Nothing invented,
            nothing rounded.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRepurpose}
          disabled={isLoading}
          className="rounded-lg bg-flame px-4 py-2.5 text-sm font-semibold text-white hover:bg-flame/90 disabled:opacity-60"
        >
          {isLoading ? "Repurposing…" : "Repurpose this piece"}
        </button>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {results ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {results.map((result) => (
            <RepurposeResultForm
              key={result.channel}
              channel={result.channel}
              body={result.body}
              defaultTitle={piece.title}
              defaultDate={piece.scheduledDate}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RepurposeResultForm({
  channel,
  body: initialBody,
  defaultTitle,
  defaultDate,
}: {
  channel: Channel;
  body: string;
  defaultTitle: string;
  defaultDate: Date;
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState(initialBody);

  return (
    <form
      action={createContentPiece}
      className="flex flex-col gap-2 rounded-lg border border-border bg-background p-4"
    >
      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-flame">
        → {CHANNEL_LABEL[channel]} version
      </span>
      <input type="hidden" name="channel" value={channel} />
      <input type="hidden" name="status" value="DRAFT" />
      <input type="hidden" name="scheduledDate" value={toDateInputValue(defaultDate)} />
      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
      <textarea
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={9}
        className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-sm leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        className="self-start rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/85"
      >
        Save as new draft
      </button>
    </form>
  );
}
