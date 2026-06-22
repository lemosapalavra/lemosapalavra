import { useState, useEffect, useRef, useMemo } from "react";
import { Play, Info, ChevronLeft, ChevronRight, X, Settings, UserPlus, Heart, MessageCircle, Share2, Download, Send, ListVideo, SkipForward, RotateCcw } from "lucide-react";
import lemosPlayLogo from "@/assets/lemos-play-logo.png";
import PageHeader from "@/components/PageHeader";
import LemosPlayAdminPanel from "@/components/LemosPlayAdminPanel";
import CoinBadge from "@/components/CoinBadge";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { loadConfig, type PlayEntry, type SeriesGroupCfg } from "@/data/lemosPlayConfig";
import { awardOnce } from "@/hooks/useCoins";

import { normalizeVideo } from "@/lib/videoEmbed";

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

const toPlay = (v: PlayEntry, category: string): PlayItem => {
  const n = normalizeVideo(v.src, false);
  return {
    id: v.id,
    title: v.title,
    src: v.src,
    poster: v.poster || n.poster,
    category,
  };
};

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

function VideoSideActions({ itemId, title, src, className = "absolute top-1 right-1" }: { itemId: string; title: string; src: string; className?: string }) {
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
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 group/act cursor-pointer"
      title={label}
    >
      <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/55 backdrop-blur flex items-center justify-center transition group-hover/act:bg-black/80 ${active ? color : "text-white"}`}>
        <Icon className={`w-4 h-4 ${active ? "fill-current" : ""}`} />
      </span>
      <span className="text-[9px] font-bold text-white drop-shadow text-center leading-none">{label}</span>
    </span>
  );

  return (
    <div className={`${className} z-20 flex flex-col gap-1.5 items-center`}>
      <Btn onClick={toggleFollow} icon={UserPlus} label={st.following ? "Seguindo" : "Seguir"} active={st.following} color="text-emerald-300" />
      <Btn onClick={toggleLike} icon={Heart} label={fmt(st.likes)} active={st.liked} color="text-rose-400" />
      <Btn onClick={onComment} icon={MessageCircle} label={fmt(st.comments)} />
      <Btn onClick={onShare} icon={Share2} label={fmt(st.shares)} />
      <Btn onClick={onDownload} icon={Download} label="Baixar" />
      <Btn onClick={onSendTo} icon={Send} label="Enviar" />
    </div>
  );
}

function Row({ title, items, onPlay, progress, onContinueSeries, getContinuationCount }: { title: string; items: PlayItem[]; onPlay: (item: PlayItem) => void; progress: ProgressMap; onContinueSeries?: (item: PlayItem) => void; getContinuationCount?: (item: PlayItem) => number }) {
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
            const contCount = getContinuationCount?.(item) ?? 0;
            return (
              <button key={item.id} onClick={() => onPlay(item)} className="relative shrink-0 w-[200px] sm:w-[280px] aspect-video rounded overflow-hidden bg-zinc-900 hover:scale-105 hover:z-10 hover:ring-2 hover:ring-white transition-all duration-200 group/card">
                {item.poster ? (
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/40" />
                  </div>
                )}
                <VideoSideActions itemId={item.id} title={item.title} src={item.src} />
                {contCount > 0 && onContinueSeries && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); onContinueSeries(item); }}
                    title={`Ver série (${contCount} episódios)`}
                    className="absolute top-1 left-1 z-20 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-600/95 hover:bg-red-500 text-white text-[10px] font-bold shadow-lg cursor-pointer transition"
                  >
                    <ListVideo className="w-3.5 h-3.5" />
                    <span>+{contCount} ep.</span>
                  </span>
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
  const [playingGroupId, setPlayingGroupId] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<(typeof seriesGroupItems)[number] | null>(null);
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [resumePrompt, setResumePrompt] = useState<{ item: PlayItem; groupId: string | null; seconds: number } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const lastProgressSave = useRef<number>(0);

  // Throttled progress writer: updates localStorage immediately,
  // but only triggers React state update every 5s to avoid re-renders
  // that would re-fire the fullscreen effect and interrupt playback.
  const writeProgress = (id: string, t: number, d: number) => {
    const all = loadProgress();
    all[id] = { t, d, updated: Date.now() };
    saveProgress(all);
    const now = Date.now();
    if (now - lastProgressSave.current > 5000) {
      lastProgressSave.current = now;
      setProgress(all);
    }
  };

  // NOTE: auto-fullscreen was removed. In sandboxed/preview iframes the
  // Fullscreen API is disallowed and a rejected requestFullscreen could
  // cause the player UI to flicker/close on open ("video sai sozinho"
  // bug reported by the user). The native controls already expose a
  // fullscreen button if the user wants it.





  // Decide if we should ask user to resume or restart before playing.
  const requestPlay = (item: PlayItem, groupId: string | null = null) => {
    const p = progress[item.id];
    if (p && p.d > 0) {
      const ratio = p.t / p.d;
      if (ratio > 0.02 && ratio < 0.95 && p.t > 5) {
        setResumePrompt({ item, groupId, seconds: Math.floor(p.t) });
        return;
      }
    }
    setPlayingGroupId(groupId);
    setPlaying(item);
  };
  const startFromBeginning = (item: PlayItem, groupId: string | null) => {
    // Wipe saved progress so the iframe URL won't include &start=
    setProgress((prev) => {
      const next = { ...prev };
      delete next[item.id];
      saveProgress(next);
      return next;
    });
    setPlayingGroupId(groupId);
    setPlaying(item);
  };

  // Next episode within the current series group (if any)
  const nextInGroup = useMemo(() => {
    if (!playing || !playingGroupId) return null;
    const g = seriesGroupItems.find((x) => x.id === playingGroupId);
    if (!g) return null;
    const idx = g.videos.findIndex((v) => v.id === playing.id);
    return idx >= 0 && idx < g.videos.length - 1 ? g.videos[idx + 1] : null;
  }, [playing, playingGroupId, seriesGroupItems]);

  const allItems: PlayItem[] = useMemo(
    () => [...filmesPlay, ...musicasPlay, ...louvoresPlay, ...seriesGroupItems.flatMap((g) => g.videos)],
    [filmesPlay, musicasPlay, louvoresPlay, seriesGroupItems]
  );

  // Suggestions shown inside the player so the user can choose what to
  // watch next — Netflix-style. Priority: next-in-series, then siblings
  // of the same series, then other items of the same category, then a
  // sample from the rest of the catalog. Deduped, capped at 8.
  const nextSuggestions = useMemo<PlayItem[]>(() => {
    if (!playing) return [];
    const out: PlayItem[] = [];
    const seen = new Set<string>([playing.id]);
    const push = (v?: PlayItem | null) => {
      if (v && !seen.has(v.id) && v.poster) { seen.add(v.id); out.push(v); }
    };
    if (nextInGroup) push(nextInGroup);
    if (playingGroupId) {
      const g = seriesGroupItems.find((x) => x.id === playingGroupId);
      g?.videos.forEach(push);
    }
    allItems.filter((v) => v.category === playing.category).forEach(push);
    allItems.forEach(push);
    return out.slice(0, 8);
  }, [playing, playingGroupId, nextInGroup, seriesGroupItems, allItems]);


  // IMPORTANT: only depend on `playing.id`, NOT on `progress`.
  // If we depend on progress, every progress write changes the embed URL
  // (start/t param) which forces the iframe/video to reload and restart
  // from the very beginning — exactly the bug the user reported.
  const playInfo = useMemo(() => {
    if (!playing) return null;
    if (!playing.src) return { kind: "iframe" as const, embedUrl: "", watchUrl: "", poster: playing.poster };
    const n = normalizeVideo(playing.src, true);
    // Read progress directly from storage at open time (snapshot).
    const stored = loadProgress()[playing.id];
    const start = stored && stored.d > 0 && stored.t > 5 && stored.t < stored.d - 10 ? Math.floor(stored.t) : 0;
    let url = n.embedUrl;
    if (start > 0 && n.kind !== "mp4") {
      const sep = url.includes("?") ? "&" : "?";
      url = n.kind === "youtube" ? `${url}&start=${start}` : `${url}${sep}t=${start}`;
    }
    return { ...n, embedUrl: url, startSeconds: start };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing?.id]);
  const playSrc = playInfo?.embedUrl ?? "";
  const initialStart = (playInfo as any)?.startSeconds ?? 0;

  const [playError, setPlayError] = useState(false);
  useEffect(() => {
    if (!playing) { setPlayError(false); return; }
    setPlayError(false);
    if (!playing.src || playInfo?.kind === "mp4") return;
    const t = window.setTimeout(() => {
      // If iframe hasn't fired load within 8s, assume blocked/broken
      try {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) setPlayError(true);
      } catch { /* cross-origin = loaded fine */ }
    }, 8000);
    return () => window.clearTimeout(t);
  }, [playing, playInfo?.kind]);

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
            writeProgress(currentId, t, d);
            if (t / d >= 0.9) {
              const reward = COIN_REWARDS[playing.category] ?? 3;
              awardOnce(`video:${currentId}`, reward, `Você assistiu "${playing.title}"`);
            }
          }
        }
        if (data.event === "ended") {
          const reward = COIN_REWARDS[playing.category] ?? 3;
          awardOnce(`video:${currentId}`, reward, `Você assistiu "${playing.title}"`);
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

  // Hero rotates through a curated spotlight (filmes + first ep of each series)
  // to mimic Netflix's "Em destaque" carousel. Auto-advances every 7s with a
  // soft crossfade so users always see new content even without interaction.
  const heroPool = useMemo<PlayItem[]>(() => {
    const seriesFirsts = seriesGroupItems
      .map((g) => g.videos[0])
      .filter((v): v is PlayItem => !!v && !!v.poster);
    const pool = [...filmesPlay, ...seriesFirsts, ...louvoresPlay, ...musicasPlay]
      .filter((p) => !!p.poster);
    return pool.length ? pool : [filmesPlay[0]].filter(Boolean) as PlayItem[];
  }, [filmesPlay, seriesGroupItems, louvoresPlay, musicasPlay]);
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    if (heroPool.length < 2) return;
    const id = window.setInterval(() => setHeroIdx((i) => (i + 1) % heroPool.length), 7000);
    return () => window.clearInterval(id);
  }, [heroPool.length]);
  const hero = heroPool[heroIdx % Math.max(1, heroPool.length)] ?? filmesPlay[0] ?? louvoresPlay[0] ?? musicasPlay[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageHeader title="Lemos Play" subtitle="Filmes, Séries e Músicas" />
      {isAdmin && (
        <div className="fixed top-2 right-2 z-40">
          <button
            onClick={() => setAdminOpen(true)}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center transition"
            title="Configurar Lemos Play"
            aria-label="Configurar"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      )}


      {/* Hero */}
      <section className="relative h-[70vh] sm:h-[85vh] w-full overflow-hidden">
        {hero?.poster ? (
          <img key={hero.id} src={hero.poster} alt={hero.title} className="absolute inset-0 w-full h-full object-cover animate-fade-in" />
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
            <button onClick={() => hero && requestPlay(hero)} className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-white/85 transition">
              <Play className="w-5 h-5 fill-black" /> Assistir
            </button>
            <button className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-6 py-2.5 rounded hover:bg-white/30 transition backdrop-blur">
              <Info className="w-5 h-5" /> Mais informações
            </button>
          </div>
        </div>
      </section>

      <div className="-mt-20 sm:-mt-32 relative z-10 pb-16">
        {continueItems.length > 0 && <Row title="Continuar assistindo" items={continueItems} onPlay={(item) => requestPlay(item)} progress={progress} />}
        <div id="filmes"><Row
          title="Filmes Bíblicos"
          items={filmesPlay}
          onPlay={(item) => requestPlay(item)}
          progress={progress}
        /></div>

        {/* Origem da Série Jesus — só texto branco */}
        <div className="px-4 sm:px-8 -mt-2 mb-6 text-center">
          <a href="#series" className="block max-w-3xl mx-auto text-white hover:text-amber-200 transition">
            <p className="font-display font-extrabold text-sm sm:text-base drop-shadow">
              ⭐ <span className="underline">O Nascimento de Jesus</span> é o filme que deu origem à <strong>Série Jesus</strong>.
            </p>
            <p className="text-xs sm:text-sm text-white/85 drop-shadow">
              👇 Assista à série logo abaixo, em Mini Séries Bíblicas.
            </p>
          </a>
        </div>


        <div id="series">
          <Row
            title="Mini Séries Bíblicas"
            items={seriesGroupItems.map((g) => ({ id: g.id, title: g.title, poster: g.poster, src: "", category: g.category }))}
            onPlay={(item) => {
              const g = seriesGroupItems.find((x) => x.id === item.id);
              if (g) setOpenGroup(g);
            }}
            progress={progress}
          />
        </div>
        <div id="musicas"><Row title="Músicas" items={musicasPlay} onPlay={(item) => requestPlay(item)} progress={progress} /></div>
        <div id="louvores"><Row title="Louvores" items={louvoresPlay} onPlay={(item) => requestPlay(item)} progress={progress} /></div>
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
              {openGroup.videos.map((v, idx) => {
                const p = progress[v.id];
                const pct = p && p.d > 0 ? Math.min(100, Math.round((p.t / p.d) * 100)) : 0;
                const next = openGroup.videos[idx + 1];
                return (
                  <button key={v.id} onClick={() => { const gid = openGroup.id; setOpenGroup(null); requestPlay(v, gid); }} className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800 hover:ring-2 hover:ring-white transition">
                    {v.poster ? <img src={v.poster} alt={v.title} className="w-full h-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center"><Play className="w-10 h-10 text-white/40" /></div>}
                    <VideoSideActions itemId={v.id} title={v.title} src={v.src} />
                    {next && (
                      <span
                        title={`Em seguida: ${next.title}`}
                        className="absolute top-1 left-1 z-20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/95 text-white text-[10px] font-bold shadow-lg"
                      >
                        <SkipForward className="w-3 h-3" />
                        <span>Próximo</span>
                      </span>
                    )}
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
        <div
          ref={playerContainerRef}
          className="fixed inset-0 z-50 bg-black flex flex-col"
        >
          <button onClick={() => { setProgress(loadProgress()); setPlaying(null); }} className="absolute top-4 right-4 z-30 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white" title="Fechar">
            <X className="w-6 h-6" />
          </button>

          {/* Video stage — leaves room for the suggestions strip below */}
          <div className="relative flex-1 min-h-0 bg-black">
            {playInfo?.kind === "mp4" ? (
              <video
                key={playing.id}
                src={playSrc}
                className="absolute inset-0 w-full h-full bg-black"
                controls
                autoPlay
                playsInline
                onLoadedMetadata={(e) => {
                  if (initialStart > 0 && initialStart < e.currentTarget.duration - 1) {
                    e.currentTarget.currentTime = initialStart;
                  }
                }}
                onError={() => setPlayError(true)}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration > 0) {
                    writeProgress(playing.id, v.currentTime, v.duration);
                    if (v.currentTime / v.duration >= 0.9) {
                      const reward = COIN_REWARDS[playing.category] ?? 3;
                      awardOnce(`video:${playing.id}`, reward, `Você assistiu "${playing.title}"`);
                    }
                  }
                }}
                onEnded={() => {
                  const reward = COIN_REWARDS[playing.category] ?? 3;
                  awardOnce(`video:${playing.id}`, reward, `Você assistiu "${playing.title}"`);
                }}
              />
            ) : playSrc ? (
              <iframe
                ref={iframeRef}
                src={playSrc}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                title={playing.title}
                onError={() => setPlayError(true)}
              />
            ) : null}
            <VideoSideActions itemId={playing.id} title={playing.title} src={playing.src} className="absolute right-4 top-1/2 -translate-y-1/2" />
            {nextInGroup && (
              <button
                onClick={() => requestPlay(nextInGroup, playingGroupId)}
                className="absolute right-4 bottom-6 z-20 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-2xl ring-2 ring-white/30 transition"
                title={`Próximo: ${nextInGroup.title}`}
              >
                <SkipForward className="w-4 h-4" />
                <span className="hidden sm:inline">Próximo: {nextInGroup.title}</span>
                <span className="sm:hidden">Próximo</span>
              </button>
            )}
            {(playError || !playSrc) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/85 backdrop-blur p-6">
                <div className="max-w-md w-full bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center text-white shadow-2xl">
                  <h3 className="text-xl font-extrabold mb-2">{playSrc ? "Vídeo indisponível" : "Vídeo em atualização"}</h3>
                  <p className="text-sm text-zinc-300 mb-5">
                    {playSrc ? "Este link não carregou. O servidor de vídeo pode estar offline ou bloqueando este domínio." : "O link antigo deste vídeo estava quebrado e foi removido para não exibir erro 404."}
                    {isAdmin && " Como admin, você pode substituir o link em ⚙️ Configurar → Lemos Play (cole o link do YouTube, Vimeo ou um arquivo MP4)."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    {playSrc && (
                      <a href={playInfo?.watchUrl || playing.src} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-white text-black font-bold hover:bg-white/85">
                        Abrir em nova aba
                      </a>
                    )}
                    {isAdmin && (
                      <button onClick={() => { setPlaying(null); setAdminOpen(true); }} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700">
                        Corrigir link
                      </button>
                    )}
                    <button onClick={() => setPlaying(null)} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-zinc-800 text-white font-bold hover:bg-zinc-700">
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Próximos vídeos — escolha o próximo */}
          {nextSuggestions.length > 0 && (
            <div className="shrink-0 bg-gradient-to-t from-black via-black/95 to-black/70 border-t border-white/10 px-4 sm:px-8 py-3">
              <div className="flex items-center gap-2 mb-2">
                <SkipForward className="w-4 h-4 text-red-500" />
                <h3 className="font-display font-extrabold text-white text-sm sm:text-base">
                  Assista ao próximo vídeo
                </h3>
                <span className="text-white/60 text-xs hidden sm:inline">
                  · escolha um da sequência ou outro vídeo
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {nextSuggestions.map((v) => {
                  const p = progress[v.id];
                  const pct = p && p.d > 0 ? Math.min(100, Math.round((p.t / p.d) * 100)) : 0;
                  const gid = seriesGroupItems.find((g) => g.videos.some((x) => x.id === v.id))?.id ?? null;
                  return (
                    <button
                      key={v.id}
                      onClick={() => requestPlay(v, gid)}
                      className="relative shrink-0 w-[150px] sm:w-[200px] aspect-video rounded-md overflow-hidden bg-zinc-900 hover:ring-2 hover:ring-white transition group/sug"
                      title={v.title}
                    >
                      {v.poster ? (
                        <img src={v.poster} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/sug:opacity-100 flex items-center justify-center transition">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                        <p className="text-white text-[11px] sm:text-xs font-bold text-left line-clamp-1">{v.title}</p>
                        <p className="text-zinc-300 text-[10px] text-left">{v.category}</p>
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
          )}
        </div>
      )}


      {resumePrompt && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur flex items-center justify-center p-4" onClick={() => setResumePrompt(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 text-center text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-extrabold mb-2 line-clamp-2">{resumePrompt.item.title}</h3>
            <p className="text-sm text-zinc-300 mb-5">
              Você parou em <span className="font-bold text-white">{Math.floor(resumePrompt.seconds / 60)}:{String(resumePrompt.seconds % 60).padStart(2, "0")}</span>. Continuar de onde parou ou rever desde o início?
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => { const r = resumePrompt; setResumePrompt(null); setPlayingGroupId(r.groupId); setPlaying(r.item); }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-500"
              >
                <Play className="w-4 h-4 fill-white" /> Continuar
              </button>
              <button
                onClick={() => { const r = resumePrompt; setResumePrompt(null); startFromBeginning(r.item, r.groupId); }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-black font-bold hover:bg-white/85"
              >
                <RotateCcw className="w-4 h-4" /> Rever do início
              </button>
              <button onClick={() => setResumePrompt(null)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-zinc-800 text-white font-bold hover:bg-zinc-700">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <LemosPlayAdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}
