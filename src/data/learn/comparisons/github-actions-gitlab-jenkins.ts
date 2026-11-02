import type { Comparison } from "../../../lib/compare/types";

/** DevOps roadmap → CI / CD Tools. */
export const githubActionsGitlabJenkins: Comparison = {
  id: "github-actions-gitlab-jenkins",
  title: "GitHub Actions vs GitLab CI vs Jenkins",
  options: [
    { id: "gha", name: "GitHub Actions", summary: "CI/CD built into GitHub, driven by repository events." },
    { id: "gitlab", name: "GitLab CI/CD", summary: "Pipelines built into GitLab's all-in-one DevOps platform." },
    { id: "jenkins", name: "Jenkins", summary: "A self-hosted, open-source automation server with plugins." },
  ],
  rows: [
    {
      criterion: "Where it runs",
      cells: {
        gha: "Hosted runners, or your own self-hosted runners.",
        gitlab: "GitLab.com or self-managed GitLab, with shared or your own runners.",
        jenkins: "Only on infrastructure you run: a controller plus agents.",
      },
    },
    {
      criterion: "Pipeline definition",
      cells: {
        gha: "YAML workflows in .github/workflows.",
        gitlab: "YAML in .gitlab-ci.yml.",
        jenkins: "A Jenkinsfile in Groovy, declarative or scripted.",
      },
    },
    {
      criterion: "Reuse",
      cells: {
        gha: "Marketplace actions and reusable workflows.",
        gitlab: "include, templates and the CI/CD component catalog.",
        jenkins: "Shared libraries and a very large plugin ecosystem.",
      },
    },
    {
      criterion: "Source control",
      cells: {
        gha: "GitHub repositories.",
        gitlab: "GitLab repositories, with mirroring from elsewhere.",
        jenkins: "Any Git or other SCM.",
      },
    },
    {
      criterion: "Built-in extras",
      cells: {
        gha: "Environments, secrets, OIDC to clouds, package registry.",
        gitlab: "Container registry, environments, security scanning, review apps.",
        jenkins: "Whatever plugins you install.",
      },
    },
    {
      criterion: "Upkeep",
      cells: {
        gha: "Low on hosted runners.",
        gitlab: "Low on GitLab.com; medium when self-managed.",
        jenkins: "High: updates, plugin compatibility, security patches, backups.",
      },
    },
    {
      criterion: "Cost model",
      cells: {
        gha: "Free for public repos; private repos get included minutes, then pay per minute.",
        gitlab: "Free tier with compute minutes; paid tiers add more.",
        jenkins: "Free software; you pay for the servers and the time to run them.",
      },
    },
  ],
  verdicts: [
    {
      option: "gha",
      pickWhen: [
        "Your code is on GitHub and you want CI with no servers to run.",
        "You want a large catalogue of ready-made steps.",
      ],
    },
    {
      option: "gitlab",
      pickWhen: [
        "You want source, CI, registry and security scanning in one product.",
        "You need to self-host the whole toolchain.",
      ],
    },
    {
      option: "jenkins",
      pickWhen: [
        "You need full control, unusual build agents or air-gapped networks.",
        "You already run Jenkins and its pipelines work.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "GitHub Actions docs", href: "https://docs.github.com/en/actions" },
    { label: "GitLab CI/CD docs", href: "https://docs.gitlab.com/ci/" },
    { label: "Jenkins docs", href: "https://www.jenkins.io/doc/" },
  ],
};
