import { useNavigate } from "react-router-dom";
import BrincandoBiblia from "@/components/BrincandoBiblia";
import { useEffect, useState } from "react";
import JogosInterativos from "@/components/JogosInterativos";

/** Cenario APRENDA com quatro desafios Quem Sou Eu. */
export default function Atividades() {
  const navigate = useNavigate();
  const [selectedGame,setSelectedGame] = useState<"memory"|"jigsaw"|"wordbuilder"|"quiz"|null>(null);
  useEffect(() => {
    if (!selectedGame) return;
    window.dispatchEvent(new CustomEvent("lemos:lia-context", { detail: selectedGame }));
    return () => { window.dispatchEvent(new CustomEvent("lemos:lia-context", { detail: null })); };
  }, [selectedGame]);
  useEffect(() => {
    if (!selectedGame) return;
    const handleBack = (event: Event) => {
      event.preventDefault();
      setSelectedGame(null);
    };
    window.addEventListener("lemos:back", handleBack);
    return () => window.removeEventListener("lemos:back", handleBack);
  }, [selectedGame]);

  return (
    <main id="aprenda-novo" className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#bdebf7]">
      <img
        src="/Aprenda.webp"
        alt="Aprenda — Jesus com crianças e a Bíblia"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center opacity-80"
      />
      <BrincandoBiblia onBack={() => navigate("/")} onGameSelect={setSelectedGame} />
      {selectedGame && <JogosInterativos game={selectedGame} onClose={()=>setSelectedGame(null)} />}
    </main>
  );
}
