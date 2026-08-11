import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { loadEventBanner, isBannerActive, type EventBannerConfig } from "@/data/eventBannerConfig";
import { normalizeVideo } from "@/lib/videoEmbed";
import planeRtl from "@/assets/aviao-rtl-v12.png.asset.json";
import planeLtr from "@/assets/aviao-ltr-v12.png.asset.json";

import ColonialVideoFrame from "@/components/ColonialVideoFrame";
import VideoSideActions from "@/components/VideoSideActions";

/**
 * Aviãozinhos animados alternando direções:
 *  1) RTL (direita → esquerda), 2) LTR (esquerda → direita), e repete.
 * Sem som — apenas um rastro de fumaça acompanhando o avião.
 * O texto sazonal (ex.: "Dia dos Pais") aparece sobre a faixa, em azul,
 * sem recipiente, e é clicável para abrir o vídeo configurado.
 */
export default function EventBannerPlane({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [cfg, setCfg] = useState<EventBannerConfig>(() => loadEventBanner());
  const [open, setOpen] = useState(false);
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");
  const [flying, setFlying] = useState(true);

  useEffect(() => {
    const h = () => setCfg(loadEventBanner());
    window.addEventListener("lemos_event_banner_change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("lemos_event_banner_change", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  // Ciclo: 14s voando + 2s pausa, depois inverte a direção
  useEffect(() => {
    if (!isBannerActive(cfg)) return;
    let t2: any;
    const t1 = setInterval(() => {
      setFlying(false);
      t2 = setTimeout(() => {
        setDir((d) => (d === "rtl" ? "ltr" : "rtl"));
        setFlying(true);
      }, 2000);
    }, 16000);
    return () => { clearInterval(t1); clearTimeout(t2); };
  }, [cfg]);

  if (!isBannerActive(cfg)) return null;

  // Vídeo do aviãozinho removido para todos os usuários — o avião é apenas decorativo.
  const handleClick = () => {};
  const video = null as null;
  const planeSrc = dir === "rtl" ? planeRtl.url : planeLtr.url;
  const animName = dir === "rtl" ? "plane-rtl" : "plane-ltr";

  // Puffs de fumaça atrás do avião (lado oposto ao sentido do voo)
  const puffs = [0, 1, 2, 3, 4, 5];

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-28 sm:top-32 z-10 h-44 overflow-hidden">
        {flying && (
          <div
            key={dir}
            className="absolute top-0"
            style={{ animation: `${animName} 14s linear forwards`, willChange: "transform" }}
          >
            <div className="relative">
              {/* Rastro de fumaça */}
              <div
                className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                style={dir === "rtl" ? { left: "100%" } : { right: "100%" }}
              >
                <div className="relative flex items-center" style={{ flexDirection: dir === "rtl" ? "row" : "row-reverse" }}>
                  {puffs.map((i) => (
                    <span
                      key={i}
                      className="block rounded-full bg-white/70"
                      style={{
                        width: 10 + i * 6,
                        height: 10 + i * 6,
                        marginLeft: 4,
                        marginRight: 4,
                        filter: "blur(3px)",
                        animation: `smoke-puff 1.6s ${i * 0.18}s ease-out infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <img loading="lazy" decoding="async"
                src={planeSrc}
                onClick={handleClick}
                alt={dir === "rtl" ? "Aviãozinho voando da direita para a esquerda" : "Aviãozinho voando da esquerda para a direita"}
                className={`relative h-28 sm:h-32 md:h-36 w-auto drop-shadow-2xl select-none transition-all duration-700 ${
                  isAuthenticated ? "" : "grayscale opacity-60"
                }`}
                style={{ animation: "banner-wind 3.2s ease-in-out infinite", transformOrigin: dir === "rtl" ? "100% 50%" : "0% 50%" }}
                draggable={false}
              />


            </div>
          </div>
        )}
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
        @keyframes smoke-puff {
          0%   { opacity: 0.75; transform: scale(0.6) translateY(0); }
          100% { opacity: 0; transform: scale(1.6) translateY(-14px); }
        }
        @keyframes banner-wind {
          0%   { transform: rotate(0deg) skewY(0deg) translateY(0); }
          25%  { transform: rotate(-1.2deg) skewY(1deg) translateY(-3px); }
          50%  { transform: rotate(0.6deg) skewY(-0.8deg) translateY(2px); }
          75%  { transform: rotate(-0.6deg) skewY(0.6deg) translateY(-2px); }
          100% { transform: rotate(0deg) skewY(0deg) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) { img { animation: none !important; } }
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
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <VideoSideActions videoId={`aviaozinho:${cfg.message || "evento"}`} />
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
