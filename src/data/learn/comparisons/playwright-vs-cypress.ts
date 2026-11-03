import type { Comparison } from "../../../lib/compare/types";

/** Frontend roadmap → Testing. */
export const playwrightVsCypress: Comparison = {
  id: "playwright-vs-cypress",
  title: "Playwright vs Cypress",
  options: [
    { id: "playwright", name: "Playwright", summary: "Microsoft's library and test runner that drives browsers from outside." },
    { id: "cypress", name: "Cypress 16", summary: "A test runner whose tests run inside the browser, next to your app." },
  ],
  rows: [
    {
      criterion: "Where test code runs",
      cells: {
        playwright: "In Node.js. It controls the browser out of process, over a protocol.",
        cypress: "In the browser, beside your app. A Node.js process runs plugins and cy.task code.",
      },
    },
    {
      criterion: "Browsers",
      cells: {
        playwright: "Chromium, Firefox and WebKit, on Windows, macOS and Linux.",
        cypress: "Chrome, Edge and Firefox. Electron is deprecated, and WebKit is experimental.",
      },
    },
    {
      criterion: "Tabs, users and origins",
      cells: {
        playwright: "Many pages and isolated browser contexts in one test, on any origins. Good for a two-user chat test.",
        cypress: "One browser and one tab. Each test is bound to one superdomain; cy.origin visits others. Extra tabs need the @cypress/puppeteer plugin.",
      },
    },
    {
      criterion: "Languages",
      cells: {
        playwright: "TypeScript and JavaScript, plus Python, Java and .NET.",
        cypress: "JavaScript and TypeScript only.",
      },
    },
    {
      criterion: "Async style",
      cells: {
        playwright: "Plain async and await. Locators and assertions retry until they pass or time out.",
        cypress: "Commands are queued, not promises, so you chain them instead of awaiting. Assertions retry.",
      },
    },
    {
      criterion: "Parallel runs",
      cells: {
        playwright: "Built in and free: files run in parallel workers, and --shard splits a suite across machines.",
        cypress: "Parallelization needs --record, with Cypress Cloud handing out specs to each machine.",
      },
    },
    {
      criterion: "Debugging",
      cells: {
        playwright: "UI mode, and a trace viewer with DOM snapshots, network and console for every action. Codegen records tests.",
        cypress: "An interactive runner where you time-travel through each command's snapshot.",
      },
    },
    {
      criterion: "Component testing",
      cells: {
        playwright: "No dedicated runtime. You mount components on a gallery page served by your own dev server.",
        cypress: "Built in, with mounting for React, Angular, Vue and Svelte.",
      },
    },
  ],
  verdicts: [
    {
      option: "playwright",
      pickWhen: [
        "You must test the WebKit engine as well as Chromium and Firefox.",
        "Tests need several tabs, several users, or several origins at once.",
        "You want parallel and sharded CI runs without a paid service.",
      ],
    },
    {
      option: "cypress",
      pickWhen: [
        "Frontend developers will write the tests and value the interactive runner.",
        "You want component tests and end-to-end tests in one familiar tool.",
        "You already have a healthy Cypress suite.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "Playwright: installation and requirements", href: "https://playwright.dev/docs/intro" },
    { label: "Playwright: parallelism and sharding", href: "https://playwright.dev/docs/test-parallel" },
    { label: "Cypress trade-offs", href: "https://docs.cypress.io/app/references/trade-offs" },
    { label: "Cypress 16.0.0 release", href: "https://www.cypress.io/releases/16-0-0" },
  ],
};
