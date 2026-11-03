import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Secure Coding. */
export const supplyChain: FlowDefinition = {
  id: "supply-chain",
  title: "A poisoned package, from phishing to production",
  actors: [
    { id: "maintainer", label: "Maintainer", sublabel: "owns a package", kind: "client", col: 0, row: 0 },
    { id: "registry", label: "Registry", sublabel: "npm", kind: "external", col: 1, row: 0 },
    { id: "ci", label: "CI runner", sublabel: "your build", kind: "service", col: 2, row: 0 },
    { id: "attacker", label: "Attacker", sublabel: "wants tokens", kind: "attacker", col: 1, row: 1 },
    { id: "prod", label: "Production", sublabel: "your users", kind: "server", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "phish",
      from: "attacker",
      to: "maintainer",
      title: "Phish the maintainer",
      payload: "\"Update your 2FA now\"",
      detail:
        "The weakest link is often a person, not code. In September 2025 one phishing email led to malicious releases of chalk, debug and other widely used packages.",
    },
    {
      id: "creds",
      from: "maintainer",
      to: "attacker",
      title: "Credentials handed over",
      payload: "password + one-time code",
      variant: "response",
      detail:
        "A one-time code typed into a fake site is as good as the real thing. Phishing-resistant 2FA such as passkeys or security keys stops this step.",
    },
    {
      id: "publish",
      from: "attacker",
      to: "registry",
      title: "Publish a poisoned patch release",
      payload: "npm publish pkg@4.2.1",
      detail:
        "A patch bump looks routine. Trusted publishing with provenance would show this version was not built by the project's own CI.",
    },
    {
      id: "install",
      from: "ci",
      to: "registry",
      title: "Install without a lockfile",
      payload: "npm install  (pkg@^4.2.0)",
      detail:
        "A caret range accepts any new 4.x release. Committing a lockfile and running npm ci installs exactly the versions you reviewed.",
    },
    {
      id: "tarball",
      from: "registry",
      to: "ci",
      title: "Receive the new version",
      payload: "pkg-4.2.1.tgz",
      variant: "response",
      detail:
        "The release is minutes old. A minimum release age, such as three days, gives the community time to spot and remove it first.",
    },
    {
      id: "postinstall",
      from: "ci",
      title: "Run the install script",
      payload: "postinstall: node setup.js",
      detail:
        "Install scripts run with the CI job's permissions and environment. Disable dependency scripts by default and allow only the few packages that need them.",
    },
    {
      id: "exfil",
      from: "ci",
      to: "attacker",
      title: "Leak the CI secrets",
      payload: "POST {NPM_TOKEN, AWS_KEY}",
      detail:
        "The Shai-Hulud worm in 2025 worked this way, then used stolen npm tokens to publish itself into more packages. Short-lived OIDC credentials and restricted network egress limit the damage.",
    },
    {
      id: "build",
      from: "ci",
      title: "Bundle the malicious code",
      payload: "npm run build",
      detail:
        "The payload now sits inside your own artifact. Malware-aware dependency scanning on the lockfile diff can still catch it here.",
    },
    {
      id: "deploy",
      from: "ci",
      to: "prod",
      title: "Ship it to production",
      payload: "deploy web:sha-1f3c9a",
      detail:
        "In the chalk and debug case the code hooked browser APIs to swap crypto wallet addresses. An SBOM for each release tells you quickly whether you shipped the bad version.",
    },
    {
      id: "takedown",
      from: "registry",
      title: "The bad version is pulled",
      payload: "remove pkg@4.2.1",
      detail:
        "Takedowns often happen within hours, which is why waiting a few days before adopting new releases works. Then rotate every secret the CI job could read.",
    },
  ],
};
