import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { loadEventBanner, type EventBannerConfig } from "@/data/eventBannerConfig";
import { normalizeVideo } from "@/lib/videoEmbed";

/**
 * Aviãozinho animado que puxa uma faixa com "Clique aqui" e, abaixo,
 * uma mensagem sazonal (Feliz Dia dos Pais, Feliz Natal, etc.).
 * Ao clicar, abre o vídeo configurado. Tudo é editável pelo painel admin.
 */
export default function EventBannerPlane() {
  const [cfg, setCfg] = useState<EventBannerConfig>(() => loadEventBanner());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setCfg(loadEventBanner());
    window.addEventListener("lemos_event_banner_change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("lemos_event_banner_change", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  if (!cfg.enabled || (!cfg.message && !cfg.callToAction)) return null;

  const handleClick = () => {
    if (!cfg.videoUrl) return;
    setOpen(true);
  };

  const video = cfg.videoUrl ? normalizeVideo(cfg.videoUrl, false) : null;

  return (
    <>
      <div className="w-full flex justify-center pt-2 pb-1 pointer-events-none select-none z-20 relative">
        <button
          onClick={handleClick}
          disabled={!cfg.videoUrl}
          className="pointer-events-auto group flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform disabled:cursor-default disabled:hover:scale-100"
          title={cfg.videoUrl ? "Assistir vídeo" : "Sem vídeo configurado"}
          aria-label={`${cfg.callToAction} — ${cfg.message}`}
        >
          {/* Aviãozinho */}
          <span
            className="text-3xl sm:text-4xl inline-block animate-bounce"
            style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
            aria-hidden
          >
            ✈️
          </span>

          {/* Faixa (banner) */}
          <span className="relative flex flex-col items-start">
            {/* linha que conecta o avião à faixa */}
            <span
              aria-hidden
              className="absolute -left-2 top-1/2 w-2 h-0.5 bg-red-500/70"
            />
            <span
              className="relative px-3 sm:px-4 py-1 rounded-md shadow-lg border-2 border-white bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white font-display font-extrabold text-sm sm:text-base leading-tight"
              style={{
                clipPath: "polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%)",
              }}
            >
              {cfg.callToAction}
            </span>
            {cfg.message && (
              <span
                className="mt-1 px-2 py-0.5 rounded-md bg-white/95 border border-amber-300 shadow text-amber-900 font-display font-extrabold text-xs sm:text-sm animate-pulse"
              >
                {cfg.message}
              </span>
            )}
          </span>
        </button>
      </div>

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
            {video.type === "iframe" ? (
              <iframe
                src={video.src}
                title={cfg.message || "Vídeo"}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video src={video.src} controls autoPlay className="w-full h-full" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
