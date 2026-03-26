import { useNavigate } from "react-router-dom";
import iconLouvores from "@/assets/icon-louvores.png";

const songs = [
  "Deus é Bom", "Alegria no Senhor", "Louvai ao Senhor", "Cantarei ao Rei",
  "Hosana nas Alturas", "Santo Santo Santo", "Grandioso és Tu",
  "Quão Grande és Tu", "Eu me Rendo", "Rude Cruz",
];

export default function Louvores() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="btn-cartoon px-4 py-2 text-sm mb-6">← Voltar</button>
        <div className="flex items-center gap-4 mb-8">
          <img src={iconLouvores} alt="Louvores" width={80} height={80} className="rounded-full shadow-lg" />
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Louvores</h1>
            <p className="text-muted-foreground font-body">Adoração a Deus</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {songs.map((song, i) => (
            <div key={i} className="bg-popover rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border flex items-center gap-3">
              <span className="text-2xl">🎵</span>
              <span className="font-body text-foreground font-semibold">{song}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
