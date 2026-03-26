import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="btn-cartoon px-4 py-2 text-sm mb-6">← Voltar</button>
        <div className="flex items-center gap-4 mb-8">
          <img src={iconMusicas} alt="Músicas" width={80} height={80} className="rounded-full shadow-lg" />
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Músicas</h1>
            <p className="text-muted-foreground font-body">Arte, Harmonia, Melodia e Ritmo</p>
          </div>
        </div>
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
