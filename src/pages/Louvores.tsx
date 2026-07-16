import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PageHeader from "@/components/PageHeader";
import CoinBadge from "@/components/CoinBadge";
import iconLouvores from "@/assets/icon-louvores.png";
import iconLouvoresCat from "@/assets/icon-louvores-cat.png";
import iconPlaylists from "@/assets/icon-playlists.png";
import iconMusicais from "@/assets/icon-musicais.png";
import logoCentral from "@/assets/logo-central.png";
import espiritoSantoThumb from "@/assets/lemos-play/espirito-santo-i.png.asset.json";
import serFielThumb from "@/assets/lemos-play/ser-fiel-thumb.png.asset.json";
import gracaAleluiaThumb from "@/assets/lemos-play/graca-aleluia.png.asset.json";
import palavraEternaThumb from "@/assets/lemos-play/palavra-eterna.png.asset.json";
import fazMilagreThumb from "@/assets/lemos-play/faz-um-milagre-em-mim.png.asset.json";
import espiritoSantoVid from "@/assets/lemos-play/espirito-santo.mp4.asset.json";
import aleluiaVid from "@/assets/lemos-play/aleluia.mp4.asset.json";
import palavraEternaVid from "@/assets/lemos-play/palavra-eterna.mp4.asset.json";
import souFielVid from "@/assets/lemos-play/sou-fiel.mp4.asset.json";
import fazMilagreVid from "@/assets/lemos-play/faz-um-milagre-em-mim.mp4.asset.json";

interface Louvor {
  title: string;
  src: string;
  thumb: string;
}

const allLouvores: Louvor[] = [
  { title: "Faz um Milagre em Mim", src: fazMilagreVid.url, thumb: fazMilagreThumb.url },
  
  { title: "Sou Fiel", src: souFielVid.url, thumb: serFielThumb.url },
  { title: "Graça Aleluia", src: aleluiaVid.url, thumb: gracaAleluiaThumb.url },
  { title: "Palavra Eterna", src: palavraEternaVid.url, thumb: palavraEternaThumb.url },
];
// Esconde os louvores cujo link está quebrado
const louvores: Louvor[] = allLouvores.filter((l) => !!l.src);


type Tab = "louvores" | "playlists" | "musicais";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "louvores", label: "Louvores", icon: iconLouvoresCat },
  { id: "playlists", label: "Playlists", icon: iconPlaylists },
  { id: "musicais", label: "Musicais", icon: iconMusicais },
];

