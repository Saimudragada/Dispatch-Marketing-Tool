import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getMonthGrid, dateKey } from "@/lib/calendar";
import { PageHeader } from "@/components/page-header";
import { CHANNEL_DOT, CHANNELS, CHANNEL_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const now = new Date();

  let year = now.getUTCFullYear();
  let monthIndex = now.getUTCMonth();

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split("-").map(Number);
    year = y;
    monthIndex = m - 1;
  }

  const todayKey = dateKey(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  );

  const weeks = getMonthGrid(year, monthIndex);
  const gridStart = weeks[0][0];
  const gridEnd = weeks[weeks.length - 1][6];

  const pieces = await prisma.contentPiece.findMany({
    where: { scheduledDate: { gte: gridStart, lte: gridEnd } },
    orderBy: { scheduledDate: "asc" },
  });

  const byDate = new Map<string, typeof pieces>();
  for (const piece of pieces) {
    const key = dateKey(piece.scheduledDate);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(piece);
  }

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex, 1)));

  const prevMonth = new Date(Date.UTC(year, monthIndex - 1, 1));
  const nextMonth = new Date(Date.UTC(year, monthIndex + 1, 1));
  const prevParam = `${prevMonth.getUTCFullYear()}-${String(prevMonth.getUTCMonth() + 1).padStart(2, "0")}`;
  const nextParam = `${nextMonth.getUTCFullYear()}-${String(nextMonth.getUTCMonth() + 1).padStart(2, "0")}`;

  const emptyWeekCount = weeks.filter(
    (week) => !week.some((day) => byDate.has(dateKey(day)))
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="Editorial calendar"
        title="The month,"
        titleAccent="mapped"
        description="Every scheduled piece in its slot — and every dead week flagged before it becomes a silent one."
      >
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <Link
            href={`/calendar?month=${prevParam}`}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            ←
          </Link>
          <Link
            href="/calendar"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            Today
          </Link>
          <Link
            href={`/calendar?month=${nextParam}`}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            →
          </Link>
        </div>
      </PageHeader>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{monthLabel}</h2>
        <div className="flex items-center gap-4">
          {CHANNELS.map((c) => (
            <span key={c} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              <span className={cn("size-2 rounded-full", CHANNEL_DOT[c])} />
              {CHANNEL_LABEL[c]}
            </span>
          ))}
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-7 gap-2 text-center font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {WEEKDAYS.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2.5">
            {weeks.map((week, i) => {
              const weekHasContent = week.some((day) => byDate.has(dateKey(day)));

              return (
                <div
                  key={i}
                  className={cn(
                    "relative grid grid-cols-7 gap-2 rounded-xl p-1.5",
                    !weekHasContent && "border border-honey/50 bg-honey-soft/60"
                  )}
                >
                  {!weekHasContent ? (
                    <span className="absolute -top-2 left-3 rounded-full border border-honey/50 bg-honey-soft px-2 font-mono text-[9px] font-medium uppercase tracking-wide text-honey">
                      gap week
                    </span>
                  ) : null}
                  {week.map((day) => {
                    const inMonth = day.getUTCMonth() === monthIndex;
                    const key = dateKey(day);
                    const dayPieces = byDate.get(key) ?? [];
                    const isToday = key === todayKey;

                    return (
                      <div
                        key={key}
                        className={cn(
                          "group/day flex min-h-28 flex-col gap-1.5 rounded-lg border border-border bg-card p-2",
                          !inMonth && "bg-secondary/40 opacity-60",
                          isToday && "border-flame ring-1 ring-flame"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "font-mono text-xs",
                              isToday
                                ? "flex size-5 items-center justify-center rounded-full bg-flame font-semibold text-white"
                                : inMonth
                                  ? "text-foreground"
                                  : "text-muted-foreground/50"
                            )}
                          >
                            {day.getUTCDate()}
                          </span>
                          <Link
                            href={`/compose?date=${key}`}
                            title="Draft something for this day"
                            className="rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-flame group-hover/day:opacity-100"
                          >
                            <Plus className="size-3" />
                          </Link>
                        </div>
                        <div className="flex flex-col gap-1">
                          {dayPieces.map((piece) => (
                            <Link
                              key={piece.id}
                              href={`/piece/${piece.id}`}
                              title={`${CHANNEL_LABEL[piece.channel]}: ${piece.title}`}
                              className={cn(
                                "flex items-center gap-1.5 truncate rounded-md bg-secondary px-1.5 py-1 text-[11px] font-medium text-foreground hover:bg-flame-soft",
                                piece.status === "PUBLISHED" && "bg-moss-soft"
                              )}
                            >
                              <span
                                className={cn(
                                  "size-1.5 shrink-0 rounded-full",
                                  CHANNEL_DOT[piece.channel]
                                )}
                              />
                              <span className="truncate">{piece.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {emptyWeekCount > 0 ? (
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-honey">
            {emptyWeekCount} gap week{emptyWeekCount === 1 ? "" : "s"}
          </span>{" "}
          this month — outlined in amber. A quiet calendar is how audiences forget you exist.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          No gap weeks this month. The pipeline holds.
        </p>
      )}
    </div>
  );
}
