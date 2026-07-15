"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteContentPiece } from "@/lib/actions/content";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
        startTransition(() => {
          deleteContentPiece(id);
        });
      }}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
    >
      <Trash2 className="size-3.5" />
      Delete
    </button>
  );
}
