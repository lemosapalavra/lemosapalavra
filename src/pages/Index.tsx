import { useIconVisible } from "@/lib/iconVisibility";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrbitMenu from "@/components/OrbitMenu";
import DedicatoriaModal from "@/components/DedicatoriaModal";
import IndexAdminPanel from "@/components/IndexAdminPanel";

import HomeTopNav from "@/components/HomeTopNav";
import EventBannerKart from "@/components/EventBannerKart";
import EventBannerPlane from "@/components/EventBannerPlane";


import { ensureInitialCoins, addCoins } from "@/hooks/useCoins";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { loadOrbit } from "@/data/orbitConfig";

import iconDedicatoria from "@/assets/icon-dedicatoria.png";

export default function Index() {
  return <IndexV1 />;
}

function IndexV1() {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [dedicatoriaOpen, setDedicatoriaOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dedicatoriaVisible = useIconVisible("dedicatoria");

  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem("lemos_user");
        if (!stored) { setUser(null); return; }
        setUser(JSON.parse(stored));
        ensureInitialCoins();
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem("lemos_last_visit");
        if (lastVisit !== today) {
          addCoins(2);
          localStorage.setItem("lemos_last_visit", today);
        }
      } catch { setUser(null); }
    };
    syncUser();
    window.addEventListener("lemos_admin_change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("lemos_admin_change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
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
      <div aria-hidden className="h-[64px] md:h-[70px] w-full" />
      {/* Home Header */}
      <header
        className="w-full fixed top-0 left-0 right-0 z-30 bg-white/85 border-b border-amber-200/60 backdrop-blur-sm"
      >
        <div className="flex items-center justify-center px-3 sm:px-5 py-2">
          <div className="hidden md:flex justify-center">
            <HomeTopNav />
          </div>
          <Button type="button" variant="ghost" size="icon" className="md:hidden rounded-full" aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((v) => !v)}>{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</Button>
        </div>

         {/* Mobile: menu flutuante aberto por um único ícone */}
         {mobileMenuOpen && <div className="md:hidden absolute top-full inset-x-3 z-50 rounded-lg border border-border bg-background p-3 shadow-xl" onClick={() => setMobileMenuOpen(false)}>
          <HomeTopNav />
         </div>}
      </header>

      <h1 className="sr-only">Lemos a Palavra — Conteúdo Bíblico Infantil</h1>

      <main className="w-full flex-1 flex flex-col items-center pb-28 sm:pb-32 lg:pb-24">

        <div className="w-full flex flex-col items-center gap-1 sm:gap-2 px-4 pt-2 sm:pt-4 pb-2 text-center">
          <p className="font-display font-extrabold text-lg sm:text-2xl text-foreground">Bem-vindo! Aprenda, Brinque e Descubra a Palavra de Deus.</p>
          {user && isAdmin && <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setAdminOpen(true)} title="Configurar página inicial" aria-label="Configurar página inicial"><Settings /></Button>
            <Button variant="outline" size="icon" onClick={() => navigate("/config")} title="Configurações" aria-label="Configurações"><Settings /></Button>
          </div>}
        </div>

        <EventBannerPlane isAuthenticated={!!user} />
        <EventBannerKart isAuthenticated={!!user} />



        <div className="flex flex-col items-center w-full py-2">
          <OrbitMenu
            isAuthenticated={!!user}
            userName={user?.name}
            userAvatar={user?.avatar}
            onLoginClick={() => navigate("/login")}
            onLogout={handleLogout}
            onItemClick={handleItemClick}
          />

           {dedicatoriaVisible && <div className="mt-6 sm:mt-10 flex flex-col items-center gap-1">
             <Button variant="ghost" size="icon"
              onClick={() => setDedicatoriaOpen(true)}
                className="w-[66px] h-[66px] min-[390px]:w-[72px] min-[390px]:h-[72px] sm:w-[96px] sm:h-[96px] lg:w-[136px] lg:h-[136px] overflow-hidden rounded-full border-2 border-border bg-background shadow-lg icon-glow"
              title="Dedicatória"
              aria-label="Abrir dedicatória"
            >
              <img loading="lazy" decoding="async" src={iconDedicatoria} alt="" className="h-full w-full object-contain" />
             </Button>
             <span className="font-display font-extrabold text-xs text-foreground">DEDICATÓRIA</span>
          </div>}

        </div>
      </main>


      <DedicatoriaModal open={dedicatoriaOpen} onOpenChange={setDedicatoriaOpen} />
      <IndexAdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />

    </div>
  );
}
