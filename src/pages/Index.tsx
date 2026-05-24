import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrbitMenu from "@/components/OrbitMenu";
// header/footer removed for a cleaner home
import DedicatoriaModal from "@/components/DedicatoriaModal";
import { useCoins, ensureInitialCoins, addCoins } from "@/hooks/useCoins";

import iconDedicatoria from "@/assets/icon-dedicatoria.png";

const labelToRoute: Record<string, string> = {
  "LEMOS PLAY": "/lemosplay",
  "DEVOCIONAIS": "/devocionais",
  "PEDIDOS\nDE ORAÇÃO": "/pedidos-oracao",
  "ATIVIDADES": "/atividades",
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
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
    >
      {/* Discrete config button (only when authenticated) */}
      {user && (
        <button
          onClick={() => navigate("/config")}
          className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-white/60 hover:bg-white shadow flex items-center justify-center transition"
          title="Configurações"
        >
          ⚙️
        </button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center w-full py-4">
        <OrbitMenu
          isAuthenticated={!!user}
          userName={user?.name}
          userAvatar={user?.avatar}
          onLoginClick={() => navigate("/login")}
          onLogout={handleLogout}
          onItemClick={handleItemClick}
        />

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={() => setDedicatoriaOpen(true)}
            className="animate-pulse hover:animate-none hover:scale-110 transition-transform"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))" }}
            title="Dedicatória"
          >
            <img
              src={iconDedicatoria}
              alt="Dedicatória"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl"
            />
          </button>
        </div>
      </div>

      <DedicatoriaModal open={dedicatoriaOpen} onOpenChange={setDedicatoriaOpen} />
    </div>
  );
}
