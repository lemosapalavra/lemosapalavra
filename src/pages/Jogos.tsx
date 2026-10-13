import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
  { left: "15%", top: "40%" },
  { left: "13%", top: "66%" },
  { left: "87%", top: "66%" },
  { left: "50%", top: "85%" },
];

export default function Jogos() {
  const navigate = useNavigate();
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
      <button type="button" onClick={() => navigate(-1)} aria-label="Voltar à página anterior" title="Voltar à página anterior" className="absolute left-3 top-[72px] sm:top-[88px] z-[65] flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400 bg-white/95 text-amber-900 shadow-lg"><ArrowLeft size={24}/></button>
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
              className="absolute pointer-events-auto aspect-square w-[23%] max-w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-yellow-400 bg-emerald-800/80 p-1 shadow-[0_0_18px_4px_rgba(255,220,65,0.75)] animate-[lemosGentleFloat_5s_ease-in-out_infinite] hover:brightness-110 focus-visible:outline-4 focus-visible:outline-white"
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
