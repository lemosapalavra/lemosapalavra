import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// import MysticBackground from "@/components/MysticBackground"; // disabled for performance
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import ShareButton from "@/components/ShareButton";
import WavyBanner from "@/components/WavyBanner";
import NewContentNotice from "@/components/NewContentNotice";
import GuideTour from "@/components/GuideTour";
import MascoteLia from "@/components/MascoteLia";
import Index from "./pages/Index.tsx";
import { useAnalyticsTracker } from "@/hooks/useAnalyticsTracker";
import { supabase } from "@/integrations/supabase/client";
import { needsGlobalLogout, markGlobalLogoutDone, clearLocalSession } from "@/lib/sessionReset";
import { startAutoUpdate } from "@/lib/autoUpdate";
import { startAutoTitles } from "@/lib/autoTitles";

const Login = lazy(() => import("./pages/Login.tsx"));
const Biblia = lazy(() => import("./pages/Biblia.tsx"));
const Louvores = lazy(() => import("./pages/Louvores.tsx"));
const Devocionais = lazy(() => import("./pages/Devocionais.tsx"));
const PedidosOracao = lazy(() => import("./pages/PedidosOracao.tsx"));
const Atividades = lazy(() => import("./pages/Atividades.tsx"));
const Album = lazy(() => import("./pages/Album.tsx"));
const LemosPlay = lazy(() => import("./pages/LemosPlay.tsx"));
const Configuracao = lazy(() => import("./pages/Configuracao.tsx"));
const Estatisticas = lazy(() => import("./pages/Estatisticas.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const HistoriasBiblicas = lazy(() => import("./pages/HistoriasBiblicas.tsx"));
const AdminWhatsapp = lazy(() => import("./pages/AdminWhatsapp.tsx"));


const queryClient = new QueryClient();

const AnalyticsTracker = () => {
  useAnalyticsTracker();
  return null;
};

const BASE_URL = "https://lemosapalavra.live";
const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": { title: "Lemos a Palavra — Histórias Bíblicas para Crianças", description: "Histórias bíblicas em cartoon, louvores, devocionais e atividades para crianças." },
  "/login": { title: "Entrar — Lemos a Palavra", description: "Acesse sua conta para acompanhar seu progresso e figurinhas." },
  "/biblia": { title: "Bíblia — Lemos a Palavra", description: "Leia a Bíblia (Almeida) com resumos temáticos e dicionário bíblico." },
  "/louvores": { title: "Louvores — Lemos a Palavra", description: "Vídeos de louvor infantil para toda a família." },
  "/devocionais": { title: "Devocionais — Lemos a Palavra", description: "Devocionais diários para crianças e famílias." },
  "/pedidos-oracao": { title: "Pedidos de Oração — Lemos a Palavra", description: "Envie e acompanhe pedidos de oração com carinho." },
  "/atividades": { title: "Atividades — Lemos a Palavra", description: "Jogos interativos: colorir, caça-palavras, memória e quebra-cabeça." },
  "/album": { title: "Álbum de Figurinhas — Lemos a Palavra", description: "Colecione figurinhas bíblicas com raridades e molduras especiais." },
  "/lemosplay": { title: "Lemos Play — Vídeos Bíblicos", description: "Vídeos animados de histórias bíblicas: Gênesis, Jesus, Séries, Músicas e Louvores." },
  "/historias-biblicas": { title: "Histórias Bíblicas — Lemos a Palavra", description: "Histórias bíblicas ilustradas para crianças." },
  "/config": { title: "Configurações — Lemos a Palavra", description: "Configurações do site." },
  "/estatisticas": { title: "Estatísticas — Lemos a Palavra", description: "Painel de estatísticas de uso." },
};

const RouteMetaSync = () => {
  const location = useLocation();
  useEffect(() => {
    const meta = ROUTE_META[location.pathname] || ROUTE_META["/"];
    document.title = meta.title;
    const setMeta = (selector: string, attr: string, key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };
    setMeta('meta[name="description"]', "name", "description", meta.description);
    setMeta('meta[property="og:title"]', "property", "og:title", meta.title);
    setMeta('meta[property="og:description"]', "property", "og:description", meta.description);
    setMeta('meta[property="og:url"]', "property", "og:url", `${BASE_URL}${location.pathname}`);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", meta.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", meta.description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${BASE_URL}${location.pathname}`);
  }, [location.pathname]);
  return null;
};

const AuthBootstrap = () => {
  // Keeps the legacy `lemos_user` localStorage profile in sync with the
  // current Supabase session — so the user stays "logged in" across
  // devices and reloads instead of having to re-register every time.
  useEffect(() => {
    let cancelled = false;
    // Reinício global: desloga todo mundo uma única vez quando a "época"
    // de sessão muda (ver src/lib/sessionReset.ts).
    if (needsGlobalLogout()) {
      markGlobalLogoutDone();
      clearLocalSession();
      supabase.auth.signOut().catch(() => {});
      window.dispatchEvent(new Event("lemos_admin_change"));
    }

    const hydrate = async (userId: string, email: string | null) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, age_range, phone, role, avatar, email, created_at")
        .eq("id", userId)
        .maybeSingle();
      if (cancelled) return;
      let existing: Record<string, any> = {};
      try {
        const raw = localStorage.getItem("lemos_user");
        if (raw) existing = JSON.parse(raw) || {};
      } catch { existing = {}; }
      const u = {
        ...existing,
        name: profile?.name || existing.name || "",
        ageRange: profile?.age_range || existing.ageRange || "",
        phone: profile?.phone || existing.phone || "",
        role: profile?.role || existing.role || "",
        avatar: profile?.avatar || existing.avatar || "",
        email: profile?.email || email || existing.email || "",
        createdAt: profile?.created_at || existing.createdAt || new Date().toISOString(),
      };
      localStorage.setItem("lemos_user", JSON.stringify(u));
      window.dispatchEvent(new Event("lemos_admin_change"));
    };
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("lemos_user");
        localStorage.removeItem("lemos_admin_mode");
        window.dispatchEvent(new Event("lemos_admin_change"));
        return;
      }
      if (session?.user) hydrate(session.user.id, session.user.email);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) hydrate(data.session.user.id, data.session.user.email);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);
  return null;
};

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
  </div>
);

const AutoUpdater = () => {
  useEffect(() => startAutoUpdate(), []);
  useEffect(() => startAutoTitles(), []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AutoUpdater />
        <AuthBootstrap />
        <AnalyticsTracker />
        <RouteMetaSync />
        {/* MysticBackground removed to improve page load performance */}
        <FloatingWhatsapp />
        <NewContentNotice />
        <ShareButton />
        <GuideTour />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/biblia" element={<Biblia />} />
            <Route path="/louvores" element={<Louvores />} />
            <Route path="/devocionais" element={<Devocionais />} />
            <Route path="/pedidos-oracao" element={<PedidosOracao />} />
            <Route path="/atividades" element={<Atividades />} />
            <Route path="/album" element={<Album />} />
            <Route path="/config" element={<Configuracao />} />
            <Route path="/estatisticas" element={<Estatisticas />} />
            <Route path="/lemosplay" element={<LemosPlay />} />
            <Route path="/historias-biblicas" element={<HistoriasBiblicas />} />
            <Route path="/admin/whatsapp" element={<AdminWhatsapp />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <footer className="w-full px-4 pb-24 pt-2 bg-transparent">
          <WavyBanner
            emoji="✝️"
            lines={[
              "Este projeto é cristão, sem interesses financeiros, sem vínculo político ou denominacional,",
              "dedicado a compartilhar o Evangelho de Jesus Cristo simples para todas as gerações.",
            ]}
          />
        </footer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
