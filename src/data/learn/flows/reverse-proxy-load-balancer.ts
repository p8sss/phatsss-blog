import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → What is and how to setup X ? → Reverse Proxy, Load Balancer. */
export const reverseProxyLoadBalancer: FlowDefinition = {
  id: "reverse-proxy-load-balancer",
  title: "One address, many servers, and a server going down",
  actors: [
    { id: "client", label: "Client", sublabel: "browser or app", kind: "client", col: 0, row: 0 },
    { id: "lb", label: "Edge proxy", sublabel: "Nginx, HAProxy", kind: "service", col: 1, row: 0 },
    { id: "app1", label: "App server 1", sublabel: "10.0.1.11", kind: "server", col: 2, row: 0 },
    { id: "app2", label: "App server 2", sublabel: "10.0.1.12", kind: "server", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "request",
      from: "client",
      to: "lb",
      title: "Request the public address",
      payload: "GET https://shop.example/",
      detail: "DNS points the domain at the proxy. Clients never see the servers behind it.",
    },
    {
      id: "tls",
      from: "lb",
      title: "Terminate TLS",
      payload: "decrypt with cert + key",
      detail:
        "Certificates live in one place. Traffic to the backends runs on a private network, either plain or re-encrypted.",
    },
    {
      id: "pick",
      from: "lb",
      title: "Pick a backend",
      payload: "round robin → app 1",
      detail:
        "Common choices are round robin, least connections and hashing on the client IP. Hashing keeps a client on the same server.",
    },
    {
      id: "forward",
      from: "lb",
      to: "app1",
      title: "Forward the request",
      payload: "X-Forwarded-For: 203.0.113.7",
      detail:
        "The proxy adds headers so the app still knows the real client IP and that the original request was HTTPS.",
    },
    {
      id: "reply",
      from: "app1",
      to: "lb",
      title: "Respond",
      payload: "200 OK",
      variant: "response",
      detail: "The app answers the proxy, not the client.",
    },
    {
      id: "relay",
      from: "lb",
      to: "client",
      title: "Relay the response",
      payload: "200 OK · gzip",
      variant: "response",
      detail: "On the way out the proxy can compress, cache static files and add security headers.",
    },
    {
      id: "probe",
      from: "lb",
      to: "app1",
      title: "Run a health check",
      payload: "GET /healthz",
      detail: "Every few seconds the proxy probes each backend in the background.",
    },
    {
      id: "timeout",
      from: "app1",
      to: "lb",
      title: "No answer",
      payload: "timeout after 2 s",
      variant: "response",
      detail: "App server 1 has crashed or is overloaded.",
    },
    {
      id: "eject",
      from: "lb",
      title: "Take it out of rotation",
      payload: "app 1 marked down",
      detail:
        "After a few failed checks in a row the proxy stops sending it traffic. It rejoins once checks pass again.",
    },
    {
      id: "next",
      from: "client",
      to: "lb",
      title: "The next request",
      payload: "GET /cart",
      detail: "The client notices nothing: same address, same certificate.",
    },
    {
      id: "failover",
      from: "lb",
      to: "app2",
      title: "Send it to a healthy server",
      payload: "→ 10.0.1.12",
      detail: "The only healthy backend takes the traffic. Autoscaling would add more.",
    },
    {
      id: "reply2",
      from: "app2",
      to: "lb",
      title: "Respond",
      payload: "200 OK",
      variant: "response",
      detail: "If sessions lived in app 1's memory they are gone. Shared session stores avoid that.",
    },
    {
      id: "relay2",
      from: "lb",
      to: "client",
      title: "Relay the response",
      payload: "200 OK",
      variant: "response",
      detail:
        "Requests sent to app 1 between the crash and its ejection failed too, unless the proxy retried them on another server.",
    },
  ],
};
