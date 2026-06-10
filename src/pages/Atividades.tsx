import { useState, useEffect, useMemo, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import CelebrationAnimation from "@/components/CelebrationAnimation";
import CoinBadge from "@/components/CoinBadge";
import EducacionalActivities from "@/components/EducacionalActivities";
import iconQuiz from "@/assets/icon-quiz.png";
import iconAtividades from "@/assets/icon-atividades.png";
import iconMemoria from "@/assets/icon-memoria.png";
import iconQuebraCabeca from "@/assets/icon-quebracabeca.png";
import iconColorir from "@/assets/icon-colorir.png";
import icon7Erros from "@/assets/icon-7erros.png";
import logoCentral from "@/assets/logo-central.png";

import iconCacaPalavras from "@/assets/atividades/icone-caca-palavras.png.asset.json";
import iconLigueCores from "@/assets/atividades/icone-ligue-cores.png.asset.json";
import iconPinteCirculos from "@/assets/atividades/pinte-circulos.png.asset.json";

// Puzzle source images (real biblical scenes)
import imgCriacao from "@/assets/historia-criacao.png";
import imgNoe from "@/assets/historia-noe-1.png";
import imgNoe2 from "@/assets/historia-noe-2.png";
import imgDavi from "@/assets/historia-davi-golias.png";
import imgMoises from "@/assets/historia-moises-1.png";
import imgMoises2 from "@/assets/historia-moises-2.png";
import imgMandamentos from "@/assets/historia-10-mandamentos.png";
import imgAdaoEva from "@/assets/historia-adao-eva-1.png";

// 7 Erros — imagens pré-montadas (duas cenas empilhadas)
import spot1 from "@/assets/spot7erros/spot-1.jpg.asset.json";
import spot2 from "@/assets/spot7erros/spot-2.jpg.asset.json";
import spot3 from "@/assets/spot7erros/spot-3.jpg.asset.json";
import spot4 from "@/assets/spot7erros/spot-4.jpg.asset.json";
import spot5 from "@/assets/spot7erros/spot-5.jpg.asset.json";
import spot6 from "@/assets/spot7erros/spot-6.jpg.asset.json";
import spot7 from "@/assets/spot7erros/spot-7.jpg.asset.json";

// COLORIR — desenhos só de contorno (uploads do usuário)
import colorAbraao from "@/assets/colorir/abraao.jpg";
import colorAbraaoCordeiro from "@/assets/colorir/abraao-cordeiro.jpg";
import colorAdaoEva from "@/assets/colorir/adao-eva.jpg";
import colorArcaNoe from "@/assets/colorir/arca-noe.jpg";
import colorCestaMilagre from "@/assets/colorir/cesta-milagre.jpg";
import colorDaniel from "@/assets/colorir/daniel.jpg";
import colorDaviArpa from "@/assets/colorir/davi-arpa.jpg";
import colorDaviGolias from "@/assets/colorir/davi-golias.jpg";
import colorDaviOrando from "@/assets/colorir/davi-orando.jpg";
import colorDaviOvelha from "@/assets/colorir/davi-ovelha.jpg";

/* =========================================================
   QUIZ BÍBLICO — 30+ perguntas, categorias e explicações
   Inspirado em apregoandoabiblia.com
========================================================= */
type QuizQ = { cat: string; q: string; options: string[]; correct: number; ref: string };
const quizBank: QuizQ[] = [
  // Antigo Testamento
  { cat: "AT", q: "Quem construiu a arca por ordem de Deus?", options: ["Moisés", "Noé", "Abraão", "Davi"], correct: 1, ref: "Gênesis 6:14 — Noé obedeceu à ordem divina." },
  { cat: "AT", q: "Quantos dias e noites durou o dilúvio?", options: ["7", "40", "100", "365"], correct: 1, ref: "Gênesis 7:12 — Choveu 40 dias e 40 noites." },
  { cat: "AT", q: "Quem matou o gigante Golias?", options: ["Saul", "Josué", "Davi", "Sansão"], correct: 2, ref: "1 Samuel 17 — Davi com uma funda e cinco pedras." },
  { cat: "AT", q: "Qual é o primeiro livro da Bíblia?", options: ["Êxodo", "Gênesis", "Salmos", "Mateus"], correct: 1, ref: "Gênesis significa 'origem'." },
  { cat: "AT", q: "Quem foi jogado na cova dos leões?", options: ["Jonas", "Daniel", "Paulo", "Pedro"], correct: 1, ref: "Daniel 6 — Deus fechou a boca dos leões." },
  { cat: "AT", q: "Quantos mandamentos Deus deu a Moisés?", options: ["7", "10", "12", "40"], correct: 1, ref: "Êxodo 20 — Os Dez Mandamentos no Sinai." },
  { cat: "AT", q: "Quem interpretou os sonhos do Faraó?", options: ["José", "Daniel", "Moisés", "Salomão"], correct: 0, ref: "Gênesis 41 — José previu 7 anos de fartura e 7 de fome." },
  { cat: "AT", q: "Quem foi engolido por um grande peixe?", options: ["Jonas", "Jó", "Eliseu", "Elias"], correct: 0, ref: "Jonas 1:17 — 3 dias e 3 noites no ventre." },
  { cat: "AT", q: "Quem é considerado o pai da fé?", options: ["Adão", "Noé", "Abraão", "Moisés"], correct: 2, ref: "Romanos 4 — Abraão creu em Deus." },
  { cat: "AT", q: "Qual rei pediu sabedoria a Deus?", options: ["Davi", "Salomão", "Saul", "Ezequias"], correct: 1, ref: "1 Reis 3 — Salomão recebeu sabedoria sem igual." },
  { cat: "AT", q: "Quem abriu o Mar Vermelho?", options: ["Josué", "Arão", "Moisés", "Davi"], correct: 2, ref: "Êxodo 14 — Moisés estendeu o cajado." },
  { cat: "AT", q: "Qual a esposa de Abraão que riu da promessa?", options: ["Rebeca", "Sara", "Raquel", "Lia"], correct: 1, ref: "Gênesis 18 — Sara teve Isaque aos 90 anos." },
  { cat: "AT", q: "Quem perdeu a força ao ter o cabelo cortado?", options: ["Sansão", "Davi", "Gideão", "Saul"], correct: 0, ref: "Juízes 16 — Dalila o entregou." },
  { cat: "AT", q: "Qual irmão de Moisés foi seu porta-voz?", options: ["Arão", "Josué", "Calebe", "Levi"], correct: 0, ref: "Êxodo 4:14 — Arão falou ao Faraó." },
  { cat: "AT", q: "Quantos filhos teve Jacó?", options: ["10", "11", "12", "13"], correct: 2, ref: "Gênesis 35 — Origem das 12 tribos." },

  // Novo Testamento
  { cat: "NT", q: "Onde Jesus nasceu?", options: ["Nazaré", "Jerusalém", "Belém", "Cafarnaum"], correct: 2, ref: "Lucas 2 — Em Belém da Judeia." },
  { cat: "NT", q: "Quem batizou Jesus no Jordão?", options: ["Pedro", "Paulo", "João Batista", "Tiago"], correct: 2, ref: "Mateus 3:13 — João Batista batizou Jesus." },
  { cat: "NT", q: "Quantos discípulos Jesus escolheu?", options: ["10", "11", "12", "13"], correct: 2, ref: "Lucas 6:13 — Os 12 apóstolos." },
  { cat: "NT", q: "Qual foi o primeiro milagre de Jesus?", options: ["Curar cego", "Andar nas águas", "Água em vinho", "Multiplicar pães"], correct: 2, ref: "João 2 — Nas bodas de Caná." },
  { cat: "NT", q: "Quem traiu Jesus por 30 moedas de prata?", options: ["Pedro", "Tomé", "Judas Iscariotes", "Tiago"], correct: 2, ref: "Mateus 26:15." },
  { cat: "NT", q: "Quem negou Jesus três vezes?", options: ["João", "Pedro", "André", "Felipe"], correct: 1, ref: "Lucas 22:54-62." },
  { cat: "NT", q: "Em que dia Jesus ressuscitou?", options: ["Sexta", "Sábado", "Domingo", "Segunda"], correct: 2, ref: "Marcos 16 — No terceiro dia, domingo." },
  { cat: "NT", q: "Quem disse 'Eu sou o Caminho, a Verdade e a Vida'?", options: ["Moisés", "Paulo", "Jesus", "Pedro"], correct: 2, ref: "João 14:6." },
  { cat: "NT", q: "Quantos pães multiplicaram para 5 mil pessoas?", options: ["3", "5", "7", "12"], correct: 1, ref: "João 6 — 5 pães e 2 peixinhos." },
  { cat: "NT", q: "Qual apóstolo escreveu mais cartas no NT?", options: ["Pedro", "João", "Paulo", "Tiago"], correct: 2, ref: "Paulo escreveu 13 epístolas." },
  { cat: "NT", q: "Onde Jesus subiu aos céus?", options: ["Monte Sinai", "Monte das Oliveiras", "Gólgota", "Hermon"], correct: 1, ref: "Atos 1:9-12." },

  // Geral / Bíblia
  { cat: "GERAL", q: "Quantos livros tem a Bíblia (protestante)?", options: ["27", "39", "66", "73"], correct: 2, ref: "39 no AT + 27 no NT = 66." },
  { cat: "GERAL", q: "Qual o livro mais longo da Bíblia?", options: ["Gênesis", "Salmos", "Isaías", "Jeremias"], correct: 1, ref: "Salmos tem 150 capítulos." },
  { cat: "GERAL", q: "Qual o menor livro do NT?", options: ["Filemom", "3 João", "Judas", "Tito"], correct: 1, ref: "3 João tem apenas 1 capítulo, o mais curto." },
  { cat: "GERAL", q: "'No princípio era o ___': complete.", options: ["Amor", "Verbo", "Mundo", "Espírito"], correct: 1, ref: "João 1:1." },
  { cat: "GERAL", q: "Qual o fruto do Espírito que vem primeiro?", options: ["Paz", "Alegria", "Amor", "Bondade"], correct: 2, ref: "Gálatas 5:22." },
];

/* Helper: choose a biblical illustration for a quiz question based on keywords */
function quizImageFor(q: string, cat: string): string {
  const s = q.toLowerCase();
  if (/no[ée]|arca|dilúvio/.test(s)) return imgNoe;
  if (/davi|gol[ií]as|gigante/.test(s)) return imgDavi;
  if (/mois[ée]s|fara[óo]|mar vermelho|sinai|mandamento/.test(s)) return /mandamento/.test(s) ? imgMandamentos : imgMoises;
  if (/cria[çc][ãa]o|princ[ií]pio|verbo|gênesis|genesis/.test(s)) return imgCriacao;
  if (/ad[ãa]o|eva|[ée]den|serpente|jardim/.test(s)) return imgAdaoEva;
  if (/abra[ãa]o|sara|isaque|f[ée] do pai/.test(s)) return imgAdaoEva;
  if (/jonas|peixe|baleia/.test(s)) return imgNoe2;
  if (/sans[ãa]o|cabelo/.test(s)) return imgDavi;
  if (/jos[ée]|sonh|fara[óo]/.test(s)) return imgMoises2;
  if (/daniel|le[õo]es|cova/.test(s)) return imgMandamentos;
  if (/salom[ãa]o|sabedoria|rei/.test(s)) return imgMandamentos;
  if (/jesus|cristo|bel[ée]m|natal|jo[ãa]o batista|disc[ií]pulo|pedro|paulo|judas|ressurrei|p[ãa]es|milagre|caminho/.test(s)) return imgCriacao;
  return cat === "NT" ? imgCriacao : imgMandamentos;
}

const quizCategories = [
  { id: "ALL", label: "🎯 Tudo", color: "from-purple-400 to-pink-400" },
  { id: "AT", label: "📜 Antigo Testamento", color: "from-amber-400 to-orange-500" },
  { id: "NT", label: "✨ Novo Testamento", color: "from-sky-400 to-blue-500" },
  { id: "GERAL", label: "📖 Bíblia Geral", color: "from-emerald-400 to-teal-500" },
];

/* =========================================================
   MEMÓRIA — inspirado em paciencia.co/memoria
   3 níveis de dificuldade + cronômetro + movimentos
========================================================= */
// Memory uses the consistent Pixar 3D stickers (squares fit perfectly into card slots).
import mem01 from "@/assets/album/generated/herois-1.png";
import mem02 from "@/assets/album/generated/herois-2.png";
import mem03 from "@/assets/album/generated/herois-3.png";
import mem04 from "@/assets/album/generated/herois-4.png";
import mem05 from "@/assets/album/generated/herois-5.png";
import mem06 from "@/assets/album/generated/herois-6.png";
import mem07 from "@/assets/album/generated/herois-7.png";
import mem08 from "@/assets/album/generated/herois-8.png";
import mem09 from "@/assets/album/generated/criacao-1.png";
import mem10 from "@/assets/album/generated/criacao-4.png";
import mem11 from "@/assets/album/generated/criacao-5.png";
import mem12 from "@/assets/album/generated/criacao-8.png";
const memoryImages = [mem01, mem02, mem03, mem04, mem05, mem06, mem07, mem08, mem09, mem10, mem11, mem12];
const memorySets = {
  facil:   memoryImages.slice(0, 6),
  medio:   memoryImages.slice(0, 8),
  dificil: memoryImages.slice(0, 12),
};
const memoryConfig = {
  facil: { cols: 4, label: "Fácil (12 cartas)", coins: 2 },
  medio: { cols: 4, label: "Médio (16 cartas)", coins: 4 },
  dificil: { cols: 6, label: "Difícil (24 cartas)", coins: 7 },
};

/* =========================================================
   7 ERROS — imagens prontas (duas cenas empilhadas verticalmente)
   As coordenadas (x,y em %) referenciam o PAINEL DE BAIXO da imagem completa.
   A imagem original ocupa ~5–50% e a versão alterada ~52–98%.
========================================================= */
type SpotDiff = { x: number; y: number; r: number };
type SpotScene = { title: string; emoji: string; image: string; diffs: SpotDiff[] };

const spotScenes: SpotScene[] = [
  {
    title: "Fundo do Mar", emoji: "🐠", image: spot1.url,
    diffs: [
      { x: 38, y: 78, r: 7 },  // cavalo-marinho colorido
      { x: 25, y: 88, r: 7 },  // âncora removida
      { x: 92, y: 60, r: 6 },  // tartaruga removida
      { x: 22, y: 72, r: 6 },  // peixinho azul removido
      { x: 62, y: 88, r: 6 },  // concha
      { x: 78, y: 92, r: 7 },  // estrela do mar
      { x: 50, y: 85, r: 7 },  // baú aberto/fechado
    ],
  },
  {
    title: "Animais da Floresta", emoji: "🦒", image: spot2.url,
    diffs: [
      { x: 12, y: 72, r: 7 },  // borboleta roxa
      { x: 38, y: 60, r: 7 },  // casinha do passarinho removida
      { x: 22, y: 88, r: 7 },  // chapéu do elefante removido
      { x: 38, y: 78, r: 7 },  // banana do macaco removida
      { x: 88, y: 70, r: 7 },  // folha amarela na girafa
      { x: 72, y: 92, r: 6 },  // flores diferentes
      { x: 92, y: 95, r: 6 },  // flor removida
    ],
  },
  {
    title: "Crianças no Parque", emoji: "🧒", image: spot3.url,
    diffs: [
      { x: 22, y: 65, r: 7 },  // sol removido
      { x: 18, y: 72, r: 7 },  // casa removida
      { x: 30, y: 78, r: 7 },  // pintinho removido
      { x: 42, y: 70, r: 7 },  // pipa azul (era rosa)
      { x: 68, y: 65, r: 7 },  // abelha (era borboleta)
      { x: 22, y: 92, r: 7 },  // ovo cor diferente na cesta
      { x: 50, y: 95, r: 6 },  // ovo decorado mudou
    ],
  },
  {
    title: "Na Fazenda", emoji: "🐄", image: spot4.url,
    diffs: [
      { x: 28, y: 78, r: 8 },  // porquinho no lugar da vaca
      { x: 78, y: 72, r: 7 },  // espantalho sem pássaro
      { x: 50, y: 90, r: 6 },  // pintinhos a menos
      { x: 18, y: 92, r: 7 },  // só um patinho
      { x: 88, y: 95, r: 7 },  // melancia entre as abóboras
      { x: 95, y: 65, r: 6 },  // moinho mudou
      { x: 62, y: 92, r: 6 },  // patinho extra
    ],
  },
  {
    title: "Aventura no Mar", emoji: "🍍", image: spot5.url,
    diffs: [
      { x: 30, y: 68, r: 8 },  // janela do abacaxi (sem Bob)
      { x: 12, y: 72, r: 6 },  // Krusty Krab apagado
      { x: 50, y: 78, r: 6 },  // peixinho amarelo (era azul)
      { x: 22, y: 92, r: 6 },  // caracol com óculos
      { x: 82, y: 80, r: 8 },  // Sr. Siriguejo no lugar do Patrick
      { x: 90, y: 95, r: 6 },  // coral diferente
      { x: 78, y: 92, r: 6 },  // detalhe no chão
    ],
  },
  {
    title: "Piquenique no Parque", emoji: "🧺", image: spot6.url,
    diffs: [
      { x: 32, y: 65, r: 7 },  // balão verde (era vermelho)
      { x: 42, y: 68, r: 7 },  // avião no lugar do passarinho
      { x: 90, y: 88, r: 7 },  // tartaruga removida
      { x: 58, y: 88, r: 7 },  // uvas removidas
      { x: 50, y: 90, r: 6 },  // laranja removida
      { x: 18, y: 75, r: 6 },  // esquilo igual (decoração ao redor)
      { x: 28, y: 95, r: 7 },  // cachorrinho dormindo
    ],
  },
  {
    title: "Brincando na Rua", emoji: "🌳", image: spot7.url,
    diffs: [
      { x: 12, y: 72, r: 7 },  // laço amarelo (era vermelho)
      { x: 28, y: 80, r: 7 },  // camiseta da criança azul
      { x: 50, y: 70, r: 7 },  // passarinho azul (era amarelo)
      { x: 78, y: 72, r: 7 },  // criança boca aberta
      { x: 35, y: 92, r: 6 },  // flores diferentes
      { x: 62, y: 90, r: 6 },  // carrinho mudou
      { x: 92, y: 60, r: 6 },  // detalhe do céu
    ],
  },
];

/* =========================================================
   COLORIR — usa nossos próprios desenhos só de contorno.
   10 imagens no total; sorteia 4 por dia (alternando dia a dia).
========================================================= */
type ColoringPic = { id: string; title: string; img: string };
const coloringCatalog: ColoringPic[] = [
  { id: "abraao",          title: "Abraão",                  img: colorAbraao },
  { id: "abraao-cordeiro", title: "Abraão e o Cordeiro",     img: colorAbraaoCordeiro },
  { id: "adao-eva",        title: "Adão e Eva",              img: colorAdaoEva },
  { id: "arca-noe",        title: "A Arca de Noé",           img: colorArcaNoe },
  { id: "cesta-milagre",   title: "A Cesta do Milagre",      img: colorCestaMilagre },
  { id: "daniel",          title: "Daniel na Cova dos Leões",img: colorDaniel },
  { id: "davi-arpa",       title: "Davi e a Harpa",          img: colorDaviArpa },
  { id: "davi-golias",     title: "Davi e Golias",           img: colorDaviGolias },
  { id: "davi-orando",     title: "Davi Orando",             img: colorDaviOrando },
  { id: "davi-ovelha",     title: "Davi e a Ovelhinha",      img: colorDaviOvelha },
];

const colorPalette = [
  "#FF6B6B", "#FF8C42", "#FFD93D", "#FFEAA7", "#96CEB4", "#4ECDC4",
  "#45B7D1", "#5C6BC0", "#9C27B0", "#DDA0DD", "#F7DC6F", "#E74C3C",
  "#2ECC71", "#3498DB", "#F39C12", "#1ABC9C", "#E67E22", "#8B4513",
  "#ffffff", "#333333",
];

/* =========================================================
   QUEBRA-CABEÇA DO DIA — inspirado em thejigsawpuzzles.com
   Rotaciona diariamente entre 7 imagens (uma por dia da semana)
========================================================= */
const jigsawCatalog = [
  { title: "A Criação", emoji: "🌍", image: imgCriacao },
  { title: "Adão e Eva", emoji: "🌳", image: imgAdaoEva },
  { title: "A Arca de Noé", emoji: "🚢", image: imgNoe },
  { title: "Animais entram na Arca", emoji: "🦒", image: imgNoe2 },
  { title: "Moisés e o Mar Vermelho", emoji: "🌊", image: imgMoises },
  { title: "Os 10 Mandamentos", emoji: "📜", image: imgMandamentos },
  { title: "Davi e Golias", emoji: "⚔️", image: imgDavi },
  { title: "Moisés Recebendo a Lei", emoji: "⛰️", image: imgMoises2 },
];

function dayOfYear(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

/* ========================================================= */

export default function Atividades() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [celebration, setCelebration] = useState({ show: false, message: "", coins: 0, emoji: "🏆" });

  const awardCoins = (amount: number) => {
    const user = JSON.parse(localStorage.getItem("lemos_user") || "{}");
    user.coins = (user.coins || 0) + amount;
    localStorage.setItem("lemos_user", JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("lemos:coins"));
  };
  const showCelebration = (message: string, coins: number, emoji = "🏆") => {
    awardCoins(coins);
    setCelebration({ show: true, message, coins, emoji });
  };
  const closeCelebration = () => setCelebration({ show: false, message: "", coins: 0, emoji: "🏆" });

  const activities = [
    { title: "Quiz Bíblico",        icon: iconQuiz,             id: "quiz",        coins: 5  },
    { title: "Memória",             icon: iconMemoria,          id: "memory",      coins: 7  },
    { title: "7 Erros",             icon: icon7Erros,           id: "spot",        coins: 5  },
    { title: "Colorir",             icon: iconColorir,          id: "coloring",    coins: 3  },
    { title: "Quebra-Cabeça",       icon: iconQuebraCabeca,     id: "jigsaw",      coins: 10 },
    { title: "Caça-Palavras",       icon: iconCacaPalavras.url, id: "wordsearch",  coins: 8  },
    { title: "Pinte os Círculos",   icon: iconPinteCirculos.url, id: "edu:circles", coins: 5  },
    { title: "Ligue as Cores",      icon: iconLigueCores.url,   id: "edu:connect", coins: 6  },
  ];

  const bgStyle = { background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" };
  const Back = () => (
    <button onClick={() => setActiveGame(null)} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar às atividades</button>
  );
  const CoinHint = () => (
    <p className="text-center text-xs text-muted-foreground font-body mt-2">
      💡 Complete para ganhar <span className="font-bold text-primary">moedinhas 🪙</span> e trocar por pacotinhos no Álbum!
    </p>
  );

  if (activeGame === "quiz")
    return <QuizGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "memory")
    return <MemoryGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "spot")
    return <SpotDifferenceGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "coloring")
    return <ColoringGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "jigsaw")
    return <JigsawGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "wordsearch")
    return <WordSearchGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame?.startsWith("edu:")) {
    const eduId = activeGame.split(":")[1] as "circles" | "connect" | "differences" | "count";
    return (
      <>
        <EducacionalActivities
          onBack={() => setActiveGame(null)}
          celebrate={showCelebration}
          bgStyle={bgStyle}
          initialActivity={eduId}
        />
        <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
      </>
    );
  }

  // === MENU ORBITAL ===
  const SPIN_DURATION = "120s";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={bgStyle}>
      <PageHeader title="Atividades Educacionais" icon={iconAtividades} />
      <div
        className="relative orbit-area"
        style={{
          width: "min(92vw, 720px)",
          height: "min(92vw, 720px)",
          ["--orbit-radius" as any]: "min(38vw, 300px)",
        }}
      >
        <div className="absolute inset-0 orbit-anim" style={{ animation: `orbit-spin ${SPIN_DURATION} linear infinite`, transformOrigin: "50% 50%" }}>
          {activities.map((a, i) => {
            const angle = (360 / activities.length) * i - 90;
            return (
              <div key={a.id} className="absolute top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translate(var(--orbit-radius)) rotate(${-angle}deg)` }}>
                <div className="orbit-anim" style={{ animation: `orbit-spin-reverse ${SPIN_DURATION} linear infinite`, transformOrigin: "50% 50%" }}>
                  <button type="button" onClick={() => setActiveGame(a.id)}
                    className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                    <img src={a.icon} alt={a.title} loading="lazy"
                      className="rounded-full border-2 border-primary/30 shadow-xl bg-white object-cover w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]" />
                    <span className="font-display text-xs sm:text-sm font-bold text-foreground text-center leading-tight">{a.title}</span>
                    <CoinBadge amount={a.coins} size="xs" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <img src={logoCentral} alt="Lemos a Palavra"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl w-[180px] sm:w-[230px] md:w-[280px]" />
      </div>
      <style>{`
        @keyframes orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit-spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .orbit-area:hover .orbit-anim,
        .orbit-area:focus-within .orbit-anim { animation-play-state: paused !important; }
      `}</style>
      <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
    </div>
  );
}

/* ============= GAME WRAPPERS ============= */

function DailyBanner({ emoji, text }: { emoji: string; text: string }) {
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div className="mb-4 rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-2 border-amber-300 px-3 py-2 text-center shadow-sm">
      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-display font-bold text-amber-900">
        <span className="text-lg">{emoji}</span>
        <span>Atividades de hoje · {today}</span>
      </div>
      <p className="text-[11px] font-body text-amber-800/80 italic mt-0.5">⏳ {text}</p>
    </div>
  );
}

type GameProps = {
  onBack: () => void;
  celebrate: (m: string, c: number, e?: string) => void;
  celebration: { show: boolean; message: string; coins: number; emoji: string };
  closeCelebration: () => void;
  bgStyle: React.CSSProperties;
};

/* ---------- QUIZ ---------- */
function QuizGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const startCategory = (cat: string) => {
    const pool = cat === "ALL" ? quizBank : quizBank.filter((q) => q.cat === cat);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCategory(cat);
    setIdx(0); setScore(0); setAnswered(null); setDone(false);
  };

  const answer = (i: number) => {
    if (answered !== null) return;
    setAnswered(i);
    const correct = i === questions[idx].correct;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setAnswered(null);
      if (idx + 1 >= questions.length) {
        setDone(true);
        const final = correct ? score + 1 : score;
        const coins = Math.max(1, Math.floor(final / 2));
        celebrate(`Você acertou ${final} de ${questions.length}!`, coins, "🧠");
      } else setIdx((n) => n + 1);
    }, 1600);
  };

  if (!category) {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Quiz Bíblico" subtitle="Escolha uma categoria" icon={iconQuiz} />
          <button onClick={onBack} className="mb-3 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>
          <DailyBanner emoji="🧠" text="Perguntas de hoje — amanhã vêm novas!" />
          <div className="grid gap-3">
            {quizCategories.map((c) => (
              <button key={c.id} onClick={() => startCategory(c.id)}
                className={`bg-gradient-to-r ${c.color} text-white rounded-2xl p-5 shadow-lg hover:scale-[1.03] transition-transform font-display text-lg font-bold text-left`}>
                {c.label}
                <span className="block text-xs opacity-90 font-body font-normal mt-1">
                  {c.id === "ALL" ? quizBank.length : quizBank.filter((q) => q.cat === c.id).length} perguntas disponíveis
                </span>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground font-body mt-4">
            💡 Cada quiz tem 10 perguntas aleatórias. Ganhe moedinhas 🪙 ao completar!
          </p>
        </div>
        <CelebrationAnimation {...celebration} onClose={closeCelebration} />
      </div>
    );
  }

  const cur = questions[idx];
  const progress = ((idx + (answered !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <PageHeader title="Quiz Bíblico" subtitle={done ? "Resultado" : `Pergunta ${idx + 1} de ${questions.length}`} icon={iconQuiz} />
        <button onClick={onBack} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>

        {done ? (
          <div className="bg-popover rounded-2xl p-6 shadow-lg border border-border text-center">
            <span className="text-7xl block mb-4">{score >= questions.length * 0.7 ? "🏆" : score >= questions.length / 2 ? "⭐" : "💪"}</span>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {score === questions.length ? "Perfeito!" : score >= questions.length * 0.7 ? "Excelente!" : "Continue estudando!"}
            </h2>
            <p className="font-body text-lg text-foreground mt-2">Você acertou <b>{score}</b> de <b>{questions.length}</b></p>
            <div className="flex gap-2 justify-center mt-4">
              <button onClick={() => startCategory(category)} className="btn-cartoon px-5 py-3 text-sm">🔄 Jogar de novo</button>
              <button onClick={() => setCategory(null)} className="btn-cartoon px-5 py-3 text-sm bg-muted text-foreground">📋 Trocar categoria</button>
            </div>
          </div>
        ) : (
          <>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-primary to-pink-400 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="bg-gradient-to-br from-white via-amber-50 to-pink-50 rounded-3xl p-6 shadow-2xl border-[3px] border-amber-200 relative overflow-hidden">
              {/* Background biblical illustration at 25% opacity */}
              <img
                src={quizImageFor(cur.q, cur.cat)}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ opacity: 0.25 }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/70 pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-amber-300/40 to-pink-300/40 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-gradient-to-br from-sky-300/40 to-purple-300/40 blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl drop-shadow">{cur.cat === "AT" ? "📜" : cur.cat === "NT" ? "✨" : "📖"}</span>
                  <span className="text-xs font-display font-bold bg-gradient-to-r from-amber-500 to-pink-500 text-white px-3 py-1 rounded-full shadow">
                    {cur.cat === "AT" ? "Antigo Testamento" : cur.cat === "NT" ? "Novo Testamento" : "Bíblia Geral"}
                  </span>
                  <span className="ml-auto"><CoinBadge amount={score} size="xs" /></span>
                </div>

                {/* Question illustration (keyword-matched biblical scene) */}
                <div className="flex justify-center mb-3">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 to-amber-100 border-[3px] border-white shadow-lg ring-2 ring-amber-300/60">
                    <img src={quizImageFor(cur.q, cur.cat)} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute bottom-1 right-2 text-2xl drop-shadow-lg">{cur.cat === "AT" ? "📜" : cur.cat === "NT" ? "✝️" : "📖"}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-extrabold text-foreground mb-4 leading-snug drop-shadow-sm text-center">{cur.q}</h3>
                <div className="space-y-2">
                  {cur.options.map((opt, i) => {
                    const letter = ["A", "B", "C", "D"][i];
                    const letterColors = [
                      "bg-rose-400",
                      "bg-sky-400",
                      "bg-amber-400",
                      "bg-emerald-400",
                    ];
                    let cls = "w-full text-left px-3 py-3 rounded-2xl border-[3px] transition-all font-body font-semibold text-foreground flex items-center gap-3 ";
                    if (answered !== null) {
                      if (i === cur.correct) cls += "border-green-500 bg-green-100 text-green-800 font-bold scale-[1.02] shadow-lg";
                      else if (i === answered) cls += "border-red-500 bg-red-100 text-red-800";
                      else cls += "border-border bg-background opacity-50";
                    } else cls += "border-amber-200 bg-white hover:border-pink-400 hover:bg-pink-50 active:scale-[0.98] shadow-sm";
                    return (
                      <button key={i} onClick={() => answer(i)} disabled={answered !== null} className={cls}>
                        <span className={`shrink-0 w-9 h-9 rounded-full ${letterColors[i]} text-white font-display font-extrabold text-lg flex items-center justify-center shadow-md ring-2 ring-white`}>
                          {letter}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {answered !== null && i === cur.correct && <span className="text-2xl">🙌</span>}
                        {answered !== null && i === answered && i !== cur.correct && <span className="text-2xl">😅</span>}
                      </button>
                    );
                  })}
                </div>
                {answered !== null && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-blue-400 rounded-lg animate-fade-in">
                    <p className="text-xs font-display font-bold text-blue-900 mb-1 flex items-center gap-1">✝️ Palavra de Deus</p>
                    <p className="text-sm font-body text-blue-900">{cur.ref}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- MEMORY ---------- */
function MemoryGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const [level, setLevel] = useState<keyof typeof memorySets | null>(null);
  const [board, setBoard] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [running]);

  const start = (lv: keyof typeof memorySets) => {
    const set = memorySets[lv];
    setBoard([...set, ...set].sort(() => Math.random() - 0.5));
    setFlipped([]); setMatched([]); setMoves(0); setSeconds(0);
    setLevel(lv); setRunning(true);
  };

  const flip = (i: number) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const nf = [...flipped, i];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves((m) => m + 1);
      if (board[nf[0]] === board[nf[1]]) {
        const nm = [...matched, ...nf];
        setMatched(nm); setFlipped([]);
        if (nm.length === board.length) {
          setRunning(false);
          const baseCoins = memoryConfig[level!].coins;
          const bonus = moves + 1 <= board.length * 0.75 ? 2 : 0;
          celebrate(`Concluído em ${moves + 1} jogadas e ${seconds}s!`, baseCoins + bonus, "🃏");
        }
      } else setTimeout(() => setFlipped([]), 800);
    }
  };

  if (!level) {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Jogo da Memória" subtitle="Escolha a dificuldade" icon={iconMemoria} />
          <button onClick={onBack} className="mb-3 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>
          <DailyBanner emoji="🃏" text="Cartas de hoje — amanhã haverá uma nova combinação!" />
          <div className="grid gap-3">
            {(Object.keys(memoryConfig) as (keyof typeof memoryConfig)[]).map((k) => (
              <button key={k} onClick={() => start(k)}
                className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-2xl p-5 shadow-lg hover:scale-[1.03] transition-transform font-display text-lg font-bold text-left">
                {memoryConfig[k].label}
                <span className="block text-xs opacity-90 font-body font-normal mt-1">
                  Recompensa base: {memoryConfig[k].coins} 🪙 (+ bônus se for rápido!)
                </span>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground font-body mt-4">
            💡 Quanto menos jogadas, mais moedinhas você ganha!
          </p>
        </div>
        <CelebrationAnimation {...celebration} onClose={closeCelebration} />
      </div>
    );
  }

  const cfg = memoryConfig[level];
  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <PageHeader title="Jogo da Memória" subtitle={cfg.label} icon={iconMemoria} />
        <button onClick={() => { setLevel(null); setRunning(false); }} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Trocar dificuldade</button>

        <div className="flex justify-around mb-4 bg-popover rounded-xl py-2 shadow border border-border">
          <div className="text-center">
            <p className="text-xs font-body text-muted-foreground">Pares</p>
            <p className="font-display font-bold text-foreground">{matched.length / 2}/{board.length / 2}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-body text-muted-foreground">Jogadas</p>
            <p className="font-display font-bold text-foreground">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-body text-muted-foreground">Tempo</p>
            <p className="font-display font-bold text-primary">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</p>
          </div>
        </div>

        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cfg.cols}, 1fr)` }}>
          {board.map((c, i) => {
            const visible = flipped.includes(i) || matched.includes(i);
            const isMatched = matched.includes(i);
            return (
              <button key={i} onClick={() => flip(i)}
                className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
                  isMatched ? "ring-2 ring-green-400 scale-95" :
                  visible ? "scale-105 shadow-lg" :
                  "bg-gradient-to-br from-amber-400 via-pink-400 to-fuchsia-500 border-[3px] border-amber-200 hover:scale-105 active:scale-95 shadow-md"
                }`}>
                {visible
                  ? <img src={c} alt="" loading="lazy" className="w-full h-full object-cover" />
                  : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-2 rounded-xl bg-white/15 border-2 border-white/40" />
                      <span className="relative text-3xl drop-shadow-lg">✝️</span>
                    </div>
                  )}
              </button>
            );
          })}
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- SPOT THE DIFFERENCE (7 ERROS) — imagens prontas, 5/dia ---------- */
function SpotDifferenceGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  // 5 cenas por dia, intercalando dia a dia
  const dailyScenes = useMemo(() => {
    const d = dayOfYear();
    const total = spotScenes.length;
    const start = (d * 5) % total;
    return Array.from({ length: 5 }, (_, k) => spotScenes[(start + k) % total]);
  }, []);

  const [sceneIdx, setSceneIdx] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  const scene = dailyScenes[sceneIdx];
  const total = scene.diffs.length;

  const reset = (i: number) => { setSceneIdx(i); setFound([]); setMisses(0); };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 100;
    const y = ((e.clientY - box.top) / box.height) * 100;
    const hit = scene.diffs.findIndex((d, i) =>
      !found.includes(i) && Math.hypot(d.x - x, d.y - y) <= d.r + 3
    );
    if (hit >= 0) {
      const nf = [...found, hit];
      setFound(nf);
      if (nf.length === total) celebrate(`Você encontrou todas as ${total} diferenças!`, 5, "🔍");
    } else {
      setMisses((m) => m + 1);
      setShakeKey((k) => k + 1);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="Jogo dos 7 Erros" subtitle={scene.title} icon={icon7Erros} />
        <button onClick={onBack} className="mb-3 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>
        <DailyBanner emoji="🔍" text="5 cenas selecionadas para hoje — amanhã chegam novas!" />

        <div className="flex justify-around mb-3 bg-popover rounded-xl py-2 shadow border border-border text-sm">
          <span className="font-display"><b className="text-primary">{found.length}</b>/{total} encontradas</span>
          <span className="font-display text-red-600">Erros: {misses}</span>
        </div>

        <div key={shakeKey} className={misses > 0 ? "animate-[shake_0.4s]" : ""}>
          <p className="text-xs text-center font-body text-muted-foreground mb-2">
            🔍 Compare a cena de cima com a de baixo e clique nas {total} diferenças (na cena de baixo)
          </p>
          <div
            onClick={handleClick}
            className="relative w-full rounded-2xl overflow-hidden border-2 border-primary/60 cursor-pointer shadow-lg bg-white select-none"
          >
            <img src={scene.image} alt={scene.title} className="w-full h-auto pointer-events-none block" />
            {found.map((i) => {
              const d = scene.diffs[i];
              return (
                <span
                  key={`mark-${i}`}
                  aria-hidden
                  className="absolute pointer-events-none rounded-full border-[3px] border-red-500 animate-pulse"
                  style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.r * 2}%`, paddingBottom: `${d.r * 2}%`, transform: "translate(-50%,-50%)" }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-4 justify-center">
          {dailyScenes.map((s, i) => (
            <button key={i} onClick={() => reset(i)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold transition ${sceneIdx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground hover:border-primary"}`}>
              {s.emoji} {s.title}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-3">
          💡 Encontre todas as {total} diferenças para ganhar 5 moedinhas 🪙
        </p>
      </div>

      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }`}</style>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- COLORING — clique para pintar (flood-fill), 4 por dia ---------- */
function ColoringGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const dailyPics = useMemo(() => {
    const d = dayOfYear();
    const total = coloringCatalog.length;
    const start = (d * 4) % total;
    return Array.from({ length: 4 }, (_, k) => coloringCatalog[(start + k) % total]);
  }, []);

  const [idx, setIdx] = useState(0);
  const [color, setColor] = useState(colorPalette[0]);
  const [fills, setFills] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskRef = useRef<Uint8Array | null>(null);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 600, h: 800 });
  const scene = dailyPics[idx];

  // Load outline image into hidden canvas to build a "wall" mask (dark pixels).
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    setFills(0);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Fit image into canvas keeping aspect ratio; record actual draw bounds
      const cw = c.width, ch = c.height;
      const ir = img.width / img.height;
      const cr = cw / ch;
      let dw = cw, dh = ch, dx = 0, dy = 0;
      if (ir > cr) { dh = cw / ir; dy = (ch - dh) / 2; } else { dw = ch * ir; dx = (cw - dw) / 2; }
      // Draw outline into offscreen to compute mask
      const off = document.createElement("canvas");
      off.width = cw; off.height = ch;
      const octx = off.getContext("2d")!;
      octx.fillStyle = "#ffffff";
      octx.fillRect(0, 0, cw, ch);
      octx.drawImage(img, dx, dy, dw, dh);
      const data = octx.getImageData(0, 0, cw, ch).data;
      const mask = new Uint8Array(cw * ch);
      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        // 1 = wall (dark outline), 0 = paintable
        const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
        mask[j] = lum < 110 ? 1 : 0;
      }
      maskRef.current = mask;
      sizeRef.current = { w: cw, h: ch };
    };
    img.src = scene.img;
  }, [idx, scene.img]);

  const hexToRgb = (hex: string): [number, number, number] => {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const floodFill = (sx: number, sy: number) => {
    const c = canvasRef.current;
    const mask = maskRef.current;
    if (!c || !mask) return;
    const ctx = c.getContext("2d")!;
    const { w, h } = sizeRef.current;
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) return;
    if (mask[sy * w + sx]) return; // clicked on outline
    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;
    const [r, g, b] = hexToRgb(color);
    const visited = new Uint8Array(w * h);
    const stack: number[] = [sx, sy];
    while (stack.length) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const idxM = y * w + x;
      if (visited[idxM] || mask[idxM]) continue;
      visited[idxM] = 1;
      const p = idxM * 4;
      data[p] = r; data[p + 1] = g; data[p + 2] = b; data[p + 3] = 255;
      stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
    }
    ctx.putImageData(img, 0, 0);
    setFills((n) => n + 1);
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * c.width);
    const y = Math.floor(((e.clientY - r.top) / r.height) * c.height);
    floodFill(x, y);
  };

  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setFills(0);
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <PageHeader title="Colorir" subtitle={scene.title} icon={iconColorir} />
        <button onClick={onBack} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>

        <div className="text-center mb-3 space-y-1">
          <span className="inline-flex items-center gap-2 text-xs font-display font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
            🎨 Desenhos de hoje · {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
          </span>
          <p className="text-[11px] text-muted-foreground font-body italic">
            ⏳ Amanhã haverá <b>novos desenhos diferentes</b> para colorir!
          </p>
        </div>

        {/* Palette */}
        <div className="flex gap-1.5 mb-3 flex-wrap justify-center bg-popover/60 rounded-xl p-2">
          {colorPalette.map((c, i) => (
            <button key={i} onClick={() => setColor(c)}
              className={`w-9 h-9 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-125 shadow-lg ring-2 ring-amber-300" : "border-border"}`}
              style={{ background: c }} aria-label={`Cor ${c}`} />
          ))}
        </div>

        <div className="flex gap-3 items-center justify-center mb-3 bg-popover/60 rounded-xl p-2">
          <span className="text-xs font-display font-bold">🪣 Toque na área para pintar</span>
          <button onClick={clear} className="px-3 py-1.5 rounded-full font-display text-xs font-bold bg-popover border border-border text-foreground hover:border-primary">🗑️ Limpar</button>
        </div>

        {/* Canvas with outline drawing on top */}
        <div className="relative bg-white rounded-2xl p-3 shadow-lg border border-border">
          <div className="relative w-full aspect-[3/4] mx-auto overflow-hidden rounded-xl bg-white" style={{ maxWidth: 480 }}>
            <canvas
              ref={canvasRef}
              width={600}
              height={800}
              onClick={onCanvasClick}
              className="absolute inset-0 w-full h-full cursor-pointer"
            />
            {/* Outline image on top with multiply blend */}
            <img
              src={scene.img}
              alt={scene.title}
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        </div>

        {/* Today's pictures picker (4 per day) */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {dailyPics.map((s, i) => (
            <button key={s.id} onClick={() => setIdx(i)}
              className={`rounded-xl overflow-hidden border-2 transition-all bg-white ${idx === i ? "border-primary scale-105 shadow-lg" : "border-border hover:border-primary/50"}`}
              title={s.title}>
              <img src={s.img} alt={s.title} className="w-full aspect-square object-contain p-1" loading="lazy" />
              <span className="block text-[10px] font-display font-bold text-foreground px-1 pb-1 truncate">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 mt-4">
          <CoinBadge amount={3} size="md" label="ao finalizar" />
          {fills >= 3 && (
            <button onClick={() => celebrate(`"${scene.title}" pintado!`, 3, "🎨")}
              className="btn-cartoon px-6 py-3 text-sm">✨ Finalizar e ganhar moedinhas</button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-3">
          💡 Escolha uma cor e <b>clique em cada parte do desenho</b> para pintar automaticamente!
        </p>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- JIGSAW (Quebra-Cabeça do Dia) ---------- */
function JigsawGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const dayPuzzleIdx = useMemo(() => dayOfYear() % jigsawCatalog.length, []);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<3 | 4 | 5>(3);
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [showRef, setShowRef] = useState(true);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [running]);

  const start = (idx: number, diff: 3 | 4 | 5) => {
    const total = diff * diff;
    const ordered = Array.from({ length: total }, (_, i) => i);
    const shuffled = [...ordered];
    do {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    } while (shuffled.every((t, i) => t === i));
    setSelectedIdx(idx); setDifficulty(diff);
    setTiles(shuffled); setSelectedTile(null); setMoves(0); setSeconds(0); setRunning(true);
  };

  const swap = (pos: number) => {
    if (selectedTile === null) { setSelectedTile(pos); return; }
    if (selectedTile === pos) { setSelectedTile(null); return; }
    const nt = [...tiles];
    [nt[selectedTile], nt[pos]] = [nt[pos], nt[selectedTile]];
    setTiles(nt); setSelectedTile(null); setMoves((m) => m + 1);
    if (nt.every((t, i) => t === i)) {
      setRunning(false);
      const baseCoins = difficulty === 3 ? 3 : difficulty === 4 ? 6 : 10;
      celebrate(`Quebra-cabeça completo em ${moves + 1} movimentos!`, baseCoins, "🧩");
    }
  };

  // Selection screen
  if (selectedIdx === null) {
    const daily = jigsawCatalog[dayPuzzleIdx];
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Quebra-Cabeça" subtitle="Escolha um puzzle" icon={iconQuebraCabeca} />
          <button onClick={onBack} className="mb-3 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>
          <DailyBanner emoji="🧩" text="Puzzle do dia — amanhã chega uma nova imagem bíblica!" />


          {/* Daily puzzle */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 rounded-2xl p-1 shadow-xl mb-5">
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-display font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">⭐ PUZZLE DO DIA</span>
                <span className="text-xs text-muted-foreground font-body">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span>
              </div>
              <div className="flex gap-3 items-center">
                <img src={daily.image} alt={daily.title} className="w-24 h-24 object-cover rounded-xl border-2 border-amber-300" />
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-foreground">{daily.emoji} {daily.title}</h3>
                  <p className="text-xs font-body text-muted-foreground mb-2">Disponível apenas hoje!</p>
                  <div className="flex gap-1">
                    <button onClick={() => start(dayPuzzleIdx, 3)} className="px-2 py-1 rounded-lg text-xs font-display font-bold bg-amber-100 text-amber-800 hover:bg-amber-200">Fácil 3x3</button>
                    <button onClick={() => start(dayPuzzleIdx, 4)} className="px-2 py-1 rounded-lg text-xs font-display font-bold bg-orange-100 text-orange-800 hover:bg-orange-200">Médio 4x4</button>
                    <button onClick={() => start(dayPuzzleIdx, 5)} className="px-2 py-1 rounded-lg text-xs font-display font-bold bg-pink-100 text-pink-800 hover:bg-pink-200">Difícil 5x5</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <h4 className="font-display font-bold text-foreground mb-2 text-sm">📚 Galeria de Quebra-Cabeças</h4>
          <div className="grid grid-cols-2 gap-3">
            {jigsawCatalog.map((p, i) => (
              <button key={i} onClick={() => start(i, 3)}
                className="bg-popover rounded-2xl p-3 shadow-md hover:shadow-lg hover:scale-105 transition-all border border-border text-center group">
                <img src={p.image} alt={p.title} className="w-full aspect-square object-cover rounded-xl mb-2 group-hover:brightness-110 transition" />
                <h3 className="font-display text-sm font-bold text-foreground">{p.emoji} {p.title}</h3>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground font-body mt-4">
            💡 Ganhe até <b className="text-primary">10 moedinhas 🪙</b> ao completar! Difícil = mais moedas.
          </p>
        </div>
        <CelebrationAnimation {...celebration} onClose={closeCelebration} />
      </div>
    );
  }

  const puzzle = jigsawCatalog[selectedIdx];
  const gs = difficulty;

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <PageHeader title="Quebra-Cabeça" subtitle={`${puzzle.title} • ${gs}x${gs}`} icon={iconQuebraCabeca} />
        <button onClick={() => { setSelectedIdx(null); setRunning(false); }}
          className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Trocar puzzle</button>

        <div className="flex justify-around mb-3 bg-popover rounded-xl py-2 shadow border border-border text-sm">
          <span className="font-display">🔀 <b>{moves}</b> movimentos</span>
          <span className="font-display text-primary">⏱ {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span>
          <button onClick={() => setShowRef((v) => !v)} className="font-display text-xs underline text-muted-foreground">{showRef ? "Ocultar" : "Ver"} referência</button>
        </div>

        {showRef && (
          <div className="flex justify-center mb-3">
            <img src={puzzle.image} alt="Referência" className="w-28 h-28 rounded-xl border-4 border-primary/40 shadow-lg object-cover" />
          </div>
        )}

        <div className="bg-white rounded-2xl p-2 shadow-lg border border-border mx-auto" style={{ maxWidth: 400 }}>
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${gs}, 1fr)` }}>
            {tiles.map((tileIdx, pos) => {
              const isCorrect = tileIdx === pos;
              const isSelected = selectedTile === pos;
              const tRow = Math.floor(tileIdx / gs);
              const tCol = tileIdx % gs;
              const bgSize = gs * 100;
              return (
                <button key={pos} onClick={() => swap(pos)}
                  className={`aspect-square rounded-md transition-all overflow-hidden ${
                    isSelected ? "ring-4 ring-primary scale-110 z-10 shadow-xl" :
                    isCorrect ? "ring-2 ring-green-400" : "ring-1 ring-border hover:ring-primary/50"
                  }`}
                  style={{
                    backgroundImage: `url(${puzzle.image})`,
                    backgroundSize: `${bgSize}% ${bgSize}%`,
                    backgroundPosition: `${(tCol / (gs - 1)) * 100}% ${(tRow / (gs - 1)) * 100}%`,
                  }} />
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-3">
          💡 Toque em duas peças para trocá-las. Quanto mais difícil, mais moedinhas 🪙!
        </p>

        <div className="flex gap-2 mt-3 justify-center">
          <button onClick={() => start(selectedIdx, difficulty)} className="btn-cartoon px-4 py-2 text-sm">🔄 Embaralhar</button>
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* =========================================================
   CAÇA-PALAVRAS — Grade interativa de letras (clicar para marcar)
   3 cartelas bíblicas. O usuário clica em duas letras (início/fim)
   formando uma linha reta; se as letras formarem uma palavra da
   lista, ela é marcada como encontrada.
========================================================= */
type CacaCard = { title: string; words: string[]; size: number; reference?: string };
const cacaCards: CacaCard[] = [
  {
    title: "Os 12 Apóstolos",
    size: 12,
    words: ["PEDRO", "ANDRE", "TIAGO", "JOAO", "FILIPE", "TOME", "MATEUS", "TADEU", "SIMAO", "JUDAS"],
    reference: "Mateus 10:2-4",
  },
  {
    title: "O Nascimento de Jesus",
    size: 11,
    words: ["JESUS", "MANJEDOURA", "ESTRELA", "PASTORES", "ANJO", "MARIA", "JOSE", "BELEM"],
    reference: "Lucas 2",
  },
  {
    title: "Personagens da Bíblia",
    size: 11,
    words: ["MARIA", "JESUS", "PEDRO", "JOSE", "PILATOS", "LAZARO", "TIAGO", "MOISES"],
  },
];

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
type Dir = { dx: number; dy: number };
const DIRS: Dir[] = [
  { dx: 1, dy: 0 },   // →
  { dx: 0, dy: 1 },   // ↓
  { dx: 1, dy: 1 },   // ↘
  { dx: 1, dy: -1 },  // ↗
];

function buildGrid(size: number, words: string[], seed: number) {
  // Deterministic PRNG so the grid is stable per card
  let s = seed || 1;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));

  const tryPlace = (word: string): boolean => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const dir = DIRS[Math.floor(rand() * DIRS.length)];
      const x0 = Math.floor(rand() * size);
      const y0 = Math.floor(rand() * size);
      const x1 = x0 + dir.dx * (word.length - 1);
      const y1 = y0 + dir.dy * (word.length - 1);
      if (x1 < 0 || x1 >= size || y1 < 0 || y1 >= size) continue;
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const cx = x0 + dir.dx * i;
        const cy = y0 + dir.dy * i;
        const cur = grid[cy][cx];
        if (cur && cur !== word[i]) { ok = false; break; }
      }
      if (!ok) continue;
      for (let i = 0; i < word.length; i++) {
        grid[y0 + dir.dy * i][x0 + dir.dx * i] = word[i];
      }
      return true;
    }
    return false;
  };

  const placed: string[] = [];
  [...words].sort((a, b) => b.length - a.length).forEach((w) => {
    if (tryPlace(w)) placed.push(w);
  });

  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (!grid[y][x]) grid[y][x] = ALPHA[Math.floor(rand() * 26)];

  return { grid, placed };
}

function cellsBetween(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = Math.sign(b.x - a.x);
  const dy = Math.sign(b.y - a.y);
  const absX = Math.abs(b.x - a.x);
  const absY = Math.abs(b.y - a.y);
  // Must be a straight line (horizontal, vertical or 45° diagonal)
  if (!(absX === 0 || absY === 0 || absX === absY)) return null;
  const steps = Math.max(absX, absY);
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) out.push({ x: a.x + dx * i, y: a.y + dy * i });
  return out;
}

function WordSearchGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const todayCard = cacaCards[dayOfYear() % cacaCards.length];
  const [card, setCard] = useState<CacaCard>(todayCard);

  const { grid, placed } = useMemo(
    () => buildGrid(card.size, card.words, card.title.length * 31 + dayOfYear()),
    [card]
  );
  const wordsInPlay = placed;

  const [found, setFound] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [hoverEnd, setHoverEnd] = useState<{ x: number; y: number } | null>(null);
  const [flash, setFlash] = useState<{ type: "ok" | "bad"; cells: string[] } | null>(null);

  const keyOf = (x: number, y: number) => `${x},${y}`;

  const clickCell = (x: number, y: number) => {
    if (!start) { setStart({ x, y }); setHoverEnd({ x, y }); return; }
    const path = cellsBetween(start, { x, y });
    setStart(null); setHoverEnd(null);
    if (!path) return;
    const letters = path.map((c) => grid[c.y][c.x]).join("");
    const reversed = [...letters].reverse().join("");
    const hit = wordsInPlay.find((w) => w === letters || w === reversed);
    if (hit && !found.has(hit)) {
      const cells = path.map((c) => keyOf(c.x, c.y));
      setFound((prev) => new Set(prev).add(hit));
      setFoundCells((prev) => { const n = new Set(prev); cells.forEach((k) => n.add(k)); return n; });
      setFlash({ type: "ok", cells });
      setTimeout(() => setFlash(null), 700);
    } else {
      setFlash({ type: "bad", cells: path.map((c) => keyOf(c.x, c.y)) });
      setTimeout(() => setFlash(null), 500);
    }
  };

  const previewCells = useMemo(() => {
    if (!start || !hoverEnd) return new Set<string>();
    const p = cellsBetween(start, hoverEnd);
    if (!p) return new Set([keyOf(start.x, start.y)]);
    return new Set(p.map((c) => keyOf(c.x, c.y)));
  }, [start, hoverEnd]);

  const completed = found.size === wordsInPlay.length && wordsInPlay.length > 0;
  useEffect(() => {
    if (completed) {
      const coins = Math.max(5, wordsInPlay.length);
      celebrate(`Você achou todas as ${wordsInPlay.length} palavras!`, coins, "🔎");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed]);

  const switchCard = (c: CacaCard) => {
    setCard(c); setFound(new Set()); setFoundCells(new Set()); setStart(null); setHoverEnd(null);
  };

  const resetCard = () => {
    setFound(new Set()); setFoundCells(new Set()); setStart(null); setHoverEnd(null);
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-3xl mx-auto">
        <PageHeader title="Caça-Palavras" subtitle={card.title} icon={iconCacaPalavras.url} />
        <button onClick={onBack} className="mb-3 text-primary font-display text-sm font-bold hover:underline">← Voltar às atividades</button>

        <DailyBanner emoji="🔎" text="Clique numa letra para iniciar e em outra para terminar. Encontre todas as palavras!" />

        {/* Card selector */}
        <div className="flex gap-2 mb-3 flex-wrap justify-center">
          {cacaCards.map((c) => (
            <button
              key={c.title}
              onClick={() => switchCard(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-display font-bold border-2 transition ${
                card.title === c.title
                  ? "bg-amber-500 text-white border-amber-600 shadow"
                  : "bg-white text-amber-900 border-amber-300 hover:bg-amber-50"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Letter grid */}
        <div className="bg-white rounded-2xl border-4 border-amber-300 shadow-2xl p-2 sm:p-3 mb-4">
          <div
            className="grid gap-[2px] sm:gap-[3px] mx-auto"
            style={{
              gridTemplateColumns: `repeat(${card.size}, minmax(0, 1fr))`,
              maxWidth: `min(100%, ${card.size * 44}px)`,
            }}
          >
            {grid.map((row, y) =>
              row.map((ch, x) => {
                const k = keyOf(x, y);
                const isFound = foundCells.has(k);
                const isPreview = previewCells.has(k);
                const isStart = start && start.x === x && start.y === y;
                const isFlashBad = flash?.type === "bad" && flash.cells.includes(k);
                const isFlashOk = flash?.type === "ok" && flash.cells.includes(k);
                let cls = "bg-amber-50 text-amber-900";
                if (isFound) cls = "bg-green-400 text-white";
                else if (isFlashOk) cls = "bg-green-300 text-green-950 animate-pulse";
                else if (isFlashBad) cls = "bg-red-300 text-red-950 animate-pulse";
                else if (isStart) cls = "bg-amber-500 text-white ring-2 ring-amber-700";
                else if (isPreview) cls = "bg-amber-200 text-amber-900";
                return (
                  <button
                    key={k}
                    onClick={() => clickCell(x, y)}
                    onMouseEnter={() => start && setHoverEnd({ x, y })}
                    className={`aspect-square flex items-center justify-center rounded-md sm:rounded-lg font-display font-extrabold text-[12px] sm:text-base select-none transition ${cls} border border-amber-200`}
                  >
                    {ch}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Words list */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-amber-200">
          <p className="text-center font-display font-bold text-amber-900 mb-3">
            Encontre todas as {wordsInPlay.length} palavras
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {wordsInPlay.map((w) => {
              const done = found.has(w);
              return (
                <div
                  key={w}
                  className={`px-3 py-2 rounded-xl border-2 font-body font-semibold text-sm text-center transition ${
                    done
                      ? "bg-green-100 border-green-400 text-green-800 line-through"
                      : "bg-amber-50 border-amber-300 text-amber-900"
                  }`}
                >
                  {done ? "✓ " : "🔍 "} {w}
                </div>
              );
            })}
          </div>
          {card.reference && (
            <p className="text-center text-xs text-muted-foreground italic mt-3">📖 {card.reference}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-display font-bold text-amber-700">
              {found.size}/{wordsInPlay.length} encontradas
            </span>
            <button
              onClick={resetCard}
              className="text-xs font-display font-bold text-rose-600 hover:underline"
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-3">
          💡 Complete uma cartela para ganhar <span className="font-bold text-primary">moedinhas 🪙</span>!
        </p>
      </div>

      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}


