import { useEffect, useState } from "react";
import { loadKartBanner, isKartActive, KART_BANNER_EVENT, type KartBannerConfig } from "@/data/kartBannerConfig";
import ColonialVideoFrame from "@/components/ColonialVideoFrame";
import VideoSideActions from "@/components/VideoSideActions";
import kartLtr from "@/assets/kartzinho/kart-ltr.png.asset.json";
import kartRtl from "@/assets/kartzinho/kart-rtl.png.asset.json";
import kartPoster from "@/assets/kartzinho/feliz-aniversario-capa.jpg.asset.json";

/**
 * Kartzinho animado que atravessa a página inicial.
 * Alterna o sentido a cada volta e, ao ser clicado, abre o vídeo
 * "Feliz Aniversário" com a mesma moldura e interações dos demais vídeos.
 */
export default function EventBannerKart({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [cfg, setCfg] = useState<KartBannerConfig>(() => loadKartBanner());
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");
  const [running, setRunning] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const h = () => setCfg(loadKartBanner());
    window.addEventListener(KART_BANNER_EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(KART_BANNER_EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  // Ciclo: 14s correndo + 2s parado, depois inverte o sentido
  useEffect(() => {
    if (!isKartActive(cfg)) return;
    let t2: ReturnType<typeof setTimeout>;
    const t1 = setInterval(() => {
      setRunning(false);
      t2 = setTimeout(() => {
        setDir((d) => (d === "rtl" ? "ltr" : "rtl"));
        setRunning(true);
      }, 2000);
    }, 16000);
    return () => { clearInterval(t1); clearTimeout(t2); };
  }, [cfg]);

  if (!isKartActive(cfg)) return null;

  const kartSrc = dir === "rtl" ? kartRtl.url : kartLtr.url;
  const animName = dir === "rtl" ? "kart-rtl" : "kart-ltr";
  const canOpen = isAuthenticated && !!cfg.videoUrl;

  return (
    <>
      <div className="relative w-full overflow-hidden select-none">
        <div className="relative h-24 sm:h-28 md:h-32">
          {running && (
            <div
              key={dir}
              className="absolute bottom-0"
              style={{ animation: `${animName} 14s linear forwards`, willChange: "transform" }}
            >
              <button
                type="button"
                onClick={() => canOpen && setVideoOpen(true)}
                title={canOpen ? `${cfg.callToAction} — ${cfg.message}` : cfg.message}
                aria-label={cfg.message}
                className={`block ${canOpen ? "cursor-pointer" : "cursor-default"}`}
              >
                <img
                  loading="eager"
                  decoding="async"
                  src={kartSrc}
                  alt={cfg.message}
                  draggable={false}
                  className={`h-24 sm:h-28 md:h-32 w-auto drop-shadow-2xl transition-all duration-700 ${
                    isAuthenticated ? "" : "grayscale opacity-60"
                  }`}
                  style={{ animation: "kart-bump 0.45s ease-in-out infinite" }}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {videoOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black flex items-center justify-center"
          onClick={() => setVideoOpen(false)}
        >
          <button
            onClick={() => setVideoOpen(false)}
            title="Fechar vídeo"
            aria-label="Fechar vídeo"
            className="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white text-xl font-bold transition"
          >
            ✕
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <VideoSideActions videoId="kartzinho:feliz-aniversario" />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ColonialVideoFrame variant="silver">
              <video
                src={cfg.videoUrl}
                poster={kartPoster.url}
                controls
                autoPlay
                playsInline
                controlsList="nodownload noremoteplayback noplaybackrate"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full bg-black object-cover"
              />
            </ColonialVideoFrame>
          </div>
        </div>
      )}

      <style>{`
        @keyframes kart-ltr {
          0%   { transform: translateX(-60vw); }
          100% { transform: translateX(110vw); }
        }
        @keyframes kart-rtl {
          0%   { transform: translateX(110vw); }
          100% { transform: translateX(-60vw); }
        }
        @keyframes kart-bump {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
}
