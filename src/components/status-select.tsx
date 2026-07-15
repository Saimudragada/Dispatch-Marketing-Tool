"use client";

import { useTransition } from "react";
import { Status } from "@prisma/client";
import { updateStatus } from "@/lib/actions/content";
import { cn } from "@/lib/utils";

const OPTIONS: Status[] = ["DRAFT", "SCHEDULED", "PUBLISHED"];
const LABEL: Record<Status, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
};

const STATUS_STYLES: Record<Status, string> = {
  DRAFT: "bg-secondary text-muted-foreground border-transparent",
  SCHEDULED: "bg-transparent text-amber-700 border-amber-400",
  PUBLISHED: "bg-primary text-primary-foreground border-transparent",
};

export function StatusSelect({ id, status }: { id: string; status: Status }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as Status;
        startTransition(() => {
          updateStatus(id, next);
        });
      }}
      className={cn(
        "cursor-pointer appearance-none rounded-full border px-2.5 py-0.5 text-xs font-medium outline-none focus:ring-2 focus:ring-ring",
        STATUS_STYLES[status],
        isPending && "opacity-60"
      )}
    >
      {OPTIONS.map((option) => (
        <option key={option} value={option} className="bg-background text-foreground">
          {LABEL[option]}
        </option>
      ))}
    </select>
  );
}
