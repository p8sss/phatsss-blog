import type { JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { ChevronRightIcon } from "@/components/ui/icons";
import type { FlowStep } from "@/lib/flow/types";
import { FlowStepList } from "./FlowStepList";

interface FlowActivityLogProps {
  readonly steps: readonly FlowStep[];
  readonly activeIndex: number;
  readonly colorOf: (actorId: string) => string;
  readonly onSelect: (index: number) => void;
}

/**
 * The step list behind a disclosure, closed by default, for pages where the
 * diagram is the point and the write-up is there on request. A native
 * `<details>` keeps the steps in the server-rendered HTML.
 */
export function FlowActivityLog({ steps, ...listProps }: FlowActivityLogProps): JSX.Element {
  return (
    <details className="group/log !m-0 border-t border-separator">
      <summary className="glass-focus flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-4 [&::-webkit-details-marker]:hidden">
        <ChevronRightIcon
          size={16}
          aria-hidden="true"
          className="transition-transform duration-200 group-open/log:rotate-90 motion-reduce:transition-none"
        />
        {translate({ id: "learn.flow.activityLog", message: "Activity log" })}
        <span className="font-mono text-xs tabular-nums">
          {translate({ id: "learn.flow.activityLog.count", message: "{count} steps" }, { count: steps.length })}
        </span>
      </summary>
      <FlowStepList steps={steps} {...listProps} />
    </details>
  );
}
