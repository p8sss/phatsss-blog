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
  ],
};
