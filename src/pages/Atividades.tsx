import { useState, useCallback, useRef, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import CelebrationAnimation from "@/components/CelebrationAnimation";
import iconAtividades from "@/assets/icon-atividades.png";
import iconQuiz from "@/assets/icon-quiz.png";
import iconMemoria from "@/assets/icon-memoria.png";
import iconCacaPalavras from "@/assets/icon-cacapalavras.png";
import iconQuebraCabeca from "@/assets/icon-quebracabeca.png";
import iconLigarPontos from "@/assets/icon-ligarpontos.png";

const quizQuestions = [
  { q: "Quem construiu a arca?", options: ["Moisés", "Noé", "Abraão", "Davi"], correct: 1 },
  { q: "Quantos discípulos Jesus teve?", options: ["10", "11", "12", "13"], correct: 2 },
  { q: "Quem matou Golias?", options: ["Saul", "Josué", "Davi", "Sansão"], correct: 2 },
  { q: "Qual o primeiro livro da Bíblia?", options: ["Êxodo", "Gênesis", "Salmos", "Mateus"], correct: 1 },
  { q: "Quem foi jogado na cova dos leões?", options: ["Jonas", "Daniel", "Paulo", "Pedro"], correct: 1 },
  { q: "Onde Jesus nasceu?", options: ["Nazaré", "Jerusalém", "Belém", "Cafarnaum"], correct: 2 },
  { q: "Quem batizou Jesus?", options: ["Pedro", "Paulo", "João Batista", "Tiago"], correct: 2 },
  { q: "Quantos livros tem a Bíblia?", options: ["39", "27", "66", "73"], correct: 2 },
];

const memoryCards = ["🐑", "🕊️", "🐟", "🦁", "⭐", "🌈", "🔥", "💧"];

const wordSearchWords = ["JESUS", "DEUS", "AMOR", "BIBLIA", "ORAR", "SALMO", "CRUZ", "ANJO"];
const wordSearchGrid = [
  ["J","E","S","U","S","A","M","O","R"],
  ["D","B","I","B","L","I","A","N","K"],
  ["E","O","R","A","R","X","S","J","P"],
  ["U","Q","W","C","R","U","Z","O","L"],
  ["S","A","L","M","O","T","Y","H","G"],
  ["F","V","A","N","J","O","I","U","E"],
  ["P","R","E","G","A","R","D","C","F"],
  ["H","I","G","R","E","J","A","V","B"],
  ["M","O","I","S","E","S","W","X","Z"],
];

const dotPuzzles = [
  {
    title: "Estrela de Belém", emoji: "⭐",
    points: [
      { x: 150, y: 30 }, { x: 180, y: 110 }, { x: 270, y: 110 },
      { x: 200, y: 160 }, { x: 220, y: 250 }, { x: 150, y: 200 },
      { x: 80, y: 250 }, { x: 100, y: 160 }, { x: 30, y: 110 },
      { x: 120, y: 110 },
    ],
  },
  {
    title: "Cruz", emoji: "✝️",
    points: [
      { x: 150, y: 20 }, { x: 150, y: 80 }, { x: 90, y: 120 },
      { x: 150, y: 120 }, { x: 210, y: 120 }, { x: 150, y: 160 },
      { x: 150, y: 220 }, { x: 150, y: 260 },
    ],
  },
  {
    title: "Peixe (Ichthys)", emoji: "🐟",
    points: [
      { x: 40, y: 140 }, { x: 80, y: 100 }, { x: 140, y: 80 },
      { x: 200, y: 90 }, { x: 250, y: 120 }, { x: 280, y: 150 },
      { x: 250, y: 180 }, { x: 200, y: 200 }, { x: 140, y: 200 },
      { x: 80, y: 180 },
    ],
  },
  {
    title: "Pomba da Paz", emoji: "🕊️",
    points: [
      { x: 150, y: 60 }, { x: 180, y: 50 }, { x: 210, y: 60 },
      { x: 240, y: 40 }, { x: 250, y: 70 }, { x: 220, y: 90 },
      { x: 260, y: 110 }, { x: 220, y: 120 }, { x: 200, y: 150 },
      { x: 170, y: 170 }, { x: 140, y: 150 }, { x: 120, y: 110 },
      { x: 130, y: 80 },
    ],
  },
  {
    title: "Coração", emoji: "❤️",
    points: [
      { x: 150, y: 250 }, { x: 100, y: 200 }, { x: 60, y: 150 },
      { x: 50, y: 100 }, { x: 70, y: 60 }, { x: 110, y: 50 },
      { x: 150, y: 70 }, { x: 190, y: 50 }, { x: 230, y: 60 },
      { x: 250, y: 100 }, { x: 240, y: 150 }, { x: 200, y: 200 },
    ],
  },
  {
    title: "Arca de Noé", emoji: "🚢",
    points: [
      { x: 60, y: 180 }, { x: 100, y: 200 }, { x: 200, y: 200 },
      { x: 260, y: 180 }, { x: 240, y: 150 }, { x: 200, y: 130 },
      { x: 160, y: 100 }, { x: 160, y: 130 }, { x: 120, y: 130 },
      { x: 80, y: 150 },
    ],
  },
  {
    title: "Cálice", emoji: "🏆",
    points: [
      { x: 100, y: 60 }, { x: 120, y: 100 }, { x: 130, y: 140 },
      { x: 140, y: 170 }, { x: 150, y: 200 }, { x: 150, y: 230 },
      { x: 120, y: 250 }, { x: 180, y: 250 }, { x: 150, y: 230 },
      { x: 160, y: 170 }, { x: 170, y: 140 }, { x: 180, y: 100 },
      { x: 200, y: 60 },
    ],
  },
];

// Coloring: SVG biblical scenes with multiple regions
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
      { id: "dove", d: "M300,70 Q310,60 320,70 Q310,80 300,70 Z", label: "Pomba" },
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
      { id: "body", d: "M180,110 L220,110 L230,200 L170,200 Z", label: "Corpo" },
      { id: "head", d: "M190,80 A15,18 0 1,1 210,80 A15,18 0 1,1 190,80 Z", label: "Cabeça" },
      { id: "staff", d: "M240,90 L245,200", label: "Cajado" },
      { id: "sheep1", d: "M100,195 Q110,180 120,195 Q110,205 100,195 Z", label: "Ovelha" },
      { id: "sheep2", d: "M140,200 Q150,185 160,200 Q150,210 140,200 Z", label: "Ovelha" },
      { id: "sheep3", d: "M270,195 Q280,180 290,195 Q280,205 270,195 Z", label: "Ovelha" },
      { id: "tree", d: "M50,120 Q70,80 90,120 Q70,100 50,120 Z", label: "Árvore" },
      { id: "trunk", d: "M65,120 L75,160 L65,160 L65,120 Z", label: "Tronco" },
    ],
  },
  {
    title: "A Estrela de Belém",
    regions: [
      { id: "night", d: "M0,0 L400,0 L400,300 L0,300 Z", label: "Céu noturno" },
      { id: "star", d: "M200,20 L210,60 L250,60 L218,85 L228,120 L200,98 L172,120 L182,85 L150,60 L190,60 Z", label: "Estrela" },
      { id: "stable", d: "M120,160 L280,160 L300,280 L100,280 Z", label: "Estábulo" },
      { id: "roof2", d: "M100,160 L200,100 L300,160 Z", label: "Telhado" },
      { id: "manger", d: "M170,220 L230,220 L240,260 L160,260 Z", label: "Manjedoura" },
      { id: "ground", d: "M0,280 L400,280 L400,300 L0,300 Z", label: "Chão" },
    ],
  },
  {
    title: "Jonas e a Baleia",
    regions: [
      { id: "sky", d: "M0,0 L400,0 L400,120 L0,120 Z", label: "Céu" },
      { id: "sea", d: "M0,120 Q100,100 200,120 Q300,140 400,120 L400,300 L0,300 Z", label: "Mar" },
      { id: "whale", d: "M60,160 Q200,100 340,180 Q300,240 200,250 Q100,240 60,160 Z", label: "Baleia" },
      { id: "eye", d: "M120,170 A8,8 0 1,1 120,171 Z", label: "Olho" },
      { id: "mouth", d: "M280,190 Q300,210 280,230 Q260,210 280,190 Z", label: "Boca" },
      { id: "jonas", d: "M270,195 L290,195 L290,225 L270,225 Z", label: "Jonas" },
      { id: "cloud1", d: "M50,30 Q80,10 110,30 Q80,40 50,30 Z", label: "Nuvem" },
      { id: "cloud2", d: "M250,20 Q280,5 310,20 Q280,30 250,20 Z", label: "Nuvem" },
      { id: "wave1", d: "M0,130 Q50,120 100,130 Q150,140 200,130", label: "Onda" },
    ],
  },
];

