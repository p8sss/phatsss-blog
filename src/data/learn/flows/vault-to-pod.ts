import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → Secret Management. */
export const vaultToPod: FlowDefinition = {
  id: "vault-to-pod",
  title: "A dynamic database password, from Vault to a pod",
  actors: [
    { id: "injector", label: "Injector", sublabel: "mutating webhook", kind: "service", col: 0, row: 0 },
    { id: "api", label: "K8s API", sublabel: "API server", kind: "server", col: 1, row: 0 },
    { id: "vault", label: "Vault", sublabel: "secrets engine", kind: "external", col: 2, row: 0 },
    { id: "app", label: "App", sublabel: "container", kind: "client", col: 0, row: 1 },
    { id: "agent", label: "Vault Agent", sublabel: "init + sidecar", kind: "service", col: 1, row: 1 },
    { id: "db", label: "PostgreSQL", sublabel: "orders-db", kind: "database", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "admission",
      from: "api",
      to: "injector",
      title: "Send the new pod to the webhook",
      payload: "AdmissionReview pod orders",
      detail:
        "The pod spec in Git carries annotations, not secrets. The API server passes the pod to the Vault Agent Injector before storing it.",
    },
    {
      id: "patch",
      from: "injector",
      to: "api",
      title: "Patch in Vault Agent",
      payload: "+ vault-agent-init, + sidecar",
      variant: "response",
      detail:
        "Seeing agent-inject: \"true\", the injector adds an init container, a sidecar and a shared in-memory volume at /vault/secrets.",
    },
    {
      id: "start",
      from: "api",
      to: "agent",
      title: "Start the pod",
      payload: "service account token",
      detail:
        "The kubelet starts the init container first, with the pod's service account token mounted. That token is the pod's only credential.",
    },
    {
      id: "login",
      from: "agent",
      to: "vault",
      title: "Log in with the pod's identity",
      payload: "login role=orders jwt=eyJ…",
      detail: "Vault Agent posts the token to Vault's Kubernetes auth method and names the Vault role it wants.",
    },
    {
      id: "review",
      from: "vault",
      to: "api",
      title: "Check the token with Kubernetes",
      payload: "TokenReview eyJ…",
      detail: "Vault does not trust the token on sight. It asks the TokenReview API whether the token is valid and whose it is.",
    },
    {
      id: "reviewed",
      from: "api",
      to: "vault",
      title: "Confirm the identity",
      payload: "ns=shop sa=orders: valid",
      variant: "response",
      detail: "The role only accepts that service account in that namespace. Any other pod is refused.",
    },
    {
      id: "token",
      from: "vault",
      to: "agent",
      title: "Issue a Vault token",
      payload: "token, policy orders-db, 1h",
      variant: "response",
      detail: "The token carries the role's policies. They allow reading database/creds/orders and nothing else.",
    },
    {
      id: "request",
      from: "agent",
      to: "vault",
      title: "Ask for database credentials",
      payload: "GET database/creds/orders",
      detail: "This path is a dynamic secret. Nothing is stored there until someone asks.",
    },
    {
      id: "create-user",
      from: "vault",
      to: "db",
      title: "Create a short-lived user",
      payload: "CREATE ROLE \"v-orders-x7k\" …",
      detail:
        "Vault runs the role's creation statements with its own admin connection. The new user expires with the lease.",
    },
    {
      id: "creds",
      from: "vault",
      to: "agent",
      title: "Return the credentials and a lease",
      payload: "user v-orders-x7k, lease 1h",
      variant: "response",
      detail: "Every pod gets its own username and password. Revoking one pod's access leaves the rest working.",
    },
    {
      id: "render",
      from: "agent",
      to: "app",
      title: "Render the secret to a file",
      payload: "/vault/secrets/db-creds",
      detail:
        "The init container renders the template and exits. Only then does the app start, and it reads a plain file without knowing Vault exists.",
    },
    {
      id: "renew",
      from: "agent",
      title: "Keep the lease alive",
      payload: "renew lease, re-render",
      detail:
        "The sidecar keeps renewing up to the role's max TTL. When it must fetch new credentials, it rewrites the file and the app has to reload them.",
    },
    {
      id: "revoke",
      from: "vault",
      to: "db",
      title: "Revoke when the lease ends",
      payload: "DROP ROLE \"v-orders-x7k\"",
      detail:
        "When a lease expires or is revoked, Vault revokes the user's grants and drops it by default. A leaked password stops working on its own.",
    },
  ],
};
