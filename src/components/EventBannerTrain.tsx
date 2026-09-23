import { useEffect, useState } from "react";
import { loadTrainBanner, isTrainActive, TRAIN_BANNER_EVENT, type TrainBannerConfig } from "@/data/trainBannerConfig";
import ColonialVideoFrame from "@/components/ColonialVideoFrame";
import VideoSideActions from "@/components/VideoSideActions";
import trainLtr from "@/assets/trenzinho/trem-ltr-v2.png.asset.json";
import trainRtl from "@/assets/trenzinho/trem-rtl-v2.png.asset.json";
import trainPoster from "@/assets/trenzinho/trem-da-vida-capa.png.asset.json";

/**
 * Trenzinho animado que atravessa a página inicial.
 * Alterna o sentido a cada viagem e, ao ser clicado, abre o vídeo
 * "Trem da Vida" com a mesma moldura e interações dos demais vídeos.
 */
export default function EventBannerTrain({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [cfg, setCfg] = useState<TrainBannerConfig>(() => loadTrainBanner());
  const [dir, setDir] = useState<"rtl" | "ltr">("ltr");
  const [running, setRunning] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    const h = () => setCfg(loadTrainBanner());
    window.addEventListener(TRAIN_BANNER_EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(TRAIN_BANNER_EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  // Ciclo: 16s andando + 2s parado, depois inverte o sentido
  useEffect(() => {
    if (!isTrainActive(cfg)) return;
    let t2: ReturnType<typeof setTimeout>;
    const t1 = setInterval(() => {
      setRunning(false);
      t2 = setTimeout(() => {
        setDir((d) => (d === "rtl" ? "ltr" : "rtl"));
        setRunning(true);
      }, 2000);
    }, 18000);
    return () => { clearInterval(t1); clearTimeout(t2); };
  }, [cfg]);

  if (!isTrainActive(cfg)) return null;

  const trainSrc = dir === "rtl" ? trainRtl.url : trainLtr.url;
  const animName = dir === "rtl" ? "train-rtl" : "train-ltr";
  const canOpen = isAuthenticated && !!cfg.videoUrl;

  return (
    <>
      <div className="relative w-full overflow-hidden select-none">
        <div className="relative h-24 sm:h-28 md:h-32">
          {running && (
            <div
              key={dir}
              className="absolute bottom-0"
              style={{ animation: `${animName} 16s linear forwards`, willChange: "transform" }}
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
                  src={trainSrc}
                  alt={cfg.message}
                  draggable={false}
                  className={`h-24 sm:h-28 md:h-32 w-auto drop-shadow-2xl transition-all duration-700 ${
                    isAuthenticated ? "" : "grayscale opacity-60"
                  }`}
                  style={{ animation: "train-bump 0.5s ease-in-out infinite" }}
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
            <VideoSideActions videoId="trenzinho:trem-da-vida" />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <ColonialVideoFrame variant="silver">
              <video
                src={cfg.videoUrl}
                poster={trainPoster.url}
                controls
                autoPlay
                playsInline
                preload="auto"
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
        @keyframes train-ltr {
          0%   { transform: translateX(-60vw); }
          100% { transform: translateX(110vw); }
        }
        @keyframes train-rtl {
          0%   { transform: translateX(110vw); }
          100% { transform: translateX(-60vw); }
        }
        @keyframes train-bump {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-2px); }
        }
      `}</style>
    </>
  );
}
