import { useEffect, useState } from "react";
import logoCentral from "@/assets/logo-central.png";
import iconLogin from "@/assets/icon-login.png";
import { loadOrbit, type OrbitItem } from "@/data/orbitConfig";

interface OrbitMenuProps {
  isAuthenticated: boolean;
  userName?: string;
  userAvatar?: string;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onItemClick?: (label: string) => void;
}

const SPIN_DURATION = "120s";

export default function OrbitMenu({ isAuthenticated, onLoginClick, onItemClick }: OrbitMenuProps) {
  const iconSize = 120;
  const [items, setItems] = useState<OrbitItem[]>(() => loadOrbit());

  useEffect(() => {
    const h = () => setItems(loadOrbit());
    window.addEventListener("lemos_orbit_change", h);
    return () => window.removeEventListener("lemos_orbit_change", h);
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full">
      {!isAuthenticated && (
        <div className="mb-1 flex flex-col items-center gap-1 z-20">
          <button onClick={onLoginClick} className="flex flex-col items-center gap-0.5 cursor-pointer hover:scale-110 transition-transform">
            <img loading="lazy" decoding="async" src={iconLogin} alt="Acessar conta" width={64} height={64} className="rounded-lg shadow-lg" />
            <span className="orbit-label text-secondary text-xs">Entre ou Cadastre-se</span>
            <span className="orbit-label font-extrabold text-[9px]">PARA ATIVAR O SITE</span>
          </button>
        </div>
      )}

      <div className="relative orbit-area w-[min(92vw,380px)] h-[min(92vw,380px)] sm:w-[min(90vw,520px)] sm:h-[min(90vw,520px)] md:w-[min(92vw,720px)] md:h-[min(92vw,720px)]">
        <div
          className="absolute inset-0 orbit-anim"
          style={{ animation: `orbit-spin ${SPIN_DURATION} linear infinite`, transformOrigin: "50% 50%" }}
        >
          {items.map((item, i) => {
            const angle = (360 / items.length) * i - 90;
            return (
              <div
                key={item.label + i}
                className="absolute top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translate(var(--orbit-radius)) rotate(${-angle}deg)` }}
              >
                <div className="orbit-anim" style={{ animation: `orbit-spin-reverse ${SPIN_DURATION} linear infinite`, transformOrigin: "50% 50%" }}>
                  <button
                    type="button"
                    onClick={() => isAuthenticated && onItemClick?.(item.label)}
                    title={`${item.label.replace(/\n/g, " ")}${item.sublabel ? " — " + item.sublabel : ""}`}
                    className={`flex flex-col items-center gap-1 transition-transform duration-300 ${
                      isAuthenticated
                        ? "cursor-pointer hover:scale-110 hover:-translate-y-1 focus-visible:scale-110"
                        : "cursor-default"
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-full shadow-xl hover:shadow-2xl transition-shadow border-2 border-primary/30 w-[68px] h-[68px] sm:w-[96px] sm:h-[96px] md:w-[120px] md:h-[120px] bg-white ${!isAuthenticated ? "grayscale opacity-60" : ""}`}
                    >
                      <img
                        src={item.icon}
                        alt={item.label}
                        width={iconSize}
                        height={iconSize}
                        loading="lazy"
                        style={{
                          objectFit: "cover",
                          transform: item.route === "/lemosplay" ? "scale(1.35)" : item.route === "/album" ? "scale(1.35)" : "scale(1)",
                          transformOrigin: "center",
                        }}
                        className="w-full h-full"
                      />
                    </div>
                    <span className="orbit-label whitespace-pre-line text-[10px] sm:text-xs md:text-sm text-center font-bold leading-tight drop-shadow-sm">
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span className="orbit-sublabel whitespace-pre-line text-center text-[9px] sm:text-[10px] md:text-xs max-w-[90px] sm:max-w-[120px] md:max-w-[130px] leading-tight">
                        {item.sublabel}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <img loading="lazy" decoding="async"
          src={logoCentral}
          alt="Lemos a Palavra"
          width={320}
          height={320}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl transition-all duration-700 w-[110px] sm:w-[180px] md:w-[260px] ${!isAuthenticated ? "grayscale opacity-70" : ""}`}
        />
      </div>

      <style>{`
        .orbit-area { --orbit-radius: clamp(115px, 29vw, 145px); }
        @media (min-width: 640px) { .orbit-area { --orbit-radius: clamp(145px, 30vw, 200px); } }
        @media (min-width: 768px) { .orbit-area { --orbit-radius: clamp(190px, 32vw, 290px); } }
        @keyframes orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit-spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .orbit-area:hover .orbit-anim,
        .orbit-area:focus-within .orbit-anim { animation-play-state: paused !important; }
      `}</style>
    </div>
  );
}
