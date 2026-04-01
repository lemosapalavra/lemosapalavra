import { useState, useEffect } from "react";

export type StickerRarity = "bronze" | "prata" | "ouro";

export interface StickerResult {
  index: number;
  name: string;
  emoji: string;
  rarity: StickerRarity;
  isRepeat: boolean;
}

interface StickerPackAnimationProps {
  stickers: StickerResult[];
  onClose: () => void;
}

const rarityConfig = {
  bronze: { label: "Bronze", border: "border-amber-700", bg: "bg-amber-900/20", glow: "shadow-amber-700/30", text: "text-amber-600", value: 1 },
  prata: { label: "Prata", border: "border-gray-300", bg: "bg-gray-200/30", glow: "shadow-gray-300/40", text: "text-gray-500", value: 3 },
  ouro: { label: "Ouro", border: "border-yellow-400", bg: "bg-yellow-400/20", glow: "shadow-yellow-400/50", text: "text-yellow-500", value: 5 },
};

export default function StickerPackAnimation({ stickers, onClose }: StickerPackAnimationProps) {
  const [phase, setPhase] = useState<"pack" | "opening" | "reveal">("pack");
  const [revealedIdx, setRevealedIdx] = useState(-1);

  useEffect(() => {
    if (phase === "opening") {
      const t = setTimeout(() => setPhase("reveal"), 800);
      return () => clearTimeout(t);
    }
    if (phase === "reveal" && revealedIdx < stickers.length - 1) {
      const t = setTimeout(() => setRevealedIdx(prev => prev + 1), 600);
      return () => clearTimeout(t);
    }
  }, [phase, revealedIdx, stickers.length]);

  useEffect(() => {
    if (phase === "reveal" && revealedIdx === -1) {
      setRevealedIdx(0);
    }
  }, [phase, revealedIdx]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={phase === "reveal" && revealedIdx >= stickers.length - 1 ? onClose : undefined}>
      <div className="flex flex-col items-center gap-6">
        {/* Pack phase */}
        {phase === "pack" && (
          <div
            className="cursor-pointer animate-bounce"
            onClick={() => setPhase("opening")}
          >
            <div className="w-48 h-64 rounded-2xl bg-gradient-to-br from-primary to-accent border-4 border-primary/50 shadow-2xl flex flex-col items-center justify-center gap-3 hover:scale-110 transition-transform">
              <span className="text-6xl">🎁</span>
              <span className="font-display text-lg font-bold text-primary-foreground">Pacotinho</span>
              <span className="font-body text-xs text-primary-foreground/70">Toque para abrir!</span>
              <span className="font-display text-sm font-bold text-primary-foreground/80">3 figurinhas</span>
            </div>
          </div>
        )}

        {/* Opening animation */}
        {phase === "opening" && (
          <div className="relative">
            <div className="w-48 h-64 rounded-2xl bg-gradient-to-br from-primary to-accent border-4 border-primary/50 shadow-2xl flex items-center justify-center animate-pulse">
              <div className="absolute inset-0 bg-white/30 rounded-2xl animate-ping" />
              <span className="text-6xl animate-spin">✨</span>
            </div>
          </div>
        )}

        {/* Reveal phase */}
        {phase === "reveal" && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="font-display text-2xl font-bold text-white drop-shadow-lg">Suas Figurinhas!</h2>
            <div className="flex gap-4">
              {stickers.map((s, i) => {
                const config = rarityConfig[s.rarity];
                const revealed = i <= revealedIdx;
                return (
                  <div
                    key={i}
                    className={`w-28 h-36 rounded-2xl border-3 flex flex-col items-center justify-center gap-1 transition-all duration-500 ${
                      revealed
                        ? `${config.border} ${config.bg} ${config.glow} shadow-xl scale-100 opacity-100`
                        : "border-white/20 bg-white/10 scale-75 opacity-30"
                    } ${s.isRepeat && revealed ? "ring-2 ring-red-400" : ""}`}
                    style={{ borderWidth: 3 }}
                  >
                    {revealed ? (
                      <>
                        <span className={`text-[10px] font-bold ${config.text} uppercase`}>{config.label}</span>
                        <span className="text-3xl">{s.emoji}</span>
                        <span className="font-display text-[9px] font-bold text-white text-center leading-tight px-1">{s.name}</span>
                        {s.isRepeat && (
                          <span className="text-[8px] font-bold text-red-400 bg-red-400/20 px-1.5 rounded-full">REPETIDA</span>
                        )}
                        <span className="text-[8px] text-white/60">🪙 {config.value}</span>
                      </>
                    ) : (
                      <span className="text-4xl">❓</span>
                    )}
                  </div>
                );
              })}
            </div>
            {revealedIdx >= stickers.length - 1 && (
              <div className="flex flex-col items-center gap-2 mt-2">
                {stickers.some(s => s.isRepeat) && (
                  <p className="font-body text-sm text-yellow-300">
                    📦 Figurinhas repetidas foram guardadas para troca!
                  </p>
                )}
                <button
                  onClick={onClose}
                  className="btn-cartoon px-6 py-2 text-sm"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
