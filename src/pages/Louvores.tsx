import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import iconLouvores from "@/assets/icon-louvores.png";
import logoCentral from "@/assets/logo-central.png";

interface Louvor {
  title: string;
  src: string;
  thumb: string;
}

const EMBED = (lib: string, id: string, autoplay = false) =>
  `https://iframe.mediadelivery.net/embed/${lib}/${id}?autoplay=${autoplay}&preload=true&muted=${!autoplay}`;
const THUMB = (lib: string, id: string) =>
  `https://iframe.mediadelivery.net/embed/${lib}/${id}?autoplay=false&preload=true&muted=true`;

const louvores: Louvor[] = [
  { title: "Do meu Jeito", src: EMBED("660719", "6400db8d-69e9-4b99-8c19-9a512f714662", true), thumb: THUMB("660719", "6400db8d-69e9-4b99-8c19-9a512f714662") },
  { title: "Palavra Eterna", src: EMBED("660653", "49bd5ac8-4537-45f6-9b25-d8af4da7d099", true), thumb: THUMB("660653", "49bd5ac8-4537-45f6-9b25-d8af4da7d099") },
  { title: "Graça Aleluia", src: EMBED("660653", "ae17b103-e921-4ebb-bb23-2ae690c2e5a5", true), thumb: THUMB("660653", "ae17b103-e921-4ebb-bb23-2ae690c2e5a5") },
  { title: "Sou Fiel", src: EMBED("660653", "2336364c-8169-4926-ac1a-1fc6baa6a0c5", true), thumb: THUMB("660653", "2336364c-8169-4926-ac1a-1fc6baa6a0c5") },
  { title: "Espírito Santo", src: EMBED("660653", "ed00cfd9-9b30-4803-bf53-8070ec0b5be9", true), thumb: THUMB("660653", "ed00cfd9-9b30-4803-bf53-8070ec0b5be9") },
  { title: "Pai e Filho", src: EMBED("660719", "c1358bec-0118-4db8-8b34-8dce8c765fe2", true), thumb: THUMB("660719", "c1358bec-0118-4db8-8b34-8dce8c765fe2") },
  { title: "Um de Nós", src: EMBED("660719", "4a4cfdb3-e26c-4dc9-9363-f045feca99be", true), thumb: THUMB("660719", "4a4cfdb3-e26c-4dc9-9363-f045feca99be") },
];

export default function Louvores() {
  const [playing, setPlaying] = useState<Louvor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playing && containerRef.current) {
      const el = containerRef.current as any;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      req?.call(el).catch(() => {});
    }
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, [playing]);

  if (playing) {
    return (
      <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setPlaying(null)}
          className="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white transition"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <iframe
          src={playing.src}
          className="w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          title={playing.title}
        />
      </div>
    );
  }

  const renderItem = (l: Louvor, i: number) => (
    <button
      key={i}
      onClick={() => setPlaying(l)}
      className="flex flex-col items-center gap-2 hover:scale-105 transition-transform group"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg bg-black">
        <iframe
          src={l.thumb}
          className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none"
          tabIndex={-1}
          aria-hidden
          title={`Capa ${l.title}`}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>
      <p className="text-xs sm:text-sm font-bold text-primary text-center leading-tight drop-shadow max-w-[120px]">
        {l.title}
      </p>
    </button>
  );

  const mid = Math.ceil(louvores.length / 2);

  return (
    <div className="min-h-screen py-4 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Músicas" subtitle="Toque em uma música" icon={iconLouvores} />

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 py-4">
          <div className="flex flex-col items-center gap-5 sm:gap-6">
            {louvores.slice(0, mid).map(renderItem)}
          </div>

          <img src={logoCentral} alt="Lemos a Palavra" className="w-32 sm:w-48 md:w-56 drop-shadow-xl" />

          <div className="flex flex-col items-center gap-5 sm:gap-6">
            {louvores.slice(mid).map(renderItem)}
          </div>
        </div>

        <div className="text-center mt-6 space-y-2 max-w-2xl mx-auto">
          <p className="font-display text-2xl font-bold text-primary">Convido você!</p>
          <p className="font-body text-sm text-foreground">A acompanhar e compartilhar este projeto, assim você se torna parte desta missão.</p>
          <p className="font-display text-base italic text-primary">"Porque a Palavra de Deus é viva e eficaz." (Hebreus 4:12)</p>
          <p className="font-display text-lg font-bold text-foreground">Acreditem! Tenham fé na Palavra.</p>
        </div>
      </div>
    </div>
  );
}
