import type { FlowDefinition } from "../../../lib/flow/types";

/** Frontend roadmap → PWAs. */
export const serviceWorkerOffline: FlowDefinition = {
  id: "service-worker-offline",
  title: "Install a service worker online, then load offline",
  actors: [
    { id: "page", label: "Page", sublabel: "browser tab", kind: "client", col: 0, row: 0 },
    { id: "sw", label: "Worker", sublabel: "sw.js", kind: "service", col: 1, row: 0 },
    { id: "cache", label: "Cache", sublabel: "Cache Storage", kind: "cache", col: 2, row: 0 },
    { id: "server", label: "Server", sublabel: "example.com", kind: "server", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "register",
      from: "page",
      to: "server",
      title: "Register the worker",
      payload: "register('/sw.js')",
      detail:
        "On the first visit the page asks the browser to fetch and register sw.js. Service workers need HTTPS, or localhost while you develop.",
    },
    {
      id: "script",
      from: "server",
      to: "sw",
      title: "The browser starts the worker",
      payload: "200 sw.js",
      variant: "response",
      detail:
        "The worker runs on its own thread with no DOM. It controls pages under its scope, which defaults to the folder sw.js is served from.",
    },
    {
      id: "precache",
      from: "sw",
      to: "server",
      title: "Install: fetch the app shell",
      payload: "GET /, /app.css, /app.js",
      detail:
        "The install event fires once per worker version. cache.addAll fetches every listed URL inside event.waitUntil.",
    },
    {
      id: "shell",
      from: "server",
      to: "sw",
      title: "The shell arrives",
      payload: "200 × 3",
      variant: "response",
      detail: "If any one of these requests fails, the install fails and the browser throws this worker away.",
    },
    {
      id: "store",
      from: "sw",
      to: "cache",
      title: "Store the responses",
      payload: "cache 'shell-v1': 3 entries",
      detail:
        "Cache Storage holds request and response pairs in named caches. It is separate from the HTTP cache, and entries never expire on their own.",
    },
    {
      id: "activate",
      from: "sw",
      title: "Activate",
      payload: "delete old caches, claim",
      detail:
        "The worker activates and deletes caches from older versions. A page that was open before activation stays uncontrolled until it reloads, unless the worker calls clients.claim().",
    },
    {
      id: "navigate",
      from: "page",
      to: "sw",
      title: "Later, with no network",
      payload: "GET / (navigate)",
      detail:
        "The visitor opens the site in airplane mode. The URL is in scope, so the browser starts the worker and fires a fetch event before touching the network.",
    },
    {
      id: "try-network",
      from: "sw",
      to: "server",
      title: "Try the network first",
      payload: "fetch(event.request)",
      detail:
        "Network first keeps HTML fresh whenever the visitor is online. Offline, there is no connection, so fetch rejects with a TypeError.",
    },
    {
      id: "fallback",
      from: "sw",
      to: "cache",
      title: "Fall back to the cache",
      payload: "caches.match('/')",
      detail: "The catch branch looks up the copy of the page saved during install.",
    },
    {
      id: "hit",
      from: "cache",
      to: "sw",
      title: "The cached page is found",
      payload: "Response for /",
      variant: "response",
      detail: "Cache Storage returns the stored response.",
    },
    {
      id: "serve",
      from: "sw",
      to: "page",
      title: "Serve the page offline",
      payload: "respondWith(cached)",
      variant: "response",
      detail:
        "event.respondWith hands that response to the browser as if it came from the server. The page's CSS and JS requests go through the same handler and come from the cache too.",
    },
  ],
};
