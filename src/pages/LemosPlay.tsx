import { useState, useEffect, useRef, useMemo } from "react";
import { Play, Info, ChevronLeft, ChevronRight, X, Settings, UserPlus, Heart, MessageCircle, Share2, Download, Send } from "lucide-react";
import lemosPlayLogo from "@/assets/lemos-play-logo.png";
import PageHeader from "@/components/PageHeader";
import LemosPlayAdminPanel from "@/components/LemosPlayAdminPanel";
import CoinBadge from "@/components/CoinBadge";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { loadConfig, type PlayEntry, type SeriesGroupCfg } from "@/data/lemosPlayConfig";

// Coin reward per category when finishing/watching content
const COIN_REWARDS: Record<string, number> = {
  Filme: 8,
  Série: 5,
  Música: 3,
  Louvor: 3,
};

interface PlayItem {
  id: string;
  title: string;
  src: string;
  thumb?: string;
  poster?: string;
  category: string;
}

const toPlay = (v: PlayEntry, category: string): PlayItem => ({
  id: v.id,
  title: v.title,
  src: v.src,
  poster: v.poster,
  category,
});

const PROGRESS_KEY = "lemosplay:progress";
type ProgressMap = Record<string, { t: number; d: number; updated: number }>;
const loadProgress = (): ProgressMap => {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
};
const saveProgress = (p: ProgressMap) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));

