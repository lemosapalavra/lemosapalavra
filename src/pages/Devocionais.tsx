import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import DevotionalColoring from "@/components/DevotionalColoring";
import { devotionalImages } from "@/data/devotionalImages";
import { awardOnce, todayKey } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import iconDevocionais from "@/assets/home/icon-devocionais-upload.png.asset.json";

export default function Devocionais() {
  const today = new Date().getDate();
  // O anexo contém os dias 1–30; em meses de 31 dias a leitura recomeça no dia 1.
  const day = today === 31 ? 1 : today;
  const page = devotionalImages[day - 1];
  const [showColoring, setShowColoring] = useState(false);
  if (!page) return null;

  const open = () => {
    awardOnce(todayKey(`devocional:${day}`), COINS.devocional, "Devocional lido");
    setShowColoring(true);
  };
  return (
    <main className="min-h-screen bg-background px-4 pb-24">
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Devocionais" icon={iconDevocionais.url} />
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground text-center mt-4">Devocional do dia {day}</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-5">Uma leitura e um desenho para cada dia.</p>
        <img src={page.reading} alt={`Leitura completa do devocional do dia ${day}`} className="mx-auto w-full max-w-2xl h-auto object-contain border border-border rounded-md bg-background" />
        {!showColoring ? (
          <div className="text-center mt-5"><button type="button" className="btn-cartoon px-5 py-2" onClick={open}>Pintar o desenho</button></div>
        ) : (
          <section className="mt-7" aria-label={`Pintura do devocional do dia ${day}`}>
            <h2 className="font-display text-xl font-extrabold text-center text-foreground">Pintura do dia {day}</h2>
            <DevotionalColoring key={day} id={`dia-${day}`} image={page.coloring} title={`Devocional do dia ${day}`} />
          </section>
        )}
      </div>
    </main>
  );
}
