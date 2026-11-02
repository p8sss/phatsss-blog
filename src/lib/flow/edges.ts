/** Which directed edges a flow draws, and which step last used each one. */
import type { FlowStep, StepVariant } from "./types";

export interface TravelEdge {
  readonly key: string;
  readonly from: string;
  readonly to: string;
  readonly variant: StepVariant;
}

export function edgeKey(from: string, to: string): string {
  return `${from}->${to}`;
}

export function travelEdges(steps: readonly FlowStep[]): readonly TravelEdge[] {
  return steps.reduce<TravelEdge[]>((edges, step) => {
    if (!step.to) return edges;
    const key = edgeKey(step.from, step.to);
    if (edges.some((edge) => edge.key === key)) return edges;
    return [...edges, { key, from: step.from, to: step.to, variant: step.variant ?? "request" }];
  }, []);
}

/** Index of the latest step at or before `uptoIndex` that travels `key`, or null. */
export function latestStepOnEdge(
  steps: readonly FlowStep[],
  key: string,
  uptoIndex: number,
): number | null {
  for (let i = Math.min(uptoIndex, steps.length - 1); i >= 0; i -= 1) {
    const step = steps[i];
    if (step.to && edgeKey(step.from, step.to) === key) return i;
  }
  return null;
}
