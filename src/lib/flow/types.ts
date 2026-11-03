/**
 * Data model for animated "how it works" flows (ByteByteGo-style sequence diagrams).
 * A flow is pure data: actors placed on a grid, and an ordered list of steps that
 * move a packet between them. The engine and renderer never special-case a flow.
 */

export type ActorKind =
  | "client"
  | "server"
  | "database"
  | "cache"
  | "queue"
  | "service"
  | "external"
  /** A language model, hosted or local. */
  | "model"
  /** Someone acting in bad faith, in security flows. */
  | "attacker"
  /** A control that inspects or stops traffic: WAF, API gateway, rate limiter. */
  | "guard";

export interface FlowActor {
  readonly id: string;
  readonly label: string;
  readonly sublabel?: string;
  readonly kind: ActorKind;
  /** Grid column in the wide layout; the narrow layout transposes col and row. */
  readonly col: number;
  readonly row: number;
}

/** Request edges draw solid, responses dashed. Local steps (no `to`) never draw an edge. */
export type StepVariant = "request" | "response";

export interface FlowStep {
  readonly id: string;
  readonly from: string;
  /** Omit for work done inside `from` (hashing, signing, rendering). */
  readonly to?: string;
  /** Short imperative title, shown in the step list. */
  readonly title: string;
  /** Monospace chip that rides on the packet, kept short enough to read on the packet. */
  readonly payload?: string;
  /** One or two sentences: what happens and why it matters. */
  readonly detail: string;
  readonly variant?: StepVariant;
  /** Seconds; defaults depend on whether the step travels. */
  readonly duration?: number;
}

export interface FlowDefinition {
  readonly id: string;
  readonly title: string;
  readonly actors: readonly FlowActor[];
  readonly steps: readonly FlowStep[];
}
