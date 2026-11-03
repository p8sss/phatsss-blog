import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Cloud Security. */
export const iamRequest: FlowDefinition = {
  id: "iam-request",
  title: "From signed request to S3 object, or AccessDenied",
  actors: [
    { id: "app", label: "App", sublabel: "AWS SDK", kind: "client", col: 0, row: 0 },
    { id: "sts", label: "AWS STS", sublabel: "temp credentials", kind: "service", col: 0, row: 1 },
    { id: "s3", label: "S3 endpoint", sublabel: "authn + authz", kind: "server", col: 1, row: 0 },
    { id: "bucket", label: "Bucket", sublabel: "example-reports", kind: "database", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "assume",
      from: "app",
      to: "sts",
      title: "Get short-lived credentials",
      payload: "AssumeRole reports-app",
      detail:
        "On AWS compute the SDK fetches role credentials for you, from the instance, task or pod role. No long-lived access keys sit in the code.",
    },
    {
      id: "creds",
      from: "sts",
      to: "app",
      title: "Receive a role session",
      payload: "AccessKeyId, SessionToken",
      variant: "response",
      detail: "The credentials expire on their own, so a leaked copy stops working.",
    },
    {
      id: "sign",
      from: "app",
      title: "Sign the request",
      payload: "SigV4: HMAC-SHA256",
      detail:
        "The SDK hashes the request and signs it with a key derived from the secret, the date, the region and the service. The secret itself is never sent.",
    },
    {
      id: "send",
      from: "app",
      to: "s3",
      title: "Send the API call",
      payload: "GET /q3.pdf  AWS4-HMAC-SHA256",
      detail: "The Authorization header carries the access key id, the signed headers and the signature.",
    },
    {
      id: "authn",
      from: "s3",
      title: "Authenticate",
      payload: "recompute signature, check time",
      detail:
        "AWS recomputes the signature and compares. In most cases the request must arrive within five minutes of its timestamp, which limits replay.",
    },
    {
      id: "context",
      from: "s3",
      title: "Build the request context",
      payload: "s3:GetObject on …/q3.pdf",
      detail:
        "Principal, action, resource and conditions such as source IP, TLS and organization id. Every policy is evaluated against this.",
    },
    {
      id: "deny",
      from: "s3",
      title: "Look for an explicit Deny",
      payload: "any Deny anywhere? → 403",
      detail:
        "AWS checks every applicable policy type for a matching Deny. One is enough to refuse the request, whatever else allows it.",
    },
    {
      id: "org",
      from: "s3",
      title: "Check organization guardrails",
      payload: "RCP and SCP must allow",
      detail:
        "Resource control policies cap what can be done to the account's resources. Service control policies cap what the account's principals can do.",
    },
    {
      id: "policies",
      from: "s3",
      title: "Find an Allow",
      payload: "bucket policy or role policy",
      detail:
        "In the same account, an Allow in either the bucket policy or the role's identity policy is usually enough. Across accounts, both sides must allow.",
    },
    {
      id: "limits",
      from: "s3",
      title: "Apply boundaries and session policy",
      payload: "boundary ∩ session ∩ identity",
      detail:
        "A permissions boundary or session policy can only narrow what identity policies grant. With no Allow at the end, the default is an implicit deny.",
    },
    {
      id: "read",
      from: "s3",
      to: "bucket",
      title: "Read the object",
      payload: "q3.pdf",
      detail: "Only now does S3 touch the data. If the object is encrypted with SSE-KMS, the role also needs kms:Decrypt.",
    },
    {
      id: "bytes",
      from: "bucket",
      to: "s3",
      title: "Return the bytes",
      payload: "1.2 MB",
      variant: "response",
      detail: "The object comes back to the front end.",
    },
    {
      id: "respond",
      from: "s3",
      to: "app",
      title: "Answer the caller",
      payload: "200 OK  or  403 AccessDenied",
      variant: "response",
      detail:
        "For callers in the same account or organization, the 403 message names the type of policy that refused the request. Cross-account callers outside it get a generic Access Denied.",
    },
  ],
};
