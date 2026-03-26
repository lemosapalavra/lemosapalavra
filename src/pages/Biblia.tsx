import { useNavigate } from "react-router-dom";
import iconBiblia from "@/assets/icon-biblia.png";

const books = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
  "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel",
  "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras",
  "Neemias", "Ester", "Jó", "Salmos", "Provérbios",
  "Eclesiastes", "Cânticos", "Isaías", "Jeremias", "Lamentações",
  "Ezequiel", "Daniel", "Oséias", "Joel", "Amós",
  "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque",
  "Sofonias", "Ageu", "Zacarias", "Malaquias",
  "Mateus", "Marcos", "Lucas", "João", "Atos",
  "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios",
  "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
  "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus",
  "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João",
  "3 João", "Judas", "Apocalipse",
];

export default function Biblia() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="btn-cartoon px-4 py-2 text-sm mb-6">← Voltar</button>
        <div className="flex items-center gap-4 mb-8">
          <img src={iconBiblia} alt="Bíblia" width={80} height={80} className="rounded-full shadow-lg" />
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Bíblia</h1>
            <p className="text-muted-foreground font-body">66 livros para explorar</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {books.map((book, i) => (
            <div key={i} className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border">
              <span className="font-body text-sm text-foreground font-semibold">{book}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
