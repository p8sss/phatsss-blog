import { useCallback, useMemo, useRef, useState, type JSX, type KeyboardEvent } from "react";
import { translate } from "@docusaurus/Translate";
import { Card } from "@/components/glass/card";
import { useElementWidth } from "@/hooks/use-element-width";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { buildTimeline, sampleAt, stepHoldTime, stepStartTime } from "@/lib/flow/timeline";
import type { FlowDefinition } from "@/lib/flow/types";
import { validateFlow } from "@/lib/flow/validate";
import { DataError } from "../DataError";
import { FlowControls } from "./FlowControls";
import { FlowDiagram } from "./FlowDiagram";
import { FlowLegend } from "./FlowLegend";
import { FlowStepList } from "./FlowStepList";
import { useFlowClock } from "./use-flow-clock";
import { useColorOf, useFlowLayout } from "./use-flow-layout";
import { useScrollAutoplay } from "./use-scroll-autoplay";

interface FlowPlayerProps {
  readonly flow: FlowDefinition;
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

  const layout = useFlowLayout(flow.actors, width);
  const colorOf = useColorOf(flow.actors);

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
