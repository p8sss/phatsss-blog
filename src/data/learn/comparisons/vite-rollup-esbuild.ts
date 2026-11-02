import type { Comparison } from "../../../lib/compare/types";

/** Frontend roadmap → Module Bundlers. */
export const viteRollupEsbuild: Comparison = {
  id: "vite-rollup-esbuild",
  title: "Vite vs Rollup vs esbuild",
  options: [
    { id: "vite", name: "Vite", summary: "A dev server plus production build, bundled by Rolldown." },
    { id: "rollup", name: "Rollup", summary: "A JavaScript module bundler focused on ES modules." },
    { id: "esbuild", name: "esbuild", summary: "A very fast bundler and minifier written in Go." },
  ],
  rows: [
    {
      criterion: "Dev server",
      cells: {
        vite: "Yes. Serves native ES modules with fast hot module replacement.",
        rollup: "No. Watch mode rebuilds the bundle.",
        esbuild: "A basic serve mode with live reload, no HMR.",
      },
    },
    {
      criterion: "Production build",
      cells: {
        vite: "Bundles with Rolldown, a Rust bundler with a Rollup-compatible API, since Vite 8. Vite 7 and older use Rollup.",
        rollup: "Its main job.",
        esbuild: "Yes, very fast, with simpler chunk splitting.",
      },
    },
    {
      criterion: "Speed",
      cells: {
        vite: "Instant dev start; Rolldown builds are fast.",
        rollup: "Slowest of the three on large apps; it runs in JavaScript.",
        esbuild: "Fastest of the three, often by an order of magnitude.",
      },
    },
    {
      criterion: "Output formats",
      cells: {
        vite: "Tuned for apps; has a library mode.",
        rollup: "ESM, CommonJS, UMD, IIFE and more, with very clean output.",
        esbuild: "ESM, CommonJS and IIFE.",
      },
    },
    {
      criterion: "Tree shaking",
      cells: {
        vite: "Through Rolldown.",
        rollup: "The reference implementation; very thorough.",
        esbuild: "Good, slightly less aggressive.",
      },
    },
    {
      criterion: "Plugins",
      cells: {
        vite: "Rollup-compatible plugins plus dev-server hooks; a large ecosystem.",
        rollup: "A large, mature ecosystem.",
        esbuild: "A smaller plugin API with fewer plugins.",
      },
    },
    {
      criterion: "TypeScript",
      cells: {
        vite: "Strips types only, using Oxc since Vite 8. Run tsc for type checking.",
        rollup: "Through a plugin.",
        esbuild: "Strips types only. Run tsc for type checking.",
      },
    },
  ],
  verdicts: [
    {
      option: "vite",
      pickWhen: [
        "You are building a React, Vue, Svelte or plain web app.",
        "You want a dev server, HMR and a production build in one tool.",
      ],
    },
    {
      option: "rollup",
      pickWhen: [
        "You publish a library and need clean output in several formats.",
        "You need fine control over chunks and output.",
      ],
    },
    {
      option: "esbuild",
      pickWhen: [
        "You bundle scripts, CLIs, serverless functions or tests and want raw speed.",
        "You are building a tool and need a fast engine underneath it.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "Vite guide", href: "https://vite.dev/guide/" },
    { label: "Vite 8 announcement", href: "https://vite.dev/blog/announcing-vite8" },
    { label: "Rollup docs", href: "https://rollupjs.org/introduction/" },
    { label: "esbuild docs", href: "https://esbuild.github.io/" },
  ],
};
