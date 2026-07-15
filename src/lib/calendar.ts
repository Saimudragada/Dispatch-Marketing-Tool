export function getMonthGrid(year: number, monthIndex: number): Date[][] {
  const firstOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const lastOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0));

  const gridStart = new Date(Date.UTC(year, monthIndex, 1 - firstOfMonth.getUTCDay()));
  const gridEnd = new Date(
    Date.UTC(year, monthIndex, lastOfMonth.getUTCDate() + (6 - lastOfMonth.getUTCDay()))
  );

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
