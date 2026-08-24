import { useState, useEffect, useRef, useMemo } from "react";
import { Play, Info, ChevronLeft, ChevronRight, X, Settings, UserPlus, Heart, MessageCircle, Share2, Download, Send, ListVideo, SkipForward, RotateCcw, Eye } from "lucide-react";
import lemosPlayLogo from "@/assets/lemos-play-logo.png";
import PageHeader from "@/components/PageHeader";
import WavyBanner from "@/components/WavyBanner";
import ShareButton from "@/components/ShareButton";
import ColonialVideoFrame from "@/components/ColonialVideoFrame";
import VideoActionsColumn from "@/components/VideoSideActions";
import LemosPlayAdminPanel from "@/components/LemosPlayAdminPanel";
import CoinBadge from "@/components/CoinBadge";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { loadConfig, type PlayEntry, type SeriesGroupCfg } from "@/data/lemosPlayConfig";
import { COINS } from "@/data/coinRewards";
import { awardOnce } from "@/hooks/useCoins";

import { normalizeVideo } from "@/lib/videoEmbed";
import { markSeen } from "@/lib/newContent";
import { lemosPlayTitles } from "@/data/contentIndex";
import batalhaAnjosVid from "@/assets/lemos-play/a-batalha-dos-anjos.mp4.asset.json";
import batalhaAnjosThumb from "@/assets/lemos-play/batalha-anjos-thumb.png.asset.json";
import criacaoVid from "@/assets/lemos-play/a-criacao-v5.mp4.asset.json";
import criacaoThumb from "@/assets/lemos-play/a-criacao-thumb.png.asset.json";
import dezMandVid from "@/assets/lemos-play/os-10-mandamentos.mp4.asset.json";
import dezMandThumb from "@/assets/lemos-play/os-10-mandamentos-thumb.png.asset.json";
import noeVid from "@/assets/lemos-play/noe-e-a-arca.mp4.asset.json";
import noeThumb from "@/assets/lemos-play/noe-e-a-arca-thumb.png.asset.json";
import nascimentoJesusVid from "@/assets/lemos-play/nascimento-jesus.mp4.asset.json";
import nascimentoJesusThumb from "@/assets/lemos-play/nascimento-jesus-thumb.png.asset.json";




