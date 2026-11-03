import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Threat Modeling. */
export const strideLogin: FlowDefinition = {
  id: "stride-login",
  title: "Walking a login request through STRIDE",
  actors: [
    { id: "browser", label: "Browser", sublabel: "real user", kind: "client", col: 0, row: 0 },
    { id: "attacker", label: "Attacker", sublabel: "botnet", kind: "attacker", col: 0, row: 1 },
    { id: "api", label: "Login API", sublabel: "POST /login", kind: "server", col: 1, row: 0 },
    { id: "db", label: "User DB", sublabel: "password hashes", kind: "database", col: 2, row: 0 },
    { id: "audit", label: "Audit log", sublabel: "append-only", kind: "service", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "submit",
      from: "browser",
      to: "api",
      title: "Cross the trust boundary",
      payload: "POST /login {email, password}",
      detail:
        "Tampering and information disclosure in transit. TLS with HSTS keeps the password from being read or changed on the way.",
    },
    {
      id: "query",
      from: "api",
      to: "db",
      title: "Look up the user",
      payload: "SELECT … WHERE email = $1",
      detail: "Tampering with the query. A parameterized query keeps the email as data, so SQL injection cannot change the statement.",
    },
    {
      id: "row",
      from: "db",
      to: "api",
      title: "Return the stored hash",
      payload: "{ id: 42, hash: $argon2id… }",
      variant: "response",
      detail:
        "Information disclosure if the table leaks. Store only a slow, salted hash such as Argon2id or bcrypt, never the password.",
    },
    {
      id: "verify",
      from: "api",
      title: "Verify in constant time",
      payload: "verify(hash, password)",
      detail:
        "Information disclosure through timing. When no user matches, hash against a dummy value anyway, so response time does not reveal which emails exist.",
    },
    {
      id: "log",
      from: "api",
      to: "audit",
      title: "Record the attempt",
      payload: "login.ok user=42 ip=192.0.2.7",
      detail:
        "Repudiation. Log every success and failure with time, IP and user agent, never the password. Keep the log where app admins cannot edit it.",
    },
    {
      id: "session",
      from: "api",
      to: "browser",
      title: "Issue a fresh session",
      payload: "Set-Cookie: sid=new; HttpOnly",
      variant: "response",
      detail:
        "Spoofing through session fixation. Always create a new session id at login, and mark the cookie HttpOnly, Secure and SameSite.",
    },
    {
      id: "stuffing",
      from: "attacker",
      to: "api",
      title: "Credential stuffing",
      payload: "POST /login × 50,000 pairs",
      detail:
        "Spoofing a real user with passwords leaked elsewhere. Rate limit by IP and by account, reject known breached passwords, and offer MFA or passkeys.",
    },
    {
      id: "generic-error",
      from: "api",
      to: "attacker",
      title: "Answer the same way every time",
      payload: "401 Invalid email or password",
      variant: "response",
      detail:
        "Information disclosure through error messages. Return the same message and status for an unknown email and a wrong password.",
    },
    {
      id: "lockout",
      from: "attacker",
      to: "api",
      title: "Lock out the victim",
      payload: "POST /login victim@… × 10",
      detail:
        "Denial of service. A hard lockout after a few failures lets anyone lock any account. Prefer growing delays and challenges, and rate limit before running the expensive hash.",
    },
    {
      id: "forge-role",
      from: "attacker",
      to: "api",
      title: "Claim to be an admin",
      payload: "Cookie: role=admin",
      detail:
        "Elevation of privilege. Roles must come from the server-side session or a signed token, and be checked on every request.",
    },
    {
      id: "tickets",
      from: "api",
      title: "Turn threats into tickets",
      payload: "STRIDE → backlog tickets",
      detail:
        "Each threat gets an owner and a mitigation, or an explicit decision to accept the risk. Revisit the model when the login flow changes.",
    },
  ],
};
