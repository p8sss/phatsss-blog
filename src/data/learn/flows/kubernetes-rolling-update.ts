import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → Container Orchestration → Kubernetes. */
export const kubernetesRollingUpdate: FlowDefinition = {
  id: "kubernetes-rolling-update",
  title: "A rolling update, one pod at a time",
  actors: [
    { id: "kubectl", label: "kubectl", sublabel: "you or CI", kind: "client", col: 0, row: 0 },
    { id: "api", label: "API server", sublabel: "control plane", kind: "server", col: 1, row: 0 },
    { id: "controller", label: "Controller", sublabel: "Deployment", kind: "service", col: 2, row: 0 },
    { id: "service", label: "Service", sublabel: "EndpointSlices", kind: "queue", col: 1, row: 1 },
    { id: "kubelet", label: "kubelet", sublabel: "node agent", kind: "external", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "apply",
      from: "kubectl",
      to: "api",
      title: "Apply the new image",
      payload: "image: shop:v2",
      detail:
        "kubectl sends the updated Deployment. The API server validates it and stores it in etcd. Nothing has changed on any node yet.",
    },
    {
      id: "notify",
      from: "api",
      to: "controller",
      title: "Notify the watchers",
      payload: "Deployment shop changed",
      detail: "Controllers don't poll. They watch the API server and react to changes.",
    },
    {
      id: "surge",
      from: "controller",
      to: "api",
      title: "Create a v2 ReplicaSet",
      payload: "v2 replicas: 0 → 1",
      detail:
        "maxSurge and maxUnavailable bound the rollout. With maxSurge 1 and maxUnavailable 0 there is never less capacity than before.",
    },
    {
      id: "schedule",
      from: "api",
      to: "kubelet",
      title: "Start the new pod",
      payload: "run pod shop-v2-x7k",
      detail: "The scheduler picks a node, and that node's kubelet sees the pod assigned to it.",
    },
    {
      id: "probe",
      from: "kubelet",
      title: "Pull, start and probe",
      payload: "readinessProbe: GET /ready",
      detail: "The container is running, but it gets no traffic until the readiness probe passes.",
    },
    {
      id: "ready",
      from: "kubelet",
      to: "api",
      title: "Report Ready",
      payload: "pod Ready = True",
      variant: "response",
      detail: "Without a readiness probe Kubernetes treats a started container as ready, often too early.",
    },
    {
      id: "endpoint",
      from: "api",
      to: "service",
      title: "Add the pod to the Service",
      payload: "+ shop-v2-x7k",
      detail: "The Service starts load-balancing to the new pod alongside the old ones.",
    },
    {
      id: "scale-down",
      from: "controller",
      to: "api",
      title: "Scale down one v1 pod",
      payload: "v1 replicas: 3 → 2",
      detail: "One new pod is ready, so one old pod may go.",
    },
    {
      id: "drain",
      from: "api",
      to: "service",
      title: "Remove it from the Service",
      payload: "− shop-v1-a1b",
      detail:
        "Removal from the Service and the stop signal in the next step start at the same time, in parallel. A few requests can still arrive after shutdown begins.",
    },
    {
      id: "terminate",
      from: "api",
      to: "kubelet",
      title: "Stop the old pod",
      payload: "SIGTERM, then grace period",
      detail:
        "A short preStop sleep lets the endpoint removal land first. Then the app finishes in-flight requests and exits. After the grace period, 30 seconds by default, it gets SIGKILL.",
    },
    {
      id: "repeat",
      from: "controller",
      title: "Repeat until done",
      payload: "v2: 3/3 ready · v1: 0/3",
      detail: "The old ReplicaSet is kept at zero replicas, so kubectl rollout undo can bring it back.",
    },
  ],
};
