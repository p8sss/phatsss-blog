import { useMemo, type JSX, type ReactNode } from "react";
import { edgeKey, latestStepOnEdge, travelEdges } from "@/lib/flow/edges";
import {
  chipSize,
  edgeAxis,
  edgeSegment,
  placeChip,
  placeChipCentered,
  pointAlong,
  rightNormal,
  type FlowLayout,
  type Point,
  type Segment,
} from "@/lib/flow/geometry";
import { easeInOutCubic, type FlowSample } from "@/lib/flow/timeline";
import type { FlowActor, FlowDefinition, FlowStep, StepVariant } from "@/lib/flow/types";
import { actorStyle, tint } from "./actor-style";

const BOX_RADIUS = 14;
/** Each direction's distance from the center line, so request and response separate. */
const LANE = 9;
const EDGE_GAP = 8;
const ARROW_SIZE = 8;
const BADGE_RADIUS = 11;
const BADGE_OFFSET = 24;
const PACKET_RADIUS = 6;
const CHIP_FONT_SIZE = 11;
const CHIP_BOX_CLEARANCE = 4;
const LOCAL_BADGE_AT = { x: 14, y: 16 };
const RESPONSE_DASH = "6 6";
/** Largest scale-up on wide screens: small grids stay crisp instead of ballooning. */
const MAX_UPSCALE = 1.15;

type EdgeState = "idle" | "done" | "active";

interface FlowDiagramProps {
  readonly flow: FlowDefinition;
  readonly layout: FlowLayout;
  readonly sample: FlowSample;
  readonly label: string;
  /** Draw edges and boxes only, without the travelling packet, for overlays that bring their own motion. */
  readonly quiet?: boolean;
  /** Drawn on top, in the diagram's coordinates. */
  readonly children?: ReactNode;
}

/** The drawn edge between two actors, in the same lanes the diagram uses. */
export function diagramSegment(layout: FlowLayout, from: string, to: string): Segment {
  const box = { halfW: layout.metrics.boxW / 2, halfH: layout.metrics.boxH / 2 };
  return edgeSegment(layout.placements[from], layout.placements[to], box, { lane: LANE, gap: EDGE_GAP });
}

function arrowHead(segment: Segment): string {
  const { start, end } = segment;
  const length = Math.hypot(end.x - start.x, end.y - start.y) || 1;
  const dir = { x: (end.x - start.x) / length, y: (end.y - start.y) / length };
  const normal = rightNormal(start, end);
  const base = { x: end.x - dir.x * ARROW_SIZE, y: end.y - dir.y * ARROW_SIZE };
  const wing = ARROW_SIZE * 0.6;
  return [
    `${end.x},${end.y}`,
    `${base.x + normal.x * wing},${base.y + normal.y * wing}`,
    `${base.x - normal.x * wing},${base.y - normal.y * wing}`,
  ].join(" ");
}

function latestLocalStep(steps: readonly FlowStep[], actorId: string, upto: number): number | null {
  for (let i = Math.min(upto, steps.length - 1); i >= 0; i -= 1) {
    if (!steps[i].to && steps[i].from === actorId) return i;
  }
  return null;
}

function StepBadge({ at, number, color, filled }: {
  readonly at: Point;
  readonly number: number;
  readonly color: string;
  readonly filled: boolean;
}): JSX.Element {
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <circle
        r={BADGE_RADIUS}
        style={{ fill: filled ? color : "var(--card)", stroke: color }}
        strokeWidth={1.5}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[11px] font-bold tabular-nums"
        style={{ fill: filled ? "var(--background)" : color }}
      >
        {number}
      </text>
    </g>
  );
}

