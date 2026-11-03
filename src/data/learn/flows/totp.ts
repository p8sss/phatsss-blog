import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Authentication. */
export const totp: FlowDefinition = {
  id: "totp",
  title: "Enroll an authenticator app, then log in with a code",
  actors: [
    { id: "phone", label: "Phone app", sublabel: "authenticator", kind: "client", col: 0, row: 0 },
    { id: "browser", label: "Browser", sublabel: "login page", kind: "client", col: 1, row: 0 },
    { id: "server", label: "Server", sublabel: "example.com", kind: "server", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "secret",
      from: "server",
      title: "Generate a shared secret",
      payload: "secret = 20 random bytes",
      detail:
        "At enrollment the server creates a random secret for this user. It stores it encrypted, because unlike a password hash it must be readable later.",
    },
    {
      id: "qr",
      from: "server",
      to: "browser",
      title: "Show it as a QR code",
      payload: "otpauth://totp/…?secret=JBSW…",
      variant: "response",
      detail: "The QR code holds a URI with the secret in Base32, plus the issuer and account name. This is the only time the secret is shown.",
    },
    {
      id: "scan",
      from: "browser",
      to: "phone",
      title: "Scan it with the phone",
      payload: "camera reads the QR code",
      detail:
        "No network call happens here. The phone and the server now hold the same secret, and from here on they never need to talk to each other.",
    },
    {
      id: "counter",
      from: "phone",
      title: "Turn the clock into a counter",
      payload: "T = floor(unixTime / 30)",
      detail:
        "Both sides count 30-second steps since 1970. At 12:00:00 UTC on 2 November 2026 that is 59787360 on every correct clock.",
    },
    {
      id: "code",
      from: "phone",
      title: "Compute the code",
      payload: "HMAC-SHA1(secret, T) → 313920",
      detail:
        "The app runs HMAC over the counter with the secret, picks 4 bytes from the result, and keeps the last six decimal digits. A new code appears every 30 seconds.",
    },
    {
      id: "type",
      from: "phone",
      to: "browser",
      title: "The user types the code",
      payload: "313920",
      detail: "The user reads the code off the phone and types it in after their password. The code is useless 30 seconds later.",
    },
    {
      id: "submit",
      from: "browser",
      to: "server",
      title: "Submit the code",
      payload: "POST /login/2fa { code }",
      detail: "Only six digits travel. The secret never does.",
    },
    {
      id: "recompute",
      from: "server",
      title: "Compute the same code",
      payload: "HMAC-SHA1(secret, T) → 313920",
      detail:
        "The server repeats the calculation with its copy of the secret and its own clock. It usually also tries the step before and after, to allow for clock drift and typing time.",
    },
    {
      id: "replay",
      from: "server",
      title: "Reject reuse",
      payload: "T > lastUsedStep ?",
      detail:
        "The server remembers the last step it accepted for this user. The same code must never work twice, even within its 30 seconds.",
    },
    {
      id: "ok",
      from: "server",
      to: "browser",
      title: "Second factor accepted",
      payload: "200 Set-Cookie: sid=…",
      variant: "response",
      detail: "Comparing in constant time and rate limiting attempts matter here: six digits is only a million possibilities.",
    },
  ],
};
