import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Biblia from "./pages/Biblia.tsx";
import Louvores from "./pages/Louvores.tsx";
import Musicas from "./pages/Musicas.tsx";
import Devocionais from "./pages/Devocionais.tsx";
import PedidosOracao from "./pages/PedidosOracao.tsx";
import Atividades from "./pages/Atividades.tsx";
import Historias from "./pages/Historias.tsx";
import Album from "./pages/Album.tsx";
import Configuracao from "./pages/Configuracao.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/biblia" element={<Biblia />} />
          <Route path="/louvores" element={<Louvores />} />
          <Route path="/musicas" element={<Musicas />} />
          <Route path="/devocionais" element={<Devocionais />} />
          <Route path="/pedidos-oracao" element={<PedidosOracao />} />
          <Route path="/atividades" element={<Atividades />} />
          <Route path="/historias" element={<Historias />} />
          <Route path="/album" element={<Album />} />
          <Route path="/config" element={<Configuracao />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
