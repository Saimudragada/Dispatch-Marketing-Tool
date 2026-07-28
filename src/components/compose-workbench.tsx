"use client";

import { useState } from "react";
import { Quote, Sparkles } from "lucide-react";
import { Channel } from "@prisma/client";
import { createContentPiece } from "@/lib/actions/content";
import { CHANNEL_LABEL, CHANNELS, STATUSES, STATUS_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

const CHANNEL_HINT: Record<Channel, string> = {
  LINKEDIN: "Hook under 10 words. A number by line two. No hashtag salad.",
  EMAIL: "Stat-led subject. One clear point. One explicit next action.",
  BLOG: "Problem → approach → result → what it means. Outline, not prose.",
};

export function ComposeWorkbench({
  initialTopic,
  initialChannel,
  initialDate,
}: {
  initialTopic: string;
  initialChannel: Channel;
  initialDate?: string;
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [channel, setChannel] = useState<Channel>(initialChannel);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [scheduledDate, setScheduledDate] = useState(
    initialDate ?? toDateInputValue(new Date())
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [citation, setCitation] = useState<string | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) {
      setGenError("Give the studio a topic first — it drafts, it doesn't mind-read.");
      return;
    }

    setIsGenerating(true);
    setGenError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, channel }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed.");
      }

      setBody(data.draft);
      if (!title) setTitle(topic);
      setCitation(`Generated from: ${topic}, ${CHANNEL_LABEL[channel]}`);
    } catch (error) {
      setGenError(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-flame">
            <Sparkles className="size-3.5" />
            Step 01 — Brief the studio
          </div>

          <label htmlFor="topic" className="mt-4 block text-sm font-medium text-foreground">
            Topic
          </label>
          <textarea
            id="topic"
            rows={3}
            placeholder="A case study, a stat, a workflow — the more specific, the better the draft."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />

          <label className="mt-4 block text-sm font-medium text-foreground">Channel</label>
          <div className="mt-1.5 flex gap-2">
            {CHANNELS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChannel(c)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                  channel === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/40"
                )}
              >
                {CHANNEL_LABEL[c]}
              </button>
            ))}
          </div>
          <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {CHANNEL_HINT[channel]}
          </p>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-flame px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flame/90 disabled:opacity-60"
          >
            <Sparkles className="size-4" />
            {isGenerating ? "Drafting in brand voice…" : "Generate first draft"}
          </button>

          {genError ? (
            <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {genError}
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-dashed border-border bg-card/60 p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Quote className="size-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em]">House rules</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Every draft is generated against the full brand-voice reference — short declarative
            sentences, every claim backed by a number or a named workflow, no marketing fluff.
            The AI writes the first pass. You make the call.
          </p>
        </div>
      </div>

      <form action={createContentPiece} className="flex flex-col gap-4 lg:col-span-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-flame">
            Step 02 — Shape and save
          </div>

          <label htmlFor="title" className="mt-4 block text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Working title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />

          <input type="hidden" name="channel" value={channel} />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-foreground">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-foreground">
                Scheduled date
              </label>
              <input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label htmlFor="body" className="block text-sm font-medium text-foreground">
              Draft
            </label>
            <span className="font-mono text-[11px] text-muted-foreground">{wordCount} words</span>
          </div>
          <textarea
            id="body"
            name="body"
            rows={16}
            placeholder="The draft lands here — generated or written from scratch."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          {citation ? (
            <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Sparkles className="size-3 text-flame" />
              {citation}
            </span>
          ) : null}

          <div className="mt-5">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/85"
            >
              Save to library
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
