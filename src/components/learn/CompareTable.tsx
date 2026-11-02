import { useMemo, type JSX } from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Card } from "@/components/glass/card";
import { CheckmarkCircle01Icon } from "@/components/ui/icons";
import type { Comparison } from "@/lib/compare/types";
import { validateComparison } from "@/lib/compare/validate";
import { DataError } from "./DataError";

/** One hue per option, in column order, from the same palette as flow actors. */
const OPTION_COLORS = ["var(--galaxy-teal)", "var(--galaxy-violet)", "var(--galaxy-amber)", "var(--galaxy-rose)"];

function useReviewedLabel(reviewed: string): string {
  const { i18n } = useDocusaurusContext();
  return useMemo(() => {
    // UTC on both server and client, so the date never shifts during hydration
    const date = new Intl.DateTimeFormat(i18n.currentLocale, { dateStyle: "medium", timeZone: "UTC" }).format(
      new Date(`${reviewed}T00:00:00Z`),
    );
    return translate({ id: "learn.compare.reviewed", message: "Last reviewed {date}" }, { date });
  }, [i18n.currentLocale, reviewed]);
}

function Verdicts({ comparison }: { readonly comparison: Comparison }) {
  return (
    // auto-fit: two or three options share one row whenever they fit
    <div className="grid grid-cols-[repeat(auto-fit,minmax(13.5rem,1fr))] gap-3 px-3 pt-3 sm:px-4">
      {comparison.options.map((option, index) => {
        const verdict = comparison.verdicts.find((v) => v.option === option.id);
        const color = OPTION_COLORS[index];
        return (
          <section
            key={option.id}
            aria-label={option.name}
            className="rounded-xl border border-border bg-card p-3"
          >
            <p className="!m-0 text-base font-semibold text-foreground">{option.name}</p>
            <p className="!mt-0.5 !mb-2 text-sm text-muted-foreground">{option.summary}</p>
            <p className="!m-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {translate({ id: "learn.compare.pickWhen", message: "Pick it when" })}
            </p>
            <ul className="!my-1.5 !list-none !pl-0">
              {verdict?.pickWhen.map((reason) => (
                <li key={reason} className="!my-1 flex gap-2 text-sm leading-snug">
                  <CheckmarkCircle01Icon size={16} className="mt-0.5 shrink-0" style={{ color }} />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function CriteriaTable({ comparison }: { readonly comparison: Comparison }) {
  return (
    <div className="mt-3 overflow-x-auto px-3 sm:px-4">
      <table className="!my-0 min-w-[36rem]">
        <thead>
          <tr>
            <th scope="col" className="w-36">
              <span className="sr-only">{translate({ id: "learn.compare.criterion", message: "Criterion" })}</span>
            </th>
            {comparison.options.map((option, index) => (
              <th key={option.id} scope="col">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ background: OPTION_COLORS[index] }} />
                  {option.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.criterion}>
              <th scope="row" className="align-top !font-medium !text-foreground">
                {row.criterion}
              </th>
              {comparison.options.map((option) => (
                <td key={option.id}>{row.cells[option.id]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ValidCompareTable({ comparison }: { readonly comparison: Comparison }): JSX.Element {
  const reviewedLabel = useReviewedLabel(comparison.reviewed);
  return (
    <Card material="solid" className="my-6 gap-0 py-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 pt-3 sm:px-4">
        <p className="!m-0 text-sm font-semibold text-foreground">{comparison.title}</p>
        <p className="!m-0 text-xs text-muted-foreground">{reviewedLabel}</p>
      </div>
      <Verdicts comparison={comparison} />
      <CriteriaTable comparison={comparison} />
      <p className="!m-0 border-t border-separator px-3 py-3 text-xs text-muted-foreground sm:px-4">
        {translate({ id: "learn.compare.sources", message: "Checked against:" })}{" "}
        {comparison.sources.map((source, index) => (
          <span key={source.href}>
            {index > 0 && " · "}
            <Link href={source.href}>{source.label}</Link>
          </span>
        ))}
      </p>
    </Card>
  );
}

/** "X vs Y" topics: a verdict per option, then the criteria side by side. */
export default function CompareTable({ comparison }: { readonly comparison: Comparison }): JSX.Element {
  const errors = useMemo(() => validateComparison(comparison), [comparison]);
  if (errors.length > 0) {
    return (
      <DataError
        errors={errors}
        message={translate(
          { id: "learn.compare.invalid", message: "The comparison \"{id}\" can't be shown." },
          { id: comparison.id },
        )}
      />
    );
  }
  return <ValidCompareTable comparison={comparison} />;
}
