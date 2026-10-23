import { useState, useEffect, useMemo } from "react";
import { Play, Lock, LockOpen } from "lucide-react";
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
import { HIDDEN_VIDEOS, unlockHiddenVideos, lockHiddenVideos } from "@/data/hiddenVideos";

export default function Louvores() {
  const [playing, setPlaying] = useState<PlayEntry | null>(null);
  useEffect(() => {
    document.body.classList.toggle("lemos-video-playing", Boolean(playing));
    return () => document.body.classList.remove("lemos-video-playing");
  }, [playing]);
  const [viewed, setViewed] = useState<Record<string, boolean>>(() => { try { return JSON.parse(localStorage.getItem("lemos_media_viewed") || "{}"); } catch { return {}; } });
  const [playingCategory, setPlayingCategory] = useState<ListenCategory>("musicas");
  const [config, setConfig] = useState(() => loadConfig());
  const [hiddenUnlocked, setHiddenUnlocked] = useState(false);
  const [askingPassword, setAskingPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [pendingHidden, setPendingHidden] = useState<string | null>(null);

  useEffect(() => { markSeen("louvores", louvoresTitles); lockHiddenVideos(); }, []);
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
    setViewed(prev => { const next = { ...prev, [`ouca:${item.id}`]: true }; localStorage.setItem("lemos_media_viewed", JSON.stringify(next)); return next; });
    awardOnce(`ouca:${item.id}`, category === "louvores" ? COINS.louvor : COINS.musica, `Você assistiu "${item.title}"`);
  };
  const featured = useMemo(() => config.musicas.find(item => item.title.toLocaleLowerCase("pt-BR").includes("ele é o meu irmão") && item.enabled !== false), [config]);

  if (playing) {
    const media = normalizeVideo(playing.src || "", true);
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <VideoSideActions videoId={`ouca:${playing.id}`} />
        {playing.src ? (
          <ColonialVideoFrame variant={playingCategory === "louvores" ? "silver" : "green"} aspect="9/16">{media.kind === "mp4" ? <video src={playing.src} poster={playing.poster} className="w-full h-full bg-black object-contain" controls controlsList="nodownload noremoteplayback noplaybackrate" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} autoPlay playsInline preload="metadata" /> : <iframe src={media.embedUrl} title={playing.title} className="w-full h-full bg-black" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />}</ColonialVideoFrame>
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
                  {item.poster ? <img src={item.poster} alt="" loading="lazy" className={`h-full w-full object-cover group-hover:scale-105 transition-transform ${viewed[`ouca:${item.id}`] ? "grayscale" : ""}`} /> : <Play className="absolute inset-0 m-auto h-12 w-12 text-amber-300" />}
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

  const tryUnlock = () => {
    if (unlockHiddenVideos(password)) {
      setHiddenUnlocked(true);
      setAskingPassword(false);
      setPassword("");
      setPasswordError(false);
      if (pendingHidden) {
        const video = HIDDEN_VIDEOS.find(v => v.id === pendingHidden);
        setPendingHidden(null);
        if (video) openHiddenVideo(video);
      }
    } else {
      setPasswordError(true);
    }
  };

  const openHiddenVideo = (video: (typeof HIDDEN_VIDEOS)[number]) => {
    setPlayingCategory("musicas");
    setPlaying({ id: `oculto:${video.id}`, title: video.title, src: video.src, poster: video.poster } as PlayEntry);
    // A autorização vale somente para esta reprodução. Todos os vídeos
    // voltam a ficar bloqueados, inclusive se o usuário sair antes do fim.
    lockHiddenVideos();
    setHiddenUnlocked(false);
  };

  const handleHiddenClick = (video: (typeof HIDDEN_VIDEOS)[number]) => {
    if (hiddenUnlocked) {
      openHiddenVideo(video);
    } else {
      setPendingHidden(video.id);
      setPassword("");
      setPasswordError(false);
      setAskingPassword(true);
    }
  };

  const renderHiddenSection = () => (
    <section className="mb-9" aria-label="Vídeos ocultos">
      <h2 className="text-xl sm:text-3xl font-extrabold px-5 sm:px-12 mb-4 flex items-center gap-2">
        Vídeos ocultos
        {hiddenUnlocked ? (
          <button onClick={() => { lockHiddenVideos(); setHiddenUnlocked(false); }} title="Bloquear novamente" className="text-amber-300 hover:text-amber-200 transition"><LockOpen className="w-5 h-5" /></button>
        ) : (
          <Lock className="w-5 h-5 text-amber-300" />
        )}
      </h2>
      <div className="flex gap-3 sm:gap-5 overflow-x-auto px-5 sm:px-12 pb-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {HIDDEN_VIDEOS.map(video => (
          <div key={video.id} className="shrink-0 w-[148px] sm:w-[195px] rounded-xl bg-zinc-900/80 p-2 hover:bg-zinc-800 transition">
            <button onClick={() => handleHiddenClick(video)} className="w-full text-left group">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-zinc-800 relative">
                <img src={video.poster} alt="" loading="lazy" className={`h-full w-full object-cover transition-transform ${hiddenUnlocked ? "group-hover:scale-105" : "grayscale"}`} />
                {!hiddenUnlocked && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40">
                    <Lock className="w-8 h-8 text-amber-300" />
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide">Senha mestra</span>
                  </span>
                )}
                {hiddenUnlocked && <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition"><Play className="w-10 h-10 text-white fill-white" /></span>}
              </div>
              <span className="block mt-2 text-sm font-semibold text-white line-clamp-2 min-h-[2.5rem]">{video.title}</span>
            </button>
          </div>
        ))}
      </div>
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
        {renderHiddenSection()}
      </main>
      {askingPassword && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setAskingPassword(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 p-6 shadow-xl border border-amber-300/30" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-6 h-6 text-amber-300" />
              <h3 className="font-display text-xl font-bold">Vídeos ocultos</h3>
            </div>
            <p className="text-sm text-zinc-300 mb-4">Digite a senha mestra para assistir a estes vídeos.</p>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={password}
              onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
              onKeyDown={e => { if (e.key === "Enter") tryUnlock(); }}
              placeholder="Senha mestra"
              className={`w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none border ${passwordError ? "border-red-500" : "border-zinc-700 focus:border-amber-300"}`}
            />
            {passwordError && <p className="mt-2 text-sm text-red-400 font-semibold">Senha incorreta. Tente novamente.</p>}
            <div className="mt-4 flex gap-2">
              <button onClick={tryUnlock} className="flex-1 rounded-full bg-amber-300 px-5 py-2.5 font-bold text-zinc-900 hover:bg-amber-200 transition">Desbloquear</button>
              <button onClick={() => setAskingPassword(false)} className="rounded-full bg-zinc-700 px-5 py-2.5 font-bold text-white hover:bg-zinc-600 transition">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
