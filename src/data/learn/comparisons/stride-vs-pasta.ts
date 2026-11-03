import type { Comparison } from "../../../lib/compare/types";

/** Security roadmap → Threat Modeling. */
export const strideVsPasta: Comparison = {
  id: "stride-vs-pasta",
  title: "STRIDE vs PASTA",
  options: [
    {
      id: "stride",
      name: "STRIDE",
      summary: "Six threat categories from Microsoft, applied to each part of a data flow diagram.",
    },
    {
      id: "pasta",
      name: "PASTA",
      summary: "The Process for Attack Simulation and Threat Analysis: a seven-stage, risk-centric method.",
    },
  ],
  rows: [
    {
      criterion: "What it is",
      cells: {
        stride: "A checklist of threat types: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.",
        pasta: "A full process that runs from business objectives to a ranked list of risks.",
      },
    },
    {
      criterion: "Starting point",
      cells: {
        stride: "The system: a data flow diagram with its processes, stores, flows and trust boundaries.",
        pasta: "The business: what the application must achieve and what a breach would cost.",
      },
    },
    {
      criterion: "Steps",
      cells: {
        stride: "Draw the diagram, walk each element through the six categories, then pick a mitigation for each threat.",
        pasta: "Objectives, technical scope, decomposition, threat analysis, vulnerability analysis, attack modeling, risk and impact analysis.",
      },
    },
    {
      criterion: "Lens",
      cells: {
        stride: "Defender-centric: which security property does each element fail to keep?",
        pasta: "Attacker-centric: simulate realistic attacks using threat intelligence, then weigh their impact.",
      },
    },
    {
      criterion: "Output",
      cells: {
        stride: "A list of threats and mitigations per component, often tracked as backlog tickets.",
        pasta: "Attack trees, vulnerability mappings and risks ranked by business impact.",
      },
    },
    {
      criterion: "Effort",
      cells: {
        stride: "Light. A team can model one feature in an hour.",
        pasta: "Heavy. Days to weeks, with business, architecture and security people involved.",
      },
    },
    {
      criterion: "Who runs it",
      cells: {
        stride: "Developers and architects, with a security champion facilitating.",
        pasta: "A security team, working with product owners and risk management.",
      },
    },
    {
      criterion: "Tooling",
      cells: {
        stride: "Microsoft Threat Modeling Tool, OWASP Threat Dragon, or a whiteboard.",
        pasta: "Documents and spreadsheets, attack trees, threat intelligence feeds.",
      },
    },
  ],
  verdicts: [
    {
      option: "stride",
      pickWhen: [
        "You want developers to threat model each feature as part of normal design work.",
        "You are new to threat modeling and need a structure that is easy to teach.",
        "The output should land straight in the backlog as concrete fixes.",
      ],
    },
    {
      option: "pasta",
      pickWhen: [
        "Leadership needs threats expressed as business risk, to decide where to spend.",
        "The system is high value, such as payments or health data, and faces capable attackers.",
        "You have a security team with time to run a structured, multi-stage analysis.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    {
      label: "OWASP Threat Modeling Cheat Sheet",
      href: "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html",
    },
    {
      label: "Microsoft Threat Modeling Tool: STRIDE threats",
      href: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats",
    },
    { label: "Threat Modeling Manifesto", href: "https://www.threatmodelingmanifesto.org/" },
  ],
};
