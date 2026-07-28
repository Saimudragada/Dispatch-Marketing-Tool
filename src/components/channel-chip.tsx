import { Channel } from "@prisma/client";
import { cn } from "@/lib/utils";
import { CHANNEL_CHIP, CHANNEL_DOT, CHANNEL_LABEL } from "@/lib/labels";

export function ChannelChip({ channel, className }: { channel: Channel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em]",
        CHANNEL_CHIP[channel],
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", CHANNEL_DOT[channel])} />
      {CHANNEL_LABEL[channel]}
    </span>
  );
}
