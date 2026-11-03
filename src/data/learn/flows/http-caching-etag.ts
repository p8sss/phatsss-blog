import type { FlowDefinition } from "../../../lib/flow/types";

/** Backend roadmap → Learn about APIs. */
export const httpCachingEtag: FlowDefinition = {
  id: "http-caching-etag",
  title: "A first request, then a revalidation",
  actors: [
    { id: "browser", label: "Browser", sublabel: "your page", kind: "client", col: 0, row: 0 },
    { id: "cache", label: "HTTP cache", sublabel: "in the browser", kind: "cache", col: 0, row: 1 },
    { id: "server", label: "API server", sublabel: "your API", kind: "server", col: 1, row: 0 },
    { id: "db", label: "Database", sublabel: "source of truth", kind: "database", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "get",
      from: "browser",
      to: "server",
      title: "Request a product",
      payload: "GET /api/products/42",
      detail: "The browser has nothing stored for this URL yet, so it sends a plain request.",
    },
    {
      id: "select",
      from: "server",
      to: "db",
      title: "Load the product",
      payload: "SELECT … WHERE id = 42",
      detail: "The server builds the full response the normal way.",
    },
    {
      id: "row",
      from: "db",
      to: "server",
      title: "Return the row",
      payload: "{ id: 42, version: 7, … }",
      variant: "response",
      detail: "The row carries a version number that goes up on every update.",
    },
    {
      id: "etag",
      from: "server",
      title: "Derive an ETag",
      payload: "ETag: \"p42-v7\"",
      detail:
        "An ETag is an opaque label for this exact version of the response. A version column or a hash of the body both work, as long as it changes whenever the content does.",
    },
    {
      id: "ok",
      from: "server",
      to: "browser",
      title: "Send the body with its ETag",
      payload: "200 · ETag \"p42-v7\"",
      variant: "response",
      detail:
        "The server also sends Cache-Control: no-cache. That allows storing the response but says it must be revalidated before every reuse.",
    },
    {
      id: "store",
      from: "browser",
      to: "cache",
      title: "Store the response",
      payload: "body + ETag \"p42-v7\"",
      detail: "The browser keeps the body and the headers, keyed by the URL.",
    },
    {
      id: "lookup",
      from: "browser",
      to: "cache",
      title: "The page asks again later",
      payload: "GET /api/products/42",
      detail: "Minutes later the same URL is requested. The browser checks its cache first.",
    },
    {
      id: "stale",
      from: "cache",
      to: "browser",
      title: "Stored, but must revalidate",
      payload: "stored ETag \"p42-v7\"",
      variant: "response",
      detail: "Because of no-cache, the stored copy cannot be used until the server confirms it is current.",
    },
    {
      id: "conditional",
      from: "browser",
      to: "server",
      title: "Send a conditional request",
      payload: "If-None-Match: \"p42-v7\"",
      detail: "The browser adds the stored ETag. It means: send the body only if your current ETag is different.",
    },
    {
      id: "check",
      from: "server",
      to: "db",
      title: "Check only the version",
      payload: "SELECT version WHERE id = 42",
      detail:
        "A cheap check is enough to know whether anything changed. Servers that hash the body must build the whole response first, which saves bandwidth but not work.",
    },
    {
      id: "version",
      from: "db",
      to: "server",
      title: "Still version 7",
      payload: "version: 7",
      variant: "response",
      detail: "The current ETag would be \"p42-v7\" again, which matches the one the browser sent.",
    },
    {
      id: "not-modified",
      from: "server",
      to: "browser",
      title: "Nothing changed",
      payload: "304 Not Modified",
      variant: "response",
      detail:
        "A 304 has headers but no body. It repeats the ETag and Cache-Control so the browser can update what it stored.",
    },
    {
      id: "reuse",
      from: "browser",
      to: "cache",
      title: "Reuse the stored body",
      payload: "refresh headers, serve body",
      detail:
        "The browser freshens the stored headers and hands the stored body to the page. To fetch() it looks like a normal 200 response.",
    },
  ],
};
