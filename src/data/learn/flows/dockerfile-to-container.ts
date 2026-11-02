import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → Containers → Docker. */
export const dockerfileToContainer: FlowDefinition = {
  id: "dockerfile-to-container",
  title: "docker build, push and run",
  actors: [
    { id: "cli", label: "Docker CLI", sublabel: "your terminal", kind: "client", col: 0, row: 0 },
    { id: "daemon", label: "dockerd", sublabel: "Docker Engine", kind: "server", col: 1, row: 0 },
    { id: "registry", label: "Registry", sublabel: "Docker Hub, GHCR", kind: "external", col: 2, row: 0 },
    { id: "container", label: "Container", sublabel: "isolated process", kind: "service", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "context",
      from: "cli",
      to: "daemon",
      title: "Send the build context",
      payload: "docker build -t me/app:1.4 .",
      detail:
        "The CLI is only a client. It sends the folder, minus anything in .dockerignore, to the daemon's API, where BuildKit does the work. The tag names the image in your registry namespace so it can be pushed.",
    },
    {
      id: "pull",
      from: "daemon",
      to: "registry",
      title: "Pull the base image",
      payload: "FROM node:22-alpine",
      detail: "The daemon checks its local store first and only downloads missing layers.",
    },
    {
      id: "layers",
      from: "registry",
      to: "daemon",
      title: "Download the layers",
      payload: "manifest + layer blobs",
      variant: "response",
      detail: "An image is a manifest plus a stack of compressed, content-addressed layers.",
    },
    {
      id: "build",
      from: "daemon",
      title: "Run each instruction",
      payload: "COPY, RUN → new layers",
      detail:
        "Each instruction adds a cached layer. A change invalidates that layer and every one after it, so put steps that rarely change first.",
    },
    {
      id: "push",
      from: "daemon",
      to: "registry",
      title: "Push the image",
      payload: "docker push me/app:1.4",
      detail: "Only layers the registry doesn't already have are uploaded.",
    },
    {
      id: "run",
      from: "cli",
      to: "daemon",
      title: "Start a container",
      payload: "docker run -p 80:3000 me/app:1.4",
      detail: "On a server this usually comes from an orchestrator rather than a person.",
    },
    {
      id: "sandbox",
      from: "daemon",
      title: "Prepare the sandbox",
      payload: "namespaces + cgroups + overlay",
      detail:
        "containerd and runc create namespaces for processes, network and mounts, set cgroup limits on CPU and memory, and add a writable layer over the read-only image.",
    },
    {
      id: "start",
      from: "daemon",
      to: "container",
      title: "Start the process",
      payload: 'CMD ["node","server.js"]',
      detail:
        "A container is just a process on the host's kernel. It isn't a virtual machine, which is why it starts in milliseconds.",
    },
    {
      id: "listen",
      from: "container",
      title: "Listen on its port",
      payload: "0.0.0.0:3000",
      detail:
        "Port 80 on the host is forwarded to 3000 inside. Bind to 0.0.0.0, not localhost, or the forwarded traffic can't reach the app.",
    },
  ],
};
