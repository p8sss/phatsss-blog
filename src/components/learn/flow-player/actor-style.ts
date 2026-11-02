import type { ActorKind } from "@/lib/flow/types";
import {
  ApiIcon,
  CubeIcon,
  DatabaseIcon,
  FireIcon,
  GlobeIcon,
  LaptopIcon,
  Layers02Icon,
} from "@/components/ui/icons";

type IconComponent = typeof LaptopIcon;

export interface ActorStyle {
  readonly icon: IconComponent;
  /** A theme token, so each kind keeps one hue in both color modes. */
  readonly color: string;
}

/** One hue per kind of actor. Packets and edges take the sender's hue. */
const ACTOR_STYLES: Readonly<Record<ActorKind, ActorStyle>> = {
  client: { icon: LaptopIcon, color: "var(--galaxy-teal)" },
  server: { icon: ApiIcon, color: "var(--galaxy-violet)" },
  database: { icon: DatabaseIcon, color: "var(--galaxy-amber)" },
  cache: { icon: FireIcon, color: "var(--galaxy-ember)" },
  queue: { icon: Layers02Icon, color: "var(--galaxy-rose)" },
  service: { icon: CubeIcon, color: "var(--galaxy-violet)" },
  external: { icon: GlobeIcon, color: "var(--muted-foreground)" },
};

export function actorStyle(kind: ActorKind): ActorStyle {
  return ACTOR_STYLES[kind];
}

/** A translucent version of a token color, for fills and glows. */
export function tint(color: string, percent: number): string {
  return `color-mix(in oklch, ${color} ${percent}%, transparent)`;
}
