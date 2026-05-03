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
  const { cooldownMs = 700, wheelThreshold = 6, touchThreshold = 24 } = options;
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const cooldown = useRef(false);
  const lastEventAt = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || count <= 0) return;

    const getStickyEl = () =>
      container.querySelector("[data-sticky-step]") as HTMLElement | null;

    // True while the sticky child is pinned to top of viewport
    const isPinned = () => {
      const sticky = getStickyEl();
      if (!sticky) return false;
      const sr = sticky.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      return sr.top <= 4 && cr.bottom > window.innerHeight - 4;
    };

    const advance = (dir: number) => {
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

    // Will the next gesture in this direction be consumed by step navigation?
    const willConsume = (dir: number) => {
      const cur = indexRef.current;
      return (dir > 0 && cur < count - 1) || (dir < 0 && cur > 0);
    };

    const onWheel = (e: WheelEvent) => {
      if (!isPinned()) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      // Block native scroll as long as we still have steps to consume in this dir
      if (willConsume(dir)) {
        e.preventDefault();
        if (cooldown.current) return;
        if (Math.abs(e.deltaY) < wheelThreshold) return;
        // Debounce strong/inertia scrolls (trackpad bursts)
        const now = performance.now();
        if (now - lastEventAt.current < 90) return;
        lastEventAt.current = now;
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
      if (!touchActive || !isPinned()) return;
      const dy = touchY - e.touches[0].clientY;
      const dir = dy > 0 ? 1 : -1;
      if (!willConsume(dir)) return; // let native scroll exit the section
      // Inside the section: block native scroll, count steps
      if (e.cancelable) e.preventDefault();
      if (cooldown.current) return;
      if (Math.abs(dy) < touchThreshold) return;
      if (advance(dir)) touchY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      touchActive = false;
    };

    // Block keyboard page scroll while pinned too
    const onKey = (e: KeyboardEvent) => {
      if (!isPinned()) return;
      const downKeys = ["PageDown", "ArrowDown", " ", "Spacebar"];
      const upKeys = ["PageUp", "ArrowUp"];
      if (downKeys.includes(e.key) && willConsume(1)) {
        e.preventDefault();
        if (!cooldown.current) advance(1);
      } else if (upKeys.includes(e.key) && willConsume(-1)) {
        e.preventDefault();
        if (!cooldown.current) advance(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [containerRef, count, cooldownMs, wheelThreshold, touchThreshold]);

  return index;
}
