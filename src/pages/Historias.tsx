import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import iconHistorias from "@/assets/icon-historias.png";
import logoCentral from "@/assets/logo-central.png";
import iconCriacao from "@/assets/historia-criacao.png";
import iconBatalha from "@/assets/historia-batalha-anjos.png";
import iconAdaoEva1 from "@/assets/historia-adao-eva-1.png";
import iconAdaoEva2 from "@/assets/historia-adao-eva-2.png";
import iconNoe1 from "@/assets/historia-noe-1.png";
import iconNoe2 from "@/assets/historia-noe-2.png";
import iconMoises1 from "@/assets/historia-moises-1.png";
import iconMoises2 from "@/assets/historia-moises-2.png";
import iconMoises3 from "@/assets/historia-moises-3.png";

interface Historia {
  title: string;
  icon: string;
  angle: number;
  src: string;
}

const BUNNY = (id: string) => `https://iframe.mediadelivery.net/embed/660536/${id}?autoplay=true`;

const rawHistorias: Omit<Historia, "angle">[] = [
  { title: "A Criação", icon: iconCriacao, src: BUNNY("2889e4ae-7f95-4bbb-be0f-ccc9e094477c") },
  { title: "A Batalha dos Anjos", icon: iconBatalha, src: BUNNY("c46984a1-dcf7-45f9-95bd-e479beae1851") },
  { title: "Adão e Eva — Parte I", icon: iconAdaoEva1, src: BUNNY("2e91578e-033a-41ee-925e-e7c8263761f5") },
  { title: "Adão e Eva — Parte II", icon: iconAdaoEva2, src: BUNNY("95eed0a7-d4ee-42cd-8838-a11a378e5be9") },
  { title: "Noé e a Arca — Parte I", icon: iconNoe1, src: BUNNY("f390899d-48ba-4f8b-8bff-5da2a9e0bb06") },
  { title: "Noé e a Arca — Parte II", icon: iconNoe2, src: BUNNY("8beb646a-746b-42fd-8be5-f6acdd11a522") },
  { title: "Moisés — Parte I", icon: iconMoises1, src: BUNNY("3a7dcf5f-6f4b-41a1-9af5-5353e7a5eea0") },
  { title: "Moisés — Parte II", icon: iconMoises2, src: BUNNY("902b0a08-13a9-4bb7-9050-714971012c16") },
  { title: "Moisés — Parte III", icon: iconMoises3, src: BUNNY("50392cc2-49d4-45c4-bd69-c2edf55be14d") },
];

const historias: Historia[] = rawHistorias.map((h, i, arr) => ({
  ...h,
  angle: -90 + (360 / arr.length) * i,
}));

export default function Historias() {
  const [playing, setPlaying] = useState<Historia | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const radius = 210;
  const iconSize = 90;

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

  return (
    <div className="min-h-screen py-4 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Histórias Bíblicas" subtitle="Escolha uma história" icon={iconHistorias} />

        <div className="relative mx-auto flex items-center justify-center" style={{ width: 600, height: 600, maxWidth: "100%" }}>
          <img
            src={logoCentral}
            alt="Lemos a Palavra"
            className="absolute z-10 drop-shadow-xl"
            style={{ width: 240, height: 240, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          />
          <div className="orbit-container absolute inset-0">
            {historias.map((h, i) => {
              const angleRad = (h.angle * Math.PI) / 180;
              const x = 300 + Math.cos(angleRad) * radius - iconSize / 2;
              const y = 300 + Math.sin(angleRad) * radius - iconSize / 2;
              return (
                <div key={i} className="orbit-counter absolute" style={{ left: x, top: y, width: iconSize }}>
                  <div
                    onClick={() => setPlaying(h)}
                    className="cursor-pointer hover:scale-110 transition-transform text-center"
                  >
                    <img
                      src={h.icon}
                      alt={h.title}
                      loading="lazy"
                      className="drop-shadow-lg rounded-full border-2 border-primary/30 shadow-lg mx-auto bg-white"
                      style={{ width: iconSize, height: iconSize, objectFit: "cover" }}
                    />
                    <p className="mt-1 text-xs font-bold text-primary drop-shadow">{h.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
