import { JSX, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { translate } from "@docusaurus/Translate";
import { PauseIcon, PlayIcon, SparklesIcon } from "@/components/ui/icons";
import SectionHeading from "../SectionHeading";
import { StationStepper, STATION_HEX } from "./StationStepper";
import { STAGE_ORDER, type StageId } from "./factoryTimeline";

const FactoryCanvas = lazy(() => import("./FactoryCanvas"));

function FactoryFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex size-16 animate-pulse items-center justify-center rounded-full border border-white/10 bg-white/5">
        <SparklesIcon size={22} className="text-slate-300" />
      </div>
    </div>
  );
}

const overlayButton =
  "pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3.5 text-sm font-medium text-slate-100 backdrop-blur-md transition-colors hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function FactorySection(): JSX.Element {
  const reducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const [focus, setFocus] = useState<StageId | null>(null);
  const [active, setActive] = useState<StageId>("conveyor");
  const [shipped, setShipped] = useState(0);
  const [supported, setSupported] = useState(true);
  const bars = useRef<Partial<Record<StageId, HTMLSpanElement | null>>>({});

  // Reduced motion starts paused; the visitor can still press play.
  useEffect(() => setPaused(reducedMotion), [reducedMotion]);

  const handleStage = useCallback((stage: StageId, count: number) => {
    setActive(stage);
    setShipped(count);
  }, []);

  // Per-frame: write the chain fills straight to the DOM instead of re-rendering.
  const handleProgress = useCallback((stage: StageId, progress: number) => {
    const current = STAGE_ORDER.indexOf(stage);
    STAGE_ORDER.forEach((id, i) => {
      const fill = i < current ? 1 : i === current ? progress : 0;
      const bar = bars.current[id];
      if (bar) bar.style.transform = `scaleX(${fill})`;
    });
  }, []);

  const registerBar = useCallback((id: StageId, el: HTMLSpanElement | null) => {
    bars.current[id] = el;
  }, []);

  const toggleFocus = useCallback((id: StageId) => setFocus((prev) => (prev === id ? null : id)), []);

  const statusLabel = paused
    ? translate({ id: "factory.status.paused", message: "Paused" })
    : translate({ id: "factory.status.running", message: "Running" });

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow={
          <>
            <SparklesIcon size={14} /> Code Factory
          </>
        }
        title={translate({
          id: "factory.title",
          message: "Where ideas are manufactured",
        })}
        description={translate({
          id: "factory.description.chain",
          message:
            "Every post here runs the same line: drafts roll in, get scanned and polished, then a robot arm stacks them for shipping. Pick a station to take a closer look.",
        })}
      />

      <div className="overflow-hidden rounded-surface border border-white/10 bg-[#0a0e1c] shadow-[0_30px_80px_-30px_rgba(49,46,129,0.55)]">
        <div className="relative h-[320px] sm:h-[420px] md:h-[480px]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0a0e1c] to-purple-950" />
          <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.2),transparent_45%)]" />

          {supported ? (
            <Suspense fallback={<FactoryFallback />}>
              <FactoryCanvas
                paused={paused}
                focus={focus}
                reducedMotion={reducedMotion}
                onStage={handleStage}
                onProgress={handleProgress}
                onUnsupported={() => setSupported(false)}
              />
            </Suspense>
          ) : (
            <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-slate-300">
              {translate({ id: "factory.unsupported", message: "This browser can't show the 3D factory, but the chain below still tells the story." })}
            </p>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3 sm:p-4">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
              <span
                aria-hidden="true"
                className={cn("size-2 rounded-full", paused ? "bg-slate-400" : "animate-pulse motion-reduce:animate-none")}
                style={paused ? undefined : { background: STATION_HEX[active] }}
              />
              {statusLabel}
              <span aria-hidden="true" className="hidden text-slate-400 sm:inline">·</span>
              <span className="hidden tabular-nums sm:inline">
                {translate(
                  { id: "factory.shipped", message: "{count} shipped" },
                  { count: shipped },
                )}
              </span>
            </span>
            <span className="flex items-center gap-2">
              {focus && (
                <button type="button" className={overlayButton} onClick={() => setFocus(null)}>
                  {translate({ id: "factory.overview", message: "Overview" })}
                </button>
              )}
              {supported && (
                <button
                  type="button"
                  className={cn(overlayButton, "w-9 justify-center px-0")}
                  aria-pressed={paused}
                  aria-label={paused
                    ? translate({ id: "factory.play", message: "Play animation" })
                    : translate({ id: "factory.pause", message: "Pause animation" })}
                  onClick={() => setPaused((p) => !p)}>
                  {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
                </button>
              )}
            </span>
          </div>

          {supported && (
            <span className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-slate-300 backdrop-blur-md sm:block">
              {translate({ id: "factory.hint", message: "Drag to look around" })}
            </span>
          )}
        </div>

        <StationStepper active={active} focus={focus} onSelect={toggleFocus} barRef={registerBar} />
      </div>
    </section>
  );
}
