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
 * Faixa (banner) única de aviso, com animação suave de "pano ao vento".
 * Usada nas atividades, histórias e rodapé — sempre em bloco próprio para
 * nunca conflitar com ícones ou cabeçalhos.
 */
export default function WavyBanner({ lines, emoji, className = "", tone = "amber", children }: WavyBannerProps) {
  const palette =
    tone === "dark"
      ? "from-amber-900/70 via-amber-800/60 to-amber-900/70 border-amber-500/60 text-amber-50"
      : "from-amber-100 via-yellow-50 to-amber-100 border-amber-300 text-amber-900";

  return (
    <div className={`w-full flex justify-center my-4 ${className}`}>
      <div className="wavy-banner relative max-w-2xl w-full">
        <div
          className={`rounded-2xl border-2 bg-gradient-to-r ${palette} px-4 py-3 shadow-lg text-center`}
        >
          {lines.map((l, i) => (
            <p
              key={i}
              className="font-display font-bold text-[12.5px] sm:text-sm leading-snug"
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
          25%  { transform: perspective(700px) rotateX(1.6deg) rotateY(-1.2deg) skewY(-0.5deg) translateY(-2px); }
          50%  { transform: perspective(700px) rotateX(0deg) rotateY(0deg) skewY(0.5deg) translateY(1px); }
          75%  { transform: perspective(700px) rotateX(-1.6deg) rotateY(1.2deg) skewY(-0.3deg) translateY(-1px); }
          100% { transform: perspective(700px) rotateX(0deg) rotateY(0deg) skewY(0deg) translateY(0); }
        }
        .wavy-banner { animation: wind-wave 5s ease-in-out infinite; transform-origin: 50% 50%; will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .wavy-banner { animation: none; } }
      `}</style>
    </div>
  );
}
