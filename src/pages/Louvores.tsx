import { useState, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import KwaiSideActions from "@/components/KwaiSideActions";
import iconLouvores from "@/assets/icon-louvores.png";

const louvores = [
  { title: "Deus é Bom", author: "Louvor Infantil", emoji: "😊", color: "from-yellow-400 to-orange-500", lyrics: "Deus é bom pra mim, Deus é bom pra mim!\nEle me ama, me protege,\nDeus é bom pra mim!\nNa escola, em casa, com meus amigos,\nDeus é bom pra mim!", likes: 234, duration: "3:00" },
  { title: "Alegria no Senhor", author: "Adoração Kids", emoji: "😄", color: "from-pink-400 to-rose-500", lyrics: "A alegria do Senhor é a minha força!\nQuando eu estou triste, Ele me consola.\nQuando eu estou com medo, Ele me protege.\nA alegria do Senhor é a minha força!", likes: 345, duration: "2:45" },
  { title: "Louvai ao Senhor", author: "Coral Infantil", emoji: "👏", color: "from-green-400 to-emerald-500", lyrics: "Louvai ao Senhor, todas as crianças!\nBatam palmas, cantem alto,\nLouvai ao Senhor com alegria!\nEle é o nosso Rei, Ele é o nosso Pai,\nLouvai ao Senhor com todo o coração!", likes: 278, duration: "3:15" },
  { title: "Cantarei ao Rei", author: "Ministério Infantil", emoji: "👑", color: "from-purple-400 to-indigo-500", lyrics: "Cantarei ao Rei dos reis,\nAo Senhor dos senhores.\nCantarei ao Rei dos reis,\nPois Ele é digno de louvor!\nSanto, Santo, Santo é o Senhor!", likes: 189, duration: "2:30" },
  { title: "Hosana nas Alturas", author: "Adoração", emoji: "🌟", color: "from-amber-400 to-yellow-500", lyrics: "Hosana, Hosana nas alturas!\nBendito é o que vem em nome do Senhor!\nHosana, Hosana nas alturas!\nToda a terra canta ao Senhor!", likes: 412, duration: "3:45" },
  { title: "Grandioso és Tu", author: "Hino Clássico", emoji: "🙌", color: "from-sky-400 to-blue-500", lyrics: "Ó Senhor meu Deus, quando eu maravilhado\nFico a pensar nas obras de Tuas mãos,\nNo céu azul de estrelas pontilhado,\nO Teu poder mostrando a criação!\nEntão minh'alma canta a Ti, Senhor:\nQuão grande és Tu! Quão grande és Tu!", likes: 567, duration: "4:00" },
  { title: "Eu me Rendo", author: "Adoração", emoji: "🙏", color: "from-indigo-400 to-violet-500", lyrics: "Eu me rendo aos Teus pés, ó Senhor,\nTodo meu ser é Teu.\nMinha vida, meus sonhos, meu coração,\nTudo entrego a Ti!\nUsa-me, Senhor, como quiser.", likes: 321, duration: "3:30" },
  { title: "O Senhor é Meu Pastor", author: "Salmo 23", emoji: "🐑", color: "from-emerald-400 to-teal-500", lyrics: "O Senhor é meu pastor e nada me faltará.\nDeitar-me faz em verdes pastos,\nGuia-me mansamente a águas tranquilas.\nRefrigera a minha alma.\nAinda que eu ande pelo vale da sombra da morte,\nNão temerei mal algum, porque Tu estás comigo.", likes: 698, duration: "4:30" },
];

export default function Louvores() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLike = (idx: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="relative z-10">
        <PageHeader title="Louvores" subtitle="Deslize para louvar" icon={iconLouvores} />
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {louvores.map((song, i) => (
          <div key={i} className="snap-start h-[calc(100vh-80px)] relative flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-b ${song.color} opacity-90`} />

            <div className="relative z-10 flex flex-col items-center px-6 max-w-lg mx-auto w-full">
              <span className="text-7xl mb-3 drop-shadow-lg">{song.emoji}</span>
              <h2 className="font-display text-3xl font-bold text-white text-center drop-shadow-lg">{song.title}</h2>
              <p className="font-body text-sm text-white/70 mt-1">{song.author}</p>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mt-6 max-h-[40vh] overflow-y-auto w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎵</span>
                  <span className="font-display text-sm font-bold text-white/80">Letra do Louvor</span>
                </div>
                <p className="font-body text-white text-base whitespace-pre-line leading-relaxed">{song.lyrics}</p>
              </div>
            </div>

            <KwaiSideActions
              likes={song.likes}
              isLiked={liked.has(i)}
              onToggleLike={() => toggleLike(i)}
              duration={song.duration}
              coins={2}
            />

            {i < louvores.length - 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce z-20">
                <span className="text-white/60 text-sm font-body">↓ Deslize para mais</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
