import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → GitOps. */
export const argocdSync: FlowDefinition = {
  id: "argocd-sync",
  title: "A Git merge, synced into the cluster by Argo CD",
  actors: [
    { id: "dev", label: "Developer", sublabel: "pull request", kind: "client", col: 0, row: 0 },
    { id: "git", label: "Git repo", sublabel: "config repo", kind: "database", col: 1, row: 0 },
    { id: "argocd", label: "Argo CD", sublabel: "app controller", kind: "service", col: 2, row: 0 },
    { id: "k8s", label: "Kubernetes", sublabel: "API server", kind: "server", col: 3, row: 0 },
    { id: "repo", label: "Repo server", sublabel: "renders YAML", kind: "service", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "merge",
      from: "dev",
      to: "git",
      title: "Merge the change",
      payload: "image tag v1.4.1 → v1.4.2",
      detail:
        "The pull request changes desired state, not the cluster. Review, approval and history all happen in Git.",
    },
    {
      id: "webhook",
      from: "git",
      to: "argocd",
      title: "Notify Argo CD",
      payload: "push: main @ 9f3c2e1",
      detail:
        "A webhook to Argo CD's API server triggers an immediate refresh. Without one, Argo CD notices on its next poll, about every three minutes.",
    },
    {
      id: "generate",
      from: "argocd",
      to: "repo",
      title: "Ask for the manifests",
      payload: "generate shop @ 9f3c2e1",
      detail: "The application controller asks the repo server for the desired state at that exact commit.",
    },
    {
      id: "fetch",
      from: "repo",
      to: "git",
      title: "Fetch the commit",
      payload: "git fetch 9f3c2e1",
      detail: "The repo server keeps a local clone and caches rendered output per commit.",
    },
    {
      id: "render",
      from: "repo",
      title: "Render plain YAML",
      payload: "kustomize build overlays/prod",
      detail: "Helm charts, Kustomize overlays and plain directories all end up as a flat list of Kubernetes objects.",
    },
    {
      id: "manifests",
      from: "repo",
      to: "argocd",
      title: "Return the desired state",
      payload: "Deployment shop: v1.4.2",
      variant: "response",
      detail: "The controller now has what Git says should run.",
    },
    {
      id: "diff",
      from: "argocd",
      title: "Diff desired against live",
      payload: "OutOfSync: Deployment/shop",
      detail:
        "The controller watches live objects in the cluster and compares them with the rendered manifests. Any difference marks the app OutOfSync.",
    },
    {
      id: "apply",
      from: "argocd",
      to: "k8s",
      title: "Sync the change",
      payload: "apply Deployment shop",
      detail:
        "With automated sync on, Argo CD applies the manifests itself, much like kubectl apply. PreSync hooks and sync waves can order the work.",
    },
    {
      id: "applied",
      from: "k8s",
      to: "argocd",
      title: "Accept the new spec",
      payload: "deployment.apps/shop configured",
      variant: "response",
      detail: "Kubernetes takes over from here and starts a rolling update. Argo CD does not create pods itself.",
    },
    {
      id: "health",
      from: "argocd",
      title: "Track health",
      payload: "Progressing → Healthy",
      detail:
        "Synced means the spec matches Git. Healthy means the rollout actually finished. Argo CD reports both separately.",
    },
    {
      id: "drift",
      from: "k8s",
      to: "argocd",
      title: "Notice a manual change",
      payload: "live replicas: 3 → 5",
      detail: "Someone ran kubectl scale. The watch shows the live object no longer matches Git, so the app is OutOfSync again.",
    },
    {
      id: "self-heal",
      from: "argocd",
      to: "k8s",
      title: "Self-heal back to Git",
      payload: "apply replicas: 3",
      detail:
        "With selfHeal on, Argo CD reverts the drift. With it off, the app just stays OutOfSync until someone syncs or changes Git.",
    },
  ],
};
