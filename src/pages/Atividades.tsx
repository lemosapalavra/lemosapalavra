import { useNavigate } from "react-router-dom";
import iconAtividades from "@/assets/icon-atividades.png";

const activities = [
  { title: "Colorir", emoji: "🎨", desc: "Desenhos bíblicos para pintar" },
  { title: "Quiz Bíblico", emoji: "❓", desc: "Teste seus conhecimentos" },
  { title: "Caça-Palavras", emoji: "🔍", desc: "Encontre as palavras escondidas" },
  { title: "Quebra-Cabeça", emoji: "🧩", desc: "Monte cenas da Bíblia" },
  { title: "Ligar os Pontos", emoji: "✏️", desc: "Descubra personagens bíblicos" },
  { title: "Jogo da Memória", emoji: "🃏", desc: "Exercite sua memória com a Bíblia" },
];

export default function Atividades() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="btn-cartoon px-4 py-2 text-sm mb-6">← Voltar</button>
        <div className="flex items-center gap-4 mb-8">
          <img src={iconAtividades} alt="Atividades" width={80} height={80} className="rounded-full shadow-lg" />
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Atividades</h1>
            <p className="text-muted-foreground font-body">Aprenda brincando!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activities.map((a, i) => (
            <div key={i} className="bg-popover rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center">
              <span className="text-4xl block mb-2">{a.emoji}</span>
              <h3 className="font-display text-lg font-bold text-foreground">{a.title}</h3>
              <p className="font-body text-sm text-muted-foreground mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
