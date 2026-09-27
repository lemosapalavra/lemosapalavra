import czJonas from "@/assets/cruzadinha/jonas.jpg.asset.json";
import czPedro from "@/assets/cruzadinha/pedro.jpg.asset.json";
import czSansao from "@/assets/cruzadinha/sansao.jpg.asset.json";
import czJudas from "@/assets/cruzadinha/judas.jpg.asset.json";
import czSalmos from "@/assets/cruzadinha/salmos.jpg.asset.json";
import czDaniel from "@/assets/cruzadinha/daniel.jpg.asset.json";
import czArca from "@/assets/cruzadinha/arca.jpg.asset.json";
import czOvelha from "@/assets/cruzadinha/ovelha.jpg.asset.json";
import czBiblia from "@/assets/cruzadinha/biblia.jpg.asset.json";
import czAbraao from "@/assets/cruzadinha/abraao.jpg.asset.json";
import czNoe from "@/assets/cruzadinha/noe.jpg.asset.json";
import czJerico from "@/assets/cruzadinha/jerico.jpg.asset.json";
import czJose from "@/assets/cruzadinha/jose.jpg.asset.json";
import { useState, useEffect, useMemo, useRef } from "react";
import MazeTraceGame from "@/components/games/MazeTraceGame";
import WordGridGame from "@/components/games/WordGridGame";
import ConnectMatchGame from "@/components/games/ConnectMatchGame";
import { suppliedPuzzles } from "@/data/jogosPuzzles";
import ActivityAccessConfig from "@/components/ActivityAccessConfig";
import { allowedActivityIds } from "@/lib/activityAccess";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import CelebrationAnimation from "@/components/CelebrationAnimation";
import CoinBadge from "@/components/CoinBadge";
import { COINS } from "@/data/coinRewards";
import EducacionalActivities from "@/components/EducacionalActivities";
import ActivityNav from "@/components/ActivityNav";
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
import iconConstrutorPalavras from "@/assets/atividades/icone-construtor-palavras.png.asset.json";

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

// LABIRINTO — folhas dos Frutos do Espírito (uploads do usuário)
import labAlegria from "@/assets/labirinto-novo/alegria.jpg.asset.json";
import labAmor from "@/assets/labirinto-novo/amor.jpg.asset.json";
import labBondade from "@/assets/labirinto-novo/bondade.jpg.asset.json";
import labDominio from "@/assets/labirinto-novo/dominio-proprio.jpg.asset.json";
import labPaciencia from "@/assets/labirinto-novo/paciencia.jpg.asset.json";
import labPaz from "@/assets/labirinto-novo/paz.jpg.asset.json";
import iconLabirinto from "@/assets/atividades/icone-labirinto.png";

// LIGUE OS PONTOS — folhas dos Frutos do Espírito
import lpAlegria from "@/assets/ligue-pontos/alegria.jpg.asset.json";
import lpAmor from "@/assets/ligue-pontos/amor.jpg.asset.json";
import lpBenignidade from "@/assets/ligue-pontos/benignidade.jpg.asset.json";
import lpBondade from "@/assets/ligue-pontos/bondade.jpg.asset.json";
import lpDominio from "@/assets/ligue-pontos/dominio-proprio.jpg.asset.json";
import lpFidelidade from "@/assets/ligue-pontos/fidelidade.jpg.asset.json";
import lpMansidao from "@/assets/ligue-pontos/mansidao.jpg.asset.json";
import lpPaciencia from "@/assets/ligue-pontos/paciencia.jpg.asset.json";
import lpPaz from "@/assets/ligue-pontos/paz.jpg.asset.json";
import iconLiguePontos from "@/assets/atividades/icone-ligue-pontos.png";
import iconMonteDescubra from "@/assets/atividades/icone-monte-descubra.png";

// CAÇA-PALAVRAS ILUSTRADO (substitui a cruzadinha antiga)
import cacaNovo1 from "@/assets/cacapalavras-novo/caca-1.webp.asset.json";
import cacaNovo2 from "@/assets/cacapalavras-novo/caca-2.webp.asset.json";
import cacaNovo3 from "@/assets/cacapalavras-novo/caca-3.webp.asset.json";
import cacaNovo4 from "@/assets/cacapalavras-novo/caca-4.webp.asset.json";
import { saveToMural } from "@/lib/mural";

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
  { id: "ALL", label: "🎯 Tudo", color: "from-purple-400 to-pink-400", image: logoCentral },
  { id: "AT", label: "📜 Antigo Testamento", color: "from-amber-400 to-orange-500", image: imgMandamentos },
  { id: "NT", label: "✨ Novo Testamento", color: "from-sky-400 to-blue-500", image: imgCriacao },
  { id: "GERAL", label: "📖 Bíblia Geral", color: "from-emerald-400 to-teal-500", image: imgAdaoEva },
];

/* =========================================================
   MEMÓRIA — inspirado em paciencia.co/memoria
   3 níveis de dificuldade + cronômetro + movimentos
========================================================= */
// Memory uses the consistent Pixar 3D stickers (squares fit perfectly into card slots).
import mem01 from "@/assets/album/generated/herois-1.webp";
import mem02 from "@/assets/album/generated/herois-2.webp";
import mem03 from "@/assets/album/generated/herois-3.webp";
import mem04 from "@/assets/album/generated/herois-4.webp";
import mem05 from "@/assets/album/generated/herois-5.webp";
import mem06 from "@/assets/album/generated/herois-6.webp";
import mem07 from "@/assets/album/generated/herois-7.webp";
import mem08 from "@/assets/album/generated/herois-8.webp";
import mem09 from "@/assets/album/generated/criacao-1.webp";
import mem10 from "@/assets/album/generated/criacao-4.webp";
import mem11 from "@/assets/album/generated/criacao-5.webp";
import mem12 from "@/assets/album/generated/criacao-8.webp";
// Cenas bíblicas (mesmo padrão visual do quebra-cabeça) + figurinhas 3D.
const memoryScenes = [imgCriacao, imgAdaoEva, imgNoe, imgNoe2, imgDavi, imgMoises, imgMoises2, imgMandamentos];
const memoryImages = [...memoryScenes, mem01, mem02, mem03, mem04, mem05, mem06, mem07, mem08, mem09, mem10, mem11, mem12];
const memorySets = {
  facil:   memoryImages.slice(0, 6),
  medio:   memoryImages.slice(0, 8),
  dificil: memoryImages.slice(0, 12),
};
const memoryConfig = {
  facil: { cols: 4, label: "Fácil (12 cartas)", coins: 3, image: imgCriacao, theme: "Criação e Gênesis" },
  medio: { cols: 4, label: "Médio (16 cartas)", coins: 4, image: imgDavi, theme: "Heróis da Bíblia" },
  dificil: { cols: 6, label: "Difícil (24 cartas)", coins: 5, image: imgMandamentos, theme: "Antigo Testamento" },
};


/* =========================================================
   7 ERROS — imagens prontas (duas cenas empilhadas verticalmente)
   As diferenças são descritas em coordenadas LOCAIS do painel de baixo
   (0–100% da largura/altura daquele painel). `panel` guarda a posição
   exata do painel de baixo dentro da imagem completa, medida por
   detecção da moldura de cada arquivo. `spotGlobalDiffs()` converte
   para coordenadas da imagem inteira usada nos cliques.
========================================================= */
type SpotDiff = { x: number; y: number; r: number };
type SpotPanel = { l: number; t: number; w: number; h: number };
type SpotScene = { title: string; emoji: string; image: string; panel: SpotPanel; diffs: SpotDiff[] };

/** Converte diferenças locais do painel de baixo para % da imagem completa. */
function spotGlobalDiffs(scene: SpotScene): SpotDiff[] {
  const { l, t, w, h } = scene.panel;
  return scene.diffs.map((d) => ({
    x: l + (d.x * w) / 100,
    y: t + (d.y * h) / 100,
    r: Math.max(3.5, (d.r * w) / 100),
  }));
}

