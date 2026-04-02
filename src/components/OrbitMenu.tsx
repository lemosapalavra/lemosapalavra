import logoCentral from "@/assets/logo-central.png";
import iconBiblia from "@/assets/icon-biblia.png";
import iconLouvores from "@/assets/icon-louvores.png";
import iconHistorias from "@/assets/icon-historias.png";
import iconMusicas from "@/assets/icon-musicas.png";
import iconAtividades from "@/assets/icon-atividades.png";
import iconDevocionais from "@/assets/icon-devocionais.png";
import iconPedidosOracao from "@/assets/icon-pedidos-oracao.png";
import iconAlbum from "@/assets/icon-album.png";
import iconLogin from "@/assets/icon-login.png";

interface OrbitItem {
  icon: string;
  label: string;
  sublabel?: string;
  angle: number;
}

const menuItems: OrbitItem[] = [
  { icon: iconBiblia, label: "BÍBLIA", sublabel: "66 livros", angle: -90 },
  { icon: iconLouvores, label: "LOUVORES", sublabel: "Adoração a Deus", angle: -45 },
  { icon: iconMusicas, label: "MÚSICAS", sublabel: "Arte, Harmonia,\nMelodia e ritmo", angle: 0 },
  { icon: iconDevocionais, label: "DEVOCIONAIS", angle: 45 },
  { icon: iconPedidosOracao, label: "PEDIDOS\nDE ORAÇÃO", angle: 90 },
  { icon: iconAtividades, label: "ATIVIDADES", angle: 135 },
  { icon: iconHistorias, label: "HISTÓRIAS", angle: 180 },
  { icon: iconAlbum, label: "ÁLBUM", sublabel: "Figurinhas\nBíblicas", angle: 225 },
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
  const radius = 155;
  const iconSize = 58;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 600, height: 600 }}>
      {/* Top center: login button (only when not authenticated) */}
      {!isAuthenticated && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20">
          <button onClick={onLoginClick} className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
            <img src={iconLogin} alt="Entrar" width={80} height={80} className="rounded-lg shadow-lg" />
            <span className="orbit-label text-secondary">Entre ou Cadastre-se</span>
            <span className="orbit-label font-extrabold text-xs">PARA ATIVAR O SITE</span>
          </button>
        </div>
      )}

      {/* Central logo */}
      <div className="absolute z-10 flex flex-col items-center" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <img
          src={logoCentral}
          alt="Lemos a Palavra"
          width={200}
          height={200}
          className={`drop-shadow-xl transition-all duration-700 ${!isAuthenticated ? "grayscale opacity-70" : ""}`}
        />
        <span className="font-display text-sm font-bold text-foreground mt-1 text-center leading-tight">Clubinho da Palavra</span>
      </div>

      {/* Orbiting icons */}
      <div
        style={{
          position: "absolute",
          width: radius * 2,
          height: radius * 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="orbit-container" style={{ width: "100%", height: "100%", position: "relative" }}>
          {menuItems.map((item, i) => {
            const angleRad = (item.angle * Math.PI) / 180;
            const x = radius + Math.cos(angleRad) * radius - iconSize / 2;
            const y = radius + Math.sin(angleRad) * radius - iconSize / 2;

            return (
              <div
                key={i}
                className="orbit-counter"
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: iconSize,
                }}
              >
                <div
                  onClick={() => isAuthenticated && onItemClick?.(item.label)}
                  className={`flex flex-col items-center gap-1 ${isAuthenticated ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    width={iconSize}
                    height={iconSize}
                    loading="lazy"
                    className={`rounded-full shadow-lg border-2 border-primary/30 ${!isAuthenticated ? "grayscale opacity-60" : ""}`}
                  />
                  <span className="orbit-label whitespace-pre-line text-xs">{item.label}</span>
                  {item.sublabel && (
                    <span className="orbit-sublabel whitespace-pre-line">{item.sublabel}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
