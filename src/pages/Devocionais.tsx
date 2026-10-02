import { useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import DevotionalColoring from "@/components/DevotionalColoring";
import { devotionalImages } from "@/data/devotionalImages";
import { awardOnce, todayKey } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import iconDevocionais from "@/assets/home/icon-devocionais-upload.png.asset.json";

export default function Devocionais() {
  const today = new Date().getDate();
  const currentDay = today === 31 ? 1 : today;
  const selected = devotionalImages[currentDay - 1];
  if (!selected) return null;

  useEffect(() => {
    awardOnce(todayKey(`devocional:${currentDay}`), COINS.devocional, "Devocional lido");
  }, [currentDay]);

  return (
    <main className="min-h-screen bg-background px-3 sm:px-5 pb-24">
      <div className="mx-auto max-w-7xl">
        <PageHeader title="Devocionais" icon={iconDevocionais.url} />
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground text-center mt-4">Devocional de hoje</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-5">A cada dia, uma nova leitura e uma nova pintura.</p>

        <section className="scroll-mt-24" aria-label={`Devocional do dia ${currentDay}`}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="rounded-full bg-primary px-4 py-1.5 font-display font-bold text-sm text-primary-foreground">Dia {currentDay}</span>
          </div>
          <img src={selected.reading} alt={`Leitura completa do devocional do dia ${currentDay}`} className="mx-auto w-full max-w-4xl h-auto object-contain border border-border rounded-md bg-background shadow-sm" />
          <section className="mt-6" aria-label={`Pintura do devocional do dia ${currentDay}`}>
            <h2 className="font-display text-xl font-extrabold text-center text-foreground">Pinte o desenho de hoje</h2>
            <DevotionalColoring id={`dia-${currentDay}`} image={selected.coloring} title={`Devocional do dia ${currentDay}`} />
          </section>
        </section>
      </div>
    </main>
  );
}
