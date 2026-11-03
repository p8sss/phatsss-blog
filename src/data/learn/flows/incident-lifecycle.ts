import type { FlowDefinition } from "../../../lib/flow/types";

/** Security roadmap → Incident Response. */
export const incidentLifecycle: FlowDefinition = {
  id: "incident-lifecycle",
  title: "A leaked key, from alert to postmortem",
  actors: [
    { id: "attacker", label: "Attacker", sublabel: "leaked API key", kind: "attacker", col: 0, row: 0 },
    { id: "host", label: "Web server", sublabel: "affected system", kind: "server", col: 1, row: 0 },
    { id: "siem", label: "SIEM", sublabel: "logs + alerts", kind: "service", col: 2, row: 0 },
    { id: "comms", label: "Stakeholders", sublabel: "legal, support", kind: "client", col: 1, row: 1 },
    { id: "responder", label: "Responder", sublabel: "on-call team", kind: "client", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "prepare",
      from: "responder",
      title: "Prepare",
      payload: "runbooks, on-call, log retention",
      detail:
        "Preparation happens before anything goes wrong. Without central logs, a paging rotation and written runbooks, every later stage is slower.",
    },
    {
      id: "intrusion",
      from: "attacker",
      to: "host",
      title: "The attacker gets in",
      payload: "API call with a leaked key",
      detail: "A key committed to a public repo is being used from an unfamiliar network.",
    },
    {
      id: "telemetry",
      from: "host",
      to: "siem",
      title: "Logs flow to the SIEM",
      payload: "3 GB egress at 03:12 UTC",
      detail: "Detection depends on logs that were collected before the incident started.",
    },
    {
      id: "alert",
      from: "siem",
      to: "responder",
      title: "Identify: an alert fires",
      payload: "page: anomalous data egress",
      detail: "Identification starts with a signal. It may also come from a customer, a researcher or a bill.",
    },
    {
      id: "triage",
      from: "responder",
      title: "Triage and declare",
      payload: "SEV-1, incident commander",
      detail:
        "Confirm it is real, set a severity and name one incident commander. Start a timeline and preserve evidence before changing anything.",
    },
    {
      id: "notify",
      from: "responder",
      to: "comms",
      title: "Tell the people who need to know",
      payload: "SEV-1 declared, next update 30m",
      detail:
        "Legal and privacy teams track notification deadlines. Under GDPR, a personal data breach must usually be reported to the regulator within 72 hours.",
    },
    {
      id: "contain",
      from: "responder",
      to: "host",
      title: "Contain",
      payload: "revoke key, isolate host",
      detail:
        "Stop the damage from spreading. Snapshot disks and memory first if you can, because containment can destroy evidence.",
    },
    {
      id: "eradicate",
      from: "responder",
      to: "host",
      title: "Eradicate",
      payload: "remove backdoor, rotate secrets",
      detail:
        "Find the root cause and every foothold the attacker left, such as new users, keys or scheduled jobs. Missing one means they come back.",
    },
    {
      id: "recover",
      from: "responder",
      to: "host",
      title: "Recover",
      payload: "redeploy from a clean image",
      detail: "Rebuild from known-good sources rather than cleaning in place, then restore service in stages.",
    },
    {
      id: "monitor",
      from: "siem",
      to: "responder",
      title: "Watch for a return",
      payload: "heightened monitoring: quiet",
      detail: "Keep extra alerts on the affected systems for a while. Attackers often retry the same way.",
    },
    {
      id: "review",
      from: "responder",
      to: "comms",
      title: "Learn: run the postmortem",
      payload: "blameless review + actions",
      detail:
        "Write down what happened, what helped and what slowed you down. Each action item gets an owner and a due date.",
    },
    {
      id: "improve",
      from: "responder",
      title: "Feed it back into preparation",
      payload: "secret scanning on every push",
      detail: "The lifecycle is a loop. Lessons become new detections, controls and runbook steps.",
    },
  ],
};
