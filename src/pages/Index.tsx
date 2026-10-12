import { useIconVisible } from "@/lib/iconVisibility";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      style={{ backgroundColor: "#c9effd" }}
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

      {/* Fundos enviados ao GitHub: vertical para celular e horizontal para desktop. */}
      <picture aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 block overflow-hidden">
        <source media="(min-width: 768px)" srcSet="/Pagina%20inicial%20Computador.png" />
        <img
          src="/Pagina%20Inicial%20celular.png"
          alt=""
          className="h-full w-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
      </picture>
      <h1 className="sr-only">Lemos a Palavra — Conteúdo Bíblico Infantil</h1>

      {/* Os cinco botões são áreas clicáveis sobre os ícones impressos na imagem.
          A camada cobre a mesma área da imagem de fundo, incluindo o cabeçalho. */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {([
          { label: "VEJA", mobile: [49, 51], desktop: [50, 51] },
          { label: "OUÇA", mobile: [20, 65], desktop: [24, 65] },
          { label: "APRENDA", mobile: [79, 65], desktop: [76, 65] },
          { label: "FAÇA", mobile: [28, 79], desktop: [32, 79] },
          { label: "ÁLBUM", mobile: [70, 79], desktop: [68, 79] },
        ] as const).map(({ label, mobile, desktop }) => (
          <button
            key={label}
            type="button"
            title={`Abrir ${label}`}
            aria-label={`Abrir ${label}`}
            onClick={() => handleItemClick(label)}
            className="home-image-hotspot absolute pointer-events-auto z-20 w-[18%] max-w-[110px] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent cursor-pointer touch-manipulation focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-400"
            style={{
              left: `${mobile[0]}%`,
              top: `${mobile[1]}%`,
              ["--desktop-x" as string]: `${desktop[0]}%`,
              ["--desktop-y" as string]: `${desktop[1]}%`,
            }}
          />
        ))}
      </div>
      <style>{`@media (min-width: 768px) { .home-image-hotspot { left: var(--desktop-x) !important; top: var(--desktop-y) !important; width: min(8vw, 110px); } }`}</style>

      <main className="relative z-10 w-full flex-1 flex flex-col items-center pb-24 sm:pb-28 lg:pb-24">
        <div className="w-full flex flex-col items-center">
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
