import type { FlowDefinition } from "../../../lib/flow/types";

/** Backend roadmap → Learn about APIs → Authentication → JWT. */
export const jwtAuthentication: FlowDefinition = {
  id: "jwt-authentication",
  title: "JWT authentication, from login to a protected request",
  actors: [
    { id: "client", label: "Client", sublabel: "Browser or app", kind: "client", col: 0, row: 0 },
    { id: "api", label: "API server", sublabel: "Express / Nest", kind: "server", col: 1, row: 0 },
    { id: "db", label: "Database", sublabel: "users table", kind: "database", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "login",
      from: "client",
      to: "api",
      title: "Send credentials",
      payload: "POST /login {email, password}",
      detail:
        "The client sends the email and password over HTTPS. This is the only request in the whole flow that carries the password.",
    },
    {
      id: "lookup",
      from: "api",
      to: "db",
      title: "Look up the user",
      payload: "SELECT … WHERE email = $1",
      detail:
        "The server finds the user by email with a parameterised query. It never stores or compares plain-text passwords.",
    },
    {
      id: "user",
      from: "db",
      to: "api",
      title: "Return the stored hash",
      payload: "{ id, passwordHash }",
      variant: "response",
      detail: "The database returns the user id and the password hash that was saved at sign-up.",
    },
    {
      id: "verify",
      from: "api",
      title: "Verify the password",
      payload: "bcrypt.compare(pw, hash)",
      detail:
        "Hashing the submitted password with the same salt and comparing the result proves identity without ever decrypting anything.",
    },
    {
      id: "sign",
      from: "api",
      title: "Sign the token",
      payload: "sign({ sub, exp }, SECRET)",
      detail:
        "The server writes claims such as the user id and an expiry time into a JWT and signs it with a secret only it knows. The payload is encoded, not encrypted, so anyone can read it. Never put secrets in it.",
    },
    {
      id: "issue",
      from: "api",
      to: "client",
      title: "Return the token",
      payload: "200 { accessToken }",
      variant: "response",
      detail:
        "The client keeps the token. An httpOnly cookie hides it from page scripts. Memory or localStorage also work but are easier to steal through XSS.",
    },
    {
      id: "call",
      from: "client",
      to: "api",
      title: "Call a protected route",
      payload: "Authorization: Bearer eyJ…",
      detail: "Every later request carries the token instead of a session id.",
    },
    {
      id: "check",
      from: "api",
      title: "Verify signature and expiry",
      payload: "verify(token, SECRET)",
      detail:
        "The server recomputes the signature and checks the exp claim. There is no database or session-store lookup. That is what makes JWT stateless and easy to scale across many servers.",
    },
    {
      id: "respond",
      from: "api",
      to: "client",
      title: "Respond with data",
      payload: "200 [ …orders ]",
      variant: "response",
      detail:
        "The handler reads the user id from the verified token and returns only that user's data. A bad or expired token gets 401 instead.",
    },
  ],
};
