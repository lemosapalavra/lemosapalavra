import { useEffect, useState } from "react";
import JogosInterativos from "@/components/JogosInterativos";
import { isAllowed } from "@/lib/contentAccess";

const ALL_GAMES = [
  { id: "memory", title: "Memória Bíblica", icon: "/memoria.webp" },
  { id: "jigsaw", title: "Quebra-Cabeça", icon: "/Quebra-Cabeça.webp" },
  { id: "wordbuilder", title: "Construtor de Palavras", icon: "/Construa%20Palavras.webp" },
  { id: "quiz", title: "Quiz Bíblico", icon: "/Quiz%20B%C3%ADblico.webp" },
];

const positions = [
  { left: "17%", top: "40%" },
  { left: "83%", top: "40%" },
  { left: "17%", top: "76%" },
  { left: "83%", top: "76%" },
];

export default function Jogos() {
  const [selectedGame, setSelectedGame] = useState<"memory"|"jigsaw"|"wordbuilder"|"quiz"|null>(null);
  useEffect(() => {
    if (!selectedGame) return;
    const onBack = (event: Event) => { event.preventDefault(); setSelectedGame(null); };
    window.addEventListener("lemos:back", onBack);
    return () => window.removeEventListener("lemos:back", onBack);
  }, [selectedGame]);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("lemos:lia-context", { detail: selectedGame }));
    return () => { window.dispatchEvent(new CustomEvent("lemos:lia-context", { detail: null })); };
  }, [selectedGame]);
  const games = ALL_GAMES.filter((game) => isAllowed("jogos", game.id));
  return (
    <main id="faca-cenario" className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#bdebf7]">
      <img
        src="/Faça.webp"
        alt="FAÇA — cenário bíblico ilustrado"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
      />
      <h1 className="sr-only">FAÇA — Jogos e atividades bíblicas</h1>
      <div className="pointer-events-none absolute inset-0 z-20">
        {games.map((game) => {
          const position = positions[ALL_GAMES.findIndex((g) => g.id === game.id)];
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => setSelectedGame(game.id as "memory" | "jigsaw" | "wordbuilder" | "quiz")}
              aria-label={game.title}
              title={game.title}
              className="absolute pointer-events-auto aspect-square w-[clamp(88px,20vw,152px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent p-0 drop-shadow-[0_0_10px_rgba(255,220,65,0.6)] animate-[lemosGentleFloat_5s_ease-in-out_infinite] hover:brightness-110 focus-visible:outline-4 focus-visible:outline-white"
              style={{...position,animationDelay:`${ALL_GAMES.findIndex((g) => g.id === game.id)*0.7}s`}}
            >
              <img src={game.icon} alt="" className="h-full w-full object-contain" />
            </button>
          );
        })}
      </div>
      {selectedGame && <JogosInterativos game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </main>
  );
}
