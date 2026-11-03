import type { Comparison } from "../../../lib/compare/types";

/** Security roadmap → Authentication. */
export const sessionsJwtOpaque: Comparison = {
  id: "sessions-jwt-opaque",
  title: "Sessions vs JWT vs opaque tokens",
  options: [
    {
      id: "session",
      name: "Server session",
      summary: "A random id in a cookie points at state the server keeps.",
    },
    {
      id: "jwt",
      name: "JWT",
      summary: "A signed token that carries its own claims, checked without a lookup.",
    },
    {
      id: "opaque",
      name: "Opaque token",
      summary: "A random bearer token for APIs, resolved by its issuer on use.",
    },
  ],
  rows: [
    {
      criterion: "Where state lives",
      cells: {
        session: "In a server-side store such as Redis or the database.",
        jwt: "Inside the token. The server keeps nothing per user.",
        opaque: "With the issuer, usually an authorization server.",
      },
    },
    {
      criterion: "What the client holds",
      cells: {
        session: "A random id with no meaning, usually in an HttpOnly cookie.",
        jwt: "A Base64URL header, claims and signature. Anyone can read the claims.",
        opaque: "A random string with no meaning to anyone but the issuer.",
      },
    },
    {
      criterion: "Check on each request",
      cells: {
        session: "Look up the id in the session store.",
        jwt: "Verify the signature and the exp, aud and iss claims locally.",
        opaque: "Look it up, or ask the issuer through token introspection, RFC 7662.",
      },
    },
    {
      criterion: "Revoke one user now",
      cells: {
        session: "Delete the session. The next request fails.",
        jwt: "Hard. It stays valid until exp unless every verifier checks a denylist.",
        opaque: "Revoke it at the issuer. It fails on the next lookup or once a cached result expires.",
      },
    },
    {
      criterion: "Size on the wire",
      cells: {
        session: "A short id.",
        jwt: "Often hundreds of bytes, growing with every claim.",
        opaque: "A short string.",
      },
    },
    {
      criterion: "Across many services",
      cells: {
        session: "Every service needs the shared store, or a gateway that resolves the session.",
        jwt: "Any service with the issuer's public key can verify it on its own.",
        opaque: "Every service calls the issuer, or a gateway swaps it for an internal token.",
      },
    },
    {
      criterion: "If the store or issuer is down",
      cells: {
        session: "Nobody is logged in.",
        jwt: "Existing tokens keep working until they expire.",
        opaque: "New checks fail, apart from cached results.",
      },
    },
    {
      criterion: "Main risks",
      cells: {
        session: "CSRF, because the browser sends cookies by itself. Issue a new id at login to stop session fixation.",
        jwt: "Weak algorithm checks, long expiry, secrets placed in readable claims.",
        opaque: "Like any bearer token, whoever steals it can use it until it is revoked.",
      },
    },
  ],
  verdicts: [
    {
      option: "session",
      pickWhen: [
        "A browser talks to your own backend on the same site.",
        "You need logout and forced sign-out to take effect at once.",
        "You already run a fast store like Redis or a database the app can reach.",
      ],
    },
    {
      option: "jwt",
      pickWhen: [
        "Many services must verify callers without calling a central server.",
        "Tokens can be short-lived, with a revocable refresh token behind them.",
        "Your authorization server already issues JWT access tokens, as in RFC 9068.",
      ],
    },
    {
      option: "opaque",
      pickWhen: [
        "Third parties hold your access tokens and must not read their contents.",
        "Revocation must be quick, but the API is not a browser-cookie app.",
        "A gateway can introspect once and cache the answer for the services behind it.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    {
      label: "OWASP Session Management Cheat Sheet",
      href: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
    },
    { label: "RFC 7519: JSON Web Token", href: "https://www.rfc-editor.org/rfc/rfc7519" },
    { label: "RFC 7662: OAuth 2.0 Token Introspection", href: "https://www.rfc-editor.org/rfc/rfc7662" },
    {
      label: "RFC 8725: JWT Best Current Practices",
      href: "https://www.rfc-editor.org/rfc/rfc8725",
    },
  ],
};
