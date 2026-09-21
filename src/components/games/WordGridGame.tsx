import { useMemo, useState } from "react";
import { toast } from "sonner";
import ActivityNav from "@/components/ActivityNav";
import CelebrationAnimation from "@/components/CelebrationAnimation";
import CoinBadge from "@/components/CoinBadge";
import { COINS } from "@/data/coinRewards";
import { saveToMural } from "@/lib/mural";

type Props = {
  onBack: () => void;
  celebrate: (m: string, c: number, e?: string) => void;
  celebration: { show: boolean; message: string; coins: number; emoji: string };
  closeCelebration: () => void;
  bgStyle: React.CSSProperties;
};

const puzzles = [
  { id: "frutos", title: "Frutos do Espírito", words: ["AMOR", "ALEGRIA", "PAZ", "BONDADE", "FE", "MANSIDAO"] },
  { id: "profetas", title: "Profetas e Servos", words: ["DANIEL", "ISAIAS", "SANSAO", "SAMUEL", "RUTE", "GIDEAO"] },
  { id: "personagens", title: "Personagens da Bíblia", words: ["ABRAAO", "MOISES", "ESTER", "DAVI", "PAULO", "MARIA"] },
  { id: "simbolos", title: "Símbolos da Fé", words: ["CRUZ", "BIBLIA", "PAO", "VINHO", "ARCA", "PEIXE"] },
];

const SIZE = 12;
const LETTERS = "ABCDEFGHIJLMNOPRSTUVZ";
const DIRS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [-1, 1],
];

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

type Placed = { word: string; cells: string[] };

function buildGrid(words: string[], seed: number) {
  const rand = rng(seed);
  const grid: (string | null)[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  const placed: Placed[] = [];

  words.forEach((word) => {
    for (let attempt = 0; attempt < 400; attempt++) {
      const [dx, dy] = DIRS[Math.floor(rand() * DIRS.length)];
      const r = Math.floor(rand() * SIZE);
      const c = Math.floor(rand() * SIZE);
      const endR = r + dy * (word.length - 1);
      const endC = c + dx * (word.length - 1);
      if (endR < 0 || endR >= SIZE || endC < 0 || endC >= SIZE) continue;
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const cur = grid[r + dy * i][c + dx * i];
        if (cur && cur !== word[i]) { ok = false; break; }
      }
      if (!ok) continue;
      const cells: string[] = [];
      for (let i = 0; i < word.length; i++) {
        grid[r + dy * i][c + dx * i] = word[i];
        cells.push(`${r + dy * i}:${c + dx * i}`);
      }
      placed.push({ word, cells });
      break;
    }
  });

  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!grid[r][c]) grid[r][c] = LETTERS[Math.floor(rand() * LETTERS.length)];

  return { grid: grid as string[][], placed };
}

/** Gera uma imagem do quadro (para pregar no Meu Mural). */
function gridToImage(grid: string[][], foundCells: Set<string>): string {
  const cell = 40;
  const c = document.createElement("canvas");
  c.width = SIZE * cell;
  c.height = SIZE * cell;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let r = 0; r < SIZE; r++) {
    for (let col = 0; col < SIZE; col++) {
      const ok = foundCells.has(`${r}:${col}`);
      ctx.fillStyle = ok ? "#10b981" : "#ffffff";
      ctx.fillRect(col * cell + 2, r * cell + 2, cell - 4, cell - 4);
      ctx.strokeStyle = "#fcd34d";
      ctx.strokeRect(col * cell + 2, r * cell + 2, cell - 4, cell - 4);
      ctx.fillStyle = ok ? "#ffffff" : "#78350f";
      ctx.fillText(grid[r][col], col * cell + cell / 2, r * cell + cell / 2);
    }
  }
  return c.toDataURL("image/png");
}

