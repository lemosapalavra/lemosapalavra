import { useNavigate } from "react-router-dom";
import { BookOpen, Home, Sparkles } from "lucide-react";
import BrincandoBiblia from "@/components/BrincandoBiblia";

/**
 * Página APRENDA — versão reconstruída.
 * Somente as 16 atividades bíblicas interativas novas.
 * Os jogos e menus anteriores não são importados nem renderizados.
 */
export default function Atividades() {
  const navigate = useNavigate();

  return (
    <main
      id="aprenda-novo"
      className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-sky-300 via-amber-100 to-emerald-100 pb-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40" style={{
        backgroundImage: "radial-gradient(circle at 18% 14%, #fff8b5 0, transparent 26%), radial-gradient(circle at 83% 34%, #ffffff 0, transparent 23%), radial-gradient(circle at 50% 92%, #86efac 0, transparent 38%)"
      }} />

      <div className="relative mx-auto max-w-5xl px-4 pt-5">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2 rounded-full border-2 border-amber-400 bg-white px-4 py-2 font-bold text-amber-950 shadow-md hover:bg-amber-50">
            <Home className="h-5 w-5" aria-hidden="true" /> Início
          </button>
          <span className="rounded-full border-2 border-amber-400 bg-white px-3 py-1 text-xs font-extrabold tracking-wide text-amber-950 shadow">
            APRENDA • NOVA PÁGINA
          </span>
        </div>

        <header className="mx-auto mt-5 max-w-2xl rounded-[2rem] border-4 border-yellow-400 bg-white/95 px-5 py-5 text-center shadow-[0_10px_35px_rgba(120,76,0,0.25)]">
          <div className="flex justify-center gap-3 text-amber-500">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
            <BookOpen className="h-9 w-9" aria-hidden="true" />
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mt-2 font-display text-3xl font-black text-amber-950 sm:text-5xl">
            APRENDA
          </h1>
          <p className="mt-2 font-display text-base font-bold text-emerald-800 sm:text-lg">
            Descubra a Palavra de Deus brincando!
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            16 novas atividades bíblicas para escolher, responder e se divertir.
          </p>
        </header>

        <BrincandoBiblia onBack={() => navigate("/")} />
      </div>
    </main>
  );
}
