import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Container Security. */
export const imageScanning: FlowDefinition = {
  id: "image-scanning",
  title: "A vulnerable base image, caught and fixed",
  actors: [
    { id: "dev", label: "Developer", sublabel: "git push", kind: "client", col: 0, row: 0 },
    { id: "ci", label: "CI pipeline", sublabel: "build + gate", kind: "service", col: 1, row: 0 },
    { id: "scanner", label: "Scanner", sublabel: "Trivy, Grype", kind: "service", col: 2, row: 0 },
    { id: "vulndb", label: "Vuln DB", sublabel: "advisories", kind: "external", col: 3, row: 0 },
    { id: "registry", label: "Registry", sublabel: "images by digest", kind: "database", col: 1, row: 1 },
    { id: "admission", label: "Admission", sublabel: "cluster policy", kind: "server", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "push",
      from: "dev",
      to: "ci",
      title: "Push a change",
      payload: "git push  (FROM node:22)",
      detail: "The app code is fine. The problem is in the base image it builds on, which nobody on the team wrote.",
    },
    {
      id: "build",
      from: "ci",
      title: "Build the image",
      payload: "docker build -t shop:1f3c .",
      detail: "The image now contains hundreds of OS packages and libraries from the base layer, plus your dependencies.",
    },
    {
      id: "scan",
      from: "ci",
      to: "scanner",
      title: "Scan before pushing",
      payload: "trivy image shop:1f3c",
      detail: "Scanning in the pipeline catches problems before the image reaches any registry or cluster.",
    },
    {
      id: "db-pull",
      from: "scanner",
      to: "vulndb",
      title: "Refresh the advisory data",
      payload: "pull latest vuln database",
      detail: "New CVEs are published every day, so the scanner downloads a fresh database whenever its copy is out of date.",
    },
    {
      id: "db-data",
      from: "vulndb",
      to: "scanner",
      title: "Receive the advisories",
      payload: "distro trackers, GHSA, NVD",
      variant: "response",
      detail:
        "Distro security trackers matter most for OS packages. They know which fixes were backported into each package version.",
    },
    {
      id: "match",
      from: "scanner",
      title: "Inventory and match",
      payload: "412 packages → 1 CRITICAL",
      detail:
        "The scanner lists every OS package and language dependency in each layer, which is effectively an SBOM. Then it matches each version against the advisories.",
    },
    {
      id: "report",
      from: "scanner",
      to: "ci",
      title: "Report a fixable CRITICAL",
      payload: "CRITICAL libssl3, fix available",
      variant: "response",
      detail: "The finding is in the base image's OpenSSL package, and the distro has already shipped a fixed version.",
    },
    {
      id: "gate",
      from: "ci",
      title: "Fail the build",
      payload: "exit 1: severity gate",
      detail:
        "Gate on fixable CRITICAL and HIGH findings. Blocking on unfixable ones creates noise that teams learn to bypass.",
    },
    {
      id: "fix",
      from: "dev",
      to: "ci",
      title: "Rebuild on a patched base",
      payload: "FROM node:22@sha256:9f1b…",
      detail:
        "Pull the updated base image and pin it by digest, so builds are reproducible. Tools like Renovate or Dependabot can open these bumps automatically.",
    },
    {
      id: "publish",
      from: "ci",
      to: "registry",
      title: "Push, sign and attest",
      payload: "shop@sha256:… + signature",
      detail:
        "The scan passes. CI pushes the image by digest, signs it with cosign, and attaches the SBOM and scan result as attestations.",
    },
    {
      id: "rescan",
      from: "registry",
      title: "Keep rescanning",
      payload: "new CVE → alert on shop:1f3c",
      detail:
        "An image that was clean at build time can become vulnerable next week. Continuous registry scanning flags images already deployed.",
    },
    {
      id: "verify",
      from: "admission",
      to: "registry",
      title: "Check the image at deploy time",
      payload: "verify signature for digest",
      detail:
        "An admission controller such as Kyverno or the Sigstore policy controller runs when a pod is created. It refuses images that CI did not sign.",
    },
    {
      id: "verified",
      from: "registry",
      to: "admission",
      title: "Signature and attestation found",
      payload: "signed by ci.example ✓",
      variant: "response",
      detail: "The policy can also require a recent scan attestation with no fixable criticals.",
    },
    {
      id: "admit",
      from: "admission",
      title: "Admit the pod",
      payload: "pod shop-7d9 allowed",
      detail:
        "The image that runs is the exact digest that was scanned and signed. A bypass of the pipeline would be stopped here.",
    },
  ],
};
