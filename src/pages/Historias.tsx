import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import iconHistorias from "@/assets/icon-historias.png";

type Video = { key: string; title: string; src: string };

const videos: Record<string, Video[]> = {
  criacao: [{ key: "a-criacao", title: "A Criação do Mundo", src: "/videos/a-criacao.mp4" }],
  jesus: [],
  moises: [],
};

export default function Historias() {
  const [tab, setTab] = useState("criacao");
  const [playing, setPlaying] = useState<Video | null>(null);

  if (playing) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
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
      <div className="grid sm:grid-cols-2 gap-4">
        {list.map((v) => (
          <button
            key={v.key}
            onClick={() => setPlaying(v)}
            className="group relative rounded-2xl overflow-hidden shadow-xl border-2 border-primary/30 bg-black aspect-video hover:scale-[1.02] transition"
          >
            <video src={v.src} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" muted />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
                <span className="text-3xl ml-1">▶️</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-display font-bold text-left">{v.title}</p>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="relative z-10">
        <PageHeader title="Histórias Bíblicas" subtitle="Escolha uma história" icon={iconHistorias} />
      </div>
      <div className="flex-1 flex flex-col items-center px-4 py-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="criacao">A Criação</TabsTrigger>
            <TabsTrigger value="jesus">Jesus</TabsTrigger>
            <TabsTrigger value="moises">Moisés</TabsTrigger>
          </TabsList>
          <TabsContent value="criacao" className="mt-6">{renderList("criacao")}</TabsContent>
          <TabsContent value="jesus" className="mt-6">{renderList("jesus")}</TabsContent>
          <TabsContent value="moises" className="mt-6">{renderList("moises")}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
