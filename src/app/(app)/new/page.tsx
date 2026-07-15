"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createContentPiece } from "@/lib/actions/content";
import { CHANNEL_LABEL, CHANNELS } from "@/lib/labels";
import { Channel } from "@prisma/client";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function NewContentPage() {
  const [topic, setTopic] = useState("");
  const [channel, setChannel] = useState<Channel>("LINKEDIN");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [scheduledDate, setScheduledDate] = useState(toDateInputValue(new Date()));
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [citation, setCitation] = useState<string | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) {
      setGenError("Enter a topic before generating.");
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
      setCitation(`Generated from: ${topic}, ${CHANNEL_LABEL[channel]}`);
    } catch (error) {
      setGenError(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold tracking-tight text-foreground">New content piece</h1>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Sparkles className="size-4" />
          Generate a first draft
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Topic — e.g. a case study, a stat, a workflow"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as Channel)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {CHANNEL_LABEL[c]}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isGenerating ? "Generating…" : "Generate draft"}
          </Button>
        </div>
        {genError ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {genError}
          </p>
        ) : null}
      </div>

      <form action={createContentPiece} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="channel" className="text-sm font-medium text-foreground">
              Channel
            </label>
            <select
              id="channel"
              name="channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {CHANNEL_LABEL[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-medium text-foreground">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="scheduledDate" className="text-sm font-medium text-foreground">
              Scheduled date
            </label>
            <input
              id="scheduledDate"
              name="scheduledDate"
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="body" className="text-sm font-medium text-foreground">
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          {citation ? (
            <span className="w-fit rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {citation}
            </span>
          ) : null}
        </div>

        <div>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Create piece
          </Button>
        </div>
      </form>
    </div>
  );
}
