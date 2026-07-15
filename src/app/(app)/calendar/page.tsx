import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getMonthGrid, dateKey } from "@/lib/calendar";
import { CHANNEL_LABEL } from "@/lib/labels";
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

  const anyEmptyWeek = weeks.some((week) => !week.some((day) => byDate.has(dateKey(day))));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">{monthLabel}</h1>
        <div className="flex items-center gap-1">
          <Link
            href={`/calendar?month=${prevParam}`}
            className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-secondary"
          >
            ← Prev
          </Link>
          <Link
            href={`/calendar?month=${nextParam}`}
            className="rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-secondary"
          >
            Next →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {weeks.map((week, i) => {
          const weekHasContent = week.some((day) => byDate.has(dateKey(day)));

          return (
            <div
              key={i}
              className={cn(
                "grid grid-cols-7 gap-2 rounded-lg p-1.5",
                !weekHasContent && "border border-amber-400/70 bg-amber-50/50"
              )}
            >
              {week.map((day) => {
                const inMonth = day.getUTCMonth() === monthIndex;
                const key = dateKey(day);
                const dayPieces = byDate.get(key) ?? [];

                return (
                  <div
                    key={key}
                    className={cn(
                      "flex min-h-28 flex-col gap-1 rounded-md border border-border bg-card p-2",
                      !inMonth && "bg-secondary/40"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs",
                        inMonth ? "text-foreground" : "text-muted-foreground/50"
                      )}
                    >
                      {day.getUTCDate()}
                    </span>
                    <div className="flex flex-col gap-1">
                      {dayPieces.map((piece) => (
                        <Link
                          key={piece.id}
                          href={`/${piece.id}`}
                          title={piece.title}
                          className="truncate rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-foreground hover:bg-accent"
                        >
                          {CHANNEL_LABEL[piece.channel]}: {piece.title}
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

      {anyEmptyWeek ? (
        <p className="text-xs text-muted-foreground">
          Weeks outlined in amber have nothing scheduled — a gap in the pipeline.
        </p>
      ) : null}
    </div>
  );
}
