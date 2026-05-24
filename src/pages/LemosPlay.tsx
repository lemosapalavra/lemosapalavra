import { useState, useEffect, useRef, useMemo } from "react";
import { Play, Info, ChevronLeft, ChevronRight, X } from "lucide-react";
import { seriesVideos, filmesVideos, seriesGroups, type BibleVideo } from "@/data/bibleVideos";
import lemosPlayLogo from "@/assets/lemos-play-logo.png";
import PageHeader from "@/components/PageHeader";

const EMBED = (lib: string, id: string, autoplay = false) =>
  `https://iframe.mediadelivery.net/embed/${lib}/${id}?autoplay=${autoplay}&preload=true&muted=${!autoplay}`;

interface PlayItem {
  id: string;
  title: string;
  src: string;
  thumb?: string;
  poster?: string;
  category: string;
}

const louvoresPlay: PlayItem[] = [
  { id: "lv1", title: "Espírito Santo", src: EMBED("660653", "ed00cfd9-9b30-4803-bf53-8070ec0b5be9", true), thumb: EMBED("660653", "ed00cfd9-9b30-4803-bf53-8070ec0b5be9"), category: "Louvor" },
  { id: "lv2", title: "Sou Fiel", src: EMBED("660653", "2336364c-8169-4926-ac1a-1fc6baa6a0c5", true), thumb: EMBED("660653", "2336364c-8169-4926-ac1a-1fc6baa6a0c5"), category: "Louvor" },
  { id: "lv3", title: "Graça Aleluia", src: EMBED("660653", "ae17b103-e921-4ebb-bb23-2ae690c2e5a5", true), thumb: EMBED("660653", "ae17b103-e921-4ebb-bb23-2ae690c2e5a5"), category: "Louvor" },
  { id: "lv4", title: "Palavra Eterna", src: EMBED("660653", "49bd5ac8-4537-45f6-9b25-d8af4da7d099", true), thumb: EMBED("660653", "49bd5ac8-4537-45f6-9b25-d8af4da7d099"), category: "Louvor" },
  { id: "lv5", title: "Do meu Jeito", src: EMBED("660719", "6400db8d-69e9-4b99-8c19-9a512f714662", true), thumb: EMBED("660719", "6400db8d-69e9-4b99-8c19-9a512f714662"), category: "Louvor" },
  { id: "lv6", title: "Pai e Filho", src: EMBED("660719", "c1358bec-0118-4db8-8b34-8dce8c765fe2", true), thumb: EMBED("660719", "c1358bec-0118-4db8-8b34-8dce8c765fe2"), category: "Louvor" },
  { id: "lv7", title: "Um de Nós", src: EMBED("660719", "4a4cfdb3-e26c-4dc9-9363-f045feca99be", true), thumb: EMBED("660719", "4a4cfdb3-e26c-4dc9-9363-f045feca99be"), category: "Louvor" },
];

const toPlay = (v: BibleVideo, category: string, prefix: string, i: number): PlayItem => ({
  id: `${prefix}${i}`,
  title: v.title,
  src: v.src,
  poster: v.icon,
  category,
});

const filmesPlay = filmesVideos.map((v, i) => toPlay(v, "Filme", "f", i));
const seriesPlay = seriesVideos.map((v, i) => toPlay(v, "Série", "s", i));

const PROGRESS_KEY = "lemosplay:progress";

type ProgressMap = Record<string, { t: number; d: number; updated: number }>;

const loadProgress = (): ProgressMap => {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); } catch { return {}; }
};
const saveProgress = (p: ProgressMap) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));

