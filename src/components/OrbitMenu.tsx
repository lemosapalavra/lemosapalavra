import logoCentral from "@/assets/logo-central.png";
import iconAtividades from "@/assets/icon-atividades.png";
import iconAlbum from "@/assets/icon-album.png";
import iconDevocionais from "@/assets/icon-devocionais.png";
import iconPedidos from "@/assets/icon-pedidos-oracao.png";
import iconLogin from "@/assets/icon-login.png";
import lemosPlayLogo from "@/assets/lemos-play-logo.png";

interface MenuItem {
  icon: string;
  label: string;
  sublabel?: string;
}

// Pentagram order (clockwise starting from top vertex)
const items: MenuItem[] = [
  { icon: lemosPlayLogo, label: "LEMOS PLAY", sublabel: "Filmes, Séries e Músicas" },
  { icon: iconAlbum, label: "ÁLBUM", sublabel: "Heróis da Fé" },
  { icon: iconDevocionais, label: "DEVOCIONAIS" },
  { icon: iconPedidos, label: "PEDIDOS\nDE ORAÇÃO" },
  { icon: iconAtividades, label: "ATIVIDADES" },
];

interface OrbitMenuProps {
  isAuthenticated: boolean;
  userName?: string;
  userAvatar?: string;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onItemClick?: (label: string) => void;
}

const SPIN_DURATION = "120s"; // very slow

export default function OrbitMenu({ isAuthenticated, onLoginClick, onItemClick }: OrbitMenuProps) {
  const iconSize = 120;
  // Responsive container; radius derived from container size via CSS var
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
        className="relative"
        style={{
          width: "min(92vw, 720px)",
          height: "min(92vw, 720px)",
          // CSS var used for orbit radius
          ["--orbit-radius" as any]: "min(38vw, 300px)",
        }}
      >
        {/* Rotating orbit ring */}
        <div
          className="absolute inset-0"
          style={{
            animation: `orbit-spin ${SPIN_DURATION} linear infinite`,
            transformOrigin: "50% 50%",
          }}
        >
          {items.map((item, i) => {
            const angle = (360 / items.length) * i - 90; // start at top
            return (
              <div
                key={item.label}
                className="absolute top-1/2 left-1/2"
                style={{
                  // Place vertex on pentagram, then counter-rotate so item stays upright
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translate(var(--orbit-radius)) rotate(${-angle}deg)`,
                }}
              >
                {/* Counter-spin wrapper to keep icons always horizontal */}
                <div
                  style={{
                    animation: `orbit-spin-reverse ${SPIN_DURATION} linear infinite`,
                    transformOrigin: "50% 50%",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => isAuthenticated && onItemClick?.(item.label)}
                    className={`flex flex-col items-center gap-1 ${isAuthenticated ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      width={iconSize}
                      height={iconSize}
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                      className={`rounded-full shadow-xl border-2 border-primary/30 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] ${!isAuthenticated ? "grayscale opacity-60" : ""}`}
                    />
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

        {/* Central static logo */}
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
      `}</style>
    </div>
  );
}
