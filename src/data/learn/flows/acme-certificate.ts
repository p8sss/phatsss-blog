import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Encryption. */
export const acmeCertificate: FlowDefinition = {
  id: "acme-certificate",
  title: "An HTTP-01 challenge, issuance and renewal",
  actors: [
    { id: "client", label: "ACME client", sublabel: "certbot", kind: "client", col: 0, row: 0 },
    { id: "ca", label: "ACME CA", sublabel: "Let's Encrypt", kind: "external", col: 1, row: 0 },
    { id: "ct", label: "CT logs", sublabel: "public, append", kind: "database", col: 2, row: 0 },
    { id: "web", label: "Web server", sublabel: "example.com:80", kind: "server", col: 0, row: 1 },
  ],
  steps: [
    {
      id: "account-key",
      from: "client",
      title: "Create an account key pair",
      payload: "RSA 2048 account key",
      detail:
        "On first run the client makes a key pair that identifies your ACME account. It is separate from the certificate's key.",
    },
    {
      id: "new-account",
      from: "client",
      to: "ca",
      title: "Register the account",
      payload: "POST /acme/new-acct (JWS)",
      detail:
        "Every ACME request is a JWS signed with the account key. Each carries a fresh nonce from the server, so a captured request cannot be replayed.",
    },
    {
      id: "new-order",
      from: "client",
      to: "ca",
      title: "Order a certificate",
      payload: "newOrder: example.com",
      detail: "The order lists the names the certificate should cover.",
    },
    {
      id: "challenge",
      from: "ca",
      to: "client",
      title: "Receive the challenges",
      payload: "http-01 token: Xy9…",
      variant: "response",
      detail:
        "Each name gets an authorization with challenges to choose from: http-01, dns-01 or tls-alpn-01. Wildcard names require dns-01.",
    },
    {
      id: "place-file",
      from: "client",
      to: "web",
      title: "Publish the key authorization",
      payload: "/.well-known/acme-challenge/Xy9…",
      detail:
        "The file holds the token joined to a thumbprint of the account key. That ties proof of the domain to this one account.",
    },
    {
      id: "ready",
      from: "client",
      to: "ca",
      title: "Say the challenge is ready",
      payload: "POST challenge URL {}",
      detail: "Now the CA can check. Validation only starts when the client asks for it.",
    },
    {
      id: "fetch",
      from: "ca",
      to: "web",
      title: "Fetch the file over port 80",
      payload: "GET http://example.com/.well-…",
      detail:
        "The CA fetches the file from several network vantage points. An attacker would have to hijack the route from all of them at once. It also checks the domain's CAA records.",
    },
    {
      id: "proof",
      from: "web",
      to: "ca",
      title: "Serve the proof",
      payload: "Xy9….thumbprint",
      variant: "response",
      detail: "The content matches, so the authorization becomes valid. Control of the domain is proven.",
    },
    {
      id: "csr",
      from: "client",
      title: "Make the certificate key and CSR",
      payload: "CSR: CN=example.com",
      detail:
        "The client generates the certificate's private key. It never leaves your server; only the CSR with the public key is sent.",
    },
    {
      id: "finalize",
      from: "client",
      to: "ca",
      title: "Finalize the order",
      payload: "POST finalize { csr }",
      detail: "The CA checks that the CSR names exactly the names that were validated.",
    },
    {
      id: "log",
      from: "ca",
      to: "ct",
      title: "Log a precertificate",
      payload: "precert for example.com",
      detail:
        "Every publicly trusted certificate is logged to Certificate Transparency. You can monitor these logs for certificates you did not request.",
    },
    {
      id: "scts",
      from: "ct",
      to: "ca",
      title: "Return signed timestamps",
      payload: "SCTs",
      variant: "response",
      detail: "The CA embeds these receipts in the final certificate. Major browsers require them.",
    },
    {
      id: "issue",
      from: "ca",
      to: "client",
      title: "Download the certificate",
      payload: "fullchain.pem",
      variant: "response",
      detail:
        "The client installs the certificate chain and reloads the web server. Let's Encrypt certificates are short-lived on purpose.",
    },
    {
      id: "renew",
      from: "client",
      title: "Renew on a timer",
      payload: "certbot renew (twice a day)",
      detail:
        "The client checks often and renews well before expiry, ideally inside the window the CA suggests through ARI. Renewal is a new order through the same steps.",
    },
  ],
};