function DiagramEdge({ segment, variant, state, badge, color, packetAt }: {
  readonly segment: Segment;
  /** Style of the step that last used (or is using) this edge. */
  readonly variant: StepVariant;
  readonly state: EdgeState;
  readonly badge: number | null;
  readonly color: string;
  readonly packetAt: Point | null;
}): JSX.Element {
  const stroke = state === "idle" ? "var(--muted-foreground)" : color;
  const opacity = state === "idle" ? 0.28 : state === "done" ? 0.55 : 0.4;
  const mid = pointAlong(segment, 0.5);
  const normal = rightNormal(segment.start, segment.end);
  const badgeAt = { x: mid.x + normal.x * BADGE_OFFSET, y: mid.y + normal.y * BADGE_OFFSET };
  return (
    <g>
      <line
        x1={segment.start.x}
        y1={segment.start.y}
        x2={segment.end.x}
        y2={segment.end.y}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeDasharray={variant === "response" ? RESPONSE_DASH : undefined}
        style={{ stroke, opacity }}
      />
      {packetAt && (
        <line
          x1={segment.start.x}
          y1={segment.start.y}
          x2={packetAt.x}
          y2={packetAt.y}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={variant === "response" ? RESPONSE_DASH : undefined}
          style={{ stroke: color }}
        />
      )}
      <polygon points={arrowHead(segment)} style={{ fill: stroke, opacity: state === "idle" ? 0.4 : 1 }} />
      {badge !== null && (
        <StepBadge at={badgeAt} number={badge + 1} color={color} filled={state === "active"} />
      )}
    </g>
  );
}

function DiagramActor({ actor, center, layout, involved, localBadge, localActive, ringProgress }: {
  readonly actor: FlowActor;
  readonly center: Point;
  readonly layout: FlowLayout;
  readonly involved: boolean;
  readonly localBadge: number | null;
  readonly localActive: boolean;
  readonly ringProgress: number;
}): JSX.Element {
  const { boxW, boxH } = layout.metrics;
  const { icon: Icon, color } = actorStyle(actor.kind);
  return (
    <g transform={`translate(${center.x - boxW / 2} ${center.y - boxH / 2})`}>
      <rect
        width={boxW}
        height={boxH}
        rx={BOX_RADIUS}
        strokeWidth={involved ? 2 : 1.25}
        className="transition-[stroke,filter] duration-300"
        style={{
          fill: "var(--card)",
          stroke: involved ? color : "var(--border)",
          filter: involved ? `drop-shadow(0 4px 14px ${tint(color, 35)})` : undefined,
        }}
      />
      {localActive && (
        <rect
          x={-5}
          y={-5}
          width={boxW + 10}
          height={boxH + 10}
          rx={BOX_RADIUS + 5}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - ringProgress}
          strokeWidth={2}
          strokeLinecap="round"
          style={{ fill: "none", stroke: color }}
        />
      )}
      <rect x={12} y={16} width={32} height={32} rx={9} style={{ fill: tint(color, 16) }} />
      <g transform="translate(18 22)" style={{ color }}>
        <Icon size={20} aria-hidden="true" />
      </g>
      <text x={54} y={actor.sublabel ? 29 : 37} className="fill-foreground text-[14px] font-semibold">
        {actor.label}
      </text>
      {actor.sublabel && (
        <text x={54} y={46} className="fill-muted-foreground text-[11px]">
          {actor.sublabel}
        </text>
      )}
      {localBadge !== null && (
        // pinned to the icon tile, inside the box, where no edge or edge badge can reach
        <StepBadge at={LOCAL_BADGE_AT} number={localBadge + 1} color={color} filled={localActive} />
      )}
    </g>
  );
}

