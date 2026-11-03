import { useEffect, useRef } from "react";
import type { FlowClock } from "./use-flow-clock";

/** Starts the flow the first time it scrolls into view; pauses it off screen and resumes on return. */
export function useScrollAutoplay(inView: boolean, reducedMotion: boolean, clock: FlowClock): void {
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
