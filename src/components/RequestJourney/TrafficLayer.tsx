import type { JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { diagramSegment } from "@/components/learn/flow-player/FlowDiagram";
import { tint } from "@/components/learn/flow-player/actor-style";
import { pointAlong, type FlowLayout, type Point } from "@/lib/flow/geometry";
import type { DotSample } from "@/lib/flow/traffic";

const DOT_RADIUS = 4.5;
const HALO_PAD = 6;
const HALO_RADIUS = 19;
const BAR_INSET = 12;
const BAR_HEIGHT = 3;
const BAR_BOTTOM = 7;
/** Space between the halo and the load label above it. */
const LABEL_GAP = 5;
/** Load at which the bottleneck halo starts to show. */
const HALO_FROM = 0.35;
/** Load at which the bottleneck reads as overloaded. */
const HOT_LOAD = 0.75;
const MARK_SIZE = 4;
const BURST_GROWTH = 9;
const FAILED = "var(--destructive)";
const GUARDED = "var(--success)";

interface TrafficLayerProps {
  readonly layout: FlowLayout;
  readonly dots: readonly DotSample[];
  /** Surge load, 0 to 1. */
  readonly load: number;
  readonly bottleneck?: string;
  readonly guards?: readonly string[];
  readonly colorOf: (actorId: string) => string;
}

function boxOrigin(layout: FlowLayout, actorId: string): Point {
  const center = layout.placements[actorId];
  return { x: center.x - layout.metrics.boxW / 2, y: center.y - layout.metrics.boxH / 2 };
}

function Halo({ layout, actorId, color, opacity }: {
  readonly layout: FlowLayout;
  readonly actorId: string;
  readonly color: string;
  readonly opacity: number;
}): JSX.Element {
  const { x, y } = boxOrigin(layout, actorId);
  const { boxW, boxH } = layout.metrics;
  return (
    <rect
      x={x - HALO_PAD}
      y={y - HALO_PAD}
      width={boxW + HALO_PAD * 2}
      height={boxH + HALO_PAD * 2}
      rx={HALO_RADIUS}
      strokeWidth={2}
      style={{ fill: tint(color, 10), stroke: color, opacity, filter: `drop-shadow(0 0 12px ${tint(color, 45)})` }}
    />
  );
}

/** A load meter along the bottom of the overloaded box. */
function LoadBar({ layout, actorId, load }: {
  readonly layout: FlowLayout;
  readonly actorId: string;
  readonly load: number;
}): JSX.Element {
  const { x, y } = boxOrigin(layout, actorId);
  const { boxW, boxH } = layout.metrics;
  const width = boxW - BAR_INSET * 2;
  const hot = load >= HOT_LOAD;
  const color = hot ? FAILED : "var(--warning)";
  // ink tokens keep the label readable on the card in both themes
  const ink = hot ? "var(--color-destructive-ink)" : "var(--color-warning-ink)";
  const label = translate(
    { id: "journey.surge.load", message: "{percent}% load" },
    { percent: Math.round(load * 100) },
  );
  return (
    <g transform={`translate(${x + BAR_INSET} ${y + boxH - BAR_BOTTOM})`}>
      <rect width={width} height={BAR_HEIGHT} rx={BAR_HEIGHT / 2} style={{ fill: "var(--fill)" }} />
      <rect
        width={width}
        height={BAR_HEIGHT}
        rx={BAR_HEIGHT / 2}
        transform={`scale(${load} 1)`}
        style={{ fill: color }}
      />
      <text
        x={width + BAR_INSET}
        y={-boxH + BAR_BOTTOM - HALO_PAD - LABEL_GAP}
        textAnchor="end"
        className="font-mono text-[12px] font-bold tabular-nums"
        style={{ fill: ink }}
      >
        {label}
      </text>
    </g>
  );
}

function Dot({ dot, at, color }: { readonly dot: DotSample; readonly at: Point; readonly color: string }): JSX.Element {
  if (!dot.ended || dot.fate === "served") {
    return <circle cx={at.x} cy={at.y} r={DOT_RADIUS} style={{ fill: color, opacity: dot.opacity }} />;
  }
  if (dot.fate === "failed") {
    // a cross where the request was dropped
    return (
      <g transform={`translate(${at.x} ${at.y})`} style={{ opacity: dot.opacity }} strokeWidth={2} strokeLinecap="round">
        <line x1={-MARK_SIZE} y1={-MARK_SIZE} x2={MARK_SIZE} y2={MARK_SIZE} style={{ stroke: FAILED }} />
        <line x1={MARK_SIZE} y1={-MARK_SIZE} x2={-MARK_SIZE} y2={MARK_SIZE} style={{ stroke: FAILED }} />
      </g>
    );
  }
  // blocked or breached: a ring that spreads as it fades
  const ring = dot.fate === "blocked" ? GUARDED : FAILED;
  return (
    <circle
      cx={at.x}
      cy={at.y}
      r={DOT_RADIUS + (1 - dot.opacity) * BURST_GROWTH}
      strokeWidth={2}
      style={{ fill: "none", stroke: ring, opacity: dot.opacity }}
    />
  );
}

/** Many requests at once over a flow diagram: load builds, requests fail, guards stop attacks. */
export function TrafficLayer({ layout, dots, load, bottleneck, guards = [], colorOf }: TrafficLayerProps): JSX.Element {
  const guardOpacity = Math.min(1, load * 2);
  const haloOpacity = Math.max(0, (load - HALO_FROM) / (1 - HALO_FROM));
  return (
    <g aria-hidden="true" className="pointer-events-none">
      {guards.map((id) => (
        <Halo key={id} layout={layout} actorId={id} color={GUARDED} opacity={guardOpacity * 0.8} />
      ))}
      {bottleneck && (
        <>
          <Halo layout={layout} actorId={bottleneck} color={FAILED} opacity={haloOpacity} />
          <LoadBar layout={layout} actorId={bottleneck} load={load} />
        </>
      )}
      {dots.map((dot) => (
        <Dot
          key={dot.id}
          dot={dot}
          at={pointAlong(diagramSegment(layout, dot.from, dot.to), dot.progress)}
          color={dot.attack ? FAILED : colorOf(dot.from)}
        />
      ))}
    </g>
  );
}

/** Tags boxes a stage adds, so the reader sees what changed since the last one. */
export function NewActorMarks({ layout, actorIds, opacity, colorOf }: {
  readonly layout: FlowLayout;
  readonly actorIds: readonly string[];
  readonly opacity: number;
  readonly colorOf: (actorId: string) => string;
}): JSX.Element | null {
  if (opacity <= 0 || actorIds.length === 0) return null;
  const label = translate({ id: "journey.new", message: "new" });
  return (
    <g aria-hidden="true" className="pointer-events-none" style={{ opacity }}>
      {actorIds.map((id) => {
        const { x, y } = boxOrigin(layout, id);
        const color = colorOf(id);
        return (
          <g key={id} transform={`translate(${x + layout.metrics.boxW - 40} ${y - 9})`}>
            <rect width={34} height={18} rx={9} style={{ fill: color }} />
            <text
              x={17}
              y={9}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ fill: "var(--background)" }}
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
