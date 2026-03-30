import { useState } from "react";
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

export default function Atividades() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [memoryBoard, setMemoryBoard] = useState<string[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);

  const activities = [
    { title: "Quiz Bíblico", emoji: "❓", desc: "Teste seus conhecimentos", id: "quiz" },
    { title: "Jogo da Memória", emoji: "🃏", desc: "Exercite sua memória", id: "memory" },
    { title: "Colorir", emoji: "🎨", desc: "Desenhos bíblicos (em breve)", id: "soon" },
    { title: "Caça-Palavras", emoji: "🔍", desc: "Encontre palavras (em breve)", id: "soon" },
    { title: "Quebra-Cabeça", emoji: "🧩", desc: "Monte cenas (em breve)", id: "soon" },
    { title: "Ligar os Pontos", emoji: "✏️", desc: "Descubra personagens (em breve)", id: "soon" },
  ];

  const startQuiz = () => {
    setActiveGame("quiz");
    setQuizIndex(0);
    setQuizScore(0);
    setQuizDone(false);
  };

  const answerQuiz = (idx: number) => {
    if (idx === quizQuestions[quizIndex].correct) {
      setQuizScore(s => s + 1);
    }
    if (quizIndex + 1 >= quizQuestions.length) {
      setQuizDone(true);
      // Award coins
      const user = JSON.parse(localStorage.getItem("lemos_user") || "{}");
      user.coins = (user.coins || 0) + quizScore + 1;
      localStorage.setItem("lemos_user", JSON.stringify(user));
    } else {
      setQuizIndex(i => i + 1);
    }
  };

  const startMemory = () => {
    const shuffled = [...memoryCards, ...memoryCards].sort(() => Math.random() - 0.5);
    setMemoryBoard(shuffled);
    setMemoryFlipped([]);
    setMemoryMatched([]);
    setActiveGame("memory");
  };

  const flipCard = (idx: number) => {
    if (memoryFlipped.length === 2 || memoryFlipped.includes(idx) || memoryMatched.includes(idx)) return;
    const newFlipped = [...memoryFlipped, idx];
    setMemoryFlipped(newFlipped);
    if (newFlipped.length === 2) {
      if (memoryBoard[newFlipped[0]] === memoryBoard[newFlipped[1]]) {
        setMemoryMatched(m => [...m, ...newFlipped]);
        setMemoryFlipped([]);
        if (memoryMatched.length + 2 === memoryBoard.length) {
          const user = JSON.parse(localStorage.getItem("lemos_user") || "{}");
          user.coins = (user.coins || 0) + 3;
          localStorage.setItem("lemos_user", JSON.stringify(user));
          setTimeout(() => alert("Parabéns! Você ganhou 3 moedinhas! 🪙"), 300);
        }
      } else {
        setTimeout(() => setMemoryFlipped([]), 800);
      }
    }
  };

  if (activeGame === "quiz") {
    return (
      <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
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
                  <button
                    key={i}
                    onClick={() => answerQuiz(i)}
                    className="w-full text-left px-4 py-3 rounded-xl border-2 border-border bg-background hover:border-primary hover:bg-primary/10 transition-all font-body text-foreground"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-3 text-center">Pontuação: {quizScore} 🪙</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeGame === "memory") {
    return (
      <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
        <div className="max-w-lg mx-auto">
          <PageHeader title="Jogo da Memória" subtitle="Encontre os pares!" icon={iconAtividades} />
          <button onClick={() => setActiveGame(null)} className="mb-4 text-primary font-display text-sm font-bold hover:underline">← Voltar</button>
          <div className="grid grid-cols-4 gap-3">
            {memoryBoard.map((card, i) => {
              const isVisible = memoryFlipped.includes(i) || memoryMatched.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => flipCard(i)}
                  className={`aspect-square rounded-xl text-3xl flex items-center justify-center border-2 transition-all ${
                    isVisible
                      ? "bg-primary/10 border-primary"
                      : "bg-popover border-border hover:border-primary/50"
                  }`}
                >
                  {isVisible ? card : "❓"}
                </button>
              );
            })}
          </div>
          <p className="font-body text-xs text-muted-foreground mt-3 text-center">Pares encontrados: {memoryMatched.length / 2}/{memoryCards.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Atividades" subtitle="Aprenda brincando!" icon={iconAtividades} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activities.map((a, i) => (
            <div
              key={i}
              onClick={() => {
                if (a.id === "quiz") startQuiz();
                else if (a.id === "memory") startMemory();
                else alert("Em breve! 🚀");
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
