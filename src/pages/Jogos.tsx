import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import iconJogos from "@/assets/home/icone-jogos.png.asset.json";
import domino from "@/assets/jogos/domino.webp.asset.json";
import memoria from "@/assets/jogos/memoria.webp.asset.json";
import mico from "@/assets/jogos/mico.webp.asset.json";
import quiz from "@/assets/jogos/quiz.webp.asset.json";
import quemSouEu from "@/assets/jogos/quem-sou-eu.webp.asset.json";
import montePalavras from "@/assets/jogos/monte-palavras.webp.asset.json";
import dominoPdf from "@/assets/jogos/domino.pdf.asset.json";
import memoriaPdf from "@/assets/jogos/memoria.pdf.asset.json";
import micoPdf from "@/assets/jogos/mico.pdf.asset.json";
import quizPdf from "@/assets/jogos/quiz.pdf.asset.json";
import maesPdf from "@/assets/jogos/maes.pdf.asset.json";
import labirinto from "@/assets/labirinto-novo/alegria.jpg.asset.json";
import { suppliedPuzzles } from "@/data/jogosPuzzles";

const games = [
  { title: "Memória Bíblica", image: memoria.url, path: "/atividades?jogo=memory" },
  { title: "Labirinto", image: labirinto.url, path: "/atividades?jogo=maze" },
  { title: "Quebra-Cabeça", image: suppliedPuzzles[0].image, path: "/atividades?jogo=jigsaw" },
  { title: "Construtor de Palavras", image: montePalavras.url, path: "/atividades?jogo=wordbuilder" },
  { title: "Quiz Bíblico", image: quiz.url, path: "/atividades?jogo=quiz" },
];
const printGames = [
  { title: "Dominó Bíblico", image: domino.url, url: dominoPdf.url },
  { title: "Memória Bíblica do anexo", image: memoria.url, url: memoriaPdf.url },
  { title: "Mico Bíblico", image: mico.url, url: micoPdf.url },
  { title: "Quiz Bíblico do anexo", image: quiz.url, url: quizPdf.url },
  { title: "Quem Sou Eu?", image: quemSouEu.url, url: maesPdf.url },
];

export default function Jogos() {
  return <main className="min-h-screen bg-background px-4 pb-24">
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Jogos" icon={iconJogos.url} />
      <h1 className="font-display text-3xl font-extrabold text-center text-foreground mt-5 mb-6">Jogos Bíblicos</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {games.map((game) => <Link key={game.title} to={game.path} className="flex flex-col overflow-hidden border-2 border-border rounded-md bg-card shadow-sm transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring">
          <img src={game.image} alt="" loading="lazy" className="w-full aspect-[4/3] object-contain bg-background p-2" />
          <span className="font-display font-bold text-center text-foreground text-sm sm:text-base p-2">{game.title}</span>
        </Link>)}
      </div>
      <h2 className="font-display text-xl font-extrabold text-foreground mt-8 mb-4">Jogos para imprimir</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {printGames.map((game) => <a key={game.title} href={game.url} target="_blank" rel="noopener noreferrer" className="flex flex-col overflow-hidden border-2 border-border rounded-md bg-card shadow-sm transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring">
          <img src={game.image} alt="" loading="lazy" className="w-full aspect-[4/3] object-contain bg-background p-2" />
          <span className="font-display font-bold text-center text-foreground text-sm sm:text-base p-2">{game.title} ↗</span>
        </a>)}
      </div>
    </div>
  </main>;
}
