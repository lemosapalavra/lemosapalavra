import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen, Home } from "lucide-react";

const TOTAL = 51;
const base = "/aprenda/50-parabolas-pequeno-moises";
const pageFile = (index: number) => index === 0 ? "00_Capa.pdf" : `${String(index).padStart(2, "0")}_Parabola.pdf`;

/** Leitor independente: uma folha PDF por vez, sem alterar o conteúdo original. */
export default function ParabolasPequenoMoises() {
  const [index, setIndex] = useState(0);
  const [missing, setMissing] = useState(false);
  const file = `${base}/${pageFile(index)}`;
  const go = (next: number) => { setMissing(false); setIndex(Math.max(0, Math.min(TOTAL - 1, next))); };
  return (
    <main className="min-h-screen px-3 pb-16 pt-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link to="/aprenda" className="inline-flex items-center gap-2 rounded-xl bg-secondary/20 px-4 py-2 font-bold"><Home size={18}/> APRENDA</Link>
          <h1 className="flex items-center gap-2 text-center font-display text-lg font-bold"><BookOpen size={20}/> 50 Parábolas do Pequeno Moisés</h1>
          <span className="font-semibold" aria-live="polite">{index === 0 ? "Capa" : `Parábola ${index} de 50`}</span>
        </div>
        <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-xl border bg-white shadow-lg" style={{ aspectRatio: "2 / 3" }}>
          {missing ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-amber-900">
              <BookOpen size={44}/>
              <p className="font-bold">Esta folha ainda não foi enviada ao site.</p>
              <p className="text-sm">Arquivo esperado: {pageFile(index)}. Envie os 51 PDFs individuais para public/aprenda/50-parabolas-pequeno-moises/.</p>
            </div>
          ) : (
            <object key={file} data={file + "#toolbar=0&navpanes=0"} type="application/pdf" className="h-full w-full" aria-label={index === 0 ? "Capa do livro" : `Parábola ${index}`}>
              <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                <p>Seu navegador não consegue mostrar esta página PDF.</p>
                <a href={file} target="_blank" rel="noreferrer" className="underline">Abrir folha separadamente</a>
              </div>
            </object>
          )}
        </div>
        <div className="mx-auto mt-5 flex max-w-[560px] items-center justify-between gap-3">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="inline-flex items-center gap-2 rounded-xl bg-secondary/20 px-4 py-3 font-bold disabled:opacity-40"><ChevronLeft/> Anterior</button>
          <span className="text-sm font-semibold">{index + 1} / {TOTAL}</span>
          <button type="button" onClick={() => go(index + 1)} disabled={index === TOTAL - 1} className="inline-flex items-center gap-2 rounded-xl bg-secondary/20 px-4 py-3 font-bold disabled:opacity-40">Próxima <ChevronRight/></button>
        </div>
      </div>
    </main>
  );
}
