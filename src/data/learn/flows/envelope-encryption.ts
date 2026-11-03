import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Encryption. */
export const envelopeEncryption: FlowDefinition = {
  id: "envelope-encryption",
  title: "Envelope encryption: wrap, store, unwrap",
  actors: [
    { id: "app", label: "App server", sublabel: "your service", kind: "server", col: 1, row: 0 },
    { id: "kms", label: "KMS", sublabel: "holds root key", kind: "service", col: 2, row: 0 },
    { id: "db", label: "Database", sublabel: "ciphertext only", kind: "database", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "generate",
      from: "app",
      to: "kms",
      title: "Ask for a fresh data key",
      payload: "GenerateDataKey AES_256",
      detail:
        "The app names a KMS key and an encryption context, such as the tenant id. The KMS key itself never leaves the KMS hardware unencrypted.",
    },
    {
      id: "authorise",
      from: "kms",
      title: "Check who is asking",
      payload: "kms:GenerateDataKey allowed?",
      detail:
        "The KMS checks the key policy and the caller's permissions. Every call is logged, so key use leaves an audit trail.",
    },
    {
      id: "two-copies",
      from: "kms",
      to: "app",
      title: "Return two copies of the key",
      payload: "Plaintext + CiphertextBlob",
      variant: "response",
      detail:
        "One copy is plaintext, for immediate use. The other is the same key encrypted under the KMS key: the wrapped key.",
    },
    {
      id: "encrypt",
      from: "app",
      title: "Encrypt the data locally",
      payload: "AES-256-GCM(key, iv, data)",
      detail:
        "Bulk encryption runs in the app, so a large file never travels to the KMS. GCM also produces a tag that detects tampering.",
    },
    {
      id: "discard",
      from: "app",
      title: "Throw away the plaintext key",
      payload: "key.fill(0)",
      detail: "Only the wrapped copy is kept. A database leak alone is now useless without KMS access.",
    },
    {
      id: "store",
      from: "app",
      to: "db",
      title: "Store the envelope",
      payload: "{ wrappedKey, iv, tag, data }",
      detail:
        "The wrapped key sits next to the ciphertext it protects. Wrapped keys are not secret, so this is safe.",
    },
    {
      id: "read",
      from: "app",
      to: "db",
      title: "Later, read the record",
      payload: "SELECT envelope WHERE id = 7",
      detail: "Decryption starts the same way for any reader: fetch the envelope.",
    },
    {
      id: "row",
      from: "db",
      to: "app",
      title: "Get the envelope back",
      payload: "{ wrappedKey, iv, tag, data }",
      variant: "response",
      detail: "The app now holds ciphertext and a wrapped key, but cannot read either yet.",
    },
    {
      id: "decrypt",
      from: "app",
      to: "kms",
      title: "Ask the KMS to unwrap the key",
      payload: "Decrypt(wrappedKey, context)",
      detail:
        "Only the small wrapped key goes to the KMS. The encryption context must match exactly, or the call fails.",
    },
    {
      id: "unwrapped",
      from: "kms",
      to: "app",
      title: "Receive the plaintext data key",
      payload: "Plaintext data key",
      variant: "response",
      detail:
        "The KMS checks permissions again. Revoking an app's kms:Decrypt permission cuts off its access to every record at once.",
    },
    {
      id: "open",
      from: "app",
      title: "Decrypt and discard the key",
      payload: "AES-256-GCM decrypt + verify tag",
      detail:
        "If the tag does not match, the data was altered and decryption fails. The plaintext key is discarded again afterwards.",
    },
  ],
};
