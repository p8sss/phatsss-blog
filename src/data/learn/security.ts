import type { Roadmap } from "./types";

/**
 * Section names and order follow roadmap.sh/devsecops (checked 2026-11-02);
 * topics and write-ups are this site's own.
 */
export const securityRoadmap: Roadmap = {
  id: "security",
  title: "Security",
  href: "https://roadmap.sh/devsecops",
  sections: [
    {
      id: "authentication",
      title: "Authentication",
      topics: [
        {
          id: "password-hashing",
          title: "Password login with bcrypt",
          question: "What happens to a password at sign-up and at login?",
          format: "flow",
          to: "/learn/security/password-hashing",
        },
        {
          id: "passkey-webauthn",
          title: "Passkey login with WebAuthn",
          question: "How does a login work with no password at all?",
          format: "flow",
          to: "/learn/security/passkey-webauthn",
        },
        {
          id: "totp",
          title: "One-time codes with TOTP",
          question: "How do your phone and the server agree on a six-digit code?",
          format: "flow",
          to: "/learn/security/totp",
        },
        {
          id: "sessions-jwt-opaque",
          title: "Sessions vs JWT vs opaque tokens",
          question: "Where does state live, and how do you revoke each?",
          format: "compare",
          to: "/learn/security/sessions-jwt-opaque",
        },
        {
          id: "security-jwt-authentication",
          title: "JWT authentication",
          question: "How does a server trust a request without looking up a session?",
          format: "flow",
          to: "/learn/backend/jwt-authentication",
          crossListFrom: "backend",
        },
      ],
    },
    {
      id: "authorization",
      title: "Authorization",
      topics: [
        {
          id: "rbac-abac-rebac",
          title: "RBAC vs ABAC vs ReBAC",
          question: "Roles, attributes or relationships: which model fits?",
          format: "compare",
          to: "/learn/security/rbac-abac-rebac",
        },
        {
          id: "policy-check",
          title: "An authorization check with a policy engine",
          question: "What happens between \"can this user edit this doc?\" and yes or no?",
          format: "flow",
          to: "/learn/security/policy-check",
        },
      ],
    },
    {
      id: "owasp-top-10",
      title: "OWASP Top 10",
      topics: [
        {
          id: "sql-injection",
          title: "SQL injection, and the query that stops it",
          question: "How does one quote mark become a data breach?",
          format: "flow",
          to: "/learn/security/sql-injection",
        },
        {
          id: "xss-csp",
          title: "XSS, and how CSP contains it",
          question: "How does a script get into the page, and what does the browser block?",
          format: "flow",
          to: "/learn/security/xss-csp",
        },
        {
          id: "csrf-samesite",
          title: "CSRF and SameSite cookies",
          question: "How does another site make your browser act on your behalf?",
          format: "flow",
          to: "/learn/security/csrf-samesite",
        },
        {
          id: "ssrf",
          title: "Server-side request forgery",
          question: "How does a URL parameter reach your cloud metadata service?",
          format: "flow",
          to: "/learn/security/ssrf",
        },
      ],
    },
    {
      id: "encryption",
      title: "Encryption",
      topics: [
        {
          id: "crypto-primitives",
          title: "Symmetric vs asymmetric vs hashing",
          question: "Which primitive solves which problem?",
          format: "compare",
          to: "/learn/security/crypto-primitives",
        },
        {
          id: "envelope-encryption",
          title: "Envelope encryption with a KMS",
          question: "How does a data key get wrapped, stored and unwrapped?",
          format: "flow",
          to: "/learn/security/envelope-encryption",
        },
        {
          id: "acme-certificate",
          title: "How a Let's Encrypt certificate is issued",
          question: "What happens during the ACME challenge, and how does renewal work?",
          format: "flow",
          to: "/learn/security/acme-certificate",
        },
        {
          id: "security-tls-handshake",
          title: "The TLS handshake",
          question: "How do two strangers agree on a key that nobody listening can learn?",
          format: "flow",
          to: "/learn/devops/tls-handshake",
          crossListFrom: "devops",
        },
      ],
    },
    {
      id: "secure-coding",
      title: "Secure Coding",
      topics: [
        {
          id: "supply-chain",
          title: "How a malicious package reaches production",
          question: "Where does a poisoned dependency get in, and what stops it?",
          format: "flow",
          to: "/learn/security/supply-chain",
        },
        {
          id: "security-prompt-injection",
          title: "A prompt injection, and the guardrails that catch it",
          question: "How does untrusted text hijack an agent, and where do you stop it?",
          format: "flow",
          to: "/learn/ai/prompt-injection",
          crossListFrom: "ai",
        },
      ],
    },
    {
      id: "identity-basics",
      title: "Identity Basics",
      topics: [
        {
          id: "oidc-sso",
          title: "Single sign-on with OIDC",
          question: "How does one login work across many apps?",
          format: "flow",
          to: "/learn/security/oidc-sso",
        },
        {
          id: "security-oauth-pkce",
          title: "OAuth login with PKCE",
          question: "How does a browser app sign in through another site without a client secret?",
          format: "flow",
          to: "/learn/frontend/oauth-pkce",
          crossListFrom: "frontend",
        },
      ],
    },
    {
      id: "threat-modeling",
      title: "Threat Modeling",
      topics: [
        {
          id: "stride-login",
          title: "STRIDE on a login form",
          question: "What does a threat model of one feature actually look like?",
          format: "flow",
          to: "/learn/security/stride-login",
        },
        {
          id: "stride-vs-pasta",
          title: "STRIDE vs PASTA",
          question: "Which threat modeling method fits your team?",
          format: "compare",
          to: "/learn/security/stride-vs-pasta",
        },
      ],
    },
    {
      id: "cloud-security",
      title: "Cloud Security",
      topics: [
        {
          id: "iam-request",
          title: "How a cloud API call is authorised",
          question: "What checks a request before an S3 bucket answers?",
          format: "flow",
          to: "/learn/security/iam-request",
        },
      ],
    },
    {
      id: "container-security",
      title: "Container Security",
      topics: [
        {
          id: "image-scanning",
          title: "Image scanning in the pipeline",
          question: "Where does a vulnerable base image get caught before production?",
          format: "flow",
          to: "/learn/security/image-scanning",
        },
      ],
    },
    {
      id: "incident-response",
      title: "Incident Response",
      topics: [
        {
          id: "incident-lifecycle",
          title: "The incident lifecycle",
          question: "Prepare, identify, contain, eradicate, recover, learn: what happens at each stage?",
          format: "flow",
          to: "/learn/security/incident-lifecycle",
        },
      ],
    },
  ],
};
