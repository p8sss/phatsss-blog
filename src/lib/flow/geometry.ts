/**
 * Pure layout for a flow diagram, in SVG user units. Actors sit on a grid; the
 * narrow layout transposes it so a left-to-right row becomes a top-to-bottom column.
 */
import type { FlowActor } from "./types";

export type Orientation = "wide" | "narrow";

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Segment {
  readonly start: Point;
  readonly end: Point;
}

export interface LayoutMetrics {
  readonly cellW: number;
  readonly cellH: number;
  readonly boxW: number;
  readonly boxH: number;
  readonly padX: number;
  /** Room above the top row for step badges and upper-lane chips. */
  readonly padTop: number;
  /** Room below the bottom row for edge step badges. */
  readonly padBottom: number;
  readonly minWidth: number;
}

export const WIDE_METRICS: LayoutMetrics = {
  cellW: 270,
  cellH: 170,
  boxW: 150,
  boxH: 64,
  padX: 36,
  padTop: 32,
  padBottom: 28,
  minWidth: 0,
};

export const NARROW_METRICS: LayoutMetrics = {
  cellW: 220,
  cellH: 176,
  boxW: 176,
  boxH: 64,
  padX: 16,
  padTop: 24,
  padBottom: 20,
  minWidth: 320,
};

export interface FlowLayout {
  readonly orientation: Orientation;
  readonly metrics: LayoutMetrics;
  readonly width: number;
  readonly height: number;
  readonly placements: Readonly<Record<string, Point>>;
}

export function metricsFor(orientation: Orientation): LayoutMetrics {
  return orientation === "wide" ? WIDE_METRICS : NARROW_METRICS;
}

function gridCell(actor: FlowActor, orientation: Orientation) {
  return orientation === "wide"
    ? { col: actor.col, row: actor.row }
    : { col: actor.row, row: actor.col };
}

export function layoutFlow(
  actors: readonly FlowActor[],
  orientation: Orientation,
): FlowLayout {
  const metrics = metricsFor(orientation);
  const cells = actors.map((actor) => ({ id: actor.id, ...gridCell(actor, orientation) }));
  const maxCol = Math.max(0, ...cells.map((c) => c.col));
  const maxRow = Math.max(0, ...cells.map((c) => c.row));
  const contentW = maxCol * metrics.cellW + metrics.boxW;
  const width = Math.max(contentW + 2 * metrics.padX, metrics.minWidth);
  const offsetX = (width - contentW) / 2;
  const height = metrics.padTop + maxRow * metrics.cellH + metrics.boxH + metrics.padBottom;
  const placements = Object.fromEntries(
    cells.map((c) => [
      c.id,
      {
        x: offsetX + c.col * metrics.cellW + metrics.boxW / 2,
        y: metrics.padTop + c.row * metrics.cellH + metrics.boxH / 2,
      },
    ]),
  );
  return { orientation, metrics, width, height, placements };
}

/** Where the ray from `center` toward `toward` leaves a box of the given half size. */
export function clipToBox(center: Point, toward: Point, halfW: number, halfH: number): Point {
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;
  if (dx === 0 && dy === 0) return center;
  const scaleX = dx === 0 ? Infinity : halfW / Math.abs(dx);
  const scaleY = dy === 0 ? Infinity : halfH / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);
  return { x: center.x + dx * scale, y: center.y + dy * scale };
}

/** Unit normal on the right-hand side of travel (SVG y points down). */
export function rightNormal(from: Point, to: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: -dy / length, y: dx / length };
}

export function offsetPoint(point: Point, normal: Point, distance: number): Point {
  return { x: point.x + normal.x * distance, y: point.y + normal.y * distance };
}

export interface BoxHalfSize {
  readonly halfW: number;
  readonly halfH: number;
}

/**
 * The drawn edge between two actor centers. Each direction keeps to its own
 * right-hand lane, so a request and its response never overlap.
 */
export function edgeSegment(
  from: Point,
  to: Point,
  box: BoxHalfSize,
  options: { readonly lane: number; readonly gap: number },
): Segment {
  const normal = rightNormal(from, to);
  const a = offsetPoint(from, normal, options.lane);
  const b = offsetPoint(to, normal, options.lane);
  const halfW = box.halfW + options.gap;
  const halfH = box.halfH + options.gap;
  return { start: clipToBox(a, b, halfW, halfH), end: clipToBox(b, a, halfW, halfH) };
}

export function pointAlong(segment: Segment, t: number): Point {
  return {
    x: segment.start.x + (segment.end.x - segment.start.x) * t,
    y: segment.start.y + (segment.end.y - segment.start.y) * t,
  };
}

/** Monospace glyphs are about 0.6em wide, so a chip can be sized without measuring. */
const MONO_CHAR_EM = 0.6;
const CHIP_PAD_X = 8;
const CHIP_PAD_Y = 5;
/** Space between a chip and the packet or box it labels. */
export const CHIP_GAP = 10;
const CHIP_MARGIN = 4;

export interface Size {
  readonly w: number;
  readonly h: number;
}

export function chipSize(text: string, fontSize: number): Size {
  return {
    w: text.length * fontSize * MONO_CHAR_EM + 2 * CHIP_PAD_X,
    h: fontSize + 2 * CHIP_PAD_Y,
  };
}

/** How far from the axis an edge may lean and still count as horizontal or vertical. */
const AXIS_ALIGNED = 0.9;

export type EdgeAxis = "horizontal" | "vertical" | "diagonal";

export function edgeAxis(segment: Segment): EdgeAxis {
  const normal = rightNormal(segment.start, segment.end);
  if (Math.abs(normal.y) >= AXIS_ALIGNED) return "horizontal";
  if (Math.abs(normal.x) >= AXIS_ALIGNED) return "vertical";
  return "diagonal";
}

/**
 * Center of the payload chip for a packet at `anchor` on `segment`.
 * - Horizontal edge: rides beside the lane, on its outer side.
 * - Vertical edge: no room beside it, so the chip itself travels, held inside
 *   the gap between the two boxes.
 * - Diagonal edge: parks at the midpoint, which always falls in the clear gap
 *   between grid rows; near either end it would cover a box.
 * Either way it is pulled back inside the canvas.
 */
export function placeChip(
  anchor: Point,
  segment: Segment,
  size: Size,
  canvasWidth: number,
  /** Space between the lane and the chip beside a horizontal edge. */
  besideGap = CHIP_GAP,
): Point {
  const axis = edgeAxis(segment);
  const center = (() => {
    if (axis === "horizontal") {
      return offsetPoint(anchor, rightNormal(segment.start, segment.end), size.h / 2 + besideGap);
    }
    if (axis === "vertical") {
      const top = Math.min(segment.start.y, segment.end.y) + size.h / 2;
      const bottom = Math.max(segment.start.y, segment.end.y) - size.h / 2;
      return { x: anchor.x, y: Math.min(Math.max(anchor.y, top), bottom) };
    }
    return pointAlong(segment, 0.5);
  })();
  return { x: clampChipX(center.x, size, canvasWidth), y: center.y };
}

/** A chip centered on a point, pulled back inside the canvas horizontally. */
export function placeChipCentered(center: Point, size: Size, canvasWidth: number): Point {
  return { x: clampChipX(center.x, size, canvasWidth), y: center.y };
}

function clampChipX(x: number, size: Size, canvasWidth: number): number {
  const minX = size.w / 2 + CHIP_MARGIN;
  const maxX = canvasWidth - size.w / 2 - CHIP_MARGIN;
  return Math.min(Math.max(x, minX), Math.max(minX, maxX));
}