function PayloadChip({ text, center, color, opacity = 1 }: {
  readonly text: string;
  readonly center: Point;
  readonly color: string;
  readonly opacity?: number;
}): JSX.Element {
  const size = chipSize(text, CHIP_FONT_SIZE);
  return (
    <g transform={`translate(${center.x - size.w / 2} ${center.y - size.h / 2})`} style={{ opacity }}>
      <rect width={size.w} height={size.h} rx={6} strokeWidth={1.25} style={{ fill: "var(--card)", stroke: color }} />
      <text
        x={size.w / 2}
        y={size.h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground font-mono text-[11px]"
      >
        {text}
      </text>
    </g>
  );
}

/**
 * The moving packet and its payload chip. On a vertical edge the chip rides on
 * the packet and is drawn over it; on a diagonal the chip parks mid-edge and the
 * packet passes over it.
 */
function TravellingPacket({ packet, segment, payload, color, canvasWidth, besideGap }: {
  readonly packet: Point;
  readonly segment: Segment;
  readonly payload?: string;
  readonly color: string;
  readonly canvasWidth: number;
  /** Keeps a chip beside a horizontal edge clear of the boxes. */
  readonly besideGap: number;
}): JSX.Element {
  const chip = payload ? (
    <PayloadChip
      text={payload}
      color={color}
      center={placeChip(packet, segment, chipSize(payload, CHIP_FONT_SIZE), canvasWidth, besideGap)}
    />
  ) : null;
  const dot = (
    <>
      <circle cx={packet.x} cy={packet.y} r={PACKET_RADIUS + 5} style={{ fill: tint(color, 22) }} />
      <circle cx={packet.x} cy={packet.y} r={PACKET_RADIUS} style={{ fill: color }} />
    </>
  );
  const packetOnTop = edgeAxis(segment) === "diagonal";
  return (
    <g>
      {packetOnTop ? chip : dot}
      {packetOnTop ? dot : chip}
    </g>
  );
}

/** Presentational: draws one moment of a flow. Every input is derived from flow time. */
export function FlowDiagram({ flow, layout, sample, label, quiet = false, children }: FlowDiagramProps): JSX.Element {
  const { metrics, placements, width, height } = layout;
  const edges = useMemo(() => travelEdges(flow.steps), [flow.steps]);
  const segments = useMemo(
    () => new Map(edges.map((edge) => [edge.key, diagramSegment(layout, edge.from, edge.to)])),
    [edges, layout],
  );
  const kindOf = useMemo(() => new Map(flow.actors.map((a) => [a.id, a.kind])), [flow.actors]);
  const colorOf = (actorId: string) => actorStyle(kindOf.get(actorId) ?? "external").color;

  const active = flow.steps[sample.index];
  const eased = easeInOutCubic(sample.progress);
  const activeKey = active.to && !quiet ? edgeKey(active.from, active.to) : null;
  const activeSegment = activeKey ? segments.get(activeKey) ?? null : null;
  const packet = activeSegment ? pointAlong(activeSegment, eased) : null;
  const senderColor = colorOf(active.from);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto block h-auto w-full select-none"
      style={{ maxWidth: width * MAX_UPSCALE }}
      role="img"
      aria-label={label}
    >
      {edges.map((edge) => {
        const segment = segments.get(edge.key);
        if (!segment) return null;
        const latest = latestStepOnEdge(flow.steps, edge.key, sample.index);
        const state: EdgeState = edge.key === activeKey ? "active" : latest !== null ? "done" : "idle";
        return (
          <DiagramEdge
            key={edge.key}
            segment={segment}
            variant={latest !== null ? flow.steps[latest].variant ?? "request" : edge.variant}
            state={state}
            badge={latest}
            color={colorOf(edge.from)}
            packetAt={state === "active" ? packet : null}
          />
        );
      })}
      {flow.actors.map((actor) => {
        const localActive = !quiet && !active.to && active.from === actor.id;
        return (
          <DiagramActor
            key={actor.id}
            actor={actor}
            center={placements[actor.id]}
            layout={layout}
            involved={!quiet && (active.from === actor.id || active.to === actor.id)}
            localBadge={latestLocalStep(flow.steps, actor.id, sample.index)}
            localActive={localActive}
            ringProgress={eased}
          />
        );
      })}
      {packet && activeSegment && (
        <TravellingPacket
          packet={packet}
          segment={activeSegment}
          payload={active.payload}
          color={senderColor}
          canvasWidth={width}
          besideGap={metrics.boxH / 2 - LANE + CHIP_BOX_CLEARANCE}
        />
      )}
      {!quiet && !active.to && active.payload && (
        <PayloadChip
          text={active.payload}
          color={senderColor}
          opacity={Math.min(1, sample.progress * 4)}
          // hangs from the box's bottom edge like a tag: clear of the corner badge
          // and of the edges, whichever side of the box they leave from
          center={placeChipCentered(
            { x: placements[active.from].x, y: placements[active.from].y + metrics.boxH / 2 },
            chipSize(active.payload, CHIP_FONT_SIZE),
            width,
          )}
        />
      )}
      {children}
    </svg>
  );
}
