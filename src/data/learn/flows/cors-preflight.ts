import type { FlowDefinition } from "../../../lib/flow/types";

/** Frontend roadmap → Web Security. */
export const corsPreflight: FlowDefinition = {
  id: "cors-preflight",
  title: "A cross-origin PUT, with its preflight",
  actors: [
    { id: "page", label: "Page script", sublabel: "app.example.com", kind: "client", col: 0, row: 0 },
    { id: "browser", label: "Browser", sublabel: "CORS checks", kind: "service", col: 1, row: 0 },
    { id: "api", label: "API", sublabel: "api.example.com", kind: "server", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "call",
      from: "page",
      to: "browser",
      title: "JavaScript calls another origin",
      payload: "fetch(PUT /orders/7)",
      detail:
        "A different scheme, host or port makes a request cross-origin. The browser, not your code, enforces CORS on it.",
    },
    {
      id: "classify",
      from: "browser",
      title: "Decide whether a preflight is needed",
      payload: "PUT + application/json",
      detail:
        "GET, HEAD and POST with only safelisted headers and form or plain-text bodies go straight out. A PUT, a JSON body or an Authorization header needs permission first.",
    },
    {
      id: "preflight",
      from: "browser",
      to: "api",
      title: "Send the preflight",
      payload: "OPTIONS /orders/7",
      detail:
        "The browser sends Origin, Access-Control-Request-Method and Access-Control-Request-Headers. A preflight never carries cookies or other credentials.",
    },
    {
      id: "check",
      from: "api",
      title: "Check the origin against an allowlist",
      payload: "Origin: app.example.com",
      detail:
        "The server decides who may call it. Answer OPTIONS before any auth check, because the preflight has no credentials to check.",
    },
    {
      id: "grant",
      from: "api",
      to: "browser",
      title: "Grant permission",
      payload: "204 + Access-Control-Allow-*",
      variant: "response",
      detail:
        "The reply names the allowed origin, methods and headers. A request with cookies also needs Access-Control-Allow-Credentials: true here. Any status outside 200 to 299 fails the preflight, and the real request is never sent.",
    },
    {
      id: "cache",
      from: "browser",
      title: "Cache the grant",
      payload: "Access-Control-Max-Age: 600",
      detail:
        "The browser reuses this answer for the same origin and URL. Without the header it lasts 5 seconds. Chromium caps it at 2 hours and Firefox at 24 hours.",
    },
    {
      id: "actual",
      from: "browser",
      to: "api",
      title: "Send the real request",
      payload: "PUT /orders/7 + cookie",
      detail:
        "Now the actual request goes out. Cookies are sent only because the page asked for credentials: 'include'.",
    },
    {
      id: "response",
      from: "api",
      to: "browser",
      title: "Respond with CORS headers again",
      payload: "200 + Allow-Origin, Credentials",
      variant: "response",
      detail:
        "The real response needs Access-Control-Allow-Origin too, plus Access-Control-Allow-Credentials: true when cookies are involved. With credentials the origin must be named exactly, never *.",
    },
    {
      id: "verify",
      from: "browser",
      title: "Check the response headers",
      payload: "origin matches",
      detail:
        "On a mismatch the request has still reached the server and run. The script just gets a network error instead of the response.",
    },
    {
      id: "deliver",
      from: "browser",
      to: "page",
      title: "Hand the response to JavaScript",
      payload: "Response { status: 200 }",
      variant: "response",
      detail:
        "The script can read the body, safelisted response headers, and any header listed in Access-Control-Expose-Headers.",
    },
  ],
};
