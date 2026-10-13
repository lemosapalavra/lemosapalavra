import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Play } from "lucide-react";
import ColonialVideoFrame from "@/components/ColonialVideoFrame";
import { normalizeVideo } from "@/lib/videoEmbed";
import VideoSideActions from "@/components/VideoSideActions";
import PageHeader from "@/components/PageHeader";
import CoinBadge from "@/components/CoinBadge";
import { awardOnce } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import iconLouvoresCat from "@/assets/icon-louvores-cat.png";
import iconMusicais from "@/assets/icon-musicais.png";
import logoCentral from "@/assets/logo-central.png";
import { loadConfig, type PlayEntry } from "@/data/lemosPlayConfig";
import { getListenEntries, type ListenCategory } from "@/data/listenCatalog";
import { markSeen } from "@/lib/newContent";
import { louvoresTitles } from "@/data/contentIndex";
import oucaIcon from "@/assets/home/ouca.png.asset.json";

const tabs: { id: ListenCategory; label: string; icon: string }[] = [
  { id: "musicas", label: "Músicas", icon: iconMusicais },
  { id: "louvores", label: "Louvores", icon: iconLouvoresCat },
];

export default function Louvores() {
  const [playing, setPlaying] = useState<PlayEntry | null>(null);
  const [tab, setTab] = useState<ListenCategory>("musicas");
  const [config, setConfig] = useState(() => loadConfig());

  useEffect(() => { markSeen("louvores", louvoresTitles); }, []);
  useEffect(() => {
    const sync = () => setConfig(loadConfig());
    window.addEventListener("lemos_play_config_change", sync);
    return () => window.removeEventListener("lemos_play_config_change", sync);
  }, []);

  const entries = useMemo(() => getListenEntries(config, tab), [config, tab]);

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
          <ColonialVideoFrame variant={tab === "louvores" ? "silver" : "green"} aspect="9/16">{media.kind === "mp4" ? <video src={playing.src} poster={playing.poster} className="w-full h-full bg-black object-contain" controls controlsList="nodownload noremoteplayback noplaybackrate" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} autoPlay playsInline preload="auto" /> : <iframe src={media.embedUrl} title={playing.title} className="w-full h-full bg-black" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />}</ColonialVideoFrame>
        ) : (
          <div className="max-w-md mx-auto text-center text-white p-6">
            <h2 className="font-display text-3xl font-bold mb-3">Vídeo em atualização</h2>
            <p className="text-white/80">O link antigo estava quebrado e foi removido para não exibir erro 404.</p>
          </div>
        )}
      </div>
    );
  }




  const renderItem = (item: PlayEntry) => (
    <button
      key={item.id}
      onClick={() => { setPlaying(item); awardOnce(`ouca:${item.id}`, tab === "louvores" ? COINS.louvor : COINS.musica, `Você assistiu "${item.title}"`); }}
      className="flex flex-col items-center gap-2 hover:scale-105 transition-transform group"
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg bg-black">
        {item.poster ? <img src={item.poster} alt={item.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" /> : <Play className="absolute inset-0 m-auto h-10 w-10 text-primary-foreground" />}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>
      <p className="text-xs sm:text-sm font-bold text-primary text-center leading-tight drop-shadow max-w-[120px]">
        {item.title}
      </p>
      <CoinBadge amount={tab === "louvores" ? COINS.louvor : COINS.musica} size="xs" />
    </button>
  );



  return (
    <div className="lemos-media-page min-h-screen bg-black text-white">
      <style>{`html:has(.lemos-media-page), body:has(.lemos-media-page) { scrollbar-width: none; } html:has(.lemos-media-page)::-webkit-scrollbar, body:has(.lemos-media-page)::-webkit-scrollbar { display: none; width: 0; }`}</style>
      <PageHeader title="Ouça" subtitle="Músicas e Louvores" />
      <section className="relative min-h-[260px] sm:min-h-[370px] flex items-center overflow-hidden bg-gradient-to-br from-amber-950 via-zinc-900 to-black">
        <img src="/ouca-flutuante.png" alt="" className="absolute right-[4%] top-1/2 -translate-y-1/2 w-40 sm:w-64 opacity-45 drop-shadow-2xl pointer-events-none" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-12 py-10">
          <p className="text-amber-300 font-bold tracking-widest uppercase text-xs mb-2">Lemos a Palavra</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl mb-3">OUÇA</h1>
          <p className="text-zinc-200 max-w-md text-sm sm:text-lg mb-5">Músicas e louvores para inspirar a fé e alegrar o coração.</p>
          <div className="flex flex-wrap gap-3">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} aria-pressed={tab === t.id}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-bold transition ${tab === t.id ? "bg-white text-black" : "bg-white/15 text-white hover:bg-white/25"}`}>
                <img src={t.icon} alt="" className="h-8 w-8 rounded-full object-cover" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <main className="max-w-7xl mx-auto py-7 sm:py-10">
        <h2 className="text-xl sm:text-3xl font-extrabold px-5 sm:px-12 mb-4">{tab === "musicas" ? "Músicas" : "Louvores"}</h2>
        {entries.length ? (
          <div className="flex gap-3 sm:gap-5 overflow-x-auto px-5 sm:px-12 pb-8 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {entries.map(item => (
              <div key={item.id} className="shrink-0 w-[148px] sm:w-[195px] rounded-xl bg-zinc-900/80 p-2 hover:bg-zinc-800 transition">
                <button onClick={() => { setPlaying(item); awardOnce(`ouca:${item.id}`, tab === "louvores" ? COINS.louvor : COINS.musica, `Você assistiu "${item.title}"`); }}
                  className="w-full text-left group">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-800 relative">
                    {item.poster ? <img src={item.poster} alt="" loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform" /> : <Play className="absolute inset-0 m-auto h-12 w-12 text-amber-300" />}
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition"><Play className="w-10 h-10 text-white fill-white" /></span>
                  </div>
                  <span className="block mt-2 text-sm font-semibold text-white line-clamp-2 min-h-[2.5rem]">{item.title}</span>
                </button>
                <CoinBadge amount={tab === "louvores" ? COINS.louvor : COINS.musica} size="xs" />
              </div>
            ))}
          </div>
        ) : <p className="text-zinc-300 px-5 sm:px-12 py-8">Nenhum conteúdo ativo nesta categoria.</p>}
      </main>
    </div>
  );
}
