import { useIconVisible } from "@/lib/iconVisibility";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import DedicatoriaModal from "@/components/DedicatoriaModal";
import InstallShortcut from "@/components/InstallShortcut";

import HomeTopNav from "@/components/HomeTopNav";
import EventBannerKart from "@/components/EventBannerKart";
import EventBannerPlane from "@/components/EventBannerPlane";


import { ensureInitialCoins, addCoins } from "@/hooks/useCoins";
import { loadOrbit } from "@/data/orbitConfig";

const vejaFlutuante = "/veja-flutuante.png";
const oucaFlutuante = "/ouca-flutuante.png";
const aprendaFlutuante = "/aprenda-flutuante.png";
const facaFlutuante = "/faca-flutuante.png";
const albumFlutuante = "/album-flutuante.png";

export default function Index() {
  return <IndexV1 />;
}

function IndexV1() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [dedicatoriaOpen, setDedicatoriaOpen] = useState(false);
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
      className="lemos-home-viewport h-[100dvh] min-h-0 flex flex-col items-center overflow-hidden relative"
      style={{ backgroundColor: "#c9effd" }}
    >
      {/* Menu superior ilustrado: substitui a barra antiga e o menu hambúrguer. */}
      <header className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-b from-[#e9c786]/90 via-[#e9c786]/55 to-transparent">
        <div className="mx-auto w-full max-w-screen-2xl flex items-start justify-center gap-1 pl-1 pr-[135px] sm:pl-[155px] sm:pr-[200px]">
          <HomeTopNav />

        </div>
      </header>

      {/* 14-Bis animado, acima do cenário e abaixo dos controles do usuário. */}
      <EventBannerPlane isAuthenticated={!!user?.name} />

      {/* Fundos enviados ao GitHub: vertical para celular e horizontal para desktop. */}
      <picture aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 block overflow-hidden">
        <source media="(min-width: 768px)" srcSet="/Pagina%20inicial%20Computador.png" />
        <img
          src="/APagina%20Inicial%20celular.webp?v=20261015-3"
          alt=""
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <h1 className="sr-only">Lemos a Palavra — Conteúdo Bíblico Infantil</h1>

      {/* Os cinco botões são áreas clicáveis sobre os ícones impressos na imagem.
          A camada cobre a mesma área da imagem de fundo, incluindo o cabeçalho. */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {([
          { label: "VEJA", image: vejaFlutuante, mobile: [52, 43], desktop: [50, 48] },
          { label: "OUÇA", image: oucaFlutuante, mobile: [22, 57], desktop: [24, 61] },
          { label: "APRENDA", image: aprendaFlutuante, mobile: [79, 57], desktop: [76, 61] },
          { label: "FAÇA", image: facaFlutuante, mobile: [30, 71], desktop: [32, 74] },
          { label: "ÁLBUM", image: albumFlutuante, mobile: [72, 71], desktop: [68, 74] },
        ] as const).map(({ label, image, mobile, desktop }, index) => (
          <button
            key={label}
            type="button"
            title={`Abrir ${label}`}
            aria-label={`Abrir ${label}`}
            onClick={() => handleItemClick(label)}
            className="home-image-hotspot absolute pointer-events-auto z-20 w-[25%] max-w-[180px] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent cursor-pointer touch-manipulation focus-visible:outline focus-visible:outline-4 focus-visible:outline-amber-400"
            style={{
              left: `${mobile[0]}%`,
              top: `${mobile[1]}%`,
              ["--desktop-x" as string]: `${desktop[0]}%`,
              ["--desktop-y" as string]: `${desktop[1]}%`,
              ["--float-delay" as string]: `${index * -0.65}s`,
            }}
          >
            <img src={image} alt="" draggable={false} className="home-floating-icon block w-full h-full object-contain drop-shadow-lg" />
          </button>
        ))}
      </div>
      <style>{`
        body:has(.lemos-home-viewport) { padding-bottom: 0 !important; overflow-y: hidden; }
        html:has(.lemos-home-viewport) { overflow-y: hidden; }
        @keyframes homeIconFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        .home-floating-icon { animation: homeIconFloat 3.8s ease-in-out infinite; animation-delay: var(--float-delay, 0s); }
        @media (prefers-reduced-motion: reduce) { .home-floating-icon { animation: none; } }
        @media (min-width: 768px) { .home-image-hotspot { left: var(--desktop-x) !important; top: var(--desktop-y) !important; width: min(12vw, 180px); } }
      `}</style>

      <main className="relative z-10 w-full min-h-0 flex-1 flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
           {dedicatoriaVisible && <div className="fixed bottom-3 right-2 sm:right-5 z-[45] flex flex-col items-center animate-[homeIconFloat_3.8s_ease-in-out_infinite]">
             <Button variant="ghost" size="icon"
              onClick={() => setDedicatoriaOpen(true)}
                className="w-[88px] h-[88px] sm:w-[110px] sm:h-[110px] p-0 rounded-full border-[3px] border-white bg-transparent shadow-[0_0_0_2px_rgba(251,191,36,.8),0_5px_18px_rgba(0,0,0,.5)] hover:bg-transparent hover:scale-110 hover:brightness-110 hover:shadow-[0_0_22px_rgba(255,255,255,.9)] active:scale-95 focus-visible:ring-4 focus-visible:ring-amber-400 transition-all duration-200 cursor-pointer"
              title="Dedicatória"
              aria-label="Abrir dedicatória"
            >
              <img loading="lazy" decoding="async" src="/Dedicat%C3%B3ria.png" alt="" className="h-full w-full object-contain drop-shadow-lg" />
             </Button>

          </div>}

        </div>
      </main>


      <div className="fixed bottom-3 left-[40%] -translate-x-1/2 z-[46] flex flex-col items-center animate-[homeIconFloat_3.8s_ease-in-out_infinite]"><InstallShortcut compact /></div>
      <DedicatoriaModal open={dedicatoriaOpen} onOpenChange={setDedicatoriaOpen} />

    </div>
  );
}
