import type { FlowDefinition } from "../../../lib/flow/types";

/** Frontend roadmap → Internet → Browsers and how they work? */
export const browserRendering: FlowDefinition = {
  id: "browser-rendering",
  title: "The critical rendering path, from HTML bytes to pixels",
  actors: [
    { id: "net", label: "Network", sublabel: "HTTP and cache", kind: "external", col: 0, row: 0 },
    { id: "parser", label: "HTML parser", sublabel: "builds the DOM", kind: "service", col: 1, row: 0 },
    { id: "js", label: "JS engine", sublabel: "V8, SpiderMonkey", kind: "server", col: 2, row: 0 },
    { id: "css", label: "CSS engine", sublabel: "builds the CSSOM", kind: "queue", col: 0, row: 1 },
    { id: "render", label: "Renderer", sublabel: "layout and paint", kind: "client", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "html",
      from: "net",
      to: "parser",
      title: "Stream the HTML",
      payload: "<!doctype html> …",
      detail:
        "HTML arrives in chunks and the parser starts on the first chunk. It does not wait for the whole document.",
    },
    {
      id: "dom",
      from: "parser",
      title: "Build the DOM",
      payload: "bytes → tokens → nodes",
      detail:
        "Bytes become characters, characters become tokens such as start tags, and tokens become nodes in the DOM tree.",
    },
    {
      id: "fetch-css",
      from: "parser",
      to: "net",
      title: "Request the stylesheet",
      payload: "GET /app.css",
      detail:
        "A preload scanner reads ahead of the parser and starts fetching CSS, scripts and images as soon as it sees them.",
    },
    {
      id: "css-bytes",
      from: "net",
      to: "css",
      title: "Deliver the stylesheet",
      payload: "body { … }",
      variant: "response",
      detail: "The CSS goes to the style engine, not the HTML parser.",
    },
    {
      id: "cssom",
      from: "css",
      title: "Build the CSSOM",
      payload: "rules → CSSOM",
      detail:
        "CSS is render-blocking: nothing paints until the CSSOM is ready, because the browser can't know what anything looks like. Keep critical CSS small.",
    },
    {
      id: "script",
      from: "parser",
      to: "js",
      title: "Hand over a script",
      payload: "<script src=app.js>",
      detail:
        "A plain script tag pauses parsing until the script downloads and runs, because the script might change the DOM. Use defer, or a module script, to avoid the pause. async only avoids it while the script downloads.",
    },
    {
      id: "mutate",
      from: "js",
      to: "parser",
      title: "Run it, maybe change the DOM",
      payload: "document.querySelector(…)",
      variant: "response",
      detail: "Once the script finishes, parsing resumes from where it stopped.",
    },
    {
      id: "dom-out",
      from: "parser",
      to: "render",
      title: "Send the DOM",
      payload: "DOM tree",
      detail:
        "The renderer combines the DOM with the CSSOM into a render tree. It keeps only visible nodes, so elements with display: none are left out.",
    },
    {
      id: "styles-out",
      from: "css",
      to: "render",
      title: "Send the computed styles",
      payload: "CSSOM",
      detail: "Every visible node gets its final computed style.",
    },
    {
      id: "layout",
      from: "render",
      title: "Lay out the page",
      payload: "sizes and positions",
      detail:
        "Layout computes the exact box of every element for this viewport. Changing geometry later, for example the width, forces layout to run again.",
    },
    {
      id: "paint",
      from: "render",
      title: "Paint and composite",
      payload: "layers → GPU → pixels",
      detail:
        "Painting fills pixels into layers and the compositor stacks them on the GPU. Animating transform and opacity skips layout and paint and only recomposites.",
    },
  ],
};
