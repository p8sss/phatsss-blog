import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → Service Mesh. */
export const sidecarRequest: FlowDefinition = {
  id: "sidecar-request",
  title: "One call between two services in an Istio sidecar mesh",
  actors: [
    { id: "web", label: "Web app", sublabel: "caller", kind: "client", col: 0, row: 0 },
    { id: "web-envoy", label: "Web Envoy", sublabel: "sidecar proxy", kind: "service", col: 1, row: 0 },
    { id: "orders-envoy", label: "Orders Envoy", sublabel: "sidecar proxy", kind: "service", col: 2, row: 0 },
    { id: "orders", label: "Orders app", sublabel: "callee", kind: "server", col: 3, row: 0 },
    { id: "istiod", label: "istiod", sublabel: "control plane", kind: "server", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "config",
      from: "istiod",
      to: "web-envoy",
      title: "Push config ahead of time",
      payload: "xDS: routes, endpoints, policy",
      detail:
        "Before any request, istiod pushes routes, endpoints and policies to every proxy. The Istio agent in each pod gets a short-lived certificate signed by istiod.",
    },
    {
      id: "call",
      from: "web",
      to: "web-envoy",
      title: "The app makes a plain call",
      payload: "GET http://orders/42",
      detail:
        "The app calls orders over plain HTTP. Rules set up in the pod's network redirect the connection to Envoy on port 15001. The app does not know.",
    },
    {
      id: "pick",
      from: "web-envoy",
      title: "Route and pick an endpoint",
      payload: "→ 198.51.100.17:8080",
      detail:
        "Envoy matches the route, applies timeout and retry rules, and picks a healthy orders pod. By default it balances on least requests.",
    },
    {
      id: "hello",
      from: "web-envoy",
      to: "orders-envoy",
      title: "Start mutual TLS",
      payload: "TLS ClientHello",
      detail:
        "The client proxy opens a TLS connection to the chosen pod. Both proxies will present certificates that name their service account. Identity comes from the certificate, not from an IP address.",
    },
    {
      id: "server-cert",
      from: "orders-envoy",
      to: "web-envoy",
      title: "Prove the server's identity",
      payload: "cert: spiffe://…/sa/orders",
      variant: "response",
      detail:
        "The client proxy runs a secure naming check: is this service account allowed to serve orders? If not, it drops the connection.",
    },
    {
      id: "client-cert",
      from: "web-envoy",
      to: "orders-envoy",
      title: "Prove the client's identity",
      payload: "cert: spiffe://…/sa/web",
      detail: "The client proxy sends its own certificate. The server proxy now knows the caller's service account, too.",
    },
    {
      id: "forward",
      from: "web-envoy",
      to: "orders-envoy",
      title: "Send the request encrypted",
      payload: "GET /42 + x-request-id",
      detail: "The request travels inside the mutual TLS connection. Envoy adds a request id, and trace headers when tracing is on.",
    },
    {
      id: "authorize",
      from: "orders-envoy",
      title: "Check authorization policy",
      payload: "allow ns/shop/sa/web? yes",
      detail:
        "The server-side proxy checks AuthorizationPolicy against the caller's verified identity. A denied call gets a 403 before the app sees it.",
    },
    {
      id: "deliver",
      from: "orders-envoy",
      to: "orders",
      title: "Hand it to the app",
      payload: "GET /42 → pod IP :8080",
      detail:
        "Inbound traffic was captured on port 15006. Envoy forwards it in plain text to the app's port on the pod IP, so it never leaves the pod.",
    },
    {
      id: "respond",
      from: "orders",
      to: "orders-envoy",
      title: "The app answers",
      payload: "200 { id: 42, … }",
      variant: "response",
      detail: "The orders app wrote no TLS, retry or auth code for any of this.",
    },
    {
      id: "return",
      from: "orders-envoy",
      to: "web-envoy",
      title: "Send the response back",
      payload: "200 over mTLS",
      variant: "response",
      detail: "The reply returns over the same encrypted connection, which stays open for later requests.",
    },
    {
      id: "back",
      from: "web-envoy",
      to: "web",
      title: "Return it to the caller",
      payload: "200 { id: 42, … }",
      variant: "response",
      detail: "Had the call failed with a retryable error, Envoy would have retried it before the app saw anything.",
    },
    {
      id: "telemetry",
      from: "web-envoy",
      title: "Record metrics and spans",
      payload: "istio_requests_total +1",
      detail:
        "Both proxies record counts, latency and spans for Prometheus and a tracing backend. Traces only join up if the app forwards the trace headers on its own outbound calls.",
    },
  ],
};
