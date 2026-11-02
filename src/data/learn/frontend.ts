import type { Roadmap } from "./types";

/**
 * Section names and order follow roadmap.sh/frontend (checked 2026-11-02);
 * topics and write-ups are this site's own.
 */
export const frontendRoadmap: Roadmap = {
  id: "frontend",
  title: "Frontend",
  href: "https://roadmap.sh/frontend",
  sections: [
    {
      id: "internet",
      title: "Internet",
      topics: [
        {
          id: "browser-rendering",
          title: "How a browser renders a page",
          question: "What happens between the first HTML byte and the first painted pixel?",
          format: "flow",
          to: "/learn/frontend/browser-rendering",
        },
      ],
    },
    {
      id: "javascript",
      title: "JavaScript",
      topics: [
        {
          id: "event-loop",
          title: "The event loop",
          question: "Why does a resolved promise run before a zero-delay timeout?",
          format: "flow",
          to: "/learn/frontend/event-loop",
        },
      ],
    },
    {
      id: "module-bundlers",
      title: "Module Bundlers",
      topics: [
        {
          id: "vite-rollup-esbuild",
          title: "Vite, Rollup and esbuild",
          question: "Which one builds what, and when do you pick each?",
          format: "compare",
          to: "/learn/frontend/vite-rollup-esbuild",
        },
      ],
    },
    {
      id: "auth-strategies",
      title: "Auth Strategies",
      topics: [
        {
          id: "oauth-pkce",
          title: "OAuth login with PKCE",
          question: "How does a browser app sign in through another site without a client secret?",
          format: "flow",
          to: "/learn/frontend/oauth-pkce",
        },
      ],
    },
    {
      id: "ssr",
      title: "SSR",
      topics: [
        {
          id: "ssr-hydration",
          title: "Server rendering and hydration",
          question: "What does the server send, and what does the browser still have to do?",
          format: "flow",
          to: "/learn/frontend/ssr-hydration",
        },
      ],
    },
  ],
};
