import React, { useEffect, useRef, type JSX } from "react";
import { Aurora } from "@/components/glass/aurora";
import styles from "./starfield.module.css";

/** Keyframe names from src/css/galaxy-light.css. */
const GLOW_ORBIT = "galaxy-glow-orbit";
const SHINE_ORBIT = "galaxy-shine-orbit";

function orbitAnimations(target: Element | Document, name: string): CSSAnimation[] {
  return target
    .getAnimations()
    .filter((a): a is CSSAnimation => a instanceof CSSAnimation && a.animationName === name);
}

/**
 * Glass panes mounted after the glow (route changes, menus, sheets) start
 * their shine orbit from zero; jump them to the glow's current time so the
 * shine stays under the light.
 */
function useShineSync(glowRef: React.RefObject<HTMLDivElement | null>): void {
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || typeof glow.getAnimations !== "function" || typeof CSSAnimation === "undefined") return;

    const align = (animations: CSSAnimation[]) => {
      const clock = orbitAnimations(glow, GLOW_ORBIT)[0];
      if (!clock || clock.currentTime === null) return;
      animations.forEach((a) => {
        a.currentTime = clock.currentTime;
      });
    };
    const onAnimationStart = (event: AnimationEvent) => {
      if (event.animationName !== SHINE_ORBIT || !(event.target instanceof Element)) return;
      align(orbitAnimations(event.target, SHINE_ORBIT));
    };

    // panes rendered before hydration started their orbits before this listener
    align(orbitAnimations(document, SHINE_ORBIT));
    document.addEventListener("animationstart", onAnimationStart);
    return () => document.removeEventListener("animationstart", onAnimationStart);
  }, [glowRef]);
}

/**
 * Site-wide backdrop: glasscn's drifting aurora tinted as nebulae, the
 * accretion glow orbiting slowly through it (galaxy-light.css), and a
 * starfield that fades in for dark mode (driven by --starfield-opacity).
 * All layers are fixed behind the page and animate transform/opacity only.
 */
export default function Galaxy(): JSX.Element {
  const glowRef = useRef<HTMLDivElement>(null);
  useShineSync(glowRef);

  return (
    <>
      <Aurora />
      <div ref={glowRef} className="galaxy-glow" aria-hidden="true" />
      <div className={styles.starfield} aria-hidden="true">
        <div className={`${styles.layer} ${styles.far}`} />
        <div className={`${styles.layer} ${styles.near}`} />
      </div>
    </>
  );
}
