import type { JSX } from "react";
import { translate } from "@docusaurus/Translate";

function LegendLine({ dashed, label }: { readonly dashed?: boolean; readonly label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="22" height="6" aria-hidden="true">
        <line
          x1="1"
          y1="3"
          x2="21"
          y2="3"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray={dashed ? "4 4" : undefined}
          className="stroke-muted-foreground"
        />
      </svg>
      {label}
    </span>
  );
}

/** Explains the diagram's line and ring conventions. */
export function FlowLegend(): JSX.Element {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <LegendLine label={translate({ id: "learn.flow.legend.request", message: "Request" })} />
      <LegendLine dashed label={translate({ id: "learn.flow.legend.response", message: "Response" })} />
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="size-3 rounded-[4px] border-[1.5px] border-muted-foreground" />
        {translate({ id: "learn.flow.legend.local", message: "Work inside a service" })}
      </span>
    </span>
  );
}
