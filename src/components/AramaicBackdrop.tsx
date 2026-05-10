import { useMemo } from "react";

const HEB = "אבגדהוזחטיכלמנסעפצקרשת";
const ARA = "ܐܒܓܕܗܘܙܚܛܝܟܠܡܢܣܥܦܨܩܪܫܬ";

interface Props {
  density?: number;
  className?: string;
}

/**
 * Soft animated backdrop with floating 3D-styled Hebrew/Aramaic letters.
 * Pure CSS / no images. Sits absolutely behind page content.
 */
export default function AramaicBackdrop({ density = 28, className = "" }: Props) {
  const letters = useMemo(() => {
    const all = (HEB + ARA).split("");
    return Array.from({ length: density }).map((_, i) => {
      const ch = all[Math.floor(Math.random() * all.length)];
      return {
        ch,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 28 + Math.random() * 80,
        rot: -25 + Math.random() * 50,
        op: 0.08 + Math.random() * 0.18,
        delay: Math.random() * -10,
        dur: 7 + Math.random() * 8,
        hue: 30 + Math.random() * 20, // warm gold range
        i,
      };
    });
  }, [density]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, hsl(38 60% 92% / 1), hsl(35 50% 85% / 1) 45%, hsl(30 45% 72% / 1) 100%)",
      }}
    >
      {letters.map((l) => (
        <span
          key={l.i}
          style={{
            position: "absolute",
            left: `${l.left}%`,
            top: `${l.top}%`,
            fontSize: `${l.size}px`,
            fontFamily: "'Baloo 2', system-ui, sans-serif",
            fontWeight: 900,
            color: `hsl(${l.hue} 70% 45%)`,
            // 3D Pixar-cartoon-style stack
            textShadow: [
              "1px 1px 0 hsl(35 80% 35%)",
              "2px 2px 0 hsl(35 80% 30%)",
              "3px 3px 0 hsl(35 80% 25%)",
              "4px 4px 0 hsl(35 80% 20%)",
              "5px 5px 0 hsl(30 80% 15%)",
              "6px 6px 12px hsl(30 60% 10% / 0.5)",
            ].join(", "),
            ["--rot" as never]: `${l.rot}deg`,
            ["--op" as never]: l.op,
            animation: `floatHeb ${l.dur}s ease-in-out ${l.delay}s infinite`,
            willChange: "transform, opacity",
            userSelect: "none",
          } as React.CSSProperties}
        >
          {l.ch}
        </span>
      ))}
    </div>
  );
}