const colorPalette = [
  "#FF6B6B", "#FF8C42", "#FFEAA7", "#96CEB4", "#4ECDC4",
  "#45B7D1", "#DDA0DD", "#BB8FCE", "#F7DC6F", "#98D8C8",
  "#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#F39C12",
  "#1ABC9C", "#E67E22", "#ffffff", "#8B4513", "#333333",
];

// Jigsaw puzzle images (generated via AI)
const jigsawPuzzles = [
  { title: "A Criação", emoji: "🌍", gridSize: 3 },
  { title: "Arca de Noé", emoji: "🚢", gridSize: 3 },
  { title: "Davi e Golias", emoji: "⚔️", gridSize: 4 },
  { title: "Daniel na Cova dos Leões", emoji: "🦁", gridSize: 4 },
];

export default function Atividades() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  // Celebration
  const [celebration, setCelebration] = useState<{ show: boolean; message: string; coins: number; emoji: string }>({ show: false, message: "", coins: 0, emoji: "🏆" });

  // Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  // Memory
  const [memoryBoard, setMemoryBoard] = useState<string[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);

  // Word search
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  // Coloring
  const [coloringIdx, setColoringIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]);
  const [shapeFills, setShapeFills] = useState<Record<string, string>>({});

  // Connect-the-dots
  const [connectedDots, setConnectedDots] = useState<number[]>([]);
  const [dotsIdx, setDotsIdx] = useState<number | null>(null);

  // Jigsaw puzzle
  const [jigsawIdx, setJigsawIdx] = useState(0);
  const [jigsawTiles, setJigsawTiles] = useState<number[]>([]);
  const [jigsawSelected, setJigsawSelected] = useState<number | null>(null);
  const [jigsawMoves, setJigsawMoves] = useState(0);
  const [jigsawImageUrl, setJigsawImageUrl] = useState<string>("");
  const jigsawCanvasRef = useRef<HTMLCanvasElement>(null);

  const activities = [
    { title: "Quiz Bíblico", icon: iconQuiz, desc: "Teste seus conhecimentos", id: "quiz" },
    { title: "Jogo da Memória", icon: iconMemoria, desc: "Exercite sua memória", id: "memory" },
    { title: "Colorir", icon: iconQuiz, desc: "Pinte cenas bíblicas", id: "coloring" },
    { title: "Caça-Palavras", icon: iconCacaPalavras, desc: "Encontre palavras bíblicas", id: "wordsearch" },
    { title: "Quebra-Cabeça", icon: iconQuebraCabeca, desc: "Monte a cena bíblica", id: "puzzle" },
    { title: "Ligar os Pontos", icon: iconLigarPontos, desc: "Descubra a estrela", id: "dots" },
  ];

  const awardCoins = (amount: number) => {
    const user = JSON.parse(localStorage.getItem("lemos_user") || "{}");
    user.coins = (user.coins || 0) + amount;
    localStorage.setItem("lemos_user", JSON.stringify(user));
  };

  const showCelebration = (message: string, coins: number, emoji: string = "🏆") => {
    awardCoins(coins);
    setCelebration({ show: true, message, coins, emoji });
  };

  const closeCelebration = () => {
    setCelebration({ show: false, message: "", coins: 0, emoji: "🏆" });
  };

  // === QUIZ ===
  const startQuiz = () => { setActiveGame("quiz"); setQuizIndex(0); setQuizScore(0); setQuizDone(false); setQuizAnswered(null); };
  const answerQuiz = (idx: number) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(idx);
    const isCorrect = idx === quizQuestions[quizIndex].correct;
    if (isCorrect) setQuizScore(s => s + 1);

    setTimeout(() => {
      setQuizAnswered(null);
      if (quizIndex + 1 >= quizQuestions.length) {
        setQuizDone(true);
        const finalScore = isCorrect ? quizScore + 1 : quizScore;
        showCelebration(`Você acertou ${finalScore} de ${quizQuestions.length}!`, finalScore, "🧠");
      } else {
        setQuizIndex(i => i + 1);
      }
    }, 1200);
  };

  // === MEMORY ===
  const startMemory = () => {
    setMemoryBoard([...memoryCards, ...memoryCards].sort(() => Math.random() - 0.5));
    setMemoryFlipped([]); setMemoryMatched([]); setActiveGame("memory");
  };
  const flipCard = (idx: number) => {
    if (memoryFlipped.length === 2 || memoryFlipped.includes(idx) || memoryMatched.includes(idx)) return;
    const newFlipped = [...memoryFlipped, idx];
    setMemoryFlipped(newFlipped);
    if (newFlipped.length === 2) {
      if (memoryBoard[newFlipped[0]] === memoryBoard[newFlipped[1]]) {
        const newMatched = [...memoryMatched, ...newFlipped];
        setMemoryMatched(newMatched); setMemoryFlipped([]);
        if (newMatched.length === memoryBoard.length) {
          showCelebration("Todos os pares encontrados!", 3, "🃏");
        }
      } else { setTimeout(() => setMemoryFlipped([]), 800); }
    }
  };

  // === WORD SEARCH ===
  const toggleCell = (r: number, c: number) => {
    const key = `${r},${c}`;
    setSelectedCells(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };
  const checkWord = useCallback(() => {
    const letters = selectedCells.map(k => { const [r, c] = k.split(",").map(Number); return wordSearchGrid[r][c]; }).join("");
    const reversed = letters.split("").reverse().join("");
    const found = wordSearchWords.find(w => w === letters || w === reversed);
    if (found && !foundWords.has(found)) {
      const newFound = new Set([...foundWords, found]);
      setFoundWords(newFound);
      if (newFound.size === wordSearchWords.length) {
        showCelebration("Todas as palavras encontradas!", 5, "🔍");
      }
    }
    setSelectedCells([]);
  }, [selectedCells, foundWords]);

  // === COLORING ===
  const fillShape = (shapeKey: string) => {
    setShapeFills(prev => ({ ...prev, [shapeKey]: selectedColor }));
  };

  // === CONNECT THE DOTS ===
  const connectDot = (idx: number) => {
    if (dotsIdx === null) return;
    const points = dotPuzzles[dotsIdx].points;
    if (connectedDots.length === 0 && idx === 0) { setConnectedDots([0]); return; }
    if (connectedDots.length > 0 && idx === connectedDots.length) {
      const newDots = [...connectedDots, idx];
      setConnectedDots(newDots);
      if (idx === points.length - 1) {
        showCelebration(`Você completou "${dotPuzzles[dotsIdx].title}"!`, 3, dotPuzzles[dotsIdx].emoji);
      }
    }
  };

  // === JIGSAW PUZZLE ===
  const startJigsaw = (idx: number) => {
    const puzzle = jigsawPuzzles[idx];
    const total = puzzle.gridSize * puzzle.gridSize;
    const ordered = Array.from({ length: total }, (_, i) => i);
    // Shuffle
    const shuffled = [...ordered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setJigsawIdx(idx);
    setJigsawTiles(shuffled);
    setJigsawSelected(null);
    setJigsawMoves(0);
    setActiveGame("puzzle");
    // Generate a gradient placeholder image
    generateJigsawImage(puzzle.title);
  };

  const generateJigsawImage = (title: string) => {
    // Create a colorful biblical-themed gradient canvas
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;
    
    // Beautiful gradient background
    const grad = ctx.createLinearGradient(0, 0, 400, 400);
    if (title.includes("Criação")) {
      grad.addColorStop(0, "#1a237e"); grad.addColorStop(0.3, "#4fc3f7"); grad.addColorStop(0.6, "#81c784"); grad.addColorStop(1, "#a5d6a7");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = "#FFD700"; ctx.beginPath(); ctx.arc(320, 60, 40, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#4caf50";
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(60 + i * 80, 340, 30, Math.PI, 0); ctx.fill(); }
      ctx.fillStyle = "#fff"; ctx.font = "bold 28px Arial"; ctx.textAlign = "center"; ctx.fillText("🌍 A Criação", 200, 200);
    } else if (title.includes("Noé")) {
      grad.addColorStop(0, "#64b5f6"); grad.addColorStop(0.5, "#90caf9"); grad.addColorStop(1, "#1565c0");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 400, 400);
      // Rainbow
      const colors = ["#f44336", "#ff9800", "#ffeb3b", "#4caf50", "#2196f3", "#9c27b0"];
      colors.forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(200, 100, 60 + i * 12, Math.PI, 0); ctx.stroke(); });
      // Boat
      ctx.fillStyle = "#795548"; ctx.beginPath(); ctx.moveTo(100, 280); ctx.lineTo(300, 280); ctx.lineTo(260, 340); ctx.lineTo(140, 340); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 24px Arial"; ctx.textAlign = "center"; ctx.fillText("🚢 Arca de Noé", 200, 200);
    } else if (title.includes("Davi")) {
      grad.addColorStop(0, "#fff8e1"); grad.addColorStop(1, "#ffe082");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = "#8d6e63"; ctx.fillRect(250, 120, 60, 180);
      ctx.fillStyle = "#5d4037"; ctx.beginPath(); ctx.arc(280, 120, 30, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#4caf50"; ctx.fillRect(80, 250, 20, 60);
      ctx.fillStyle = "#fff"; ctx.font = "bold 24px Arial"; ctx.textAlign = "center"; ctx.fillText("⚔️ Davi e Golias", 200, 50);
    } else {
      grad.addColorStop(0, "#ff8a65"); grad.addColorStop(1, "#ffcc02");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = "#f57c00"; ctx.beginPath(); ctx.arc(200, 220, 80, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 22px Arial"; ctx.textAlign = "center"; ctx.fillText("🦁 Daniel e os Leões", 200, 60);
    }
    
    // Grid lines for puzzle
    const puzzle = jigsawPuzzles[title.includes("Criação") ? 0 : title.includes("Noé") ? 1 : title.includes("Davi") ? 2 : 3];
    const gs = puzzle.gridSize;
    ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2;
    for (let i = 1; i < gs; i++) {
      ctx.beginPath(); ctx.moveTo(i * 400 / gs, 0); ctx.lineTo(i * 400 / gs, 400); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * 400 / gs); ctx.lineTo(400, i * 400 / gs); ctx.stroke();
    }

    setJigsawImageUrl(canvas.toDataURL());
  };

  const swapJigsaw = (idx: number) => {
    if (jigsawSelected === null) { setJigsawSelected(idx); return; }
    if (jigsawSelected === idx) { setJigsawSelected(null); return; }
    const newTiles = [...jigsawTiles];
    [newTiles[jigsawSelected], newTiles[idx]] = [newTiles[idx], newTiles[jigsawSelected]];
    setJigsawTiles(newTiles);
    setJigsawSelected(null);
    setJigsawMoves(m => m + 1);
    if (newTiles.every((t, i) => t === i)) {
      showCelebration("Quebra-cabeça completo!", 5, "🧩");
    }
  };

  const bgStyle = { background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" };
  const backBtn = <button onClick={() => setActiveGame(null)} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>;

  // === QUIZ RENDER ===
  if (activeGame === "quiz") {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Quiz Bíblico" subtitle={`Pergunta ${quizIndex + 1}/${quizQuestions.length}`} icon={iconQuiz} />
          {quizDone ? (
            <div className="bg-popover rounded-2xl p-6 shadow-lg border border-border text-center">
              <span className="text-6xl block mb-4">🏆</span>
              <h2 className="font-display text-2xl font-bold text-foreground">Parabéns!</h2>
              <p className="font-body text-lg text-foreground mt-2">Você acertou {quizScore} de {quizQuestions.length}!</p>
              <p className="font-body text-sm text-primary mt-1">+{quizScore} moedinhas ganhas! 🪙</p>
              <button onClick={() => setActiveGame(null)} className="btn-cartoon px-6 py-3 mt-4">Voltar</button>
            </div>
          ) : (
            <div className="bg-popover rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">{quizQuestions[quizIndex].q}</h3>
              <div className="space-y-2">
                {quizQuestions[quizIndex].options.map((opt, i) => {
                  let btnClass = "w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-body text-foreground ";
                  if (quizAnswered !== null) {
                    if (i === quizQuestions[quizIndex].correct) {
                      btnClass += "border-green-500 bg-green-100 text-green-800 font-bold scale-[1.02]";
                    } else if (i === quizAnswered) {
                      btnClass += "border-red-500 bg-red-100 text-red-800";
                    } else {
                      btnClass += "border-border bg-background opacity-50";
                    }
                  } else {
                    btnClass += "border-border bg-background hover:border-primary hover:bg-primary/10";
                  }
                  return (
                    <button key={i} onClick={() => answerQuiz(i)} className={btnClass} disabled={quizAnswered !== null}>
                      {quizAnswered !== null && i === quizQuestions[quizIndex].correct && <span className="mr-2">✅</span>}
                      {quizAnswered !== null && i === quizAnswered && i !== quizQuestions[quizIndex].correct && <span className="mr-2">❌</span>}
                      {opt}
                    </button>
                  );
                })}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-3 text-center">Pontuação: {quizScore} 🪙</p>
            </div>
          )}
        </div>
        <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
      </div>
    );
  }

  // === MEMORY RENDER ===
  if (activeGame === "memory") {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Jogo da Memória" subtitle="Encontre os pares!" icon={iconMemoria} />
          {backBtn}
          <div className="grid grid-cols-4 gap-3">
            {memoryBoard.map((card, i) => {
              const isVisible = memoryFlipped.includes(i) || memoryMatched.includes(i);
              return (
                <button key={i} onClick={() => flipCard(i)} className={`aspect-square rounded-xl text-3xl flex items-center justify-center border-2 transition-all ${isVisible ? "bg-primary/10 border-primary" : "bg-popover border-border hover:border-primary/50"}`}>
                  {isVisible ? card : "❓"}
                </button>
              );
            })}
          </div>
          <p className="font-body text-xs text-muted-foreground mt-3 text-center">Pares: {memoryMatched.length / 2}/{memoryCards.length}</p>
        </div>
        <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
      </div>
    );
  }

  // === COLORING RENDER ===
  if (activeGame === "coloring") {
    const scene = coloringScenes[coloringIdx];
    const allFilled = scene.regions.every(r => shapeFills[`${coloringIdx}-${r.id}`]);
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Colorir" subtitle={scene.title} icon={iconQuiz} />
          {backBtn}
          {/* Color palette */}
          <div className="flex gap-1.5 mb-4 flex-wrap justify-center">
            {colorPalette.map((c, i) => (
              <button key={i} onClick={() => setSelectedColor(c)}
                className={`w-9 h-9 rounded-full border-3 transition-all ${selectedColor === c ? "border-foreground scale-125 shadow-lg" : "border-border"}`}
                style={{ background: c }}
              />
            ))}
          </div>
          {/* Canvas */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-border flex justify-center">
            <svg viewBox="0 0 400 300" className="w-full max-w-[400px]">
              {scene.regions.map((region) => (
                <path
                  key={region.id}
                  d={region.d}
                  fill={shapeFills[`${coloringIdx}-${region.id}`] || "#f5f5f5"}
                  stroke="#555"
                  strokeWidth="1.5"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => fillShape(`${coloringIdx}-${region.id}`)}
                >
                  <title>{region.label}</title>
                </path>
              ))}
            </svg>
          </div>
          {/* Scene selector */}
          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            {coloringScenes.map((s, i) => (
              <button key={i} onClick={() => setColoringIdx(i)} className={`px-3 py-1.5 rounded-full font-display text-xs font-bold ${coloringIdx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground"}`}>
                {s.title}
              </button>
            ))}
          </div>
          {allFilled && (
            <div className="text-center mt-4">
              <button onClick={() => showCelebration(`"${scene.title}" colorido com sucesso!`, 3, "🎨")} className="btn-cartoon px-6 py-3 text-sm">
                ✨ Finalizar Pintura
              </button>
            </div>
          )}
        </div>
        <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
      </div>
    );
  }

  // === WORD SEARCH RENDER ===
  if (activeGame === "wordsearch") {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Caça-Palavras" subtitle={`${foundWords.size}/${wordSearchWords.length} encontradas`} icon={iconCacaPalavras} />
          {backBtn}
          <div className="flex flex-wrap gap-1 mb-3 justify-center">
            {wordSearchWords.map(w => (
              <span key={w} className={`px-2 py-0.5 rounded-full text-xs font-display font-bold ${foundWords.has(w) ? "bg-primary text-primary-foreground line-through" : "bg-popover border border-border text-foreground"}`}>{w}</span>
            ))}
          </div>
          <div className="bg-popover rounded-2xl p-3 shadow-lg border border-border">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${wordSearchGrid[0].length}, 1fr)` }}>
              {wordSearchGrid.map((row, r) => row.map((cell, c) => {
                const key = `${r},${c}`;
                const isSelected = selectedCells.includes(key);
                return (
                  <button key={key} onClick={() => toggleCell(r, c)} className={`aspect-square rounded-lg text-sm font-display font-bold flex items-center justify-center transition-all ${isSelected ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-primary/10"}`}>
                    {cell}
                  </button>
                );
              }))}
            </div>
          </div>
          <div className="flex gap-2 mt-3 justify-center">
            <button onClick={checkWord} className="btn-cartoon px-4 py-2 text-sm">✅ Verificar</button>
            <button onClick={() => setSelectedCells([])} className="btn-cartoon px-4 py-2 text-sm bg-muted text-foreground">🗑️ Limpar</button>
          </div>
        </div>
        <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
      </div>
    );
  }

  // === JIGSAW PUZZLE RENDER ===
  if (activeGame === "puzzle") {
    const puzzle = jigsawPuzzles[jigsawIdx];
    const gs = puzzle.gridSize;
    const isComplete = jigsawTiles.length > 0 && jigsawTiles.every((t, i) => t === i);
    const tileSize = 400 / gs;

    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Quebra-Cabeça" subtitle={`${puzzle.title} • ${jigsawMoves} movimentos`} icon={iconQuebraCabeca} />
          {backBtn}

          {/* Puzzle selection */}
          {jigsawTiles.length === 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {jigsawPuzzles.map((p, i) => (
                <div key={i} onClick={() => startJigsaw(i)} className="bg-popover rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center">
                  <span className="text-4xl block mb-2">{p.emoji}</span>
                  <h3 className="font-display text-sm font-bold text-foreground">{p.title}</h3>
                  <p className="font-body text-xs text-muted-foreground">{p.gridSize}x{p.gridSize} peças</p>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Reference image (small) */}
              {jigsawImageUrl && (
                <div className="mb-3 flex justify-center">
                  <img src={jigsawImageUrl} alt="Referência" className="w-24 h-24 rounded-lg border-2 border-primary/30 shadow" />
                </div>
              )}

              {/* Puzzle grid */}
              <div className="bg-white rounded-2xl p-2 shadow-lg border border-border mx-auto" style={{ maxWidth: 360 }}>
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gs}, 1fr)` }}>
                  {jigsawTiles.map((tileIdx, pos) => {
                    const isCorrect = tileIdx === pos;
                    const isSelected = jigsawSelected === pos;
                    // Calculate background position for the tile
                    const tileRow = Math.floor(tileIdx / gs);
                    const tileCol = tileIdx % gs;
                    const bgSize = gs * 100;

                    return (
                      <button
                        key={pos}
                        onClick={() => swapJigsaw(pos)}
                        className={`aspect-square rounded-lg border-2 transition-all overflow-hidden ${isSelected ? "border-primary scale-110 shadow-lg z-10" : isCorrect ? "border-green-400" : "border-border hover:border-primary/50"}`}
                        style={{
                          backgroundImage: `url(${jigsawImageUrl})`,
                          backgroundSize: `${bgSize}% ${bgSize}%`,
                          backgroundPosition: `${(tileCol / (gs - 1)) * 100}% ${(tileRow / (gs - 1)) * 100}%`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-3 text-center">Toque em duas peças para trocá-las</p>
              <div className="flex gap-2 mt-3 justify-center">
                <button onClick={() => startJigsaw(jigsawIdx)} className="btn-cartoon px-4 py-2 text-sm">🔄 Embaralhar</button>
                <button onClick={() => { setJigsawTiles([]); setActiveGame("puzzle"); }} className="btn-cartoon px-4 py-2 text-sm bg-muted text-foreground">📋 Outro Puzzle</button>
              </div>
            </>
          )}
        </div>
        <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
      </div>
    );
  }

  // === CONNECT THE DOTS ===
  if (activeGame === "dots") {
    if (dotsIdx === null) {
      // Selection screen
      return (
        <div className="min-h-screen py-6 px-4" style={bgStyle}>
          <div className="max-w-lg mx-auto">
            <PageHeader title="Ligar os Pontos" subtitle="Escolha um desenho" icon={iconLigarPontos} />
            {backBtn}
            <div className="grid grid-cols-2 gap-4">
              {dotPuzzles.map((p, i) => (
                <div key={i} onClick={() => { setDotsIdx(i); setConnectedDots([]); }} className="bg-popover rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center">
                  <span className="text-4xl block mb-2">{p.emoji}</span>
                  <h3 className="font-display text-sm font-bold text-foreground">{p.title}</h3>
                  <p className="font-body text-xs text-muted-foreground">{p.points.length} pontos</p>
                </div>
              ))}
            </div>
          </div>
          <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
        </div>
      );
    }

    const currentDotPuzzle = dotPuzzles[dotsIdx];
    const dotPoints = currentDotPuzzle.points;
    const isComplete = connectedDots.length === dotPoints.length;
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Ligar os Pontos" subtitle={currentDotPuzzle.title} icon={iconLigarPontos} />
          {backBtn}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-border flex justify-center">
            <svg viewBox="0 0 300 280" className="w-full max-w-[300px]">
              {connectedDots.map((dotIdx, i) => {
                if (i === 0) return null;
                const prev = dotPoints[connectedDots[i - 1]];
                const curr = dotPoints[dotIdx];
                return <line key={i} x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y} stroke="hsl(var(--primary))" strokeWidth="3" />;
              })}
              {isComplete && connectedDots.length > 1 && (
                <line x1={dotPoints[connectedDots[connectedDots.length - 1]].x} y1={dotPoints[connectedDots[connectedDots.length - 1]].y} x2={dotPoints[0].x} y2={dotPoints[0].y} stroke="hsl(var(--primary))" strokeWidth="3" />
              )}
              {dotPoints.map((p, i) => {
                const isConnected = connectedDots.includes(i);
                const isNext = i === connectedDots.length;
                return (
                  <g key={i} onClick={() => connectDot(i)} className="cursor-pointer">
                    <circle cx={p.x} cy={p.y} r={isNext ? 14 : 10} fill={isConnected ? "hsl(var(--primary))" : isNext ? "#FFD700" : "#ddd"} stroke="#333" strokeWidth="2" />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill={isConnected ? "white" : "#333"}>{i + 1}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            <button onClick={() => setConnectedDots([])} className="btn-cartoon px-4 py-2 text-sm">🔄 Recomeçar</button>
            <button onClick={() => { setDotsIdx(null); setConnectedDots([]); }} className="btn-cartoon px-4 py-2 text-sm bg-muted text-foreground">📋 Outro Desenho</button>
          </div>
        </div>
        <CelebrationAnimation show={celebration.show} message={celebration.message} coins={celebration.coins} emoji={celebration.emoji} onClose={closeCelebration} />
      </div>
    );
  }

  // === MAIN MENU ===
  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Atividades" subtitle="Aprenda brincando!" icon={iconAtividades} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {activities.map((a, i) => (
            <div
              key={i}
              onClick={() => {
                if (a.id === "quiz") startQuiz();
                else if (a.id === "memory") startMemory();
                else if (a.id === "coloring") { setColoringIdx(0); setShapeFills({}); setActiveGame("coloring"); }
                else if (a.id === "wordsearch") { setFoundWords(new Set()); setSelectedCells([]); setActiveGame("wordsearch"); }
                else if (a.id === "puzzle") { setJigsawTiles([]); setActiveGame("puzzle"); }
                else if (a.id === "dots") { setConnectedDots([]); setActiveGame("dots"); }
              }}
              className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center"
            >
              <img src={a.icon} alt={a.title} className="w-20 h-20 mx-auto mb-2 rounded-xl" />
              <h3 className="font-display text-sm font-bold text-foreground">{a.title}</h3>
              <p className="font-body text-xs text-muted-foreground mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <FeedbackFooter />
    </div>
  );
}
