import logoCentral from "@/assets/logo-central.png";
import iconBiblia from "@/assets/icon-biblia.png";
import iconLouvores from "@/assets/icon-louvores.png";
import iconAtividades from "@/assets/icon-atividades.png";
import iconAlbum from "@/assets/icon-album.png";
import iconDevocionais from "@/assets/icon-devocionais.png";
import iconPedidos from "@/assets/icon-pedidos-oracao.png";
import iconLogin from "@/assets/icon-login.png";

interface MenuItem {
  icon: string;
  label: string;
  sublabel?: string;
}

const leftItems: MenuItem[] = [
  { icon: iconBiblia, label: "BÍBLIA" },
  { icon: iconLouvores, label: "MÚSICAS", sublabel: "Adoração a Deus" },
  { icon: iconAtividades, label: "ATIVIDADES" },
];

const rightItems: MenuItem[] = [
  { icon: iconAlbum, label: "ÁLBUM", sublabel: "Heróis da Fé" },
  { icon: iconDevocionais, label: "DEVOCIONAIS" },
  { icon: iconPedidos, label: "PEDIDOS\nDE ORAÇÃO" },
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
  const iconSize = 130;

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
        className={`rounded-full shadow-xl border-2 border-primary/30 ${!isAuthenticated ? "grayscale opacity-60" : ""}`}
      />
      <span className="orbit-label whitespace-pre-line text-sm text-center font-bold">{item.label}</span>
      {item.sublabel && (
        <span className="orbit-sublabel whitespace-pre-line text-center">{item.sublabel}</span>
      )}
    </div>
  );

  return (
    <div className="relative flex flex-col items-center" style={{ width: "min(95vw, 780px)" }}>
      {!isAuthenticated && (
        <div className="mb-2 flex flex-col items-center gap-1 z-20">
          <button onClick={onLoginClick} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
            <img src={iconLogin} alt="Entrar" width={80} height={80} className="rounded-lg shadow-lg" />
            <span className="orbit-label text-secondary">Entre ou Cadastre-se</span>
            <span className="orbit-label font-extrabold text-xs">PARA ATIVAR O SITE</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 sm:gap-14">
        <div className="flex flex-col items-center gap-8">
          {leftItems.map(renderItem)}
        </div>

        <img
          src={logoCentral}
          alt="Lemos a Palavra"
          width={320}
          height={320}
          className={`drop-shadow-2xl transition-all duration-700 w-[220px] sm:w-[280px] md:w-[320px] ${!isAuthenticated ? "grayscale opacity-70" : ""}`}
        />

        <div className="flex flex-col items-center gap-8">
          {rightItems.map(renderItem)}
        </div>
      </div>
    </div>
  );
}
