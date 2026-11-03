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
      id: "version-control",
      title: "Version Control",
      topics: [
        {
          id: "git-commit-push-merge",
          title: "What happens on commit, push and merge",
          question: "What does Git actually store, and what moves when you push?",
          format: "flow",
          to: "/learn/frontend/git-commit-push-merge",
        },
      ],
    },
    {
      id: "package-managers",
      title: "Package Managers",
      topics: [
        {
          id: "npm-pnpm-yarn",
          title: "npm vs pnpm vs Yarn",
          question: "How do they lay out node_modules, and which should you pick?",
          format: "compare",
          to: "/learn/frontend/npm-pnpm-yarn",
        },
      ],
    },
    {
      id: "learn-a-framework",
      title: "Learn a Framework",
      topics: [
        {
          id: "react-render-commit",
          title: "React: render, reconcile, commit",
          question: "What happens between setState and the DOM changing?",
          format: "flow",
          to: "/learn/frontend/react-render-commit",
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
      id: "testing",
      title: "Testing",
      topics: [
        {
          id: "vitest-vs-jest",
          title: "Vitest vs Jest",
          question: "Which unit test runner fits your project?",
          format: "compare",
          to: "/learn/frontend/vitest-vs-jest",
        },
        {
          id: "playwright-vs-cypress",
          title: "Playwright vs Cypress",
          question: "Which end-to-end tool fits your team?",
          format: "compare",
          to: "/learn/frontend/playwright-vs-cypress",
        },
      ],
    },
    {
      id: "web-security",
      title: "Web Security",
      topics: [
        {
          id: "cors-preflight",
          title: "CORS and the preflight request",
          question: "Why does the browser send an OPTIONS request before your real one?",
          format: "flow",
          to: "/learn/frontend/cors-preflight",
        },
        {
          id: "frontend-xss-csp",
          title: "XSS, and how CSP contains it",
          question: "How does a script get into the page, and what does the browser block?",
          format: "flow",
          to: "/learn/security/xss-csp",
          crossListFrom: "security",
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
    {
      id: "performance",
      title: "Performance",
      topics: [
        {
          id: "lcp",
          title: "What LCP measures, and what delays it",
          question: "Which four phases make up Largest Contentful Paint, and how do you shrink each?",
          format: "flow",
          to: "/learn/frontend/lcp",
        },
      ],
    },
    {
      id: "pwas",
      title: "PWAs",
      topics: [
        {
          id: "service-worker-offline",
          title: "A service worker serves a page offline",
          question: "How does a page load with no network at all?",
          format: "flow",
          to: "/learn/frontend/service-worker-offline",
        },
      ],
    },
  ],
};
