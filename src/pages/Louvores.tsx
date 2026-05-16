import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import iconLouvores from "@/assets/icon-louvores.png";
import louvorTudo from "@/assets/louvor-tudo.png";
import louvorEterna from "@/assets/palavra-eterna-cover.jpg";
import louvorAleluia from "@/assets/aleluia-cover.jpg";
import louvorFiel from "@/assets/ser-fiel-cover.jpg";
import louvorEspirito from "@/assets/louvor-espirito.png";
import louvorPai from "@/assets/louvor-pai.png";

interface Louvor {
  title: string;
  icon: string;
  lyrics: string;
}

const louvores: Louvor[] = [
  { title: "Te vejo em Tudo", icon: louvorTudo, lyrics: "Te vejo em tudo, Senhor!\nNo céu azul, no canto das aves,\nNo sorriso de uma criança,\nTe vejo em tudo, Senhor!" },
  { title: "Palavra Eterna", icon: louvorEterna, lyrics: "Tua Palavra é eterna, Senhor,\nLâmpada para os meus pés,\nLuz para o meu caminho.\nTua Palavra é eterna!" },
  { title: "Aleluia", icon: louvorAleluia, lyrics: "Aleluia, Aleluia!\nCristo ressuscitou!\nAleluia, Aleluia!\nA morte Ele venceu!" },
  { title: "Ser Fiel", icon: louvorFiel, lyrics: "Quero ser fiel a Ti, Senhor,\nEm todo tempo e lugar.\nQuero seguir Teus passos,\nE no Teu amor habitar." },
  { title: "Espírito Santo", icon: louvorEspirito, lyrics: "Espírito Santo, vem!\nEnche meu coração,\nDerrama Teu fogo em mim,\nEspírito Santo, vem!" },
  { title: "Pai", icon: louvorPai, lyrics: "Pai, eu Te amo!\nPai, eu Te adoro!\nObrigado por me amar,\nPor cuidar de mim, Pai!" },
];

export default function Louvores() {
  const [selected, setSelected] = useState<Louvor | null>(null);

  return (
    <div className="min-h-screen py-4 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Louvores" subtitle="Toque em um louvor" icon={iconLouvores} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 py-4">
          {louvores.map((l, i) => (
            <button
              key={i}
              onClick={() => setSelected(l)}
              className="flex flex-col items-center gap-2 hover:scale-105 transition-transform"
            >
              <img
                src={l.icon}
                alt={l.title}
                loading="lazy"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-primary/30 shadow-lg bg-white object-cover"
              />
              <p className="text-xs sm:text-sm font-bold text-primary text-center leading-tight drop-shadow">
                {l.title}
              </p>
            </button>
          ))}
        </div>

        <div className="text-center mt-6 space-y-2 max-w-2xl mx-auto">
          <p className="font-display text-2xl font-bold text-primary">Convido você!</p>
          <p className="font-body text-sm text-foreground">A acompanhar e compartilhar este projeto, assim você se torna parte desta missão.</p>
          <p className="font-display text-base italic text-primary">"Porque a Palavra de Deus é viva e eficaz." (Hebreus 4:12)</p>
          <p className="font-display text-lg font-bold text-foreground">Acreditem! Tenham fé na Palavra.</p>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-popover rounded-2xl border-2 border-primary/30 max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold hover:scale-110 transition-transform">✕</button>
            <img src={selected.icon} alt={selected.title} className="w-32 h-32 mx-auto mb-3 drop-shadow-lg" />
            <h2 className="font-display text-2xl font-bold text-center text-foreground mb-4">{selected.title}</h2>
            <p className="font-body text-foreground whitespace-pre-line leading-relaxed text-center">{selected.lyrics}</p>
          </div>
        </div>
      )}
    </div>
  );
}
