import { ReactNode } from "react";

export type FrameVariant = "gold" | "green" | "silver";

const PALETTES: Record<
  FrameVariant,
  {
    outer: string;
    ring1: string; // dark ring
    ring2: string; // light ring
    innerBevel: string; // inset shadow layers
    corner: string;
    cornerRing: string;
  }
> = {
  gold: {
    outer:
      "linear-gradient(145deg,#f7d774 0%,#c9962b 22%,#8a5a15 48%,#e9c66a 72%,#7a4a10 100%)",
    ring1: "#4a2a05",
    ring2: "#f2c766",
    innerBevel:
      "inset 0 0 0 2px #4a2a05, inset 0 0 0 4px #e9c66a, inset 0 0 0 6px #7a4a10, inset 0 0 22px rgba(0,0,0,0.55)",
    corner:
      "radial-gradient(circle at 30% 30%, #fff2b8 0%, #f2c766 35%, #8a5a15 75%, #3a2005 100%)",
    cornerRing: "#3a2005",
  },
  green: {
    outer:
      "linear-gradient(145deg,#b6f0b0 0%,#3f9c46 22%,#0f5a1c 48%,#8fd48a 72%,#0a4014 100%)",
    ring1: "#0a2e10",
    ring2: "#8fd48a",
    innerBevel:
      "inset 0 0 0 2px #0a2e10, inset 0 0 0 4px #8fd48a, inset 0 0 0 6px #0f5a1c, inset 0 0 22px rgba(0,0,0,0.55)",
    corner:
      "radial-gradient(circle at 30% 30%, #e2ffd8 0%, #8fd48a 35%, #0f5a1c 75%, #062010 100%)",
    cornerRing: "#062010",
  },
  silver: {
    outer:
      "linear-gradient(145deg,#f7f7f7 0%,#c9c9cf 22%,#6a6d75 48%,#e8e8ee 72%,#5a5c62 100%)",
    ring1: "#2a2c30",
    ring2: "#e8e8ee",
    innerBevel:
      "inset 0 0 0 2px #2a2c30, inset 0 0 0 4px #e8e8ee, inset 0 0 0 6px #6a6d75, inset 0 0 22px rgba(0,0,0,0.55)",
    corner:
      "radial-gradient(circle at 30% 30%, #ffffff 0%, #e8e8ee 35%, #6a6d75 75%, #202024 100%)",
    cornerRing: "#202024",
  },
};

/**
 * Colonial ornate frame around videos, sized 9:16.
 * The child (video/iframe) fills the inner stage.
 */
export default function ColonialVideoFrame({
  children,
  className = "",
  variant = "gold",
  aspect = "9/16",
}: {
  children: ReactNode;
  className?: string;
  variant?: FrameVariant;
  /** CSS aspect-ratio for the frame. Defaults to 9/16 (vertical). */
  aspect?: string;
}) {
  const p = PALETTES[variant];
  const pad = "clamp(4px, 0.7vh, 9px)";
  return (
    <div
      className={`relative ${className}`}
      style={{
        padding: pad,
        borderRadius: "18px",
        background: p.outer,
        boxShadow: `0 0 0 2px ${p.ring1}, 0 0 0 4px ${p.ring2}, 0 20px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.5)`,
      }}
    >

      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: aspect,
          height: `min(88vh, calc(95vw * 16 / 9))`,
          maxHeight: "88vh",
          maxWidth: "95vw",
          borderRadius: "10px",
          boxShadow: p.innerBevel,
          background: "#000",
        }}
      >

        {children}
      </div>

      {[
        { top: -6, left: -6 },
        { top: -6, right: -6 },
        { bottom: -6, left: -6 },
        { bottom: -6, right: -6 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-6 h-6 sm:w-8 sm:h-8 pointer-events-none"
          style={{
            ...pos,
            borderRadius: "50%",
            background: p.corner,
            boxShadow: `0 0 0 1.5px ${p.cornerRing}, 0 2px 6px rgba(0,0,0,0.6), inset 0 0 4px rgba(255,255,255,0.4)`,
          }}
        />
      ))}
    </div>
  );
}
