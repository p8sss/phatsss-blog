import type { JSX } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import type { MetricsSample } from "@/lib/flow/traffic";
import { errorSeverity, formatLatency, formatPercent, formatRate, latencySeverity, type Severity } from "./format";

const SEVERITY_TEXT: Readonly<Record<Severity, string>> = {
  ok: "text-foreground",
  warn: "text-warning-ink",
  bad: "text-destructive-ink",
};

interface MetricsStripProps {
  readonly metrics: MetricsSample;
  /** The stage has attack traffic, so a zero blocked share is a problem, not a calm reading. */
  readonly underAttack: boolean;
  readonly surging: boolean;
}

function Metric({ label, value, severity }: {
  readonly label: string;
  readonly value: string;
  readonly severity: Severity;
}): JSX.Element {
  return (
    <div className="flex min-w-0 flex-col">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={clsx("!m-0 font-mono text-base font-semibold tabular-nums transition-colors sm:text-lg", SEVERITY_TEXT[severity])}>
        {value}
      </dd>
    </div>
  );
}

function blockedSeverity(pct: number, underAttack: boolean, surging: boolean): Severity {
  if (pct > 0) return "ok";
  return underAttack && surging ? "bad" : "ok";
}

/** Live readings for the current stage. Calm during the walk, climbing through the surge. */
export function MetricsStrip({ metrics, underAttack, surging }: MetricsStripProps): JSX.Element {
  const { i18n } = useDocusaurusContext();
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-t border-separator px-3 py-3 sm:px-4">
      <dl className="!m-0 grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:gap-x-8">
        <Metric
          label={translate({ id: "journey.metric.rps", message: "Requests/s" })}
          value={formatRate(metrics.rps, i18n.currentLocale)}
          severity="ok"
        />
        <Metric
          label={translate({ id: "journey.metric.p95", message: "p95 latency" })}
          value={formatLatency(metrics.p95Ms)}
          severity={latencySeverity(metrics.p95Ms)}
        />
        <Metric
          label={translate({ id: "journey.metric.errors", message: "Errors" })}
          value={formatPercent(metrics.errorPct)}
          severity={errorSeverity(metrics.errorPct)}
        />
        {metrics.blockedPct !== null && (
          <Metric
            label={translate({ id: "journey.metric.blocked", message: "Blocked" })}
            value={formatPercent(metrics.blockedPct)}
            severity={blockedSeverity(metrics.blockedPct, underAttack, surging)}
          />
        )}
      </dl>
      <span className="text-[11px] text-muted-foreground">
        {translate({ id: "journey.metric.illustrative", message: "Illustrative numbers" })}
      </span>
    </div>
  );
}
