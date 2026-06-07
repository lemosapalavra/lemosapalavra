import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import iconHistorias from "@/assets/icon-historias.png";
import logoCentral from "@/assets/logo-central.png";
import iconFilmes from "@/assets/icon-filmes.png";
import iconSeries from "@/assets/icon-series.png";
import iconCriacao from "@/assets/historia-criacao.png";
import iconBatalha from "@/assets/historia-batalha-anjos.png";
import iconAdaoEva1 from "@/assets/historia-adao-eva-1.png";
import iconAdaoEva2 from "@/assets/historia-adao-eva-2.png";
import iconNoe1 from "@/assets/historia-noe-1.png";
import iconNoe2 from "@/assets/historia-noe-2.png";
import iconMoises1 from "@/assets/historia-moises-1.png";
import iconMoises2 from "@/assets/historia-moises-2.png";
import iconMoises3 from "@/assets/historia-moises-3.png";
import iconDaviGolias from "@/assets/historia-davi-golias.png";
import icon10Mandamentos from "@/assets/historia-10-mandamentos.png";

interface Video {
  title: string;
  icon: string;
  src: string;
}
interface Folder {
  key: string;
  title: string;
  icon: string;
  videos: Video[];
}

const LOCAL_VIDEO = (file: string) => `/videos/${file}`;
const UNAVAILABLE_VIDEO = "";

const folders: Folder[] = [
  {
    key: "series",
    title: "Séries Bíblicas",
    icon: iconSeries,
    videos: [
      { title: "Adão e Eva — Parte I", icon: iconAdaoEva1, src: UNAVAILABLE_VIDEO },
      { title: "Adão e Eva — Parte II", icon: iconAdaoEva2, src: UNAVAILABLE_VIDEO },
      { title: "Noé e a Arca — Parte I", icon: iconNoe1, src: UNAVAILABLE_VIDEO },
      { title: "Noé e a Arca — Parte II", icon: iconNoe2, src: UNAVAILABLE_VIDEO },
      { title: "Moisés — Parte I", icon: iconMoises1, src: UNAVAILABLE_VIDEO },
      { title: "Moisés — Parte II", icon: iconMoises2, src: UNAVAILABLE_VIDEO },
      { title: "Moisés — Parte III", icon: iconMoises3, src: UNAVAILABLE_VIDEO },
    ],
  },
  {
    key: "filmes",
    title: "Filmes Bíblicos",
    icon: iconFilmes,
    videos: [
      { title: "A Criação", icon: iconCriacao, src: LOCAL_VIDEO("a-criacao.mp4") },
      { title: "A Batalha dos Anjos", icon: iconBatalha, src: LOCAL_VIDEO("batalha-dos-anjos.mp4") },
      { title: "Davi e Golias", icon: iconDaviGolias, src: UNAVAILABLE_VIDEO },
      { title: "Os Dez Mandamentos", icon: icon10Mandamentos, src: UNAVAILABLE_VIDEO },
    ],
  },
];

export default function Historias() {
  const [openFolder, setOpenFolder] = useState<Folder | null>(null);
  const [playing, setPlaying] = useState<Video | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const radius = 210;
  const iconSize = 100;

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
        {playing.src ? (
          <video src={playing.src} className="absolute inset-0 w-full h-full bg-black" controls autoPlay />
        ) : (
          <div className="max-w-md mx-auto text-center text-white p-6">
            <h2 className="font-display text-3xl font-bold mb-3">Vídeo em atualização</h2>
            <p className="text-white/80">O link antigo estava quebrado e foi removido para não exibir erro 404.</p>
          </div>
        )}
      </div>
    );
  }

  const items: { title: string; icon: string; onClick: () => void }[] = openFolder
    ? openFolder.videos.map((v) => ({ title: v.title, icon: v.icon, onClick: () => setPlaying(v) }))
    : folders.map((f) => ({ title: f.title, icon: f.icon, onClick: () => setOpenFolder(f) }));

  return (
    <div className="min-h-screen py-4 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title={openFolder ? openFolder.title : "Histórias Bíblicas"}
          subtitle={openFolder ? "Escolha um vídeo" : "Escolha uma categoria"}
          icon={openFolder ? openFolder.icon : iconHistorias}
        />

        {openFolder && (
          <button
            onClick={() => setOpenFolder(null)}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white shadow text-primary font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 py-4">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={it.onClick}
              className="flex flex-col items-center gap-2 hover:scale-105 transition-transform"
            >
              <img
                src={it.icon}
                alt={it.title}
                loading="lazy"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-primary/30 shadow-lg bg-white object-cover"
              />
              <p className="text-xs sm:text-sm font-bold text-primary text-center leading-tight drop-shadow">
                {it.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
