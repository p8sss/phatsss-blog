import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Authentication. */
export const passkeyWebauthn: FlowDefinition = {
  id: "passkey-webauthn",
  title: "Create a passkey, then sign in with it",
  actors: [
    { id: "authenticator", label: "Passkey", sublabel: "phone or laptop", kind: "service", col: 0, row: 0 },
    { id: "browser", label: "Browser", sublabel: "WebAuthn API", kind: "client", col: 1, row: 0 },
    { id: "server", label: "Server", sublabel: "example.com", kind: "server", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "reg-options",
      from: "server",
      to: "browser",
      title: "Send registration options",
      payload: "{ challenge, rp: example.com }",
      variant: "response",
      detail:
        "A signed-in user clicks 'Create a passkey'. The server answers with a fresh random challenge, its RP ID and a user id.",
    },
    {
      id: "create",
      from: "browser",
      to: "authenticator",
      title: "Ask for a new credential",
      payload: "credentials.create()",
      detail:
        "The browser checks that the RP ID is the page's own domain or a parent domain of it. Then it passes the request to the authenticator: a phone, a laptop or a security key.",
    },
    {
      id: "keypair",
      from: "authenticator",
      title: "Verify the user, make a key pair",
      payload: "Face ID or PIN → new key pair",
      detail:
        "The user unlocks the device. It creates a key pair that belongs to example.com only. The private key stays on the device, or in an end-to-end encrypted keychain that syncs it.",
    },
    {
      id: "pubkey",
      from: "authenticator",
      to: "browser",
      title: "Return the public key",
      payload: "credential id + public key",
      variant: "response",
      detail: "Only the public half comes back, with an id for the credential.",
    },
    {
      id: "register",
      from: "browser",
      to: "server",
      title: "Register the passkey",
      payload: "POST /passkeys/register",
      detail:
        "The server checks the challenge and the origin, then stores the credential id and public key against the user. A leaked public key lets nobody sign in.",
    },
    {
      id: "login-options",
      from: "server",
      to: "browser",
      title: "Later: send a login challenge",
      payload: "{ challenge: \"q8Zt…\", rpId }",
      variant: "response",
      detail: "The login page asks for a new challenge. A fresh one per attempt means an old signature can never be replayed.",
    },
    {
      id: "get",
      from: "browser",
      to: "authenticator",
      title: "Ask for a signature",
      payload: "credentials.get()",
      detail:
        "The browser records the real origin and the challenge in clientDataJSON. The page cannot fake this, which is what defeats phishing sites.",
    },
    {
      id: "sign",
      from: "authenticator",
      title: "Verify the user and sign",
      payload: "sign(authData + hash(client))",
      detail:
        "After a fingerprint, face or PIN, the private key signs the authenticator data together with a SHA-256 hash of clientDataJSON.",
    },
    {
      id: "assertion",
      from: "authenticator",
      to: "browser",
      title: "Return the assertion",
      payload: "signature, authenticatorData",
      variant: "response",
      detail: "The authenticator data carries a hash of the RP ID and flags that say the user was present and verified.",
    },
    {
      id: "submit",
      from: "browser",
      to: "server",
      title: "Send the assertion",
      payload: "POST /passkeys/login",
      detail: "No password or shared secret crosses the network. There is nothing reusable to steal in transit.",
    },
    {
      id: "verify",
      from: "server",
      title: "Verify the signature",
      payload: "challenge · origin · rpIdHash ✓",
      detail:
        "The server checks the challenge, the origin, the RP ID hash and the flags. Then it verifies the signature with the stored public key.",
    },
    {
      id: "session",
      from: "server",
      to: "browser",
      title: "Signed in",
      payload: "200 Set-Cookie: sid=…",
      variant: "response",
      detail: "A valid signature proves the user holds the private key for this site. The server starts a normal session.",
    },
  ],
};
