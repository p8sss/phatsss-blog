import { type RefObject, useEffect, useState } from "react";

/**
 * Whether enough of the element is on screen. Without IntersectionObserver it
 * reports true, so anything gated on visibility still works.
 */
export function useInView(ref: RefObject<HTMLElement | null>, threshold = 0.35): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[entries.length - 1].isIntersecting),
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}
