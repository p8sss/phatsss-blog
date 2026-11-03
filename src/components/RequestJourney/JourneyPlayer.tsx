import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { Card } from "@/components/glass/card";
import { FlowActivityLog } from "@/components/learn/flow-player/FlowActivityLog";
import { FlowControls } from "@/components/learn/flow-player/FlowControls";
import { FlowDiagram } from "@/components/learn/flow-player/FlowDiagram";
import { FlowLegend } from "@/components/learn/flow-player/FlowLegend";
import { useFlowClock } from "@/components/learn/flow-player/use-flow-clock";
import { pickOrientation, useColorOf } from "@/components/learn/flow-player/use-flow-layout";
import { useScrollAutoplay } from "@/components/learn/flow-player/use-scroll-autoplay";
import { CheckIcon } from "@/components/ui/icons";
import type { JourneyStage } from "@/data/home/request-journey";
import { useElementWidth } from "@/hooks/use-element-width";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { fitLayout, layoutFlow, type Orientation, type Size } from "@/lib/flow/geometry";
import { buildTimeline, pacedSteps, sampleAt, stepHoldTime, stepStartTime } from "@/lib/flow/timeline";
import { loadAt, metricsAt, planDots, SURGE_SECONDS, trafficAt } from "@/lib/flow/traffic";
import { MetricsStrip } from "./MetricsStrip";
import { Narration, type JourneyPhase } from "./Narration";
import { StageRail } from "./StageRail";
import { NewActorMarks, TrafficLayer } from "./TrafficLayer";

/** The home page plays flows faster than a learn page: it is an overview, not a lesson. */
const PACE = 0.7;
/** How long a verdict stays up before the next stage starts on its own. */
const VERDICT_HOLD_MS = 5500;
/** Seconds the "new" tags stay on boxes a stage adds, the last of them fading. */
const NEW_MARK_SECONDS = 4;

interface JourneyPlayerProps {
  readonly stages: readonly JourneyStage[];
  readonly index: number;
  /** Move to the next stage by itself once a verdict has been read. */
  readonly autoAdvance: boolean;
  readonly onSelect: (index: number) => void;
  readonly onAdvance: () => void;
  /** The reader took control, so stop advancing on their behalf. */
  readonly onInteract: () => void;
}

/** The smallest canvas that fits every stage, per orientation, so the diagram never resizes between stages. */
function frameOf(stages: readonly JourneyStage[], orientation: Orientation): Size {
  const layouts = stages.map((stage) => layoutFlow(stage.flow.actors, orientation));
  return { w: Math.max(...layouts.map((l) => l.width)), h: Math.max(...layouts.map((l) => l.height)) };
}

function addedActors(stage: JourneyStage, previous: JourneyStage | null): readonly string[] {
  if (!previous) return [];
  const before = new Set(previous.flow.actors.map((actor) => actor.id));
  return stage.flow.actors.filter((actor) => !before.has(actor.id)).map((actor) => actor.id);
}

function phaseAt(time: number, walkEnd: number, total: number): JourneyPhase {
  if (time >= total) return "verdict";
  return time >= walkEnd ? "surge" : "walk";
}

function PracticeList({ practices }: { readonly practices: readonly string[] }): JSX.Element {
  return (
    <ul
      aria-label={translate({ id: "journey.practices", message: "In place at this stage" })}
      className="!m-0 flex !list-none flex-wrap gap-1.5 !px-3 !pb-0 !pt-3 sm:!px-4"
    >
      {practices.map((practice) => (
        <li key={practice} className="!m-0 inline-flex items-center gap-1 rounded-full bg-fill px-2.5 py-1 text-xs font-medium text-foreground">
          <CheckIcon size={12} aria-hidden="true" className="text-success-ink" />
          {practice}
        </li>
      ))}
    </ul>
  );
}

