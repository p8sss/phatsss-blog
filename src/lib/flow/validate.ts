/**
 * Structural checks for flow data. Flows are authored by hand, so every rule here
 * catches a mistake that would otherwise render as a silently broken diagram.
 */
import type { FlowActor, FlowDefinition } from "./types";

/** Longest payload chip that stays readable on the narrow layout. */
export const PAYLOAD_MAX_LENGTH = 32;
/** Longest label and sublabel that fit inside an actor box beside its icon. */
export const LABEL_MAX_LENGTH = 12;
export const SUBLABEL_MAX_LENGTH = 16;
/**
 * Grid limits. The narrow layout transposes rows into columns, so two rows keep
 * it two columns wide on a phone; four columns keep the wide layout readable.
 */
export const MAX_ROWS = 2;
export const MAX_COLS = 4;

function duplicates(values: readonly string[]): readonly string[] {
  return [...new Set(values.filter((value, i) => values.indexOf(value) !== i))];
}

function actorErrors(flow: FlowDefinition): readonly string[] {
  const dupIds = duplicates(flow.actors.map((a) => a.id)).map(
    (id) => `duplicate actor id "${id}"`,
  );
  const dupCells = duplicates(flow.actors.map((a) => `${a.col},${a.row}`)).map(
    (cell) => `actors share grid cell ${cell}`,
  );
  const tooLong = flow.actors.flatMap((a) => [
    ...(a.label.length > LABEL_MAX_LENGTH
      ? [`actor "${a.id}" label is ${a.label.length} characters, max ${LABEL_MAX_LENGTH}`]
      : []),
    ...(a.sublabel && a.sublabel.length > SUBLABEL_MAX_LENGTH
      ? [`actor "${a.id}" sublabel is ${a.sublabel.length} characters, max ${SUBLABEL_MAX_LENGTH}`]
      : []),
  ]);
  const offGrid = flow.actors.flatMap((a) =>
    (["col", "row"] as const)
      .filter((axis) => !Number.isInteger(a[axis]) || a[axis] < 0)
      .map((axis) => `actor "${a.id}" ${axis} must be a whole number of 0 or more`),
  );
  const tooFar = flow.actors.flatMap((a) => [
    ...(a.row >= MAX_ROWS ? [`actor "${a.id}" row ${a.row} is past the last row (max ${MAX_ROWS} rows)`] : []),
    ...(a.col >= MAX_COLS
      ? [`actor "${a.id}" col ${a.col} is past the last column (max ${MAX_COLS} columns)`]
      : []),
  ]);
  return [...dupIds, ...dupCells, ...tooLong, ...offGrid, ...tooFar];
}

/** True when `p` sits strictly between `a` and `b` on the straight grid line joining them. */
function liesBetween(a: FlowActor, b: FlowActor, p: FlowActor): boolean {
  const dx = b.col - a.col;
  const dy = b.row - a.row;
  const px = p.col - a.col;
  const py = p.row - a.row;
  const cross = dx * py - dy * px;
  const dot = dx * px + dy * py;
  return cross === 0 && dot > 0 && dot < dx * dx + dy * dy;
}

/** Edges are straight, so one that crosses a third actor would draw through its box. */
function routingErrors(flow: FlowDefinition): readonly string[] {
  const byId = new Map(flow.actors.map((a) => [a.id, a]));
  return flow.steps.flatMap((step) => {
    const from = byId.get(step.from);
    const to = step.to ? byId.get(step.to) : undefined;
    if (!from || !to) return [];
    return flow.actors
      .filter((other) => other.id !== from.id && other.id !== to.id && liesBetween(from, to, other))
      .map((other) => `step "${step.id}" passes through actor "${other.id}"; route it via that actor`);
  });
}

function stepErrors(flow: FlowDefinition): readonly string[] {
  const actorIds = new Set(flow.actors.map((a) => a.id));
  const dupIds = duplicates(flow.steps.map((s) => s.id)).map(
    (id) => `duplicate step id "${id}"`,
  );
  const perStep = flow.steps.flatMap((step) => {
    const where = `step "${step.id}"`;
    const refs = [step.from, ...(step.to ? [step.to] : [])];
    return [
      ...refs
        .filter((ref) => !actorIds.has(ref))
        .map((ref) => `${where} references unknown actor "${ref}"`),
      ...(step.to === step.from ? [`${where} travels to itself; omit "to" for local work`] : []),
      ...(step.payload && step.payload.length > PAYLOAD_MAX_LENGTH
        ? [`${where} payload is ${step.payload.length} characters, max ${PAYLOAD_MAX_LENGTH}`]
        : []),
      ...(step.duration !== undefined && !(step.duration > 0)
        ? [`${where} duration must be positive`]
        : []),
    ];
  });
  return [...dupIds, ...perStep];
}

/** Returns every problem found; an empty array means the flow is renderable. */
export function validateFlow(flow: FlowDefinition): readonly string[] {
  const empty = flow.steps.length === 0 ? [`flow "${flow.id}" has no steps`] : [];
  return [...empty, ...actorErrors(flow), ...stepErrors(flow), ...routingErrors(flow)];
}
