import { useMemo } from "react";
import { layoutFlow, type FlowLayout, type Orientation } from "@/lib/flow/geometry";
import type { FlowActor } from "@/lib/flow/types";
import { actorStyle } from "./actor-style";

/**
 * Smallest scale the wide layout may shrink to before the grid transposes into
 * a column. Below it, 14px labels drop under about 11px.
 */
const MIN_WIDE_SCALE = 0.8;

/** Wide while a diagram `wideWidth` units across stays legible at `width` pixels, else narrow. */
export function pickOrientation(wideWidth: number, width: number | null): Orientation {
  return width !== null && width < wideWidth * MIN_WIDE_SCALE ? "narrow" : "wide";
}

/** The wide layout while it stays legible at `width`, else the narrow one. */
export function useFlowLayout(actors: readonly FlowActor[], width: number | null): FlowLayout {
  const wide = useMemo(() => layoutFlow(actors, "wide"), [actors]);
  const narrow = useMemo(() => layoutFlow(actors, "narrow"), [actors]);
  return pickOrientation(wide.width, width) === "wide" ? wide : narrow;
}

/** Each actor's hue, looked up by id. */
export function useColorOf(actors: readonly FlowActor[]): (actorId: string) => string {
  return useMemo(() => {
    const kinds = new Map(actors.map((a) => [a.id, a.kind]));
    return (actorId: string) => actorStyle(kinds.get(actorId) ?? "external").color;
  }, [actors]);
}
