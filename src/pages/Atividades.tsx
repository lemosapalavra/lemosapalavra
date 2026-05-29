import { useState, useEffect, useMemo, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import CelebrationAnimation from "@/components/CelebrationAnimation";
import iconQuiz from "@/assets/icon-quiz.png";
import iconMemoria from "@/assets/icon-memoria.png";
import iconQuebraCabeca from "@/assets/icon-quebracabeca.png";
import iconColorir from "@/assets/icon-colorir.png";
import icon7Erros from "@/assets/icon-7erros.png";
import logoCentral from "@/assets/logo-central.png";

// Puzzle source images (real biblical scenes)
import imgCriacao from "@/assets/historia-criacao.png";
import imgNoe from "@/assets/historia-noe-1.png";
import imgNoe2 from "@/assets/historia-noe-2.png";
import imgDavi from "@/assets/historia-davi-golias.png";
import imgMoises from "@/assets/historia-moises-1.png";
import imgMoises2 from "@/assets/historia-moises-2.png";
import imgMandamentos from "@/assets/historia-10-mandamentos.png";
import imgAdaoEva from "@/assets/historia-adao-eva-1.png";

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
// Memory uses real biblical sticker images from our album.
import mem01 from "@/assets/album/herois-stickers/01.webp";
import mem02 from "@/assets/album/herois-stickers/02.webp";
import mem03 from "@/assets/album/herois-stickers/03.webp";
import mem04 from "@/assets/album/herois-stickers/04.webp";
import mem05 from "@/assets/album/herois-stickers/05.webp";
import mem06 from "@/assets/album/herois-stickers/06.webp";
import mem07 from "@/assets/album/herois-stickers/07.webp";
import mem08 from "@/assets/album/herois-stickers/08.webp";
import mem09 from "@/assets/album/herois-stickers/09.webp";
import mem10 from "@/assets/album/herois-stickers/10.webp";
import mem11 from "@/assets/album/herois-stickers/11.webp";
import mem12 from "@/assets/album/herois-stickers/12.webp";
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
   7 ERROS — usando nossas próprias imagens bíblicas
   Foto original (topo) + cópia com emojis extras (baixo).
   Coordenadas em % (0..100) para responsividade.
========================================================= */
type SpotDiff = { x: number; y: number; r: number; emoji: string; size: number };
type SpotScene = { title: string; emoji: string; image: string; diffs: SpotDiff[] };

const spotScenes: SpotScene[] = [
  {
    title: "A Arca de Noé",
    emoji: "🚢",
    image: imgNoe,
    diffs: [
      { x: 10, y: 12, r: 8, emoji: "☁️", size: 28 },
      { x: 82, y: 10, r: 8, emoji: "🕊️", size: 26 },
      { x: 48, y: 18, r: 7, emoji: "⭐", size: 24 },
      { x: 18, y: 78, r: 8, emoji: "🐟", size: 26 },
      { x: 88, y: 82, r: 8, emoji: "🐠", size: 26 },
      { x: 50, y: 90, r: 7, emoji: "🌊", size: 26 },
      { x: 70, y: 50, r: 8, emoji: "🦒", size: 28 },
    ],
  },
  {
    title: "Davi e Golias",
    emoji: "⚔️",
    image: imgDavi,
    diffs: [
      { x: 14, y: 14, r: 8, emoji: "☀️", size: 30 },
      { x: 86, y: 12, r: 7, emoji: "🦅", size: 26 },
      { x: 50, y: 10, r: 7, emoji: "✨", size: 22 },
      { x: 22, y: 88, r: 8, emoji: "🌿", size: 26 },
      { x: 78, y: 86, r: 8, emoji: "🪨", size: 26 },
      { x: 40, y: 92, r: 7, emoji: "🐑", size: 26 },
      { x: 62, y: 50, r: 7, emoji: "👑", size: 26 },
    ],
  },
  {
    title: "Moisés e o Mar Vermelho",
    emoji: "🌊",
    image: imgMoises,
    diffs: [
      { x: 12, y: 12, r: 8, emoji: "⚡", size: 28 },
      { x: 88, y: 14, r: 8, emoji: "☁️", size: 28 },
      { x: 50, y: 8,  r: 7, emoji: "🕊️", size: 24 },
      { x: 18, y: 82, r: 8, emoji: "🐟", size: 26 },
      { x: 82, y: 84, r: 8, emoji: "🐠", size: 26 },
      { x: 48, y: 92, r: 7, emoji: "🌊", size: 22 },
      { x: 70, y: 40, r: 7, emoji: "✨", size: 22 },
    ],
  },
  {
    title: "A Criação",
    emoji: "🌍",
    image: imgCriacao,
    diffs: [
      { x: 14, y: 12, r: 8, emoji: "🌟", size: 26 },
      { x: 86, y: 16, r: 8, emoji: "☄️", size: 28 },
      { x: 50, y: 6,  r: 7, emoji: "🌙", size: 24 },
      { x: 22, y: 86, r: 8, emoji: "🌸", size: 26 },
      { x: 78, y: 88, r: 8, emoji: "🦋", size: 26 },
      { x: 50, y: 92, r: 7, emoji: "🌿", size: 26 },
      { x: 64, y: 48, r: 7, emoji: "🐦", size: 22 },
    ],
  },
  {
    title: "Adão e Eva no Éden",
    emoji: "🌳",
    image: imgAdaoEva,
    diffs: [
      { x: 12, y: 14, r: 8, emoji: "🍎", size: 26 },
      { x: 85, y: 12, r: 8, emoji: "🐍", size: 26 },
      { x: 50, y: 8, r: 7, emoji: "🌞", size: 26 },
      { x: 20, y: 85, r: 8, emoji: "🦌", size: 26 },
      { x: 80, y: 88, r: 8, emoji: "🐇", size: 26 },
      { x: 48, y: 92, r: 7, emoji: "🌺", size: 24 },
      { x: 65, y: 50, r: 7, emoji: "🦋", size: 24 },
    ],
  },
  {
    title: "Os 10 Mandamentos",
    emoji: "📜",
    image: imgMandamentos,
    diffs: [
      { x: 12, y: 10, r: 8, emoji: "⚡", size: 28 },
      { x: 88, y: 12, r: 8, emoji: "☁️", size: 28 },
      { x: 50, y: 8, r: 7, emoji: "🔥", size: 26 },
      { x: 18, y: 80, r: 8, emoji: "🪨", size: 26 },
      { x: 82, y: 82, r: 8, emoji: "🌿", size: 24 },
      { x: 50, y: 92, r: 7, emoji: "✨", size: 26 },
      { x: 70, y: 45, r: 7, emoji: "🕊️", size: 24 },
    ],
  },
];

/* =========================================================
   COLORIR — cenas SVG (mantém + undo + mais cores)
========================================================= */
const coloringScenes = [
  {
    title: "A Arca de Noé",
    regions: [
      { id: "sky", d: "M0,0 L400,0 L400,120 Q200,80 0,120 Z", label: "Céu" },
      { id: "rainbow1", d: "M50,30 Q200,0 350,30 Q200,10 50,30 Z", label: "Arco-íris" },
      { id: "rainbow2", d: "M60,40 Q200,10 340,40 Q200,20 60,40 Z", label: "Arco-íris" },
      { id: "rainbow3", d: "M70,50 Q200,20 330,50 Q200,30 70,50 Z", label: "Arco-íris" },
      { id: "water", d: "M0,200 Q100,180 200,200 Q300,220 400,200 L400,300 L0,300 Z", label: "Água" },
      { id: "boat", d: "M80,160 L320,160 L280,220 L120,220 Z", label: "Arca" },
      { id: "cabin", d: "M140,120 L260,120 L260,160 L140,160 Z", label: "Cabine" },
      { id: "roof", d: "M130,120 L200,80 L270,120 Z", label: "Telhado" },
      { id: "window1", d: "M160,130 L190,130 L190,150 L160,150 Z", label: "Janela" },
      { id: "window2", d: "M210,130 L240,130 L240,150 L210,150 Z", label: "Janela" },
    ],
  },
  {
    title: "O Bom Pastor",
    regions: [
      { id: "sky", d: "M0,0 L400,0 L400,100 Q200,130 0,100 Z", label: "Céu" },
      { id: "sun", d: "M320,40 A30,30 0 1,1 320,41 Z", label: "Sol" },
      { id: "grass", d: "M0,180 Q200,160 400,180 L400,300 L0,300 Z", label: "Grama" },
      { id: "hill1", d: "M0,180 Q100,120 200,180 Z", label: "Colina" },
      { id: "hill2", d: "M200,180 Q300,130 400,180 Z", label: "Colina" },
      { id: "body", d: "M180,110 L220,110 L230,200 L170,200 Z", label: "Túnica" },
      { id: "head", d: "M190,80 A15,18 0 1,1 210,80 A15,18 0 1,1 190,80 Z", label: "Cabeça" },
      { id: "sheep1", d: "M100,195 Q110,180 120,195 Q110,205 100,195 Z", label: "Ovelha" },
      { id: "sheep2", d: "M140,200 Q150,185 160,200 Q150,210 140,200 Z", label: "Ovelha" },
      { id: "sheep3", d: "M270,195 Q280,180 290,195 Q280,205 270,195 Z", label: "Ovelha" },
      { id: "tree", d: "M50,120 Q70,80 90,120 Q70,100 50,120 Z", label: "Árvore" },
      { id: "trunk", d: "M65,120 L75,160 L65,160 L65,120 Z", label: "Tronco" },
    ],
  },
  {
    title: "A Estrela de Belém",
    refImage: imgCriacao,
    regions: [
      { id: "night", d: "M0,0 L400,0 L400,300 L0,300 Z", label: "Céu noturno" },
      { id: "star", d: "M200,20 L210,60 L250,60 L218,85 L228,120 L200,98 L172,120 L182,85 L150,60 L190,60 Z", label: "Estrela" },
      { id: "stable", d: "M120,160 L280,160 L300,280 L100,280 Z", label: "Estábulo" },
      { id: "roof2", d: "M100,160 L200,100 L300,160 Z", label: "Telhado" },
      { id: "manger", d: "M170,220 L230,220 L240,260 L160,260 Z", label: "Manjedoura" },
    ],
  },
  {
    title: "Jonas e a Baleia",
    refImage: imgMoises,
    regions: [
      { id: "sky", d: "M0,0 L400,0 L400,120 L0,120 Z", label: "Céu" },
      { id: "sea", d: "M0,120 Q100,100 200,120 Q300,140 400,120 L400,300 L0,300 Z", label: "Mar" },
      { id: "whale", d: "M60,160 Q200,100 340,180 Q300,240 200,250 Q100,240 60,160 Z", label: "Baleia" },
      { id: "eye", d: "M120,170 A8,8 0 1,1 120,171 Z", label: "Olho" },
      { id: "jonas", d: "M270,195 L290,195 L290,225 L270,225 Z", label: "Jonas" },
      { id: "cloud1", d: "M50,30 Q80,10 110,30 Q80,40 50,30 Z", label: "Nuvem" },
      { id: "cloud2", d: "M250,20 Q280,5 310,20 Q280,30 250,20 Z", label: "Nuvem" },
    ],
  },
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
    { title: "Quiz Bíblico", icon: iconQuiz, id: "quiz" },
    { title: "Memória", icon: iconMemoria, id: "memory" },
    { title: "7 Erros", icon: icon7Erros, id: "spot" },
    { title: "Colorir", icon: iconColorir, id: "coloring" },
    { title: "Quebra-Cabeça", icon: iconQuebraCabeca, id: "jigsaw" },
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

  // === MENU ORBITAL ===
  const SPIN_DURATION = "120s";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={bgStyle}>
      <PageHeader />
      <div
        className="relative"
        style={{
          width: "min(92vw, 720px)",
          height: "min(92vw, 720px)",
          ["--orbit-radius" as any]: "min(38vw, 300px)",
        }}
      >
        <div className="absolute inset-0" style={{ animation: `orbit-spin ${SPIN_DURATION} linear infinite`, transformOrigin: "50% 50%" }}>
          {activities.map((a, i) => {
            const angle = (360 / activities.length) * i - 90;
            return (
              <div key={a.id} className="absolute top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translate(var(--orbit-radius)) rotate(${-angle}deg)` }}>
                <div style={{ animation: `orbit-spin-reverse ${SPIN_DURATION} linear infinite`, transformOrigin: "50% 50%" }}>
                  <button type="button" onClick={() => setActiveGame(a.id)}
                    className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                    <img src={a.icon} alt={a.title} loading="lazy"
                      className="rounded-full border-2 border-primary/30 shadow-xl bg-white object-cover w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]" />
                    <span className="font-display text-xs sm:text-sm font-bold text-foreground text-center leading-tight">{a.title}</span>
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
      `}</style>
      <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
    </div>
  );
}

/* ============= GAME WRAPPERS ============= */

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
          <button onClick={onBack} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>
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
            <div className="bg-popover rounded-2xl p-6 shadow-lg border border-border">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-display font-bold bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                  {cur.cat === "AT" ? "Antigo Testamento" : cur.cat === "NT" ? "Novo Testamento" : "Bíblia Geral"}
                </span>
                <span className="text-xs text-muted-foreground">Acertos: {score} 🪙</span>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-4">{cur.q}</h3>
              <div className="space-y-2">
                {cur.options.map((opt, i) => {
                  let cls = "w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-body text-foreground ";
                  if (answered !== null) {
                    if (i === cur.correct) cls += "border-green-500 bg-green-100 text-green-800 font-bold scale-[1.02]";
                    else if (i === answered) cls += "border-red-500 bg-red-100 text-red-800";
                    else cls += "border-border bg-background opacity-50";
                  } else cls += "border-border bg-background hover:border-primary hover:bg-primary/10 active:scale-[0.98]";
                  return (
                    <button key={i} onClick={() => answer(i)} disabled={answered !== null} className={cls}>
                      {answered !== null && i === cur.correct && <span className="mr-2">✅</span>}
                      {answered !== null && i === answered && i !== cur.correct && <span className="mr-2">❌</span>}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered !== null && (
                <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg animate-fade-in">
                  <p className="text-xs font-display font-bold text-blue-900 mb-1">📖 Referência</p>
                  <p className="text-sm font-body text-blue-900">{cur.ref}</p>
                </div>
              )}
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
          <button onClick={onBack} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>
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
                className={`aspect-square rounded-xl flex items-center justify-center border-2 transition-all duration-300 overflow-hidden ${
                  isMatched ? "bg-green-100 border-green-400 scale-95" :
                  visible ? "bg-primary/10 border-primary scale-105" :
                  "bg-gradient-to-br from-primary/80 to-accent/80 border-border hover:scale-105 active:scale-95"
                }`}>
                {visible
                  ? <img src={c} alt="" loading="lazy" className="w-full h-full object-contain p-1" />
                  : <span className="text-white text-2xl font-display font-extrabold drop-shadow">?</span>}
              </button>
            );
          })}
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- SPOT THE DIFFERENCE (7 ERROS) — usa nossas imagens ---------- */
function SpotDifferenceGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  const scene = spotScenes[sceneIdx];
  const total = scene.diffs.length;

  const reset = (i: number) => { setSceneIdx(i); setFound([]); setMisses(0); };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 100;
    const y = ((e.clientY - box.top) / box.height) * 100;
    const hit = scene.diffs.findIndex((d, i) =>
      !found.includes(i) && Math.hypot(d.x - x, d.y - y) <= d.r + 2
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

  const SceneImage = ({ withDiffs, onSceneClick }: { withDiffs: boolean; onSceneClick?: (e: React.MouseEvent<HTMLDivElement>) => void }) => (
    <div
      onClick={onSceneClick}
      className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 ${withDiffs ? "border-primary/60 cursor-pointer" : "border-border"} shadow-lg bg-black select-none`}
    >
      <img src={scene.image} alt={scene.title} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      {withDiffs && scene.diffs.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute pointer-events-none drop-shadow-lg"
          style={{ left: `${d.x}%`, top: `${d.y}%`, fontSize: d.size, transform: "translate(-50%,-50%)" }}
        >{d.emoji}</span>
      ))}
      {withDiffs && found.map((i) => {
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
  );

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <PageHeader title="Jogo dos 7 Erros" subtitle={scene.title} icon={icon7Erros} />
        <button onClick={onBack} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>

        <div className="flex justify-around mb-3 bg-popover rounded-xl py-2 shadow border border-border text-sm">
          <span className="font-display"><b className="text-primary">{found.length}</b>/{total} encontradas</span>
          <span className="font-display text-red-600">Erros: {misses}</span>
        </div>

        <div className="space-y-3" key={shakeKey}>
          <p className="text-xs text-center font-body text-muted-foreground">📷 Cena original (acima) — encontre os {total} itens extras na cena abaixo</p>
          <SceneImage withDiffs={false} />
          <div className={misses > 0 ? "animate-[shake_0.4s]" : ""}>
            <SceneImage withDiffs onSceneClick={handleClick} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-4 justify-center">
          {spotScenes.map((s, i) => (
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

/* ---------- COLORING ---------- */
function ColoringGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const [idx, setIdx] = useState(0);
  const [color, setColor] = useState(colorPalette[0]);
  const [fills, setFills] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);

  const scene = coloringScenes[idx];
  const allFilled = scene.regions.every((r) => fills[`${idx}-${r.id}`]);

  const fill = (key: string) => {
    setHistory((h) => [...h, { ...fills }]);
    setFills((p) => ({ ...p, [key]: color }));
  };
  const undo = () => {
    if (history.length === 0) return;
    setFills(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };
  const clear = () => { setHistory((h) => [...h, { ...fills }]); setFills({}); };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <PageHeader title="Colorir" subtitle={scene.title} icon={iconColorir} />
        <button onClick={onBack} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>

        <div className="flex gap-1.5 mb-3 flex-wrap justify-center bg-popover/60 rounded-xl p-2">
          {colorPalette.map((c, i) => (
            <button key={i} onClick={() => setColor(c)}
              className={`w-9 h-9 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-125 shadow-lg" : "border-border"}`}
              style={{ background: c }} aria-label={`Cor ${c}`} />
          ))}
        </div>

        <div className="flex gap-2 mb-3 justify-center">
          <button onClick={undo} disabled={history.length === 0}
            className="px-3 py-1.5 rounded-full font-display text-xs font-bold bg-popover border border-border text-foreground hover:border-primary disabled:opacity-40">↩️ Desfazer</button>
          <button onClick={clear}
            className="px-3 py-1.5 rounded-full font-display text-xs font-bold bg-popover border border-border text-foreground hover:border-primary">🗑️ Limpar</button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-border flex justify-center">
          <svg viewBox="0 0 400 300" className="w-full max-w-[400px]">
            {scene.regions.map((r) => (
              <path key={r.id} d={r.d}
                fill={fills[`${idx}-${r.id}`] || "#f5f5f5"}
                stroke="#444" strokeWidth="1.5"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => fill(`${idx}-${r.id}`)}>
                <title>{r.label}</title>
              </path>
            ))}
          </svg>
        </div>

        <div className="flex gap-2 mt-4 justify-center flex-wrap">
          {coloringScenes.map((s, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold ${idx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground"}`}>
              {s.title}
            </button>
          ))}
        </div>

        {allFilled && (
          <div className="text-center mt-4">
            <button onClick={() => celebrate(`"${scene.title}" pintado!`, 3, "🎨")}
              className="btn-cartoon px-6 py-3 text-sm">✨ Finalizar e ganhar 3 🪙</button>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground font-body mt-3">
          💡 Pinte todas as regiões para receber suas moedinhas!
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
          <button onClick={onBack} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>

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
