import { useNavigate } from "react-router-dom";
import iconDevocionais from "@/assets/icon-devocionais.png";

const devos = [
  { title: "Deus me Ama", verse: "João 3:16", text: "Porque Deus amou o mundo de tal maneira..." },
  { title: "Confiar em Deus", verse: "Provérbios 3:5", text: "Confia no Senhor de todo o teu coração..." },
  { title: "Ser Corajoso", verse: "Josué 1:9", text: "Seja forte e corajoso! Não se apavore..." },
  { title: "Obedecer aos Pais", verse: "Efésios 6:1", text: "Filhos, obedeçam a seus pais no Senhor..." },
  { title: "Ser Bondoso", verse: "Efésios 4:32", text: "Sejam bondosos e compassivos uns para com os outros..." },
  { title: "Não Ter Medo", verse: "Isaías 41:10", text: "Não temas, porque eu sou contigo..." },
];

export default function Devocionais() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="btn-cartoon px-4 py-2 text-sm mb-6">← Voltar</button>
        <div className="flex items-center gap-4 mb-8">
          <img src={iconDevocionais} alt="Devocionais" width={80} height={80} className="rounded-full shadow-lg" />
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Devocionais</h1>
            <p className="text-muted-foreground font-body">Momentos com Deus todos os dias</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {devos.map((d, i) => (
            <div key={i} className="bg-popover rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border">
              <h3 className="font-display text-lg font-bold text-foreground">{d.title}</h3>
              <p className="text-primary font-body text-sm font-semibold mt-1">{d.verse}</p>
              <p className="font-body text-sm text-muted-foreground mt-2">{d.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
