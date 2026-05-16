import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, Repeat, X } from "lucide-react";
import StickerPackAnimation, { StickerResult } from "@/components/StickerPackAnimation";
import AramaicBackdrop from "@/components/AramaicBackdrop";
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
function writeOwned(o: Owned) { localStorage.setItem(STICKERS_KEY, JSON.stringify(o)); }

function dailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function shuffleDaily<T>(arr: T[], salt: number): T[] {
  const seed = dailySeed() + salt;
  return [...arr].map((v, i) => ({ v, k: seededRand(seed + i * 13) })).sort((a, b) => a.k - b.k).map((x) => x.v);
}
function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function buildPack(): { sticker: Sticker; rarity: Rarity }[] {
  const reliquias = shuffleDaily(allStickers.filter((s) => s.rarity === "reliquia"), 1);
  const raras = shuffleDaily(allStickers.filter((s) => s.rarity === "rara"), 2);
  const normais = shuffleDaily(allStickers.filter((s) => s.rarity === "normal"), 3);
  const result: { sticker: Sticker; rarity: Rarity }[] = [];
  result.push({ sticker: pickRandom(reliquias), rarity: "reliquia" });
  result.push({ sticker: pickRandom(raras), rarity: "rara" });
  for (let i = 0; i < 3; i++) result.push({ sticker: pickRandom(normais), rarity: "normal" });
  return result;
}

type View = "cover" | "pages" | "trade";

type BookPage =
  | { kind: "category"; cat: typeof categories[number]; stickers: Sticker[]; bg?: string; pageInCat: 1 | 2 }
  | { kind: "map" }
  | { kind: "blank" };

