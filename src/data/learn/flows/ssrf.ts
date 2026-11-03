import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → OWASP Top 10. */
export const ssrf: FlowDefinition = {
  id: "ssrf",
  title: "A link preview that fetches the cloud's secrets",
  actors: [
    { id: "attacker", label: "Attacker", sublabel: "any user", kind: "attacker", col: 0, row: 0 },
    { id: "app", label: "App server", sublabel: "fetches URLs", kind: "server", col: 1, row: 0 },
    { id: "imds", label: "Metadata API", sublabel: "169.254.169.254", kind: "external", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "ask",
      from: "attacker",
      to: "app",
      title: "Ask for a link preview",
      payload: "url=http://169.254.169.254/…",
      detail: "The feature fetches any URL a user pastes in. The attacker pastes an internal address.",
    },
    {
      id: "fetch",
      from: "app",
      title: "Fetch whatever URL it gets",
      payload: "fetch(req.body.url)",
      detail: "The server makes the request from inside your network, which is exactly what the attacker borrows.",
    },
    {
      id: "call",
      from: "app",
      to: "imds",
      title: "Reach the metadata service",
      payload: "GET /latest/meta-data/iam/…",
      detail:
        "This link-local address is only reachable from the machine itself. It hands out the instance's details and its role credentials.",
    },
    {
      id: "creds",
      from: "imds",
      to: "app",
      title: "Return temporary credentials",
      payload: "{ AccessKeyId, Token, … }",
      variant: "response",
      detail: "With IMDSv1 a plain GET is enough. These credentials carry whatever permissions the instance role has.",
    },
    {
      id: "echo",
      from: "app",
      to: "attacker",
      title: "Echo the response back",
      payload: "200 { AccessKeyId … }",
      variant: "response",
      detail: "The preview shows the fetched body, so the credentials land in the attacker's hands.",
    },
    {
      id: "retry",
      from: "attacker",
      to: "app",
      title: "Same request, fixed app",
      payload: "url=http://169.254.169.254/…",
      detail: "Now the app validates every destination before fetching it.",
    },
    {
      id: "check",
      from: "app",
      title: "Resolve and check the address",
      payload: "169.254.169.254 → blocked",
      detail:
        "Allow only https, resolve the host, and refuse private, loopback and link-local addresses. Connect to the IP you checked, and check again after every redirect.",
    },
    {
      id: "refuse",
      from: "app",
      to: "attacker",
      title: "Refuse the request",
      payload: "400 destination not allowed",
      variant: "response",
      detail: "The attacker gets an error, not a proxy into your network.",
    },
    {
      id: "slip",
      from: "app",
      to: "imds",
      title: "If a request slips through anyway",
      payload: "GET without a session token",
      detail: "Defence in depth: suppose a bug skips the check and a plain GET reaches the metadata service.",
    },
    {
      id: "v2",
      from: "imds",
      to: "app",
      title: "IMDSv2 demands a token",
      payload: "401 Unauthorized",
      variant: "response",
      detail:
        "With IMDSv2 required, callers must first get a session token with a PUT request. A simple GET-only SSRF gets nothing.",
    },
  ],
};
