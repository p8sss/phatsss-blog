import {galaxyDark, galaxyLight} from './src/lib/prism-galaxy';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "phatsss",
  tagline: "phatsss is a blog about programming",
  favicon: "img/icons/favicon.ico",

  // Set the production url of your site here
  url: "https://phatsss.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/phatsss-blog/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "phatsss", // Usually your GitHub org/user name.
  projectName: "phatsss-blog", // Usually your repo name.

  future: {
    experimental_faster: {
      // Lightning CSS understands modern CSS (@starting-style, @property) and
      // keeps @keyframes names intact; the default cssnano + clean-css chain
      // renames keyframes (breaking glasscn's inline animationName) and drops
      // @starting-style rules.
      lightningCssMinimizer: true,
      swcJsLoader: false,
      swcJsMinimizer: false,
      swcHtmlMinimizer: false,
      mdxCrossCompilerCache: false,
      rspackBundler: false,
    },
  },

  customFields: {
    // "today" for SSR and the first client render (src/hooks/use-today.ts),
    // so durations of ongoing roles hydrate without a text mismatch
    buildDate: new Date().toISOString(),
  },

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  deploymentBranch: "gh-pages",
  githubHost: "github.com",
  githubPort: "22",
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "th", "lo"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
          // One list page: /blog filters and "loads more" client-side over all
          // posts, so /blog/page/N (and /blog/tags/x/page/N) would only be
          // duplicate URLs of the same view
          postsPerPage: "ALL",
          blogSidebarCount: "ALL",
          blogSidebarTitle: "All posts",
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  // ──────────────────────────────────────────────────
  // Local search plugin (no Algolia, 100% client-side)
  plugins: [
    require.resolve("./plugins/tailwindcss"),
    require.resolve("./plugins/blog-tags"),
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // tell it to look in the `docs/` folder (this is the default,
        // but it’s good to be explicit):
        docsDir: "docs",

        // this must match your docs’ routeBasePath
        // you serve your docs at `/`, so:
        docsRouteBasePath: "/",

        // still index your markdown
        indexDocs: true,
        indexPages: false,
        indexBlog: false,

        // languages you use
        // language: ["en", "lo"],

        // optional:
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarShortcut: true,
        searchBarPosition: "right",
      },
    ],
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
    [
      "@docusaurus/plugin-pwa",
      {
        debug: true,
        offlineModeActivationStrategies: [
          "appInstalled",
          "standalone",
          "queryString",
        ],
        pwaHead: [
          {
            tagName: "link",
            rel: "icon",
            type: "image/svg+xml",
            href: "img/icons/blackhole.svg",
          },
          {
            tagName: "link",
            rel: "icon",
            type: "image/png",
            sizes: "192x192",
            href: "img/icons/icon-192.png",
          },
          {
            tagName: "link",
            rel: "manifest",
            href: "manifest.json",
          },
          // Browser UI tint follows the galaxy backdrop (aurora-base)
          {
            tagName: "meta",
            name: "theme-color",
            media: "(prefers-color-scheme: light)",
            content: "#f8f4ed",
          },
          {
            tagName: "meta",
            name: "theme-color",
            media: "(prefers-color-scheme: dark)",
            content: "#000b14",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-status-bar-style",
            content: "default",
          },
          {
            tagName: "link",
            rel: "apple-touch-icon",
            href: "img/icons/apple-touch-icon.png",
          },
          {
            tagName: "link",
            rel: "mask-icon",
            href: "img/icons/blackhole-mask.svg",
            color: "#c5a47f",
          },
          {
            tagName: "meta",
            name: "msapplication-TileImage",
            content: "img/icons/icon-192.png",
          },
          {
            tagName: "meta",
            name: "msapplication-TileColor",
            content: "#000b14",
          },
        ],
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: "img/phatsss-logo.png",
    metadata: [
      {
        name: "keywords",
        content:
          "phatsss, blog, Front-End Developer, Programming, Web Developer, Software Engineer",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],

    navbar: {
      title: "Home",
      logo: {
        // alt: 'My Site Logo',
        src: "img/phatsss-logo.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Tutorial",
        },
        { to: "/blog", label: "Blog", position: "left" },
        { to: "/bookmarks", label: "Bookmarks", position: "left" },
        { to: "/elements", label: "Elements", position: "left" },
        { type: "search", position: "right" },
        {
          type: "localeDropdown",
          position: "right",
        },
        // {
        //   href: 'https://github.com/facebook/docusaurus',
        //   label: 'GitHub',
        //   position: 'right',
        // },
      ],
    },
    footer: {
      // style: 'dark',
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Medium",
              href: "https://medium.com/@phatsss",
            },
            {
              label: "Dev.to",
              href: "https://dev.to/phatsss",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/phatsss",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/phatsss",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Phatsss👾.`,
    },
    prism: {
      // galaxy palette, every token ≥ 4.5:1 on its background
      theme: galaxyLight,
      darkTheme: galaxyDark,
    },
    headTags: [
      {
        tagName: "link",
        attributes: {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
      },
      {
        tagName: "link",
        attributes: {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
      },
      {
        tagName: "link",
        attributes: {
          rel: "preload",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;700&display=swap",
          as: "style",
        },
      },
      // Declare some json-ld structured data
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Organization",
          name: "Meta Open Source",
          url: "https://opensource.fb.com/",
          logo: "https://opensource.fb.com/img/logos/Meta-Open-Source.svg",
        }),
      },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