/* ============ Estado social por vídeo (curtidas, seguidores, etc) ============ */
const SOCIAL_KEY = "lemosplay:social";
type SocialState = { liked: boolean; following: boolean; likes: number; comments: number; shares: number };
type SocialMap = Record<string, SocialState>;
const loadSocial = (): SocialMap => { try { return JSON.parse(localStorage.getItem(SOCIAL_KEY) || "{}"); } catch { return {}; } };
const saveSocial = (s: SocialMap) => localStorage.setItem(SOCIAL_KEY, JSON.stringify(s));
const initialSocial = (id: string): SocialState => {
  // pseudo-random initial counts so cards look alive
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return { liked: false, following: false, likes: 50 + (h % 9000), comments: 5 + (h % 400), shares: 1 + (h % 200) };
};
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`);

function VideoSideActions({ itemId, title, src }: { itemId: string; title: string; src: string }) {
  const [map, setMap] = useState<SocialMap>(() => loadSocial());
  const st = map[itemId] || initialSocial(itemId);
  const update = (patch: Partial<SocialState>) => {
    const next = { ...map, [itemId]: { ...st, ...patch } };
    setMap(next); saveSocial(next);
  };
  const stop = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); };
  const toggleLike = (e: React.MouseEvent) => { stop(e); update({ liked: !st.liked, likes: st.likes + (st.liked ? -1 : 1) }); };
  const toggleFollow = (e: React.MouseEvent) => { stop(e); update({ following: !st.following }); };
  const onComment = (e: React.MouseEvent) => { stop(e); update({ comments: st.comments + 1 }); };
  const onShare = async (e: React.MouseEvent) => {
    stop(e);
    const url = src || window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else await navigator.clipboard.writeText(url);
    } catch { /* noop */ }
    update({ shares: st.shares + 1 });
  };
  const onDownload = (e: React.MouseEvent) => { stop(e); if (src) window.open(src, "_blank"); };
  const onSendTo = (e: React.MouseEvent) => {
    stop(e);
    const url = src || window.location.href;
    const text = encodeURIComponent(`${title} — ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const Btn = ({ onClick, icon: Icon, label, active, color }: { onClick: (e: React.MouseEvent) => void; icon: typeof Heart; label: string; active?: boolean; color?: string }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 group/act"
      title={label}
    >
      <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/55 backdrop-blur flex items-center justify-center transition group-hover/act:bg-black/80 ${active ? color : "text-white"}`}>
        <Icon className={`w-4 h-4 ${active ? "fill-current" : ""}`} />
      </span>
      <span className="text-[9px] font-bold text-white drop-shadow text-center leading-none">{label}</span>
    </button>
  );

  return (
    <div className="absolute top-1 right-1 z-20 flex flex-col gap-1.5 items-center">
      <Btn onClick={toggleFollow} icon={UserPlus} label={st.following ? "Seguindo" : "Seguir"} active={st.following} color="text-emerald-300" />
      <Btn onClick={toggleLike} icon={Heart} label={fmt(st.likes)} active={st.liked} color="text-rose-400" />
      <Btn onClick={onComment} icon={MessageCircle} label={fmt(st.comments)} />
      <Btn onClick={onShare} icon={Share2} label={fmt(st.shares)} />
      <Btn onClick={onDownload} icon={Download} label="Baixar" />
      <Btn onClick={onSendTo} icon={Send} label="Enviar" />
    </div>
  );
}

function Row({ title, items, onPlay, progress }: { title: string; items: PlayItem[]; onPlay: (item: PlayItem) => void; progress: ProgressMap }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  if (!items.length) return null;

  return (
    <section className="mb-8 group/row">
      <h2 className="text-white font-bold text-lg sm:text-2xl mb-3 px-4 sm:px-12">{title}</h2>
      <div className="relative">
        <button onClick={() => scrollBy(-600)} className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center text-white hover:bg-black/80" aria-label="Anterior">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div ref={scrollerRef} className="flex gap-2 overflow-x-auto scroll-smooth px-4 sm:px-12 pb-3" style={{ scrollbarWidth: "none" }}>
          {items.map((item) => {
            const p = progress[item.id];
            const pct = p && p.d > 0 ? Math.min(100, Math.round((p.t / p.d) * 100)) : 0;
            return (
              <button key={item.id} onClick={() => onPlay(item)} className="relative shrink-0 w-[200px] sm:w-[280px] aspect-video rounded overflow-hidden bg-zinc-900 hover:scale-105 hover:z-10 hover:ring-2 hover:ring-white transition-all duration-200 group/card">
                {item.poster ? (
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/40" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pb-4">
                  <p className="text-white font-bold text-sm text-left line-clamp-1">{item.title}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-zinc-300 text-xs text-left">{item.category}</p>
                    <CoinBadge amount={COIN_REWARDS[item.category] ?? 3} size="xs" />
                  </div>
                </div>
                {pct > 0 && (
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                    <div className="h-full" style={{ width: `${pct}%`, background: "#e50914" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <button onClick={() => scrollBy(600)} className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center text-white hover:bg-black/80" aria-label="Próximo">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
}

export default function LemosPlay() {
  const isAdmin = useIsAdmin();
  const [adminOpen, setAdminOpen] = useState(false);
  const [cfg, setCfg] = useState(() => loadConfig());

  useEffect(() => {
    const h = () => setCfg(loadConfig());
    window.addEventListener("lemos_play_config_change", h);
    return () => window.removeEventListener("lemos_play_config_change", h);
  }, []);

  const filmesPlay = useMemo(() => cfg.filmes.map((v) => toPlay(v, "Filme")), [cfg]);
  const musicasPlay = useMemo(() => cfg.musicas.map((v) => toPlay(v, "Música")), [cfg]);
  const louvoresPlay = useMemo(() => cfg.louvores.map((v) => toPlay(v, "Louvor")), [cfg]);
  const seriesGroupItems = useMemo(
    () =>
      cfg.series.map((g: SeriesGroupCfg) => ({
        id: g.id,
        title: g.title,
        poster: g.icon,
        category: "Série",
        videos: g.videos.map((v) => toPlay(v, "Série")),
      })),
    [cfg]
  );

  const [playing, setPlaying] = useState<PlayItem | null>(null);
  const [openGroup, setOpenGroup] = useState<(typeof seriesGroupItems)[number] | null>(null);
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const allItems: PlayItem[] = useMemo(
    () => [...filmesPlay, ...musicasPlay, ...louvoresPlay, ...seriesGroupItems.flatMap((g) => g.videos)],
    [filmesPlay, musicasPlay, louvoresPlay, seriesGroupItems]
  );

  const playSrc = useMemo(() => {
    if (!playing) return "";
    const p = progress[playing.id];
    const start = p && p.d > 0 && p.t > 5 && p.t < p.d - 10 ? Math.floor(p.t) : 0;
    const sep = playing.src.includes("?") ? "&" : "?";
    return start > 0 ? `${playing.src}${sep}t=${start}` : playing.src;
  }, [playing, progress]);

  useEffect(() => {
    if (!playing) return;
    const currentId = playing.id;
    const subscribe = () => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      ["timeupdate", "ended", "play", "ready"].forEach((evt) => {
        win.postMessage(JSON.stringify({ method: "addEventListener", value: evt }), "*");
      });
    };
    const onLoad = () => setTimeout(subscribe, 500);
    iframeRef.current?.addEventListener("load", onLoad);
    const onMsg = (e: MessageEvent) => {
      if (typeof e.data !== "string") return;
      try {
        const data = JSON.parse(e.data);
        if (data.event === "timeupdate" && data.value) {
          const t = Number(data.value.seconds);
          const d = Number(data.value.duration);
          if (!isNaN(t) && !isNaN(d) && d > 0) {
            setProgress((prev) => {
              const next = { ...prev, [currentId]: { t, d, updated: Date.now() } };
              saveProgress(next);
              return next;
            });
          }
        }
      } catch {}
    };
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("message", onMsg);
      iframeRef.current?.removeEventListener("load", onLoad);
    };
  }, [playing]);

  const continueItems = useMemo(() => {
    return Object.entries(progress)
      .filter(([, p]) => p.d > 0 && p.t / p.d > 0.02 && p.t / p.d < 0.95)
      .sort((a, b) => b[1].updated - a[1].updated)
      .map(([id]) => allItems.find((x) => x.id === id))
      .filter((x): x is PlayItem => !!x);
  }, [progress, allItems]);

  const hero = filmesPlay[0] ?? louvoresPlay[0] ?? musicasPlay[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader title="Lemos Play" subtitle="Filmes, Séries e Músicas" icon={lemosPlayLogo} />
      <header className="fixed top-0 inset-x-0 z-30 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <div className="flex items-center justify-between px-4 sm:px-12 py-3 pl-20">
          <img src={lemosPlayLogo} alt="Lemos Play" className="h-14 sm:h-20 w-auto drop-shadow-xl pointer-events-auto" />
          <div className="flex items-center gap-4 pointer-events-auto">
            <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-zinc-200">
              <a href="#filmes" className="hover:text-white">Filmes</a>
              <a href="#series" className="hover:text-white">Séries</a>
              <a href="#musicas" className="hover:text-white">Músicas</a>
              <a href="#louvores" className="hover:text-white">Louvores</a>
            </nav>
            {isAdmin && (
              <button
                onClick={() => setAdminOpen(true)}
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center transition"
                title="Configurar Lemos Play"
                aria-label="Configurar"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[70vh] sm:h-[85vh] w-full overflow-hidden">
        {hero?.poster ? (
          <img src={hero.poster} alt={hero.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        <div className="relative h-full flex flex-col justify-end pb-16 sm:pb-24 px-4 sm:px-12 max-w-3xl">
          <p className="uppercase tracking-widest text-xs sm:text-sm text-zinc-300 mb-2">Em destaque · {hero?.category}</p>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold drop-shadow-2xl mb-3">{hero?.title}</h1>
          <p className="text-zinc-200 text-sm sm:text-base mb-5 max-w-xl">
            Histórias bíblicas, filmes e músicas para inspirar e fortalecer a sua fé.
          </p>
          <div className="flex gap-3">
            <button onClick={() => hero && setPlaying(hero)} className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-white/85 transition">
              <Play className="w-5 h-5 fill-black" /> Assistir
            </button>
            <button className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-6 py-2.5 rounded hover:bg-white/30 transition backdrop-blur">
              <Info className="w-5 h-5" /> Mais informações
            </button>
          </div>
        </div>
      </section>

      <div className="-mt-20 sm:-mt-32 relative z-10 pb-16">
        {continueItems.length > 0 && <Row title="Continuar assistindo" items={continueItems} onPlay={setPlaying} progress={progress} />}
        <div id="filmes"><Row title="Filmes Bíblicos" items={filmesPlay} onPlay={setPlaying} progress={progress} /></div>
        <div id="series">
          <Row
            title="Séries Bíblicas"
            items={seriesGroupItems.map((g) => ({ id: g.id, title: g.title, poster: g.poster, src: "", category: g.category }))}
            onPlay={(item) => {
              const g = seriesGroupItems.find((x) => x.id === item.id);
              if (g) setOpenGroup(g);
            }}
            progress={progress}
          />
        </div>
        <div id="musicas"><Row title="Músicas" items={musicasPlay} onPlay={setPlaying} progress={progress} /></div>
        <div id="louvores"><Row title="Louvores" items={louvoresPlay} onPlay={setPlaying} progress={progress} /></div>
      </div>

      {openGroup && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur flex items-center justify-center p-4" onClick={() => setOpenGroup(null)}>
          <div className="bg-zinc-900 rounded-xl max-w-3xl w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenGroup(null)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" title="Fechar">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-5">
              {openGroup.poster && <img src={openGroup.poster} alt={openGroup.title} className="w-20 h-20 rounded-lg object-cover" />}
              <div>
                <h3 className="text-2xl font-extrabold text-white">{openGroup.title}</h3>
                <p className="text-zinc-400 text-sm">{openGroup.videos.length} episódios</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {openGroup.videos.map((v) => {
                const p = progress[v.id];
                const pct = p && p.d > 0 ? Math.min(100, Math.round((p.t / p.d) * 100)) : 0;
                return (
                  <button key={v.id} onClick={() => { setPlaying(v); setOpenGroup(null); }} className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800 hover:ring-2 hover:ring-white transition">
                    {v.poster && <img src={v.poster} alt={v.title} className="w-full h-full object-cover" />}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                      <p className="text-white text-xs font-bold text-left line-clamp-2">{v.title}</p>
                    </div>
                    {pct > 0 && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                        <div className="h-full" style={{ width: `${pct}%`, background: "#e50914" }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {playing && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button onClick={() => setPlaying(null)} className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white" title="Fechar">
            <X className="w-6 h-6" />
          </button>
          <iframe ref={iframeRef} src={playSrc} className="absolute inset-0 w-full h-full border-0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen title={playing.title} />
        </div>
      )}

      <LemosPlayAdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}
