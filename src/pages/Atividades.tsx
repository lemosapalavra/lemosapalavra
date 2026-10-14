import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import JogosInterativos from "@/components/JogosInterativos";
import BrincandoBiblia from "@/components/BrincandoBiblia";

/** Cenário APRENDA: tarefas circulares flutuam sobre a imagem, como na página inicial. */
export default function Atividades() {
  const navigate = useNavigate();
  const [quizOpen, setQuizOpen] = useState(false);
  useEffect(() => {
    if (!quizOpen) return;
    const onBack = (event: Event) => { event.preventDefault(); setQuizOpen(false); };
    window.addEventListener("lemos:back", onBack);
    return () => window.removeEventListener("lemos:back", onBack);
  }, [quizOpen]);
  return (
    <main id="aprenda-novo" className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#bdebf7]">
      <img
        src="/Aprenda.png"
        alt="Aprenda — Jesus com crianças e a Bíblia"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
      />
      <BrincandoBiblia onBack={() => navigate("/")} />
      <button type="button" onClick={() => setQuizOpen(true)} aria-label="Quiz Bíblico" title="Quiz Bíblico" className="absolute left-[77%] top-[75%] z-30 aspect-square w-[clamp(72px,18vw,130px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-400 bg-emerald-800/80 p-1 shadow-[0_0_18px_4px_rgba(255,220,65,0.75)] animate-[lemosGentleFloat_5s_ease-in-out_infinite] hover:brightness-110"><img src="/Quiz Bíblico.png" alt="" className="h-full w-full rounded-full object-contain" /></button>
      {quizOpen && <JogosInterativos game="quiz" />}
    </main>
  );
}
