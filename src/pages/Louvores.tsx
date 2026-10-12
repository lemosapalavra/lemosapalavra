import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import LemosPlayAdminPanel from "@/components/LemosPlayAdminPanel";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ColonialVideoFrame from "@/components/ColonialVideoFrame";
import { normalizeVideo } from "@/lib/videoEmbed";
import VideoSideActions from "@/components/VideoSideActions";
import PageHeader from "@/components/PageHeader";
import { awardOnce } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import { loadConfig, type PlayEntry } from "@/data/lemosPlayConfig";
import { getListenEntries } from "@/data/listenCatalog";
import { markSeen } from "@/lib/newContent";
import { louvoresTitles } from "@/data/contentIndex";
import oucaIcon from "@/assets/home/ouca.png.asset.json";

function ListenRow({ title, items, onPlay }: { title: string; items: PlayEntry[]; onPlay: (item: PlayEntry) => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  return <section className="mb-8 group/row">
    <h2 className="px-4 sm:px-12 text-white text-xl sm:text-2xl font-bold mb-3">{title}</h2>
    <div className="relative">
      <button type="button" aria-label="Anterior" onClick={() => scroller.current?.scrollBy({ left: -500, behavior: "smooth" })} className="absolute left-0 top-0 bottom-0 z-10 w-9 bg-black/50 text-white opacity-0 group-hover/row:opacity-100 focus:opacity-100"><ChevronLeft className="mx-auto" /></button>
      <div ref={scroller} className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth px-4 sm:px-12 pb-4" style={{ scrollbarWidth: "none" }}>
        {items.map(item => <button type="button" key={item.id} onClick={() => onPlay(item)} className="group/card relative shrink-0 w-[140px] sm:w-[180px] aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 hover:ring-2 hover:ring-white transition-all">
          {item.poster ? <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" /> : <Play className="m-auto h-full text-white" />}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-12 text-left"><span className="text-white text-xs font-bold line-clamp-2">{item.title}</span></div>
        </button>)}
      </div>
      <button type="button" aria-label="Próximo" onClick={() => scroller.current?.scrollBy({ left: 500, behavior: "smooth" })} className="absolute right-0 top-0 bottom-0 z-10 w-9 bg-black/50 text-white opacity-0 group-hover/row:opacity-100 focus:opacity-100"><ChevronRight className="mx-auto" /></button>
    </div>
    {!items.length && <p className="text-zinc-400 px-4 sm:px-12">Nenhum conteúdo ativo.</p>}
  </section>;
}

export default function Louvores() {
  const isAdmin = useIsAdmin();
  const [adminOpen, setAdminOpen] = useState(false);
  const [playing, setPlaying] = useState<PlayEntry | null>(null);

  const [config, setConfig] = useState(() => loadConfig());

  useEffect(() => { markSeen("louvores", louvoresTitles); }, []);
  useEffect(() => {
    const sync = () => setConfig(loadConfig());
    window.addEventListener("lemos_play_config_change", sync);
    return () => window.removeEventListener("lemos_play_config_change", sync);
  }, []);

  const musicas = getListenEntries(config, "musicas");
  const louvores = getListenEntries(config, "louvores");
  const featured = [...musicas, ...louvores].find((entry) => entry.poster) ?? musicas[0] ?? louvores[0];
  const [playingCategory, setPlayingCategory] = useState<"musicas" | "louvores">("musicas");
  const playItem = (item: PlayEntry, category: "musicas" | "louvores") => {
    setPlayingCategory(category);
    setPlaying(item);
    awardOnce(`ouca:${item.id}`, category === "louvores" ? COINS.louvor : COINS.musica, `Você assistiu "${item.title}"`);
  };

  if (playing) {
    const media = normalizeVideo(playing.src || "", true);
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setPlaying(null)}
          className="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white transition"
          title="Voltar"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <VideoSideActions videoId={`ouca:${playing.id}`} />
        {playing.src ? (
          <ColonialVideoFrame variant={playingCategory === "louvores" ? "silver" : "green"} aspect="9/16">{media.kind === "mp4" ? <video src={playing.src} poster={playing.poster} className="w-full h-full bg-black object-contain" controls controlsList="nodownload noremoteplayback noplaybackrate" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} autoPlay playsInline preload="auto" /> : <iframe src={media.embedUrl} title={playing.title} className="w-full h-full bg-black" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />}</ColonialVideoFrame>
        ) : (
          <div className="max-w-md mx-auto text-center text-white p-6">
            <h2 className="font-display text-3xl font-bold mb-3">Vídeo em atualização</h2>
            <p className="text-white/80">O link antigo estava quebrado e foi removido para não exibir erro 404.</p>
          </div>
        )}
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-black text-white py-4">
      <div className="w-full mx-auto">
        <PageHeader title="Ouça" subtitle="Músicas e louvores" icon={oucaIcon.url} />

        {isAdmin && <button type="button" onClick={() => setAdminOpen(true)} title="Configurar Ouça" className="fixed top-3 right-3 z-40 w-11 h-11 rounded-full bg-zinc-900 text-white shadow-xl flex items-center justify-center"><Settings className="w-5 h-5" /></button>}
        {featured && <section className="relative mt-4 min-h-[320px] sm:min-h-[430px] rounded-xl overflow-hidden bg-black text-white">
          {featured.poster && <img src={featured.poster} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="relative min-h-[320px] sm:min-h-[430px] flex flex-col justify-center items-start p-6 sm:p-12 max-w-xl">
            <span className="uppercase tracking-widest text-amber-300 font-bold text-xs">✨ Em destaque · Músicas e Louvores</span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold my-4">{featured.title}</h2>
            <button type="button" onClick={() => playItem(featured, musicas.some((x) => x.id === featured.id) ? "musicas" : "louvores")} className="flex items-center gap-2 rounded bg-white text-black font-bold px-5 py-3"><Play className="w-5 h-5" /> Reproduzir agora</button>
          </div>
        </section>}
        <ListenRow title="Músicas" items={musicas} onPlay={(item) => playItem(item, "musicas")} />
        <ListenRow title="Louvores" items={louvores} onPlay={(item) => playItem(item, "louvores")} />

        <div className="text-center mt-6 space-y-2 max-w-2xl mx-auto">
          <p className="font-display text-2xl font-bold text-primary">Convido você!</p>
          <p className="font-body text-sm text-foreground">A acompanhar e compartilhar este projeto, assim você se torna parte desta missão.</p>
          <p className="font-display text-base italic text-primary">"Porque a Palavra de Deus é viva e eficaz." (Hebreus 4:12)</p>
          <p className="font-display text-lg font-bold text-foreground">Acreditem! Tenham fé na Palavra.</p>
        </div>

      </div>
      <LemosPlayAdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} initialTab="musicas" listenOnly />
    </div>
  );
}