function Row({ title, items, onPlay, progress }: { title: string; items: PlayItem[]; onPlay: (item: PlayItem) => void; progress: ProgressMap }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <section className="mb-8 group/row">
      <h2 className="text-white font-bold text-lg sm:text-2xl mb-3 px-4 sm:px-12">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scrollBy(-600)}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center text-white hover:bg-black/80"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div
          ref={scrollerRef}
          className="flex gap-2 overflow-x-auto scroll-smooth px-4 sm:px-12 pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((item) => {
            const p = progress[item.id];
            const pct = p && p.d > 0 ? Math.min(100, Math.round((p.t / p.d) * 100)) : 0;
            return (
              <button
                key={item.id}
                onClick={() => onPlay(item)}
                className="relative shrink-0 w-[200px] sm:w-[280px] aspect-video rounded overflow-hidden bg-zinc-900 hover:scale-105 hover:z-10 hover:ring-2 hover:ring-white transition-all duration-200 group/card"
              >
                {item.poster ? (
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                ) : item.thumb ? (
                  <iframe
                    src={item.thumb}
                    className="absolute inset-0 w-full h-full pointer-events-none scale-150"
                    tabIndex={-1}
                    aria-hidden
                    title={item.title}
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pb-4">
                  <p className="text-white font-bold text-sm text-left line-clamp-1">{item.title}</p>
                  <p className="text-zinc-300 text-xs text-left">{item.category}</p>
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
        <button
          onClick={() => scrollBy(600)}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center text-white hover:bg-black/80"
          aria-label="Próximo"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
}

const seriesGroupItems = seriesGroups.map((g, i) => ({
  id: `sg${i}`,
  title: g.title,
  poster: g.icon,
  category: "Série",
  videos: g.videos.map((v, j) => toPlay(v, "Série", `sg${i}_`, j)),
}));

const allItems: PlayItem[] = [...filmesPlay, ...seriesPlay, ...louvoresPlay, ...seriesGroupItems.flatMap(g => g.videos)];

export default function LemosPlay() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState<PlayItem | null>(null);
  const [openGroup, setOpenGroup] = useState<(typeof seriesGroupItems)[number] | null>(null);
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build resume URL with start time
  const playSrc = useMemo(() => {
    if (!playing) return "";
    const p = progress[playing.id];
    const start = p && p.d > 0 && p.t > 5 && p.t < p.d - 10 ? Math.floor(p.t) : 0;
    const sep = playing.src.includes("?") ? "&" : "?";
    return start > 0 ? `${playing.src}${sep}t=${start}` : playing.src;
  }, [playing]);

  // Listen to Bunny player.js postMessage events to track progress
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

  // Continue watching: items with progress between 5% and 95%
  const continueItems = useMemo(() => {
    return Object.entries(progress)
      .filter(([, p]) => p.d > 0 && p.t / p.d > 0.02 && p.t / p.d < 0.95)
      .sort((a, b) => b[1].updated - a[1].updated)
      .map(([id]) => allItems.find((x) => x.id === id))
      .filter((x): x is PlayItem => !!x);
  }, [progress]);

  const hero = filmesPlay[0] ?? seriesPlay[0] ?? louvoresPlay[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center justify-between px-4 sm:px-12 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img src={lemosPlayLogo} alt="Lemos Play" className="h-14 sm:h-20 w-auto drop-shadow-xl" />
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-zinc-200">
            <a href="#filmes" className="hover:text-white">Filmes</a>
            <a href="#series" className="hover:text-white">Séries</a>
            <a href="#musicas" className="hover:text-white">Músicas</a>
          </nav>
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
            Histórias bíblicas, filmes e músicas para inspirar e fortalecer a sua fé. Mergulhe na Palavra de uma forma envolvente.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => hero && setPlaying(hero)}
              className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded hover:bg-white/85 transition"
            >
              <Play className="w-5 h-5 fill-black" /> Assistir
            </button>
            <button className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-6 py-2.5 rounded hover:bg-white/30 transition backdrop-blur">
              <Info className="w-5 h-5" /> Mais informações
            </button>
          </div>
        </div>
      </section>

      {/* Rows */}
      <div className="-mt-20 sm:-mt-32 relative z-10 pb-16">
        {continueItems.length > 0 && (
          <Row title="Continuar assistindo" items={continueItems} onPlay={setPlaying} progress={progress} />
        )}
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
        <div id="musicas"><Row title="Músicas" items={louvoresPlay} onPlay={setPlaying} progress={progress} /></div>
      </div>

      <footer className="text-center text-zinc-500 text-xs pb-8 px-4">
        Lemos Play · Conteúdo cristão para toda a família · © Lemos a Palavra
      </footer>

      {/* Group selector modal */}
      {openGroup && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur flex items-center justify-center p-4" onClick={() => setOpenGroup(null)}>
          <div className="bg-zinc-900 rounded-xl max-w-3xl w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenGroup(null)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-5">
              <img src={openGroup.poster} alt={openGroup.title} className="w-20 h-20 rounded-lg object-cover" />
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
                  <button
                    key={v.id}
                    onClick={() => { setPlaying(v); setOpenGroup(null); }}
                    className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800 hover:ring-2 hover:ring-white transition"
                  >
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

      {/* Player */}
      {playing && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setPlaying(null)}
            className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
          <iframe
            ref={iframeRef}
            src={playSrc}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            title={playing.title}
          />
        </div>
      )}
    </div>
  );
}
