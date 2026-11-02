import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → Networking & Protocols → SSL / TLS. TLS 1.3 full handshake. */
export const tlsHandshake: FlowDefinition = {
  id: "tls-handshake",
  title: "The TLS 1.3 handshake in one round trip",
  actors: [
    { id: "client", label: "Client", sublabel: "browser", kind: "client", col: 0, row: 0 },
    { id: "server", label: "Server", sublabel: "example.com", kind: "server", col: 1, row: 0 },
  ],
  steps: [
    {
      id: "keyshare",
      from: "client",
      title: "Make a key share",
      payload: "ECDHE key pair (X25519)",
      detail:
        "The client creates a fresh key pair just for this connection. It keeps the private half and will send the public half.",
    },
    {
      id: "hello",
      from: "client",
      to: "server",
      title: "ClientHello",
      payload: "ciphers, key_share, SNI",
      detail:
        "It lists the cipher suites it supports, includes its public key share and names the site it wants with SNI.",
    },
    {
      id: "derive",
      from: "server",
      title: "Pick a cipher and derive keys",
      payload: "shared secret via ECDHE",
      detail:
        "The server makes its own key pair. Each side combines its private key with the other's public key and gets the same secret, which an eavesdropper can't compute.",
    },
    {
      id: "serverhello",
      from: "server",
      to: "client",
      title: "ServerHello",
      payload: "ServerHello, key_share",
      variant: "response",
      detail: "The server sends its choice and its public key share. Both sides now hold the handshake keys.",
    },
    {
      id: "cert",
      from: "server",
      to: "client",
      title: "Send the certificate, encrypted",
      payload: "{EncExt, Cert, Verify, Finished}",
      variant: "response",
      detail:
        "From here on everything is encrypted: EncryptedExtensions, Certificate, CertificateVerify and Finished. CertificateVerify signs the whole handshake with the certificate's private key, proving the server owns it.",
    },
    {
      id: "verify",
      from: "client",
      title: "Verify the certificate",
      payload: "chain → trusted root CA",
      detail:
        "The client checks that the name matches, the dates are valid and the chain ends at a root authority in its trust store. Then it checks the signature.",
    },
    {
      id: "finished",
      from: "client",
      to: "server",
      title: "Finish, and send the request",
      payload: "{Finished} + {GET /}",
      detail:
        "The client can send its first request in the same flight. A full TLS 1.3 handshake costs one round trip, against two for TLS 1.2.",
    },
    {
      id: "data",
      from: "server",
      to: "client",
      title: "Encrypted application data",
      payload: "{200 OK}",
      variant: "response",
      detail:
        "Both sides discard their ephemeral private keys once the shared secret is derived. This is forward secrecy: stealing the server's certificate key later can't decrypt traffic recorded today.",
    },
  ],
};
