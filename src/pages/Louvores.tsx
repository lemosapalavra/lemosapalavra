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
import louvorPlaylists from "@/assets/louvor-playlists.png";

interface Louvor {
  title: string;
  icon: string;
  videoUrl?: string;
  lyrics?: string;
}

const louvores: Louvor[] = [
  { title: "Do meu Jeito", icon: louvorTudo, videoUrl: "https://iframe.mediadelivery.net/embed/660719/6400db8d-69e9-4b99-8c19-9a512f714662?autoplay=true" },
  { title: "Palavra Eterna", icon: louvorEterna, videoUrl: "https://iframe.mediadelivery.net/embed/660653/49bd5ac8-4537-45f6-9b25-d8af4da7d099?autoplay=true" },
  { title: "Graça Aleluia", icon: louvorAleluia, videoUrl: "https://iframe.mediadelivery.net/embed/660653/ae17b103-e921-4ebb-bb23-2ae690c2e5a5?autoplay=true" },
  { title: "Sou Fiel", icon: louvorFiel, videoUrl: "https://iframe.mediadelivery.net/embed/660653/2336364c-8169-4926-ac1a-1fc6baa6a0c5?autoplay=true" },
  { title: "Espírito Santo", icon: louvorEspirito, videoUrl: "https://iframe.mediadelivery.net/embed/660653/ed00cfd9-9b30-4803-bf53-8070ec0b5be9?autoplay=true" },
  { title: "Pai e Filho", icon: louvorPai, videoUrl: "https://iframe.mediadelivery.net/embed/660719/c1358bec-0118-4db8-8b34-8dce8c765fe2?autoplay=true" },
  { title: "Um de Nós", icon: louvorPlaylists, videoUrl: "https://iframe.mediadelivery.net/embed/660719/4a4cfdb3-e26c-4dc9-9363-f045feca99be?autoplay=true" },
];

export default function Louvores() {
  const [selected, setSelected] = useState<Louvor | null>(null);

  return (
    <div className="min-h-screen py-4 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Músicas" subtitle="Toque em uma música" icon={iconLouvores} />

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 py-4">
          <div className="flex flex-col items-center gap-5 sm:gap-6">
            {louvores.slice(0, Math.ceil(louvores.length / 2)).map((l, i) => (
              <button
                key={i}
                onClick={() => setSelected(l)}
                className="flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              >
                <img
                  src={l.icon}
                  alt={l.title}
                  loading="lazy"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary/30 shadow-lg bg-white object-cover"
                />
                <p className="text-xs sm:text-sm font-bold text-primary text-center leading-tight drop-shadow">
                  {l.title}
                </p>
              </button>
            ))}
          </div>

          <img
            src={logoCentral}
            alt="Lemos a Palavra"
            className="w-32 sm:w-48 md:w-56 drop-shadow-xl"
          />

          <div className="flex flex-col items-center gap-5 sm:gap-6">
            {louvores.slice(Math.ceil(louvores.length / 2)).map((l, i) => (
              <button
                key={i}
                onClick={() => setSelected(l)}
                className="flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              >
                <img
                  src={l.icon}
                  alt={l.title}
                  loading="lazy"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-primary/30 shadow-lg bg-white object-cover"
                />
                <p className="text-xs sm:text-sm font-bold text-primary text-center leading-tight drop-shadow">
                  {l.title}
                </p>
              </button>
            ))}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-popover rounded-2xl border-2 border-primary/30 max-w-3xl w-full p-4 shadow-2xl relative">
            <button onClick={() => setSelected(null)} className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold hover:scale-110 transition-transform z-10 shadow-lg">✕</button>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-center text-foreground mb-3">{selected.title}</h2>
            {selected.videoUrl ? (
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={selected.videoUrl}
                  loading="lazy"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full rounded-lg border-0"
                />
              </div>
            ) : (
              <p className="font-body text-foreground whitespace-pre-line leading-relaxed text-center">{selected.lyrics}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
