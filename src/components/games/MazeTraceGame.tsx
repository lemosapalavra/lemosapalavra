import { useMemo, useRef, useState } from "react";
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

const sheets = [
  { id: "amor", title: "Amor", emoji: "❤️", size: 8 },
  { id: "alegria", title: "Alegria", emoji: "😀", size: 9 },
  { id: "paz", title: "Paz", emoji: "🕊️", size: 9 },
  { id: "paciencia", title: "Paciência", emoji: "⏳", size: 10 },
  { id: "bondade", title: "Bondade", emoji: "🎁", size: 10 },
  { id: "dominio", title: "Domínio Próprio", emoji: "🙏", size: 11 },
];

function rng(seed: number) {
  let s = seed || 7;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

type Cell = { n: boolean; s: boolean; e: boolean; w: boolean };

function buildMaze(size: number, seed: number) {
  const rand = rng(seed);
  const cells: Cell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ n: true, s: true, e: true, w: true }))
  );
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const stack: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const opts: [number, number, keyof Cell, keyof Cell][] = [];
    if (r > 0 && !visited[r - 1][c]) opts.push([r - 1, c, "n", "s"]);
    if (r < size - 1 && !visited[r + 1][c]) opts.push([r + 1, c, "s", "n"]);
    if (c > 0 && !visited[r][c - 1]) opts.push([r, c - 1, "w", "e"]);
    if (c < size - 1 && !visited[r][c + 1]) opts.push([r, c + 1, "e", "w"]);
    if (!opts.length) { stack.pop(); continue; }
    const [nr, nc, a, b] = opts[Math.floor(rand() * opts.length)];
    cells[r][c][a] = false;
    cells[nr][nc][b] = false;
    visited[nr][nc] = true;
    stack.push([nr, nc]);
  }

  // caminho correto (BFS) do início (0,0) até a chegada (size-1, size-1)
  const prev = new Map<string, string>();
  const q: string[] = ["0:0"];
  const seen = new Set(q);
  while (q.length) {
    const cur = q.shift()!;
    const [r, c] = cur.split(":").map(Number);
    const cell = cells[r][c];
    const nb: [number, number][] = [];
    if (!cell.n) nb.push([r - 1, c]);
    if (!cell.s) nb.push([r + 1, c]);
    if (!cell.w) nb.push([r, c - 1]);
    if (!cell.e) nb.push([r, c + 1]);
    for (const [nr, nc] of nb) {
      const k = `${nr}:${nc}`;
      if (seen.has(k)) continue;
      seen.add(k);
      prev.set(k, cur);
      q.push(k);
    }
  }
  const solution: string[] = [];
  let cur = `${size - 1}:${size - 1}`;
  while (cur) {
    solution.unshift(cur);
    if (cur === "0:0") break;
    cur = prev.get(cur)!;
  }
  return { cells, solution: new Set(solution) };
}

