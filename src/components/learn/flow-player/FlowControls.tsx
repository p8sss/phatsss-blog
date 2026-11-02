import type { JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { Button } from "@/components/glass/button";
import { ArrowLeft01Icon, ArrowRight01Icon, PauseIcon, PlayIcon } from "@/components/ui/icons";
import type { FlowSample } from "@/lib/flow/timeline";

interface FlowControlsProps {
  readonly sample: FlowSample;
  readonly stepCount: number;
  readonly playing: boolean;
  readonly finished: boolean;
  /** Reduced motion: no autoplay control, steps change without travel. */
  readonly reducedMotion: boolean;
  readonly color: string;
  readonly onToggle: () => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
}

function playLabel(playing: boolean, finished: boolean): string {
  if (playing) return translate({ id: "learn.flow.pause", message: "Pause" });
  if (finished) return translate({ id: "learn.flow.replay", message: "Replay" });
  return translate({ id: "learn.flow.play", message: "Play" });
}

/** Transport bar: previous, play or pause, next, and a segmented progress track. */
export function FlowControls({
  sample,
  stepCount,
  playing,
  finished,
  reducedMotion,
  color,
  onToggle,
  onPrev,
  onNext,
}: FlowControlsProps): JSX.Element {
  const isFirst = sample.index === 0;
  const isLast = sample.index >= stepCount - 1;
  // aria-disabled, not disabled: a disabled button drops focus mid-keypress
  return (
    <div className="flex items-center gap-2 border-t border-separator px-3 py-2.5 sm:px-4">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onPrev}
        aria-disabled={isFirst || undefined}
        aria-label={translate({ id: "learn.flow.prev", message: "Previous step" })}
      >
        <ArrowLeft01Icon />
      </Button>
      {!reducedMotion && (
        <Button variant="tinted" size="sm" onClick={onToggle} className="min-w-24">
          {playing ? <PauseIcon /> : <PlayIcon />}
          {playLabel(playing, finished)}
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onNext}
        aria-disabled={isLast || undefined}
        aria-label={translate({ id: "learn.flow.next", message: "Next step" })}
      >
        <ArrowRight01Icon />
      </Button>
      {/* decorative: the counter and the step list carry the same information */}
      <div aria-hidden="true" className="mx-1 flex min-w-0 flex-1 gap-1">
        {Array.from({ length: stepCount }, (_, i) => {
          const fill = i < sample.index ? 1 : i === sample.index ? sample.progress : 0;
          return (
            <span key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-fill">
              <span
                className="absolute inset-0 origin-left rounded-full"
                style={{ transform: `scaleX(${fill})`, background: color }}
              />
            </span>
          );
        })}
      </div>
      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
        {sample.index + 1}/{stepCount}
      </span>
    </div>
  );
}