export default function Louvores() {
  const [playing, setPlaying] = useState<Louvor | null>(null);
  const [tab, setTab] = useState<Tab>("louvores");

  const playerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (playing && playerRef.current) {
      const el = playerRef.current as any;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      req?.call(el).catch(() => {});
    }
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, [playing]);

  if (playing) {
    return (
      <div ref={playerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in zoom-in duration-300">
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




  const renderItem = (l: Louvor, i: number) => (
    <button
      key={i}
      onClick={() => setPlaying(l)}
      className="flex flex-col items-center gap-2 hover:scale-105 transition-transform group"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg bg-black">
        <img src={l.thumb} alt={l.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>
      <p className="text-xs sm:text-sm font-bold text-primary text-center leading-tight drop-shadow max-w-[120px]">
        {l.title}
      </p>
      <CoinBadge amount={3} size="xs" />
    </button>
  );

  const mid = Math.ceil(louvores.length / 2);

  return (
    <div className="min-h-screen py-4 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Músicas" subtitle="Escolha uma categoria" icon={iconLouvores} />

        {/* Top category icons */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 my-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-2 transition-transform hover:scale-110 ${
                tab === t.id ? "scale-110" : "opacity-70"
              }`}
            >
              <img
                src={t.icon}
                alt={t.label}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 shadow-xl bg-white object-cover ${
                  tab === t.id ? "border-primary" : "border-primary/30"
                }`}
              />
              <span className="font-display font-bold text-sm sm:text-base text-primary">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "louvores" && (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8 py-4">
            <div className="flex flex-col items-center gap-5 sm:gap-6">
              {louvores.slice(0, mid).map(renderItem)}
            </div>
            <img src={logoCentral} alt="Lemos a Palavra" className="w-32 sm:w-48 md:w-56 drop-shadow-xl" />
            <div className="flex flex-col items-center gap-5 sm:gap-6">
              {louvores.slice(mid).map(renderItem)}
            </div>
          </div>
        )}

        {tab === "playlists" && (
          <div className="text-center py-12">
            <img src={iconPlaylists} alt="Playlists" className="w-32 h-32 mx-auto mb-4 rounded-full shadow-xl" />
            <p className="font-display text-2xl font-bold text-primary">Playlists Temáticas</p>
            <p className="font-body text-foreground/80 mt-2">Em breve: playlists para cada momento da sua jornada de fé.</p>
          </div>
        )}

        {tab === "musicais" && (
          <div className="text-center py-12">
            <img src={iconMusicais} alt="Musicais" className="w-32 h-32 mx-auto mb-4 rounded-full shadow-xl" />
            <p className="font-display text-2xl font-bold text-primary">Musicais</p>
            <p className="font-body text-foreground/80 mt-2">Em breve: musicais bíblicos para toda a família.</p>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-6 mb-2 rounded-[24px] border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-pink-50 p-5 shadow-md text-center">
          <p className="font-display text-base font-bold text-amber-900 mb-1">
            📖 Histórias bíblicas para crianças
          </p>
          <p className="font-body text-sm text-amber-800 mb-3">
            Aprofunde a fé da criançada com narrativas bíblicas divertidas e edificantes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/historias-biblicas"
              className="inline-block rounded-full bg-white/80 border border-amber-200 px-4 py-2 font-display text-sm font-extrabold text-primary hover:underline shadow-sm"
            >
              história bíblica infantil
            </Link>
            <Link
              to="/historias-biblicas"
              className="inline-block rounded-full bg-white/80 border border-amber-200 px-4 py-2 font-display text-sm font-extrabold text-primary hover:underline shadow-sm"
            >
              contos bíblicos infantis
            </Link>
          </div>
        </div>

        <div className="text-center mt-6 space-y-2 max-w-2xl mx-auto">
          <p className="font-display text-2xl font-bold text-primary">Convido você!</p>
          <p className="font-body text-sm text-foreground">A acompanhar e compartilhar este projeto, assim você se torna parte desta missão.</p>
          <p className="font-display text-base italic text-primary">"Porque a Palavra de Deus é viva e eficaz." (Hebreus 4:12)</p>
          <p className="font-display text-lg font-bold text-foreground">Acreditem! Tenham fé na Palavra.</p>
        </div>

        <div className="max-w-2xl mx-auto mt-6 mb-2 rounded-[24px] border-2 border-sky-200 bg-gradient-to-r from-sky-50 to-amber-50 p-5 shadow-md text-center">
          <p className="font-display text-base font-bold text-amber-900 mb-1">
            📖 Quer conhecer mais da Bíblia?
          </p>
          <p className="font-body text-sm text-amber-800 mb-3">
            Descubra histórias bíblicas narradas para toda a família.
          </p>
          <Link
            to="/historias-biblicas"
            className="inline-block font-display text-sm font-extrabold text-primary hover:underline"
          >
            história bíblica infantil →
          </Link>
        </div>

        <div className="max-w-2xl mx-auto mt-4 mb-2 rounded-[24px] border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-amber-50 p-5 shadow-md text-center">
          <p className="font-display text-base font-bold text-amber-900 mb-1">
            🌟 Explore a Bíblia com as crianças
          </p>
          <p className="font-body text-sm text-amber-800 mb-3">
            Narrativas bíblicas ilustradas e contadas para toda a família.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/historias-biblicas"
              className="inline-block rounded-full bg-white/80 border border-pink-200 px-4 py-2 font-display text-sm font-extrabold text-primary hover:underline shadow-sm"
            >
              histórias bíblicas para crianças
            </Link>
            <Link
              to="/historias-biblicas"
              className="inline-block rounded-full bg-white/80 border border-pink-200 px-4 py-2 font-display text-sm font-extrabold text-primary hover:underline shadow-sm"
            >
              narrativas bíblicas para crianças
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
