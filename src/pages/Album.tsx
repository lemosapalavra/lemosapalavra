import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import StickerPackAnimation, { StickerResult } from "@/components/StickerPackAnimation";
import { categories, allStickers, rarityBorder, rarityLabel, type Rarity, type Sticker } from "@/data/stickers";
import { useCoins, ensureInitialCoins } from "@/hooks/useCoins";
import albumCapa from "@/assets/album-capa.png";
import iconInicio from "@/assets/icon-inicio.jpg";
import iconUsuario from "@/assets/icon-usuario.png";

const STICKERS_KEY = "lemos_stickers_v2";
const PACK_COST = 3;

type Owned = Record<number, number>;

function readOwned(): Owned {
  try { return JSON.parse(localStorage.getItem(STICKERS_KEY) || "{}"); } catch { return {}; }
}
function writeOwned(o: Owned) {
  localStorage.setItem(STICKERS_KEY, JSON.stringify(o));
}

// Daily seed → rotates pool order so every day a different mix appears
function dailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function seededRand(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function shuffleDaily<T>(arr: T[], salt: number): T[] {
  const seed = dailySeed() + salt;
  return [...arr]
    .map((v, i) => ({ v, k: seededRand(seed + i * 13) }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.v);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Build a 5-sticker pack: 1 reliquia + 1 rara + 3 normais (daily-rotated pools)
function buildPack(): { sticker: Sticker; rarity: Rarity }[] {
  const reliquias = shuffleDaily(allStickers.filter((s) => s.rarity === "reliquia"), 1);
  const raras = shuffleDaily(allStickers.filter((s) => s.rarity === "rara"), 2);
  const normais = shuffleDaily(allStickers.filter((s) => s.rarity === "normal"), 3);

  const result: { sticker: Sticker; rarity: Rarity }[] = [];
  result.push({ sticker: pickRandom(reliquias.slice(0, Math.max(8, reliquias.length))), rarity: "reliquia" });
  result.push({ sticker: pickRandom(raras), rarity: "rara" });
  for (let i = 0; i < 3; i++) result.push({ sticker: pickRandom(normais), rarity: "normal" });
  return result;
}

type View = "cover" | "pages" | "trade";

export default function Album() {
  const navigate = useNavigate();
  const { coins, spendCoins } = useCoins();
  const [view, setView] = useState<View>("cover");
  const [pageIdx, setPageIdx] = useState(0); // index into categories
  const [packResult, setPackResult] = useState<StickerResult[] | null>(null);
  const [owned, setOwned] = useState<Owned>(readOwned());
  const [flipDir, setFlipDir] = useState<"next" | "prev" | null>(null);

  useEffect(() => { ensureInitialCoins(); }, []);

  const totalOwned = useMemo(
    () => Object.keys(owned).filter((k) => owned[+k] > 0).length,
    [owned]
  );

  const repeats = useMemo(() => {
    return Object.entries(owned)
      .filter(([, c]) => (c || 0) > 1)
      .map(([id, c]) => {
        const s = allStickers.find((x) => x.id === +id)!;
        return { sticker: s, count: c - 1 };
      })
      .filter((x) => x.sticker);
  }, [owned]);

  const missing = useMemo(() => allStickers.filter((s) => !owned[s.id]), [owned]);

  const buyPack = useCallback(() => {
    if (!spendCoins(PACK_COST)) return;
    const pack = buildPack();
    const next = { ...readOwned() };
    const results: StickerResult[] = pack.map(({ sticker, rarity }) => {
      const isRepeat = (next[sticker.id] || 0) > 0;
      next[sticker.id] = (next[sticker.id] || 0) + 1;
      return { index: sticker.id, name: sticker.name, emoji: sticker.emoji, rarity, isRepeat };
    });
    writeOwned(next);
    setOwned(next);
    setPackResult(results);
  }, [spendCoins]);

  const goToPage = (idx: number, dir: "next" | "prev") => {
    setFlipDir(dir);
    setTimeout(() => {
      setPageIdx(idx);
      setFlipDir(null);
    }, 700);
  };

  const next = () => goToPage((pageIdx + 1) % categories.length, "next");
  const prev = () => goToPage((pageIdx - 1 + categories.length) % categories.length, "prev");

  // ============= COVER =============
  if (view === "cover") {
    return (
      <div
        className="fixed inset-0 z-40 flex flex-col p-4"
        style={{ background: "radial-gradient(ellipse at center, hsl(220,40%,15%), hsl(220,50%,8%))" }}
      >
        <StandardHeader onHome={() => navigate("/")} coins={coins} />

        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            onClick={() => setView("pages")}
            className="relative cursor-pointer group max-w-md w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-amber-700/50 transition-transform hover:scale-[1.02] hover:rotate-1"
          >
            <img src={albumCapa} alt="Heróis da Fé" className="w-full h-full object-cover" />
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-amber-900/80 to-transparent" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full font-display font-bold text-sm shadow-lg animate-pulse">
              👆 Toque para abrir
            </div>
          </div>

          <p className="mt-6 text-white/70 font-body text-sm text-center max-w-md">
            Colecione mais de 120 figurinhas! Cada pacotinho tem <strong>5 figurinhas</strong> (1 rara + 1 especial).
          </p>
        </div>
      </div>
    );
  }

  // ============= TRADE =============
  if (view === "trade") {
    return (
      <div
        className="fixed inset-0 z-40 overflow-y-auto p-4"
        style={{ background: "linear-gradient(180deg, hsl(35,45%,88%), hsl(40,50%,82%))" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-amber-100/95 backdrop-blur py-2 -mx-4 px-4 rounded-b-2xl shadow">
            <button
              onClick={() => setView("pages")}
              className="flex items-center gap-2 font-display font-bold"
            >
              <ChevronLeft className="w-5 h-5" /> Álbum
            </button>
            <h1 className="font-display font-extrabold text-lg sm:text-xl">🔄 Sala de Trocas</h1>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border">
              <span>🪙</span><span className="font-bold">{coins}</span>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow border">
            <p className="font-display font-bold text-foreground mb-1">📦 Suas repetidas para trocar</p>
            <p className="text-xs text-muted-foreground font-body">
              Estas são as figurinhas que você tem em duplicata. Outros colecionadores procuram suas faltantes — proponha trocas!
            </p>
          </div>

          {repeats.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-amber-700/30 p-8 text-center bg-white/40">
              <p className="font-body text-muted-foreground">
                Você ainda não tem figurinhas repetidas. Abra mais pacotinhos!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
              {repeats.map(({ sticker, count }) => (
                <div
                  key={sticker.id}
                  className={`bg-white rounded-xl p-2 border-[3px] ${rarityBorder(sticker.rarity)} shadow-md text-center`}
                >
                  <div className="text-3xl">{sticker.emoji}</div>
                  <div className="font-display font-bold text-[11px] leading-tight mt-1">{sticker.name}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">{rarityLabel(sticker.rarity)}</div>
                  <div className="mt-1 inline-flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ×{count}
                  </div>
                  <button className="mt-2 w-full text-[10px] font-display font-bold bg-gradient-to-br from-emerald-500 to-teal-600 text-white py-1 rounded-md hover:scale-105 transition">
                    Oferecer
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white/80 rounded-2xl p-4 shadow border">
            <p className="font-display font-bold text-foreground mb-2">🎯 Suas faltantes ({missing.length})</p>
            {missing.length === 0 ? (
              <p className="font-body text-sm text-emerald-700">🎉 Você completou o álbum!</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                {missing.map((s) => (
                  <div key={s.id} className="bg-amber-100 rounded-lg p-2 border border-dashed border-amber-700/40 text-center opacity-80">
                    <div className="text-xl">❓</div>
                    <div className="text-[9px] font-bold leading-tight">{s.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground font-body mt-4">
            💡 Em breve: encontrar usuários com as figurinhas que você precisa.
          </p>
        </div>
      </div>
    );
  }

  // ============= PAGES (fullscreen flip) =============
  const cat = categories[pageIdx];
  const got = cat.stickers.filter((s) => (owned[s.id] || 0) > 0).length;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col"
      style={{ background: "radial-gradient(ellipse at center, hsl(35,45%,82%), hsl(30,40%,55%))" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-amber-950/90 text-white shadow-lg z-10">
        <button
          onClick={() => setView("cover")}
          className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full font-display font-bold text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Capa
        </button>
        <div className="text-center">
          <div className="font-display font-extrabold text-sm sm:text-base">📖 Heróis da Fé</div>
          <div className="text-[10px] opacity-80">{totalOwned} / {allStickers.length} coletadas</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("trade")}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 px-2 sm:px-3 py-1.5 rounded-full font-display font-bold text-xs transition"
            title="Trocas"
          >
            <Repeat className="w-4 h-4" /> <span className="hidden sm:inline">Trocas</span>
          </button>
          <div className="flex items-center gap-1 bg-white/15 px-2 py-1.5 rounded-full text-sm">
            <span>🪙</span><span className="font-bold">{coins}</span>
          </div>
        </div>
      </div>

      {/* Page area */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden" style={{ perspective: "1600px" }}>
        <div
          className={`w-full max-w-5xl h-full max-h-[calc(100vh-140px)] ${
            flipDir === "next" ? "animate-page-flip-next" : flipDir === "prev" ? "animate-page-flip-prev" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="bg-amber-900 rounded-2xl p-2 sm:p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] border-4 border-amber-950 h-full grid grid-cols-1 md:grid-cols-2 gap-1">
            {/* Left page */}
            <PageHalf
              side="left"
              title={cat.name}
              icon={cat.icon}
              color={cat.color}
              pageNum={pageIdx * 2 + 1}
              stickers={cat.stickers.slice(0, 5)}
              owned={owned}
            />
            {/* Right page */}
            <PageHalf
              side="right"
              title={cat.name}
              icon={cat.icon}
              color={cat.color}
              pageNum={pageIdx * 2 + 2}
              stickers={cat.stickers.slice(5, 10)}
              owned={owned}
              progress={`${got}/${cat.stickers.length}`}
            />
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-amber-950/90 z-10">
        <button
          onClick={prev}
          className="bg-white/90 px-3 py-2 rounded-full font-display font-bold flex items-center gap-1 shadow hover:scale-105 transition text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Anterior</span>
        </button>
        <button
          onClick={buyPack}
          disabled={coins < PACK_COST}
          className="bg-gradient-to-br from-amber-400 to-orange-600 disabled:opacity-50 text-white font-display font-bold px-4 sm:px-6 py-2 rounded-full shadow-lg hover:scale-105 transition text-sm animate-shadow-pulse"
        >
          🎁 Pacotinho (3 🪙)
        </button>
        <button
          onClick={next}
          className="bg-white/90 px-3 py-2 rounded-full font-display font-bold flex items-center gap-1 shadow hover:scale-105 transition text-sm"
        >
          <span className="hidden sm:inline">Próxima</span> <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {packResult && (
        <StickerPackAnimation
          stickers={packResult}
          onClose={() => { setPackResult(null); setOwned(readOwned()); }}
        />
      )}
    </div>
  );
}

function PageHalf({
  side, title, icon, color, pageNum, stickers, owned, progress,
}: {
  side: "left" | "right";
  title: string;
  icon: string;
  color: string;
  pageNum: number;
  stickers: Sticker[];
  owned: Owned;
  progress?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-3 sm:p-4 shadow-inner ${
        side === "left" ? "border-r-2 border-amber-900/30" : "border-l-2 border-amber-900/30"
      } relative flex flex-col`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`bg-gradient-to-r ${color} text-white px-3 py-1 rounded-full text-xs font-display font-bold flex items-center gap-1`}>
          <span>{icon}</span><span>{title}</span>
        </div>
        {progress && <span className="text-[10px] font-bold text-amber-900/70">{progress}</span>}
      </div>
      <div className="grid grid-cols-3 gap-2 flex-1 content-start">
        {stickers.map((s) => {
          const has = (owned[s.id] || 0) > 0;
          return (
            <div
              key={s.id}
              className={`aspect-[3/4] rounded-xl border-[3px] flex flex-col items-center justify-center p-1.5 text-center transition-all ${
                has
                  ? `bg-gradient-to-br from-white to-amber-50 ${rarityBorder(s.rarity)} shadow-lg`
                  : "bg-amber-100/50 border-dashed border-amber-700/30 opacity-50"
              }`}
            >
              <span className={`text-[8px] font-bold uppercase tracking-wide ${
                s.rarity === "reliquia" ? "text-yellow-600" : s.rarity === "rara" ? "text-blue-600" : "text-slate-500"
              }`}>{rarityLabel(s.rarity)}</span>
              <span className="text-2xl sm:text-3xl my-1">{has ? s.emoji : "❓"}</span>
              <span className="text-[9px] font-display font-bold text-foreground leading-tight">
                {has ? s.name : `#${s.id + 1}`}
              </span>
              {has && (owned[s.id] || 0) > 1 && (
                <span className="text-[8px] mt-0.5 bg-red-500/80 text-white px-1.5 rounded-full">×{owned[s.id]}</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center font-display font-bold text-amber-900/60 text-[10px] mt-2">— pág. {pageNum} —</p>
    </div>
  );
}