// Coin reward per category when finishing/watching content
const COIN_REWARDS: Record<string, number> = {
  Gênesis: COINS.genesis,
  Jesus: COINS.jesus,
  Filme: COINS.filme,
  Série: COINS.serie,
  Música: COINS.musica,
  Louvor: COINS.louvor,
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
type SocialState = { liked: boolean; following: boolean; views: number; likes: number; comments: number; shares: number };
type SocialMap = Record<string, SocialState>;
const loadSocial = (): SocialMap => { try { return JSON.parse(localStorage.getItem(SOCIAL_KEY) || "{}"); } catch { return {}; } };
const saveSocial = (s: SocialMap) => localStorage.setItem(SOCIAL_KEY, JSON.stringify(s));
const initialSocial = (id: string): SocialState => {
  // pseudo-random initial counts so cards look alive
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return {
    liked: false,
    following: false,
    views: 1200 + (h % 988000),
    likes: 50 + (h % 9000),
    comments: 5 + (h % 400),
    shares: 1 + (h % 200),
  };
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

  const Btn = ({ onClick, icon: Icon, label, count, active, color }: { onClick?: (e: React.MouseEvent) => void; icon: typeof Heart; label: string; count?: string; active?: boolean; color?: string }) => {
    const isInteractive = !!onClick;
    return (
      <span
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={onClick}
        className={`flex flex-col items-center gap-0.5 group/act ${isInteractive ? "cursor-pointer" : ""}`}
        title={label}
      >
        <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/55 backdrop-blur flex items-center justify-center transition ${isInteractive ? "group-hover/act:bg-black/80" : ""} ${active ? color : "text-white"}`}>
          <Icon className={`w-4 h-4 ${active ? "fill-current" : ""}`} />
        </span>
        <span className="text-[9px] font-bold text-white drop-shadow text-center leading-none">{label}</span>
        {count && <span className="text-[9px] font-bold text-white/80 drop-shadow text-center leading-none">{count}</span>}
      </span>
    );
  };

  return (
    <div className={`${className} z-20 flex flex-col gap-1.5 items-center`}>
      <Btn icon={Eye} label="Visualizações" count={fmt(st.views)} />
      <Btn onClick={toggleFollow} icon={UserPlus} label={st.following ? "Seguindo" : "Seguir"} active={st.following} color="text-emerald-300" />
      <Btn onClick={toggleLike} icon={Heart} label="Gostei" count={fmt(st.likes)} active={st.liked} color="text-rose-400" />
      <Btn onClick={onComment} icon={MessageCircle} label="Comentar" count={fmt(st.comments)} />
      <Btn onClick={onShare} icon={Share2} label="Compartilhar" count={fmt(st.shares)} />
      <Btn onClick={onDownload} icon={Download} label="Baixar" />
      <Btn onClick={onSendTo} icon={Send} label="Enviar" />
    </div>
  );
}

function Row({ title, items, onPlay, progress, onContinueSeries, getContinuationCount, emptyMessage }: { title: string; items: PlayItem[]; onPlay: (item: PlayItem) => void; progress: ProgressMap; onContinueSeries?: (item: PlayItem) => void; getContinuationCount?: (item: PlayItem) => number; emptyMessage?: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  if (!items.length) {
    if (!emptyMessage) return null;
    return (
      <section className="mb-8">
        <h2 className="text-white font-bold text-lg sm:text-2xl mb-3 px-4 sm:px-12">{title}</h2>
        <div className="mx-4 sm:mx-12 rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-sm text-zinc-300 italic text-center">
          {emptyMessage}
        </div>
      </section>
    );
  }

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
              <button key={item.id} onClick={() => onPlay(item)} className="relative shrink-0 w-[140px] sm:w-[180px] aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 hover:z-10 hover:ring-2 hover:ring-white transition-all duration-200 group/card">
                {item.poster ? (
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white/40" />
                  </div>
                )}
                
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
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex justify-end">
                  <CoinBadge amount={COIN_REWARDS[item.category] ?? 3} size="xs" />
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

/* ============ Top 10 row (Netflix-style with big rank numerals) ============ */
function TopTenRow({ items, onPlay, progress }: { items: PlayItem[]; onPlay: (item: PlayItem) => void; progress: ProgressMap }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });
  if (!items.length) return null;
  const top = items.slice(0, 10);
  return (
    <section className="mb-8 group/row">
      <h2 className="text-white font-bold text-lg sm:text-2xl mb-3 px-4 sm:px-12 flex items-center gap-2">
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-red-600 text-white text-xs font-extrabold tracking-widest">TOP 10</span>
        <span>em Histórias hoje</span>
      </h2>
      <div className="relative">
        <button onClick={() => scrollBy(-600)} className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center text-white hover:bg-black/80" aria-label="Anterior">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div ref={scrollerRef} className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth px-4 sm:px-12 pb-3" style={{ scrollbarWidth: "none" }}>
          {top.map((item, idx) => {
            const rank = idx + 1;
            const p = progress[item.id];
            const pct = p && p.d > 0 ? Math.min(100, Math.round((p.t / p.d) * 100)) : 0;
            return (
              <div key={item.id} className="relative shrink-0 flex items-end gap-0 sm:gap-1">
                <span
                  aria-hidden
                  className="select-none font-display font-black leading-none text-transparent text-[120px] sm:text-[180px] -mr-6 sm:-mr-10"
                  style={{
                    WebkitTextStroke: "3px #ffffff",
                    textShadow: "0 6px 24px rgba(0,0,0,0.7)",
                  }}
                >
                  {rank}
                </span>
                <button onClick={() => onPlay(item)} className="relative w-[120px] sm:w-[160px] aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 hover:z-10 hover:ring-2 hover:ring-white transition-all duration-200">
                  {item.poster ? (
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
                      <Play className="w-10 h-10 text-white/40" />
                    </div>
                  )}
                  {/* Título removido — já consta na capa */}
                  {pct > 0 && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                      <div className="h-full" style={{ width: `${pct}%`, background: "#e50914" }} />
                    </div>
                  )}
                </button>
              </div>
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

/** Vídeos desativados pelo admin não aparecem no site. */
const isOn = (v: PlayEntry) => v.enabled !== false;

export default function LemosPlay() {
  const isAdmin = useIsAdmin();
  const [adminOpen, setAdminOpen] = useState(false);
  const [cfg, setCfg] = useState(() => loadConfig());

  useEffect(() => { markSeen("lemosplay", lemosPlayTitles); }, []);

  useEffect(() => {
    const h = () => setCfg(loadConfig());
    window.addEventListener("lemos_play_config_change", h);
    return () => window.removeEventListener("lemos_play_config_change", h);
  }, []);

  const filmesPlay = useMemo(() => cfg.filmes.filter(isOn).map((v) => toPlay(v, "Filme")), [cfg]);
  const musicasPlay = useMemo(() => cfg.musicas.filter(isOn).map((v) => toPlay(v, "Música")), [cfg]);
  const louvoresPlay = useMemo(() => cfg.louvores.filter(isOn).map((v) => toPlay(v, "Louvor")), [cfg]);
  const seriesGroupItems = useMemo(
    () =>
      cfg.series.map((g: SeriesGroupCfg) => ({
        id: g.id,
        title: g.title,
        poster: g.icon,
        category: "Série",
        videos: g.videos.filter(isOn).map((v) => toPlay(v, "Série")),
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

  // Descrição curta por categoria — fallback quando não há sinopse específica.
  const heroDescription = useMemo(() => {
    if (!hero) return "";
    const byCategory: Record<string, string> = {
      Filme: "Um filme bíblico especial para toda a família — mergulhe nesta história e fortaleça a sua fé.",
      Série: "Uma série em capítulos com aventuras bíblicas que ensinam valores eternos. Assista episódio por episódio!",
      Música: "Música cristã para louvar, adorar e alegrar o coração de crianças e adultos.",
      Louvor: "Um louvor inspirador para elevar a sua fé e adorar a Deus em família.",
    };
    return byCategory[hero.category] ?? "Histórias bíblicas, filmes e músicas para inspirar e fortalecer a sua fé.";
  }, [hero]);

  const genesisItems: PlayItem[] = useMemo(
    () =>
      cfg.filmes
        .filter(isOn)
        .filter((v) => (v.section || "").toLowerCase() === "gênesis" || (v.section || "").toLowerCase() === "genesis")
        .map((v) => toPlay(v, "Gênesis")),
    [cfg]
  );
  const jesusItems: PlayItem[] = useMemo(
    () =>
      cfg.filmes
        .filter(isOn)
        .filter((v) => {
          const s = (v.section || "").toLowerCase();
          return s === "jesus" || s === "novo testamento";
        })
        .map((v) => toPlay(v, "Jesus")),
    [cfg]
  );


  return (

    <div className="min-h-screen bg-black text-white">
      <PageHeader title="Histórias Bíblicas" subtitle="Filmes, Séries e Músicas" />
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

      <div className="px-4">
        <WavyBanner
          tone="dark"
          emoji="🎬"
          lines={[
            "Assista aos vídeos e ganhe moedinhas para a compra das figurinhas do álbum.",
            "Caso queira, encaminhe aos seus amigos e parentes.",
          ]}
        />
      </div>


      {/* Hero — estilo Netflix: prévia em tela cheia do destaque, descrição à esquerda sobreposta */}
      <section className="relative w-full overflow-hidden bg-black">
        <div className="relative w-full h-[70vh] min-h-[420px] sm:h-[85vh] sm:min-h-[560px]">
          {/* Prévia em vídeo ocupando todo o espaço do destaque */}
          {hero?.src && /\.(mp4|webm|mov)(\?|$)/i.test(hero.src) ? (
            <video
              key={`hero-vid-${hero.id}`}
              src={hero.src}
              poster={hero.poster}
              className="absolute inset-0 w-full h-full object-cover animate-fade-in"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : hero?.poster ? (
            <img loading="lazy" decoding="async" key={`hero-img-${hero.id}`} src={hero.poster} alt={hero.title} className="absolute inset-0 w-full h-full object-cover animate-fade-in" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black" />
          )}

          {/* Gradientes overlay estilo Netflix (esquerda + base) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

          {/* Texto à esquerda */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-12">
              <div key={`hero-text-${hero?.id}`} className="animate-fade-in max-w-xl">
                <p className="uppercase tracking-widest text-xs sm:text-sm text-amber-300 font-bold mb-2">
                  ✨ Em destaque · {hero?.category}
                </p>
                <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-2xl mb-3 leading-tight text-white">
                  {hero?.title}
                </h2>
                <p className="text-zinc-200 text-sm sm:text-base mb-5 leading-relaxed drop-shadow-lg">
                  {heroDescription}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => hero && requestPlay(hero)} className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-white/85 transition">
                    <Play className="w-5 h-5 fill-black" /> Assistir agora
                  </button>
                  <button className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-6 py-2.5 rounded hover:bg-white/30 transition backdrop-blur">
                    <Info className="w-5 h-5" /> Mais informações
                  </button>
                </div>
                {heroPool.length > 1 && (
                  <div className="flex gap-1.5 mt-6">
                    {heroPool.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeroIdx(i)}
                        className={`h-1.5 rounded-full transition-all ${i === heroIdx % heroPool.length ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/60"}`}
                        aria-label={`Destaque ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="-mt-20 sm:-mt-32 relative z-10 pb-16">

        <div id="genesis">
          <Row title="Gênesis" items={genesisItems} onPlay={(item) => requestPlay(item)} progress={progress} />
          <MarathonNote section="Gênesis" perVideo={COIN_REWARDS["Gênesis"]} bonus={MARATHON_BONUS["Gênesis"]} />
        </div>
        <div id="jesus">
          <Row title="Jesus" items={jesusItems} onPlay={(item) => requestPlay(item)} progress={progress} />
          <MarathonNote section="Jesus" perVideo={COIN_REWARDS["Jesus"]} bonus={MARATHON_BONUS["Jesus"]} />
        </div>
        <div id="series"><Row
          title="Séries"
          items={seriesGroupItems.map((g) => ({ id: g.id, title: g.title, src: "", poster: g.poster, category: "Série" }))}
          onPlay={(item) => {
            const g = seriesGroupItems.find((x) => x.id === item.id);
            if (g) setOpenGroup(g);
          }}
          progress={progress}
        />
          <MarathonNote section="Séries" perVideo={COIN_REWARDS["Série"]} bonus={MARATHON_BONUS["Séries"]} />
        </div>
        <div id="musicas">
          <Row title="Músicas" items={musicasPlay} onPlay={(item) => requestPlay(item)} progress={progress} />
          <MarathonNote section="Músicas" perVideo={COIN_REWARDS["Música"]} bonus={MARATHON_BONUS["Músicas"]} />
        </div>
        <div id="louvores">
          <Row title="Louvores" items={louvoresPlay} onPlay={(item) => requestPlay(item)} progress={progress} />
          <MarathonNote section="Louvores" perVideo={COIN_REWARDS["Louvor"]} bonus={MARATHON_BONUS["Louvores"]} />
        </div>

      </div>



      {openGroup && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur flex items-center justify-center p-4" onClick={() => setOpenGroup(null)}>
          <div className="bg-zinc-900 rounded-xl max-w-3xl w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenGroup(null)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" title="Fechar">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-5">
              {openGroup.poster && <img loading="lazy" decoding="async" src={openGroup.poster} alt={openGroup.title} className="w-20 h-20 rounded-lg object-cover" />}
              <div>
                <h3 className="text-2xl font-extrabold text-white">{openGroup.title}</h3>
                <p className="text-zinc-400 text-sm">{openGroup.videos.length} episódios</p>
              </div>
            </div>
            <div>

            {(() => {
              // Group videos by optional "section" to render sub-folders
              const sectionsMap = new Map<string, typeof openGroup.videos>();
              openGroup.videos.forEach((v) => {
                const key = (v as any).section || "";
                if (!sectionsMap.has(key)) sectionsMap.set(key, [] as any);
                sectionsMap.get(key)!.push(v);
              });
              const sectionEntries = Array.from(sectionsMap.entries());
              return sectionEntries.map(([sectionName, vids]) => (
                <div key={sectionName || "_root"} className="mb-5">
                  {sectionName && (
                    <h4 className="text-amber-300 font-display font-extrabold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                      📁 <span>{sectionName}</span>
                      <span className="text-zinc-500 text-xs font-normal">({vids.length})</span>
                    </h4>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {vids.map((v, idx) => {
                      const p = progress[v.id];
                      const pct = p && p.d > 0 ? Math.min(100, Math.round((p.t / p.d) * 100)) : 0;
                      const next = vids[idx + 1];
                      return (
                        <button key={v.id} onClick={() => { const gid = openGroup.id; setOpenGroup(null); requestPlay(v, gid); }} className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 hover:ring-2 hover:ring-white transition">
                          {v.poster ? <img loading="lazy" decoding="async" src={v.poster} alt={v.title} className="w-full h-full object-cover" /> : <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center"><Play className="w-10 h-10 text-white/40" /></div>}
                          
                          {next && (
                            <span title={`Em seguida: ${next.title}`} className="absolute top-1 left-1 z-20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/95 text-white text-[10px] font-bold shadow-lg">
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
              ));
            })()}

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
          <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center">
            {(playInfo?.kind === "mp4" || playSrc) && (
              <ColonialVideoFrame>
                {playInfo?.kind === "mp4" ? (
                  <video
                    key={playing.id}
                    src={playSrc}
                    className="w-full h-full bg-black object-contain"
                    controls
                    controlsList="nodownload noremoteplayback noplaybackrate"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
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
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={playing.title}
                    onError={() => setPlayError(true)}
                  />
                ) : null}
              </ColonialVideoFrame>
            )}

            <VideoActionsColumn videoId={`lemosplay:${playing.id}`} />
            
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

          {/* Sugestões abaixo do player removidas a pedido do usuário. */}
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
