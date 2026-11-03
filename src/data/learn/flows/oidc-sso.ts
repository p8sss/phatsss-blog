import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Identity Basics. */
export const oidcSso: FlowDefinition = {
  id: "oidc-sso",
  title: "One IdP session, two apps signed in",
  actors: [
    { id: "app-a", label: "App A", sublabel: "mail.example", kind: "server", col: 0, row: 0 },
    { id: "browser", label: "Browser", sublabel: "one user", kind: "client", col: 1, row: 0 },
    { id: "app-b", label: "App B", sublabel: "docs.example", kind: "server", col: 2, row: 0 },
    { id: "idp", label: "IdP", sublabel: "OpenID Provider", kind: "service", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "a-redirect",
      from: "app-a",
      to: "browser",
      title: "App A sends the user to the IdP",
      payload: "302 /authorize?client_id=a…",
      detail:
        "The user has no App A session yet. App A redirects with scope=openid, a random state and nonce, and a PKCE challenge.",
    },
    {
      id: "a-authorize",
      from: "browser",
      to: "idp",
      title: "Open the IdP's login page",
      payload: "GET /authorize?scope=openid",
      detail: "The browser carries the request. The IdP has no session for this user yet.",
    },
    {
      id: "login",
      from: "idp",
      title: "User signs in once",
      payload: "sign-in form + MFA",
      detail:
        "The IdP authenticates the user and sets its own session cookie on the IdP's domain. That cookie is what makes single sign-on work.",
    },
    {
      id: "a-code",
      from: "idp",
      to: "browser",
      title: "Redirect back with a code",
      payload: "302 mail.example/cb?code=…",
      variant: "response",
      detail: "The code is short-lived and single-use. The state value App A sent comes back with it.",
    },
    {
      id: "a-callback",
      from: "browser",
      to: "app-a",
      title: "Deliver the code to App A",
      payload: "GET /cb?code=…&state=…",
      detail: "App A checks that state matches what it sent. Tokens never travel through the browser URL. Only the code does.",
    },
    {
      id: "a-token",
      from: "app-a",
      to: "idp",
      title: "Exchange the code",
      payload: "POST /token code+verifier",
      detail:
        "A back-channel call from App A's server, with its client credentials and the PKCE verifier.",
    },
    {
      id: "a-id-token",
      from: "idp",
      to: "app-a",
      title: "Receive the ID token",
      payload: "id_token (JWT), access_token",
      variant: "response",
      detail:
        "The ID token says who the user is, for this app only: its aud claim is App A's client id.",
    },
    {
      id: "a-verify",
      from: "app-a",
      title: "Verify and start a local session",
      payload: "check iss, aud, exp, nonce",
      detail:
        "App A checks the signature against the IdP's published keys, then sets its own session cookie. Each app keeps its own session.",
    },
    {
      id: "b-redirect",
      from: "app-b",
      to: "browser",
      title: "Later, App B does the same",
      payload: "302 /authorize?client_id=b…",
      detail: "App B knows nothing about App A's session. It starts its own OIDC flow.",
    },
    {
      id: "b-authorize",
      from: "browser",
      to: "idp",
      title: "The IdP cookie goes along",
      payload: "GET /authorize + IdP cookie",
      detail: "The browser sends the IdP's session cookie with the request, because it is the IdP's domain.",
    },
    {
      id: "b-code",
      from: "idp",
      to: "browser",
      title: "No login prompt this time",
      payload: "302 docs.example/cb?code=…",
      variant: "response",
      detail:
        "The IdP already has a valid session, so it issues a code straight away. To the user, App B just opened.",
    },
    {
      id: "b-callback",
      from: "browser",
      to: "app-b",
      title: "Deliver the code to App B",
      payload: "GET /cb?code=…&state=…",
      detail: "Same callback pattern as App A, with App B's own state value.",
    },
    {
      id: "b-token",
      from: "app-b",
      to: "idp",
      title: "Exchange it for App B's tokens",
      payload: "POST /token code+verifier",
      detail: "App B gets its own ID token, audience App B, and creates its own session.",
    },
    {
      id: "b-id-token",
      from: "idp",
      to: "app-b",
      title: "Signed in to both apps",
      payload: "id_token (aud: b)",
      variant: "response",
      detail:
        "One login, two sessions. Logging out of one app does not end the others unless the IdP sends logout notices.",
    },
  ],
};
