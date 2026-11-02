import { useCallback, useEffect, useMemo, useRef, useState, type JSX, type KeyboardEvent } from "react";
import { translate } from "@docusaurus/Translate";
import { Card } from "@/components/glass/card";
import { useElementWidth } from "@/hooks/use-element-width";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { layoutFlow, type Orientation } from "@/lib/flow/geometry";
import { buildTimeline, sampleAt, stepHoldTime, stepStartTime } from "@/lib/flow/timeline";
import type { FlowDefinition } from "@/lib/flow/types";
import { validateFlow } from "@/lib/flow/validate";
import { DataError } from "../DataError";
import { actorStyle } from "./actor-style";
import { FlowControls } from "./FlowControls";
import { FlowDiagram } from "./FlowDiagram";
import { FlowLegend } from "./FlowLegend";
import { FlowStepList } from "./FlowStepList";
import { useFlowClock } from "./use-flow-clock";

/**
 * Smallest scale the wide layout may shrink to before the grid transposes into
 * a column. Below it, 14px labels drop under about 11px.
 */
const MIN_WIDE_SCALE = 0.8;

interface FlowPlayerProps {
  readonly flow: FlowDefinition;
}

function useColorOf(flow: FlowDefinition) {
  return useMemo(() => {
    const kinds = new Map(flow.actors.map((a) => [a.id, a.kind]));
    return (actorId: string) => actorStyle(kinds.get(actorId) ?? "external").color;
  }, [flow.actors]);
}

/** Starts the flow the first time it scrolls into view; pauses it off screen and resumes on return. */
function useScrollAutoplay(
  inView: boolean,
  reducedMotion: boolean,
  clock: ReturnType<typeof useFlowClock>,
) {
  const autoplayed = useRef(false);
  const pausedByScroll = useRef(false);
  const { playing, play, pause, resume } = clock;
  useEffect(() => {
    if (reducedMotion) {
      pause();
      return;
    }
    if (inView && !autoplayed.current) {
      autoplayed.current = true;
      play();
    } else if (!inView && playing) {
      pausedByScroll.current = true;
      pause();
    } else if (inView && pausedByScroll.current) {
      pausedByScroll.current = false;
      resume();
    }
  }, [inView, reducedMotion, playing, play, pause, resume]);
}

function announce(flow: FlowDefinition, index: number): string {
  return translate(
    { id: "learn.flow.stepAnnouncement", message: "Step {n} of {total}: {title}" },
    { n: index + 1, total: flow.steps.length, title: flow.steps[index].title },
  );
}

function ValidFlowPlayer({ flow }: FlowPlayerProps): JSX.Element {
  const rootRef = useRef<HTMLElement>(null);
  // visibility of the diagram alone: the step list grows as the flow plays
  const diagramRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const width = useElementWidth(rootRef);
  const inView = useInView(diagramRef);
  // only steps the reader picks are announced, never autoplay ticks
  const [announcement, setAnnouncement] = useState("");
  const timeline = useMemo(() => buildTimeline(flow.steps), [flow.steps]);
  const clock = useFlowClock(timeline.total);
  useScrollAutoplay(inView, reducedMotion, clock);

  const wideLayout = useMemo(() => layoutFlow(flow.actors, "wide"), [flow.actors]);
  const narrowLayout = useMemo(() => layoutFlow(flow.actors, "narrow"), [flow.actors]);
  const orientation: Orientation =
    width !== null && width < wideLayout.width * MIN_WIDE_SCALE ? "narrow" : "wide";
  const layout = orientation === "wide" ? wideLayout : narrowLayout;
  const colorOf = useColorOf(flow);

  const sample = sampleAt(timeline, clock.time);
  // reduced motion skips travel: every step is shown in its finished state
  const shown = reducedMotion ? { ...sample, progress: 1 } : sample;
  const finished = clock.time >= stepHoldTime(timeline, flow.steps.length - 1);
  const active = flow.steps[sample.index];

  const { pause, playRange, seek, play, playing } = clock;
  const goToStep = useCallback(
    (target: number) => {
      if (target < 0 || target >= flow.steps.length) return;
      setAnnouncement(announce(flow, target));
      if (reducedMotion) {
        pause();
        seek(stepHoldTime(timeline, target));
        return;
      }
      playRange(stepStartTime(timeline, target), stepHoldTime(timeline, target));
    },
    [flow, reducedMotion, pause, seek, playRange, timeline],
  );
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    // leave browser shortcuts such as Alt+Left (back) alone
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowRight") goToStep(sample.index + 1);
    else if (event.key === "ArrowLeft") goToStep(sample.index - 1);
    else return;
    event.preventDefault();
  };

  const stepText = announce(flow, sample.index);

  return (
    <Card
      material="solid"
      className="my-6 gap-0 py-0"
      role="group"
      aria-label={flow.title}
      onKeyDown={onKeyDown}
    >
      <figure ref={rootRef} className="!m-0 flex flex-col">
        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 pt-3 sm:px-4">
          <span className="text-sm font-semibold text-foreground">{flow.title}</span>
          <FlowLegend />
        </figcaption>
        <div ref={diagramRef} className="px-1 py-2 sm:px-3">
          <FlowDiagram flow={flow} layout={layout} sample={shown} label={`${flow.title}. ${stepText}`} />
        </div>
        <FlowControls
          sample={shown}
          stepCount={flow.steps.length}
          playing={playing}
          finished={finished}
          reducedMotion={reducedMotion}
          color={colorOf(active.from)}
          onToggle={toggle}
          onPrev={() => goToStep(sample.index - 1)}
          onNext={() => goToStep(sample.index + 1)}
        />
        <p className="sr-only !m-0" aria-live="polite">
          {announcement}
        </p>
        <FlowStepList steps={flow.steps} activeIndex={sample.index} colorOf={colorOf} onSelect={goToStep} />
      </figure>
    </Card>
  );
}

/** Animated ByteByteGo-style flow with step controls and a text walkthrough. */
export default function FlowPlayer({ flow }: FlowPlayerProps): JSX.Element {
  const errors = useMemo(() => validateFlow(flow), [flow]);
  if (errors.length > 0) {
    return (
      <DataError
        errors={errors}
        message={translate(
          { id: "learn.flow.invalid", message: "The flow \"{id}\" can't be drawn." },
          { id: flow.id },
        )}
      />
    );
  }
  // keyed so the clock and refs reset if the page swaps in another flow
  return <ValidFlowPlayer key={flow.id} flow={flow} />;
}
