import type { Roadmap } from "./types";

/**
 * Section names and order follow roadmap.sh/devops (checked 2026-11-02);
 * topics and write-ups are this site's own.
 */
export const devopsRoadmap: Roadmap = {
  id: "devops",
  title: "DevOps",
  href: "https://roadmap.sh/devops",
  sections: [
    {
      id: "setup-x",
      title: "What is and how to setup X ?",
      topics: [
        {
          id: "reverse-proxy-load-balancer",
          title: "Reverse proxy and load balancer",
          question: "How does one public address spread requests across many servers?",
          format: "flow",
          to: "/learn/devops/reverse-proxy-load-balancer",
        },
      ],
    },
    {
      id: "containers",
      title: "Containers",
      topics: [
        {
          id: "dockerfile-to-container",
          title: "From Dockerfile to running container",
          question: "What happens between docker build and a process listening on a port?",
          format: "flow",
          to: "/learn/devops/dockerfile-to-container",
        },
      ],
    },
    {
      id: "networking-protocols",
      title: "Networking & Protocols",
      topics: [
        {
          id: "tls-handshake",
          title: "The TLS handshake",
          question: "How do two strangers agree on a key that nobody listening can learn?",
          format: "flow",
          to: "/learn/devops/tls-handshake",
        },
      ],
    },
    {
      id: "serverless",
      title: "Serverless",
      topics: [
        {
          id: "lambda-cold-start",
          title: "A Lambda cold start",
          question: "What happens before your function's first line runs?",
          format: "flow",
          to: "/learn/devops/lambda-cold-start",
        },
      ],
    },
    {
      id: "provisioning",
      title: "Provisioning",
      topics: [
        {
          id: "terraform-plan-apply",
          title: "Terraform plan and apply",
          question: "How does Terraform turn a config file into real infrastructure?",
          format: "flow",
          to: "/learn/devops/terraform-plan-apply",
        },
      ],
    },
    {
      id: "ci-cd-tools",
      title: "CI / CD Tools",
      topics: [
        {
          id: "github-actions-gitlab-jenkins",
          title: "GitHub Actions vs GitLab CI vs Jenkins",
          question: "Hosted or self-run, and where does each one fit?",
          format: "compare",
          to: "/learn/devops/github-actions-gitlab-jenkins",
        },
      ],
    },
    {
      id: "secret-management",
      title: "Secret Management",
      topics: [
        {
          id: "vault-to-pod",
          title: "A secret from Vault to a pod",
          question: "How does a database password reach a container without living in Git?",
          format: "flow",
          to: "/learn/devops/vault-to-pod",
        },
      ],
    },
    {
      id: "infrastructure-monitoring",
      title: "Infrastructure Monitoring",
      topics: [
        {
          id: "prometheus-alert",
          title: "From a Prometheus scrape to an alert",
          question: "How does a metric become a page on someone's phone?",
          format: "flow",
          to: "/learn/devops/prometheus-alert",
        },
      ],
    },
    {
      id: "container-orchestration",
      title: "Container Orchestration",
      topics: [
        {
          id: "kubernetes-rolling-update",
          title: "A Kubernetes rolling update",
          question: "How does a deployment replace every pod without dropping traffic?",
          format: "flow",
          to: "/learn/devops/kubernetes-rolling-update",
        },
      ],
    },
    {
      id: "gitops",
      title: "GitOps",
      topics: [
        {
          id: "argocd-sync",
          title: "A commit becomes a deployment with Argo CD",
          question: "How does a Git merge change what runs in the cluster?",
          format: "flow",
          to: "/learn/devops/argocd-sync",
        },
      ],
    },
    {
      id: "observability",
      title: "Observability",
      topics: [
        {
          id: "logs-metrics-traces",
          title: "Logs vs metrics vs traces",
          question: "What does each signal answer, and what does it cost?",
          format: "compare",
          to: "/learn/devops/logs-metrics-traces",
        },
      ],
    },
    {
      id: "service-mesh",
      title: "Service Mesh",
      topics: [
        {
          id: "sidecar-request",
          title: "What a sidecar does to one request",
          question: "What happens to a call between two services in a mesh?",
          format: "flow",
          to: "/learn/devops/sidecar-request",
        },
      ],
    },
  ],
};
