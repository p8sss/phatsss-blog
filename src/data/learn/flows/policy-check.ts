import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Authorization. */
export const policyCheck: FlowDefinition = {
  id: "policy-check",
  title: "Can Alice edit doc 42? Asking OPA",
  actors: [
    { id: "client", label: "Client", sublabel: "Alice's browser", kind: "client", col: 0, row: 0 },
    { id: "api", label: "API server", sublabel: "enforces (PEP)", kind: "server", col: 1, row: 0 },
    { id: "opa", label: "OPA", sublabel: "decides (PDP)", kind: "service", col: 2, row: 0 },
    { id: "db", label: "Database", sublabel: "docs table", kind: "database", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "request",
      from: "client",
      to: "api",
      title: "Ask to edit a document",
      payload: "PUT /docs/42",
      detail: "The request carries a session cookie or a bearer token. Authorization starts only after we know who is asking.",
    },
    {
      id: "authn",
      from: "api",
      title: "Authenticate first",
      payload: "alice · roles: [editor] · acme",
      detail:
        "The API verifies the token and gets the subject: user id, roles and organisation. Who you are and what you may do are separate questions.",
    },
    {
      id: "load",
      from: "api",
      to: "db",
      title: "Load the resource's attributes",
      payload: "SELECT owner, org … id = 42",
      detail: "The policy needs facts about the document too. The API fetches them, so the engine stays free of database code.",
    },
    {
      id: "attrs",
      from: "db",
      to: "api",
      title: "Owner and organisation",
      payload: "{ owner: \"bob\", org: \"acme\" }",
      variant: "response",
      detail: "Alice does not own this document, so an owner-only rule would refuse her.",
    },
    {
      id: "query",
      from: "api",
      to: "opa",
      title: "Ask for a decision",
      payload: "POST /v1/data/docs/authz/allow",
      detail:
        "The input bundles subject, action and resource. OPA most often runs as a sidecar next to the API, so this call stays local and fast.",
    },
    {
      id: "evaluate",
      from: "opa",
      title: "Evaluate the policy",
      payload: "editor in roles · org == org",
      detail:
        "OPA checks each allow rule against the input. Rules can also read data pushed to OPA ahead of time, such as role mappings.",
    },
    {
      id: "decision",
      from: "opa",
      to: "api",
      title: "Return the decision",
      payload: "{ \"result\": true }",
      variant: "response",
      detail:
        "OPA only answers. It never touches the document. A reply with no result means the path is undefined, and the API must treat that as deny.",
    },
    {
      id: "enforce",
      from: "api",
      to: "db",
      title: "Enforce: run the write",
      payload: "UPDATE docs … WHERE id = 42",
      detail: "The enforcement point acts on the answer. On false it would return 403 and the database would never see a write.",
    },
    {
      id: "written",
      from: "db",
      to: "api",
      title: "Write committed",
      payload: "UPDATE 1",
      variant: "response",
      detail: "OPA can log each decision with its input, which gives auditors a record of why access was allowed.",
    },
    {
      id: "response",
      from: "api",
      to: "client",
      title: "Respond",
      payload: "200 OK",
      variant: "response",
      detail: "Policy changes ship as new Rego bundles. The API code stays the same.",
    },
  ],
};
