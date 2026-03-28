import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import iconBiblia from "@/assets/icon-biblia.png";

const antigoTestamento = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
  "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel",
  "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras",
  "Neemias", "Ester", "Jó", "Salmos", "Provérbios",
  "Eclesiastes", "Cânticos", "Isaías", "Jeremias", "Lamentações",
  "Ezequiel", "Daniel", "Oséias", "Joel", "Amós",
  "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque",
  "Sofonias", "Ageu", "Zacarias", "Malaquias",
];

const novoTestamento = [
  "Mateus", "Marcos", "Lucas", "João", "Atos",
  "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios",
  "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
  "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus",
  "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João",
  "3 João", "Judas", "Apocalipse",
];

const dicionario = [
  { term: "Graça", def: "Favor imerecido de Deus para com a humanidade." },
  { term: "Pecado", def: "Transgressão da lei divina; ato contrário à vontade de Deus." },
  { term: "Redenção", def: "Ato de Deus de libertar a humanidade do pecado através de Jesus." },
  { term: "Fé", def: "Confiança e crença em Deus e em suas promessas." },
  { term: "Salvação", def: "Livramento do pecado e da condenação eterna." },
  { term: "Batismo", def: "Rito de purificação e entrada na comunidade cristã." },
  { term: "Evangelho", def: "A boa notícia da salvação em Jesus Cristo." },
  { term: "Parábola", def: "História curta com ensinamento moral ou espiritual." },
  { term: "Profeta", def: "Pessoa chamada por Deus para transmitir Sua mensagem." },
  { term: "Apóstolo", def: "Discípulo enviado por Jesus para pregar o Evangelho." },
];

type Tab = "antigo" | "novo" | "dicionario";

export default function Biblia() {
  const [tab, setTab] = useState<Tab>("antigo");
  const [search, setSearch] = useState("");

  const filterBooks = (books: string[]) =>
    books.filter((b) => b.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Bíblia" subtitle="66 livros para explorar" icon={iconBiblia} />

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Pesquisar livro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-background pl-12 pr-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "antigo" as Tab, label: "📜 Antigo Testamento", count: 39 },
            { key: "novo" as Tab, label: "✝️ Novo Testamento", count: 27 },
            { key: "dicionario" as Tab, label: "📖 Dicionário Bíblico", count: dicionario.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full font-display text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-popover text-foreground border border-border hover:border-primary/50"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "antigo" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filterBooks(antigoTestamento).map((book, i) => (
              <div key={i} className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border">
                <span className="font-body text-sm text-foreground font-semibold">{book}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "novo" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filterBooks(novoTestamento).map((book, i) => (
              <div key={i} className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border">
                <span className="font-body text-sm text-foreground font-semibold">{book}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "dicionario" && (
          <div className="space-y-3">
            {dicionario
              .filter((d) => d.term.toLowerCase().includes(search.toLowerCase()) || d.def.toLowerCase().includes(search.toLowerCase()))
              .map((d, i) => (
                <div key={i} className="bg-popover rounded-2xl p-4 shadow-md border border-border">
                  <h3 className="font-display text-lg font-bold text-primary">{d.term}</h3>
                  <p className="font-body text-sm text-foreground mt-1">{d.def}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
