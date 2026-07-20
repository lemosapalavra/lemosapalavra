import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// import MysticBackground from "@/components/MysticBackground"; // disabled for performance
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import Index from "./pages/Index.tsx";
import { useAnalyticsTracker } from "@/hooks/useAnalyticsTracker";
import { supabase } from "@/integrations/supabase/client";

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

const AuthBootstrap = () => {
  // Keeps the legacy `lemos_user` localStorage profile in sync with the
  // current Supabase session — so the user stays "logged in" across
  // devices and reloads instead of having to re-register every time.
  useEffect(() => {
    let cancelled = false;
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthBootstrap />
        <AnalyticsTracker />
        {/* MysticBackground removed to improve page load performance */}
        <FloatingWhatsapp />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
