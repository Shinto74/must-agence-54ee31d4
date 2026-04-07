import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Point central — instantané
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 2.5}px, ${e.clientY - 2.5}px)`;
      }
    };

    // Anneau — delayed (lerp)
    const animate = () => {
      const dx = mouse.current.x - ringPos.current.x;
      const dy = mouse.current.y - ringPos.current.y;
      ringPos.current.x += dx * 0.15;
      ringPos.current.y += dy * 0.15;

      if (ringRef.current) {
        const size = isHover ? 52 : 32;
        const half = size / 2;
        ringRef.current.style.transform = `translate(${ringPos.current.x - half}px, ${ringPos.current.y - half}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Hover detection on interactive elements
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, .cursor-pointer, [data-cursor-hover]")) {
        setIsHover(true);
      }
    };
    const onOut = () => setIsHover(false);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isHover]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Point central 5px — Neon */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "hsl(73 100% 50%)",
          boxShadow: "0 0 6px hsl(73 100% 50% / 0.6)",
          willChange: "transform",
        }}
      />

      {/* Anneau — delayed, 32px normal / 52px hover */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: isHover ? 52 : 32,
          height: isHover ? 52 : 32,
          borderRadius: "50%",
          border: `1.5px solid hsl(73 100% 50% / ${isHover ? 0.5 : 0.3})`,
          background: isHover ? "hsl(73 100% 50% / 0.06)" : "transparent",
          willChange: "transform",
          transition: "width 250ms cubic-bezier(0.16,1,0.3,1), height 250ms cubic-bezier(0.16,1,0.3,1), border-color 300ms, background 300ms",
        }}
      />
    </>
  );
};

export default CustomCursor;
