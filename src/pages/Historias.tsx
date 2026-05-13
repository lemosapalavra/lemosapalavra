import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import iconHistorias from "@/assets/icon-historias.png";
import logoCentral from "@/assets/logo-central.png";
import iconCriacao from "@/assets/historia-criacao.jpg";
import iconBatalha from "@/assets/historia-batalha-anjos.jpg";
import iconNova from "@/assets/historia-nova.png";

interface Historia {
  title: string;
  icon: string;
  angle: number;
  src: string;
  embed?: boolean;
}

const DRIVE_ID = "18H9e4yUmtF1HiuOkEkd3wVpPDWfACJyN";
const CRIACAO_ID = "1WeVGy9ZS0pdITH6GyiExxfJMEBRe7Yk_ZxPm9vUz5c0";

const historias: Historia[] = [
  {
    title: "A Criação",
    icon: iconCriacao,
    angle: -90,
    src: `https://docs.google.com/videos/d/${CRIACAO_ID}/preview`,
    embed: true,
  },
  { title: "A Batalha dos Anjos", icon: iconBatalha, angle: 30, src: "/videos/batalha-dos-anjos.mp4" },
  {
    title: "A Palavra Viva",
    icon: iconNova,
    angle: 150,
    src: `https://drive.google.com/file/d/${DRIVE_ID}/preview`,
    embed: true,
  },
];

export default function Historias() {
  const [playing, setPlaying] = useState<Historia | null>(null);
  const radius = 210;
  const iconSize = 90;

  if (playing) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setPlaying(null)}
          className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white transition"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        {playing.embed ? (
          <iframe
            src={playing.src}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={playing.title}
          />
        ) : (
          <video src={playing.src} controls autoPlay playsInline className="w-full h-full object-contain">
            Seu navegador não suporta vídeo.
          </video>
        )}
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
