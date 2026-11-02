import { useEffect, useRef } from "react";
import { translate } from "@docusaurus/Translate";
import {
  buildFactoryScene,
  isWebGLAvailable,
  type FactoryEvents,
  type FactoryHandle,
} from "./factoryScene";
import type { StageId } from "./factoryTimeline";

interface FactoryCanvasProps extends FactoryEvents {
  paused: boolean;
  focus: StageId | null;
  reducedMotion: boolean;
  onUnsupported: () => void;
}

/** Mounts the three.js scene and forwards play/pause, focus and stage events. */
export default function FactoryCanvas({
  paused,
  focus,
  reducedMotion,
  onStage,
  onProgress,
  onUnsupported,
}: FactoryCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<FactoryHandle | null>(null);
  // Latest callbacks, so the scene is built once and never holds stale closures.
  const eventsRef = useRef<FactoryEvents>({ onStage, onProgress });
  useEffect(() => {
    eventsRef.current = { onStage, onProgress };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!isWebGLAvailable()) {
      onUnsupported();
      return;
    }
    const handle = buildFactoryScene(
      container,
      {
        onStage: (stage, shipped) => eventsRef.current.onStage?.(stage, shipped),
        onProgress: (stage, progress) => eventsRef.current.onProgress?.(stage, progress),
      },
      { reducedMotion },
    );
    handleRef.current = handle;
    return () => {
      handle.dispose();
      handleRef.current = null;
    };
    // onUnsupported only matters on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Not re-run on a reducedMotion rebuild: the new scene starts paused on its own, and the
  // parent's `paused` catches up in the same commit (re-sending the stale value would unpause it).
  useEffect(() => {
    handleRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    handleRef.current?.focus(focus);
  }, [focus, reducedMotion]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={translate({
        id: "factory.canvas.label",
        message:
          "3D factory: draft blocks ride a conveyor into a laser scanner, turn polished, and a robot arm stacks them on a pallet.",
      })}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    />
  );
}
