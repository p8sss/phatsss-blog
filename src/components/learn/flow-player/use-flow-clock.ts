import { useCallback, useEffect, useRef, useState } from "react";

/** Longest frame step, so a backgrounded tab doesn't jump the flow forward. */
const MAX_FRAME_SECONDS = 0.1;

export interface FlowClock {
  readonly time: number;
  readonly playing: boolean;
  /** Plays from the current time to `until` (default: the end), restarting if already there. */
  readonly play: (until?: number) => void;
  /** Jumps to `from` and plays only up to `until`. */
  readonly playRange: (from: number, until: number) => void;
  readonly pause: () => void;
  /** Continues toward the stop point of the last play, if not already there. */
  readonly resume: () => void;
  readonly seek: (time: number) => void;
}

/** A requestAnimationFrame clock over [0, total] seconds. All flow state derives from `time`. */
export function useFlowClock(total: number): FlowClock {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timeRef = useRef(0);
  const stopRef = useRef(total);

  const clampTime = useCallback((t: number) => Math.min(Math.max(t, 0), total), [total]);

  const seek = useCallback(
    (t: number) => {
      const next = clampTime(t);
      timeRef.current = next;
      setTime(next);
    },
    [clampTime],
  );

  const play = useCallback(
    (until = total) => {
      if (timeRef.current >= until) seek(0);
      stopRef.current = clampTime(until);
      setPlaying(true);
    },
    [clampTime, seek, total],
  );

  const playRange = useCallback(
    (from: number, until: number) => {
      seek(from);
      stopRef.current = clampTime(until);
      setPlaying(true);
    },
    [clampTime, seek],
  );

  const pause = useCallback(() => setPlaying(false), []);

  const resume = useCallback(() => {
    if (timeRef.current < stopRef.current) setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      const dt = last === null ? 0 : Math.min((now - last) / 1000, MAX_FRAME_SECONDS);
      last = now;
      const next = Math.min(timeRef.current + dt, stopRef.current);
      timeRef.current = next;
      setTime(next);
      if (next >= stopRef.current) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  return { time, playing, play, playRange, pause, resume, seek };
}
