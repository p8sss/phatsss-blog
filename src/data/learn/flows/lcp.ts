import type { FlowDefinition } from "../../../lib/flow/types";

/** Frontend roadmap → Performance. */
export const lcp: FlowDefinition = {
  id: "lcp",
  title: "The four phases of Largest Contentful Paint",
  actors: [
    { id: "browser", label: "Browser", sublabel: "the visitor", kind: "client", col: 0, row: 0 },
    { id: "origin", label: "Origin", sublabel: "HTML server", kind: "server", col: 1, row: 0 },
    { id: "cdn", label: "Image CDN", sublabel: "hero image", kind: "external", col: 1, row: 1 },
    { id: "rum", label: "RUM", sublabel: "field data", kind: "database", col: 0, row: 1 },
  ],
  steps: [
    {
      id: "navigate",
      from: "browser",
      to: "origin",
      title: "Navigation starts the clock",
      payload: "GET /",
      detail:
        "LCP is measured from the moment the visitor starts the navigation. Redirects, DNS, TCP and TLS all happen inside the first phase.",
    },
    {
      id: "ttfb",
      from: "origin",
      to: "browser",
      title: "Phase 1: time to first byte",
      payload: "200 text/html, first byte",
      variant: "response",
      detail:
        "TTFB ends when the first byte of HTML arrives. Slow server work, redirects and CDN cache misses all land here. A healthy page spends about 40% of its LCP here.",
    },
    {
      id: "discover",
      from: "browser",
      title: "Discover the LCP image",
      payload: '<img src="hero.avif">',
      detail:
        "The preload scanner finds images written in the HTML almost at once. An image set from CSS or JavaScript is found much later.",
    },
    {
      id: "request",
      from: "browser",
      to: "cdn",
      title: "Phase 2: resource load delay",
      payload: "GET /hero.avif",
      detail:
        "This phase is the gap between TTFB and the image request starting. Keep it under about 10% with a src in the HTML and fetchpriority=\"high\". Never lazy-load this image.",
    },
    {
      id: "download",
      from: "cdn",
      to: "browser",
      title: "Phase 3: resource load duration",
      payload: "200 image/avif, 80 KB",
      variant: "response",
      detail:
        "The time to download the bytes, about 40% on a healthy page. Right-sized images, modern formats, a nearby CDN and caching shrink it.",
    },
    {
      id: "render-delay",
      from: "browser",
      title: "Phase 4: element render delay",
      payload: "waiting on CSS and JS",
      detail:
        "The image is ready but cannot paint until blocking stylesheets arrive and the main thread is free. Long tasks and client-side rendering grow this phase. Aim for under about 10%.",
    },
    {
      id: "paint",
      from: "browser",
      title: "The largest element paints",
      payload: "LCP = 2.1 s",
      detail:
        "LCP is the time the largest image or text block in the viewport is painted. Text counts too, so a slow web font can be the problem.",
    },
    {
      id: "watch",
      from: "browser",
      title: "Watch until the visitor interacts",
      payload: "new, larger candidate?",
      detail:
        "If a larger element paints later, it becomes the new LCP. The browser stops reporting candidates at the first tap, scroll or keypress.",
    },
    {
      id: "report",
      from: "browser",
      to: "rum",
      title: "Report from real visits",
      payload: "LCP 2100 ms, target: img.hero",
      detail:
        "Field data decides whether you pass. Aim for 2.5 seconds or less at the 75th percentile, measured separately for mobile and desktop.",
    },
  ],
};
