import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import iconLouvores from "@/assets/icon-louvores.png";

const louvores = [
  { title: "Deus é Bom", author: "Louvor Infantil", lyrics: "Deus é bom pra mim, Deus é bom pra mim!\nEle me ama, me protege,\nDeus é bom pra mim!\nNa escola, em casa, com meus amigos,\nDeus é bom pra mim!", emoji: "😊" },
  { title: "Alegria no Senhor", author: "Adoração Kids", lyrics: "A alegria do Senhor é a minha força!\nQuando eu estou triste, Ele me consola.\nQuando eu estou com medo, Ele me protege.\nA alegria do Senhor é a minha força!", emoji: "😄" },
  { title: "Louvai ao Senhor", author: "Coral Infantil", lyrics: "Louvai ao Senhor, todas as crianças!\nBatam palmas, cantem alto,\nLouvai ao Senhor com alegria!\nEle é o nosso Rei, Ele é o nosso Pai,\nLouvai ao Senhor com todo o coração!", emoji: "👏" },
  { title: "Cantarei ao Rei", author: "Ministério Infantil", lyrics: "Cantarei ao Rei dos reis,\nAo Senhor dos senhores.\nCantarei ao Rei dos reis,\nPois Ele é digno de louvor!\nSanto, Santo, Santo é o Senhor!", emoji: "👑" },
  { title: "Hosana nas Alturas", author: "Adoração", lyrics: "Hosana, Hosana nas alturas!\nBendito é o que vem em nome do Senhor!\nHosana, Hosana nas alturas!\nToda a terra canta ao Senhor!", emoji: "🌟" },
  { title: "Grandioso és Tu", author: "Hino Clássico", lyrics: "Ó Senhor meu Deus, quando eu maravilhado\nFico a pensar nas obras de Tuas mãos,\nNo céu azul de estrelas pontilhado,\nO Teu poder mostrando a criação!\nEntão minh'alma canta a Ti, Senhor:\nQuão grande és Tu! Quão grande és Tu!", emoji: "🙌" },
  { title: "Eu me Rendo", author: "Adoração", lyrics: "Eu me rendo aos Teus pés, ó Senhor,\nTodo meu ser é Teu.\nMinha vida, meus sonhos, meu coração,\nTudo entrego a Ti!\nUsa-me, Senhor, como quiser.", emoji: "🙏" },
  { title: "O Senhor é Meu Pastor", author: "Salmo 23", lyrics: "O Senhor é meu pastor e nada me faltará.\nDeitar-me faz em verdes pastos,\nGuia-me mansamente a águas tranquilas.\nRefrigera a minha alma.\nAinda que eu ande pelo vale da sombra da morte,\nNão temerei mal algum, porque Tu estás comigo.", emoji: "🐑" },
];

export default function Louvores() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Louvores" subtitle="Adoração a Deus" icon={iconLouvores} />

        <div className="space-y-3">
          {louvores.map((song, i) => {
            const isOpen = selected === i;
            return (
              <div key={i} className="bg-popover rounded-2xl shadow-md border border-border overflow-hidden">
                <button
                  onClick={() => setSelected(isOpen ? null : i)}
                  className="w-full p-4 flex items-center gap-3 text-left hover:bg-accent/20 transition-colors"
                >
                  <span className="text-3xl">{song.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-foreground">{song.title}</h3>
                    <p className="font-body text-xs text-muted-foreground">{song.author}</p>
                  </div>
                  <span className="text-xl transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "" }}>▼</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-border pt-3">
                    <p className="font-body text-sm text-foreground whitespace-pre-line leading-relaxed">{song.lyrics}</p>
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
