import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MysticBackground from "@/components/MysticBackground";
import Index from "./pages/Index.tsx";
import { useAnalyticsTracker } from "@/hooks/useAnalyticsTracker";

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

const queryClient = new QueryClient();

const AnalyticsTracker = () => {
  useAnalyticsTracker();
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
        <AnalyticsTracker />
        <MysticBackground />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
