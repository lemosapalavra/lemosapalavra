import { useEffect, useState } from "react";
import JogosInterativos from "@/components/JogosInterativos";
import { Link2 } from "lucide-react";
import { isAllowed } from "@/lib/contentAccess";

const ALL_GAMES = [
  { id: "memory", title: "Memória Bíblica", icon: "/Jogo%20da%20Mem%C3%B3ria.png" },
  { id: "jigsaw", title: "Quebra-Cabeça", icon: "/Quebra-Cabe%C3%A7a.png" },
  { id: "wordbuilder", title: "Construtor de Palavras", icon: "/Monte%20Palavras.png" },
  { id: "pairs", title: "Ligue os Pares", icon: null },
];

const positions = [
  { left: "23%", top: "43%" },
  { left: "77%", top: "43%" },
  { left: "23%", top: "73%" },
  { left: "77%", top: "73%" },
];

export default function Jogos() {
  const [selectedGame, setSelectedGame] = useState<"memory"|"jigsaw"|"wordbuilder"|"pairs"|null>(null);
  useEffect(() => {
    if (!selectedGame) return;
    const onBack = (event: Event) => { event.preventDefault(); setSelectedGame(null); };
    window.addEventListener("lemos:back", onBack);
    return () => window.removeEventListener("lemos:back", onBack);
  }, [selectedGame]);
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
              onClick={() => setSelectedGame(game.id as "memory"|"jigsaw"|"wordbuilder"|"pairs")}
              aria-label={game.title}
              title={game.title}
              className="absolute pointer-events-auto aspect-square w-[clamp(88px,20vw,152px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent p-0 drop-shadow-[0_0_10px_rgba(255,220,65,0.6)] animate-[lemosGentleFloat_5s_ease-in-out_infinite] hover:brightness-110 focus-visible:outline-4 focus-visible:outline-white"
              style={{...position,animationDelay:`${ALL_GAMES.findIndex((g) => g.id === game.id)*0.7}s`}}
            >
              {game.icon ? <img src={game.icon} alt="" className="h-full w-full object-contain" /> : <span className="flex h-full w-full flex-col items-center justify-center text-white"><Link2 className="h-9 w-9 sm:h-12 sm:w-12" /><span className="text-[10px] sm:text-sm font-bold text-center">Ligue os Pares</span></span>}
            </button>
          );
        })}
      </div>
      {selectedGame && <JogosInterativos game={selectedGame} onClose={() => setSelectedGame(null)} />}
    </main>
  );
}
