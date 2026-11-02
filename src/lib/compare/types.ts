/**
 * Data model for "X vs Y" topics. Tool comparisons go stale, so every comparison
 * carries the date it was last reviewed and the sources it was checked against.
 */

export interface CompareOption {
  readonly id: string;
  readonly name: string;
  /** One line: what the tool is. */
  readonly summary: string;
}

export interface CompareRow {
  readonly criterion: string;
  /** One cell per option id. */
  readonly cells: Readonly<Record<string, string>>;
}

export interface CompareVerdict {
  readonly option: string;
  /** Situations where this option is the better pick. */
  readonly pickWhen: readonly string[];
}

export interface CompareSource {
  readonly label: string;
  readonly href: string;
}

export interface Comparison {
  readonly id: string;
  readonly title: string;
  readonly options: readonly CompareOption[];
  readonly rows: readonly CompareRow[];
  readonly verdicts: readonly CompareVerdict[];
  /** ISO date (YYYY-MM-DD) the content was last reviewed. */
  readonly reviewed: string;
  readonly sources: readonly CompareSource[];
}
