import { useEffect, useRef, useState } from "react";
import { buildFactoryScene, isWebGLAvailable } from "./factoryScene";

export default function FactoryCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // If WebGL is unavailable, don't attempt the 3D scene at all.
    if (!isWebGLAvailable()) {
      setSupported(false);
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const handle = buildFactoryScene(container, { reducedMotion });
    return () => handle.dispose();
  }, []);

  if (!supported) {
    return null;
  }

  return (
    <div ref={containerRef} className="h-full w-full" aria-hidden="true" />
  );
}
