import { ReactNode } from "react";
import ShareButton from "@/components/ShareButton";

interface WavyBannerProps {
  /** Linhas de texto da faixa. */
  lines: string[];
  emoji?: string;
  className?: string;
  tone?: "amber" | "dark";
  /** Mostra o botão de compartilhar o site ao lado do texto. */
  share?: boolean;
  children?: ReactNode;
}

/**
 * Bloco de texto informativo usado em todo o site.
 * Texto escuro, centralizado e de fácil leitura, sem fundo vermelho.
 */
export default function WavyBanner({ lines, emoji, className = "", share = true }: WavyBannerProps) {
  return (
    <div className={`w-full flex justify-center my-4 ${className}`}>
      <div className="w-full max-w-2xl rounded-2xl bg-white/70 px-5 sm:px-8 py-4 text-center shadow-sm ring-1 ring-amber-200/60 backdrop-blur-sm">
        {lines.map((l, i) => (
          <p
            key={i}
            className="font-body font-semibold text-amber-950 leading-relaxed text-sm sm:text-base"
          >
            {i === 0 && emoji ? `${emoji} ` : ""}
            {l}
          </p>
        ))}
        {share && (
          <div className="mt-3 flex justify-center">
            <ShareButton variant="inline" />
          </div>
        )}
      </div>
    </div>
  );
}
