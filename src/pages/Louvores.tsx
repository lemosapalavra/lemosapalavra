import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import iconLouvores from "@/assets/icon-louvores.png";
import logoCentral from "@/assets/logo-central.png";
import louvorTudo from "@/assets/louvor-tudo.png";
import louvorEterna from "@/assets/palavra-eterna-cover.jpg";
import louvorAleluia from "@/assets/aleluia-cover.jpg";
import louvorFiel from "@/assets/ser-fiel-cover.jpg";
import louvorEspirito from "@/assets/louvor-espirito.png";
import louvorPai from "@/assets/louvor-pai.png";

interface Louvor {
  title: string;
  icon: string;
  angle: number;
  lyrics: string;
}

const louvores: Louvor[] = [
  { title: "Te vejo em Tudo", icon: louvorTudo, angle: -90, lyrics: "Te vejo em tudo, Senhor!\nNo céu azul, no canto das aves,\nNo sorriso de uma criança,\nTe vejo em tudo, Senhor!" },
  { title: "Palavra Eterna", icon: louvorEterna, angle: -150, lyrics: "Tua Palavra é eterna, Senhor,\nLâmpada para os meus pés,\nLuz para o meu caminho.\nTua Palavra é eterna!" },
  { title: "Aleluia", icon: louvorAleluia, angle: -30, lyrics: "Aleluia, Aleluia!\nCristo ressuscitou!\nAleluia, Aleluia!\nA morte Ele venceu!" },
  { title: "Ser Fiel", icon: louvorFiel, angle: 150, lyrics: "Quero ser fiel a Ti, Senhor,\nEm todo tempo e lugar.\nQuero seguir Teus passos,\nE no Teu amor habitar." },
  { title: "Espírito Santo", icon: louvorEspirito, angle: 30, lyrics: "Espírito Santo, vem!\nEnche meu coração,\nDerrama Teu fogo em mim,\nEspírito Santo, vem!" },
  { title: "Pai", icon: louvorPai, angle: 90, lyrics: "Pai, eu Te amo!\nPai, eu Te adoro!\nObrigado por me amar,\nPor cuidar de mim, Pai!" },
];

export default function Louvores() {
  const [selected, setSelected] = useState<Louvor | null>(null);
  const radius = 210;
  const iconSize = 90;

  return (
    <div className="min-h-screen py-4 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Louvores" subtitle="Toque em um louvor" icon={iconLouvores} />

        <div className="relative mx-auto flex items-center justify-center" style={{ width: 600, height: 600, maxWidth: "100%" }}>
          <img
            src={logoCentral}
            alt="Lemos a Palavra"
            className="absolute z-10 drop-shadow-xl"
            style={{ width: 240, height: 240, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          />
          <div className="orbit-container absolute inset-0">
            {louvores.map((l, i) => {
              const angleRad = (l.angle * Math.PI) / 180;
              const x = 300 + Math.cos(angleRad) * radius - iconSize / 2;
              const y = 300 + Math.sin(angleRad) * radius - iconSize / 2;
              return (
                <div
                  key={i}
                  className="orbit-counter absolute"
                  style={{ left: x, top: y, width: iconSize }}
                >
                  <div
                    onClick={() => setSelected(l)}
                    className="cursor-pointer hover:scale-110 transition-transform text-center"
                  >
                    <img
                      src={l.icon}
                      alt={l.title}
                      loading="lazy"
                      className="drop-shadow-lg rounded-full border-2 border-primary/30 shadow-lg mx-auto"
                      style={{ width: iconSize, height: iconSize, objectFit: "cover" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
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
