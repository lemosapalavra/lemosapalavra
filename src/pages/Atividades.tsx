import { useState, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import iconAtividades from "@/assets/icon-atividades.png";

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

// Word search data
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

// Connect-the-dots data (simple star shape)
const dotPoints = [
  { x: 150, y: 30 }, { x: 180, y: 110 }, { x: 270, y: 110 },
  { x: 200, y: 160 }, { x: 220, y: 250 }, { x: 150, y: 200 },
  { x: 80, y: 250 }, { x: 100, y: 160 }, { x: 30, y: 110 },
  { x: 120, y: 110 },
];

// Coloring shapes
const coloringShapes = [
  { type: "cross", label: "Cruz", paths: "M120,40 L180,40 L180,100 L240,100 L240,160 L180,160 L180,280 L120,280 L120,160 L60,160 L60,100 L120,100 Z" },
  { type: "heart", label: "Coração", paths: "M150,80 C150,40 100,20 80,60 C60,100 150,180 150,180 C150,180 240,100 220,60 C200,20 150,40 150,80 Z" },
  { type: "fish", label: "Peixe", paths: "M60,150 Q150,80 240,150 Q150,220 60,150 Z M220,140 A8,8 0 1,1 220,156 A8,8 0 1,1 220,140 Z" },
  { type: "dove", label: "Pomba", paths: "M100,180 Q80,120 120,100 Q140,80 160,100 Q200,80 220,120 Q240,160 200,180 Q180,200 150,190 Q120,200 100,180 Z" },
];

const colorPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FF8C42", "#98D8C8", "#F7DC6F", "#BB8FCE"];

// Puzzle data
const puzzlePieces = [
  "🌅", "⛪", "🌈", "🐑",
  "🕊️", "✝️", "🙏", "📖",
  "🎵", "❤️", "⭐", "🌟",
  "👼", "🐟", "🌿", "🔔",
];

export default function Atividades() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [memoryBoard, setMemoryBoard] = useState<string[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);

  // Word search state
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  // Coloring state
  const [coloringIdx, setColoringIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]);
  const [shapeFills, setShapeFills] = useState<Record<string, string>>({});

  // Connect-the-dots state
  const [connectedDots, setConnectedDots] = useState<number[]>([]);

  // Puzzle state
  const [puzzleBoard, setPuzzleBoard] = useState<string[]>([]);
  const [puzzleSelected, setPuzzleSelected] = useState<number | null>(null);
  const [puzzleMoves, setPuzzleMoves] = useState(0);

  const activities = [
    { title: "Quiz Bíblico", emoji: "❓", desc: "Teste seus conhecimentos", id: "quiz" },
    { title: "Jogo da Memória", emoji: "🃏", desc: "Exercite sua memória", id: "memory" },
    { title: "Colorir", emoji: "🎨", desc: "Pinte desenhos bíblicos", id: "coloring" },
    { title: "Caça-Palavras", emoji: "🔍", desc: "Encontre palavras bíblicas", id: "wordsearch" },
    { title: "Quebra-Cabeça", emoji: "🧩", desc: "Monte a cena bíblica", id: "puzzle" },
    { title: "Ligar os Pontos", emoji: "✏️", desc: "Descubra a estrela", id: "dots" },
  ];

  const awardCoins = (amount: number) => {
    const user = JSON.parse(localStorage.getItem("lemos_user") || "{}");
    user.coins = (user.coins || 0) + amount;
    localStorage.setItem("lemos_user", JSON.stringify(user));
  };

  const startQuiz = () => { setActiveGame("quiz"); setQuizIndex(0); setQuizScore(0); setQuizDone(false); };
  const answerQuiz = (idx: number) => {
    if (idx === quizQuestions[quizIndex].correct) setQuizScore(s => s + 1);
    if (quizIndex + 1 >= quizQuestions.length) { setQuizDone(true); awardCoins(quizScore + 1); }
    else setQuizIndex(i => i + 1);
  };

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
        setMemoryMatched(m => [...m, ...newFlipped]); setMemoryFlipped([]);
        if (memoryMatched.length + 2 === memoryBoard.length) { awardCoins(3); setTimeout(() => alert("Parabéns! +3 🪙"), 300); }
      } else { setTimeout(() => setMemoryFlipped([]), 800); }
    }
  };

  // Word search
  const toggleCell = (r: number, c: number) => {
    const key = `${r},${c}`;
    setSelectedCells(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };
  const checkWord = useCallback(() => {
    const letters = selectedCells.map(k => { const [r, c] = k.split(",").map(Number); return wordSearchGrid[r][c]; }).join("");
    const reversed = letters.split("").reverse().join("");
    const found = wordSearchWords.find(w => w === letters || w === reversed);
    if (found && !foundWords.has(found)) {
      setFoundWords(prev => new Set([...prev, found]));
      if (foundWords.size + 1 === wordSearchWords.length) { awardCoins(5); alert("Parabéns! Todas as palavras encontradas! +5 🪙"); }
    }
    setSelectedCells([]);
  }, [selectedCells, foundWords]);

  // Coloring
  const fillShape = (shapeKey: string) => {
    setShapeFills(prev => ({ ...prev, [shapeKey]: selectedColor }));
  };

  // Connect the dots
  const connectDot = (idx: number) => {
    if (connectedDots.length === 0 && idx === 0) { setConnectedDots([0]); return; }
    if (connectedDots.length > 0 && idx === connectedDots.length) {
      setConnectedDots(prev => [...prev, idx]);
      if (idx === dotPoints.length - 1) { awardCoins(3); alert("Parabéns! Você completou a estrela! +3 🪙"); }
    }
  };

  // Puzzle
  const startPuzzle = () => {
    setPuzzleBoard([...puzzlePieces].sort(() => Math.random() - 0.5));
    setPuzzleSelected(null); setPuzzleMoves(0); setActiveGame("puzzle");
  };
  const swapPuzzle = (idx: number) => {
    if (puzzleSelected === null) { setPuzzleSelected(idx); return; }
    const newBoard = [...puzzleBoard];
    [newBoard[puzzleSelected], newBoard[idx]] = [newBoard[idx], newBoard[puzzleSelected]];
    setPuzzleBoard(newBoard); setPuzzleSelected(null); setPuzzleMoves(m => m + 1);
    if (newBoard.every((p, i) => p === puzzlePieces[i])) { awardCoins(5); alert("Parabéns! Quebra-cabeça completo! +5 🪙"); }
  };

  const bgStyle = { background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" };
  const backBtn = <button onClick={() => setActiveGame(null)} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>;

  // === QUIZ ===
  if (activeGame === "quiz") {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Quiz Bíblico" subtitle={`Pergunta ${quizIndex + 1}/${quizQuestions.length}`} icon={iconAtividades} />
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
                {quizQuestions[quizIndex].options.map((opt, i) => (
                  <button key={i} onClick={() => answerQuiz(i)} className="w-full text-left px-4 py-3 rounded-xl border-2 border-border bg-background hover:border-primary hover:bg-primary/10 transition-all font-body text-foreground">{opt}</button>
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-3 text-center">Pontuação: {quizScore} 🪙</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === MEMORY ===
  if (activeGame === "memory") {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Jogo da Memória" subtitle="Encontre os pares!" icon={iconAtividades} />
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
      </div>
    );
  }

  // === COLORING ===
  if (activeGame === "coloring") {
    const shape = coloringShapes[coloringIdx];
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Colorir" subtitle={shape.label} icon={iconAtividades} />
          {backBtn}
          <div className="flex gap-1 mb-4 flex-wrap justify-center">
            {colorPalette.map((c, i) => (
              <button key={i} onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-foreground scale-125" : "border-border"}`} style={{ background: c }} />
            ))}
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-border flex justify-center">
            <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
              {shape.paths.split(" Z ").map((p, i) => (
                <path key={i} d={p + (p.endsWith("Z") ? "" : " Z")} fill={shapeFills[`${coloringIdx}-${i}`] || "#f0f0f0"} stroke="#333" strokeWidth="2" className="cursor-pointer hover:opacity-80" onClick={() => fillShape(`${coloringIdx}-${i}`)} />
              ))}
            </svg>
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            {coloringShapes.map((s, i) => (
              <button key={i} onClick={() => setColoringIdx(i)} className={`px-3 py-1.5 rounded-full font-display text-xs font-bold ${coloringIdx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground"}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // === WORD SEARCH ===
  if (activeGame === "wordsearch") {
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Caça-Palavras" subtitle={`${foundWords.size}/${wordSearchWords.length} encontradas`} icon={iconAtividades} />
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
            <button onClick={checkWord} className="btn-cartoon px-4 py-2 text-sm">✅ Verificar Palavra</button>
            <button onClick={() => setSelectedCells([])} className="btn-cartoon px-4 py-2 text-sm bg-muted text-foreground">🗑️ Limpar</button>
          </div>
        </div>
      </div>
    );
  }

  // === PUZZLE ===
  if (activeGame === "puzzle") {
    const isComplete = puzzleBoard.every((p, i) => p === puzzlePieces[i]);
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Quebra-Cabeça" subtitle={`Movimentos: ${puzzleMoves}`} icon={iconAtividades} />
          {backBtn}
          {isComplete && (
            <div className="bg-primary/10 rounded-2xl p-4 mb-4 text-center border border-primary">
              <span className="text-4xl">🎉</span>
              <p className="font-display font-bold text-foreground">Parabéns! Quebra-cabeça completo!</p>
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">
            {puzzleBoard.map((piece, i) => {
              const isCorrect = piece === puzzlePieces[i];
              return (
                <button key={i} onClick={() => swapPuzzle(i)} className={`aspect-square rounded-xl text-3xl flex items-center justify-center border-2 transition-all ${puzzleSelected === i ? "border-primary bg-primary/20 scale-110" : isCorrect ? "border-green-400 bg-green-50" : "border-border bg-popover hover:border-primary/50"}`}>
                  {piece}
                </button>
              );
            })}
          </div>
          <p className="font-body text-xs text-muted-foreground mt-3 text-center">Toque em duas peças para trocá-las de lugar</p>
        </div>
      </div>
    );
  }

  // === CONNECT THE DOTS ===
  if (activeGame === "dots") {
    const isComplete = connectedDots.length === dotPoints.length;
    return (
      <div className="min-h-screen py-6 px-4" style={bgStyle}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Ligar os Pontos" subtitle="Toque nos pontos em ordem" icon={iconAtividades} />
          {backBtn}
          {isComplete && (
            <div className="bg-primary/10 rounded-2xl p-4 mb-4 text-center border border-primary">
              <span className="text-4xl">⭐</span>
              <p className="font-display font-bold text-foreground">Parabéns! Você formou a Estrela de Belém!</p>
            </div>
          )}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-border flex justify-center">
            <svg viewBox="0 0 300 280" className="w-full max-w-[300px]">
              {/* Lines */}
              {connectedDots.map((dotIdx, i) => {
                if (i === 0) return null;
                const prev = dotPoints[connectedDots[i - 1]];
                const curr = dotPoints[dotIdx];
                return <line key={i} x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y} stroke="#4ECDC4" strokeWidth="3" />;
              })}
              {isComplete && connectedDots.length > 1 && (
                <line x1={dotPoints[connectedDots[connectedDots.length - 1]].x} y1={dotPoints[connectedDots[connectedDots.length - 1]].y} x2={dotPoints[0].x} y2={dotPoints[0].y} stroke="#4ECDC4" strokeWidth="3" />
              )}
              {/* Dots */}
              {dotPoints.map((p, i) => {
                const isConnected = connectedDots.includes(i);
                const isNext = i === connectedDots.length;
                return (
                  <g key={i} onClick={() => connectDot(i)} className="cursor-pointer">
                    <circle cx={p.x} cy={p.y} r={isNext ? 14 : 10} fill={isConnected ? "#4ECDC4" : isNext ? "#FFD700" : "#ddd"} stroke="#333" strokeWidth="2" />
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill={isConnected ? "white" : "#333"}>{i + 1}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <button onClick={() => { setConnectedDots([]); setActiveGame("dots"); }} className="btn-cartoon px-4 py-2 text-sm mt-4 block mx-auto">🔄 Recomeçar</button>
        </div>
      </div>
    );
  }

  // === MAIN MENU ===
  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Atividades" subtitle="Aprenda brincando!" icon={iconAtividades} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activities.map((a, i) => (
            <div
              key={i}
              onClick={() => {
                if (a.id === "quiz") startQuiz();
                else if (a.id === "memory") startMemory();
                else if (a.id === "coloring") { setColoringIdx(0); setActiveGame("coloring"); }
                else if (a.id === "wordsearch") { setFoundWords(new Set()); setSelectedCells([]); setActiveGame("wordsearch"); }
                else if (a.id === "puzzle") startPuzzle();
                else if (a.id === "dots") { setConnectedDots([]); setActiveGame("dots"); }
              }}
              className="bg-popover rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center"
            >
              <span className="text-4xl block mb-2">{a.emoji}</span>
              <h3 className="font-display text-lg font-bold text-foreground">{a.title}</h3>
              <p className="font-body text-sm text-muted-foreground mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <FeedbackFooter />
    </div>
  );
}
