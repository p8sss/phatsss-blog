import type { PrismTheme } from "prism-react-renderer";

/**
 * Syntax themes on the galaxy palette (violet-tinted neutrals, amber numbers).
 * Every token colour is ≥ 4.5:1 (WCAG AA) on its block background — the stock
 * github/dracula themes fell to 2.58:1 and 3.02:1. Hex values are the sRGB
 * of the oklch noted beside each.
 */

interface SyntaxPalette {
  background: string;
  plain: string;
  comment: string;
  keyword: string;
  string: string;
  fn: string;
  number: string;
  tag: string;
  punctuation: string;
  property: string;
  deleted: string;
  inserted: string;
}

function buildTheme(p: SyntaxPalette): PrismTheme {
  return {
    plain: { color: p.plain, backgroundColor: p.background },
    styles: [
      { types: ["comment", "prolog", "doctype", "cdata"], style: { color: p.comment, fontStyle: "italic" } },
      { types: ["keyword", "atrule", "important", "selector"], style: { color: p.keyword } },
      { types: ["string", "char", "attr-value", "regex", "url"], style: { color: p.string } },
      { types: ["function", "method", "builtin"], style: { color: p.fn } },
      { types: ["number", "boolean", "constant", "symbol", "unit"], style: { color: p.number } },
      { types: ["tag", "class-name", "maybe-class-name", "namespace"], style: { color: p.tag } },
      { types: ["punctuation", "operator"], style: { color: p.punctuation } },
      { types: ["property", "attr-name", "variable", "parameter"], style: { color: p.property } },
      { types: ["deleted"], style: { color: p.deleted } },
      { types: ["inserted"], style: { color: p.inserted } },
      { types: ["italic"], style: { fontStyle: "italic" } },
      { types: ["bold", "important"], style: { fontWeight: "bold" } },
    ],
  };
}

export const galaxyLight: PrismTheme = buildTheme({
  background: "#f6f6fb", // oklch(0.975 0.006 285)
  plain: "#191926", // oklch(0.22 0.025 285)    16.2:1
  comment: "#62626f", // oklch(0.5 0.02 285)    5.6:1
  keyword: "#693abb", // oklch(0.48 0.19 295)   6.7:1
  string: "#006c4d", // oklch(0.47 0.1 165)     6.0:1
  fn: "#005fa8", // oklch(0.48 0.14 250)        6.1:1
  number: "#925019", // oklch(0.5 0.11 55)      5.8:1
  tag: "#a7207b", // oklch(0.5 0.19 345)        6.2:1
  punctuation: "#4c4c58", // oklch(0.42 0.02 285) 7.9:1
  property: "#006781", // oklch(0.47 0.1 220)   6.0:1
  deleted: "#b71824", // oklch(0.5 0.19 25)     6.2:1
  inserted: "#146d34", // oklch(0.47 0.12 150)  6.0:1
});

export const galaxyDark: PrismTheme = buildTheme({
  background: "#0e0d1c", // oklch(0.17 0.03 285)
  plain: "#f4f5f9", // oklch(0.97 0.006 285)    17.6:1
  comment: "#9696ab", // oklch(0.68 0.03 285)   6.6:1
  keyword: "#be9df7", // oklch(0.76 0.13 300)   8.6:1
  string: "#71d6a3", // oklch(0.8 0.12 160)     10.8:1
  fn: "#78bff9", // oklch(0.78 0.11 245)        9.7:1
  number: "#ebb16c", // oklch(0.8 0.11 70)      10.1:1
  tag: "#f084c4", // oklch(0.75 0.15 345)       8.0:1
  punctuation: "#b6b6c4", // oklch(0.78 0.02 285) 9.6:1
  property: "#7fcbde", // oklch(0.8 0.08 215)   10.5:1
  deleted: "#f97770", // oklch(0.72 0.16 25)    7.2:1
  inserted: "#76cf8a", // oklch(0.78 0.13 150)  10.1:1
});
