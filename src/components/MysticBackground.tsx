import { useMemo } from "react";

// Hebrew letters + Egyptian hieroglyph-like symbols
const SYMBOLS = [
  // Hebrew alphabet
  "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י",
  "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת",
  // Egyptian hieroglyphs (Unicode block)
  "𓂀", "𓁹", "𓆣", "𓅓", "𓋹", "𓊽", "𓍑", "𓆗", "𓃭", "𓇋",
  "𓏏", "𓊪", "𓎼", "𓐍", "𓂧", "𓆑", "𓇳", "𓈖", "𓋴", "𓏞",
];

interface Floater {
  symbol: string;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

export default function MysticBackground({ count = 28 }: { count?: number }) {
  const floaters = useMemo<Floater[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 14 + Math.random() * 18,
      duration: 14 + Math.random() * 16,
      delay: -Math.random() * 20,
      opacity: 0.08 + Math.random() * 0.12,
      drift: (Math.random() - 0.5) * 40,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {floaters.map((f, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            fontSize: `${f.size}px`,
            opacity: f.opacity,
            color: "hsl(25, 40%, 30%)",
            animation: `mystic-float ${f.duration}s ease-in-out ${f.delay}s infinite`,
            ["--drift" as string]: `${f.drift}px`,
            textShadow: "0 1px 2px rgba(255,255,255,0.4)",
            fontFamily: "serif",
          }}
        >
          {f.symbol}
        </span>
      ))}
      <style>{`
        @keyframes mystic-float {
          0%   { transform: translate(0, 0) rotate(0deg); }
          50%  { transform: translate(var(--drift), -30px) rotate(8deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