// Painéis e diferenças medidos automaticamente (alinhamento afim + diff
// de pixels entre o painel de cima e o de baixo de cada arquivo).
const spotScenes: SpotScene[] = [
  {
    title: "Fundo do Mar", emoji: "🐠", image: spot1.url,
    panel: { l: 3.76, t: 53.96, w: 93.61, h: 35.94 },
    diffs: [
      { x: 87.3, y: 19.9, r: 11.7 },
      { x: 37.1, y: 59.2, r: 7.8 },
      { x: 84.7, y: 84.5, r: 5.2 },
      { x: 63.8, y: 45.7, r: 5.7 },
      { x: 17.5, y: 30.4, r: 5.0 },
      { x: 23.1, y: 79.3, r: 5.8 },
      { x: 22.0, y: 91.6, r: 5.0 },
    ],
  },
  {
    title: "Animais da Floresta", emoji: "🦒", image: spot2.url,
    panel: { l: 4.21, t: 56.15, w: 94.36, h: 35.89 },
    diffs: [
      { x: 45.4, y: 19.6, r: 6.7 },
      { x: 17.8, y: 55.4, r: 5.8 },
      { x: 82.3, y: 92.4, r: 5.0 },
      { x: 73.9, y: 23.4, r: 5.0 },
      { x: 12.6, y: 22.7, r: 5.0 },
      { x: 37.9, y: 50.3, r: 5.0 },
    ],
  },
  {
    title: "Crianças no Parque", emoji: "🧒", image: spot3.url,
    panel: { l: 3.31, t: 56.30, w: 92.18, h: 35.94 },
    diffs: [
      { x: 15.8, y: 42.9, r: 12.3 },
      { x: 39.0, y: 29.2, r: 12.3 },
      { x: 67.5, y: 16.5, r: 6.9 },
      { x: 34.5, y: 53.8, r: 5.0 },
      { x: 10.4, y: 77.6, r: 5.0 },
      { x: 80.5, y: 28.2, r: 6.0 },
      { x: 17.9, y: 9.9, r: 5.0 },
    ],
  },
  {
    title: "Na Fazenda", emoji: "🐄", image: spot4.url,
    panel: { l: 3.01, t: 55.78, w: 93.31, h: 35.99 },
    diffs: [
      { x: 31.1, y: 58.1, r: 8.6 },
      { x: 94.8, y: 8.7, r: 5.1 },
      { x: 16.3, y: 84.3, r: 5.0 },
      { x: 69.1, y: 93.3, r: 5.3 },
      { x: 53.5, y: 81.0, r: 5.0 },
      { x: 84.1, y: 47.6, r: 5.0 },
    ],
  },
  {
    title: "Aventura no Mar", emoji: "🍍", image: spot5.url,
    panel: { l: 2.86, t: 54.01, w: 93.68, h: 36.09 },
    diffs: [
      { x: 76.4, y: 61.6, r: 20.2 },
      { x: 33.7, y: 53.0, r: 8.9 },
      { x: 50.1, y: 53.5, r: 5.0 },
      { x: 64.6, y: 8.2, r: 5.0 },
      { x: 57.1, y: 18.3, r: 5.0 },
      { x: 90.8, y: 95.5, r: 5.0 },
    ],
  },
  {
    title: "Piquenique no Parque", emoji: "🧺", image: spot6.url,
    panel: { l: 1.95, t: 55.73, w: 93.01, h: 35.99 },
    diffs: [
      { x: 31.0, y: 18.7, r: 8.8 },
      { x: 50.0, y: 14.5, r: 7.3 },
      { x: 65.6, y: 76.9, r: 7.1 },
      { x: 94.5, y: 78.7, r: 5.0 },
      { x: 79.2, y: 13.0, r: 5.0 },
      { x: 29.6, y: 87.1, r: 5.0 },
    ],
  },
  {
    title: "Brincando na Rua", emoji: "🌳", image: spot7.url,
    panel: { l: 2.56, t: 50.47, w: 92.86, h: 33.12 },
    diffs: [
      { x: 31.3, y: 57.6, r: 10.3 },
      { x: 64.8, y: 33.2, r: 5.8 },
      { x: 6.1, y: 39.6, r: 5.3 },
      { x: 91.4, y: 38.6, r: 5.0 },
      { x: 80.5, y: 65.1, r: 5.0 },
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
  ...suppliedPuzzles.map((p) => ({ ...p, emoji: "🧩" })),
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
  const [activeGame, setActiveGame] = useState<string | null>(() => {
    const game = new URLSearchParams(window.location.search).get("jogo");
    return ["quiz", "memory", "maze", "jigsaw", "wordbuilder"].includes(game || "") ? game : null;
  });
  const [celebration, setCelebration] = useState({ show: false, message: "", coins: 0, emoji: "🏆" });
  const isAdmin = useIsAdmin();
  const [showAccessConfig, setShowAccessConfig] = useState(false);
  const [accessVersion, setAccessVersion] = useState(0);

  useEffect(() => {
    const bump = () => setAccessVersion((v) => v + 1);
    window.addEventListener("lemos:activity-access", bump);
    return () => window.removeEventListener("lemos:activity-access", bump);
  }, []);

  // Avisa a LIA qual atividade está aberta para ela explicar o que fazer.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("lemos:lia-context", { detail: activeGame }));
    return () => { window.dispatchEvent(new CustomEvent("lemos:lia-context", { detail: null })); };
  }, [activeGame]);


  const awardCoinsRaw = (amount: number) => {
    const user = JSON.parse(localStorage.getItem("lemos_user") || "{}");
    user.coins = (user.coins || 0) + amount;
    localStorage.setItem("lemos_user", JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("lemos:coins"));
  };
  // Claim a reward once per (game, local date) so the user can't farm coins by
  // replaying the same activity multiple times in the same day.
  const claimDailyReward = (gameId: string, amount: number, label: string) => {
    const d = new Date();
    const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const key = `activity:${gameId}:${ymd}`;
    try {
      const claims = JSON.parse(localStorage.getItem("lemos_reward_claims") || "{}");
      if (claims[key]) return false;
      claims[key] = Date.now();
      localStorage.setItem("lemos_reward_claims", JSON.stringify(claims));
    } catch { /* noop */ }
    awardCoinsRaw(amount);
    toast.success(`🪙 +${amount} moedinhas!`, { description: label, duration: 3500 });
    return true;
  };

  const showCelebration = (message: string, coins: number, emoji = "🏆") => {
    const gameId = activeGame || "generic";
    const granted = claimDailyReward(gameId, coins, message);
    const shownCoins = granted ? coins : 0;
    setCelebration({
      show: true,
      message: granted ? message : `${message} (recompensa já recebida hoje)`,
      coins: shownCoins,
      emoji,
    });
  };

  const closeCelebration = () => setCelebration({ show: false, message: "", coins: 0, emoji: "🏆" });

  const allActivities = [
    { title: "Quiz Bíblico",        icon: iconQuiz,             id: "quiz",        coins: COINS.quiz,       zoom: 1 },
    { title: "Memória",             icon: iconMemoria,          id: "memory",      coins: COINS.memory,     zoom: 1 },
    { title: "Colorir",             icon: iconColorir,          id: "coloring",    coins: COINS.coloring,   zoom: 1 },
    { title: "Quebra-Cabeça",       icon: iconQuebraCabeca,     id: "jigsaw",      coins: COINS.jigsaw,     zoom: 1 },
    { title: "Caça-Palavras",       icon: iconCacaPalavras.url, id: "wordsearch",  coins: COINS.wordsearch, zoom: 1 },
    { title: "Pinte os Círculos",   icon: iconPinteCirculos.url, id: "edu:circles", coins: COINS.circles,   zoom: 1.28 },
    { title: "Ligue as Cores",      icon: iconLigueCores.url,   id: "edu:connect", coins: COINS.connect,    zoom: 1.28 },
    { title: "Labirinto",           icon: iconLabirinto,        id: "maze",        coins: COINS.maze,       zoom: 1.05 },
    { title: "Cruzadinha Bíblica",  icon: iconAtividades,       id: "crossword",   coins: COINS.crossword,  zoom: 1.15 },
    { title: "Construtor de Palavras", icon: iconConstrutorPalavras.url, id: "wordbuilder", coins: COINS.wordbuilder, zoom: 1.05 },
    { title: "Ligue os Pontos",     icon: iconLiguePontos,      id: "connectdots", coins: COINS.connectdots, zoom: 1.1 },
    { title: "Monte e Descubra",    icon: iconMonteDescubra,    id: "assemble",    coins: COINS.assemble,   zoom: 1.05 },
  ];


  // Atividades do dia: sempre 5 atividades. A janela desliza 5 posições por
  // dia, então as demais atividades entram nos dias seguintes, sem repetir
  // sempre o mesmo conjunto.
  const activities = useMemo(() => {
    // Filtro do administrador: atividades liberadas para a faixa etária do usuário.
    const allowed = allowedActivityIds();
    const pool = allowed ? allActivities.filter((a) => allowed.includes(a.id)) : allActivities;
    if (!pool.length) return [];
    const pinned = pool.filter((a) => a.id === "wordbuilder");
    const rest = pool.filter((a) => a.id !== "wordbuilder");
    const total = rest.length;
    if (!total) return pinned;
    const offset = (dayOfYear(new Date()) * 4) % total;
    const take = Math.min(pinned.length ? 4 : 5, total);
    const rotating = Array.from({ length: take }, (_, i) => rest[(offset + i) % total]);
    return [...pinned, ...rotating];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessVersion]);


  const bgStyle = { background: "transparent" };
  const Back = () => (
    <ActivityNav onBack={() => setActiveGame(null)} backLabel="Voltar às atividades" />
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
  if (activeGame === "maze")
    return <MazeTraceGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "coloring")
    return <ColoringGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "jigsaw")
    return <JigsawGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "wordsearch")
    return <WordSearchGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "wordbuilder")
    return <WordBuilderGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "connectdots")
    return <ConnectMatchGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "assemble")
    return <AssembleDiscoverGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;
  if (activeGame === "crossword")
    return <WordGridGame onBack={() => setActiveGame(null)} celebrate={showCelebration} celebration={celebration} closeCelebration={closeCelebration} bgStyle={bgStyle} />;

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
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-0 pb-8" style={bgStyle}>
      <PageHeader title="Atividades Educacionais" icon={iconAtividades} />

      {isAdmin && (
        <div className="w-full max-w-3xl flex justify-end mb-1">
          <button
            onClick={() => setShowAccessConfig(true)}
            title="Configurar atividades por faixa etária (somente administrador)"
            aria-label="Configurar atividades por faixa etária"
            className="w-11 h-11 rounded-full bg-white/90 border-2 border-amber-300 shadow flex items-center justify-center text-xl hover:scale-105 transition"
          >
            ⚙️
          </button>
        </div>
      )}
      <ActivityAccessConfig
        open={showAccessConfig}
        onClose={() => setShowAccessConfig(false)}
        activities={allActivities.map((a) => ({ id: a.id, title: a.title }))}
      />

      {activities.length === 0 && (
        <p className="font-body text-sm text-muted-foreground text-center my-8">
          Nenhuma atividade liberada para a sua faixa etária ainda.
        </p>
      )}


      <div
        className="relative orbit-area"
        style={{
          width: "min(88vw, 720px)",
          height: "min(88vw, 720px)",
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
                    <span className="block rounded-full border-2 border-primary/30 shadow-xl bg-white overflow-hidden w-[68px] h-[68px] sm:w-[72px] sm:h-[72px] lg:w-[120px] lg:h-[120px]">
                      <img src={a.icon} alt={a.title} loading="lazy"
                        className="w-full h-full object-cover"
                        style={{ transform: `scale(${(a as any).zoom ?? 1})`, transformOrigin: "center" }} />
                    </span>
                    <span className="font-display text-xs sm:text-sm font-bold text-foreground text-center leading-tight">{a.title}</span>
                    <CoinBadge amount={a.coins} size="xs" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <img loading="lazy" decoding="async" src={logoCentral} alt="Lemos a Palavra"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl w-[92px] sm:w-[120px] lg:w-[220px]" />
      </div>
      <style>{`
        .orbit-area { --orbit-radius: clamp(100px, 26vw, 125px); }
        @media (min-width: 640px) { .orbit-area { --orbit-radius: clamp(115px, 26vw, 145px); } }
        @media (min-width: 1024px) { .orbit-area { --orbit-radius: clamp(190px, 32vw, 290px); } }
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
        const coins = Math.max(3, Math.min(5, Math.ceil(final / 2)));
        celebrate(`Você acertou ${final} de ${questions.length}!`, coins, "🧠");
      } else setIdx((n) => n + 1);
    }, 1600);
  };

  if (!category) {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <ActivityNav onBack={onBack} title="Quiz Bíblico" subtitle="Escolha uma categoria" />
          <div className="grid grid-cols-2 gap-3">
            {quizCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => startCategory(c.id)}
                className={`relative overflow-hidden bg-gradient-to-br ${c.color} text-white rounded-2xl shadow-lg hover:scale-[1.03] transition-transform font-display text-left border-2 border-white/40`}
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img src={c.image} alt={c.label} loading="lazy" className="w-full h-full object-cover opacity-90" />
                </div>
                <div className="p-3 bg-black/25 backdrop-blur-sm">
                  <p className="font-bold text-sm sm:text-base leading-tight drop-shadow">{c.label}</p>
                  <p className="text-[10px] sm:text-xs opacity-90 font-body font-normal mt-0.5">
                    {c.id === "ALL" ? quizBank.length : quizBank.filter((q) => q.cat === c.id).length} perguntas
                  </p>
                </div>
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
        <ActivityNav onBack={onBack} title="Quiz Bíblico" subtitle={done ? "Resultado" : `Pergunta ${idx + 1} de ${questions.length}`} />

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
              <img loading="lazy" decoding="async"
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
                    <img loading="lazy" decoding="async" src={quizImageFor(cur.q, cur.cat)} alt="" className="w-full h-full object-cover" />
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
          const bonus = moves + 1 <= board.length * 0.75 ? 1 : 0;
          celebrate(`Concluído em ${moves + 1} jogadas e ${seconds}s!`, Math.min(5, baseCoins + bonus), "🃏");
        }
      } else setTimeout(() => setFlipped([]), 800);
    }
  };

  if (!level) {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <ActivityNav onBack={onBack} title="Jogo da Memória" subtitle="Escolha a dificuldade" />
          <DailyBanner emoji="🃏" text="Cartas de hoje — amanhã haverá uma nova combinação!" />
          <div className="grid gap-3">
            {(Object.keys(memoryConfig) as (keyof typeof memoryConfig)[]).map((k) => (
              <button key={k} onClick={() => start(k)}
                className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-2xl p-4 shadow-lg hover:scale-[1.03] transition-transform font-display text-lg font-bold text-left flex items-center gap-4">
                <img
                  src={memoryConfig[k].image}
                  alt={memoryConfig[k].theme}
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white/70 shadow-md shrink-0"
                />
                <span className="min-w-0">
                  {memoryConfig[k].label}
                  <span className="block text-xs opacity-90 font-body font-normal mt-1">
                    Cenas de {memoryConfig[k].theme}
                  </span>
                  <span className="block text-xs opacity-90 font-body font-normal">
                    Recompensa base: {memoryConfig[k].coins} 🪙 (+ bônus se for rápido!)
                  </span>
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
        <ActivityNav onBack={() => { setLevel(null); setRunning(false); }} title="Jogo da Memória" subtitle={cfg.label} backLabel="Trocar dificuldade" />

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
  const [found, setFound] = useState<{ i: number; x: number; y: number; r: number }[]>([]);
  const [misses, setMisses] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  const scene = dailyScenes[sceneIdx];
  const sceneDiffs = useMemo(() => spotGlobalDiffs(scene), [scene]);
  const total = scene.diffs.length;


  const reset = (i: number) => { setSceneIdx(i); setFound([]); setMisses(0); };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 100;
    const y = ((e.clientY - box.top) / box.height) * 100;
    // A imagem é mais alta do que larga: 1% na vertical vale menos pixels
    // do que 1% na horizontal. Corrigimos para o acerto ser circular de verdade.
    const ratio = box.height / box.width;
    const foundIdx = new Set(found.map((f) => f.i));
    const hit = sceneDiffs.findIndex((d, i) =>
      !foundIdx.has(i) && Math.hypot(d.x - x, (d.y - y) * ratio) <= d.r * 1.6 + 3
    );
    if (hit >= 0) {
      // marcador é desenhado na posição exata do erro (não onde o dedo tocou)
      const d = sceneDiffs[hit];
      const nf = [...found, { i: hit, x: d.x, y: d.y, r: d.r }];
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
        <ActivityNav onBack={onBack} title="Jogo dos 7 Erros" subtitle={scene.title} />
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
            <img loading="lazy" decoding="async" src={scene.image} alt={scene.title} className="w-full h-auto pointer-events-none block" />
            {found.map((f, k) => (
              <span
                key={`mark-${k}`}
                aria-hidden
                className="absolute pointer-events-none rounded-full border-[3px] border-red-500 animate-pulse"
                style={{
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  width: `${Math.max(6, f.r * 2)}%`,
                  paddingBottom: `${Math.max(6, f.r * 2)}%`,
                  transform: "translate(-50%,-50%)",
                }}
              />
            ))}
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
    // Se a área já estiver pintada, o clique apenas SUBSTITUI a cor (repintar).
    const startP = (sy * w + sx) * 4;
    const alreadyPainted = data[startP + 3] > 0;
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
    if (!alreadyPainted) setFills((n) => n + 1);

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
        <ActivityNav onBack={onBack} title="Colorir" subtitle={scene.title} />

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
            <img loading="lazy" decoding="async"
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
          <button
            onClick={() => celebrate(`"${scene.title}" pintado!`, 3, "🎨")}
            disabled={fills < 1}
            className="btn-cartoon px-6 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ✨ Finalizar e ganhar moedinhas
          </button>
          <button
            onClick={() => {
              const c = canvasRef.current;
              if (!c) return;
              const out = document.createElement("canvas");
              out.width = c.width; out.height = c.height;
              const octx = out.getContext("2d")!;
              octx.fillStyle = "#ffffff";
              octx.fillRect(0, 0, out.width, out.height);
              octx.drawImage(c, 0, 0);
              saveToMural({ title: scene.title, image: out.toDataURL("image/png"), activity: "Colorir" });
              toast.success("Salvo no Meu Mural! 🖼️");
            }}
            disabled={fills < 1}
            className="px-5 py-2.5 rounded-full bg-popover border border-border font-display font-bold text-foreground hover:border-primary disabled:opacity-40"
          >
            🖼️ Salvar no Meu Mural
          </button>
          {fills < 1 && (
            <p className="text-[11px] text-muted-foreground italic">Pinte pelo menos uma área para finalizar 🎨</p>
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
  const dailyPuzzleIndexes = useMemo(() => {
    const d = dayOfYear();
    const total = jigsawCatalog.length;
    return Array.from({ length: Math.min(4, total) }, (_, k) => (d + k) % total);
  }, []);
  const dayPuzzleIdx = dailyPuzzleIndexes[0];
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
      const baseCoins = difficulty === 3 ? 3 : difficulty === 4 ? 4 : 5;
      celebrate(`Quebra-cabeça completo em ${moves + 1} movimentos!`, baseCoins, "🧩");
    }
  };

  // Selection screen
  if (selectedIdx === null) {
    const daily = jigsawCatalog[dayPuzzleIdx];
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <ActivityNav onBack={onBack} title="Quebra-Cabeça" subtitle="Escolha um puzzle" />
          <DailyBanner emoji="🧩" text="Puzzle do dia — amanhã chega uma nova imagem bíblica!" />


          {/* Daily puzzle */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 rounded-2xl p-1 shadow-xl mb-5">
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-display font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">⭐ PUZZLE DO DIA</span>
                <span className="text-xs text-muted-foreground font-body">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span>
              </div>
              <div className="flex gap-3 items-center">
                <img loading="lazy" decoding="async" src={daily.image} alt={daily.title} className="w-24 h-24 object-cover rounded-xl border-2 border-amber-300" />
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

          {/* Gallery — 4 puzzles rotating daily (no repeats) */}
          <h4 className="font-display font-bold text-foreground mb-2 text-sm">📚 Galeria do Dia (4 imagens)</h4>
          <div className="grid grid-cols-2 gap-3">
            {dailyPuzzleIndexes.map((i) => {
              const p = jigsawCatalog[i];
              return (
                <button key={i} onClick={() => start(i, 3)}
                  className="bg-popover rounded-2xl p-3 shadow-md hover:shadow-lg hover:scale-105 transition-all border border-border text-center group">
                  <img loading="lazy" decoding="async" src={p.image} alt={p.title} className="w-full aspect-square object-cover rounded-xl mb-2 group-hover:brightness-110 transition" />
                  <h3 className="font-display text-sm font-bold text-foreground">{p.emoji} {p.title}</h3>
                </button>
              );
            })}
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
        <ActivityNav onBack={() => { setSelectedIdx(null); setRunning(false); }} title="Quebra-Cabeça" subtitle={`${puzzle.title} • ${gs}x${gs}`} backLabel="Trocar puzzle" />

        <div className="flex justify-around mb-3 bg-popover rounded-xl py-2 shadow border border-border text-sm">
          <span className="font-display">🔀 <b>{moves}</b> movimentos</span>
          <span className="font-display text-primary">⏱ {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span>
          <button onClick={() => setShowRef((v) => !v)} className="font-display text-xs underline text-muted-foreground">{showRef ? "Ocultar" : "Ver"} referência</button>
        </div>

        {showRef && (
          <div className="flex justify-center mb-3">
            <img loading="lazy" decoding="async" src={puzzle.image} alt="Referência" className="w-28 h-28 rounded-xl border-4 border-primary/40 shadow-lg object-cover" />
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
type CacaCard = { title: string; words: string[]; size: number; reference?: string; image: string };
const cacaCards: CacaCard[] = [
  {
    title: "Heróis da Bíblia",
    size: 6,
    words: ["JESUS", "DAVI", "NOE", "JOSE"],
    reference: "Fácil para crianças",
    image: imgDavi,
  },
  {
    title: "O Natal",
    size: 6,
    words: ["JESUS", "MARIA", "ANJO", "JOSE"],
    reference: "Lucas 2",
    image: imgCriacao,
  },
  {
    title: "Bichinhos da Arca",
    size: 6,
    words: ["NOE", "LEAO", "URSO", "POMBA"],
    reference: "Gênesis 7",
    image: imgNoe,
  },

];

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
type Dir = { dx: number; dy: number };
// Kid-friendly: only horizontal (→) and vertical (↓) — no diagonals.
const DIRS: Dir[] = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
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
  const celebratedRef = useRef<string | null>(null);
  useEffect(() => {
    if (completed && celebratedRef.current !== card.title) {
      celebratedRef.current = card.title;
      const coins = Math.max(3, Math.min(5, wordsInPlay.length));
      // small delay so the last "ok" flash is visible
      setTimeout(() => {
        celebrate(`Você achou todas as ${wordsInPlay.length} palavras!`, coins, "🔎");
      }, 400);
    }
    if (!completed && celebratedRef.current === card.title) {
      celebratedRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, card.title]);

  const switchCard = (c: CacaCard) => {
    setCard(c); setFound(new Set()); setFoundCells(new Set()); setStart(null); setHoverEnd(null);
  };

  const resetCard = () => {
    setFound(new Set()); setFoundCells(new Set()); setStart(null); setHoverEnd(null);
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-3xl mx-auto">
        <ActivityNav onBack={onBack} title="Caça-Palavras" subtitle={card.title} />


        {/* Card selector — com imagem do tema (mesmo padrão do quebra-cabeça) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
          {cacaCards.map((c) => (
            <button
              key={c.title}
              onClick={() => switchCard(c)}
              className={`rounded-2xl overflow-hidden border-4 transition text-center ${
                card.title === c.title
                  ? "border-amber-600 shadow-xl scale-[1.02]"
                  : "border-amber-200 hover:border-amber-400"
              }`}
            >
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                decoding="async"
                className="w-full h-16 sm:h-24 object-cover"
              />
              <span
                className={`block px-1 py-1.5 text-[11px] sm:text-xs font-display font-bold ${
                  card.title === c.title ? "bg-amber-500 text-white" : "bg-white text-amber-900"
                }`}
              >
                {c.title}
              </span>
            </button>
          ))}
        </div>

        {/* Ilustração do tema atual */}
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/85 border-2 border-amber-200 p-2 shadow">
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            decoding="async"
            className="w-16 h-16 rounded-xl object-cover border-2 border-amber-300 shrink-0"
          />
          <div className="min-w-0 text-left">
            <p className="font-display font-extrabold text-amber-950 text-sm">{card.title}</p>
            {card.reference && <p className="font-body text-xs text-amber-800">{card.reference}</p>}
          </div>
        </div>


        {/* Letter grid */}
        <div className="bg-white rounded-2xl border-4 border-amber-300 shadow-2xl p-2 sm:p-3 mb-4 overflow-hidden">
          <div
            className="grid gap-1 mx-auto w-full"
            style={{
              gridTemplateColumns: `repeat(${card.size}, minmax(0, 1fr))`,
              maxWidth: `${card.size * 56}px`,
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
                    className={`aspect-square w-full min-w-0 flex items-center justify-center rounded-md sm:rounded-lg font-display font-extrabold leading-none select-none transition overflow-hidden ${cls} border border-amber-200`}
                    style={{ fontSize: "clamp(11px, 4.2vw, 20px)" }}
                  >
                    <span className="pointer-events-none block w-full text-center overflow-hidden whitespace-nowrap" style={{ lineHeight: 1 }}>{ch}</span>
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



/* =========================================================
   CRUZADINHA BÍBLICA — palavras cruzadas com palavra-chave vertical
   Todas as respostas e dicas vêm das Escrituras.
========================================================= */
type CrossWord = {
  answer: string;
  clue: string;
  emoji: string;
  /** Ilustração que ajuda a criança a descobrir a palavra. */
  img?: string;
  row: number;
  col: number;
};
type CrossPuzzle = {
  title: string;
  keyword: string;
  keyCol: number;
  keyClue: string;
  words: CrossWord[];
};

const crosswordPuzzles: CrossPuzzle[] = [
  {
    title: "O Nome acima de todo nome",
    keyword: "JESUS",
    keyCol: 6,
    keyClue: "O Salvador do mundo",
    words: [
      { img: czJonas.url, answer: "JONAS",  clue: "Profeta engolido por um grande peixe",        emoji: "🐋", row: 0, col: 6 },
      { img: czPedro.url, answer: "PEDRO",  clue: "Discípulo pescador que negou Jesus 3 vezes",  emoji: "🎣", row: 1, col: 5 },
      { img: czSansao.url, answer: "SANSAO", clue: "Juiz muito forte por causa dos cabelos",      emoji: "💪", row: 2, col: 6 },
      { img: czJudas.url, answer: "JUDAS",  clue: "Discípulo que traiu Jesus por moedas",        emoji: "🪙", row: 3, col: 5 },
      { img: czSalmos.url, answer: "SALMOS", clue: "Livro de cânticos e orações de Davi",         emoji: "🎵", row: 4, col: 6 },
    ],
  },
  {
    title: "O pastorzinho corajoso",
    keyword: "DAVI",
    keyCol: 6,
    keyClue: "Pastorzinho que venceu o gigante Golias",
    words: [
      { img: czDaniel.url, answer: "DANIEL", clue: "Foi lançado na cova dos leões e Deus o guardou", emoji: "🦁", row: 0, col: 6 },
      { img: czArca.url, answer: "ARCA",   clue: "Barco enorme que Noé construiu",                 emoji: "🚢", row: 1, col: 6 },
      { img: czOvelha.url, answer: "OVELHA", clue: "Animal que o Bom Pastor sai a procurar",         emoji: "🐑", row: 2, col: 5 },
      { img: czBiblia.url, answer: "BIBLIA", clue: "A Palavra de Deus escrita",                      emoji: "📖", row: 3, col: 5 },
    ],
  },
  {
    title: "Mensageiro do Céu",
    keyword: "ANJO",
    keyCol: 6,
    keyClue: "Mensageiro enviado por Deus",
    words: [
      { img: czAbraao.url, answer: "ABRAAO", clue: "Pai da fé, chamado por Deus",                emoji: "🌟", row: 0, col: 6 },
      { img: czNoe.url, answer: "NOE",    clue: "Construiu a arca por obediência",            emoji: "🚢", row: 1, col: 6 },
      { img: czJerico.url, answer: "JERICO", clue: "Cidade cujos muros caíram",                  emoji: "🏛️", row: 2, col: 6 },
      { img: czJose.url, answer: "JOSE",   clue: "Vendido pelos irmãos, governou o Egito",     emoji: "👑", row: 3, col: 5 },
    ],
  },
];

/**
 * Lê a coluna destacada direto da grade (linha a linha) — assim a palavra-chave
 * mostrada é SEMPRE a que realmente sai das palavras, nunca uma divergência.
 */
export function crosswordKeywordFromGrid(p: CrossPuzzle): string {
  return p.words
    .slice()
    .sort((a, b) => a.row - b.row)
    .map((w) => w.answer[p.keyCol - w.col] ?? "?")
    .join("");
}

export const __crosswordPuzzles = crosswordPuzzles;

function CrosswordGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const puzzle = useMemo(() => crosswordPuzzles[dayOfYear() % crosswordPuzzles.length], []);
  const keyword = useMemo(() => crosswordKeywordFromGrid(puzzle), [puzzle]);


  // Todas as células da grade + letra esperada
  const cells = useMemo(() => {
    const map = new Map<string, string>();
    puzzle.words.forEach((w) => {
      w.answer.split("").forEach((ch, i) => map.set(`${w.row}:${w.col + i}`, ch));
    });
    return map;
  }, [puzzle]);

  // Número da palavra que começa em cada célula (para casar dica ↔ grade)
  const starts = useMemo(() => {
    const m = new Map<string, number>();
    puzzle.words.forEach((w, i) => m.set(`${w.row}:${w.col}`, i + 1));
    return m;
  }, [puzzle]);

  const bounds = useMemo(() => {
    let minC = 99, maxC = 0, maxR = 0;
    cells.forEach((_, k) => {
      const [r, c] = k.split(":").map(Number);
      minC = Math.min(minC, c); maxC = Math.max(maxC, c); maxR = Math.max(maxR, r);
    });
    return { minC, maxC, maxR };
  }, [cells]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const solved = puzzle.words.every((w) =>
    w.answer.split("").every((ch, i) => (values[`${w.row}:${w.col + i}`] || "") === ch)
  );

  const setCell = (key: string, raw: string) => {
    const ch = raw.slice(-1).toUpperCase().replace(/[^A-ZÇ]/g, "");
    setValues((v) => ({ ...v, [key]: ch }));
    setChecked(false);
  };

  const check = () => {
    setChecked(true);
    if (solved) celebrate(`Cruzadinha completa: ${keyword}!`, COINS.crossword, "🧩");
  };

  const reveal = () => {
    const all: Record<string, string> = {};
    cells.forEach((ch, k) => { all[k] = ch; });
    setValues(all);
    setChecked(true);
  };

  const cols = bounds.maxC - bounds.minC + 1;

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <ActivityNav onBack={onBack} title="Cruzadinha Bíblica" subtitle={puzzle.title} />
        <DailyBanner emoji="✏️" text="Uma cruzadinha nova a cada dia — complete e ganhe moedinhas!" />

        {/* Grade */}
        <div className="bg-popover rounded-2xl border-2 border-primary/40 shadow p-2 sm:p-4 overflow-x-auto">
          <div className="mx-auto" style={{ width: "fit-content" }}>
            {Array.from({ length: bounds.maxR + 1 }, (_, r) => (
              <div key={r} className="flex">
                {Array.from({ length: cols }, (_, ci) => {
                  const c = bounds.minC + ci;
                  const key = `${r}:${c}`;
                  const expected = cells.get(key);
                  if (!expected) return <div key={c} className="w-8 h-8 sm:w-10 sm:h-10 m-[1px]" />;
                  const val = values[key] || "";
                  const isKey = c === puzzle.keyCol;
                  const wrong = checked && val !== expected;
                  const startNo = starts.get(key);
                  return (
                    <div key={c} className="relative m-[1px]">
                      {startNo && (
                        <span className="absolute -top-1 -left-1 z-10 text-[9px] font-display font-extrabold bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center shadow">
                          {startNo}
                        </span>
                      )}
                      <input
                        value={val}
                        onChange={(e) => setCell(key, e.target.value)}
                        maxLength={1}
                        inputMode="text"
                        aria-label={`Letra linha ${r + 1} coluna ${c + 1}`}
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-center font-display font-extrabold text-base sm:text-lg rounded-md border-2 outline-none transition
                          ${isKey ? "bg-amber-100 border-amber-500 text-amber-900" : "bg-white border-primary/40 text-foreground"}
                          ${wrong ? "border-red-500 bg-red-50" : ""}
                          focus:ring-2 focus:ring-primary`}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] font-body text-amber-800 mt-2">
            🔑 Coluna destacada: <b>{puzzle.keyClue}</b> ({keyword.length} letras)
          </p>
        </div>

        {/* Dicas */}
        <div className="mt-4 grid gap-2">
          {puzzle.words.map((w, i) => (
            <div key={i} className="flex items-center gap-3 bg-popover rounded-xl border border-border px-3 py-2 shadow-sm">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground font-display font-extrabold text-xs flex items-center justify-center">
                {i + 1}
              </span>
              {w.img ? (
                <img
                  src={w.img}
                  alt={w.clue}
                  width={512}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain bg-white border border-amber-200 shadow-sm"
                />
              ) : (
                <span className="shrink-0 w-14 h-14 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-2xl">{w.emoji}</span>
              )}
              <p className="font-body text-xs sm:text-sm text-foreground">
                {w.clue}{" "}
                <span className="text-muted-foreground">({w.answer.length} letras)</span>
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          <button onClick={check} className="btn-cartoon px-5 py-2.5">✅ Conferir</button>
          <button onClick={() => { setValues({}); setChecked(false); }} className="px-5 py-2.5 rounded-full bg-popover border border-border font-display font-bold text-foreground hover:border-primary">
            🔄 Limpar
          </button>
          <button onClick={reveal} className="px-5 py-2.5 rounded-full bg-popover border border-border font-display font-bold text-muted-foreground hover:border-primary">
            💡 Mostrar respostas
          </button>
        </div>

        {checked && (
          <p className={`text-center font-display font-bold mt-3 ${solved ? "text-emerald-600" : "text-red-600"}`}>
            {solved ? "🎉 Perfeito! Você completou a cruzadinha!" : "Ainda faltam letras — as erradas estão em vermelho."}
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground font-body mt-3">
          💡 Complete a cruzadinha e ganhe {COINS.crossword} moedinhas 🪙
        </p>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- CONSTRUTOR DE PALAVRAS ---------- */
type BuilderRound = { img: string; answer: string; syllables: string[]; extras: string[]; hint: string };

const builderRounds: BuilderRound[] = [
  { img: czJonas.url,  answer: "JONAS",  syllables: ["JO", "NAS"],        extras: ["MA", "TE"], hint: "Profeta engolido por um grande peixe" },
  { img: czNoe.url,    answer: "NOE",    syllables: ["NO", "E"],          extras: ["CA", "RI"], hint: "Construiu a arca por obediência a Deus" },
  { img: czPedro.url,  answer: "PEDRO",  syllables: ["PE", "DRO"],        extras: ["LA", "SO"], hint: "Discípulo pescador chamado por Jesus" },
  { img: czDaniel.url, answer: "DANIEL", syllables: ["DA", "NI", "EL"],   extras: ["BO", "TU"], hint: "Foi guardado por Deus na cova dos leões" },
  { img: czArca.url,   answer: "ARCA",   syllables: ["AR", "CA"],         extras: ["ME", "PI"], hint: "Barco enorme feito por Noé" },
  { img: czOvelha.url, answer: "OVELHA", syllables: ["O", "VE", "LHA"],   extras: ["SI", "RO"], hint: "Animal que o Bom Pastor procura" },
  { img: czBiblia.url, answer: "BIBLIA", syllables: ["BI", "BLI", "A"],   extras: ["NE", "TO"], hint: "A Palavra de Deus escrita" },
  { img: czAbraao.url, answer: "ABRAAO", syllables: ["A", "BRA", "AO"],   extras: ["MI", "PE"], hint: "O pai da fé" },
  { img: czJose.url,   answer: "JOSE",   syllables: ["JO", "SE"],         extras: ["VA", "TI"], hint: "Vendido pelos irmãos, governou o Egito" },
  { img: czJerico.url, answer: "JERICO", syllables: ["JE", "RI", "CO"],   extras: ["PA", "LU"], hint: "Cidade cujos muros caíram" },
  { img: czSalmos.url, answer: "SALMOS", syllables: ["SAL", "MOS"],       extras: ["DE", "NA"], hint: "Livro de cânticos e orações" },
  { img: czSansao.url, answer: "SANSAO", syllables: ["SAN", "SAO"],       extras: ["CO", "RE"], hint: "Juiz muito forte por causa dos cabelos" },
];

function WordBuilderGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const rounds = useMemo(() => {
    const start = dayOfYear() % builderRounds.length;
    return Array.from({ length: 5 }, (_, i) => builderRounds[(start + i) % builderRounds.length]);
  }, []);

  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [done, setDone] = useState(0);
  const round = rounds[idx];

  const pool = useMemo(() => {
    const all = [...round.syllables, ...round.extras];
    // embaralhamento estável por rodada
    return all
      .map((s, i) => ({ s, k: ((i + 1) * 7919 + round.answer.length * 31) % 97 }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.s);
  }, [round]);

  const used = useMemo(() => {
    const c: Record<string, number> = {};
    placed.forEach((p) => { c[p] = (c[p] || 0) + 1; });
    return c;
  }, [placed]);

  const add = (s: string) => {
    if (placed.length >= round.syllables.length) return;
    const next = [...placed, s];
    setPlaced(next);
    setStatus("idle");
    if (next.length === round.syllables.length) {
      const ok = next.join("") === round.syllables.join("");
      setStatus(ok ? "ok" : "err");
      if (ok) {
        const total = done + 1;
        setDone(total);
        if (total >= rounds.length) {
          setTimeout(() => celebrate("Você construiu todas as palavras!", COINS.wordbuilder, "🔤"), 500);
        }
      }
    }
  };

  const removeAt = (i: number) => {
    setPlaced((p) => p.filter((_, j) => j !== i));
    setStatus("idle");
  };

  const next = () => {
    setIdx((i) => (i + 1) % rounds.length);
    setPlaced([]);
    setStatus("idle");
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <ActivityNav onBack={onBack} title="Construtor de Palavras" subtitle="Monte a palavra da figura com as sílabas" />
        <DailyBanner emoji="🔤" text="Toque nas sílabas na ordem certa e forme a palavra da imagem!" />

        <div className="bg-popover rounded-2xl border-2 border-primary/40 shadow p-4 text-center">
          <p className="font-display font-bold text-sm text-muted-foreground mb-2">
            Palavra {idx + 1} de {rounds.length} · acertos: {done}
          </p>

          <img
            src={round.img}
            alt={round.hint}
            width={512}
            height={512}
            loading="lazy"
            decoding="async"
            className="mx-auto w-40 h-40 sm:w-52 sm:h-52 object-contain rounded-2xl bg-white border-2 border-amber-200 shadow-sm"
          />
          <p className="mt-3 mx-auto max-w-md rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 shadow px-4 py-3 font-display font-extrabold text-lg sm:text-2xl text-amber-900 leading-snug">
            💡 {round.hint}
          </p>

          {/* Espaços da palavra */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {round.syllables.map((_, i) => {
              const val = placed[i];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => val && removeAt(i)}
                  aria-label={val ? `Remover sílaba ${val}` : "Espaço vazio"}
                  className={`w-16 h-14 sm:w-20 sm:h-16 rounded-xl border-2 border-dashed font-display font-extrabold text-lg sm:text-xl flex items-center justify-center transition
                    ${val ? "border-solid bg-gradient-to-b from-amber-200 to-amber-300 text-amber-900 border-amber-500 shadow" : "bg-white/70 border-primary/40 text-muted-foreground"}
                    ${status === "err" ? "border-red-400" : ""}
                    ${status === "ok" ? "border-emerald-500" : ""}`}
                >
                  {val || "?"}
                </button>
              );
            })}
          </div>

          {/* Sílabas disponíveis */}
          <div className="flex justify-center gap-2 mt-5 flex-wrap">
            {pool.map((s, i) => {
              const available = pool.filter((x) => x === s).length - (used[s] || 0) > 0;
              return (
                <button
                  key={`${s}-${i}`}
                  type="button"
                  disabled={!available}
                  onClick={() => add(s)}
                  className={`px-4 py-3 rounded-xl font-display font-extrabold text-base sm:text-lg border-2 shadow transition
                    ${available
                      ? "bg-gradient-to-b from-sky-200 to-sky-300 border-sky-500 text-sky-900 hover:scale-110"
                      : "bg-muted border-border text-muted-foreground opacity-40"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          {status === "ok" && (
            <p className="font-display font-bold text-emerald-600 mt-4">🎉 Isso mesmo: {round.answer}!</p>
          )}
          {status === "err" && (
            <p className="font-display font-bold text-red-600 mt-4">Quase! Toque nas sílabas para trocar.</p>
          )}

          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <button onClick={() => { setPlaced([]); setStatus("idle"); }} className="px-5 py-2.5 rounded-full bg-popover border border-border font-display font-bold text-foreground hover:border-primary">
              🔄 Limpar
            </button>
            <button onClick={next} className="btn-cartoon px-5 py-2.5">➡️ Próxima palavra</button>
          </div>

          <p className="text-center text-xs text-muted-foreground font-body mt-3">
            💡 Complete as {rounds.length} palavras e ganhe {COINS.wordbuilder} moedinhas 🪙
          </p>
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- LABIRINTO — folhas dos Frutos do Espírito ---------- */
const mazeSheets = [
  { id: "amor", title: "Amor", emoji: "❤️", img: labAmor.url },
  { id: "alegria", title: "Alegria", emoji: "😀", img: labAlegria.url },
  { id: "paz", title: "Paz", emoji: "🕊️", img: labPaz.url },
  { id: "paciencia", title: "Paciência", emoji: "⏳", img: labPaciencia.url },
  { id: "bondade", title: "Bondade", emoji: "🎁", img: labBondade.url },
  { id: "dominio", title: "Domínio Próprio", emoji: "🙏", img: labDominio.url },
];

function MazeGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const daily = useMemo(() => {
    const start = dayOfYear() % mazeSheets.length;
    return Array.from({ length: 3 }, (_, k) => mazeSheets[(start + k) % mazeSheets.length]);
  }, []);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const sheet = daily[idx];

  const finish = () => {
    if (done.includes(sheet.id)) return;
    setDone((d) => [...d, sheet.id]);
    celebrate(`Você chegou até a atitude de ${sheet.title}!`, COINS.maze, "🧭");
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <ActivityNav onBack={onBack} title="Labirinto" subtitle={sheet.title} />
        <DailyBanner emoji="🧭" text="Labirintos novos a cada dia — siga o caminho até a chegada!" />

        <div className="bg-white rounded-2xl border-2 border-primary/40 shadow p-2 sm:p-3">
          <img
            src={sheet.img}
            alt={`Labirinto da ${sheet.title}`}
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-xl select-none"
            draggable={false}
          />
        </div>

        <div className="flex gap-2 flex-wrap mt-4 justify-center">
          {daily.map((s, i) => (
            <button key={s.id} onClick={() => setIdx(i)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold transition ${idx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground hover:border-primary"}`}>
              {s.emoji} {s.title}{done.includes(s.id) ? " ✅" : ""}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 mt-5">
          <CoinBadge amount={COINS.maze} size="md" label="ao concluir" />
          <div className="flex gap-2 flex-wrap justify-center">
            <button onClick={finish} disabled={done.includes(sheet.id)} className="btn-cartoon px-6 py-3 text-sm disabled:opacity-40">
              ✅ Concluí este labirinto
            </button>
            <button
              onClick={() => { saveToMural({ title: `Labirinto da ${sheet.title}`, image: sheet.img, activity: "Labirinto" }); toast.success("Salvo no Meu Mural! 🖼️"); }}
              className="px-5 py-2.5 rounded-full bg-popover border border-border font-display font-bold text-foreground hover:border-primary"
            >
              🖼️ Salvar no Meu Mural
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground font-body mt-1">
            💡 Siga com o dedo do “COMECE AQUI” até a “CHEGADA” e depois toque em concluir.
          </p>
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- CAÇA-PALAVRAS ILUSTRADO (antiga Cruzadinha) ---------- */
const findSheets = [
  { id: "frutos", title: "Frutos do Espírito", img: cacaNovo1.url, words: ["AMOR", "ALEGRIA", "PAZ", "PACIÊNCIA", "BENIGNIDADE", "BONDADE", "FIDELIDADE", "MANSIDÃO", "DOMÍNIO PRÓPRIO"] },
  { id: "profetas", title: "Profetas e Servos", img: cacaNovo2.url, words: ["DANIEL", "ISAÍAS", "SANSÃO", "ELISEU", "SARA", "RUTE", "GIDEÃO", "SAMUEL"] },
  { id: "personagens", title: "Personagens da Bíblia", img: cacaNovo3.url, words: ["ABRAÃO", "MOISÉS", "ESTER", "DAVI", "PAULO", "NOÉ", "JOSUÉ", "MARIA"] },
  { id: "simbolos", title: "Símbolos da Fé", img: cacaNovo4.url, words: ["CRUZ", "BÍBLIA", "CÁLICE", "PÃO", "VINHO", "ARCA", "COROA", "PEIXE"] },
];

function WordFindImageGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const [idx, setIdx] = useState(() => dayOfYear() % findSheets.length);
  const [found, setFound] = useState<Record<string, string[]>>({});
  const sheet = findSheets[idx];
  const marked = found[sheet.id] || [];
  const complete = marked.length === sheet.words.length;

  const toggle = (w: string) => {
    setFound((f) => {
      const cur = f[sheet.id] || [];
      const next = cur.includes(w) ? cur.filter((x) => x !== w) : [...cur, w];
      if (next.length === sheet.words.length) {
        setTimeout(() => celebrate(`Você achou todas as palavras de ${sheet.title}!`, COINS.crossword, "🔤"), 300);
      }
      return { ...f, [sheet.id]: next };
    });
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <ActivityNav onBack={onBack} title="Cruzadinha Bíblica" subtitle={sheet.title} />
        <DailyBanner emoji="🔤" text="Encontre as palavras na grade e marque cada uma na lista!" />

        <div className="bg-white rounded-2xl border-2 border-primary/40 shadow p-2 sm:p-3">
          <img src={sheet.img} alt={`Caça-palavras: ${sheet.title}`} loading="lazy" decoding="async" className="w-full h-auto rounded-xl select-none" draggable={false} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {sheet.words.map((w) => {
            const ok = marked.includes(w);
            return (
              <button key={w} onClick={() => toggle(w)}
                title={ok ? "Desmarcar palavra" : "Marcar como encontrada"}
                className={`px-3 py-2 rounded-full font-display font-extrabold text-sm border-2 transition ${ok ? "bg-emerald-500 text-white border-emerald-600 line-through" : "bg-white text-amber-900 border-amber-300 hover:border-primary"}`}>
                {ok ? "✅ " : ""}{w}
              </button>
            );
          })}
        </div>

        <p className={`text-center font-display font-bold mt-3 ${complete ? "text-emerald-600" : "text-muted-foreground"}`}>
          {complete ? "🎉 Perfeito! Você encontrou todas!" : `${marked.length} de ${sheet.words.length} palavras encontradas`}
        </p>

        <div className="flex gap-2 flex-wrap mt-4 justify-center">
          {findSheets.map((s, i) => (
            <button key={s.id} onClick={() => setIdx(i)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold transition ${idx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground hover:border-primary"}`}>
              {s.title}
            </button>
          ))}
          <button
            onClick={() => { saveToMural({ title: `Caça-palavras: ${sheet.title}`, image: sheet.img, activity: "Caça-palavras" }); toast.success("Salvo no Meu Mural! 🖼️"); }}
            className="px-3 py-1.5 rounded-full bg-popover border border-border font-display text-xs font-bold text-foreground hover:border-primary"
          >
            🖼️ Salvar no Meu Mural
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-3">
          💡 Complete a lista e ganhe {COINS.crossword} moedinhas 🪙
        </p>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- LIGUE OS PONTOS (folhas dos Frutos do Espírito) ---------- */
const dotsSheets = [
  { id: "amor", title: "Amor", emoji: "❤️", img: lpAmor.url },
  { id: "alegria", title: "Alegria", emoji: "😄", img: lpAlegria.url },
  { id: "paz", title: "Paz", emoji: "🕊️", img: lpPaz.url },
  { id: "paciencia", title: "Paciência", emoji: "⏳", img: lpPaciencia.url },
  { id: "benignidade", title: "Benignidade", emoji: "🌸", img: lpBenignidade.url },
  { id: "bondade", title: "Bondade", emoji: "🎁", img: lpBondade.url },
  { id: "fidelidade", title: "Fidelidade", emoji: "🔵", img: lpFidelidade.url },
  { id: "mansidao", title: "Mansidão", emoji: "💠", img: lpMansidao.url },
  { id: "dominio", title: "Domínio Próprio", emoji: "🙏", img: lpDominio.url },
];

const dotsColors = ["#e11d48", "#2563eb", "#16a34a", "#f59e0b", "#7c3aed"];

function ConnectDotsGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const daily = useMemo(() => {
    const start = dayOfYear() % dotsSheets.length;
    return Array.from({ length: 3 }, (_, k) => dotsSheets[(start + k) % dotsSheets.length]);
  }, []);
  const [idx, setIdx] = useState(0);
  const [color, setColor] = useState(dotsColors[0]);
  const [lines, setLines] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const sheet = daily[idx];

  useEffect(() => {
    const c = canvasRef.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setLines(0);
  }, [idx]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const { x, y } = pos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setLines((n) => n + 1);
  };

  const clear = () => {
    const c = canvasRef.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setLines(0);
  };

  const finish = () => {
    if (done.includes(sheet.id)) return;
    setDone((d) => [...d, sheet.id]);
    celebrate(`Você ligou os pontos de ${sheet.title}!`, COINS.connectdots, "✏️");
  };

  const toMural = () => {
    const c = canvasRef.current;
    if (!c) return;
    const base = new Image();
    base.crossOrigin = "anonymous";
    base.onload = () => {
      const out = document.createElement("canvas");
      out.width = c.width; out.height = c.height;
      const octx = out.getContext("2d")!;
      octx.fillStyle = "#ffffff";
      octx.fillRect(0, 0, out.width, out.height);
      octx.drawImage(base, 0, 0, out.width, out.height);
      octx.drawImage(c, 0, 0);
      saveToMural({ title: `Ligue os Pontos · ${sheet.title}`, image: out.toDataURL("image/png"), activity: "Ligue os Pontos" });
      toast.success("Pregado no Meu Mural! 🖼️");
    };
    base.onerror = () => {
      saveToMural({ title: `Ligue os Pontos · ${sheet.title}`, image: sheet.img, activity: "Ligue os Pontos" });
      toast.success("Pregado no Meu Mural! 🖼️");
    };
    base.src = sheet.img;
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <ActivityNav onBack={onBack} title="Ligue os Pontos" subtitle={sheet.title} />
        <DailyBanner emoji="✏️" text="Ligue cada desenho à frase certa arrastando o dedo de um ponto ao outro!" />

        <div className="flex flex-wrap gap-2 justify-center mb-3">
          {dotsColors.map((c) => (
            <button key={c} onClick={() => setColor(c)} title="Escolher a cor do traço"
              className={`w-8 h-8 rounded-full border-2 shadow ${color === c ? "border-foreground scale-110" : "border-white"}`}
              style={{ background: c }} />
          ))}
          <button onClick={clear} title="Apagar todos os traços"
            className="px-3 h-8 rounded-full font-display text-xs font-extrabold bg-popover border border-border text-foreground hover:border-primary">
            🧽 Apagar traços
          </button>
        </div>

        <div className="relative bg-white rounded-2xl border-2 border-primary/40 shadow p-2 sm:p-3">
          <div className="relative w-full" style={{ aspectRatio: "1 / 1.414" }}>
            <img src={sheet.img} alt={`Ligue os pontos — ${sheet.title}`} loading="lazy" decoding="async"
              className="absolute inset-0 w-full h-full object-contain rounded-xl select-none pointer-events-none" draggable={false} />
            <canvas
              ref={canvasRef}
              width={848}
              height={1200}
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerLeave={end}
              className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-4 justify-center">
          {daily.map((s, i) => (
            <button key={s.id} onClick={() => setIdx(i)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold transition ${idx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground hover:border-primary"}`}>
              {s.emoji} {s.title}{done.includes(s.id) ? " ✅" : ""}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 mt-5">
          <CoinBadge amount={COINS.connectdots} size="md" label="ao concluir" />
          <div className="flex gap-2 flex-wrap justify-center">
            <button onClick={finish} disabled={lines < 1 || done.includes(sheet.id)} className="btn-cartoon px-6 py-3 text-sm disabled:opacity-40">
              ✅ Terminei de ligar
            </button>
            <button onClick={toMural} disabled={lines < 1}
              className="px-5 py-2.5 rounded-full bg-popover border border-border font-display font-bold text-foreground hover:border-primary disabled:opacity-40">
              🖼️ Salvar no Meu Mural
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground font-body mt-1">
            💡 Arraste do pontinho do desenho até o pontinho da frase correspondente.
          </p>
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}

/* ---------- MONTE E DESCUBRA ---------- */
function AssembleDiscoverGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: GameProps) {
  const scene = useMemo(() => jigsawCatalog[dayOfYear() % jigsawCatalog.length], []);
  const options = useMemo(() => {
    const others = jigsawCatalog.filter((s) => s.title !== scene.title).map((s) => s.title);
    const picks = [scene.title, others[dayOfYear() % others.length], others[(dayOfYear() + 3) % others.length]];
    return Array.from(new Set(picks)).sort((a, b) => a.localeCompare(b));
  }, [scene]);

  const SIZE = 3;
  const N = SIZE * SIZE;
  const [tiles, setTiles] = useState<number[]>(() => {
    const arr = Array.from({ length: N }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (dayOfYear() * (i + 7)) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [sel, setSel] = useState<number | null>(null);
  const [guess, setGuess] = useState<string | null>(null);

  const solved = tiles.every((t, i) => t === i);

  const tap = (i: number) => {
    if (solved) return;
    if (sel === null) { setSel(i); return; }
    if (sel === i) { setSel(null); return; }
    setTiles((t) => {
      const next = [...t];
      [next[sel], next[i]] = [next[i], next[sel]];
      return next;
    });
    setSel(null);
  };

  const choose = (title: string) => {
    setGuess(title);
    if (title === scene.title) {
      celebrate(`Você montou e descobriu: ${scene.title}!`, COINS.assemble, "🧩");
    }
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-lg mx-auto">
        <ActivityNav onBack={onBack} title="Monte e Descubra" subtitle="Monte a imagem e descubra a história" />
        <DailyBanner emoji="🧩" text="Uma imagem misteriosa por dia — monte e descubra qual história é!" />

        <div className="bg-white rounded-2xl border-2 border-primary/40 shadow p-3">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
            {tiles.map((t, i) => (
              <button
                key={i}
                onClick={() => tap(i)}
                title="Toque em duas peças para trocá-las de lugar"
                className={`relative aspect-square overflow-hidden rounded-md border-2 bg-white transition ${sel === i ? "border-primary scale-95" : "border-white"}`}
              >
                <img
                  src={scene.image}
                  alt=""
                  draggable={false}
                  className="absolute select-none pointer-events-none max-w-none"
                  style={{
                    width: `${SIZE * 100}%`,
                    height: `${SIZE * 100}%`,
                    objectFit: "cover",
                    left: `-${(t % SIZE) * 100}%`,
                    top: `-${Math.floor(t / SIZE) * 100}%`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <p className={`text-center font-display font-bold mt-3 ${solved ? "text-emerald-600" : "text-muted-foreground"}`}>
          {solved ? "🎉 Imagem montada! Agora descubra qual história é." : "Toque em duas peças para trocá-las de lugar."}
        </p>

        {solved && (
          <div className="mt-3 grid gap-2">
            {options.map((o) => {
              const chosen = guess === o;
              const right = guess !== null && o === scene.title;
              return (
                <button
                  key={o}
                  onClick={() => !guess && choose(o)}
                  className={`w-full px-4 py-3 rounded-2xl font-display font-extrabold border-2 transition ${
                    right ? "bg-emerald-500 text-white border-emerald-600"
                      : chosen ? "bg-rose-100 text-rose-700 border-rose-300"
                      : "bg-white text-amber-900 border-amber-300 hover:border-primary"
                  }`}
                >
                  {right ? "✅ " : ""}{o}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col items-center gap-2 mt-5">
          <CoinBadge amount={COINS.assemble} size="md" label="ao descobrir" />
          <button
            onClick={() => { saveToMural({ title: `Monte e Descubra · ${scene.title}`, image: scene.image, activity: "Monte e Descubra" }); toast.success("Pregado no Meu Mural! 🖼️"); }}
            disabled={!solved}
            className="px-5 py-2.5 rounded-full bg-popover border border-border font-display font-bold text-foreground hover:border-primary disabled:opacity-40"
          >
            🖼️ Salvar no Meu Mural
          </button>
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}
