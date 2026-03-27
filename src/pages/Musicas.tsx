import PageHeader from "@/components/PageHeader";
import iconMusicas from "@/assets/icon-musicas.png";

const categories = [
  { title: "Músicas Infantis", emoji: "🎶", desc: "Canções para as crianças aprenderem" },
  { title: "Hinos Clássicos", emoji: "🎹", desc: "Hinos tradicionais da igreja" },
  { title: "Worship Kids", emoji: "🎤", desc: "Adoração para os pequenos" },
  { title: "Canções de Ninar", emoji: "🌙", desc: "Para dormir com Deus" },
  { title: "Músicas de Natal", emoji: "🎄", desc: "Celebrando o nascimento de Jesus" },
  { title: "Canções Bíblicas", emoji: "📖", desc: "Histórias cantadas da Bíblia" },
];

export default function Musicas() {
  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Músicas" subtitle="Arte, Harmonia, Melodia e Ritmo" icon={iconMusicas} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <div key={i} className="bg-popover rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center">
              <span className="text-4xl block mb-2">{cat.emoji}</span>
              <h3 className="font-display text-lg font-bold text-foreground">{cat.title}</h3>
              <p className="font-body text-sm text-muted-foreground mt-1">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
