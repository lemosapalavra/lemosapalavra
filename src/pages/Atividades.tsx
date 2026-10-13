import { useNavigate } from "react-router-dom";
import BrincandoBiblia from "@/components/BrincandoBiblia";

/** Cenário APRENDA: tarefas circulares flutuam sobre a imagem, como na página inicial. */
export default function Atividades() {
  const navigate = useNavigate();
  return (
    <main id="aprenda-novo" className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#bdebf7]">
      <img
        src="/Aprenda.png"
        alt="Aprenda — Jesus com crianças e a Bíblia"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
      />
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Voltar ao início"
        className="absolute left-3 top-[82px] z-30 rounded-full border-2 border-amber-400 bg-white/95 px-3 py-2 text-sm font-bold text-amber-950 shadow-lg sm:top-[92px]"
      >
        ← Início
      </button>
      <BrincandoBiblia onBack={() => navigate("/")} />
    </main>
  );
}
