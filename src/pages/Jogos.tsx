import { useState } from "react";
import JogosInterativos from "@/components/JogosInterativos";
import iconMemoria from "@/assets/jogos/icon-memoria.png";
import iconQuebraCabeca from "@/assets/jogos/icon-quebra-cabeca.png";
import iconPalavras from "@/assets/jogos/icon-palavras.png";
import iconQuiz from "@/assets/jogos/icon-quiz.png";
import { isAllowed } from "@/lib/contentAccess";

const ALL_GAMES = [
  { id: "memory", title: "Memória Bíblica", icon: iconMemoria },
  { id: "jigsaw", title: "Quebra-Cabeça", icon: iconQuebraCabeca },
  { id: "wordbuilder", title: "Construtor de Palavras", icon: iconPalavras },
  { id: "quiz", title: "Quiz Bíblico", icon: iconQuiz },
];

const positions = [
  { left: "23%", top: "43%" },
  { left: "77%", top: "43%" },
  { left: "23%", top: "73%" },
  { left: "77%", top: "73%" },
];

export default function Jogos() {
  const [selectedGame, setSelectedGame] = useState<"memory"|"maze"|"jigsaw"|"wordbuilder"|"quiz"|null>(null);
  const games = ALL_GAMES.filter((game) => isAllowed("jogos", game.id));
  return (
    <main id="faca-cenario" className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#bdebf7]">
      <img
        src="/Faça.png"
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
              onClick={() => setSelectedGame(game.id as "memory"|"maze"|"jigsaw"|"wordbuilder"|"quiz")}
              aria-label={game.title}
              title={game.title}
              className="absolute pointer-events-auto aspect-square w-[clamp(72px,18vw,130px)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-yellow-400 bg-emerald-800/80 p-1 shadow-[0_0_18px_4px_rgba(255,220,65,0.75)] animate-[lemosGentleFloat_5s_ease-in-out_infinite] hover:brightness-110 focus-visible:outline-4 focus-visible:outline-white"
              style={{...position,animationDelay:`${ALL_GAMES.findIndex((g) => g.id === game.id)*0.7}s`}}
            >
              <img src={game.icon} alt="" className="h-full w-full rounded-full object-contain" />
            </button>
          );
        })}
      </div>
      {selectedGame && <JogosInterativos game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </main>
  );
}
