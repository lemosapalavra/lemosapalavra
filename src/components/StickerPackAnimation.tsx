import { useState, useEffect, useMemo } from "react";
import pack1 from "@/assets/pack-herois-1.png";
import pack2 from "@/assets/pack-herois-2.png";
import pack3 from "@/assets/pack-herois-3.png";

export type StickerRarity = "normal" | "rara" | "reliquia";

export interface StickerResult {
  index: number;
  number?: number; // numbered position in album (1-based)
  name: string;
  emoji: string;
  image?: string;
  rarity: StickerRarity;
  isRepeat: boolean;
}

interface StickerPackAnimationProps {
  stickers: StickerResult[];
  onClose: () => void;
}

const PACKS = [pack1, pack2, pack3];

const rarityConfig = {
  normal: { label: "Normal", border: "border-slate-300", bg: "bg-slate-200/30", glow: "shadow-slate-400/40", text: "text-slate-600", value: 1, ring: "" },
  rara: { label: "Rara", border: "border-blue-400", bg: "bg-blue-400/20", glow: "shadow-blue-400/70", text: "text-blue-400", value: 3, ring: "ring-2 ring-blue-300/60 animate-pulse" },
  reliquia: { label: "Especial", border: "border-yellow-400", bg: "bg-gradient-to-br from-yellow-400/40 to-orange-500/40", glow: "shadow-yellow-400/90", text: "text-yellow-400", value: 8, ring: "ring-4 ring-yellow-300/80 animate-pulse" },
};

// Sparkle particles
const Sparkles = ({ count = 20 }: { count?: number }) => {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 1.5,
        size: 8 + Math.random() * 14,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="absolute text-yellow-200"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: s.size,
            animation: `sparkle 1.8s ${s.delay}s ease-in-out infinite`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
};

