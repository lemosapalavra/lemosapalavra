import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import iconMusicas from "@/assets/icon-musicas.png";

const musicList = [
  { title: "Deus é Tão Bom", category: "Infantil", emoji: "🎶", lyrics: "Deus é tão bom, Deus é tão bom,\nDeus é tão bom, é tão bom pra mim!\nEle salva, Ele cura, Ele é tão bom pra mim!\nAleluia, glória a Deus, é tão bom pra mim!" },
  { title: "Meu Barquinho", category: "Infantil", emoji: "⛵", lyrics: "Com meu barquinho eu vou navegar,\nJesus no leme vai me guiar.\nCom meu barquinho eu vou navegar,\nNão tenho medo, vou confiar!" },
  { title: "Se Eu Fosse um Peixinho", category: "Infantil", emoji: "🐟", lyrics: "Se eu fosse um peixinho e soubesse nadar,\nEu tirava Jesus lá do fundo do mar.\nEu tirava Jesus lá do fundo do mar,\nPra Jesus ser feliz e comigo brincar!" },
  { title: "A Arca de Noé", category: "Infantil", emoji: "🚢", lyrics: "Estava Noé construindo a arca,\nQuando Deus mandou parar.\nVenham os animais de dois em dois,\nPois a chuva vai começar!\nOs elefantes, os passarinhos,\nTodos vieram pra embarcar!" },
  { title: "Cristo Ama as Crianças", category: "Infantil", emoji: "❤️", lyrics: "Cristo ama as crianças,\nTodas as crianças do mundo.\nPretinhas, branquinhas, amarelinhas,\nTodas elas são iguais!\nCristo ama as crianças do mundo!" },
  { title: "Pai Abraão", category: "Infantil", emoji: "👴", lyrics: "Pai Abraão tinha muitos filhos,\nMuitos filhos tinha Pai Abraão.\nEu sou um deles, você também,\nVamos todos louvar ao Senhor!\nDireita, esquerda, direita, esquerda..." },
  { title: "O Amor de Deus", category: "Adoração", emoji: "💛", lyrics: "O amor de Deus é maravilhoso,\nO amor de Deus é maravilhoso,\nO amor de Deus é maravilhoso,\nGrande é o amor de Deus!\nTão alto que não posso ir além,\nTão fundo que não posso ir aquém.\nTão largo que não posso ir fora,\nGrande é o amor de Deus!" },
  { title: "Aleluia", category: "Adoração", emoji: "🙌", lyrics: "Aleluia, Aleluia, Aleluia!\nO Senhor Deus Todo-Poderoso reina!\nAleluia, Aleluia, Aleluia!\nO Senhor Deus Todo-Poderoso reina!" },
  { title: "Santo, Santo, Santo", category: "Adoração", emoji: "✨", lyrics: "Santo, Santo, Santo!\nDeus onipotente!\nCedo de manhã cantaremos Teu louvor.\nSanto, Santo, Santo! Justo e Compassivo!\nDeus em três pessoas, bendita Trindade!" },
  { title: "Noite de Paz", category: "Natal", emoji: "🎄", lyrics: "Noite de paz, noite de amor,\nTudo dorme em redor.\nEntre os astros que espargem a luz,\nProclamando o menino Jesus,\nBrilha a estrela da paz!\nBrilha a estrela da paz!" },
  { title: "Quão Grande és Tu", category: "Hinos", emoji: "🎹", lyrics: "Senhor, meu Deus, quando eu maravilhado\nFico a pensar nas obras de Tuas mãos,\nNo céu azul de estrelas pontilhado,\nO Teu poder mostrando a criação.\nEntão minh'alma canta a Ti, Senhor:\nQuão grande és Tu! Quão grande és Tu!" },
  { title: "Rude Cruz", category: "Hinos", emoji: "✝️", lyrics: "Rude cruz se erigiu,\nDo suplício e da dor,\nEmblemando a redenção\nNessa cruz padeceu\nO Cordeiro de Deus,\nPra nos dar salvação!" },
];

export default function Musicas() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState("Todos");

  const categories = ["Todos", "Infantil", "Adoração", "Hinos", "Natal"];
  const filtered = filter === "Todos" ? musicList : musicList.filter(m => m.category === filter);

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Músicas" subtitle="Arte, Harmonia, Melodia e Ritmo" icon={iconMusicas} />

        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setSelected(null); }}
              className={`px-4 py-2 rounded-full font-display text-sm font-bold transition-all ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-popover text-foreground border border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((m, i) => {
            const globalIndex = musicList.indexOf(m);
            const isOpen = selected === globalIndex;
            return (
              <div key={globalIndex} className="bg-popover rounded-2xl shadow-md border border-border overflow-hidden">
                <button
                  onClick={() => setSelected(isOpen ? null : globalIndex)}
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-accent/20 transition-colors"
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-foreground">{m.title}</h3>
                    <p className="font-body text-xs text-muted-foreground">{m.category}</p>
                  </div>
                  <span className="text-xl transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "" }}>▼</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <p className="font-body text-sm text-foreground whitespace-pre-line leading-relaxed">{m.lyrics}</p>
                    <p className="font-body text-xs text-muted-foreground mt-3 italic">🎵 Cante junto com sua família!</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
