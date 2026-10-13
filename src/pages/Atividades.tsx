import { useNavigate } from "react-router-dom";
import { BookHeart } from "lucide-react";
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
      <BrincandoBiblia onBack={() => navigate("/")} />
      <button type="button" onClick={() => navigate("/devocionais")} aria-label="Abrir Devocional" title="Devocional" className="absolute left-[77%] top-[73%] z-30 flex aspect-square w-[clamp(72px,18vw,130px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-yellow-400 bg-gradient-to-br from-emerald-500 to-green-950 p-2 text-white shadow-[0_0_18px_5px_rgba(255,222,60,.8)] animate-[lemosGentleFloat_5s_ease-in-out_infinite] hover:brightness-110" style={{animationDelay:"1.2s"}}><BookHeart className="h-9 w-9 sm:h-14 sm:w-14"/><span className="text-[10px] font-extrabold sm:text-sm">Devocional</span></button>
    </main>
  );
}