/** One stage of the journey: a single request walked step by step, then a traffic surge, then the verdict. */
export function JourneyPlayer({
  stages,
  index,
  autoAdvance,
  onSelect,
  onAdvance,
  onInteract,
}: JourneyPlayerProps): JSX.Element {
  const stage = stages[index];
  const previous = index > 0 ? stages[index - 1] : null;
  const next = stages[(index + 1) % stages.length];
  const rootRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const width = useElementWidth(rootRef);
  const inView = useInView(diagramRef);
  const [announcement, setAnnouncement] = useState("");

  const flow = useMemo(() => ({ ...stage.flow, steps: pacedSteps(stage.flow.steps, PACE) }), [stage]);
  const timeline = useMemo(() => buildTimeline(flow.steps), [flow.steps]);
  const walkEnd = timeline.total;
  const total = walkEnd + SURGE_SECONDS;
  const clock = useFlowClock(total);
  useScrollAutoplay(inView, reducedMotion, clock);

  const frames = useMemo(() => ({ wide: frameOf(stages, "wide"), narrow: frameOf(stages, "narrow") }), [stages]);
  const orientation = pickOrientation(frames.wide.w, width);
  const layout = useMemo(
    () => fitLayout(layoutFlow(flow.actors, orientation), frames[orientation]),
    [flow.actors, orientation, frames],
  );
  const colorOf = useColorOf(flow.actors);
  const labelOf = useCallback(
    (actorId: string) => flow.actors.find((actor) => actor.id === actorId)?.label ?? actorId,
    [flow.actors],
  );
  const dots = useMemo(() => planDots(stage.surge), [stage.surge]);
  const added = useMemo(() => addedActors(stage, previous), [stage, previous]);

  const { time, playing, play, pause, playRange, seek } = clock;
  const phase = phaseAt(time, walkEnd, total);
  const inSurge = phase !== "walk";
  const surgeTime = Math.max(0, time - walkEnd);
  const load = inSurge ? loadAt(surgeTime) : 0;
  const sample = sampleAt(timeline, time);
  // reduced motion skips travel: every step is shown in its finished state
  const shown = reducedMotion ? { ...sample, progress: 1 } : sample;
  const active = flow.steps[sample.index];
  const visibleDots = inSurge && !reducedMotion ? trafficAt(dots, surgeTime) : [];
  const markOpacity = inSurge ? 0 : Math.min(1, Math.max(0, NEW_MARK_SECONDS - time));

  const goToStep = useCallback(
    (target: number) => {
      if (target < 0 || target >= flow.steps.length) return;
      onInteract();
      setAnnouncement(
        translate(
          { id: "learn.flow.stepAnnouncement", message: "Step {n} of {total}: {title}" },
          { n: target + 1, total: flow.steps.length, title: flow.steps[target].title },
        ),
      );
      if (reducedMotion) {
        pause();
        seek(stepHoldTime(timeline, target));
        return;
      }
      playRange(stepStartTime(timeline, target), stepHoldTime(timeline, target));
    },
    [flow.steps, onInteract, reducedMotion, pause, seek, playRange, timeline],
  );

  const startSurge = useCallback(() => {
    onInteract();
    if (reducedMotion) {
      pause();
      seek(total);
      return;
    }
    playRange(walkEnd, total);
  }, [onInteract, reducedMotion, pause, seek, playRange, walkEnd, total]);

  const toggle = useCallback(() => {
    onInteract();
    if (playing) pause();
    else play();
  }, [onInteract, playing, pause, play]);

  // A new stage starts from its first step; the card stays mounted so focus survives.
  // Layout effect: the reset lands before paint, so the new stage never flashes the
  // old stage's clock (its verdict and peak traffic) for a frame.
  const shownStage = useRef(stage.id);
  useLayoutEffect(() => {
    if (shownStage.current === stage.id) return;
    shownStage.current = stage.id;
    seek(0);
    if (!reducedMotion) play();
    setAnnouncement(
      translate(
        { id: "journey.announce.stage", message: "Stage {n}: {label}. {title}" },
        { n: index + 1, label: stage.label, title: stage.flow.title },
      ),
    );
  }, [stage, index, seek, play, reducedMotion]);

  // the verdict is each stage's point, so screen readers hear it however it was reached
  useEffect(() => {
    if (phase === "verdict") setAnnouncement(`${stage.verdict.title}. ${stage.verdict.detail}`);
  }, [phase, stage.verdict]);

  useEffect(() => {
    if (phase !== "verdict" || !autoAdvance || !inView || reducedMotion) return;
    const timer = window.setTimeout(onAdvance, VERDICT_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [phase, autoAdvance, inView, reducedMotion, onAdvance]);

  return (
    <Card material="solid" className="gap-0 py-0" role="group" aria-label={stage.flow.title}>
      <StageRail stages={stages} index={index} progress={total > 0 ? time / total : 0} onSelect={onSelect} />
      <PracticeList practices={stage.practices} />
      <figure ref={rootRef} className="!m-0 flex flex-col">
        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 pt-3 sm:px-4">
          <span className="text-sm font-semibold text-foreground">{flow.title}</span>
          <FlowLegend />
        </figcaption>
        <div ref={diagramRef} className="px-1 py-2 sm:px-3">
          {/* keyed so the entrance animation replays for each stage */}
          <div key={stage.id} className="duration-500 animate-in fade-in-0 zoom-in-[0.98] motion-reduce:animate-none">
            <FlowDiagram
              flow={flow}
              layout={layout}
              sample={shown}
              quiet={inSurge}
              label={inSurge ? `${flow.title}. ${stage.surgeTitle}` : `${flow.title}. ${active.title}`}
            >
              <NewActorMarks layout={layout} actorIds={added} opacity={markOpacity} colorOf={colorOf} />
              {inSurge && (
                <TrafficLayer
                  layout={layout}
                  dots={visibleDots}
                  load={load}
                  bottleneck={stage.surge.bottleneck}
                  guards={stage.surge.guards}
                  colorOf={colorOf}
                />
              )}
            </FlowDiagram>
          </div>
        </div>
        <MetricsStrip
          metrics={metricsAt(stage.surge.metrics, load)}
          underAttack={stage.surge.routes.some((route) => route.attack)}
          surging={inSurge}
        />
        <Narration
          phase={phase}
          stage={stage}
          step={active}
          stepIndex={sample.index}
          next={next}
          labelOf={labelOf}
          onSurge={startSurge}
          onAdvance={onAdvance}
        />
        <FlowControls
          sample={shown}
          stepCount={flow.steps.length}
          playing={playing}
          finished={phase === "verdict"}
          reducedMotion={reducedMotion}
          color={colorOf(active.from)}
          onToggle={toggle}
          onPrev={() => goToStep(sample.index - 1)}
          onNext={() => goToStep(sample.index + 1)}
        />
        <p className="sr-only !m-0" aria-live="polite">
          {announcement}
        </p>
        <FlowActivityLog steps={flow.steps} activeIndex={sample.index} colorOf={colorOf} onSelect={goToStep} />
      </figure>
    </Card>
  );
}
