import { ReactNode } from "react";

interface WavyBannerProps {
  /** Linhas de texto da faixa. */
  lines: string[];
  emoji?: string;
  className?: string;
  tone?: "amber" | "dark";
  children?: ReactNode;
}

/**
 * Faixa vermelha estilosa usada em todo o site para apresentar mensagens.
 * Texto sempre branco e centralizado, com animação suave de "pano ao vento".
 */
export default function WavyBanner({ lines, emoji, className = "", children }: WavyBannerProps) {
  return (
    <div className={`w-full flex justify-center my-4 ${className}`}>
      <div className="wavy-banner relative w-full max-w-2xl">
        {/* pontas da fita */}
        <span className="absolute -left-3 top-1/2 -translate-y-1/2 hidden sm:block w-6 h-8 bg-red-900 rounded-l-md shadow-md" />
        <span className="absolute -right-3 top-1/2 -translate-y-1/2 hidden sm:block w-6 h-8 bg-red-900 rounded-r-md shadow-md" />

        <div
          className="relative rounded-2xl px-5 sm:px-8 py-4 text-center shadow-xl ring-1 ring-white/25"
          style={{
            background:
              "linear-gradient(180deg, hsl(0,72%,52%) 0%, hsl(0,74%,44%) 45%, hsl(0,70%,38%) 100%)",
          }}
        >
          <span className="pointer-events-none absolute inset-x-3 top-1 h-1/3 rounded-full bg-white/15 blur-[2px]" />
          {lines.map((l, i) => (
            <p
              key={i}
              className="relative font-display font-bold text-white leading-snug text-[clamp(12px,2.2vw,18px)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            >
              {i === 0 && emoji ? `${emoji} ` : ""}
              {l}
            </p>
          ))}
          {children}
        </div>
      </div>

      <style>{`
        @keyframes wind-wave {
          0%   { transform: perspective(700px) rotateX(0deg) rotateY(0deg) skewY(0deg) translateY(0); }
          25%  { transform: perspective(700px) rotateX(1.2deg) rotateY(-0.8deg) skewY(-0.4deg) translateY(-2px); }
          50%  { transform: perspective(700px) rotateX(0deg) rotateY(0deg) skewY(0.4deg) translateY(1px); }
          75%  { transform: perspective(700px) rotateX(-1.2deg) rotateY(0.8deg) skewY(-0.2deg) translateY(-1px); }
          100% { transform: perspective(700px) rotateX(0deg) rotateY(0deg) skewY(0deg) translateY(0); }
        }
        .wavy-banner { animation: wind-wave 5s ease-in-out infinite; transform-origin: 50% 50%; will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .wavy-banner { animation: none; } }
      `}</style>
    </div>
  );
}
