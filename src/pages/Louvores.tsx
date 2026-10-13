import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Play } from "lucide-react";
import ColonialVideoFrame from "@/components/ColonialVideoFrame";
import { normalizeVideo } from "@/lib/videoEmbed";
import VideoSideActions from "@/components/VideoSideActions";
import PageHeader from "@/components/PageHeader";
import CoinBadge from "@/components/CoinBadge";
import { awardOnce } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import { loadConfig, type PlayEntry } from "@/data/lemosPlayConfig";
import { getListenEntries, type ListenCategory } from "@/data/listenCatalog";
import { markSeen } from "@/lib/newContent";
import { louvoresTitles } from "@/data/contentIndex";

export default function Louvores() {
  const [playing, setPlaying] = useState<PlayEntry | null>(null);
  const [playingCategory, setPlayingCategory] = useState<ListenCategory>("musicas");
  const [config, setConfig] = useState(() => loadConfig());

  useEffect(() => { markSeen("louvores", louvoresTitles); }, []);
  useEffect(() => {
    const sync = () => setConfig(loadConfig());
    window.addEventListener("lemos_play_config_change", sync);
    return () => window.removeEventListener("lemos_play_config_change", sync);
  }, []);

  const musicas = useMemo(() => getListenEntries(config, "musicas"), [config]);
  const louvores = useMemo(() => getListenEntries(config, "louvores"), [config]);
  const openVideo = (item: PlayEntry, category: ListenCategory) => {
    setPlayingCategory(category);
    setPlaying(item);
    awardOnce(`ouca:${item.id}`, category === "louvores" ? COINS.louvor : COINS.musica, `Você assistiu "${item.title}"`);
  };
  const featured = useMemo(() => config.musicas.find(item => item.title.toLocaleLowerCase("pt-BR").includes("ele é o meu irmão") && item.enabled !== false), [config]);

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




  const renderSection = (title: string, items: PlayEntry[], category: ListenCategory) => (
    <section className="mb-9" aria-label={title}>
      <h2 className="text-xl sm:text-3xl font-extrabold px-5 sm:px-12 mb-4">{title}</h2>
      {items.length ? (
        <div className="flex gap-3 sm:gap-5 overflow-x-auto px-5 sm:px-12 pb-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map(item => (
            <div key={item.id} className="shrink-0 w-[148px] sm:w-[195px] rounded-xl bg-zinc-900/80 p-2 hover:bg-zinc-800 transition">
              <button onClick={() => openVideo(item, category)} className="w-full text-left group">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-800 relative">
                  {item.poster ? <img src={item.poster} alt="" loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform" /> : <Play className="absolute inset-0 m-auto h-12 w-12 text-amber-300" />}
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition"><Play className="w-10 h-10 text-white fill-white" /></span>
                </div>
                <span className="block mt-2 text-sm font-semibold text-white line-clamp-2 min-h-[2.5rem]">{item.title}</span>
              </button>
              <CoinBadge amount={category === "louvores" ? COINS.louvor : COINS.musica} size="xs" />
            </div>
          ))}
        </div>
      ) : <p className="text-zinc-300 px-5 sm:px-12 py-4">Nenhum conteúdo ativo nesta categoria.</p>}
    </section>
  );

  return (
    <div className="lemos-media-page min-h-screen bg-black text-white">
      <style>{`html:has(.lemos-media-page), body:has(.lemos-media-page) { scrollbar-width: none; } html:has(.lemos-media-page)::-webkit-scrollbar, body:has(.lemos-media-page)::-webkit-scrollbar { display: none; width: 0; }`}</style>
      <PageHeader title="Ouça" subtitle="Músicas e Louvores" />
      <section className="relative min-h-[300px] sm:min-h-[430px] flex items-center overflow-hidden bg-gradient-to-br from-amber-950 via-zinc-900 to-black">
        {featured?.src && <div className="absolute inset-0"><video key={featured.id} src={featured.src} poster={featured.poster} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover opacity-65" /><div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/10" /></div>}

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-12 py-10">
          <p className="text-amber-300 font-bold tracking-widest uppercase text-xs mb-2">Lemos a Palavra</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl mb-3">OUÇA</h1>
          
          {featured && <p className="mb-4 text-amber-300 text-sm font-bold">Em destaque: {featured.title}</p>}

        </div>
      </section>
      <main className="max-w-7xl mx-auto py-7 sm:py-10">
        {renderSection("Músicas", musicas, "musicas")}
        {renderSection("Louvores", louvores, "louvores")}
      </main>
    </div>
  );
}
