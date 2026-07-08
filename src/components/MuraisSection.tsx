import { useEffect, useState } from "react";
import { loadMurais, phraseOfTheDay, type MuraisConfig, type MuralDef } from "@/data/muraisConfig";

function MuralCard({ mural }: { mural: MuralDef }) {
  const phrase = phraseOfTheDay(mural);
  return (
    <figure className="relative w-full max-w-[280px] mx-auto">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
        <img
          src={mural.bgUrl}
          alt={mural.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Phrase area centered over the frame */}
        <div
          className="absolute flex items-center justify-center text-center"
          style={{
            top: mural.textArea.top,
            left: mural.textArea.left,
            right: mural.textArea.right,
            bottom: mural.textArea.bottom,
          }}
        >
          <p
            className="font-display font-bold leading-snug px-1 text-[13px] sm:text-[15px] md:text-[16px]"
            style={{
              color: mural.textColor,
              textShadow: mural.textShadow,
            }}
          >
            {phrase || "\u00A0"}
          </p>
        </div>
      </div>
      <figcaption className="mt-2 text-center font-display font-extrabold text-xs sm:text-sm text-amber-900 tracking-wide">
        {mural.title}
      </figcaption>
    </figure>
  );
}

export default function MuraisSection() {
  const [cfg, setCfg] = useState<MuraisConfig>(() => loadMurais());

  useEffect(() => {
    const h = () => setCfg(loadMurais());
    window.addEventListener("lemos_murais_change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("lemos_murais_change", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  return (
    <section className="w-full px-3 sm:px-6 py-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 place-items-center">
        <MuralCard mural={cfg.reflexao} />
        <MuralCard mural={cfg.motivacao} />
        <MuralCard mural={cfg.sabedoria} />
      </div>
    </section>
  );
}
