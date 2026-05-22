import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrbitMenu from "@/components/OrbitMenu";
import FeedbackFooter from "@/components/FeedbackFooter";
import DedicatoriaModal from "@/components/DedicatoriaModal";
import { useCoins, ensureInitialCoins, addCoins } from "@/hooks/useCoins";
import iconUsuario from "@/assets/icon-usuario.png";
import iconDedicatoria from "@/assets/icon-dedicatoria.png";
import lemosPlayLogo from "@/assets/lemos-play-logo.png";

const labelToRoute: Record<string, string> = {
  "BÍBLIA": "/biblia",
  "MÚSICAS": "/louvores",
  "DEVOCIONAIS": "/devocionais",
  "PEDIDOS\nDE ORAÇÃO": "/pedidos-oracao",
  "ATIVIDADES": "/atividades",
  "SÉRIES\nBÍBLICAS": "/series",
  "FILMES\nBÍBLICOS": "/filmes",
  "ÁLBUM": "/album",
};

export default function Index() {
  const navigate = useNavigate();
  const { coins } = useCoins();
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [dedicatoriaOpen, setDedicatoriaOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lemos_user");
    if (stored) {
      const u = JSON.parse(stored);
      ensureInitialCoins();
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem("lemos_last_visit");
      if (lastVisit !== today) {
        addCoins(2);
        localStorage.setItem("lemos_last_visit", today);
      }
      setUser(u);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("lemos_user");
    setUser(null);
  };

  const handleItemClick = (label: string) => {
    const route = labelToRoute[label];
    if (route) navigate(route);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center overflow-hidden relative"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
    >
      {/* Top right: user info + config gear */}
      {user && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-popover/90 rounded-2xl px-4 py-2 shadow-lg border border-border">
          <div className="text-right">
            <p className="font-display text-sm font-bold text-foreground">{user.name}</p>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-lg">🪙</span>
              <span className="font-display text-sm font-bold text-primary">{coins}</span>
            </div>
          </div>
          <img
            src={user.avatar || iconUsuario}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-primary/30 shadow-md"
          />
          <button
            onClick={() => navigate("/config")}
            className="ml-1 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            title="Configurações"
          >
            ⚙️
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="scale-[0.6] sm:scale-[0.7] md:scale-[0.85] lg:scale-100">
          <OrbitMenu
            isAuthenticated={!!user}
            userName={user?.name}
            userAvatar={user?.avatar}
            onLoginClick={() => navigate("/login")}
            onLogout={handleLogout}
            onItemClick={handleItemClick}
          />
        </div>

        {/* Dedicatória + LemosPlay icons centered below orbit */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => setDedicatoriaOpen(true)}
            className="animate-pulse hover:animate-none hover:scale-110 transition-transform"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))" }}
            title="Dedicatória"
          >
            <img
              src={iconDedicatoria}
              alt="Dedicatória"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl"
            />
          </button>

          {user && (
            <button
              onClick={() => navigate("/lemosplay")}
              className="hover:scale-110 transition-transform px-5 py-3 rounded-2xl font-display font-extrabold text-white shadow-xl tracking-wide"
              style={{ background: "linear-gradient(135deg, #e50914, #b00610)" }}
              title="LemosPlay"
            >
              ▶ LemosPlay
            </button>
          )}
        </div>
      </div>

      <FeedbackFooter />
      <DedicatoriaModal open={dedicatoriaOpen} onOpenChange={setDedicatoriaOpen} />
    </div>
  );
}
