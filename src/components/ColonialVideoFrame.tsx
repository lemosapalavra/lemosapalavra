import { ReactNode } from "react";

/**
 * Golden colonial frame around videos, sized 9:16.
 * The child (video/iframe) fills the inner stage.
 */
export default function ColonialVideoFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[9/16] h-[90vh] max-h-[90vh] max-w-[95vw] ${className}`}
      style={{
        padding: "clamp(10px, 2.2vh, 22px)",
        borderRadius: "18px",
        background:
          "linear-gradient(145deg,#f7d774 0%,#c9962b 22%,#8a5a15 48%,#e9c66a 72%,#7a4a10 100%)",
        boxShadow:
          "0 0 0 2px #4a2a05, 0 0 0 4px #f2c766, 0 20px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,235,180,0.6)",
      }}
    >
      {/* Inner bevel + ornamental inner border */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: "10px",
          boxShadow:
            "inset 0 0 0 2px #4a2a05, inset 0 0 0 4px #e9c66a, inset 0 0 0 6px #7a4a10, inset 0 0 22px rgba(0,0,0,0.55)",
          background: "#000",
        }}
      >
        {children}
      </div>

      {/* Four ornamental corners */}
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
            background:
              "radial-gradient(circle at 30% 30%, #fff2b8 0%, #f2c766 35%, #8a5a15 75%, #3a2005 100%)",
            boxShadow:
              "0 0 0 1.5px #3a2005, 0 2px 6px rgba(0,0,0,0.6), inset 0 0 4px rgba(255,255,255,0.4)",
          }}
        />
      ))}
    </div>
  );
}
