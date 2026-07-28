import { Check } from "lucide-react";
import { Status } from "@prisma/client";
import { cn } from "@/lib/utils";
import { STATUS_LABEL } from "@/lib/labels";

export const STATUS_PILL_STYLES: Record<Status, string> = {
  DRAFT: "bg-secondary text-muted-foreground border-transparent",
  SCHEDULED: "bg-honey-soft text-honey border-honey/40",
  PUBLISHED: "bg-moss-soft text-moss border-moss/30",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_PILL_STYLES[status]
      )}
    >
      {status === "PUBLISHED" ? <Check className="size-3" /> : null}
      {STATUS_LABEL[status]}
    </span>
  );
}
