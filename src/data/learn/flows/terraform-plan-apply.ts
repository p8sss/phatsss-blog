import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → Provisioning. */
export const terraformPlanApply: FlowDefinition = {
  id: "terraform-plan-apply",
  title: "Terraform init, plan and apply",
  actors: [
    { id: "cli", label: "Terraform", sublabel: "CLI and core", kind: "client", col: 0, row: 0 },
    { id: "provider", label: "Provider", sublabel: "AWS plugin", kind: "service", col: 1, row: 0 },
    { id: "cloud", label: "Cloud API", sublabel: "AWS", kind: "external", col: 2, row: 0 },
    { id: "registry", label: "Registry", sublabel: "providers", kind: "server", col: 0, row: 1 },
    { id: "state", label: "State", sublabel: "S3 backend", kind: "database", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "init",
      from: "cli",
      to: "registry",
      title: "terraform init",
      payload: "hashicorp/aws ~> 6.0",
      detail:
        "Init reads required_providers, picks a version that matches the constraint and configures the backend. Core itself knows nothing about any cloud.",
    },
    {
      id: "download",
      from: "registry",
      to: "cli",
      title: "Download the provider",
      payload: "provider binary + checksums",
      variant: "response",
      detail:
        "The chosen version and its checksums go into .terraform.lock.hcl. Commit that file so every machine uses the same provider build.",
    },
    {
      id: "lock",
      from: "cli",
      to: "state",
      title: "Lock and read the state",
      payload: "lock + GET terraform.tfstate",
      detail:
        "plan takes a lock so that two runs cannot write the same state at once. The state maps each resource address to a real object id.",
    },
    {
      id: "state",
      from: "state",
      to: "cli",
      title: "Return the last known state",
      payload: "aws_s3_bucket.logs, serial 7",
      variant: "response",
      detail: "State is Terraform's memory of what it created last time. It is not the truth until it is refreshed.",
    },
    {
      id: "read",
      from: "cli",
      to: "provider",
      title: "Refresh each resource",
      payload: "ReadResource logs",
      detail:
        "Core talks to the provider plugin over gRPC. It asks for the current attributes of every resource in state.",
    },
    {
      id: "describe",
      from: "provider",
      to: "cloud",
      title: "Read the real object",
      payload: "GET bucket logs-example",
      detail: "The provider turns the request into the cloud's own API calls, using your credentials.",
    },
    {
      id: "drift",
      from: "cloud",
      to: "provider",
      title: "Report what is really there",
      payload: "tags: { team = \"ops\" }",
      variant: "response",
      detail: "Someone changed a tag in the console. Refresh brings that drift into the plan.",
    },
    {
      id: "plan-change",
      from: "cli",
      to: "provider",
      title: "Ask for a plan per resource",
      payload: "PlanResourceChange × 2",
      detail:
        "Core builds a dependency graph from your config. For each resource it sends the prior state and the desired config to the provider.",
    },
    {
      id: "diff",
      from: "provider",
      to: "cli",
      title: "Return the proposed changes",
      payload: "+1 to add, ~1 to change",
      variant: "response",
      detail:
        "The provider says what will change and whether a change forces replacement. A replace shows as -/+ in the plan.",
    },
    {
      id: "save",
      from: "cli",
      title: "Save and review the plan",
      payload: "plan -out=tfplan",
      detail:
        "Nothing has changed yet, and plan releases its lock. A saved plan records exact decisions, so apply carries out what was reviewed and does not ask again.",
    },
    {
      id: "apply",
      from: "cli",
      to: "provider",
      title: "terraform apply tfplan",
      payload: "ApplyResourceChange queue",
      detail:
        "Apply takes the state lock again and rejects the plan as stale if the state changed since. Core then walks the graph in dependency order and runs independent changes in parallel.",
    },
    {
      id: "create",
      from: "provider",
      to: "cloud",
      title: "Call the cloud API",
      payload: "CreateQueue orders",
      detail: "The provider makes the real change. For slow resources it polls until the object is ready.",
    },
    {
      id: "created",
      from: "cloud",
      to: "provider",
      title: "The object exists",
      payload: "QueueUrl …/orders",
      variant: "response",
      detail: "The provider passes the new object's id and computed attributes back to core.",
    },
    {
      id: "write",
      from: "cli",
      to: "state",
      title: "Write the state and unlock",
      payload: "PUT state, serial 8 + unlock",
      detail:
        "The new state records the queue's id so the next plan can find it. Apply releases its lock when it ends.",
    },
  ],
};
