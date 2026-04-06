import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none w-[10px] h-[10px] rounded-full bg-neon mix-blend-difference"
      style={{ willChange: "transform" }}
    />
  );
};

export default CustomCursor;
