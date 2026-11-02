import { useCallback, useEffect, useState, type RefObject } from "react";

/** Sub-pixel slack so a rounding error doesn't count as overflow. */
const EDGE_TOLERANCE_PX = 2;

type HorizontalOverflow = {
  /** The element's content is wider than the element. */
  readonly isScrollable: boolean;
  /** Scrolled all the way to the right (or nothing to scroll). */
  readonly isAtEnd: boolean;
};

const NO_OVERFLOW: HorizontalOverflow = { isScrollable: false, isAtEnd: true };

/**
 * Whether a horizontally scrolling element overflows, and whether it's scrolled
 * to its right edge — for "there's more →" cues. Re-measures on scroll and when
 * the element or its first child resizes. `deps` forces a re-measure (e.g. a
 * word-wrap toggle that changes the content width).
 */
export function useHorizontalOverflow(
  ref: RefObject<HTMLElement | null>,
  deps: readonly unknown[] = [],
): HorizontalOverflow {
  const [state, setState] = useState<HorizontalOverflow>(NO_OVERFLOW);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const isScrollable = el.scrollWidth - el.clientWidth > EDGE_TOLERANCE_PX;
    const isAtEnd =
      el.scrollLeft + el.clientWidth >= el.scrollWidth - EDGE_TOLERANCE_PX;
    setState((prev) =>
      prev.isScrollable === isScrollable && prev.isAtEnd === isAtEnd
        ? prev
        : { isScrollable, isAtEnd },
    );
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return undefined;
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) {
      observer.observe(el.firstElementChild);
    }
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure, ...deps]);

  return state;
}
