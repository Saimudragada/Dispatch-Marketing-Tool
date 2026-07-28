"use client";

import { useTransition } from "react";
import { Status } from "@prisma/client";
import { updateStatus } from "@/lib/actions/content";
import { cn } from "@/lib/utils";
import { STATUSES, STATUS_LABEL } from "@/lib/labels";
import { STATUS_PILL_STYLES } from "@/components/status-badge";

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
        STATUS_PILL_STYLES[status],
        isPending && "opacity-60"
      )}
    >
      {STATUSES.map((option) => (
        <option key={option} value={option} className="bg-background text-foreground">
          {STATUS_LABEL[option]}
        </option>
      ))}
    </select>
  );
}
