import { useState, useEffect } from "react";
import packImg from "@/assets/pack-herois-fe.png";

export type StickerRarity = "normal" | "rara" | "reliquia";

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
  normal: { label: "Normal", border: "border-slate-300", bg: "bg-slate-200/30", glow: "shadow-slate-400/30", text: "text-slate-500", value: 1 },
  rara: { label: "Rara", border: "border-blue-400", bg: "bg-blue-400/20", glow: "shadow-blue-400/50", text: "text-blue-400", value: 3 },
  reliquia: { label: "Especial", border: "border-yellow-400", bg: "bg-gradient-to-br from-yellow-400/30 to-orange-500/30", glow: "shadow-yellow-400/70", text: "text-yellow-400", value: 8 },
};

export default function StickerPackAnimation({ stickers, onClose }: StickerPackAnimationProps) {
  const [phase, setPhase] = useState<"pack" | "tearing" | "reveal">("pack");
  const [revealedIdx, setRevealedIdx] = useState(-1);

  useEffect(() => {
    if (phase === "tearing") {
      const t = setTimeout(() => setPhase("reveal"), 900);
      return () => clearTimeout(t);
    }
    if (phase === "reveal") {
      if (revealedIdx === -1) {
        setRevealedIdx(0);
        return;
      }
      if (revealedIdx < stickers.length - 1) {
        const t = setTimeout(() => setRevealedIdx((p) => p + 1), 450);
        return () => clearTimeout(t);
      }
    }
  }, [phase, revealedIdx, stickers.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={phase === "reveal" && revealedIdx >= stickers.length - 1 ? onClose : undefined}
    >
      <div className="flex flex-col items-center gap-6 w-full">
        {phase === "pack" && (
          <div className="flex flex-col items-center gap-3">
            <div
              className="cursor-pointer animate-shadow-pulse"
              onClick={() => setPhase("tearing")}
            >
              <img
                src={packImg}
                alt="Pacotinho"
                className="w-56 sm:w-64 h-auto rounded-xl select-none"
                draggable={false}
              />
            </div>
            <p className="font-display font-bold text-white text-lg drop-shadow-lg animate-pulse">
              👆 Toque para rasgar!
            </p>
          </div>
        )}

        {phase === "tearing" && (
          <div className="relative w-56 sm:w-64 animate-shake-tear">
            {/* Left half tearing away */}
            <div
              className="absolute inset-0 overflow-hidden animate-tear-left"
              style={{ clipPath: "polygon(0 0, 52% 0, 48% 100%, 0 100%)" }}
            >
              <img src={packImg} alt="" className="w-full h-auto" draggable={false} />
            </div>
            {/* Right half tearing away */}
            <div
              className="overflow-hidden animate-tear-right"
              style={{ clipPath: "polygon(52% 0, 100% 0, 100% 100%, 48% 100%)" }}
            >
              <img src={packImg} alt="" className="w-full h-auto" draggable={false} />
            </div>
            {/* Light burst */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full bg-yellow-300/80 blur-2xl animate-ping" />
            </div>
          </div>
        )}

        {phase === "reveal" && (
          <div className="flex flex-col items-center gap-4 w-full">
            <h2 className="font-display text-2xl font-bold text-white drop-shadow-lg">
              ✨ Suas Figurinhas! ✨
            </h2>
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center max-w-3xl">
              {stickers.map((s, i) => {
                const config = rarityConfig[s.rarity];
                const revealed = i <= revealedIdx;
                return (
                  <div
                    key={i}
                    className={`w-24 sm:w-28 h-32 sm:h-36 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-500 ${
                      revealed
                        ? `${config.border} ${config.bg} ${config.glow} shadow-xl scale-100 opacity-100`
                        : "border-white/20 bg-white/10 scale-75 opacity-30"
                    } ${s.isRepeat && revealed ? "ring-2 ring-red-400" : ""}`}
                    style={{ borderWidth: 3, borderStyle: "solid" }}
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
                {stickers.some((s) => s.isRepeat) && (
                  <p className="font-body text-sm text-yellow-300">
                    📦 Repetidas guardadas para troca!
                  </p>
                )}
                <button onClick={onClose} className="btn-cartoon px-6 py-2 text-sm">
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
