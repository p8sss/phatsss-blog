import type { JSX, ReactNode } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import { Button } from "@/components/glass/button";
import { Alert02Icon, ArrowRight01Icon, CheckmarkCircle01Icon } from "@/components/ui/icons";
import type { JourneyStage } from "@/data/home/request-journey";
import type { FlowStep } from "@/lib/flow/types";

export type JourneyPhase = "walk" | "surge" | "verdict";

interface NarrationProps {
  readonly phase: JourneyPhase;
  readonly stage: JourneyStage;
  readonly step: FlowStep;
  readonly stepIndex: number;
  readonly next: JourneyStage;
  readonly labelOf: (actorId: string) => string;
  readonly onSurge: () => void;
  readonly onAdvance: () => void;
}

function surgeHint(stage: JourneyStage, labelOf: (actorId: string) => string): string {
  const { bottleneck, guards = [], routes } = stage.surge;
  const load = bottleneck
    ? translate(
        { id: "journey.surge.hint.bottleneck", message: "Watch the {name} box: once it saturates, requests fail there." },
        { name: labelOf(bottleneck) },
      )
    : translate({ id: "journey.surge.hint.headroom", message: "Every tier has headroom to spare." });
  if (!routes.some((route) => route.attack)) return load;
  const attacks =
    guards.length > 0
      ? translate({ id: "journey.surge.hint.guarded", message: "Red dots are attacks; green rings mark where guards stop them." })
      : translate({ id: "journey.surge.hint.unguarded", message: "Red dots are bots, and nothing in front of the API can tell them apart." });
  return `${load} ${attacks}`;
}

function Eyebrow({ children, className }: { readonly children: ReactNode; readonly className?: string }): JSX.Element {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide", className)}>
      {children}
    </span>
  );
}

function WalkText({ stage, step, stepIndex }: Pick<NarrationProps, "stage" | "step" | "stepIndex">): JSX.Element {
  return (
    <>
      <Eyebrow className="text-muted-foreground">
        {translate(
          { id: "journey.walk.eyebrow", message: "One request · step {n} of {total}" },
          { n: stepIndex + 1, total: stage.flow.steps.length },
        )}
      </Eyebrow>
      <p className="!m-0 text-base font-semibold text-foreground">{step.title}</p>
      <p className="!m-0 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
    </>
  );
}

function SurgeText({ stage, labelOf }: Pick<NarrationProps, "stage" | "labelOf">): JSX.Element {
  return (
    <>
      <Eyebrow className="text-destructive-ink">
        <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-destructive motion-reduce:animate-none" />
        {translate({ id: "journey.surge.eyebrow", message: "Traffic surge" })}
      </Eyebrow>
      <p className="!m-0 text-base font-semibold text-foreground">{stage.surgeTitle}</p>
      <p className="!m-0 text-sm leading-relaxed text-muted-foreground">{surgeHint(stage, labelOf)}</p>
    </>
  );
}

function VerdictText({ stage }: Pick<NarrationProps, "stage">): JSX.Element {
  const holds = stage.verdict.tone === "holds";
  return (
    <>
      <Eyebrow className={holds ? "text-success-ink" : "text-destructive-ink"}>
        {holds ? <CheckmarkCircle01Icon size={14} aria-hidden="true" /> : <Alert02Icon size={14} aria-hidden="true" />}
        {holds
          ? translate({ id: "journey.verdict.holds", message: "It holds" })
          : translate({ id: "journey.verdict.breaks", message: "What breaks" })}
      </Eyebrow>
      <p className="!m-0 text-base font-semibold text-foreground">{stage.verdict.title}</p>
      <p className="!m-0 text-sm leading-relaxed text-muted-foreground">{stage.verdict.detail}</p>
    </>
  );
}

function Action({ phase, stage, next, onSurge, onAdvance }: Omit<NarrationProps, "step" | "stepIndex" | "labelOf">) {
  if (phase === "walk") {
    return (
      <Button variant="ghost" size="sm" onClick={onSurge}>
        {translate({ id: "journey.action.surge", message: "Skip to traffic" })}
        <ArrowRight01Icon />
      </Button>
    );
  }
  if (phase === "surge") return null;
  if (stage.verdict.tone === "holds") {
    return (
      <Button variant="tinted" size="sm" onClick={onAdvance}>
        {translate({ id: "journey.action.restart", message: "Start over" })}
      </Button>
    );
  }
  return (
    <Button size="sm" onClick={onAdvance}>
      {translate({ id: "journey.action.fix", message: "Fix it: {stage}" }, { stage: next.label })}
      <ArrowRight01Icon />
    </Button>
  );
}

/**
 * What the diagram is doing right now, in words: the active step, then the
 * surge, then what broke. Its height is reserved so the page doesn't jump as
 * the text changes.
 */
export function Narration(props: NarrationProps): JSX.Element {
  const { phase } = props;
  return (
    <div className="flex min-h-44 flex-col gap-3 border-t border-separator px-3 py-3 sm:min-h-32 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-4">
      <div className="flex min-w-0 max-w-2xl flex-col gap-1">
        {phase === "walk" && <WalkText {...props} />}
        {phase === "surge" && <SurgeText {...props} />}
        {phase === "verdict" && <VerdictText {...props} />}
      </div>
      <div className="shrink-0">
        <Action {...props} />
      </div>
    </div>
  );
}
