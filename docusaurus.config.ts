import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "phatsss",
  tagline: "phatsss is a blog about programming",
  favicon: "img/favicon.png",

  // Set the production url of your site here
  url: "https://phatsss.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/phatsss-blog/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "phatsss", // Usually your GitHub org/user name.
  projectName: "phatsss-blog", // Usually your repo name.

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
            href: "img/favicon.png",
          },
          {
            tagName: "link",
            rel: "icon",
            href: "img/favicon.png",
          },
          {
            tagName: "link",
            rel: "manifest",
            href: "manifest.json",
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "#090d16",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-status-bar-style",
            content: "#090d16",
          },
          {
            tagName: "link",
            rel: "apple-touch-icon",
            href: "img/favicon.png",
          },
          {
            tagName: "link",
            rel: "mask-icon",
            href: "img/favicon.png",
            color: "#090d16",
          },
          {
            tagName: "meta",
            name: "msapplication-TileImage",
            content: "img/favicon.png",
          },
          {
            tagName: "meta",
            name: "msapplication-TileColor",
            content: "#090d16",
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
              label: "LinkIn",
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
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
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
