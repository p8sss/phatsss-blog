/** Structural checks for comparison data, so a broken table never renders silently. */
import type { Comparison } from "./types";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 4;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function optionErrors(c: Comparison): readonly string[] {
  const count =
    c.options.length < MIN_OPTIONS || c.options.length > MAX_OPTIONS
      ? [`comparison "${c.id}" needs ${MIN_OPTIONS} to ${MAX_OPTIONS} options`]
      : [];
  const ids = c.options.map((o) => o.id);
  const dups = ids.filter((id, i) => ids.indexOf(id) !== i).map((id) => `duplicate option id "${id}"`);
  return [...count, ...dups];
}

function rowErrors(c: Comparison): readonly string[] {
  const ids = new Set(c.options.map((o) => o.id));
  const criteria = c.rows.map((r) => r.criterion);
  const dups = criteria
    .filter((name, i) => criteria.indexOf(name) !== i)
    .map((name) => `duplicate criterion "${name}"`);
  const cells = c.rows.flatMap((row) => [
    ...[...ids]
      .filter((id) => !(id in row.cells) || row.cells[id].trim() === "")
      .map((id) => `row "${row.criterion}" is missing option "${id}"`),
    ...Object.keys(row.cells)
      .filter((id) => !ids.has(id))
      .map((id) => `row "${row.criterion}" names unknown option "${id}"`),
  ]);
  return [...(c.rows.length === 0 ? [`comparison "${c.id}" has no rows`] : []), ...dups, ...cells];
}

function verdictErrors(c: Comparison): readonly string[] {
  const covered = new Set(c.verdicts.map((v) => v.option));
  return [
    ...c.options.filter((o) => !covered.has(o.id)).map((o) => `option "${o.id}" has no verdict`),
    ...c.verdicts.filter((v) => v.pickWhen.length === 0).map((v) => `verdict for "${v.option}" lists no reasons`),
  ];
}

function provenanceErrors(c: Comparison): readonly string[] {
  return [
    ...(isRealDate(c.reviewed) ? [] : [`reviewed must be a YYYY-MM-DD date, got "${c.reviewed}"`]),
    ...(c.sources.length === 0 ? [`comparison "${c.id}" needs at least one source`] : []),
    ...c.sources.filter((s) => !s.href.startsWith("https://")).map((s) => `source "${s.label}" must use https`),
  ];
}

/** Returns every problem found; an empty array means the comparison is renderable. */
export function validateComparison(c: Comparison): readonly string[] {
  return [...optionErrors(c), ...rowErrors(c), ...verdictErrors(c), ...provenanceErrors(c)];
}