/** Caça-palavras clicável: o usuário clica letra a letra para formar a palavra. */
export default function WordGridGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: Props) {
  const [idx, setIdx] = useState(() => new Date().getDate() % puzzles.length);
  const puzzle = puzzles[idx];
  const { grid, placed } = useMemo(() => buildGrid(puzzle.words, idx * 7919 + 13), [puzzle, idx]);

  const [sel, setSel] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);

  const reset = (i: number) => { setIdx(i); setSel([]); setFound([]); setHint(null); };

  const foundCells = useMemo(() => {
    const s = new Set<string>();
    placed.filter((p) => found.includes(p.word)).forEach((p) => p.cells.forEach((c) => s.add(c)));
    return s;
  }, [placed, found]);

  const hintCells = useMemo(() => {
    const p = placed.find((x) => x.word === hint);
    return new Set(p ? p.cells : []);
  }, [placed, hint]);

  const complete = found.length === placed.length;

  const clickCell = (key: string) => {
    if (foundCells.has(key)) return;
    const next = sel.includes(key) ? sel.filter((k) => k !== key) : [...sel, key];
    setSel(next);
    const letters = next.map((k) => {
      const [r, c] = k.split(":").map(Number);
      return grid[r][c];
    }).join("");
    const match = placed.find((p) => p.word === letters && !found.includes(p.word));
    if (match) {
      const sameCells = match.cells.slice().sort().join("|") === next.slice().sort().join("|");
      if (sameCells) {
        const nf = [...found, match.word];
        setFound(nf);
        setSel([]);
        toast.success(`Você achou ${match.word}! 🔤`);
        if (nf.length === placed.length) {
          setTimeout(() => celebrate(`Você achou todas as palavras de ${puzzle.title}!`, COINS.crossword, "🔤"), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <ActivityNav onBack={onBack} title="Cruzadinha Bíblica" subtitle={puzzle.title} />

        <div className="bg-white rounded-2xl border-2 border-primary/40 shadow p-2 sm:p-3 overflow-x-auto">
          <div className="mx-auto" style={{ width: "fit-content" }}>
            {grid.map((row, r) => (
              <div key={r} className="flex">
                {row.map((ch, c) => {
                  const key = `${r}:${c}`;
                  const isFound = foundCells.has(key);
                  const isSel = sel.includes(key);
                  const isHint = hintCells.has(key);
                  return (
                    <button
                      key={c}
                      onClick={() => clickCell(key)}
                      title={isFound ? "Palavra encontrada" : "Clique para formar a palavra"}
                      className={`m-[1px] w-6 h-6 sm:w-8 sm:h-8 rounded-md font-display font-extrabold text-[11px] sm:text-sm border-2 transition
                        ${isFound ? "bg-emerald-500 text-white border-emerald-600"
                          : isSel ? "bg-amber-400 text-amber-950 border-amber-600"
                          : isHint ? "bg-sky-200 text-sky-900 border-sky-500 animate-pulse"
                          : "bg-white text-amber-900 border-amber-200 hover:border-primary"}`}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] font-body text-amber-800 mt-2">
          Clique em cada letra, na ordem, para formar a palavra da lista.
        </p>

        <div className="mt-4 grid gap-2">
          {placed.map((p) => {
            const ok = found.includes(p.word);
            return (
              <div key={p.word} className="flex items-center justify-between gap-2 bg-popover rounded-xl border border-border px-3 py-2">
                <span className={`font-display font-extrabold text-sm ${ok ? "text-emerald-600 line-through" : "text-foreground"}`}>
                  {ok ? "✅ " : "🔎 "}{p.word}
                </span>
                <button
                  onClick={() => { setHint(p.word); setTimeout(() => setHint((h) => (h === p.word ? null : h)), 2600); }}
                  className="px-3 py-1.5 rounded-full border border-border font-display text-[11px] font-bold hover:border-primary"
                  title="Mostrar onde está no quadro"
                >
                  👀 Mostrar no quadro
                </button>
              </div>
            );
          })}
        </div>

        <p className={`text-center font-display font-bold mt-3 ${complete ? "text-emerald-600" : "text-muted-foreground"}`}>
          {complete ? "🎉 Perfeito! Você encontrou todas!" : `${found.length} de ${placed.length} palavras encontradas`}
        </p>

        <div className="flex gap-2 flex-wrap mt-4 justify-center">
          {puzzles.map((p, i) => (
            <button key={p.id} onClick={() => reset(i)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold transition ${idx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground hover:border-primary"}`}>
              {p.title}
            </button>
          ))}
          <button onClick={() => setSel([])} className="px-3 py-1.5 rounded-full border border-border font-display text-xs font-bold hover:border-primary">🔄 Limpar seleção</button>
          <button
            onClick={() => {
              saveToMural({ title: `Caça-palavras: ${puzzle.title}`, image: gridToImage(grid, foundCells), activity: "Cruzadinha Bíblica" });
              toast.success("Pregado no Meu Mural! 🖼️");
            }}
            className="px-3 py-1.5 rounded-full border border-border font-display text-xs font-bold hover:border-primary"
          >
            🖼️ Salvar no Meu Mural
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <CoinBadge amount={COINS.crossword} size="md" label="ao concluir" />
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}
