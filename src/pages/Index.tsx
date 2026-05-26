import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import OrbitMenu from "@/components/OrbitMenu";
import DedicatoriaModal from "@/components/DedicatoriaModal";
import IndexAdminPanel from "@/components/IndexAdminPanel";
import { useCoins, ensureInitialCoins, addCoins } from "@/hooks/useCoins";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { loadOrbit } from "@/data/orbitConfig";

import iconDedicatoria from "@/assets/icon-dedicatoria.png";

export default function Index() {
  const navigate = useNavigate();
  const { coins } = useCoins();
  const isAdmin = useIsAdmin();
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [dedicatoriaOpen, setDedicatoriaOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

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
    const items = loadOrbit();
    const found = items.find((x) => x.label === label);
    if (found?.route) navigate(found.route);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
    >
      {user && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setAdminOpen(true)}
              className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition"
              title="Configurar página inicial"
              aria-label="Configurar"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          )}
          <button
            onClick={() => navigate("/config")}
            className="w-10 h-10 rounded-full bg-white/60 hover:bg-white shadow flex items-center justify-center transition"
            title="Configurações"
          >
            ⚙️
          </button>
        </div>
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
            <img src={iconDedicatoria} alt="Dedicatória" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl" />
          </button>
        </div>
      </div>

      <DedicatoriaModal open={dedicatoriaOpen} onOpenChange={setDedicatoriaOpen} />
      <IndexAdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}
