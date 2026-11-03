/**
 * Pure model for a traffic surge drawn over a flow diagram. Where a flow follows
 * one request, a surge shows many at once: load ramps up, requests fail at the
 * bottleneck, and guards stop attack traffic. Like the timeline, every visual
 * state is a function of surge time, so the renderer holds no state.
 */

/** Length of a surge, in seconds. */
export const SURGE_SECONDS = 9;
/** Dots drawn per surge: enough to read as a crowd, few enough to stay cheap. */
export const DOT_COUNT = 56;
/** Seconds a dot takes to cross one edge. */
export const HOP_SECONDS = 0.55;
/** Seconds an ended dot stays on screen while it fades. */
export const LINGER_SECONDS = 0.7;
/** Dots stop spawning this long before the surge ends, so the last ones finish. */
const SPAWN_TAIL_SECONDS = 2;
/** Seconds the load takes to reach its peak. */
const RAMP_SECONDS = 6;
/** Load above which the bottleneck starts dropping requests. */
const FAIL_LOAD = 0.55;
/** Share of requests dropped at the bottleneck at full load. */
const MAX_FAIL_SHARE = 0.65;
/** Fractional part of the golden ratio: spreads pseudo-random picks evenly. */
const GOLDEN = 0.618033988749895;

export interface TrafficRoute {
  /** Actor ids from the sender to the last actor the request reaches. */
  readonly path: readonly string[];
  /** Relative share of traffic on this route. */
  readonly weight: number;
  /** Bots and attackers: stopped by guards, harmless only if stopped. */
  readonly attack?: boolean;
  /**
   * The guard that stops this attack, for one that looks legitimate to the
   * guards before it. Defaults to the first guard on the path.
   */
  readonly blockedBy?: string;
}

export type MetricRange = readonly [calm: number, peak: number];

export interface SurgeMetrics {
  readonly rps: MetricRange;
  readonly p95Ms: MetricRange;
  readonly errorPct: MetricRange;
  /** Share of traffic stopped by guards, for stages that have them. */
  readonly blockedPct?: MetricRange;
}

export interface SurgeConfig {
  readonly routes: readonly TrafficRoute[];
  /** The actor that saturates; requests reaching it under high load fail there. */
  readonly bottleneck?: string;
  /** Actors that stop attack traffic. */
  readonly guards?: readonly string[];
  readonly metrics: SurgeMetrics;
}

export interface MetricsSample {
  readonly rps: number;
  readonly p95Ms: number;
  readonly errorPct: number;
  readonly blockedPct: number | null;
}

/** How a dot's journey ends: served, dropped under load, stopped by a guard, or an attack that got through. */
export type DotFate = "served" | "failed" | "blocked" | "breach";

export interface PlannedDot {
  readonly id: number;
  readonly spawn: number;
  readonly path: readonly string[];
  readonly attack: boolean;
  readonly fate: DotFate;
  /** Index into `path` where the dot stops. Always 1 or more. */
  readonly stopAt: number;
}

export interface DotSample {
  readonly id: number;
  readonly from: string;
  readonly to: string;
  /** 0 to 1 along the hop. An ended dot rests at 1. */
  readonly progress: number;
  readonly attack: boolean;
  readonly fate: DotFate;
  readonly ended: boolean;
  readonly opacity: number;
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function lerp([calm, peak]: MetricRange, t: number): number {
  return calm + (peak - calm) * t;
}

/** A well-spread value in [0, 1) for the nth pick. */
function spread(n: number, seed: number): number {
  return (n * GOLDEN + seed) % 1;
}

/** Surge load from 0 (calm) to 1 (peak) at a surge time. */
export function loadAt(time: number): number {
  return smoothstep(time / RAMP_SECONDS);
}

export function metricsAt(metrics: SurgeMetrics, load: number): MetricsSample {
  return {
    rps: lerp(metrics.rps, load),
    p95Ms: lerp(metrics.p95Ms, load),
    errorPct: lerp(metrics.errorPct, load),
    blockedPct: metrics.blockedPct ? lerp(metrics.blockedPct, load) : null,
  };
}

function pickRoute(routes: readonly TrafficRoute[], pick: number): TrafficRoute {
  const total = routes.reduce((sum, route) => sum + route.weight, 0);
  const target = pick * total;
  let running = 0;
  for (const route of routes) {
    running += route.weight;
    if (target < running) return route;
  }
  return routes[routes.length - 1];
}

function fateOf(
  route: TrafficRoute,
  config: SurgeConfig,
  spawn: number,
  roll: number,
): Pick<PlannedDot, "fate" | "stopAt"> {
  const last = route.path.length - 1;
  if (route.attack) {
    const stops = (id: string) => (route.blockedBy ? id === route.blockedBy : config.guards?.includes(id));
    const guard = route.path.findIndex((id, i) => i > 0 && stops(id));
    return guard > 0 ? { fate: "blocked", stopAt: guard } : { fate: "breach", stopAt: last };
  }
  const bottleneck = config.bottleneck ? route.path.indexOf(config.bottleneck) : -1;
  if (bottleneck > 0) {
    const pressure = clamp01((loadAt(spawn) - FAIL_LOAD) / (1 - FAIL_LOAD));
    if (roll < pressure * MAX_FAIL_SHARE) return { fate: "failed", stopAt: bottleneck };
  }
  return { fate: "served", stopAt: last };
}

/**
 * Every dot of a surge, decided up front. Spawn times follow a square root, so
 * dots arrive faster as the surge builds.
 */
export function planDots(config: SurgeConfig): readonly PlannedDot[] {
  const window = SURGE_SECONDS - SPAWN_TAIL_SECONDS;
  return Array.from({ length: DOT_COUNT }, (_, id) => {
    const spawn = window * Math.sqrt(id / DOT_COUNT);
    const route = pickRoute(config.routes, spread(id, 0.13));
    return {
      id,
      spawn,
      path: route.path,
      attack: route.attack === true,
      ...fateOf(route, config, spawn, spread(id, 0.71)),
    };
  });
}

function sampleDot(dot: PlannedDot, time: number): DotSample | null {
  const age = time - dot.spawn;
  if (age < 0) return null;
  const travel = dot.stopAt * HOP_SECONDS;
  const base = { id: dot.id, attack: dot.attack, fate: dot.fate };
  if (age < travel) {
    const hop = Math.floor(age / HOP_SECONDS);
    return {
      ...base,
      from: dot.path[hop],
      to: dot.path[hop + 1],
      progress: age / HOP_SECONDS - hop,
      ended: false,
      opacity: 1,
    };
  }
  const resting = age - travel;
  if (resting >= LINGER_SECONDS) return null;
  return {
    ...base,
    from: dot.path[dot.stopAt - 1],
    to: dot.path[dot.stopAt],
    progress: 1,
    ended: true,
    opacity: 1 - resting / LINGER_SECONDS,
  };
}

/** The dots on screen at a surge time. */
export function trafficAt(dots: readonly PlannedDot[], time: number): readonly DotSample[] {
  return dots.flatMap((dot) => {
    const sample = sampleDot(dot, time);
    return sample ? [sample] : [];
  });
}
