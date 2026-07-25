import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { loadEventBanner, type EventBannerConfig } from "@/data/eventBannerConfig";
import { normalizeVideo } from "@/lib/videoEmbed";
import planeRtl from "@/assets/aviao-rtl-v3.png.asset.json";
import planeLtr from "@/assets/aviao-ltr-v3.png.asset.json";
import ColonialVideoFrame from "@/components/ColonialVideoFrame";

/**
 * Aviãozinhos animados alternando direções:
 *  1) RTL (direita → esquerda), 2) LTR (esquerda → direita), e repete.
 * Cada avião já traz a faixa "Clique aqui" na arte. Abaixo da faixa,
 * um botão sazonal (ex.: "Feliz Dia dos Pais") abre o vídeo configurado.
 */
export default function EventBannerPlane() {
  const [cfg, setCfg] = useState<EventBannerConfig>(() => loadEventBanner());
  const [open, setOpen] = useState(false);
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");
  const [flying, setFlying] = useState(true);
  const audioRef = useRef<{ ctx: AudioContext; stop: () => void } | null>(null);

  useEffect(() => {
    const h = () => setCfg(loadEventBanner());
    window.addEventListener("lemos_event_banner_change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("lemos_event_banner_change", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  // Ciclo: 14s voando + 2s pausa (sem som), depois inverte direção
  useEffect(() => {
    if (!cfg.enabled) return;
    let t2: any;
    const t1 = setInterval(() => {
      setFlying(false);
      t2 = setTimeout(() => {
        setDir((d) => (d === "rtl" ? "ltr" : "rtl"));
        setFlying(true);
      }, 2000);
    }, 16000);
    return () => { clearInterval(t1); clearTimeout(t2); };
  }, [cfg.enabled]);

  // Som de motor de avião (síntese WebAudio)
  const startPlaneSound = () => {
    try {
      const AC = (window.AudioContext || (window as any).webkitAudioContext);
      const ctx = new AC();
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 220;
      bandpass.Q.value = 1.5;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 18;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 60;
      lfo.connect(lfoGain).connect(bandpass.frequency);
      const master = ctx.createGain();
      master.gain.value = 0.0;
      master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.6);
      noise.connect(bandpass).connect(master).connect(ctx.destination);
      lfo.start();
      noise.start();
      audioRef.current = {
        ctx,
        stop: () => {
          try {
            master.gain.cancelScheduledValues(ctx.currentTime);
            master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
            setTimeout(() => { try { noise.stop(); lfo.stop(); ctx.close(); } catch {} }, 500);
          } catch {}
        },
      };
    } catch { /* audio bloqueado */ }
  };
  const stopPlaneSound = () => { audioRef.current?.stop(); audioRef.current = null; };

  useEffect(() => {
    if (!cfg.enabled) { stopPlaneSound(); return; }
    startPlaneSound();
    const resume = () => {
      if (!audioRef.current) startPlaneSound();
      window.removeEventListener("pointerdown", resume);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    const onVis = () => {
      if (document.hidden) stopPlaneSound();
      else if (!audioRef.current) startPlaneSound();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", stopPlaneSound);
    window.addEventListener("beforeunload", stopPlaneSound);
    return () => {
      window.removeEventListener("pointerdown", resume);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", stopPlaneSound);
      window.removeEventListener("beforeunload", stopPlaneSound);
      stopPlaneSound();
    };
  }, [cfg.enabled]);

  if (!cfg.enabled) return null;

  const handleClick = () => { if (cfg.videoUrl) setOpen(true); };
  const video = cfg.videoUrl ? normalizeVideo(cfg.videoUrl, false) : null;
  const planeSrc = dir === "rtl" ? planeRtl.url : planeLtr.url;
  const animName = dir === "rtl" ? "plane-rtl" : "plane-ltr";

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-4 sm:top-6 z-10 h-40 overflow-hidden">
        <div
          key={dir}
          className="absolute top-0"
          style={{ animation: `${animName} 14s linear forwards`, willChange: "transform" }}
        >
          <div className="relative">
            <img
              src={planeSrc}
              onClick={handleClick}
              alt={dir === "rtl" ? "Aviãozinho voando da direita para a esquerda" : "Aviãozinho voando da esquerda para a direita"}
              className={`h-28 sm:h-32 md:h-36 w-auto drop-shadow-2xl select-none ${cfg.videoUrl ? "pointer-events-auto cursor-pointer" : ""}`}
              draggable={false}
            />
            {cfg.message && (
              <button
                onClick={handleClick}
                disabled={!cfg.videoUrl}
                className="pointer-events-auto absolute bottom-2 rounded-full bg-[#1e5bd6] hover:bg-[#1747a6] disabled:opacity-70 border-2 border-white shadow-lg px-3 py-1 font-display font-extrabold text-[11px] sm:text-xs text-white whitespace-nowrap animate-pulse"
                style={dir === "rtl"
                  ? { right: "12%" }   // faixa fica à direita do avião
                  : { left: "12%" }}   // faixa fica à esquerda do avião
                title={cfg.videoUrl ? "Assistir vídeo" : "Sem vídeo configurado"}
                aria-label={cfg.message}
              >
                {cfg.message}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes plane-rtl {
          0%   { transform: translateX(105vw); }
          100% { transform: translateX(-90vw); }
        }
        @keyframes plane-ltr {
          0%   { transform: translateX(-90vw); }
          100% { transform: translateX(105vw); }
        }
      `}</style>

      {open && video && (
        <div className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-3" onClick={() => setOpen(false)}>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <ColonialVideoFrame>
              {video.kind === "mp4" ? (
                <video src={video.embedUrl} controls autoPlay playsInline className="w-full h-full object-contain" />
              ) : (
                <iframe
                  src={video.embedUrl}
                  title={cfg.message || "Vídeo"}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              )}
            </ColonialVideoFrame>
          </div>
        </div>
      )}
    </>
  );
}
