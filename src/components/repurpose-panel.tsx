"use client";

import { useState } from "react";
import { Repeat } from "lucide-react";
import { ContentPiece, Channel } from "@prisma/client";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Repeat className="size-4" />
          Repurpose to other channels
        </div>
        <Button
          type="button"
          onClick={handleRepurpose}
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? "Repurposing…" : "Repurpose"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Generates the other two channel versions, preserving every number, name, and claim from
        this piece exactly.
      </p>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {results ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      className="flex flex-col gap-2 rounded-md border border-border p-3"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {CHANNEL_LABEL[channel]}
      </span>
      <input type="hidden" name="channel" value={channel} />
      <input type="hidden" name="status" value="DRAFT" />
      <input type="hidden" name="scheduledDate" value={toDateInputValue(defaultDate)} />
      <input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
      <textarea
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
        className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
      <Button
        type="submit"
        className="self-start bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Save as new piece
      </Button>
    </form>
  );
}
