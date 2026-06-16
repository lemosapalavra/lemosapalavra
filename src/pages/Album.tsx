import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";

import { ArrowLeft, ChevronLeft, Repeat, X } from "lucide-react";
import StickerPackAnimation, { StickerResult } from "@/components/StickerPackAnimation";
import AramaicBackdrop from "@/components/AramaicBackdrop";
import { categories, allStickers, rarityBorder, rarityLabel, type Rarity, type Sticker } from "@/data/stickers";
import { useCoins, ensureInitialCoins } from "@/hooks/useCoins";
import albumCapa from "@/assets/album-capa.png";
import pergaminhoAsset from "@/assets/pergaminho.png.asset.json";
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
function pickRandom<T>(arr: T[], fallback?: T[]): T | undefined {
  const src = arr.length ? arr : (fallback || []);
  if (!src.length) return undefined;
  return src[Math.floor(Math.random() * src.length)];
}

function buildPack(): { sticker: Sticker; rarity: Rarity }[] {
  const reliquias = shuffleDaily(allStickers.filter((s) => s.rarity === "reliquia"), 1);
  const raras = shuffleDaily(allStickers.filter((s) => s.rarity === "rara"), 2);
  const normais = shuffleDaily(allStickers.filter((s) => s.rarity === "normal"), 3);
  const result: { sticker: Sticker; rarity: Rarity }[] = [];
  // 1 "especial": rara OR (eventualmente) relíquia (~25% de chance)
  const especialIsReliquia = Math.random() < 0.25;
  const especial = especialIsReliquia
    ? (pickRandom(reliquias, raras) ?? pickRandom(raras, normais))
    : (pickRandom(raras, reliquias) ?? pickRandom(reliquias, normais));
  if (especial) {
    const rarity: Rarity = especialIsReliquia && reliquias.length ? "reliquia" : "rara";
    result.push({ sticker: especial, rarity });
  }
  // 3 normais
  for (let i = 0; i < 3; i++) {
    const n = pickRandom(normais, allStickers);
    if (n) result.push({ sticker: n, rarity: "normal" });
  }
  return result;
}

type View = "cover" | "pages" | "trade";

