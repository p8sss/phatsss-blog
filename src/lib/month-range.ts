/** A calendar month; `month` is 1–12. */
export interface YearMonth {
  readonly year: number;
  readonly month: number;
}

export function toYearMonth(date: Date): YearMonth {
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

/** Months covered by a range, counting both ends (Oct–Oct is 1, Jul–Oct is 4). */
export function monthsBetween(start: YearMonth, end: YearMonth): number {
  return Math.max(0, (end.year - start.year) * 12 + (end.month - start.month) + 1);
}

export function earliest(months: readonly YearMonth[]): YearMonth {
  return months.reduce((a, b) => (monthsBetween(b, a) > 1 ? b : a));
}

/** The later month; `null` (ongoing) outranks any date. */
export function latest(months: readonly (YearMonth | null)[]): YearMonth | null {
  if (months.length === 0 || months.includes(null)) return null;
  return (months as YearMonth[]).reduce((a, b) => (monthsBetween(a, b) > 1 ? b : a));
}

/** "Oct 2019" / "ต.ค. 2562" / "ຕ.ລ. 2019" — the locale's own calendar and abbreviations. */
export function formatYearMonth(value: YearMonth, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(value.year, value.month - 1, 1))
  );
}

/** "7 years 1 month" / "7 ปี 1 เดือน"; whole years drop the month part. */
export function formatDuration(totalMonths: number, locale: string): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const unit = (value: number, kind: "year" | "month") =>
    new Intl.NumberFormat(locale, { style: "unit", unit: kind, unitDisplay: "long" }).format(value);
  const parts = [years > 0 ? unit(years, "year") : null, months > 0 || years === 0 ? unit(months, "month") : null];
  return parts.filter(Boolean).join(" ");
}
