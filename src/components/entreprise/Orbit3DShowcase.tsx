import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { SITE } from "@/lib/constants";

interface OrbitCard {
  name: string;
  img: string;
  desc: string;
}

interface Orbit3DShowcaseProps {
  cards: OrbitCard[];
  centerLogo?: string;
}

const ORBIT_RADIUS_X = 520; // ellipse width
const ORBIT_RADIUS_Y = 180; // ellipse depth (perspective)
const CARD_W = 280;
const CARD_H = 360;
const ROTATION_SPEED = -0.00022; // slow & premium, never stops

const Orbit3DShowcase = ({ cards, centerLogo }: Orbit3DShowcaseProps) => {
  const logoSrc = centerLogo || SITE.logoWhite;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const [angle, setAngle] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Animate rotation — never stops
  useEffect(() => {
    if (!isInView) return;

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      setAngle((prev) => prev + ROTATION_SPEED * delta);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isInView]);

  // Compute card positions
  const cardPositions = useMemo(() => {
    const count = cards.length;
    return cards.map((card, i) => {
      const theta = angle + (i * 2 * Math.PI) / count;
      const x = Math.sin(theta) * ORBIT_RADIUS_X;
      const z = Math.cos(theta); // -1 to 1 (back to front)
      const y = Math.cos(theta) * ORBIT_RADIUS_Y;

      // Scale: front = 1, back = 0.55
      const normalizedZ = (z + 1) / 2; // 0 = back, 1 = front
      const scale = 0.55 + normalizedZ * 0.45;
      const opacity = 0.35 + normalizedZ * 0.65;
      const blur = (1 - normalizedZ) * 3;
      const zIndex = Math.round(normalizedZ * 100);

      return { card, x, y, scale, opacity, blur, zIndex, index: i, normalizedZ };
    });
  }, [angle, cards]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ height: 720, perspective: "1200px" }}
    >
      {/* Central logo "M" */}
      <motion.div
        className="absolute z-50 flex flex-col items-center justify-center select-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow ring */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 260,
            height: 260,
            background: "radial-gradient(circle, hsl(43 55% 55% / 0.15) 0%, hsl(43 55% 55% / 0.05) 50%, transparent 70%)",
            filter: "blur(25px)",
          }}
        />
        {/* Pulsing ring */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 180,
            height: 180,
            border: "1.5px solid hsl(43 55% 55% / 0.2)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Logo container — dark mode */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 140,
            height: 140,
            background: "radial-gradient(circle, hsl(0 0% 12%) 0%, hsl(0 0% 6%) 100%)",
            border: "1.5px solid hsl(43 55% 55% / 0.35)",
            boxShadow: "0 0 60px hsl(43 55% 55% / 0.12), 0 0 120px hsl(43 55% 55% / 0.06), inset 0 0 30px hsl(0 0% 0% / 0.4)",
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="MUST AGENCE"
              className="h-14 w-auto"
              style={{ filter: "brightness(1.1) drop-shadow(0 0 12px hsl(43 55% 55% / 0.5))" }}
            />
          ) : (
            <span className="font-clash text-3xl font-black text-white tracking-wider">M</span>
          )}
        </div>
        <span
          className="mt-3 font-clash text-[10px] font-bold uppercase tracking-[0.35em]"
          style={{ color: "hsl(43 55% 55% / 0.5)" }}
        >
          Must Agence
        </span>
      </motion.div>

      {/* Orbit path (visual ellipse) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: ORBIT_RADIUS_X * 2 + CARD_W,
          height: ORBIT_RADIUS_Y * 2 + CARD_H * 0.4,
          border: "1px solid hsl(43 55% 55% / 0.06)",
          borderRadius: "50%",
          transform: "rotateX(10deg)",
        }}
      />

      {/* Cards */}
      {cardPositions
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(({ card, x, y, scale, opacity, blur, zIndex, index, normalizedZ }) => {
          const isHovered = hoveredIndex === index;
          const finalScale = isHovered ? scale * 1.15 : scale;
          const finalOpacity = isHovered ? 1 : opacity;
          const finalBlur = isHovered ? 0 : blur;

          return (
            <motion.div
              key={card.name}
              className="absolute cursor-pointer"
              style={{
                width: CARD_W,
                height: CARD_H,
                zIndex: isHovered ? 200 : zIndex,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${finalScale})`,
                opacity: finalOpacity,
                filter: `blur(${finalBlur}px)`,
                transition: "transform 0.15s linear, opacity 0.3s ease, filter 0.3s ease",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-full h-full rounded-2xl overflow-hidden relative group"
                style={{
                  border: `1.5px solid ${normalizedZ > 0.6 ? "hsl(43 55% 55% / 0.3)" : "hsl(43 55% 55% / 0.08)"}`,
                  boxShadow: isHovered
                    ? "0 30px 80px -20px hsl(43 55% 55% / 0.35), 0 0 40px hsl(43 55% 55% / 0.15)"
                    : normalizedZ > 0.6
                      ? "0 20px 60px -15px hsl(0 0% 0% / 0.3), 0 0 30px hsl(43 55% 55% / 0.08)"
                      : "0 8px 24px -8px hsl(0 0% 0% / 0.15)",
                  transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                }}
              >
                {/* Image with micro-video Ken Burns effect */}
                <motion.img
                  src={card.img}
                  alt={card.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  animate={{
                    scale: [1.05, 1.15, 1.08, 1.12, 1.05],
                    x: [0, -8, 4, -3, 0],
                    y: [0, -5, 3, -2, 0],
                  }}
                  transition={{
                    duration: 12 + index * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ willChange: "transform" }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                {/* Glass top edge */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: "linear-gradient(90deg, transparent 10%, hsl(43 55% 75% / 0.3) 50%, transparent 90%)" }}
                />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h4 className="font-clash font-bold text-white text-lg mb-1 drop-shadow-lg">
                    {card.name}
                  </h4>
                  <p className="text-white/60 text-xs font-mono tracking-wide">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}

      {/* Ambient particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 3,
            height: 3,
            background: "hsl(43 55% 65% / 0.4)",
            left: `${30 + i * 10}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default Orbit3DShowcase;
