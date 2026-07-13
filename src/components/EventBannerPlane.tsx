import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { loadEventBanner, type EventBannerConfig } from "@/data/eventBannerConfig";
import { normalizeVideo } from "@/lib/videoEmbed";
import planeAsset from "@/assets/aviaozinho.png.asset.json";

/**
 * Aviãozinho animado que voa cruzando a página inicial (direita ↔ esquerda),
 * puxando uma faixa com "Clique aqui" e uma mensagem sazonal editável.
 * Emite um som de avião voando (gerado via WebAudio) enquanto atravessa.
 * Ao clicar na faixa, abre o vídeo configurado no painel admin.
 */
export default function EventBannerPlane() {
  const [cfg, setCfg] = useState<EventBannerConfig>(() => loadEventBanner());
  const [open, setOpen] = useState(false);
  const [dir, setDir] = useState<"ltr" | "rtl">("rtl"); // começa vindo da direita → esquerda
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

  // Alterna direção a cada travessia (~12s)
  useEffect(() => {
    if (!cfg.enabled) return;
    const id = setInterval(() => setDir((d) => (d === "ltr" ? "rtl" : "ltr")), 12000);
    return () => clearInterval(id);
  }, [cfg.enabled]);

  // Som de avião voando (síntese WebAudio, sem arquivo externo)
  const startPlaneSound = () => {
    try {
      const AC = (window.AudioContext || (window as any).webkitAudioContext);
      const ctx = new AC();
      // Ruído rosa/branco filtrado + modulação para simular motor
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
      lfo.frequency.value = 18; // vibração do motor
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
    } catch {
      /* audio bloqueado — segue sem som */
    }
  };

  const stopPlaneSound = () => {
    audioRef.current?.stop();
    audioRef.current = null;
  };

  // Toca som durante o voo. Alguns navegadores exigem gesto do usuário —
  // então tentamos, e se falhar, engatilhamos no primeiro clique/tap.
  useEffect(() => {
    if (!cfg.enabled) { stopPlaneSound(); return; }
    startPlaneSound();
    const resume = () => {
      if (!audioRef.current) startPlaneSound();
      window.removeEventListener("pointerdown", resume);
    };
    window.addEventListener("pointerdown", resume, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resume);
      stopPlaneSound();
    };
  }, [cfg.enabled]);

  if (!cfg.enabled) return null;

  const handleClick = () => {
    if (!cfg.videoUrl) return;
    setOpen(true);
  };

  const video = cfg.videoUrl ? normalizeVideo(cfg.videoUrl, false) : null;
  const animName = dir === "rtl" ? "plane-rtl" : "plane-ltr";

  return (
    <>
      {/* Faixa de voo — cobre toda a largura, posicionada no meio-alto */}
      <div className="pointer-events-none fixed inset-x-0 top-24 sm:top-28 z-40 h-40 overflow-hidden">
        <button
          onClick={handleClick}
          disabled={!cfg.videoUrl}
          className="pointer-events-auto absolute top-0 group cursor-pointer disabled:cursor-default"
          style={{
            animation: `${animName} 12s linear infinite`,
            willChange: "transform",
            transform: dir === "rtl" ? "scaleX(1)" : "scaleX(-1)",
          }}
          title={cfg.videoUrl ? "Assistir vídeo" : "Sem vídeo configurado"}
          aria-label={`${cfg.callToAction} — ${cfg.message}`}
        >
          <div className="flex items-center gap-1" style={{ transform: dir === "ltr" ? "scaleX(-1)" : "none" }}>
            <img
              src={planeAsset.url}
              alt=""
              aria-hidden
              className="h-28 sm:h-32 md:h-36 w-auto drop-shadow-2xl select-none"
              draggable={false}
            />
            {/* Texto sobrescreve o do banner (que já vem no PNG) apenas quando o admin muda a mensagem */}
            {cfg.message && (
              <span className="ml-[-28px] mb-6 rounded-md bg-white/95 border-2 border-amber-300 shadow-lg px-2 py-0.5 font-display font-extrabold text-xs sm:text-sm text-amber-900 animate-pulse whitespace-nowrap">
                {cfg.message}
              </span>
            )}
          </div>
        </button>
      </div>

      <style>{`
        @keyframes plane-rtl {
          0%   { transform: translateX(105vw); }
          100% { transform: translateX(-60vw); }
        }
        @keyframes plane-ltr {
          0%   { transform: translateX(-60vw); }
          100% { transform: translateX(105vw); }
        }
      `}</style>

      {open && video && (
        <div
          className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-3"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {video.kind === "mp4" ? (
              <video src={video.embedUrl} controls autoPlay className="w-full h-full" />
            ) : (
              <iframe
                src={video.embedUrl}
                title={cfg.message || "Vídeo"}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
