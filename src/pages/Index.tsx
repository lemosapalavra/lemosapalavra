import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import OrbitMenu from "@/components/OrbitMenu";
import DedicatoriaModal from "@/components/DedicatoriaModal";
import IndexAdminPanel from "@/components/IndexAdminPanel";

import InstallShortcut from "@/components/InstallShortcut";
import HomeTopNav from "@/components/HomeTopNav";
import EventBannerKart from "@/components/EventBannerKart";
import IndexV2 from "@/pages/IndexV2";
import { loadSiteVersion, SITE_VERSION_EVENT } from "@/data/siteVersion";


import { useCoins, ensureInitialCoins, addCoins } from "@/hooks/useCoins";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { loadOrbit } from "@/data/orbitConfig";

import iconDedicatoria from "@/assets/icon-dedicatoria.png";
import iconUsuario from "@/assets/icon-usuario.png";

export default function Index() {
  const [version, setVersion] = useState(() => loadSiteVersion());
  useEffect(() => {
    const h = () => setVersion(loadSiteVersion());
    window.addEventListener(SITE_VERSION_EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(SITE_VERSION_EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  if (version === 2) return <IndexV2 />;
  return <IndexV1 />;
}

function IndexV1() {
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
      style={{ background: "transparent" }}
    >
      {/* espaçador do cabeçalho fixo */}
      <div aria-hidden className="h-[108px] w-full" />
      {/* Home Header */}
      <header
        className="w-full fixed top-0 left-0 right-0 z-30 bg-white/85 border-b border-amber-200/60 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-2">
          {/* Left: admin-only controls */}
          <div className="flex items-center gap-2 shrink-0">
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

          {/* Center: main navigation */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <HomeTopNav />
          </div>

          {/* Right: user fixed to the right of the page */}
          {user && (
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-white/60 transition"
                  aria-label="Menu do usuário"
                  title="Menu do usuário"
                >
                  <img loading="lazy" decoding="async"
                    src={user.avatar || iconUsuario}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = iconUsuario; }}
                    alt={user.name || "Usuário"}
                    className="w-10 h-10 rounded-full border-2 border-amber-300 shadow object-cover bg-white"
                  />
                  <span className="text-left leading-tight hidden sm:inline">
                    <span className="block font-display font-bold text-xs sm:text-sm text-foreground max-w-[180px] truncate">
                      Seja Bem vindo, {user.name}
                    </span>
                    <span className="block font-body text-[10px] sm:text-[11px] text-amber-800">
                      Deus Seja Louvado!
                    </span>
                  </span>
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
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 shadow-sm"
                title="Suas moedinhas"
                aria-label="Suas moedinhas"
              >
                <span className="text-base leading-none">🪙</span>
                <span className="font-display font-extrabold text-sm text-amber-900 tabular-nums">{coins}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: main navigation centered below */}
        <div className="md:hidden w-full px-3 pb-1.5">
          <HomeTopNav />
        </div>
      </header>

      <h1 className="sr-only">Lemos a Palavra — Conteúdo Bíblico Infantil</h1>

      <main className="w-full flex-1 flex flex-col items-center pb-28 sm:pb-32 lg:pb-24">

        <div className="w-full flex flex-col items-center gap-1 sm:gap-2 px-4 pt-2 sm:pt-4 pb-2 text-center">
          <p className="font-display font-extrabold text-lg sm:text-2xl text-foreground">
            Seja Bem vindo a Lemos a Palavra !
          </p>
          <p className="font-body text-sm sm:text-base text-muted-foreground max-w-md">
            Aqui você Estuda, Aprende e Brinca aprendendo sobre a Palavra de Deus.
          </p>
        </div>

        <div className="flex flex-col items-center w-full py-2">
          <OrbitMenu
            isAuthenticated={!!user}
            userName={user?.name}
            userAvatar={user?.avatar}
            onLoginClick={() => navigate("/login")}
            onLogout={handleLogout}
            onItemClick={handleItemClick}
          />

          <div className="mt-8 sm:mt-12 flex flex-col items-center gap-5">
            {user && <InstallShortcut compact />}
            <button
              onClick={() => setDedicatoriaOpen(true)}
              className="animate-pulse hover:animate-none hover:scale-110 transition-transform"
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))" }}
              title="Dedicatória"
            >
              <img loading="lazy" decoding="async" src={iconDedicatoria} alt="Ver dedicatória" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl" />
            </button>
          </div>

        </div>
      </main>


      <DedicatoriaModal open={dedicatoriaOpen} onOpenChange={setDedicatoriaOpen} />
      <IndexAdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />

    </div>
  );
}