export default function Album() {
  const navigate = useNavigate();
  const { coins, spendCoins } = useCoins();
  const [view, setView] = useState<View>("cover");
  const [packResult, setPackResult] = useState<StickerResult[] | null>(null);
  const [owned, setOwned] = useState<Owned>(readOwned());
  const [selected, setSelected] = useState<Sticker | null>(null);

  useEffect(() => { ensureInitialCoins(); }, []);
  useEffect(() => {
    categories.forEach((c) => c.bgs?.forEach((b) => { if (b) { const i = new Image(); i.src = b; } }));
  }, []);

  const totalOwned = useMemo(
    () => Object.keys(owned).filter((k) => owned[+k] > 0).length, [owned]
  );

  const repeats = useMemo(() => Object.entries(owned).filter(([, c]) => (c || 0) > 1).map(([id, c]) => {
    const s = allStickers.find((x) => x.id === +id)!;
    return { sticker: s, count: c - 1 };
  }).filter((x) => x.sticker), [owned]);

  const missing = useMemo(() => allStickers.filter((s) => !owned[s.id]), [owned]);

  // Build pages, then PAD to even count so spreads render correctly
  const pages = useMemo<BookPage[]>(() => {
    const arr: BookPage[] = [];
    for (const cat of categories) {
      arr.push({ kind: "category", cat, stickers: cat.stickers.slice(0, 8), bg: cat.bgs?.[0], pageInCat: 1 });
    }
    arr.push({ kind: "map" });
    if (arr.length % 2 !== 0) arr.push({ kind: "blank" });
    return arr;
  }, []);

  // spreadIdx points to the LEFT page index of the current spread (always even)
  const [spreadIdx, setSpreadIdx] = useState(0);
  const [flipDir, setFlipDir] = useState<"next" | "prev" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const totalSpreads = Math.ceil(pages.length / 2);

  const goNext = useCallback(() => {
    if (flipping || spreadIdx >= pages.length - 2) return;
    setFlipping(true); setFlipDir("next");
    setTimeout(() => {
      setSpreadIdx((i) => Math.min(i + 2, pages.length - 2));
      setFlipDir(null);
      setTimeout(() => setFlipping(false), 50);
    }, 520);
  }, [flipping, spreadIdx, pages.length]);

  const goPrev = useCallback(() => {
    if (flipping || spreadIdx <= 0) return;
    setFlipping(true); setFlipDir("prev");
    setTimeout(() => {
      setSpreadIdx((i) => Math.max(i - 2, 0));
      setFlipDir(null);
      setTimeout(() => setFlipping(false), 50);
    }, 520);
  }, [flipping, spreadIdx]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) goNext(); else goPrev(); }
    touchStart.current = null;
  };

  const buyPack = useCallback(() => {
    if (!spendCoins(PACK_COST)) return;
    const pack = buildPack();
    const next = { ...readOwned() };
    const results: StickerResult[] = pack.map(({ sticker, rarity }) => {
      const isRepeat = (next[sticker.id] || 0) > 0;
      next[sticker.id] = (next[sticker.id] || 0) + 1;
      return { index: sticker.id, name: sticker.name, emoji: sticker.emoji, rarity, isRepeat };
    });
    writeOwned(next); setOwned(next); setPackResult(results);
  }, [spendCoins]);

  // ============= COVER =============
  if (view === "cover") {
    return (
      <div className="fixed inset-0 z-40 flex flex-col p-4"
        style={{ background: "radial-gradient(ellipse at center, hsl(220,40%,15%), hsl(220,50%,8%))" }}>
        <StandardHeader onHome={() => navigate("/")} coins={coins} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div onClick={() => { setSpreadIdx(0); setView("pages"); }}
            className="relative cursor-pointer group max-w-md w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-amber-700/50 transition-transform hover:scale-[1.02] hover:rotate-1">
            <img src={albumCapa} alt="Heróis da Fé" className="w-full h-full object-cover" />
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-amber-900/80 to-transparent" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full font-display font-bold text-sm shadow-lg animate-pulse">
              👆 Toque para abrir
            </div>
          </div>
          <p className="mt-6 text-white/70 font-body text-sm text-center max-w-md">
            Colecione mais de 200 figurinhas! Cada pacotinho tem <strong>5 figurinhas</strong> (1 relíquia + 1 rara + 3 normais).
          </p>
        </div>
      </div>
    );
  }

  // ============= TRADE =============
  if (view === "trade") {
    return (
      <div className="fixed inset-0 z-40 overflow-y-auto p-4"
        style={{ background: "linear-gradient(180deg, hsl(35,45%,88%), hsl(40,50%,82%))" }}>
        <div className="max-w-4xl mx-auto">
          <StandardHeader onHome={() => navigate("/")} coins={coins} />
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setView("pages")}
              className="flex items-center gap-2 font-display font-bold bg-white/80 px-3 py-1.5 rounded-full shadow">
              <ChevronLeft className="w-5 h-5" /> Álbum
            </button>
            <h1 className="font-display font-extrabold text-xl">🔄 Sala de Trocas</h1>
            <div className="w-20" />
          </div>
          <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow border">
            <p className="font-display font-bold text-foreground mb-1">📦 Suas repetidas para trocar</p>
            <p className="text-xs text-muted-foreground font-body">
              Estas são as figurinhas que você tem em duplicata. Outros colecionadores procuram suas faltantes — proponha trocas!
            </p>
          </div>
          {repeats.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-amber-700/30 p-8 text-center bg-white/40">
              <p className="font-body text-muted-foreground">Você ainda não tem figurinhas repetidas. Abra mais pacotinhos!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
              {repeats.map(({ sticker, count }) => (
                <div key={sticker.id} className={`bg-white rounded-xl p-2 border-[3px] ${rarityBorder(sticker.rarity)} shadow-md text-center`}>
                  <div className="text-3xl">{sticker.emoji}</div>
                  <div className="font-display font-bold text-[11px] leading-tight mt-1">{sticker.name}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">{rarityLabel(sticker.rarity)}</div>
                  <div className="mt-1 inline-flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">×{count}</div>
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
        </div>
      </div>
    );
  }

  // ============= BOOK (2-page spread, flipsnack-style) =============
  const leftPage = pages[spreadIdx];
  const rightPage = pages[spreadIdx + 1];
  const currentSpread = Math.floor(spreadIdx / 2) + 1;

  // The right page flips out (next) or in (prev)
  const flipRightClass =
    flipDir === "next" ? "animate-[pageOutNext_0.52s_ease-in_forwards]" :
    flipDir === "prev" ? "animate-[pageInPrev_0.52s_ease-out]" :
    "";
  const flipLeftClass =
    flipDir === "prev" ? "animate-[pageOutPrev_0.52s_ease-in_forwards]" : "";

  return (
    <div className="fixed inset-0 z-40 flex flex-col"
      style={{ background: "radial-gradient(ellipse at center, hsl(35,45%,82%), hsl(30,40%,55%))" }}>
      <div className="px-3 pt-3 bg-amber-950/90">
        <StandardHeader onHome={() => navigate("/")} coins={coins} variant="dark" />
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-amber-950/90 text-white shadow-lg z-10">
        <button onClick={() => setView("cover")}
          className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full font-display font-bold text-sm transition">
          <ArrowLeft className="w-4 h-4" /> Capa
        </button>
        <div className="text-center">
          <div className="font-display font-extrabold text-base">📖 Heróis da Fé</div>
          <div className="text-[10px] opacity-80">{totalOwned} / {allStickers.length} coletadas</div>
        </div>
        <button onClick={() => setView("trade")}
          className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 px-2 sm:px-3 py-1.5 rounded-full font-display font-bold text-xs transition" title="Trocas">
          <Repeat className="w-4 h-4" /> <span className="hidden sm:inline">Trocas</span>
        </button>
      </div>

      {/* Spread area — 2 pages side-by-side */}
      <div
        className="flex-1 flex items-stretch justify-center p-2 sm:p-4 overflow-hidden select-none"
        style={{ perspective: "2800px" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full max-w-6xl h-full flex items-stretch justify-center">
          {/* LEFT PAGE */}
          <div
            key={`L-${spreadIdx}`}
            className={`relative flex-1 max-w-[50%] origin-right ${flipLeftClass}`}
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button,a,[data-sticker]")) return;
              goPrev();
            }}
          >
            <PageShell side="left">
              {renderPage(leftPage, owned, (s) => (owned[s.id] || 0) > 0 && setSelected(s))}
            </PageShell>
          </div>

          {/* Center binding shadow */}
          <div className="w-1 bg-gradient-to-b from-amber-950/80 via-amber-900 to-amber-950/80 shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] z-10" />

          {/* RIGHT PAGE */}
          <div
            key={`R-${spreadIdx}`}
            className={`relative flex-1 max-w-[50%] origin-left ${flipRightClass}`}
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button,a,[data-sticker]")) return;
              goNext();
            }}
          >
            <PageShell side="right">
              {renderPage(rightPage, owned, (s) => (owned[s.id] || 0) > 0 && setSelected(s))}
            </PageShell>
            {/* corner curl hint */}
            <div className="pointer-events-none absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-tl from-amber-50/60 via-amber-200/30 to-transparent rounded-tl-2xl" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-4 gap-3">
        <button onClick={goPrev} disabled={spreadIdx === 0}
          className="bg-amber-900/90 disabled:opacity-30 text-white font-display font-bold px-4 py-2 rounded-full shadow flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        <div className="text-center text-amber-950 font-display font-bold text-xs">
          <button onClick={buyPack} disabled={coins < PACK_COST}
            className="bg-gradient-to-br from-amber-400 to-orange-600 disabled:opacity-50 text-white font-display font-bold px-5 py-2.5 rounded-full shadow-2xl hover:scale-105 transition text-sm">
            🎁 Pacotinho (3 🪙)
          </button>
          <div className="mt-1 text-[10px] opacity-70">spread {currentSpread} de {totalSpreads}</div>
        </div>
        <button onClick={goNext} disabled={spreadIdx >= pages.length - 2}
          className="bg-amber-900/90 disabled:opacity-30 text-white font-display font-bold px-4 py-2 rounded-full shadow flex items-center gap-1">
          Próxima <ChevronLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>

      {packResult && (
        <StickerPackAnimation
          stickers={packResult}
          onClose={() => { setPackResult(null); setOwned(readOwned()); }}
        />
      )}

      {selected && <StickerDetailModal sticker={selected} owned={owned[selected.id] || 0} onClose={() => setSelected(null)} />}
    </div>
  );
}

