import { memo, type JSX } from "react";
import clsx from "clsx";
import { stepStatus, type FlowSample } from "@/lib/flow/timeline";
import type { FlowStep } from "@/lib/flow/types";

interface FlowStepListProps {
  readonly steps: readonly FlowStep[];
  readonly activeIndex: number;
  readonly colorOf: (actorId: string) => string;
  readonly onSelect: (index: number) => void;
}

/**
 * The text side of the diagram. Titles are always listed; a step's explanation
 * appears once the flow reaches it, so the write-up builds as the flow plays.
 * Upcoming explanations are only visually hidden, so screen readers, search and
 * the server-rendered page still get the whole walkthrough.
 */
export const FlowStepList = memo(function FlowStepList({
  steps,
  activeIndex,
  colorOf,
  onSelect,
}: FlowStepListProps): JSX.Element {
  const position: FlowSample = { index: activeIndex, progress: 0 };
  return (
    <ol className="!m-0 !list-none border-t border-separator !p-0">
      {steps.map((step, index) => {
        const status = stepStatus(index, position);
        const color = colorOf(step.from);
        const isActive = status === "active";
        return (
          <li key={step.id} className="!m-0 border-b border-separator last:border-b-0">
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-current={isActive ? "step" : undefined}
              className={clsx(
                "glass-focus flex w-full gap-3 px-3 py-3 text-left transition-colors duration-200 sm:px-4",
                isActive ? "bg-fill" : "hover:bg-fill/60",
              )}
            >
              <span
                className={clsx(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tabular-nums transition-colors",
                  !isActive && "border-border",
                  status === "upcoming" ? "text-muted-foreground" : "text-foreground",
                )}
                // only the active step takes the sender's hue, matching the diagram's packet
                style={isActive ? { background: color, borderColor: color, color: "var(--background)" } : undefined}
              >
                {index + 1}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span
                  className={clsx(
                    "text-sm font-semibold leading-snug",
                    status === "upcoming" ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {step.title}
                </span>
                <span
                  className={clsx(
                    "text-sm leading-relaxed text-muted-foreground",
                    status === "upcoming" && "sr-only",
                  )}
                >
                  {step.detail}
                </span>
                {step.payload && (
                  <code
                    className={clsx(
                      "w-fit max-w-full truncate rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.8rem] text-foreground",
                      status === "upcoming" && "sr-only",
                    )}
                  >
                    {step.payload}
                  </code>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
});
