import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIconVisible } from "@/lib/iconVisibility";
import DedicatoriaModal from "@/components/DedicatoriaModal";
import InstallShortcut from "@/components/InstallShortcut";

const homeIcons = [
  { label: "Veja", src: "/veja-flutuante.webp", route: "/lemosplay", x: 50, y: 41 },
  { label: "Ouça", src: "/ouca-flutuante.webp", route: "/musicas", x: 22, y: 53 },
  { label: "Aprenda", src: "/aprenda-flutuante.webp", route: "/atividades", x: 78, y: 53 },
  { label: "Álbum", src: "/album-flutuante.webp", route: "/album", x: 50, y: 65 },
] as const;

export default function Index() {
  const navigate = useNavigate();
  const [dedicatoriaOpen, setDedicatoriaOpen] = useState(false);
  const dedicatoryVisible = useIconVisible("dedicatoria");

  return (
    <main className="lemos-home-viewport" style={{ position: "relative", isolation: "isolate", width: "100%", height: "100dvh", overflow: "hidden", backgroundColor: "#8bc8eb" }}>
      {/* Único fundo da página. Nenhuma outra imagem de cenário é montada. */}
      <img src="/pagina-inicial-nova.webp" alt="" aria-hidden="true" draggable={false}
        style={{ position: "absolute", inset: 0, zIndex: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      <h1 className="sr-only">Lemos a Palavra — página inicial</h1>
      <div className="absolute left-1 top-1 z-[80]"><InstallShortcut headerTile /></div>

      {/* Botões verdadeiros, separados da imagem e acima do fundo. */}
      <section aria-label="Escolha sua atividade" style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none" }}>
        {homeIcons.map(({ label, src, route, x, y }, index) => (
          <button key={label} type="button" onClick={() => navigate(route)}
            aria-label={`Abrir ${label}`} title={`Abrir ${label}`}
            className="lemos-home-orbit-button"
            style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", width: "clamp(76px, 25vw, 125px)", height: "clamp(76px, 25vw, 125px)", padding: 0, border: 0, borderRadius: "50%", background: "transparent", cursor: "pointer", pointerEvents: "auto", touchAction: "manipulation" }}>
            <img src={src} alt={label} draggable={false} loading="eager" className="lemos-home-orbit-image"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", filter: "drop-shadow(0 0 15px rgba(255,210,55,.95))", animationDelay: `${index * -.7}s` }} />
          </button>
        ))}
      </section>

      {dedicatoryVisible && (
        <button type="button" onClick={() => setDedicatoriaOpen(true)} aria-label="Abrir Dedicatória" title="Dedicatória"
          className="lemos-home-dedication transition-transform duration-200 hover:scale-110 active:scale-95"
          style={{ position: "absolute", right: 8, bottom: "calc(86px + env(safe-area-inset-bottom, 0px))", zIndex: 90, width: 84, height: 84, padding: 0, background: "transparent", border: 0, cursor: "pointer", filter: "drop-shadow(0 0 15px #ffdb58) drop-shadow(0 0 7px #fff2a3)" }}>
          <img src="/dedicatoria.webp" alt="Dedicatória" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </button>
      )}
      <DedicatoriaModal open={dedicatoriaOpen} onOpenChange={setDedicatoriaOpen} />
      <style>{`
        @keyframes lemosHomeFloat { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
        .lemos-home-orbit-image { animation: lemosHomeFloat 3.6s ease-in-out infinite; }
        .lemos-home-orbit-button:hover .lemos-home-orbit-image, .lemos-home-orbit-button:focus-visible .lemos-home-orbit-image { filter: drop-shadow(0 0 25px #ffe16c) brightness(1.25) !important; }
        .lemos-home-orbit-button:active { scale: 1.08; }
        @media (min-width: 700px) { .lemos-home-orbit-button { width: 135px !important; height: 135px !important; } }
        @media (prefers-reduced-motion: reduce) { .lemos-home-orbit-image { animation: none; } }
      `}</style>
    </main>
  );
}
