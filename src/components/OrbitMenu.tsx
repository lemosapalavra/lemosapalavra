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
    <div className="relative flex flex-col items-center" style={{ width: "min(95vw, 780px)" }}>
      {!isAuthenticated && (
        <div className="mb-4 flex flex-col items-center gap-1 z-20">
          <button onClick={onLoginClick} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
            <img src={iconLogin} alt="Entrar" width={80} height={80} className="rounded-lg shadow-lg" />
            <span className="orbit-label text-secondary">Entre ou Cadastre-se</span>
            <span className="orbit-label font-extrabold text-xs">PARA ATIVAR O SITE</span>
          </button>
        </div>
      )}

      <div
        className="relative orbit-area"
        style={{
          width: "min(96vw, 720px)",
          height: "min(96vw, 720px)",
          ["--orbit-radius" as any]: "clamp(140px, 40vw, 260px)",
        }}
      >
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
                    className={`flex flex-col items-center gap-1 ${isAuthenticated ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-full shadow-xl border-2 border-primary/30 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] bg-white ${!isAuthenticated ? "grayscale opacity-60" : ""}`}
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
                    <span className="orbit-label whitespace-pre-line text-xs sm:text-sm text-center font-bold leading-tight">
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span className="orbit-sublabel whitespace-pre-line text-center text-[10px] sm:text-xs">
                        {item.sublabel}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <img
          src={logoCentral}
          alt="Lemos a Palavra"
          width={320}
          height={320}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl transition-all duration-700 w-[180px] sm:w-[230px] md:w-[280px] ${!isAuthenticated ? "grayscale opacity-70" : ""}`}
        />
      </div>

      <style>{`
        @keyframes orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit-spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .orbit-area:hover .orbit-anim,
        .orbit-area:focus-within .orbit-anim { animation-play-state: paused !important; }
      `}</style>
    </div>
  );
}
