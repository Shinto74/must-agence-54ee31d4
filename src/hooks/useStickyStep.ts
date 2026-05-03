import { useEffect, useRef, useState } from "react";

/**
 * Scroll-jacking step hook with cooldown.
 * - Wrapper must contain a child with data-sticky-step.
 * - While the sticky child is pinned, wheel & touch advance the index one by one.
 * - Outside the pinned range, native scroll resumes normally.
 * Works on desktop (wheel) and mobile (touch).
 */
export function useStickyStep(
  containerRef: React.RefObject<HTMLElement>,
  count: number,
  options: { cooldownMs?: number; wheelThreshold?: number; touchThreshold?: number } = {}
) {
  const { cooldownMs = 750, wheelThreshold = 8, touchThreshold = 28 } = options;
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const cooldown = useRef(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || count <= 0) return;

    const getStickyEl = () =>
      container.querySelector("[data-sticky-step]") as HTMLElement | null;

    const isPinned = () => {
      const sticky = getStickyEl();
      if (!sticky) return false;
      const sr = sticky.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      // pinned when sticky top is at viewport top AND container extends below viewport
      return sr.top <= 4 && cr.bottom > window.innerHeight - 4;
    };

    const advance = (dir: number) => {
      if (cooldown.current) return true;
      const cur = indexRef.current;
      if (dir > 0 && cur < count - 1) {
        cooldown.current = true;
        indexRef.current = cur + 1;
        setIndex(cur + 1);
        setTimeout(() => (cooldown.current = false), cooldownMs);
        return true;
      }
      if (dir < 0 && cur > 0) {
        cooldown.current = true;
        indexRef.current = cur - 1;
        setIndex(cur - 1);
        setTimeout(() => (cooldown.current = false), cooldownMs);
        return true;
      }
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isPinned()) return;
      if (Math.abs(e.deltaY) < wheelThreshold) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const cur = indexRef.current;
      const canAdvance = (dir > 0 && cur < count - 1) || (dir < 0 && cur > 0);
      if (canAdvance) {
        e.preventDefault();
        advance(dir);
      }
    };

    let touchY = 0;
    let touchActive = false;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      touchActive = isPinned();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchActive) return;
      if (!isPinned()) return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) < touchThreshold) {
        // still inside section, prevent native bounce
        if (cooldown.current) e.preventDefault();
        return;
      }
      const dir = dy > 0 ? 1 : -1;
      const cur = indexRef.current;
      const canAdvance = (dir > 0 && cur < count - 1) || (dir < 0 && cur > 0);
      if (canAdvance) {
        e.preventDefault();
        if (advance(dir)) touchY = e.touches[0].clientY;
      }
    };
    const onTouchEnd = () => {
      touchActive = false;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [containerRef, count, cooldownMs, wheelThreshold, touchThreshold]);

  return index;
}
