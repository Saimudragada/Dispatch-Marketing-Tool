import { Check } from "lucide-react";
import { Status } from "@prisma/client";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<Status, string> = {
  DRAFT: "bg-secondary text-muted-foreground border-transparent",
  SCHEDULED: "bg-transparent text-amber-700 border-amber-400",
  PUBLISHED: "bg-primary text-primary-foreground border-transparent",
};

const STATUS_LABEL: Record<Status, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {status === "PUBLISHED" ? <Check className="size-3" /> : null}
      {STATUS_LABEL[status]}
    </span>
  );
}
