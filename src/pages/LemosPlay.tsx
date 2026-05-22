import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info, ChevronLeft, ChevronRight, ArrowLeft, X } from "lucide-react";
import { seriesVideos, filmesVideos, type BibleVideo } from "@/data/bibleVideos";
import logoCentral from "@/assets/logo-central.png";

const EMBED = (lib: string, id: string, autoplay = false) =>
  `https://iframe.mediadelivery.net/embed/${lib}/${id}?autoplay=${autoplay}&preload=true&muted=${!autoplay}`;

interface PlayItem {
  title: string;
  src: string;
  thumb?: string;
  poster?: string;
  category: string;
}

const louvoresPlay: PlayItem[] = [
  { title: "Do meu Jeito", src: EMBED("660719", "6400db8d-69e9-4b99-8c19-9a512f714662", true), thumb: EMBED("660719", "6400db8d-69e9-4b99-8c19-9a512f714662"), category: "Música" },
  { title: "Palavra Eterna", src: EMBED("660653", "49bd5ac8-4537-45f6-9b25-d8af4da7d099", true), thumb: EMBED("660653", "49bd5ac8-4537-45f6-9b25-d8af4da7d099"), category: "Música" },
  { title: "Graça Aleluia", src: EMBED("660653", "ae17b103-e921-4ebb-bb23-2ae690c2e5a5", true), thumb: EMBED("660653", "ae17b103-e921-4ebb-bb23-2ae690c2e5a5"), category: "Música" },
  { title: "Sou Fiel", src: EMBED("660653", "2336364c-8169-4926-ac1a-1fc6baa6a0c5", true), thumb: EMBED("660653", "2336364c-8169-4926-ac1a-1fc6baa6a0c5"), category: "Música" },
  { title: "Espírito Santo", src: EMBED("660653", "ed00cfd9-9b30-4803-bf53-8070ec0b5be9", true), thumb: EMBED("660653", "ed00cfd9-9b30-4803-bf53-8070ec0b5be9"), category: "Música" },
  { title: "Pai e Filho", src: EMBED("660719", "c1358bec-0118-4db8-8b34-8dce8c765fe2", true), thumb: EMBED("660719", "c1358bec-0118-4db8-8b34-8dce8c765fe2"), category: "Música" },
  { title: "Um de Nós", src: EMBED("660719", "4a4cfdb3-e26c-4dc9-9363-f045feca99be", true), thumb: EMBED("660719", "4a4cfdb3-e26c-4dc9-9363-f045feca99be"), category: "Música" },
];

const toPlay = (v: BibleVideo, category: string): PlayItem => ({
  title: v.title,
  src: v.src,
  poster: v.icon,
  category,
});

const filmesPlay = filmesVideos.map((v) => toPlay(v, "Filme"));
const seriesPlay = seriesVideos.map((v) => toPlay(v, "Série"));

function Row({ title, items, onPlay }: { title: string; items: PlayItem[]; onPlay: (item: PlayItem) => void }) {
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
          {items.map((item, i) => (
            <button
              key={i}
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
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <p className="text-white font-bold text-sm text-left">{item.title}</p>
                <p className="text-zinc-300 text-xs text-left">{item.category}</p>
              </div>
            </button>
          ))}
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

export default function LemosPlay() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState<PlayItem | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const hero = useMemo(() => filmesPlay[0] ?? seriesPlay[0] ?? louvoresPlay[0], []);

  useEffect(() => {
    if (playing && playerRef.current) {
      const el = playerRef.current as any;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      req?.call(el).catch(() => {});
    }
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, [playing]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center justify-between px-4 sm:px-12 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <img src={logoCentral} alt="Lemos a Palavra" className="w-10 h-10 rounded-full" />
              <span className="font-display text-xl sm:text-3xl font-extrabold tracking-tight" style={{ color: "#e50914" }}>
                LemosPlay
              </span>
            </div>
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
        <div id="filmes"><Row title="Filmes Bíblicos" items={filmesPlay} onPlay={setPlaying} /></div>
        <div id="series"><Row title="Séries Bíblicas" items={seriesPlay} onPlay={setPlaying} /></div>
        <div id="musicas"><Row title="Músicas" items={louvoresPlay} onPlay={setPlaying} /></div>
      </div>

      <footer className="text-center text-zinc-500 text-xs pb-8 px-4">
        LemosPlay · Conteúdo cristão para toda a família · © Lemos a Palavra
      </footer>

      {/* Player */}
      {playing && (
        <div ref={playerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setPlaying(null)}
            className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
          <iframe
            src={playing.src}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title={playing.title}
          />
        </div>
      )}
    </div>
  );
}
