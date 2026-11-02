import type { FlowDefinition } from "../../../lib/flow/types";

/** Frontend roadmap → Auth Strategies. OAuth 2.0 authorization code flow with PKCE. */
export const oauthPkce: FlowDefinition = {
  id: "oauth-pkce",
  title: "OAuth 2.0 authorization code flow with PKCE",
  actors: [
    { id: "auth", label: "Auth server", sublabel: "Google, Auth0", kind: "external", col: 0, row: 0 },
    { id: "app", label: "Your app", sublabel: "SPA in browser", kind: "client", col: 1, row: 0 },
    { id: "api", label: "Resource API", sublabel: "your backend", kind: "server", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "pair",
      from: "app",
      title: "Make a PKCE pair",
      payload: "verifier → SHA-256 → challenge",
      detail:
        "The app creates a random code verifier and keeps it in sessionStorage, because the redirect will unload the page. The code challenge is the Base64URL-encoded SHA-256 hash of it.",
    },
    {
      id: "authorize",
      from: "app",
      to: "auth",
      title: "Redirect to sign in",
      payload: "/authorize?code_challenge=…",
      detail:
        "The redirect carries the client id, the redirect URI, the scopes, a random state value and the challenge. It never carries the verifier.",
    },
    {
      id: "consent",
      from: "auth",
      title: "User signs in and consents",
      payload: "login + consent screen",
      detail: "The password is typed into the provider's page, never into your app.",
    },
    {
      id: "code",
      from: "auth",
      to: "app",
      title: "Redirect back with a code",
      payload: "/callback?code=…&state=…",
      variant: "response",
      detail:
        "The app checks that state matches the value it sent, which blocks cross-site request forgery. The code is short-lived and works once.",
    },
    {
      id: "exchange",
      from: "app",
      to: "auth",
      title: "Exchange the code",
      payload: "POST /token + code_verifier",
      detail:
        "A browser app can't keep a client secret. The verifier proves that whoever redeems the code is the app that started the flow.",
    },
    {
      id: "check",
      from: "auth",
      title: "Check the verifier",
      payload: "SHA-256(verifier) == challenge",
      detail: "An attacker who intercepted the code doesn't have the verifier, so the stolen code is useless.",
    },
    {
      id: "tokens",
      from: "auth",
      to: "app",
      title: "Issue the tokens",
      payload: "{ access_token, id_token }",
      variant: "response",
      detail:
        "The ID token, from OpenID Connect, says who the user is. The access token is what the API accepts. Keep both out of localStorage where possible.",
    },
    {
      id: "call",
      from: "app",
      to: "api",
      title: "Call the API",
      payload: "Authorization: Bearer …",
      detail: "The app sends the access token with each request.",
    },
    {
      id: "validate",
      from: "api",
      title: "Validate the token",
      payload: "check sig, iss, aud, exp",
      detail:
        "The API verifies the signature with the provider's public keys and checks the issuer, the audience and the expiry.",
    },
    {
      id: "data",
      from: "api",
      to: "app",
      title: "Return the data",
      payload: "200 { … }",
      variant: "response",
      detail: "An expired or wrong-audience token gets a 401 instead.",
    },
  ],
};
