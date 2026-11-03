/**
 * Pure timing for a flow. Every visual state is a function of one number, the flow
 * time in seconds, so play, pause, scrub and step all reduce to "set the time".
 */
import type { FlowStep } from "./types";

/** Default seconds for a step whose packet travels between two actors. */
export const TRAVEL_STEP_SECONDS = 2.4;
/** Default seconds for work done inside a single actor. */
export const LOCAL_STEP_SECONDS = 1.8;
/** How far before a step's end a paused player rests. */
const HOLD_EPSILON_SECONDS = 0.001;

export interface StepSegment {
  readonly index: number;
  readonly start: number;
  readonly end: number;
}

export interface FlowTimeline {
  readonly segments: readonly StepSegment[];
  readonly total: number;
}

export interface FlowSample {
  readonly index: number;
  /** 0 to 1 within the active step. */
  readonly progress: number;
}

export type StepStatus = "done" | "active" | "upcoming";

export function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function stepDuration(step: FlowStep): number {
  return step.duration ?? (step.to ? TRAVEL_STEP_SECONDS : LOCAL_STEP_SECONDS);
}

/** The same steps played `factor` times as long: below 1 for a quicker overview. */
export function pacedSteps(steps: readonly FlowStep[], factor: number): readonly FlowStep[] {
  return steps.map((step) => ({ ...step, duration: stepDuration(step) * factor }));
}

export function buildTimeline(steps: readonly FlowStep[]): FlowTimeline {
  const segments = steps.reduce<StepSegment[]>((acc, step, index) => {
    const start = acc.length > 0 ? acc[acc.length - 1].end : 0;
    return [...acc, { index, start, end: start + stepDuration(step) }];
  }, []);
  const total = segments.length > 0 ? segments[segments.length - 1].end : 0;
  return { segments, total };
}

export function sampleAt(timeline: FlowTimeline, time: number): FlowSample {
  const { segments } = timeline;
  if (segments.length === 0) return { index: 0, progress: 0 };
  const found = segments.find((segment) => time < segment.end);
  if (!found) return { index: segments.length - 1, progress: 1 };
  const span = found.end - found.start;
  return { index: found.index, progress: clamp01((time - found.start) / span) };
}

export function stepStatus(index: number, sample: FlowSample): StepStatus {
  if (index < sample.index) return "done";
  if (index === sample.index) return "active";
  return "upcoming";
}

export function stepStartTime(timeline: FlowTimeline, index: number): number {
  const segment = timeline.segments[index];
  return segment ? segment.start : timeline.total;
}

/**
 * Just before a step's end: the step reads as finished (progress ≈ 1) while the
 * sample still belongs to it, so a paused player can rest on a completed step.
 */
export function stepHoldTime(timeline: FlowTimeline, index: number): number {
  const segment = timeline.segments[index];
  if (!segment) return timeline.total;
  return Math.max(segment.start, segment.end - HOLD_EPSILON_SECONDS);
}
