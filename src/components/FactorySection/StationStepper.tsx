import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import {
  DeliveryBox01Icon,
  NoteIcon,
  Search01Icon,
} from "@/components/ui/icons";
import { STAGE_ORDER, type StageId } from "./factoryTimeline";

/** Same hues as the 3D station markers (factoryModels STAGE_COLOR). */
export const STATION_HEX: Readonly<Record<StageId, string>> = {
  conveyor: "#818cf8",
  laser: "#22d3ee",
  robot: "#e879f9",
};

interface StationCopy {
  name: string;
  role: string;
  description: string;
  icon: ReactNode;
}

function stationCopy(id: StageId): StationCopy {
  switch (id) {
    case "conveyor":
      return {
        name: translate({
          id: "factory.station.conveyor.name",
          message: "Conveyor",
        }),
        role: translate({
          id: "factory.station.conveyor.role",
          message: "Draft",
        }),
        description: translate({
          id: "factory.station.conveyor.description",
          message: "Rough ideas roll in as draft blocks.",
        }),
        icon: <NoteIcon size={16} />,
      };
    case "laser":
      return {
        name: translate({
          id: "factory.station.laser.name",
          message: "Laser Sensor",
        }),
        role: translate({
          id: "factory.station.laser.role",
          message: "Review",
        }),
        description: translate({
          id: "factory.station.laser.description",
          message: "Each draft is scanned and polished.",
        }),
        icon: <Search01Icon size={16} />,
      };
    case "robot":
      return {
        name: translate({
          id: "factory.station.robot.name",
          message: "Robot Arm",
        }),
        role: translate({
          id: "factory.station.robot.role",
          message: "Publish",
        }),
        description: translate({
          id: "factory.station.robot.description",
          message: "Finished posts get stacked and shipped.",
        }),
        icon: <DeliveryBox01Icon size={16} />,
      };
  }
}

interface StationStepperProps {
  active: StageId;
  focus: StageId | null;
  onSelect: (id: StageId) => void;
  /** Registers each station's progress bar so the scene can drive it without re-rendering. */
  barRef: (id: StageId, el: HTMLSpanElement | null) => void;
}

/** The chain of stations under the scene: highlights the working station, click to focus it. */
export function StationStepper({
  active,
  focus,
  onSelect,
  barRef,
}: StationStepperProps) {
  return (
    <ol className="!m-0 grid list-none grid-cols-3 border-t border-white/10 bg-[#0b1020]/90 !p-0">
      {STAGE_ORDER.map((id, index) => {
        const copy = stationCopy(id);
        const isActive = id === active;
        const isFocused = id === focus;
        return (
          <li
            key={id}
            className={clsx("!m-0", index > 0 && "border-l border-white/10")}
            style={{ "--station": STATION_HEX[id] } as CSSProperties}
          >
            <button
              type="button"
              aria-pressed={isFocused}
              onClick={() => onSelect(id)}
              className={clsx(
                "group relative flex h-full min-h-20 w-full flex-col gap-1.5 px-3 pt-4 pb-3 text-left transition-colors duration-300 outline-none sm:px-5 sm:pt-5 sm:pb-4",
                "focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[var(--station)] focus-visible:ring-inset",
                isActive || isFocused
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.04]",
                isFocused && "ring-1 ring-[var(--station)] ring-inset",
              )}
            >
              {/* chain segment: fills as the block moves through this station */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-white/10"
              >
                <span
                  ref={(el) => barRef(id, el)}
                  className="absolute inset-0 origin-left scale-x-0 bg-[var(--station)] shadow-[0_0_12px_var(--station)]"
                />
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={clsx(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border transition-[background-color,box-shadow,color] duration-300",
                    isActive
                      ? "border-transparent bg-[var(--station)] text-slate-950 shadow-[0_0_0_4px_color-mix(in_oklch,var(--station)_25%,transparent)]"
                      : "border-white/15 text-[var(--station)]",
                  )}
                >
                  {copy.icon}
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-400">
                  0{index + 1}
                </span>
                <span className="ml-auto hidden rounded-full bg-white/[0.08] px-2 py-0.5 text-xs font-medium text-slate-300 sm:inline">
                  {copy.role}
                </span>
              </span>
              <span
                className={clsx(
                  "text-sm font-semibold leading-tight transition-colors sm:text-base",
                  isActive ? "text-white" : "text-slate-200",
                )}
              >
                {copy.name}
              </span>
              <span className="hidden text-sm leading-snug text-slate-400 sm:block">
                {copy.description}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
