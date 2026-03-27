import PageHeader from "@/components/PageHeader";
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
  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Atividades" subtitle="Aprenda brincando!" icon={iconAtividades} />
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
