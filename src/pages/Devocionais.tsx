import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import DevotionalColoring from "@/components/DevotionalColoring";
import { devotionalImages } from "@/data/devotionalImages";
import { awardOnce, todayKey } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import iconDevocionais from "@/assets/home/icon-devocionais-upload.png.asset.json";

export default function Devocionais() {
  const today = new Date().getDate();
  const currentDay = today === 31 ? 1 : today;
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [showColoring, setShowColoring] = useState(false);
  const selected = devotionalImages[selectedDay - 1];
  if (!selected) return null;

  const selectDay = (day: number) => {
    setSelectedDay(day);
    setShowColoring(false);
    awardOnce(todayKey(`devocional:${day}`), COINS.devocional, "Devocional lido");
    window.setTimeout(() => document.getElementById("devocional-aberto")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  return (
    <main className="min-h-screen bg-background px-3 sm:px-5 pb-24">
      <div className="mx-auto max-w-7xl">
        <PageHeader title="Devocionais" icon={iconDevocionais.url} />
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground text-center mt-4">Devocionais diários</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-5">Veja a imagem de cada dia e escolha um devocional para abrir.</p>

        <section id="devocional-aberto" className="scroll-mt-24" aria-label={`Devocional do dia ${selectedDay}`}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="rounded-full bg-primary px-4 py-1.5 font-display font-bold text-sm text-primary-foreground">Dia {selectedDay}</span>
            {selectedDay === currentDay && <span className="font-body text-xs text-muted-foreground">Devocional de hoje</span>}
          </div>
          <img src={selected.reading} alt={`Leitura completa do devocional do dia ${selectedDay}`} className="mx-auto w-full max-w-4xl h-auto object-contain border border-border rounded-md bg-background shadow-sm" />
          <div className="text-center mt-4">
            <button type="button" className="btn-cartoon px-5 py-2" onClick={() => setShowColoring((value) => !value)}>
              {showColoring ? "Fechar pintura" : "Pintar o desenho"}
            </button>
          </div>
          {showColoring && (
            <section className="mt-6" aria-label={`Pintura do devocional do dia ${selectedDay}`}>
              <h2 className="font-display text-xl font-extrabold text-center text-foreground">Pintura do dia {selectedDay}</h2>
              <DevotionalColoring key={selectedDay} id={`dia-${selectedDay}`} image={selected.coloring} title={`Devocional do dia ${selectedDay}`} />
            </section>
          )}
        </section>

        <section className="mt-10 border-t border-border pt-7" aria-labelledby="todos-devocionais">
          <h2 id="todos-devocionais" className="font-display text-2xl font-extrabold text-center text-foreground mb-5">Todos os devocionais</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {devotionalImages.map((item, index) => {
              const day = index + 1;
              const active = day === selectedDay;
              return (
                <button key={day} type="button" onClick={() => selectDay(day)} aria-pressed={active} className={`overflow-hidden rounded-lg border-2 bg-background text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring ${active ? "border-primary" : "border-border"}`}>
                  <img src={item.reading} alt={`Devocional do dia ${day}`} loading="lazy" decoding="async" className="w-full aspect-[3/4] object-contain bg-background" />
                  <span className="block px-3 py-2 text-center font-display text-sm font-bold text-foreground">Dia {day}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
