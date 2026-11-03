import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → OWASP Top 10. */
export const csrfSamesite: FlowDefinition = {
  id: "csrf-samesite",
  title: "A forged request, then SameSite and a token",
  actors: [
    { id: "browser", label: "Browser", sublabel: "signed in", kind: "client", col: 0, row: 0 },
    { id: "bank", label: "bank.example", sublabel: "your app", kind: "server", col: 1, row: 0 },
    { id: "evil", label: "evil.example", sublabel: "attacker's page", kind: "attacker", col: 0, row: 1 },
  ],
  steps: [
    {
      id: "login",
      from: "browser",
      to: "bank",
      title: "Sign in",
      payload: "POST /login",
      detail: "A normal login on the real site.",
    },
    {
      id: "cookie",
      from: "bank",
      to: "browser",
      title: "Set a session cookie",
      payload: "sid=…; SameSite=None; Secure",
      variant: "response",
      detail:
        "SameSite=None tells the browser to send this cookie on cross-site requests too. Browsers require Secure with it. Some apps set it for embeds or single sign-on.",
    },
    {
      id: "visit",
      from: "browser",
      to: "evil",
      title: "Visit another site",
      payload: "GET evil.example",
      detail: "The user opens a link in another tab. They are still signed in to the bank.",
    },
    {
      id: "form",
      from: "evil",
      to: "browser",
      title: "Serve a hidden form",
      payload: "<form action=…/transfer>",
      variant: "response",
      detail: "The page holds a form that targets the bank, with the attacker's account already filled in.",
    },
    {
      id: "submit",
      from: "browser",
      title: "Submit it automatically",
      payload: "form.submit()",
      detail: "A line of script submits the form the moment the page loads. The user sees nothing.",
    },
    {
      id: "forged",
      from: "browser",
      to: "bank",
      title: "Send it with the cookie",
      payload: "POST /transfer · Cookie: sid",
      detail:
        "The browser attaches the bank's cookie because the request goes to the bank, no matter which site started it.",
    },
    {
      id: "trust",
      from: "bank",
      title: "Trust the cookie, move the money",
      payload: "transfer 500 → attacker",
      detail: "To the bank this looks exactly like the user clicking the button themselves.",
    },
    {
      id: "lax",
      from: "bank",
      to: "browser",
      title: "Fix: reissue the cookie as Lax",
      payload: "sid=…; SameSite=Lax; Secure",
      variant: "response",
      detail:
        "With Lax the browser leaves the cookie off cross-site POSTs. It still sends it on top-level links, so GET requests must never change state.",
    },
    {
      id: "again",
      from: "browser",
      to: "bank",
      title: "The same forged POST",
      payload: "POST /transfer · no cookie",
      detail: "The hidden form fires again, but this time the session cookie stays behind.",
    },
    {
      id: "reject",
      from: "bank",
      title: "Check origin and token, then reject",
      payload: "Origin, CSRF token → 403",
      detail:
        "Belt and braces: the server also checks the Origin or Sec-Fetch-Site header and a CSRF token. A forged request fails every check.",
    },
  ],
};
