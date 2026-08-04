import { ReactNode } from "react";
import faixa from "@/assets/faixa-1.png.asset.json";

interface WavyBannerProps {
  /** Linhas de texto da faixa. */
  lines: string[];
  emoji?: string;
  className?: string;
  tone?: "amber" | "dark";
  children?: ReactNode;
}

/**
 * Faixa (pergaminho dourado) usada em todo o site para apresentar mensagens.
 * O texto fica sempre centralizado dentro da faixa, com animação suave de
 * "pano ao vento".
 */
export default function WavyBanner({ lines, emoji, className = "", children }: WavyBannerProps) {
  return (
    <div className={`w-full flex justify-center my-4 ${className}`}>
      <div className="wavy-banner relative w-full max-w-2xl">
        <img
          src={faixa.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="w-full h-auto select-none pointer-events-none"
          draggable={false}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[13%] py-[10%]">
          {lines.map((l, i) => (
            <p
              key={i}
              className="font-display font-bold text-amber-900 leading-tight text-[clamp(8px,1.9vw,15px)]"
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
