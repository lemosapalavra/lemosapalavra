import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import OrbitMenu from "@/components/OrbitMenu";
import DedicatoriaModal from "@/components/DedicatoriaModal";
import IndexAdminPanel from "@/components/IndexAdminPanel";


import { useCoins, ensureInitialCoins, addCoins } from "@/hooks/useCoins";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { loadOrbit } from "@/data/orbitConfig";

import iconDedicatoria from "@/assets/icon-dedicatoria.png";
import iconUsuario from "@/assets/icon-usuario.png";

export default function Index() {
  const navigate = useNavigate();
  const { coins } = useCoins();
  const isAdmin = useIsAdmin();
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [dedicatoriaOpen, setDedicatoriaOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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

  const handleLogout = async () => {
    try { await (await import("@/integrations/supabase/client")).supabase.auth.signOut(); } catch {}
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
      className="min-h-screen flex flex-col items-center overflow-hidden relative"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
    >
      {/* Home Header */}
      <header
        className="w-full sticky top-0 z-30 flex items-center justify-between px-3 sm:px-5 py-2 border-b border-amber-200/60 backdrop-blur-sm"
        style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
      >
        <div className="flex items-center gap-2">
          {user && isAdmin && (
            <>
              <button
                onClick={() => setAdminOpen(true)}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition"
                title="Configurar página inicial"
                aria-label="Configurar"
              >
                <Settings className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => navigate("/config")}
                className="w-9 h-9 rounded-full bg-white/60 hover:bg-white shadow flex items-center justify-center transition text-sm"
                title="Configurações"
              >
                ⚙️
              </button>
            </>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 shadow-sm">
              <span className="text-base leading-none">🪙</span>
              <span className="font-display font-extrabold text-sm text-amber-900 tabular-nums">{coins}</span>
            </div>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-white/60 transition"
                aria-label="Menu do usuário"
              >
                <span className="font-display font-bold text-xs sm:text-sm text-foreground hidden sm:inline max-w-[140px] truncate">
                  {user.name}
                </span>
                <img
                  src={user.avatar || iconUsuario}
                  alt={user.name || "Usuário"}
                  className="w-9 h-9 rounded-full border-2 border-amber-300 shadow object-cover"
                />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-amber-100">
                    <p className="font-display font-bold text-sm text-foreground truncate">{user.name}</p>
                    {user.email && <p className="font-body text-[11px] text-muted-foreground truncate">{user.email}</p>}
                  </div>
                  <button
                    onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-display font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

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
