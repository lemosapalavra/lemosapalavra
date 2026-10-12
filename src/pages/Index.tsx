import { useIconVisible } from "@/lib/iconVisibility";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrbitMenu from "@/components/OrbitMenu";
import DedicatoriaModal from "@/components/DedicatoriaModal";

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
      className="min-h-[100dvh] flex flex-col items-center overflow-hidden relative"
      style={{ background: "radial-gradient(ellipse at 55% 26%, #fff3b7 0%, transparent 37%), linear-gradient(180deg, #72cafa 0%, #c9effd 32%, #e5f8ce 59%, #76bf6b 100%)" }}
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

      {/* Paisagem decorativa responsiva: permanece atrás dos botões e da LIA. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[9%] top-[18%] h-24 w-24 rounded-full bg-white/60 blur-2xl sm:h-48 sm:w-48" />
        <div className="absolute right-[5%] top-[25%] h-28 w-32 rounded-full bg-white/65 blur-2xl sm:h-52 sm:w-60" />
        <div className="absolute -left-[35%] bottom-[3%] h-[40%] w-[110%] rounded-[50%] bg-gradient-to-b from-lime-300/70 to-green-700/80 sm:-left-[20%] sm:w-[85%]" />
        <div className="absolute -right-[45%] bottom-[-4%] h-[42%] w-[125%] rounded-[50%] bg-gradient-to-b from-emerald-300/70 to-emerald-800/80 sm:-right-[20%] sm:w-[90%]" />
        <div className="absolute left-1/2 bottom-[-20%] h-[53%] w-[55%] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-amber-100/90 via-amber-200/70 to-transparent blur-md" />
        <span className="absolute bottom-[13%] left-[9%] text-3xl drop-shadow-lg sm:text-5xl">🌼</span>
        <span className="absolute bottom-[23%] right-[12%] text-3xl drop-shadow-lg sm:text-5xl">🌻</span>
        <span className="absolute bottom-[5%] left-[34%] text-2xl drop-shadow-lg sm:text-4xl">🌷</span>
        <span className="absolute bottom-[35%] left-[4%] text-2xl opacity-80 sm:text-4xl">🦋</span>
        <span className="absolute bottom-[37%] right-[7%] text-2xl opacity-80 sm:text-4xl">🌿</span>
      </div>
      <h1 className="sr-only">Lemos a Palavra — Conteúdo Bíblico Infantil</h1>

      <main className="relative z-10 w-full flex-1 flex flex-col items-center pb-24 sm:pb-28 lg:pb-24">

        <div className="w-full flex flex-col items-center gap-1 sm:gap-2 px-4 pt-36 sm:pt-40 lg:pt-28 pb-3 text-center">
          <p className="font-display font-extrabold text-base sm:text-2xl text-amber-950 rounded-full border border-amber-300/70 bg-amber-50/85 px-4 py-2 shadow-md">Bem-vindo ao Jardim da Palavra!</p>
          {user && isAdmin && <Button variant="outline" size="icon" onClick={() => navigate("/config")} title="Painel completo de administração" aria-label="Abrir configurações do site"><Settings /></Button>}
        </div>

        <EventBannerPlane isAuthenticated={!!user} />
        <EventBannerKart isAuthenticated={!!user} />



        <div className="flex flex-col items-center w-full py-3 sm:py-6">
          <OrbitMenu
            isAuthenticated={!!user}
            userName={user?.name}
            userAvatar={user?.avatar}
            onLoginClick={() => navigate("/login")}
            onLogout={handleLogout}
            onItemClick={handleItemClick}
          />

           {dedicatoriaVisible && <div className="fixed bottom-3 right-3 sm:right-5 z-[45] flex flex-col items-center gap-2">
             <Button variant="ghost" size="icon"
              onClick={() => setDedicatoriaOpen(true)}
                className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] p-0 overflow-hidden rounded-full border-2 border-border bg-background shadow-lg icon-glow"
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

    </div>
  );
}
