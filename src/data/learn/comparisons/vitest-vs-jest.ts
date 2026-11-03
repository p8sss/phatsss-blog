import type { Comparison } from "../../../lib/compare/types";

/** Frontend roadmap → Testing. */
export const vitestVsJest: Comparison = {
  id: "vitest-vs-jest",
  title: "Vitest vs Jest",
  options: [
    { id: "vitest", name: "Vitest 5", summary: "A test runner built on Vite's transform pipeline." },
    { id: "jest", name: "Jest 30", summary: "The long-standing JavaScript test runner, now under the OpenJS Foundation." },
  ],
  rows: [
    {
      criterion: "How your code is transformed",
      cells: {
        vitest: "Through Vite, so tests share your app's plugins, aliases and config.",
        jest: "Through its own transformers: babel-jest by default, or ts-jest or @swc/jest.",
      },
    },
    {
      criterion: "TypeScript and ES modules",
      cells: {
        vitest: "Both work with no extra setup.",
        jest: "TypeScript needs Babel or ts-jest. Native ESM is still experimental behind node --experimental-vm-modules.",
      },
    },
    {
      criterion: "API",
      cells: {
        vitest: "Jest-compatible expect, describe and it, with vi.fn and vi.mock. Globals are opt-in with globals: true.",
        jest: "The original API: jest.fn, jest.mock and global describe, it and expect.",
      },
    },
    {
      criterion: "Mocking modules",
      cells: {
        vitest: "vi.mock is hoisted and works with ESM. Since Vitest 5, mock call history is cleared before each test by default.",
        jest: "jest.mock is hoisted for CommonJS. ESM modules need jest.unstable_mockModule and a dynamic import.",
      },
    },
    {
      criterion: "Watch mode",
      cells: {
        vitest: "On by default in a terminal. Reruns only tests that import the changed file, using Vite's module graph.",
        jest: "--watch reruns tests related to files changed since the last commit.",
      },
    },
    {
      criterion: "DOM and browsers",
      cells: {
        vitest: "jsdom or happy-dom environments, or Browser Mode in a real browser through Playwright or WebdriverIO.",
        jest: "jsdom through the separate jest-environment-jsdom package. No real-browser mode.",
      },
    },
    {
      criterion: "Requirements",
      cells: {
        vitest: "Node.js 22.12 or later and Vite 6.4 or later.",
        jest: "Node.js 18.14 or later. No bundler needed.",
      },
    },
    {
      criterion: "Ecosystem",
      cells: {
        vitest: "The usual choice for Vite-based apps. Most Jest matchers and Testing Library work unchanged.",
        jest: "Huge and mature. React Native projects ship with it.",
      },
    },
  ],
  verdicts: [
    {
      option: "vitest",
      pickWhen: [
        "Your app already builds with Vite, so tests can reuse its config.",
        "You write ESM and TypeScript and want no transform setup.",
        "You want component tests in a real browser with the same runner.",
      ],
    },
    {
      option: "jest",
      pickWhen: [
        "You have a large, working Jest suite and no pressing pain.",
        "You build a React Native app, which is set up for Jest.",
        "Your build uses webpack or Babel and you do not want Vite in the toolchain.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "Vitest: comparisons with other test runners", href: "https://vitest.dev/guide/comparisons" },
    { label: "Announcing Vitest 5.0", href: "https://vitest.dev/blog/vitest-5" },
    { label: "Jest: ECMAScript modules", href: "https://jestjs.io/docs/ecmascript-modules" },
    { label: "Jest: getting started", href: "https://jestjs.io/docs/getting-started" },
  ],
};
