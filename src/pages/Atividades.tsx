import { useNavigate } from "react-router-dom";
import BrincandoBiblia from "@/components/BrincandoBiblia";

/** APRENDA: imagem original como cenário, com os ícones das tarefas sobrepostos. */
export default function Atividades() {
  const navigate = useNavigate();
  return (
    <main id="aprenda-novo" className="relative min-h-[100dvh] overflow-x-hidden bg-[#bdebf7]">
      <div className="relative mx-auto w-full max-w-[680px]">
        <img src="/Aprenda.png" alt="Aprenda — Jesus e as crianças descobrindo a Palavra" className="block h-auto w-full" />
        <button type="button" onClick={() => navigate("/")} aria-label="Voltar ao início" className="absolute left-[3%] top-[2%] z-30 rounded-full border-2 border-amber-400 bg-white/90 px-3 py-2 text-sm font-bold text-amber-950 shadow-lg">← Início</button>
        <BrincandoBiblia onBack={() => navigate("/")} />
      </div>
    </main>
  );
}
