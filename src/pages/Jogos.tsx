import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import logoCentral from "@/assets/logo-central.png";
import iconJogos from "@/assets/home/icon-jogos-v2.png";
import iconMemoria from "@/assets/jogos/icon-memoria.png";
import iconLabirinto from "@/assets/jogos/icon-labirinto.png";
import iconQuebraCabeca from "@/assets/jogos/icon-quebra-cabeca.png";
import iconPalavras from "@/assets/jogos/icon-palavras.png";
import iconQuiz from "@/assets/jogos/icon-quiz.png";
import { isAllowed } from "@/lib/contentAccess";

const ALL_GAMES = [
  { id: "memory", title: "Memória Bíblica", icon: iconMemoria, path: "/atividades?jogo=memory" },
  { id: "maze", title: "Labirinto", icon: iconLabirinto, path: "/atividades?jogo=maze" },
  { id: "jigsaw", title: "Quebra-Cabeça", icon: iconQuebraCabeca, path: "/atividades?jogo=jigsaw" },
  { id: "wordbuilder", title: "Construtor de Palavras", icon: iconPalavras, path: "/atividades?jogo=wordbuilder" },
  { id: "quiz", title: "Quiz Bíblico", icon: iconQuiz, path: "/atividades?jogo=quiz" },
];

export default function Jogos() {
  const navigate = useNavigate();
  const games = ALL_GAMES.filter((g) => isAllowed("jogos", g.id));

  return (
    <main className="relative min-h-[100dvh] overflow-hidden px-4 pb-24" style={{ background: "radial-gradient(circle at 50% 36%, #fff7c8 0%, transparent 45%), linear-gradient(180deg, #82d4fa 0%, #c8f5e1 42%, #a4d67d 70%, #54a663 100%)" }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-emerald-800/30 to-transparent" /><div className="relative z-10 mx-auto max-w-5xl">
        <PageHeader title="FAÇA — Jardim das Aventuras" icon={iconJogos} /><p className="mx-auto mb-5 max-w-md rounded-full border border-amber-300 bg-amber-50/85 px-5 py-2 text-center text-sm font-semibold text-amber-950 shadow-md">Escolha um jogo e descubra as aventuras da Palavra!</p>

        <div className="flex justify-center">
          <div className="relative orbit-area-jogos w-[min(94vw,340px)] h-[min(94vw,340px)] sm:w-[min(90vw,440px)] sm:h-[min(90vw,440px)] lg:w-[min(92vw,640px)] lg:h-[min(92vw,640px)]">
            <div className="absolute inset-0 orbit-spin">
              {games.length > 1 && <svg aria-hidden="true" className="absolute left-1/2 top-1/2 pointer-events-none overflow-visible -translate-x-1/2 -translate-y-1/2" style={{ width: "calc(2 * var(--orbit-radius))", height: "calc(2 * var(--orbit-radius))" }} viewBox="0 0 100 100">
                <polygon points={(games.length === 5 ? [0, 2, 4, 1, 3] : Array.from({ length: games.length }, (_, i) => i)).map((i) => { const angle = (i * 360 / games.length - 90) * Math.PI / 180; return [50 + 50 * Math.cos(angle), 50 + 50 * Math.sin(angle)].join(","); }).join(" ")} fill="none" stroke="#d5a547" strokeWidth="0.55" opacity="0.75" vectorEffect="non-scaling-stroke" />
              </svg>}
              {games.map((game, i) => {
                const angle = (360 / games.length) * i - 90;
                return (
                  <div
                    key={game.id}
                    className="absolute top-1/2 left-1/2"
                    style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translate(var(--orbit-radius)) rotate(${-angle}deg)` }}
                  >
                    <div className="orbit-spin-rev">
                      <button
                        type="button"
                        onClick={() => navigate(game.path)}
                        title={game.title}
                        aria-label={game.title}
                        className="flex flex-col items-center gap-1 cursor-pointer transition-transform duration-300 hover:scale-110 hover:-translate-y-1 active:scale-105 focus-visible:scale-110"
                      >
                        <span className="relative block overflow-hidden rounded-full shadow-xl w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] bg-transparent">
                          <img src={game.icon} alt={game.title} width={1024} height={1024} loading="lazy" className="w-full h-full object-contain" />
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <img
              src={logoCentral}
              alt="Lemos a Palavra"
              width={320}
              height={320}
              loading="lazy"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl w-[80px] sm:w-[120px] lg:w-[190px]"
            />
          </div>
        </div>

        <style>{`
          .orbit-area-jogos { --orbit-radius: clamp(112px, 31vw, 132px); }
          @media (min-width: 640px) { .orbit-area-jogos { --orbit-radius: clamp(135px, 27vw, 170px); } }
          @media (min-width: 1024px) { .orbit-area-jogos { --orbit-radius: clamp(190px, 28vw, 250px); } }
          @keyframes orbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .orbit-area-jogos .orbit-spin { animation: orbitSpin 90s linear infinite; }
          .orbit-area-jogos .orbit-spin-rev { animation: orbitSpin 90s linear infinite reverse; }
          .orbit-area-jogos:hover .orbit-spin, .orbit-area-jogos:hover .orbit-spin-rev,
          .orbit-area-jogos:focus-within .orbit-spin, .orbit-area-jogos:focus-within .orbit-spin-rev { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) { .orbit-area-jogos .orbit-spin, .orbit-area-jogos .orbit-spin-rev { animation: none; } }
        `}</style>
      </div>
    </main>
  );
}
