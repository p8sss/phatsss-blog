import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Authentication. */
export const passwordHashing: FlowDefinition = {
  id: "password-hashing",
  title: "A password at sign-up, then at login",
  actors: [
    { id: "browser", label: "Browser", sublabel: "sign-up form", kind: "client", col: 0, row: 0 },
    { id: "api", label: "API server", sublabel: "your backend", kind: "server", col: 1, row: 0 },
    { id: "db", label: "Users table", sublabel: "stores hashes", kind: "database", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "signup",
      from: "browser",
      to: "api",
      title: "Send the new password",
      payload: "POST /signup { password }",
      detail:
        "The password travels in plain text inside a TLS connection. TLS protects it on the wire. Everything after this is about protecting it at rest.",
    },
    {
      id: "policy",
      from: "api",
      title: "Check the password",
      payload: "length ok · not in breach list",
      detail:
        "Check length and compare against a list of breached and common passwords. Current NIST guidance drops composition rules like 'one symbol'.",
    },
    {
      id: "hash",
      from: "api",
      title: "Salt and hash it",
      payload: "bcrypt.hash(pw, 12)",
      detail:
        "bcrypt picks a random 16-byte salt and runs 2^12 rounds of its key setup. The cost is deliberate: a slow hash makes every guess slow for an attacker too.",
    },
    {
      id: "insert",
      from: "api",
      to: "db",
      title: "Store only the hash",
      payload: "INSERT … '$2b$12$R9h…'",
      detail:
        "The 60-character string holds the algorithm, the cost, the salt and the hash together. The password itself is never written anywhere.",
    },
    {
      id: "stored",
      from: "db",
      to: "api",
      title: "Row created",
      payload: "INSERT 0 1",
      variant: "response",
      detail: "If this table leaks, the attacker gets salted, slow hashes, not passwords.",
    },
    {
      id: "created",
      from: "api",
      to: "browser",
      title: "Account created",
      payload: "201 Created",
      variant: "response",
      detail: "The server keeps no copy of the plain password. Only the hash outlives the request.",
    },
    {
      id: "login",
      from: "browser",
      to: "api",
      title: "Log in later",
      payload: "POST /login { email, password }",
      detail: "The user types the password again. The server has nothing to decrypt, so it must hash again and compare.",
    },
    {
      id: "select",
      from: "api",
      to: "db",
      title: "Load the stored hash",
      payload: "SELECT hash WHERE email = $1",
      detail: "Look up the user by email. The query uses a parameter, never string concatenation.",
    },
    {
      id: "row",
      from: "db",
      to: "api",
      title: "Return the hash string",
      payload: "$2b$12$R9h/cIPz0gi.URNNX…",
      variant: "response",
      detail: "The salt and cost come back inside the string, so the server needs no separate column for them.",
    },
    {
      id: "compare",
      from: "api",
      title: "Hash the attempt and compare",
      payload: "bcrypt.compare(pw, hash)",
      detail:
        "bcrypt reads the cost and salt from the stored string, hashes the attempt the same way, and compares the results. Same password, same salt, same hash.",
    },
    {
      id: "result",
      from: "api",
      to: "browser",
      title: "Start a session, or refuse",
      payload: "200 Set-Cookie: sid=…",
      variant: "response",
      detail:
        "On a match the server starts a session. On a miss it says 'invalid email or password' and never which part was wrong.",
    },
  ],
};
