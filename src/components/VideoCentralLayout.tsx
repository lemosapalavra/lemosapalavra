import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ColonialVideoFrame from "@/components/ColonialVideoFrame";
import VideoSideActions from "@/components/VideoSideActions";
import logoCentral from "@/assets/logo-central.png";
import type { BibleVideo } from "@/data/bibleVideos";

interface Props {
  title: string;
  subtitle?: string;
  videos: BibleVideo[];
}

export default function VideoCentralLayout({ title, subtitle, videos }: Props) {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState<BibleVideo | null>(null);
  const [viewed, setViewed] = useState<Record<string, boolean>>(() => { try { return JSON.parse(localStorage.getItem("lemos_media_viewed") || "{}"); } catch { return {}; } });
  const [promptVideo, setPromptVideo] = useState<BibleVideo | null>(null);
  const [resumeTimes, setResumeTimes] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem("lemos_video_positions") || "{}"); } catch { return {}; }
  });
  const playerRef = useRef<HTMLVideoElement>(null);
  const videoKey = (video: BibleVideo) => `central:${video.title}`;
  const startVideo = (video: BibleVideo, resume = false) => {
    setPromptVideo(null);
    setPlaying(video);
    setViewed(prev => {
      const next = { ...prev, [videoKey(video)]: true };
      localStorage.setItem("lemos_media_viewed", JSON.stringify(next));
      return next;
    });
    if (!resume) {
      setResumeTimes(prev => {
        const next = { ...prev, [videoKey(video)]: 0 };
        localStorage.setItem("lemos_video_positions", JSON.stringify(next));
        return next;
      });
    }
  };
  const openVideo = (video: BibleVideo) => {
    if (viewed[videoKey(video)]) setPromptVideo(video);
    else startVideo(video);
  };
  const savePosition = () => {
    if (!playing || !playerRef.current) return;
    const time = playerRef.current.currentTime;
    if (!Number.isFinite(time)) return;
    setResumeTimes(prev => {
      const next = { ...prev, [videoKey(playing)]: time };
      localStorage.setItem("lemos_video_positions", JSON.stringify(next));
      return next;
    });
  };
  const shareVideo = async (video: BibleVideo) => {
    const url = video.src.startsWith("http") ? video.src : new URL(video.src, window.location.origin).href;
    try {
      if (navigator.share) await navigator.share({ title: video.title, url });
      else { await navigator.clipboard.writeText(url); toast({ title: "Link do vídeo copiado!" }); }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") toast({ title: "Não foi possível compartilhar", variant: "destructive" });
    }
  };

  if (playing) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <ColonialVideoFrame>
          <video
            ref={playerRef}
            key={playing.src}
            src={playing.src}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
            onLoadedMetadata={(event) => {
              const saved = resumeTimes[videoKey(playing)] || 0;
              if (saved > 0 && saved < event.currentTarget.duration - 2) event.currentTarget.currentTime = saved;
            }}
            onTimeUpdate={(event) => {
              const time = event.currentTarget.currentTime;
              if (Math.floor(time) % 5 === 0) {
                localStorage.setItem("lemos_video_positions", JSON.stringify({ ...resumeTimes, [videoKey(playing)]: time }));
              }
            }}
            onPause={savePosition}
            onEnded={() => {
              setResumeTimes(prev => {
                const next = { ...prev, [videoKey(playing)]: 0 };
                localStorage.setItem("lemos_video_positions", JSON.stringify(next));
                return next;
              });
            }}
          />
        </ColonialVideoFrame>
        <VideoSideActions videoId={`central:${playing.title}`} />
      </div>
    );
  }

  const mid = Math.ceil(videos.length / 2);
  const left = videos.slice(0, mid);
  const right = videos.slice(mid);

  const renderItem = (v: BibleVideo, i: number) => (
    <button
      key={i}
      onClick={() => openVideo(v)}
      className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
    >
      <img
        src={v.icon}
        alt={v.title}
        loading="lazy"
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-amber-400 shadow-[0_6px_18px_rgba(0,0,0,.55)] bg-white object-cover ${viewed[`central:${v.title}`] ? "grayscale brightness-125 opacity-75" : ""}`}
      />
      <p className="text-[11px] sm:text-xs font-bold text-primary text-center leading-tight max-w-[110px] drop-shadow">
        {v.title}
      </p>
    </button>
  );

  return (
    <>
    {promptVideo && (
      <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Vídeo já assistido">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl space-y-4">
          <h2 className="text-xl font-bold text-amber-950">Você já assistiu!</h2>
          <p className="text-sm text-gray-700">{promptVideo.title}</p>
          <button className="w-full rounded-xl bg-amber-500 p-3 font-bold text-white" onClick={() => startVideo(promptVideo, false)}>Quer reassistir?</button>
          <button className="w-full rounded-xl bg-emerald-700 p-3 font-bold text-white" onClick={() => startVideo(promptVideo, true)}>Assistir onde parou</button>
          <button className="w-full rounded-xl border border-amber-600 p-3 font-bold text-amber-950" onClick={() => void shareVideo(promptVideo)}>Compartilhar</button>
          <button className="text-sm underline text-gray-600" onClick={() => setPromptVideo(null)}>Cancelar</button>
        </div>
      </div>
    )}
    <div
      className="min-h-screen py-6 px-4"
      style={{ background: "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white shadow text-primary font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="text-right">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-primary drop-shadow">{title}</h1>
            {subtitle && <p className="text-sm text-foreground/70">{subtitle}</p>}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 mt-6">
          <div className="flex flex-col items-center gap-5 sm:gap-6">
            {left.map(renderItem)}
          </div>

          <img loading="lazy" decoding="async"
            src={logoCentral}
            alt="Lemos a Palavra"
            className="w-32 sm:w-48 md:w-56 drop-shadow-xl"
          />

          <div className="flex flex-col items-center gap-5 sm:gap-6">
            {right.map(renderItem)}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
