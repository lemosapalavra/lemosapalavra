import { useState, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import iconMusicas from "@/assets/icon-musicas.png";

const musicList = [
  { title: "Deus é Tão Bom", category: "Infantil", emoji: "🎶", color: "from-yellow-400 to-orange-500", lyrics: "Deus é tão bom, Deus é tão bom,\nDeus é tão bom, é tão bom pra mim!\nEle salva, Ele cura, Ele é tão bom pra mim!\nAleluia, glória a Deus, é tão bom pra mim!", likes: 342 },
  { title: "Meu Barquinho", category: "Infantil", emoji: "⛵", color: "from-cyan-400 to-blue-500", lyrics: "Com meu barquinho eu vou navegar,\nJesus no leme vai me guiar.\nCom meu barquinho eu vou navegar,\nNão tenho medo, vou confiar!", likes: 256 },
  { title: "Se Eu Fosse um Peixinho", category: "Infantil", emoji: "🐟", color: "from-blue-400 to-indigo-500", lyrics: "Se eu fosse um peixinho e soubesse nadar,\nEu tirava Jesus lá do fundo do mar.\nEu tirava Jesus lá do fundo do mar,\nPra Jesus ser feliz e comigo brincar!", likes: 189 },
  { title: "A Arca de Noé", category: "Infantil", emoji: "🚢", color: "from-green-400 to-teal-500", lyrics: "Estava Noé construindo a arca,\nQuando Deus mandou parar.\nVenham os animais de dois em dois,\nPois a chuva vai começar!\nOs elefantes, os passarinhos,\nTodos vieram pra embarcar!", likes: 298 },
  { title: "Cristo Ama as Crianças", category: "Infantil", emoji: "❤️", color: "from-pink-400 to-rose-500", lyrics: "Cristo ama as crianças,\nTodas as crianças do mundo.\nPretinhas, branquinhas, amarelinhas,\nTodas elas são iguais!\nCristo ama as crianças do mundo!", likes: 412 },
  { title: "Pai Abraão", category: "Infantil", emoji: "👴", color: "from-amber-400 to-yellow-500", lyrics: "Pai Abraão tinha muitos filhos,\nMuitos filhos tinha Pai Abraão.\nEu sou um deles, você também,\nVamos todos louvar ao Senhor!\nDireita, esquerda, direita, esquerda...", likes: 178 },
  { title: "O Amor de Deus", category: "Adoração", emoji: "💛", color: "from-purple-400 to-pink-500", lyrics: "O amor de Deus é maravilhoso,\nO amor de Deus é maravilhoso,\nO amor de Deus é maravilhoso,\nGrande é o amor de Deus!\nTão alto que não posso ir além,\nTão fundo que não posso ir aquém.\nTão largo que não posso ir fora,\nGrande é o amor de Deus!", likes: 534 },
  { title: "Aleluia", category: "Adoração", emoji: "🙌", color: "from-indigo-400 to-violet-500", lyrics: "Aleluia, Aleluia, Aleluia!\nO Senhor Deus Todo-Poderoso reina!\nAleluia, Aleluia, Aleluia!\nO Senhor Deus Todo-Poderoso reina!", likes: 467 },
  { title: "Santo, Santo, Santo", category: "Adoração", emoji: "✨", color: "from-sky-400 to-blue-600", lyrics: "Santo, Santo, Santo!\nDeus onipotente!\nCedo de manhã cantaremos Teu louvor.\nSanto, Santo, Santo! Justo e Compassivo!\nDeus em três pessoas, bendita Trindade!", likes: 389 },
  { title: "Noite de Paz", category: "Natal", emoji: "🎄", color: "from-red-400 to-green-500", lyrics: "Noite de paz, noite de amor,\nTudo dorme em redor.\nEntre os astros que espargem a luz,\nProclamando o menino Jesus,\nBrilha a estrela da paz!\nBrilha a estrela da paz!", likes: 523 },
  { title: "Quão Grande és Tu", category: "Hinos", emoji: "🎹", color: "from-emerald-400 to-cyan-500", lyrics: "Senhor, meu Deus, quando eu maravilhado\nFico a pensar nas obras de Tuas mãos,\nNo céu azul de estrelas pontilhado,\nO Teu poder mostrando a criação.\nEntão minh'alma canta a Ti, Senhor:\nQuão grande és Tu! Quão grande és Tu!", likes: 678 },
  { title: "Rude Cruz", category: "Hinos", emoji: "✝️", color: "from-rose-400 to-purple-500", lyrics: "Rude cruz se erigiu,\nDo suplício e da dor,\nEmblemando a redenção\nNessa cruz padeceu\nO Cordeiro de Deus,\nPra nos dar salvação!", likes: 445 },
];

export default function Musicas() {
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
        <PageHeader title="Músicas" subtitle="Deslize para cantar" icon={iconMusicas} />
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {musicList.map((m, i) => (
          <div
            key={i}
            className="snap-start h-[calc(100vh-80px)] relative flex items-center justify-center"
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${m.color} opacity-90`} />

            <div className="relative z-10 flex flex-col items-center px-6 max-w-lg mx-auto w-full">
              <span className="text-7xl mb-4 drop-shadow-lg">{m.emoji}</span>
              <h2 className="font-display text-3xl font-bold text-white text-center drop-shadow-lg">{m.title}</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-white text-xs font-bold mt-2 backdrop-blur-sm">{m.category}</span>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mt-6 max-h-[45vh] overflow-y-auto w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎵</span>
                  <span className="font-display text-sm font-bold text-white/80">Letra da Música</span>
                </div>
                <p className="font-body text-white text-base whitespace-pre-line leading-relaxed">{m.lyrics}</p>
                <p className="font-body text-white/50 text-xs mt-4 italic text-center">🎵 Cante junto com sua família!</p>
              </div>
            </div>

            {/* Side actions */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center gap-5 z-20">
              <button onClick={() => toggleLike(i)} className="flex flex-col items-center">
                <span className={`text-3xl ${liked.has(i) ? "" : "grayscale"}`}>❤️</span>
                <span className="text-white text-xs font-bold">{m.likes + (liked.has(i) ? 1 : 0)}</span>
              </button>
              <div className="flex flex-col items-center">
                <span className="text-3xl">🎤</span>
                <span className="text-white text-xs font-bold">Cantar</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl">🔗</span>
                <span className="text-white text-xs font-bold">Enviar</span>
              </div>
            </div>

            {i < musicList.length - 1 && (
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
