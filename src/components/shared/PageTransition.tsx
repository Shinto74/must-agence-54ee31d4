import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [stage, setStage] = useState<"idle" | "slash-in" | "slash-out">("idle");
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip slash transition on initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayChildren(children);
      return;
    }
    if (children !== displayChildren) {
      setStage("slash-in");
      setTimeout(() => {
        setDisplayChildren(children);
        window.scrollTo(0, 0);
        setStage("slash-out");
        setTimeout(() => setStage("idle"), 500);
      }, 400);
    }
  }, [children, location.pathname]);

  return (
    <div className="relative">
      {/* Slash overlay */}
      <div
        className={`fixed inset-0 z-[9998] pointer-events-none transition-none ${
          stage === "idle" ? "hidden" : ""
        }`}
      >
        <div
          className={`absolute inset-0 bg-neon origin-top-right ${
            stage === "slash-in"
              ? "animate-slashIn"
              : stage === "slash-out"
              ? "animate-slashOut"
              : ""
          }`}
        />
        <div
          className={`absolute inset-0 bg-background origin-top-right ${
            stage === "slash-in"
              ? "animate-slashIn delay-75"
              : stage === "slash-out"
              ? "animate-slashOut delay-75"
              : ""
          }`}
          style={{ animationDelay: stage === "slash-in" ? "80ms" : "50ms" }}
        />
      </div>

      <div className={stage === "slash-out" ? "animate-fadeSlide" : ""}>
        {displayChildren}
      </div>
    </div>
  );
};

export default PageTransition;
