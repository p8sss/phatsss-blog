/** How a metric reads at a glance: fine, strained, or failing. */
export type Severity = "ok" | "warn" | "bad";

const SECOND_MS = 1000;
/** p95 latency users start to notice, and latency that loses them. */
const SLOW_MS = 300;
const BROKEN_MS = 1000;
/** Error rates that eat an error budget, and ones users see as an outage. */
const ERRORS_WARN_PCT = 0.5;
const ERRORS_BAD_PCT = 2;

export function formatLatency(ms: number): string {
  return ms < SECOND_MS ? `${Math.round(ms)} ms` : `${(ms / SECOND_MS).toFixed(1)} s`;
}

/** Small shares keep two decimals so 0.01% doesn't read as zero. */
export function formatPercent(pct: number): string {
  if (pct === 0) return "0%";
  if (pct < 1) return `${pct.toFixed(2)}%`;
  if (pct < 10) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct)}%`;
}

export function formatRate(rps: number, locale: string): string {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(Math.round(rps));
}

export function latencySeverity(ms: number): Severity {
  if (ms >= BROKEN_MS) return "bad";
  return ms >= SLOW_MS ? "warn" : "ok";
}

export function errorSeverity(pct: number): Severity {
  if (pct >= ERRORS_BAD_PCT) return "bad";
  return pct >= ERRORS_WARN_PCT ? "warn" : "ok";
}