export default function StickerPackAnimation({ stickers, onClose }: StickerPackAnimationProps) {
  // pick a random pack image per opening (no flicker if reopened)
  const packImg = useMemo(() => PACKS[Math.floor(Math.random() * PACKS.length)], []);
  const [phase, setPhase] = useState<"pack" | "shaking" | "tearing" | "burst" | "reveal">("pack");
  const [revealedIdx, setRevealedIdx] = useState(-1);
  const [flippedIdx, setFlippedIdx] = useState<number[]>([]);

  // play a tiny synthesized "rip" using Web Audio for tactile feedback
  const playRip = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(220, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
      g.gain.setValueAtTime(0.25, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.6);
    } catch {}
  };
  const playSparkle = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + 0.25);
    } catch {}
  };

  // phase sequence
  useEffect(() => {
    if (phase === "shaking") {
      const t = setTimeout(() => { playRip(); setPhase("tearing"); }, 700);
      return () => clearTimeout(t);
    }
    if (phase === "tearing") {
      const t = setTimeout(() => setPhase("burst"), 900);
      return () => clearTimeout(t);
    }
    if (phase === "burst") {
      const t = setTimeout(() => setPhase("reveal"), 600);
      return () => clearTimeout(t);
    }
    if (phase === "reveal") {
      if (revealedIdx === -1) {
        setRevealedIdx(0);
        return;
      }
      if (revealedIdx < stickers.length - 1) {
        const t = setTimeout(() => setRevealedIdx((p) => p + 1), 550);
        return () => clearTimeout(t);
      }
    }
  }, [phase, revealedIdx, stickers.length]);

  // auto-flip each card a moment after it appears
  useEffect(() => {
    if (phase !== "reveal" || revealedIdx < 0) return;
    const t = setTimeout(() => {
      setFlippedIdx((arr) => (arr.includes(revealedIdx) ? arr : [...arr, revealedIdx]));
      playSparkle();
    }, 350);
    return () => clearTimeout(t);
  }, [revealedIdx, phase]);

  const allRevealed = revealedIdx >= stickers.length - 1 && flippedIdx.length >= stickers.length;
  const hasSpecial = stickers.some((s) => s.rarity === "reliquia");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-hidden"
      onClick={allRevealed ? onClose : undefined}
    >
      {/* aurora background while tearing/burst/reveal */}
      {phase !== "pack" && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.18),transparent_60%)]" />
          <Sparkles count={28} />
        </div>
      )}

      <div className="flex flex-col items-center gap-6 w-full relative z-10">
        {phase === "pack" && (
          <div className="flex flex-col items-center gap-3">
            <div
              className="cursor-pointer animate-shadow-pulse hover:scale-105 transition-transform"
              onClick={() => setPhase("shaking")}
            >
              <img
                src={packImg}
                alt="Pacotinho Heróis da Fé"
                className="w-56 sm:w-72 h-auto rounded-xl select-none drop-shadow-2xl"
                draggable={false}
              />
            </div>
            <p className="font-display font-bold text-white text-lg drop-shadow-lg animate-pulse">
              👆 Toque para rasgar!
            </p>
          </div>
        )}

        {phase === "shaking" && (
          <div className="relative">
            <div className="animate-[shakeStrong_0.7s_ease-in-out]">
              <img src={packImg} alt="" className="w-56 sm:w-72 h-auto rounded-xl drop-shadow-2xl" draggable={false} />
            </div>
            {/* Two hands closing in with scissors */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between -mx-10">
              <div className="text-5xl sm:text-6xl animate-[handInLeft_0.7s_ease-out]" style={{ transform: "scaleX(-1)" }}>✋</div>
              <div className="text-5xl sm:text-6xl animate-[handInRight_0.7s_ease-out]">✋</div>
            </div>
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-[scissorsCut_0.7s_ease-out]">✂️</div>
          </div>
        )}

        {phase === "tearing" && (
          <div className="relative w-56 sm:w-72">
            <div className="absolute inset-0 overflow-hidden animate-tear-left" style={{ clipPath: "polygon(0 0, 52% 0, 48% 100%, 0 100%)" }}>
              <img src={packImg} alt="" className="w-full h-auto" draggable={false} />
            </div>
            <div className="overflow-hidden animate-tear-right" style={{ clipPath: "polygon(52% 0, 100% 0, 100% 100%, 48% 100%)" }}>
              <img src={packImg} alt="" className="w-full h-auto" draggable={false} />
            </div>
            {/* Hands pulling each half outward */}
            <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -left-14 text-5xl sm:text-6xl animate-tear-left" style={{ transform: "scaleX(-1)" }}>✋</div>
            <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-14 text-5xl sm:text-6xl animate-tear-right">✋</div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 rounded-full bg-yellow-300/80 blur-3xl animate-ping" />
            </div>
          </div>
        )}

        {phase === "burst" && (
          <div className="relative w-56 sm:w-72 h-72 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300 blur-3xl animate-ping" />
            </div>
            {/* Hand reaching in to pull stickers out */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-6xl sm:text-7xl animate-[handPull_0.6s_ease-out]">🤲</div>
            <div className="relative font-display text-4xl sm:text-5xl font-bold text-yellow-200 drop-shadow-2xl animate-[zoomBounce_0.6s_ease-out]">
              ✨ AGORA! ✨
            </div>
          </div>
        )}

        {phase === "reveal" && (
          <div className="flex flex-col items-center gap-4 w-full">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow-lg animate-[fadeDown_0.5s]">
              ✨ Suas Figurinhas! ✨
            </h2>
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center max-w-3xl perspective-[1000px]">
              {stickers.map((s, i) => {
                const config = rarityConfig[s.rarity];
                const revealed = i <= revealedIdx;
                const flipped = flippedIdx.includes(i);
                return (
                  <div
                    key={i}
                    className="relative w-28 sm:w-32 h-40 sm:h-44"
                    style={{ perspective: "800px" }}
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-700"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: revealed ? (flipped ? "rotateY(180deg) scale(1)" : "rotateY(0deg) scale(1)") : "scale(0.6) rotateY(0deg)",
                        opacity: revealed ? 1 : 0.25,
                      }}
                    >
                      {/* Back of card */}
                      <div
                        className="absolute inset-0 rounded-2xl border-[3px] border-yellow-400/70 bg-gradient-to-br from-indigo-700 to-purple-900 flex items-center justify-center text-4xl shadow-xl"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <span className="drop-shadow-lg">👑</span>
                      </div>
                      {/* Front of card — real image + number + title */}
                      <div
                        className={`absolute inset-0 rounded-2xl overflow-hidden ${config.border} ${config.glow} ${config.ring} shadow-2xl bg-black`}
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          borderWidth: 3,
                          borderStyle: "solid",
                        }}
                      >
                        {s.image ? (
                          <img src={s.image} alt={s.name} className="absolute inset-0 w-full h-full object-contain bg-white p-1" draggable={false} />
                        ) : (
                          <div className={`absolute inset-0 flex items-center justify-center text-5xl ${config.bg}`}>{s.emoji}</div>
                        )}
                        {/* dark gradient for legibility */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/70 to-transparent" />
                        {/* number badge */}
                        {typeof s.number === "number" && (
                          <span className="absolute top-1.5 left-1.5 z-10 text-[10px] font-display font-extrabold bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-md shadow">
                            Nº {String(s.number).padStart(2, "0")}
                          </span>
                        )}
                        <span className={`absolute top-1.5 right-1.5 z-10 text-[9px] font-bold ${config.text} uppercase tracking-wide bg-black/60 px-1.5 py-0.5 rounded-md`}>{config.label}</span>
                        {/* title */}
                        <div className="absolute inset-x-1 bottom-1 z-10 text-center">
                          <p className="font-display text-[11px] sm:text-xs font-extrabold text-white leading-tight drop-shadow-lg line-clamp-2">{s.name}</p>
                          <p className="text-[9px] text-yellow-200 font-bold mt-0.5">🪙 {config.value}</p>
                        </div>
                        {s.isRepeat && (
                          <span className="absolute top-7 left-1.5 z-10 text-[8px] font-bold text-red-100 bg-red-500/90 px-1.5 py-0.5 rounded-full">REPETIDA</span>
                        )}
                        {s.rarity === "reliquia" && (
                          <span className="absolute -top-2 -right-2 z-20 text-2xl animate-bounce">⭐</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {allRevealed && (
              <div className="flex flex-col items-center gap-2 mt-2 animate-[fadeUp_0.5s]">
                {hasSpecial && (
                  <p className="font-display text-base text-yellow-200 font-bold drop-shadow animate-pulse">
                    🏆 Você ganhou uma figurinha ESPECIAL!
                  </p>
                )}
                {stickers.some((s) => s.isRepeat) && (
                  <p className="font-body text-sm text-yellow-300">
                    📦 Repetidas guardadas para troca!
                  </p>
                )}
                <button onClick={onClose} className="btn-cartoon px-6 py-2 text-sm mt-2">
                  Fechar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        @keyframes shakeStrong {
          0%,100%{transform:translateX(0) rotate(0)}
          15%{transform:translateX(-10px) rotate(-3deg)}
          30%{transform:translateX(10px) rotate(3deg)}
          45%{transform:translateX(-10px) rotate(-3deg)}
          60%{transform:translateX(10px) rotate(3deg)}
          80%{transform:translateX(-5px) rotate(-1deg)}
        }
        @keyframes zoomBounce {
          0%{transform:scale(0.3);opacity:0}
          60%{transform:scale(1.2);opacity:1}
          100%{transform:scale(1);opacity:1}
        }
        @keyframes fadeDown {
          from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)}
        }
        @keyframes fadeUp {
          from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)}
        }
      `}</style>
    </div>
  );
}
