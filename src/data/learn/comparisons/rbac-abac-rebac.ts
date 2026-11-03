import type { Comparison } from "../../../lib/compare/types";

/** Security roadmap → Authorization. */
export const rbacAbacRebac: Comparison = {
  id: "rbac-abac-rebac",
  title: "RBAC vs ABAC vs ReBAC",
  options: [
    {
      id: "rbac",
      name: "RBAC",
      summary: "Role-based: users get roles, and roles carry permissions.",
    },
    {
      id: "abac",
      name: "ABAC",
      summary: "Attribute-based: rules compare facts about the user, resource, action and context.",
    },
    {
      id: "rebac",
      name: "ReBAC",
      summary: "Relationship-based: access follows a graph of who relates to what.",
    },
  ],
  rows: [
    {
      criterion: "The question it asks",
      cells: {
        rbac: "Does this user have a role that grants this permission?",
        abac: "Do the attributes of this request satisfy a policy rule?",
        rebac: "Is there a path in the graph from this user to this object?",
      },
    },
    {
      criterion: "Example rule",
      cells: {
        rbac: "Editors can edit documents.",
        abac: "Staff in the finance department can read invoices from their region during work hours.",
        rebac: "You can edit a doc if you are an editor of it, or of the folder that contains it.",
      },
    },
    {
      criterion: "Per-object access",
      cells: {
        rbac: "Weak. Roles are global unless you scope them per tenant or project.",
        abac: "Yes, if the resource carries attributes such as owner or department.",
        rebac: "Yes. Sharing one document with one person is a single relationship.",
      },
    },
    {
      criterion: "Typical failure mode",
      cells: {
        rbac: "Role explosion: one role per team, per region, per exception.",
        abac: "Rules nobody can read, and missing or stale attributes.",
        rebac: "Deep or wide graphs that are slow to check without a purpose-built store.",
      },
    },
    {
      criterion: "Who can access X?",
      cells: {
        rbac: "Easy. List the roles that hold the permission, then their members.",
        abac: "Hard. You must evaluate the rules against every possible user.",
        rebac: "Supported. Graph stores can expand a relation into the users behind it.",
      },
    },
    {
      criterion: "Data it needs",
      cells: {
        rbac: "User-to-role assignments.",
        abac: "Attributes for users, resources and the environment, at decision time.",
        rebac: "Relationship tuples, such as doc:42#editor@user:alice, kept in sync with your app.",
      },
    },
    {
      criterion: "Common tools",
      cells: {
        rbac: "Built into most frameworks, identity providers and cloud IAM.",
        abac: "Policy engines such as OPA with Rego, or Cedar.",
        rebac: "Zanzibar-style systems such as OpenFGA and SpiceDB.",
      },
    },
  ],
  verdicts: [
    {
      option: "rbac",
      pickWhen: [
        "Permissions follow job functions, such as admin, editor and viewer.",
        "You need simple audits of who holds which role.",
        "The number of roles stays small and stable.",
      ],
    },
    {
      option: "abac",
      pickWhen: [
        "Decisions depend on context such as time, location, device or data sensitivity.",
        "Rules apply across many resources that share attributes, such as region or classification.",
        "You need to layer conditions on top of roles without creating new roles.",
      ],
    },
    {
      option: "rebac",
      pickWhen: [
        "Users share individual objects, as in Google Drive, GitHub or Notion.",
        "Access inherits through hierarchies such as org, team, folder and document.",
        "You must answer 'who can see this?' and 'what can this user see?' quickly.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    {
      label: "NIST SP 800-162: Guide to ABAC",
      href: "https://csrc.nist.gov/pubs/sp/800/162/upd2/final",
    },
    {
      label: "Zanzibar: Google's consistent, global authorization system",
      href: "https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/",
    },
    { label: "OpenFGA concepts", href: "https://openfga.dev/docs/concepts" },
    { label: "Cedar policy language", href: "https://docs.cedarpolicy.com/" },
  ],
};