type BookPage =
  | { kind: "category"; cat: typeof categories[number]; stickers: Sticker[]; bg?: string; pageInCat: 1 | 2 }
  | { kind: "map" }
  | { kind: "backcover" }
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

  const validIds = useMemo(() => new Set(allStickers.map((s) => s.id)), []);
  const totalOwned = useMemo(
    () => Object.keys(owned).filter((k) => owned[+k] > 0 && validIds.has(+k)).length, [owned, validIds]
  );

  const repeats = useMemo(() => Object.entries(owned).filter(([, c]) => (c || 0) > 1).map(([id, c]) => {
    const s = allStickers.find((x) => x.id === +id)!;
    return { sticker: s, count: c - 1 };
  }).filter((x) => x.sticker), [owned]);

  const missing = useMemo(() => allStickers.filter((s) => !owned[s.id]), [owned]);

  // One page per category, with cumulative global startIndex for numbering.
  // A final "backcover" page summarises the album.
  const pages = useMemo<(BookPage & { startIndex: number })[]>(() => {
    let running = 0;
    const catPages = categories.map((cat) => {
      const stickers = cat.stickers.slice(0, 8);
      const page = {
        kind: "category" as const,
        cat,
        stickers,
        bg: cat.bgs?.[0],
        pageInCat: 1 as const,
        startIndex: running,
      };
      running += stickers.length;
      return page;
    });
    return [...catPages, { kind: "backcover" as const, startIndex: running }];
  }, []);


  const [pageIdx, setPageIdx] = useState(0);
  const totalPages = pages.length;



  const goNext = useCallback(() => {
    setPageIdx((i) => Math.min(i + 1, pages.length - 1));
  }, [pages.length]);

  const goPrev = useCallback(() => {
    setPageIdx((i) => Math.max(i - 1, 0));
  }, []);

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
    // build a global number index (1-based) across all stickers in order
    const numberOf: Record<number, number> = {};
    allStickers.forEach((s, idx) => { numberOf[s.id] = idx + 1; });
    const results: StickerResult[] = pack.map(({ sticker, rarity }) => {
      const isRepeat = (next[sticker.id] || 0) > 0;
      next[sticker.id] = (next[sticker.id] || 0) + 1;
      return {
        index: sticker.id,
        number: numberOf[sticker.id],
        name: sticker.name,
        emoji: sticker.emoji,
        image: sticker.image,
        rarity,
        isRepeat,
      };
    });
    writeOwned(next); setOwned(next); setPackResult(results);
  }, [spendCoins]);

  // ============= COVER (fullscreen) =============
  if (view === "cover") {
    return (
      <div
        onClick={() => { setPageIdx(0); setView("pages"); }}
        className="fixed inset-0 z-40 cursor-pointer bg-black"
      >
        <PageHeader title="Álbum" subtitle="Heróis da Fé" icon={albumCapa} />
        <img
          src={albumCapa}
          alt="Heróis da Fé"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 18%" }}
        />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 px-5 py-2.5 rounded-full font-display font-bold text-base shadow-2xl animate-pulse">
          👆 Toque para abrir
        </div>
      </div>
    );
  }


  // ============= TRADE =============
  if (view === "trade") {
    return (
      <TradePanel
        owned={owned}
        repeats={repeats}
        missing={missing}
        onBack={() => setView("pages")}
        onHome={() => navigate("/")}
        coins={coins}
        onTrade={(give, get) => {
          const next = { ...readOwned() };
          next[give.id] = Math.max(0, (next[give.id] || 0) - 1);
          next[get.id] = (next[get.id] || 0) + 1;
          writeOwned(next);
          setOwned(next);
        }}
      />
    );
  }

  // ============= BOOK (single page per category) =============
  const currentPage = pages[pageIdx];
  const currentCatName = currentPage?.kind === "category" ? currentPage.cat.name : "";

  return (
    <div className="fixed inset-0 z-40 flex flex-col"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="px-3 pt-3">
        <StandardHeader onHome={() => navigate("/")} coins={coins} />
      </div>
      <div className="flex items-center justify-between px-3 py-2 bg-amber-950/90 text-white shadow-lg z-10">
        <button onClick={() => setView("cover")}
          className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full font-display font-bold text-sm transition">
          <ArrowLeft className="w-4 h-4" /> Capa
        </button>
        <div className="text-center min-w-0 px-2">
          <div className="font-display font-extrabold text-sm sm:text-base truncate">
            📖 Heróis da Fé{currentCatName ? ` — ${currentCatName}` : ""}
          </div>
          <div className="text-[10px] opacity-80">{totalOwned} / {allStickers.length} coletadas</div>
        </div>
        <button onClick={() => setView("trade")}
          className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 px-2 sm:px-3 py-1.5 rounded-full font-display font-bold text-xs transition" title="Trocas">
          <Repeat className="w-4 h-4" /> <span className="hidden sm:inline">Trocas</span>
        </button>
      </div>

      {/* Single page area */}
      <div
        className="flex-1 flex items-stretch justify-center p-2 sm:p-4 overflow-hidden select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full max-w-2xl flex items-stretch justify-center">
          <div className="relative flex-1">
            <PageShell side="left">
              {renderPage(currentPage, owned, (s) => (owned[s.id] || 0) > 0 && setSelected(s))}

            </PageShell>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-4 gap-3">
        <button onClick={goPrev} disabled={pageIdx === 0}
          className="bg-amber-900/90 disabled:opacity-30 text-white font-display font-bold px-4 py-2 rounded-full shadow flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>
        <div className="text-center text-amber-950 font-display font-bold text-xs">
          <button onClick={buyPack} disabled={coins < PACK_COST}
            className="bg-gradient-to-br from-amber-400 to-orange-600 disabled:opacity-50 text-white font-display font-bold px-5 py-2.5 rounded-full shadow-2xl hover:scale-105 transition text-sm">
            🎁 Pacotinho (3 🪙)
          </button>
          <div className="mt-1 text-[10px] opacity-70">página {pageIdx + 1} de {totalPages}</div>
        </div>
        <button onClick={goNext} disabled={pageIdx >= pages.length - 1}
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

function renderPage(p: (BookPage & { startIndex?: number }) | undefined, owned: Owned, onStickerClick: (s: Sticker) => void) {
  if (!p) return null;
  if (p.kind === "map") return <MapPage owned={owned} />;
  if (p.kind === "backcover") return <BackCoverPage owned={owned} />;
  if (p.kind === "blank") return <div className="w-full h-full" />;
  return <CategoryPage cat={p.cat} stickers={p.stickers} bg={p.bg} owned={owned} pageInCat={p.pageInCat} startIndex={p.startIndex ?? 0} onStickerClick={onStickerClick} />;
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

function BackCoverPage({ owned }: { owned: Owned }) {
  const total = allStickers.length;
  const collected = allStickers.filter((s) => (owned[s.id] || 0) > 0);
  const missing = allStickers.filter((s) => !(owned[s.id] || 0));
  const repeats = Object.entries(owned)
    .filter(([, c]) => (c || 0) > 1)
    .map(([id, c]) => ({ s: allStickers.find((x) => x.id === +id)!, c: c - 1 }))
    .filter((x) => x.s);
  const repeatCount = repeats.reduce((a, x) => a + x.c, 0);
  const pct = Math.round((collected.length / total) * 100);

  let globalIdx = 0;
  return (
    <div className="relative w-full h-full overflow-y-auto text-amber-950">
      <div className="p-2 sm:p-3">
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-center mb-2 drop-shadow">📕 Contracapa do Álbum</h2>
        <p className="text-center text-xs sm:text-sm text-amber-900 mb-3 italic">Heróis da Fé — sua coleção sagrada</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <Stat label="Total" value={total} emoji="📚" />
          <Stat label="Coletadas" value={collected.length} emoji="✅" />
          <Stat label="Faltantes" value={missing.length} emoji="🎯" />
          <Stat label="Repetidas" value={repeatCount} emoji="🔁" />
        </div>

        <div className="bg-white/80 rounded-xl p-2 mb-3 border border-amber-700/30">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span>Progresso</span><span>{pct}%</span>
          </div>
          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-600" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Rules */}
        <div className="bg-amber-50/90 rounded-xl p-3 mb-3 border border-amber-700/30 text-[11px] sm:text-xs leading-relaxed">
          <p className="font-display font-extrabold mb-1.5 text-sm">🎁 Como ganhar figurinhas</p>
          <ul className="space-y-1 list-disc pl-4">
            <li>A cada <strong>atividade</strong> concluída você ganha 🪙 moedas.</li>
            <li>Assistir um <strong>filme, série ou vídeo</strong> também rende moedas.</li>
            <li>Ler um <strong>versículo, devocional</strong> ou trecho da <strong>Bíblia</strong> dá moedas.</li>
            <li>Com <strong>3 🪙 moedas</strong> você compra um <strong>pacotinho</strong> com 5 figurinhas.</li>
            <li>Cada pacote vem com 1 <strong>Relíquia</strong>, 1 <strong>Rara</strong> e 3 <strong>Normais</strong>.</li>
            <li>Figurinhas <strong>repetidas</strong> podem ser trocadas na <em>Sala de Trocas</em>.</li>
          </ul>
        </div>

        {/* Detailed list per category */}
        <div className="bg-white/80 rounded-xl p-3 border border-amber-700/30">
          <p className="font-display font-extrabold text-sm mb-2">📋 Numeração completa</p>
          <div className="space-y-3">
            {categories.map((c) => {
              const items = c.stickers.map((s) => {
                const n = String(++globalIdx).padStart(2, "0");
                const count = owned[s.id] || 0;
                return { s, n, count };
              });
              const got = items.filter((x) => x.count > 0).length;
              return (
                <div key={c.key}>
                  <div className="flex items-center justify-between text-[11px] font-display font-bold mb-1">
                    <span>{c.icon} {c.name}</span>
                    <span className="text-amber-700">{got}/{c.stickers.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {items.map(({ s, n, count }) => {
                      const status = count === 0 ? "missing" : count > 1 ? "repeat" : "ok";
                      const bg = status === "ok" ? "bg-emerald-100" : status === "repeat" ? "bg-amber-100" : "bg-red-100/60";
                      const dot = status === "ok" ? "✅" : status === "repeat" ? `🔁×${count - 1}` : "❌";
                      return (
                        <div key={s.id} className={`${bg} rounded px-1.5 py-0.5 flex items-center gap-1 text-[10px]`}>
                          <span className="font-mono font-bold">{n}</span>
                          <span className="truncate flex-1">{s.name}</span>
                          <span className="shrink-0">{dot}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-3 text-[10px] text-amber-800/80 italic">
          ✝️ Cresça na fé colecionando os Heróis da Bíblia ✝️
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="bg-white/85 rounded-lg p-1.5 text-center border border-amber-700/30">
      <div className="text-base leading-none">{emoji}</div>
      <div className="font-display font-extrabold text-sm tabular-nums">{value}</div>
      <div className="text-[9px] uppercase tracking-wide text-amber-700">{label}</div>
    </div>
  );
}


function CategoryPage({
  cat, stickers, bg, owned, pageInCat, startIndex, onStickerClick,
}: {
  cat: typeof categories[number];
  stickers: Sticker[];
  bg?: string;
  owned: Owned;
  pageInCat: 1 | 2;
  startIndex: number;
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
            const globalNum = String(s.id + 1).padStart(3, "0");
            const rarityBadge =
              s.rarity === "reliquia"
                ? { label: "ESPECIAL", cls: "bg-gradient-to-r from-yellow-300 to-amber-500 text-amber-950 border-yellow-200" }
                : s.rarity === "rara"
                ? { label: "RARA", cls: "bg-gradient-to-r from-sky-300 to-indigo-500 text-white border-sky-200" }
                : { label: "NORMAL", cls: "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900 border-slate-100" };
            const corner = s.rarity === "reliquia" ? "✨" : s.rarity === "rara" ? "⭐" : null;

            return (
              <button
                key={s.id}
                type="button"
                data-sticker
                onClick={(e) => { e.stopPropagation(); onStickerClick(s); }}
                disabled={!has}
                className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-br ${cat.color} p-[3px] shadow-lg flex aspect-[2/3] ${
                  has ? "cursor-pointer hover:scale-[1.06] hover:z-30 transition-transform" : "opacity-95"
                }`}
              >
                {/* Inner white card */}
                <div className="relative w-full h-full bg-white rounded-[10px] flex flex-col overflow-hidden">
                  {/* Number ribbon top-left */}
                  <span className={`absolute top-1 left-1 z-20 text-[9px] font-display font-extrabold px-1.5 py-0.5 rounded-md shadow bg-gradient-to-br ${cat.color} text-white border border-white/60`}>
                    Nº{globalNum}
                  </span>
                  {/* Rarity corner sparkle */}
                  {corner && (
                    <span className="absolute top-1 right-1 z-20 text-sm drop-shadow">{corner}</span>
                  )}
                  {/* Repeat counter */}
                  {has && (owned[s.id] || 0) > 1 && (
                    <span className="absolute top-6 right-1 z-20 text-[9px] bg-red-500 text-white px-1.5 rounded-full leading-tight font-bold shadow">×{owned[s.id]}</span>
                  )}

                  {/* Image area — fills the recipient completely */}
                  <div className="relative flex-1 w-full overflow-hidden">
                    {has && s.image ? (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : has ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-white to-amber-50/40">
                        <span className="text-4xl">{s.emoji}</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-white to-amber-50/40 text-amber-800/40">
                        <span className="text-3xl drop-shadow">❓</span>
                      </div>
                    )}
                  </div>

                  {/* Title + rarity band */}
                  <div className={`w-full bg-gradient-to-r ${cat.color} px-1 py-1 flex flex-col items-center gap-0.5 min-h-[2.6em] text-white`}>
                    <span className="font-display font-extrabold text-[9px] sm:text-[10px] leading-tight line-clamp-2 text-center drop-shadow">
                      {has ? s.name : "???"}
                    </span>
                    <span className={`text-[7px] font-display font-extrabold px-1.5 py-[1px] rounded-full border ${rarityBadge.cls} leading-none tracking-wider`}>
                      {rarityBadge.label}
                    </span>
                  </div>
                </div>
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

/* ============================================================
   TRADE PANEL — Sala de Trocas funcional
   O usuário oferece uma figurinha repetida e escolhe uma
   faltante para receber (troca simulada com a comunidade).
============================================================ */
function TradePanel({
  owned, repeats, missing, coins, onBack, onHome, onTrade,
}: {
  owned: Owned;
  repeats: { sticker: Sticker; count: number }[];
  missing: Sticker[];
  coins: number;
  onBack: () => void;
  onHome: () => void;
  onTrade: (give: Sticker, get: Sticker) => void;
}) {
  const [offer, setOffer] = useState<Sticker | null>(null);
  const [confirm, setConfirm] = useState<{ give: Sticker; get: Sticker } | null>(null);
  const [done, setDone] = useState<{ give: Sticker; get: Sticker } | null>(null);

  return (
    <div
      className="fixed inset-0 z-40 overflow-y-auto p-4"
      style={{ background: "linear-gradient(180deg, hsl(35,45%,88%), hsl(40,50%,82%))" }}
    >
      <div className="max-w-4xl mx-auto">
        <StandardHeader onHome={onHome} coins={coins} />
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack}
            className="flex items-center gap-2 font-display font-bold bg-white/80 px-3 py-1.5 rounded-full shadow">
            <ChevronLeft className="w-5 h-5" /> Álbum
          </button>
          <h1 className="font-display font-extrabold text-xl">🔄 Sala de Trocas</h1>
          <div className="w-20" />
        </div>

        <div className="bg-white/85 rounded-2xl p-4 mb-4 shadow border">
          <p className="font-display font-bold text-foreground mb-1">📦 Como funciona</p>
          <p className="text-xs text-muted-foreground font-body leading-relaxed">
            Escolha uma <strong>figurinha repetida</strong> para oferecer, depois escolha
            uma <strong>figurinha faltante</strong> que deseja receber. A comunidade
            aceita sua proposta instantaneamente e a troca é registrada no seu álbum.
          </p>
        </div>

        {/* Repetidas para oferecer */}
        <h2 className="font-display font-extrabold text-base mb-2">🎁 Suas figurinhas repetidas</h2>
        {repeats.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-amber-700/30 p-8 text-center bg-white/40 mb-4">
            <p className="font-body text-muted-foreground">Você ainda não tem figurinhas repetidas. Abra mais pacotinhos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
            {repeats.map(({ sticker, count }) => {
              const selected = offer?.id === sticker.id;
              return (
                <button
                  key={sticker.id}
                  onClick={() => setOffer(selected ? null : sticker)}
                  className={`bg-white rounded-xl p-2 border-[3px] ${selected ? "border-emerald-500 ring-2 ring-emerald-300" : rarityBorder(sticker.rarity)} shadow-md text-center transition hover:scale-105`}
                >
                  {sticker.image
                    ? <img src={sticker.image} alt={sticker.name} className="w-full aspect-square object-contain" loading="lazy" />
                    : <div className="text-3xl">{sticker.emoji}</div>}
                  <div className="font-display font-bold text-[11px] leading-tight mt-1">{sticker.name}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">{rarityLabel(sticker.rarity)}</div>
                  <div className="mt-1 inline-flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">×{count}</div>
                  <div className="mt-2 w-full text-[10px] font-display font-bold py-1 rounded-md text-white" style={{ background: selected ? "#059669" : "linear-gradient(to bottom right,#10b981,#0d9488)" }}>
                    {selected ? "✓ Selecionada" : "Oferecer"}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Faltantes para receber */}
        <h2 className="font-display font-extrabold text-base mb-2">🎯 Figurinhas que faltam no seu álbum ({missing.length})</h2>
        {missing.length === 0 ? (
          <div className="bg-emerald-100 rounded-2xl p-6 text-center border border-emerald-300">
            <p className="font-display font-bold text-emerald-800 text-lg">🎉 Você completou o álbum!</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {missing.map((s) => {
              const canTrade = !!offer;
              return (
                <button
                  key={s.id}
                  disabled={!canTrade}
                  onClick={() => offer && setConfirm({ give: offer, get: s })}
                  className={`bg-amber-50 rounded-lg p-2 border border-dashed text-center transition ${canTrade ? "border-amber-700 hover:bg-amber-100 hover:scale-105 cursor-pointer" : "border-amber-700/40 opacity-70 cursor-not-allowed"}`}
                >
                  <div className="text-xl">{canTrade ? "🔄" : "❓"}</div>
                  <div className="text-[9px] font-bold leading-tight">{s.name}</div>
                </button>
              );
            })}
          </div>
        )}

        {!offer && repeats.length > 0 && missing.length > 0 && (
          <p className="text-center text-xs text-muted-foreground font-body mt-4 italic">
            👆 Primeiro selecione uma figurinha repetida para oferecer.
          </p>
        )}
      </div>

      {/* Confirmation modal */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setConfirm(null)}
        >
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-extrabold text-lg text-center mb-3">Confirmar Troca?</h3>
            <div className="flex items-center justify-around mb-4">
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground font-bold mb-1">VOCÊ OFERECE</div>
                {confirm.give.image
                  ? <img src={confirm.give.image} alt="" className="w-20 h-20 object-contain mx-auto" />
                  : <div className="text-5xl">{confirm.give.emoji}</div>}
                <div className="text-xs font-bold mt-1">{confirm.give.name}</div>
              </div>
              <div className="text-3xl">↔️</div>
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground font-bold mb-1">VOCÊ RECEBE</div>
                {confirm.get.image
                  ? <img src={confirm.get.image} alt="" className="w-20 h-20 object-contain mx-auto" />
                  : <div className="text-5xl">{confirm.get.emoji}</div>}
                <div className="text-xs font-bold mt-1">{confirm.get.name}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirm(null)}
                className="flex-1 py-2 rounded-full bg-muted font-display font-bold text-sm">Cancelar</button>
              <button
                onClick={() => {
                  onTrade(confirm.give, confirm.get);
                  setDone(confirm);
                  setOffer(null);
                  setConfirm(null);
                }}
                className="flex-1 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-display font-bold text-sm shadow"
              >
                ✓ Trocar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {done && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setDone(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-2">🎉</div>
            <h3 className="font-display font-extrabold text-lg mb-2">Troca realizada!</h3>
            <p className="text-sm font-body text-muted-foreground mb-4">
              Você recebeu <strong>{done.get.name}</strong> e enviou <strong>{done.give.name}</strong>.
            </p>
            <button onClick={() => setDone(null)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-display font-bold shadow">
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
