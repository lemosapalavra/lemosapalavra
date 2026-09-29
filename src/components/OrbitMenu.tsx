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
            <img loading="lazy" decoding="async" src={iconLogin} alt="Acessar conta" width={64} height={64} className="w-12 h-12 sm:w-12 lg:w-16 h-auto rounded-lg shadow-lg" />
            <span className="orbit-label text-secondary text-[10px] sm:text-xs">Entre ou Cadastre-se</span>
            <span className="orbit-label font-extrabold text-[8px] sm:text-[9px]">PARA ATIVAR O SITE</span>
          </button>
        </div>
      )}

      <div className="relative orbit-area w-[min(94vw,330px)] h-[min(94vw,330px)] sm:w-[min(90vw,400px)] sm:h-[min(90vw,400px)] lg:w-[min(92vw,720px)] lg:h-[min(92vw,720px)]">
        <div className="absolute inset-0 orbit-spin">
          {items.map((item, i) => {
            const angle = (360 / items.length) * i - 90;
            return (
              <div
                key={item.label + i}
                className="absolute top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translate(var(--orbit-radius)) rotate(${-angle}deg)` }}
              >
                <div className="orbit-spin-rev">
                  <button
                    type="button"
                    onClick={() => isAuthenticated && onItemClick?.(item.label)}
                    title={`${item.label.replace(/\n/g, " ")}${item.sublabel ? " — " + item.sublabel : ""}`}
                    className={`flex flex-col items-center gap-1 transition-transform duration-300 active:-translate-y-2 active:scale-105 ${
                      isAuthenticated
                        ? "cursor-pointer hover:scale-110 hover:-translate-y-1 focus-visible:scale-110"
                        : "cursor-default"
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-full shadow-xl hover:shadow-2xl transition-shadow w-[66px] h-[66px] min-[390px]:w-[72px] min-[390px]:h-[72px] sm:w-[96px] sm:h-[96px] lg:w-[136px] lg:h-[136px] bg-transparent ${!isAuthenticated ? "grayscale opacity-60" : ""}`}
                    >
                      <img
                        src={item.icon}
                        alt={item.label}
                        width={iconSize}
                        height={iconSize}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </div>
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
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl transition-all duration-700 w-[80px] sm:w-[120px] lg:w-[220px] ${!isAuthenticated ? "grayscale opacity-70" : ""}`}
        />
      </div>

      <style>{`
         .orbit-area { --orbit-radius: clamp(112px, 31vw, 132px); }
        @media (min-width: 640px) { .orbit-area { --orbit-radius: clamp(125px, 27vw, 155px); } }
        @media (min-width: 1024px) { .orbit-area { --orbit-radius: clamp(205px, 32vw, 290px); } }
      `}</style>
    </div>
  );
}
