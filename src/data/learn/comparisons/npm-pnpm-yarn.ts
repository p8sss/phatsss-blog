import type { Comparison } from "../../../lib/compare/types";

/** Frontend roadmap → Package Managers. */
export const npmPnpmYarn: Comparison = {
  id: "npm-pnpm-yarn",
  title: "npm vs pnpm vs Yarn",
  options: [
    { id: "npm", name: "npm 12", summary: "The package manager that ships with Node.js." },
    { id: "pnpm", name: "pnpm 12", summary: "Links every package from one content-addressable store." },
    { id: "yarn", name: "Yarn 4", summary: "Installs without node_modules by default, using Plug'n'Play." },
  ],
  rows: [
    {
      criterion: "node_modules layout",
      cells: {
        npm: "Flat and hoisted. Packages are copied to the top level; clashing versions nest under the package that needs them.",
        pnpm: "Only your direct dependencies sit at the top, as symlinks into node_modules/.pnpm.",
        yarn: "No node_modules. A .pnp.cjs loader maps each import to a zip archive in the cache.",
      },
    },
    {
      criterion: "Undeclared imports",
      cells: {
        npm: "Work by accident, because hoisting exposes transitive packages. install-strategy=linked gives an isolated layout instead.",
        pnpm: "Fail. Code can only reach the packages it declares.",
        yarn: "Fail. Plug'n'Play throws when a package imports something it did not declare.",
      },
    },
    {
      criterion: "Disk use across projects",
      cells: {
        npm: "Every project gets its own full copy. Only the download cache is shared.",
        pnpm: "Each file is stored once per disk and hard-linked into every project.",
        yarn: "One shared cache of zip archives that projects read from directly.",
      },
    },
    {
      criterion: "Dependency install scripts",
      cells: {
        npm: "Blocked by default since npm 12, unless the root package.json allowScripts policy permits them.",
        pnpm: "Blocked unless listed in allowBuilds. An install with unreviewed build scripts fails.",
        yarn: "enableScripts defaults to false since 4.14. Re-enable per package with dependenciesMeta.",
      },
    },
    {
      criterion: "Waiting out fresh releases",
      cells: {
        npm: "min-release-age, off by default.",
        pnpm: "minimumReleaseAge, on by default at 24 hours.",
        yarn: "npmMinimalAgeGate, which recent 4.x releases turn on by default.",
      },
    },
    {
      criterion: "Monorepos",
      cells: {
        npm: "workspaces in package.json. Run scripts with --workspace.",
        pnpm: "pnpm-workspace.yaml, the workspace: protocol, --filter and catalogs for shared versions.",
        yarn: "workspaces, the workspace: protocol, foreach and constraints to enforce rules.",
      },
    },
    {
      criterion: "Lockfile",
      cells: {
        npm: "package-lock.json",
        pnpm: "pnpm-lock.yaml",
        yarn: "yarn.lock",
      },
    },
    {
      criterion: "Tool compatibility",
      cells: {
        npm: "The reference. Everything expects this layout.",
        pnpm: "High. A few tools trip on symlinks; nodeLinker: hoisted gives an npm-like layout.",
        yarn: "Lowest with Plug'n'Play. Editors need SDKs and some packages need packageExtensions. nodeLinker: node-modules is the fallback.",
      },
    },
  ],
  verdicts: [
    {
      option: "npm",
      pickWhen: [
        "You want nothing extra to install, in CI or in a Docker image.",
        "Compatibility with every tool matters more than install speed or disk use.",
        "The project is small, or a single package.",
      ],
    },
    {
      option: "pnpm",
      pickWhen: [
        "You run a monorepo and want fast installs and strict dependency boundaries.",
        "One machine or CI runner installs many projects that share packages.",
        "You want safe defaults for build scripts and brand-new releases.",
      ],
    },
    {
      option: "yarn",
      pickWhen: [
        "The repository already uses modern Yarn and its plugins or constraints.",
        "You want Plug'n'Play's strict resolution and are ready to set up editor SDKs.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "npm 12.0.0 release notes", href: "https://github.com/npm/cli/releases/tag/v12.0.0" },
    { label: "pnpm: motivation and layout", href: "https://pnpm.io/motivation" },
    { label: "pnpm build settings", href: "https://pnpm.io/settings/build" },
    { label: "Yarn install linkers", href: "https://yarnpkg.com/features/linkers" },
  ],
};
