import type { Comparison } from "../../../lib/compare/types";

/** Security roadmap → Encryption. */
export const cryptoPrimitives: Comparison = {
  id: "crypto-primitives",
  title: "Symmetric vs asymmetric vs hashing",
  options: [
    {
      id: "symmetric",
      name: "Symmetric encryption",
      summary: "One shared secret key both encrypts and decrypts, as in AES-GCM.",
    },
    {
      id: "asymmetric",
      name: "Asymmetric cryptography",
      summary: "A public and private key pair for key exchange and signatures, as in X25519 and Ed25519.",
    },
    {
      id: "hashing",
      name: "Hashing",
      summary: "A one-way function that turns any input into a fixed-size digest, as in SHA-256.",
    },
  ],
  rows: [
    {
      criterion: "Keys",
      cells: {
        symmetric: "One secret key that every party must hold.",
        asymmetric: "A key pair. The public key can be shared with anyone; the private key never leaves its owner.",
        hashing: "No key. HMAC adds a secret key when you need to prove who made the digest.",
      },
    },
    {
      criterion: "Can you get the input back?",
      cells: {
        symmetric: "Yes, with the key.",
        asymmetric: "Yes for encryption, with the private key. Signatures do not hide the message at all.",
        hashing: "No. A hash is one-way by design.",
      },
    },
    {
      criterion: "Problem it solves",
      cells: {
        symmetric: "Confidentiality of bulk data. Authenticated modes also detect tampering.",
        asymmetric: "Agreeing on a key with a stranger, and proving who signed something.",
        hashing: "Integrity: did these bytes change? Also content addressing and deduplication.",
      },
    },
    {
      criterion: "Speed",
      cells: {
        symmetric: "Very fast. Modern CPUs have AES instructions.",
        asymmetric: "Much slower, so it protects small things such as keys and digests.",
        hashing: "Very fast, which is exactly why plain hashes are wrong for passwords.",
      },
    },
    {
      criterion: "Algorithms to use",
      cells: {
        symmetric: "AES-256-GCM or ChaCha20-Poly1305.",
        asymmetric: "X25519 or ECDH P-256 for key exchange; Ed25519 or ECDSA P-256 for signatures; RSA of 2048 bits or more where needed.",
        hashing: "SHA-256, SHA-384 or SHA-3. For passwords, a slow hash: Argon2id, scrypt or bcrypt.",
      },
    },
    {
      criterion: "Avoid",
      cells: {
        symmetric: "ECB mode, unauthenticated CBC, and ever reusing a nonce with the same GCM key.",
        asymmetric: "RSA with PKCS#1 v1.5 encryption padding, and encrypting large data directly.",
        hashing: "MD5 and SHA-1 for anything security-related, and fast hashes for passwords.",
      },
    },
    {
      criterion: "Where you meet it",
      cells: {
        symmetric: "TLS record encryption, disk and database encryption, KMS data keys.",
        asymmetric: "The TLS handshake, SSH keys, JWT signatures, passkeys, code signing.",
        hashing: "Git object ids, file checksums, password storage, inside every signature.",
      },
    },
    {
      criterion: "Post-quantum outlook",
      cells: {
        symmetric: "Safe with 256-bit keys.",
        asymmetric: "RSA and elliptic curves are at risk. NIST standardised ML-KEM and ML-DSA in 2024 as replacements.",
        hashing: "SHA-256 and larger stay safe.",
      },
    },
  ],
  verdicts: [
    {
      option: "symmetric",
      pickWhen: [
        "You need to encrypt data, and the parties that decrypt it can share a key.",
        "You are encrypting large volumes: files, rows, backups, network traffic.",
      ],
    },
    {
      option: "asymmetric",
      pickWhen: [
        "Two parties that never met must agree on a secret over an open network.",
        "Others must verify who produced a message or artifact without being able to forge it.",
        "You want to let anyone encrypt to you while only you can decrypt.",
      ],
    },
    {
      option: "hashing",
      pickWhen: [
        "You need to detect that data changed, or name content by its bytes.",
        "You store passwords, using a slow, salted password hash.",
        "You need a keyed integrity check between services that share a secret: use HMAC.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "NIST SP 800-38D, GCM mode", href: "https://csrc.nist.gov/pubs/sp/800/38/d/final" },
    { label: "NIST FIPS 180-4, Secure Hash Standard", href: "https://csrc.nist.gov/pubs/fips/180-4/upd1/final" },
    { label: "NIST FIPS 203, ML-KEM", href: "https://csrc.nist.gov/pubs/fips/203/final" },
    {
      label: "OWASP Password Storage Cheat Sheet",
      href: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
    },
  ],
};