function renderPage(p: BookPage | undefined, owned: Owned, onStickerClick: (s: Sticker) => void) {
  if (!p) return null;
  if (p.kind === "map") return <MapPage owned={owned} />;
  if (p.kind === "blank") return <div className="w-full h-full" />;
  return <CategoryPage cat={p.cat} stickers={p.stickers} bg={p.bg} owned={owned} pageInCat={p.pageInCat} onStickerClick={onStickerClick} />;
}

/* -------- Sticker Detail Modal — fullscreen image only -------- */
function StickerDetailModal({ sticker, owned, onClose }: { sticker: Sticker; owned: number; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/[0.99] flex items-center justify-center p-4 animate-[pageInNext_0.32s_ease-out]"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg backdrop-blur-sm z-10"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {sticker.image ? (
          <img
            src={sticker.image}
            alt={sticker.name}
            className="max-w-full max-h-full object-contain drop-shadow-2xl"
            style={{ maxHeight: "92vh" }}
          />
        ) : (
          <div className="text-[200px]">{sticker.emoji}</div>
        )}
      </div>
      {owned > 1 && (
        <span className="absolute top-4 left-4 z-10 text-xs bg-red-500 text-white px-3 py-1 rounded-full font-bold shadow">×{owned}</span>
      )}
    </div>
  );
}

/* -------- Shared shells -------- */

function PageShell({ children, side }: { children: React.ReactNode; side: "left" | "right" }) {
  return (
    <div className={`relative w-full h-full bg-amber-900 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] border-4 border-amber-950 overflow-hidden ${
      side === "left" ? "rounded-l-2xl border-r-0" : "rounded-r-2xl border-l-0"
    }`}>
      <AramaicBackdrop />
      <div className="relative w-full h-full p-3 sm:p-4">{children}</div>
    </div>
  );
}

