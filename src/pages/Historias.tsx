import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CategoryOrbit from "@/components/CategoryOrbit";
import iconHistorias from "@/assets/icon-historias.png";

type Video = { key: string; title: string; src: string };

const videos: Record<string, Video[]> = {
  criacao: [
    { key: "a-criacao", title: "A Criação do Mundo", src: "/videos/a-criacao.mp4" },
    { key: "batalha-anjos", title: "A Batalha dos Anjos", src: "/videos/batalha-dos-anjos.mp4" },
  ],
  jesus: [],
  moises: [],
};

export default function Historias() {
  const [tab, setTab] = useState("criacao");
  const [playing, setPlaying] = useState<Video | null>(null);
  const [exploding, setExploding] = useState<Video | null>(null);

  const handleClick = (v: Video) => {
    setExploding(v);
    setTimeout(() => {
      setPlaying(v);
      setExploding(null);
    }, 400);
  };

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
        <video
          src={playing.src}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        >
          Seu navegador não suporta vídeo.
        </video>
      </div>
    );
  }

  const renderList = (cat: string) => {
    const list = videos[cat];
    if (!list?.length) {
      return (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 p-12 text-center">
          <p className="text-muted-foreground text-lg font-body">Em breve novos vídeos.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {list.map((v) => {
          const isExploding = exploding?.key === v.key;
          return (
            <button
              key={v.key}
              onClick={() => handleClick(v)}
              className={`group relative rounded-2xl overflow-hidden shadow-lg border-2 border-primary/30 bg-black w-36 sm:w-40 aspect-[2/3] hover:scale-105 transition-transform ${
                isExploding ? "fixed inset-0 w-full h-full z-50 rounded-none scale-100 transition-all duration-500 ease-out" : ""
              }`}
              style={isExploding ? { aspectRatio: "auto" } : undefined}
            >
              <video src={v.src} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" muted preload="metadata" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                  <span className="text-2xl ml-0.5">▶️</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-white font-display font-bold text-xs text-left leading-tight">{v.title}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="relative z-10">
        <PageHeader title="Histórias Bíblicas" subtitle="Escolha uma história" icon={iconHistorias} />
      </div>
      <div className="flex-1 flex flex-col items-center px-4 py-6">
        <CategoryOrbit
          activeKey={tab}
          onSelect={setTab}
          categories={[
            { key: "criacao", label: "A Criação", emoji: "🌍" },
            { key: "jesus", label: "Jesus", emoji: "✝️" },
            { key: "moises", label: "Moisés", emoji: "📜" },
          ]}
        />
        <div className="w-full max-w-3xl mt-6">{renderList(tab)}</div>
      </div>
    </div>
  );
}