/** Labirinto traçável: arraste com o dedo ou o mouse — verde quando o caminho está certo. */
export default function MazeTraceGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: Props) {
  const daily = useMemo(() => {
    const start = new Date().getDate() % sheets.length;
    return Array.from({ length: 3 }, (_, k) => sheets[(start + k) % sheets.length]);
  }, []);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const sheet = daily[idx];
  const size = sheet.size;
  const { cells, solution } = useMemo(() => buildMaze(size, (idx + 1) * 3571 + size), [size, idx]);

  const [path, setPath] = useState<string[]>(["0:0"]);
  const dragging = useRef(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const UNIT = 100 / size;

  const finished = path[path.length - 1] === `${size - 1}:${size - 1}`;

  const reset = () => setPath(["0:0"]);

  const connected = (a: string, b: string) => {
    const [r1, c1] = a.split(":").map(Number);
    const [r2, c2] = b.split(":").map(Number);
    const cell = cells[r1][c1];
    if (r2 === r1 - 1 && c2 === c1) return !cell.n;
    if (r2 === r1 + 1 && c2 === c1) return !cell.s;
    if (c2 === c1 - 1 && r2 === r1) return !cell.w;
    if (c2 === c1 + 1 && r2 === r1) return !cell.e;
    return false;
  };

  const cellAt = (clientX: number, clientY: number) => {
    const el = svgRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const c = Math.floor(((clientX - rect.left) / rect.width) * size);
    const r = Math.floor(((clientY - rect.top) / rect.height) * size);
    if (r < 0 || c < 0 || r >= size || c >= size) return null;
    return `${r}:${c}`;
  };

  const extend = (key: string | null) => {
    if (!key) return;
    setPath((p) => {
      if (p[p.length - 1] === key) return p;
      if (p.length > 1 && p[p.length - 2] === key) return p.slice(0, -1); // voltar atrás
      if (p.includes(key)) return p;
      if (!connected(p[p.length - 1], key)) return p; // parede: não avança
      const next = [...p, key];
      if (key === `${size - 1}:${size - 1}` && !done.includes(sheet.id)) {
        setTimeout(() => {
          setDone((d) => (d.includes(sheet.id) ? d : [...d, sheet.id]));
          celebrate(`Você atravessou o labirinto da ${sheet.title}!`, COINS.maze, "🧭");
        }, 120);
      }
      return next;
    });
  };

  const wrongStep = path.some((k) => !solution.has(k));

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-xl mx-auto">
        <ActivityNav onBack={onBack} title="Labirinto" subtitle={sheet.title} />

        <div className="bg-white rounded-2xl border-2 border-primary/40 shadow p-2 sm:p-3">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="w-full h-auto touch-none select-none cursor-crosshair"
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as Element).setPointerCapture?.(e.pointerId);
              extend(cellAt(e.clientX, e.clientY));
            }}
            onPointerMove={(e) => { if (dragging.current) extend(cellAt(e.clientX, e.clientY)); }}
            onPointerUp={() => { dragging.current = false; }}
            onPointerLeave={() => { dragging.current = false; }}
          >
            <rect x="0" y="0" width="100" height="100" fill="#fffdf6" />
            {/* trilha percorrida */}
            {path.map((k, i) => {
              if (i === 0) return null;
              const [r1, c1] = path[i - 1].split(":").map(Number);
              const [r2, c2] = k.split(":").map(Number);
              const ok = solution.has(k) && solution.has(path[i - 1]);
              return (
                <line
                  key={k}
                  x1={c1 * UNIT + UNIT / 2} y1={r1 * UNIT + UNIT / 2}
                  x2={c2 * UNIT + UNIT / 2} y2={r2 * UNIT + UNIT / 2}
                  stroke={ok ? "#16a34a" : "#dc2626"}
                  strokeWidth={UNIT * 0.35}
                  strokeLinecap="round"
                />
              );
            })}
            {/* paredes */}
            {cells.map((row, r) =>
              row.map((cell, c) => {
                const x = c * UNIT, y = r * UNIT;
                const w = "#7c2d12";
                return (
                  <g key={`${r}:${c}`} stroke={w} strokeWidth={1.2} strokeLinecap="round">
                    {cell.n && <line x1={x} y1={y} x2={x + UNIT} y2={y} />}
                    {cell.s && <line x1={x} y1={y + UNIT} x2={x + UNIT} y2={y + UNIT} />}
                    {cell.w && <line x1={x} y1={y} x2={x} y2={y + UNIT} />}
                    {cell.e && <line x1={x + UNIT} y1={y} x2={x + UNIT} y2={y + UNIT} />}
                  </g>
                );
              })
            )}
            <text x={UNIT / 2} y={UNIT / 2 + UNIT * 0.15} fontSize={UNIT * 0.5} textAnchor="middle">🚩</text>
            <text x={100 - UNIT / 2} y={100 - UNIT / 2 + UNIT * 0.15} fontSize={UNIT * 0.5} textAnchor="middle">{sheet.emoji}</text>
          </svg>
        </div>

        <p className={`text-center font-display font-bold mt-3 ${finished ? "text-emerald-600" : wrongStep ? "text-red-600" : "text-muted-foreground"}`}>
          {finished ? "🎉 Você chegou!" : wrongStep ? "Esse trecho não leva à chegada — volte pelo caminho." : "Arraste do 🚩 até a chegada."}
        </p>

        <div className="flex gap-2 flex-wrap mt-4 justify-center">
          {daily.map((s, i) => (
            <button key={s.id} onClick={() => { setIdx(i); setPath(["0:0"]); }}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold transition ${idx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground hover:border-primary"}`}>
              {s.emoji} {s.title}{done.includes(s.id) ? " ✅" : ""}
            </button>
          ))}
          <button onClick={reset} className="px-3 py-1.5 rounded-full border border-border font-display text-xs font-bold hover:border-primary">🔄 Recomeçar</button>
          <button
            onClick={() => {
              const svg = svgRef.current;
              if (!svg) return;
              const data = new XMLSerializer().serializeToString(svg);
              saveToMural({ title: `Labirinto da ${sheet.title}`, image: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(data)))}`, activity: "Labirinto" });
              toast.success("Pregado no Meu Mural! 🖼️");
            }}
            className="px-3 py-1.5 rounded-full border border-border font-display text-xs font-bold hover:border-primary"
          >
            🖼️ Salvar no Meu Mural
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <CoinBadge amount={COINS.maze} size="md" label="ao concluir" />
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}
