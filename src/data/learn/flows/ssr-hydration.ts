import type { FlowDefinition } from "../../../lib/flow/types";

/** Frontend roadmap → SSR. */
export const ssrHydration: FlowDefinition = {
  id: "ssr-hydration",
  title: "Server rendering, then hydration",
  actors: [
    { id: "browser", label: "Browser", sublabel: "the visitor", kind: "client", col: 0, row: 0 },
    { id: "server", label: "Node server", sublabel: "Next.js, Nuxt", kind: "server", col: 1, row: 0 },
    { id: "data", label: "Data API", sublabel: "DB or services", kind: "database", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "request",
      from: "browser",
      to: "server",
      title: "Request the page",
      payload: "GET /products",
      detail: "A normal navigation. The server, not the browser, will do the first render.",
    },
    {
      id: "fetch",
      from: "server",
      to: "data",
      title: "Fetch data on the server",
      payload: "GET /api/products",
      detail: "The server sits close to the data, so this call is short and can use private credentials.",
    },
    {
      id: "json",
      from: "data",
      to: "server",
      title: "Return the data",
      payload: "[{ id, name, price }]",
      variant: "response",
      detail: "The page's data is ready before any HTML is written.",
    },
    {
      id: "render",
      from: "server",
      title: "Render to HTML",
      payload: "render(<App />) → HTML",
      detail: "The same components that run in the browser run on the server and produce markup.",
    },
    {
      id: "html",
      from: "server",
      to: "browser",
      title: "Send HTML and the data",
      payload: "HTML + serialized props",
      variant: "response",
      detail:
        "The data is embedded in the page so the browser doesn't fetch it again. Streaming sends the HTML in chunks as each part is ready.",
    },
    {
      id: "bundle",
      from: "browser",
      to: "server",
      title: "Download the JavaScript",
      payload: "GET /assets/app.js",
      detail:
        "The preload scanner spots the script tag and starts the download while the HTML is still arriving. In production it usually comes from a CDN.",
    },
    {
      id: "paint",
      from: "browser",
      title: "Paint the HTML",
      payload: "visible, not interactive",
      detail:
        "Content shows up while the JavaScript is still downloading, which helps first paint, LCP and search engines. Buttons don't work yet.",
    },
    {
      id: "js",
      from: "server",
      to: "browser",
      title: "Send the bundle",
      payload: "app.[hash].js",
      variant: "response",
      detail: "The bundle size decides how long the page looks ready but isn't.",
    },
    {
      id: "hydrate",
      from: "browser",
      title: "Hydrate",
      payload: "hydrateRoot(el, <App />)",
      detail:
        "The framework runs the components again in the browser and attaches event handlers to the existing DOM instead of rebuilding it. The output must match the server's HTML.",
    },
    {
      id: "interactive",
      from: "browser",
      title: "Now interactive",
      payload: "onClick handlers live",
      detail: "From here on the page behaves like a client-rendered app.",
    },
  ],
};
