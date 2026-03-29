import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const targets = el.querySelectorAll(".rv");
    targets.forEach((t) => observer.observe(t));
    // Also observe the element itself if it has .rv
    if (el.classList.contains("rv")) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}
