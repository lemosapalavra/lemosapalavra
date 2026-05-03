import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import StickerPackAnimation, { StickerResult } from "@/components/StickerPackAnimation";
import { categories, allStickers, rarityBorder, rarityLabel, type Rarity } from "@/data/stickers";
import { useCoins, ensureInitialCoins } from "@/hooks/useCoins";
import albumCapa from "@/assets/album-capa.png";

const STICKERS_KEY = "lemos_stickers_v2"; // map of id -> count
const PACK_COST = 3;

type Owned = Record<number, number>;

function readOwned(): Owned {
  try { return JSON.parse(localStorage.getItem(STICKERS_KEY) || "{}"); } catch { return {}; }
}
function writeOwned(o: Owned) {
  localStorage.setItem(STICKERS_KEY, JSON.stringify(o));
}

function rollRarity(): Rarity {
  const r = Math.random();
  if (r < 0.05) return "reliquia";
  if (r < 0.30) return "rara";
  return "normal";
}

function pickSticker(rarity: Rarity) {
  const pool = allStickers.filter((s) => s.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)] || allStickers[0];
}

export default function Album() {
  const navigate = useNavigate();
  const { coins, spendCoins } = useCoins();
  const [view, setView] = useState<"cover" | "categories" | "spread">("cover");
  const [catIdx, setCatIdx] = useState(0);
  const [packResult, setPackResult] = useState<StickerResult[] | null>(null);
  const [owned, setOwned] = useState<Owned>(readOwned());
  const [flipping, setFlipping] = useState(false);

  useEffect(() => { ensureInitialCoins(); }, []);

  const totalOwned = useMemo(() => Object.keys(owned).filter((k) => owned[+k] > 0).length, [owned]);

  const buyPack = useCallback(() => {
    if (!spendCoins(PACK_COST)) return;
    const results: StickerResult[] = [];
    const next = { ...readOwned() };
    for (let i = 0; i < 3; i++) {
      const r = rollRarity();
      const s = pickSticker(r);
      const isRepeat = (next[s.id] || 0) > 0;
      next[s.id] = (next[s.id] || 0) + 1;
      results.push({ index: s.id, name: s.name, emoji: s.emoji, rarity: r, isRepeat });
    }
    writeOwned(next);
    setOwned(next);
    setPackResult(results);
  }, [spendCoins]);

  const flipTo = (target: "cover" | "categories" | "spread", newCat?: number) => {
    setFlipping(true);
    setTimeout(() => {
      if (newCat !== undefined) setCatIdx(newCat);
      setView(target);
      setFlipping(false);
    }, 350);
  };

  // ============= COVER =============
  if (view === "cover") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative" style={{ background: "radial-gradient(ellipse at center, hsl(220,40%,15%), hsl(220,50%,8%))" }}>
        <button onClick={() => navigate("/")} className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white border border-white/20">
          <span className="text-2xl">🪙</span>
          <span className="font-display font-bold text-lg">{coins}</span>
        </div>

        <div
          onClick={() => flipTo("categories")}
          className="relative cursor-pointer group max-w-md w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-amber-700/50 transition-transform hover:scale-[1.02] hover:rotate-1"
          style={{ transformOrigin: "left center" }}
        >
          <img src={albumCapa} alt="Heróis da Fé" className="w-full h-full object-cover" />
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-amber-900/80 to-transparent" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full font-display font-bold text-sm shadow-lg animate-pulse">
            👆 Toque para abrir
          </div>
        </div>

        <p className="mt-6 text-white/70 font-body text-sm text-center max-w-md">
          Colecione mais de 120 figurinhas dos Heróis da Fé! Compre pacotinhos por <strong>3 moedas</strong>.
        </p>
      </div>
    );
  }

  // ============= CATEGORIES INDEX =============
  if (view === "categories") {
    return (
      <div className={`min-h-screen p-4 transition-all duration-300 ${flipping ? "opacity-0 scale-95" : "opacity-100"}`} style={{ background: "linear-gradient(180deg, hsl(35,45%,88%), hsl(40,50%,82%))" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => flipTo("cover")} className="flex items-center gap-2 text-foreground font-display font-bold">
              <ChevronLeft className="w-5 h-5" /> Capa
            </button>
            <h1 className="font-display font-extrabold text-xl text-foreground">Heróis da Fé</h1>
            <div className="flex items-center gap-2 bg-popover px-3 py-1.5 rounded-full border border-border">
              <span>🪙</span><span className="font-bold">{coins}</span>
            </div>
          </div>

          <div className="bg-popover/80 rounded-2xl p-4 mb-4 shadow-md border border-border flex items-center gap-3">
            <div className="flex-1">
              <p className="font-display font-bold text-foreground">Coletadas: {totalOwned} / {allStickers.length}</p>
              <div className="bg-background rounded-full h-3 mt-1 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all" style={{ width: `${(totalOwned / allStickers.length) * 100}%` }} />
              </div>
            </div>
            <button onClick={buyPack} disabled={coins < PACK_COST} className="bg-gradient-to-br from-amber-500 to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-display font-bold px-4 py-3 rounded-xl shadow-lg hover:scale-105 transition disabled:cursor-not-allowed disabled:opacity-60">
              🎁 Pacotinho<br/><span className="text-xs">3 🪙</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((c, i) => {
              const got = c.stickers.filter((s) => (owned[s.id] || 0) > 0).length;
              return (
                <button
                  key={c.key}
                  onClick={() => flipTo("spread", i)}
                  className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-xl hover:scale-105 transition aspect-square flex flex-col items-center justify-center gap-2 border-2 border-white/30`}
                >
                  <span className="text-4xl">{c.icon}</span>
                  <span className="font-display font-bold text-sm text-center leading-tight">{c.name}</span>
                  <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full">{got}/{c.stickers.length}</span>
                </button>
              );
            })}
          </div>
        </div>
        {packResult && <StickerPackAnimation stickers={packResult} onClose={() => setPackResult(null)} />}
      </div>
    );
  }

  // ============= SPREAD (2 pages) =============
  const cat = categories[catIdx];
  const leftPage = cat.stickers.slice(0, 5);
  const rightPage = cat.stickers.slice(5, 10);

  const renderSticker = (s: typeof cat.stickers[number]) => {
    const got = (owned[s.id] || 0) > 0;
    return (
      <div
        key={s.id}
        className={`aspect-[3/4] rounded-xl border-[3px] flex flex-col items-center justify-center p-2 text-center transition-all ${
          got
            ? `bg-gradient-to-br from-white to-amber-50 ${rarityBorder(s.rarity)} shadow-lg`
            : "bg-amber-100/50 border-dashed border-amber-700/30 opacity-50"
        }`}
      >
        <span className={`text-[9px] font-bold uppercase tracking-wide ${
          s.rarity === "reliquia" ? "text-yellow-600" : s.rarity === "rara" ? "text-blue-600" : "text-slate-500"
        }`}>{rarityLabel(s.rarity)}</span>
        <span className="text-3xl sm:text-4xl my-1">{got ? s.emoji : "❓"}</span>
        <span className="text-[10px] font-display font-bold text-foreground leading-tight">
          {got ? s.name : `#${s.id + 1}`}
        </span>
        {got && (owned[s.id] || 0) > 1 && (
          <span className="text-[9px] mt-0.5 bg-red-500/80 text-white px-1.5 rounded-full">×{owned[s.id]}</span>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-2 sm:p-4 transition-all duration-300 ${flipping ? "opacity-0 scale-95" : "opacity-100"}`} style={{ background: "radial-gradient(ellipse at center, hsl(35,45%,82%), hsl(30,40%,65%))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => flipTo("categories")} className="flex items-center gap-2 bg-popover px-3 py-2 rounded-full font-display font-bold shadow">
            <ChevronLeft className="w-4 h-4" /> Categorias
          </button>
          <h2 className="font-display font-extrabold text-lg sm:text-2xl text-foreground bg-white/70 px-4 py-1 rounded-full shadow">
            {cat.icon} {cat.name}
          </h2>
          <div className="flex items-center gap-1 bg-popover px-3 py-2 rounded-full">
            <span>🪙</span><span className="font-bold text-sm">{coins}</span>
          </div>
        </div>

        {/* Open book spread */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-amber-900 rounded-2xl p-2 sm:p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border-4 border-amber-950">
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-3 sm:p-4 shadow-inner border-r-2 border-amber-900/30 relative">
            <p className="text-center font-display font-bold text-amber-900/70 text-xs mb-2">— Página {catIdx * 2 + 1} —</p>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {leftPage.map(renderSticker)}
              <div className="aspect-[3/4]" /> <div className="aspect-[3/4]" />
            </div>
          </div>
          <div className="bg-gradient-to-bl from-amber-50 to-orange-100 rounded-xl p-3 sm:p-4 shadow-inner border-l-2 border-amber-900/30 relative">
            <p className="text-center font-display font-bold text-amber-900/70 text-xs mb-2">— Página {catIdx * 2 + 2} —</p>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {rightPage.map(renderSticker)}
              <div className="aspect-[3/4]" /> <div className="aspect-[3/4]" />
            </div>
          </div>
        </div>

        {/* Navigation between categories */}
        <div className="flex items-center justify-between mt-4 gap-2">
          <button
            onClick={() => flipTo("spread", (catIdx - 1 + categories.length) % categories.length)}
            className="bg-popover px-4 py-2 rounded-full font-display font-bold flex items-center gap-1 shadow hover:scale-105 transition"
          >
            <ChevronLeft className="w-4 h-4" /> {categories[(catIdx - 1 + categories.length) % categories.length].name}
          </button>
          <button onClick={buyPack} disabled={coins < PACK_COST} className="bg-gradient-to-br from-amber-500 to-orange-600 disabled:opacity-50 text-white font-display font-bold px-5 py-2 rounded-full shadow-lg hover:scale-105 transition">
            🎁 Pacotinho (3 🪙)
          </button>
          <button
            onClick={() => flipTo("spread", (catIdx + 1) % categories.length)}
            className="bg-popover px-4 py-2 rounded-full font-display font-bold flex items-center gap-1 shadow hover:scale-105 transition"
          >
            {categories[(catIdx + 1) % categories.length].name} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {packResult && <StickerPackAnimation stickers={packResult} onClose={() => { setPackResult(null); setOwned(readOwned()); }} />}
    </div>
  );
}
