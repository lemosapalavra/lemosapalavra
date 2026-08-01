import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ColonialVideoFrame from "@/components/ColonialVideoFrame";
import VideoInteractions from "@/components/VideoInteractions";
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playing && containerRef.current) {
      const el = containerRef.current as any;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      req?.call(el).catch(() => {});
    }
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, [playing]);

  if (playing) {
    return (
      <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setPlaying(null)}
          className="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white transition"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <ColonialVideoFrame>
          <iframe
            src={playing.src}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title={playing.title}
          />
        </ColonialVideoFrame>
        <div className="absolute bottom-4 inset-x-0 px-4 z-20">
          <VideoInteractions videoId={`central:${playing.title}`} />
        </div>
      </div>
    );
  }

  const mid = Math.ceil(videos.length / 2);
  const left = videos.slice(0, mid);
  const right = videos.slice(mid);

  const renderItem = (v: BibleVideo, i: number) => (
    <button
      key={i}
      onClick={() => setPlaying(v)}
      className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
    >
      <img
        src={v.icon}
        alt={v.title}
        loading="lazy"
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary/30 shadow-lg bg-white object-cover"
      />
      <p className="text-[11px] sm:text-xs font-bold text-primary text-center leading-tight max-w-[110px] drop-shadow">
        {v.title}
      </p>
    </button>
  );

  return (
    <div
      className="min-h-screen py-6 px-4"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
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
  );
}
