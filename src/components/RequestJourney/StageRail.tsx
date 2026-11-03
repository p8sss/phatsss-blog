import type { JSX } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import type { JourneyStage } from "@/data/home/request-journey";

interface StageRailProps {
  readonly stages: readonly JourneyStage[];
  readonly index: number;
  /** 0 to 1 through the current stage, walk and surge together. */
  readonly progress: number;
  readonly onSelect: (index: number) => void;
}

/** The five stages as one track; the current stage fills as it plays. */
export function StageRail({ stages, index, progress, onSelect }: StageRailProps): JSX.Element {
  return (
    <nav aria-label={translate({ id: "journey.stages", message: "Stages" })} className="border-b border-separator">
      <ol className="!m-0 grid !list-none grid-cols-5 !p-0">
        {stages.map((stage, i) => {
          const current = i === index;
          const done = i < index;
          return (
            <li key={stage.id} className="!m-0 min-w-0">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={current ? "step" : undefined}
                className={clsx(
                  "glass-focus group/stage relative flex w-full flex-col items-center gap-1 px-1 pb-3 pt-3 text-center transition-colors duration-200 sm:flex-row sm:justify-center sm:gap-2",
                  current ? "text-foreground" : "text-muted-foreground hover:bg-fill/60 hover:text-foreground",
                )}
              >
                <span
                  className={clsx(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tabular-nums transition-colors",
                    current && "border-primary bg-primary text-primary-foreground",
                    done && "border-primary/50 text-primary-ink",
                    !current && !done && "border-border",
                  )}
                >
                  {i + 1}
                </span>
                <span className="w-full truncate text-[11px] font-semibold leading-tight sm:w-auto sm:text-sm">
                  {stage.label}
                </span>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-transparent">
                  <span
                    className="absolute inset-0 origin-left bg-primary"
                    style={{ transform: `scaleX(${current ? progress : done ? 1 : 0})`, opacity: done ? 0.35 : 1 }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