/* -------- Page bodies -------- */

/* InfoPage and BackCoverPage removed — album starts directly on category page 1 */

function MapPage({ owned }: { owned: Owned }) {
  return (
    <div className="relative w-full h-full flex flex-col text-amber-950">
      <h2 className="font-display font-extrabold text-xl sm:text-2xl text-center mb-3 drop-shadow">🗺️ Mapa de Distribuição</h2>
      <div className="flex-1 overflow-y-auto bg-amber-50/80 backdrop-blur-sm rounded-xl p-3 border border-amber-700/30 shadow-lg">
        <div className="grid grid-cols-1 gap-2">
          {categories.map((c) => {
            const got = c.stickers.filter((s) => (owned[s.id] || 0) > 0).length;
            const pct = Math.round((got / c.stickers.length) * 100);
            return (
              <div key={c.key} className="flex items-center gap-2 bg-white/70 rounded-lg p-2 border border-amber-700/20">
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-xs truncate">{c.name}</div>
                  <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden mt-0.5">
                    <div className={`h-full bg-gradient-to-r ${c.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-[10px] font-bold tabular-nums">{got}/{c.stickers.length}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BackCoverPage() { return null; }

function CategoryPage({
  cat, stickers, bg, owned, pageInCat, onStickerClick,
}: {
  cat: typeof categories[number];
  stickers: Sticker[];
  bg?: string;
  owned: Owned;
  pageInCat: 1 | 2;
  onStickerClick: (s: Sticker) => void;
}) {
  return (
    <div className="relative w-full h-full">
      {bg && (
        <img aria-hidden src={bg} alt="" loading="eager" decoding="async"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-xl"
          style={{ opacity: 0.32 }} />
      )}
      <div className="absolute inset-0 bg-amber-50/20 pointer-events-none rounded-xl" />
      <div className="relative h-full p-2 sm:p-3 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full" style={{ gridTemplateRows: "repeat(2, minmax(0, 1fr))" }}>
          {stickers.map((s, i) => {
            const has = (owned[s.id] || 0) > 0;
            const number = String(i + 1 + (pageInCat === 2 ? 8 : 0)).padStart(2, "0");
            return (
              <button
                key={s.id}
                type="button"
                data-sticker
                onClick={(e) => { e.stopPropagation(); onStickerClick(s); }}
                disabled={!has}
                className={`relative w-full rounded-2xl overflow-hidden transition-all aspect-[2/3] ${
                  has
                    ? "border-[3px] border-amber-400 ring-1 ring-amber-200/60 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] cursor-pointer hover:scale-[1.06] hover:z-30 bg-black"
                    : "border-2 border-dashed border-white/40 bg-black/20"
                }`}
              >
                {s.image ? (
                  <img
                    src={s.image}
                    alt={has ? s.name : "Figurinha não coletada"}
                    className="absolute inset-0 w-full h-full object-contain p-1"
                    style={{ opacity: has ? 1 : 0.01 }}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl ${has ? "" : "opacity-[0.01]"}`}>{s.emoji}</span>
                  </div>
                )}
                {!has && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70">
                    <span className="text-2xl drop-shadow">❓</span>
                    <span className="text-[10px] font-display font-bold mt-1 drop-shadow">{number}</span>
                  </div>
                )}
                {has && (owned[s.id] || 0) > 1 && (
                  <span className="absolute top-1 right-1 z-20 text-[9px] bg-red-500/90 text-white px-1.5 rounded-full leading-none font-bold">×{owned[s.id]}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StandardHeader({ onHome, coins, variant = "light" }: { onHome: () => void; coins: number; variant?: "light" | "dark" }) {
  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem("lemos_user");
    if (stored) { try { setUser(JSON.parse(stored)); } catch { /* noop */ } }
  }, []);
  const dark = variant === "dark";
  return (
    <div className="flex items-center justify-between mb-3">
      <button onClick={onHome} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform" aria-label="Início">
        <img src={iconInicio} alt="Início" className="w-12 h-12 rounded-2xl shadow-lg" />
        <span className={`font-display text-[10px] font-bold ${dark ? "text-white" : "text-foreground"}`}>Início</span>
      </button>
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
          dark ? "bg-white/15 border-white/20 text-white" : "bg-white/90 border-amber-700/30 text-foreground"
        }`}>
          <span className="text-lg">🪙</span>
          <span className="font-display font-bold text-base">{coins}</span>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className={`font-display text-xs font-bold ${dark ? "text-white" : "text-foreground"}`}>{user.name}</p>
            </div>
            <img src={user.avatar || iconUsuario} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white/60 shadow-md" />
          </div>
        )}
      </div>
    </div>
  );
}
