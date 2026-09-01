import { useEffect, useState } from "react";
import { loadTrainBanner, isTrainActive, TRAIN_BANNER_EVENT, type TrainBannerConfig } from "@/data/trainBannerConfig";
import trainLtr from "@/assets/trenzinho/trem-ltr.png.asset.json";
import trainRtl from "@/assets/trenzinho/trem-rtl.png.asset.json";
import trainPoster from "@/assets/trenzinho/trem-da-vida-capa.png.asset.json";

/**
 * Trenzinho animado que atravessa a página inicial sobre um trilho.
 * Alterna o sentido a cada viagem e, ao ser clicado, abre o vídeo
 * "Trem da Vida" configurado pelo administrador.
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
      <div className="relative w-full overflow-hidden select-none" aria-hidden={false}>
        {/* Trenzinho */}
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

        {/* Trilho animado */}
        <div className="relative h-3 sm:h-4 w-full">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, hsl(var(--muted-foreground)/0.55) 0 8px, transparent 8px 24px)",
              backgroundSize: "24px 100%",
              animation: `${dir === "rtl" ? "rail-rtl" : "rail-ltr"} 1.2s linear infinite`,
            }}
          />
          <div className="absolute inset-x-0 top-0 h-[3px] bg-amber-800/70 rounded-full" />
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-amber-800/70 rounded-full" />
        </div>
      </div>

      {videoOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/85 flex items-center justify-center p-3"
          onClick={() => setVideoOpen(false)}
        >
          <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setVideoOpen(false)}
              title="Fechar vídeo"
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-background text-foreground shadow-lg font-bold"
            >
              ✕
            </button>
            <video
              src={cfg.videoUrl}
              poster={trainPoster.url}
              controls
              autoPlay
              playsInline
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="w-full rounded-2xl border-4 border-amber-400 shadow-2xl bg-black"
            />
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
        @keyframes rail-ltr { from { background-position-x: 0; } to { background-position-x: -24px; } }
        @keyframes rail-rtl { from { background-position-x: 0; } to { background-position-x: 24px; } }
      `}</style>
    </>
  );
}
