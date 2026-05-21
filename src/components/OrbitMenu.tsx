import logoCentral from "@/assets/logo-central.png";
import iconBiblia from "@/assets/icon-biblia.png";
import iconLouvores from "@/assets/icon-louvores.png";
import iconSeries from "@/assets/icon-series.png";
import iconFilmes from "@/assets/icon-filmes.png";
import iconAtividades from "@/assets/icon-atividades.png";
import iconAlbum from "@/assets/icon-album.png";
import iconLogin from "@/assets/icon-login.png";

interface MenuItem {
  icon: string;
  label: string;
  sublabel?: string;
}

const leftItems: MenuItem[] = [
  { icon: iconSeries, label: "SÉRIES\nBÍBLICAS" },
  { icon: iconFilmes, label: "FILMES\nBÍBLICOS" },
  { icon: iconLouvores, label: "MÚSICAS", sublabel: "Adoração a Deus" },
];

const rightItems: MenuItem[] = [
  { icon: iconBiblia, label: "BÍBLIA" },
  { icon: iconAtividades, label: "ATIVIDADES" },
  { icon: iconAlbum, label: "ÁLBUM", sublabel: "Heróis da Fé" },
];

interface OrbitMenuProps {
  isAuthenticated: boolean;
  userName?: string;
  userAvatar?: string;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onItemClick?: (label: string) => void;
}

export default function OrbitMenu({ isAuthenticated, onLoginClick, onItemClick }: OrbitMenuProps) {
  const iconSize = 90;

  const renderItem = (item: MenuItem, i: number) => (
    <div
      key={i}
      onClick={() => isAuthenticated && onItemClick?.(item.label)}
      className={`flex flex-col items-center gap-1 ${isAuthenticated ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
    >
      <img
        src={item.icon}
        alt={item.label}
        width={iconSize}
        height={iconSize}
        loading="lazy"
        style={{ objectFit: "cover" }}
        className={`rounded-full shadow-lg border-2 border-primary/30 ${!isAuthenticated ? "grayscale opacity-60" : ""}`}
      />
      <span className="orbit-label whitespace-pre-line text-xs text-center">{item.label}</span>
      {item.sublabel && (
        <span className="orbit-sublabel whitespace-pre-line text-center">{item.sublabel}</span>
      )}
    </div>
  );

  return (
    <div className="relative flex flex-col items-center" style={{ width: 540 }}>
      {/* Top center: login button (only when not authenticated) */}
      {!isAuthenticated && (
        <div className="mb-2 flex flex-col items-center gap-1 z-20">
          <button onClick={onLoginClick} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
            <img src={iconLogin} alt="Entrar" width={80} height={80} className="rounded-lg shadow-lg" />
            <span className="orbit-label text-secondary">Entre ou Cadastre-se</span>
            <span className="orbit-label font-extrabold text-xs">PARA ATIVAR O SITE</span>
          </button>
        </div>
      )}

      {/* Fixed grid: left column | logo | right column */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-6">
          {leftItems.map(renderItem)}
        </div>

        <img
          src={logoCentral}
          alt="Lemos a Palavra"
          width={210}
          height={210}
          className={`drop-shadow-xl transition-all duration-700 ${!isAuthenticated ? "grayscale opacity-70" : ""}`}
        />

        <div className="flex flex-col items-center gap-6">
          {rightItems.map(renderItem)}
        </div>
      </div>
    </div>
  );
}
