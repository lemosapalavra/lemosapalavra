import { useState, useRef, useMemo, useEffect } from "react";
import CoinBadge from "@/components/CoinBadge";
import { COINS } from "@/data/coinRewards";
import ActivityNav from "@/components/ActivityNav";
import WavyBanner from "@/components/WavyBanner";
import logoAsset from "@/assets/educacionais/logo.png.asset.json";
import edu1 from "@/assets/educacionais/educacional-1.jpg.asset.json";
import edu2 from "@/assets/educacionais/educacional-2.jpg.asset.json";
import edu3 from "@/assets/educacionais/educacional-3.jpg.asset.json";
import edu4 from "@/assets/educacionais/educacional-4.jpg.asset.json";
import edu5 from "@/assets/educacionais/educacional-5.jpg.asset.json";
import edu6 from "@/assets/educacionais/educacional-6.jpg.asset.json";
import edu7 from "@/assets/educacionais/educacional-7.jpg.asset.json";

type Celebrate = (msg: string, coins: number, emoji?: string) => void;

interface Props {
  onBack: () => void;
  celebrate: Celebrate;
  bgStyle: React.CSSProperties;
  initialActivity?: ActivityId;
}

export type ActivityId = "circles" | "connect" | "differences" | "count" | "paint" | "draw";

export const ACTIVITIES: { key: string; id: ActivityId; title: string; icon: string; image: string; coins: number; desc: string }[] = [
  { key: "circles-1", id: "circles", title: "Pinte os Círculos", icon: "🎨", image: edu1.url, coins: COINS.circles, desc: "Pinte cada círculo com a cor do seu número." },
  { key: "connect-1", id: "connect", title: "Ligue as Cores", icon: "🔗", image: edu2.url, coins: COINS.connect, desc: "Ligue os pontos seguindo a ordem dos números." },
  { key: "differences-1", id: "differences", title: "Ache os Diferentes", icon: "🔍", image: edu3.url, coins: COINS.differences, desc: "Encontre as figuras que estão diferentes em cada bloco." },
  { key: "count-1", id: "count", title: "Conte e Registre", icon: "🔢", image: edu4.url, coins: COINS.count, desc: "Conte quantas figuras de cada tipo existem." },
  { key: "paint-1", id: "paint", title: "Pinte por Números", icon: "🖍️", image: edu5.url, coins: COINS.paint, desc: "Escolha as cores certas e complete o desenho." },
  { key: "draw-1", id: "draw", title: "Desenhe e Trace", icon: "✏️", image: edu6.url, coins: COINS.draw, desc: "Desenhe livremente seguindo o modelo do dia." },
  { key: "circles-2", id: "circles", title: "Pinte os Círculos", icon: "🌈", image: edu7.url, coins: COINS.circles, desc: "Mais uma cartela colorida para alternar durante a semana." },
];

function dayOfYear(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function rotateActivities(list: typeof ACTIVITIES, size: number) {
  const offset = dayOfYear() % list.length;
  return Array.from({ length: size }, (_, i) => list[(offset + i) % list.length]);
}

export default function EducacionalActivities({ onBack, celebrate, bgStyle, initialActivity }: Props) {
  const [active, setActive] = useState<ActivityId | null>(initialActivity ?? null);
  const dailyActivities = useMemo(() => rotateActivities(ACTIVITIES, 5), []);

  if (active) {
    const meta = ACTIVITIES.find((a) => a.id === active)!;
    return (
      <ActivityRunner
        meta={meta}
        onBack={initialActivity ? onBack : () => setActive(null)}
        celebrate={celebrate}
        bgStyle={bgStyle}
      />
    );
  }

  return (
    <div className="min-h-screen px-4 py-6" style={bgStyle}>
      <div className="max-w-5xl mx-auto">
        <ActivityNav onBack={onBack} backLabel="Voltar às atividades" />

        <div className="flex flex-col items-center gap-2 mb-4">
          <img loading="lazy" decoding="async" src={logoAsset.url} alt="Atividades Educacionais" className="w-full max-w-md h-auto drop-shadow-2xl" />
          <p className="text-center font-body text-sm text-amber-900 italic">
            ✨ Todo dia aparecem <span className="font-bold">5 atividades educacionais</span>, alternando as demais nos outros dias.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 px-4 py-3 mb-4 shadow text-center">
          <p className="font-display font-extrabold text-amber-950 text-sm">🌤️ Atividades do dia</p>
          <p className="font-body text-xs text-amber-800/80 mt-1">Sempre 5 por dia para ficar mais leve e divertido.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {dailyActivities.map((a) => (
            <button
              key={a.key}
              onClick={() => setActive(a.id)}
              className="group relative bg-white rounded-2xl overflow-hidden border-2 border-amber-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition text-left"
            >
              <div className="aspect-[3/4] bg-amber-50 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-2.5 bg-gradient-to-br from-amber-50 to-yellow-50">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xl">{a.icon}</span>
                  <span className="font-display font-extrabold text-sm leading-tight text-amber-950">{a.title}</span>
                </div>
                <p className="text-[11px] text-amber-800/80 font-body leading-tight line-clamp-2 mb-1.5">{a.desc}</p>
                <CoinBadge amount={a.coins} size="xs" label="ao completar" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ ACTIVITY RUNNER (per-game UI) ============ */

function ActivityRunner({ meta, onBack, celebrate, bgStyle }:
  { meta: typeof ACTIVITIES[number]; onBack: () => void; celebrate: Celebrate; bgStyle: React.CSSProperties }) {
  const [done, setDone] = useState(false);

  const complete = () => {
    if (done) return;
    setDone(true);
    celebrate(`Atividade "${meta.title}" concluída!`, meta.coins, meta.icon);
  };

  return (
    <div className="min-h-screen px-4 py-6" style={bgStyle}>
      <div className="max-w-3xl mx-auto">
        <ActivityNav onBack={onBack} backLabel="Voltar às atividades educacionais" />

        <div className="rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-2 border-amber-300 px-4 py-3 mb-4 shadow flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display font-extrabold text-base sm:text-lg text-amber-950 truncate">
              {meta.icon} {meta.title}
            </h2>
            <p className="text-xs font-body text-amber-800/90">{meta.desc}</p>
          </div>
          <CoinBadge amount={meta.coins} size="md" label="ao completar" />
        </div>

        {meta.id === "circles" && (
          <WavyBanner
            emoji="🎨"
            lines={[
              "Pinte cada círculo com sua cor e seu número.",
              "Ao completar ganhará as moedinhas.",
            ]}
          />
        )}
        {meta.id === "connect" && (
          <WavyBanner
            emoji="🔗"
            lines={[
              "Ligue os pontos seguindo a ordem dos números.",
              "Ao completar a sequência, ganhará as moedinhas.",
            ]}
          />
        )}

        <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-3 sm:p-4">
          {meta.id === "circles" && <CirclesGame onComplete={complete} done={done} />}
          {meta.id === "connect" && <ConnectGame onComplete={complete} done={done} />}
          {meta.id === "differences" && <DifferencesGame onComplete={complete} done={done} />}
          {meta.id === "count" && <CountGame onComplete={complete} done={done} />}
          {meta.id === "paint" && <PaintNumbersGame onComplete={complete} done={done} image={meta.image} />}
          {meta.id === "draw" && <DrawGame onComplete={complete} done={done} image={meta.image} />}
        </div>

        {done && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 border-2 border-emerald-300 px-4 py-2 rounded-full font-display font-bold text-emerald-800">
              ✅ Parabéns! Você ganhou {meta.coins} 🪙
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====================================================
   1) CIRCLES — paint each numbered circle with its color
==================================================== */
const PALETTE = [
  { n: 1, color: "#fbbf24", name: "Amarelo" },
  { n: 2, color: "#fb923c", name: "Laranja" },
  { n: 3, color: "#22c55e", name: "Verde" },
  { n: 4, color: "#ef4444", name: "Vermelho" },
  { n: 5, color: "#8b5cf6", name: "Roxo" },
  { n: 6, color: "#ec4899", name: "Rosa" },
];

function CirclesGame({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  const circles = useMemo(() => {
    // 30 circles, random numbers 1..6, deterministic per day
    const seed = new Date().getDate();
    return Array.from({ length: 30 }, (_, i) => {
      const r = Math.abs(Math.sin(seed * 13 + i * 7)) * 1000;
      return { id: i, n: (Math.floor(r) % 6) + 1 };
    });
  }, []);
  const [chosen, setChosen] = useState<number>(1);
  const [painted, setPainted] = useState<Record<number, boolean>>({});
  const total = circles.length;
  const correct = Object.values(painted).filter(Boolean).length;

  useEffect(() => {
    if (!done && correct === total) onComplete();
  }, [correct, total, done, onComplete]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2 justify-center">
        {PALETTE.map((p) => (
          <button
            key={p.n}
            onClick={() => setChosen(p.n)}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-extrabold text-white text-lg shadow border-4 transition ${chosen === p.n ? "border-amber-900 scale-110" : "border-white"}`}
            style={{ background: p.color }}
            title={p.name}
          >
            {p.n}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mb-3">
        Escolha um número acima e toque nos círculos com o número correspondente.
      </p>
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3 justify-items-center">
        {circles.map((c) => {
          const isPainted = painted[c.id];
          const palette = PALETTE.find((p) => p.n === c.n)!;
          return (
            <button
              key={c.id}
              onClick={() => {
                if (chosen === c.n) setPainted((s) => ({ ...s, [c.id]: true }));
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-400 flex items-center justify-center font-display font-extrabold text-base shadow transition"
              style={{ background: isPainted ? palette.color : "white", color: isPainted ? "white" : "#0f172a" }}
            >
              {c.n}
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs font-bold text-amber-800 mt-3">{correct}/{total} pintados</p>
    </div>
  );
}

/* ====================================================
   2) CONNECT — sequence of circles by numbers
==================================================== */
function ConnectGame({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  const sequences = useMemo(() => [
    [4, 1, 2, 5, 3],
    [6, 2, 4, 1, 5],
    [1, 4, 2, 3, 6],
  ], []);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState<number[]>([]);
  const seq = sequences[active];
  const expected = seq[progress.length];

  useEffect(() => {
    if (progress.length === seq.length) {
      if (active < sequences.length - 1) {
        const t = setTimeout(() => { setActive((a) => a + 1); setProgress([]); }, 600);
        return () => clearTimeout(t);
      }
      if (!done) onComplete();
    }
  }, [progress, seq.length, active, sequences.length, done, onComplete]);

  return (
    <div>
      <p className="text-center font-display font-bold text-amber-900 mb-3">
        Sequência {active + 1} de {sequences.length} — toque na ordem: {seq.join(" → ")}
      </p>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-3">
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const palette = PALETTE.find((p) => p.n === n)!;
          const reached = progress.includes(n);
          return (
            <button
              key={n}
              onClick={() => {
                if (n === expected) setProgress((p) => [...p, n]);
                else { setProgress([]); }
              }}
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center font-display font-extrabold text-white text-xl shadow-lg border-4 transition ${reached ? "border-emerald-500 scale-105" : "border-white"}`}
              style={{ background: palette.color }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Progresso: {progress.join(" → ") || "—"} {progress.length === seq.length && "✅"}
      </p>
    </div>
  );
}

/* ====================================================
   3) DIFFERENCES — circle the odd one out in each row
==================================================== */
function DifferencesGame({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  // 3 rows × 5 items, the odd one in each row marked
  const rows = useMemo(() => [
    { items: ["😊","😊","😊","😊","😊","😊","😢","😊","😊","😊"], odd: 6 },
    { items: ["🏠","🏠","🏠","🏠","🏠","🏠","🏠","🏡","🏠","🏠"], odd: 7 },
    { items: ["🏐","🏐","🏐","⚽","🏐","🏐","🏐","🏐","🏐","🏐"], odd: 3 },
  ], []);
  const [found, setFound] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    if (!done && found.every(Boolean)) onComplete();
  }, [found, done, onComplete]);

  return (
    <div className="space-y-4">
      {rows.map((r, ri) => (
        <div key={ri} className="bg-amber-50/60 rounded-xl p-2 border border-amber-200">
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {r.items.map((emoji, i) => {
              const isOdd = i === r.odd;
              const isFound = found[ri] && isOdd;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (isOdd) setFound((f) => f.map((v, x) => (x === ri ? true : v)));
                  }}
                  className={`text-3xl sm:text-4xl aspect-square rounded-full border-2 ${isFound ? "border-emerald-500 bg-emerald-100 ring-4 ring-emerald-300" : "border-transparent hover:border-amber-300"}`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-center text-xs font-bold text-amber-800">
        {found.filter(Boolean).length}/{rows.length} blocos resolvidos
      </p>
    </div>
  );
}

/* ====================================================
   4) PAINT BY NUMBERS — show reference image
==================================================== */
function PaintNumbersGame({ onComplete, done, image }: { onComplete: () => void; done: boolean; image: string }) {
  // 10 numbered patches → assign each correct color
  const PATCHES = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i, n: ((i * 3) % 6) + 1,
  })), []);
  const COLORS = [
    { n: 1, color: "#ffffff", name: "Branco" },
    { n: 2, color: "#22c55e", name: "Verde" },
    { n: 3, color: "#ef4444", name: "Vermelho" },
    { n: 4, color: "#92400e", name: "Marrom" },
    { n: 5, color: "#facc15", name: "Amarelo" },
    { n: 6, color: "#3b82f6", name: "Azul" },
  ];
  const [chosen, setChosen] = useState(1);
  const [painted, setPainted] = useState<Record<number, string>>({});

  const correctCount = Object.entries(painted).filter(([id, c]) => {
    const patch = PATCHES.find((p) => p.id === +id)!;
    return COLORS.find((co) => co.n === patch.n)?.color === c;
  }).length;

  useEffect(() => {
    if (!done && correctCount === PATCHES.length) onComplete();
  }, [correctCount, PATCHES.length, done, onComplete]);

  return (
    <div className="grid sm:grid-cols-[1fr_auto] gap-4">
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {COLORS.map((c) => (
            <button
              key={c.n}
              onClick={() => setChosen(c.n)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full border-2 text-xs font-bold ${chosen === c.n ? "border-amber-900 scale-105" : "border-slate-300"}`}
            >
              <span className="w-5 h-5 rounded-full border border-slate-400" style={{ background: c.color }} />
              {c.n} · {c.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {PATCHES.map((p) => {
            const fill = painted[p.id] || "white";
            return (
              <button
                key={p.id}
                onClick={() => {
                  const colorObj = COLORS.find((c) => c.n === chosen)!;
                  setPainted((s) => ({ ...s, [p.id]: colorObj.color }));
                }}
                className="aspect-square rounded-lg border-2 border-slate-400 flex items-center justify-center font-display font-extrabold text-lg shadow"
                style={{ background: fill, color: fill === "#ffffff" || fill === "#facc15" ? "#0f172a" : "white" }}
              >
                {p.n}
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs font-bold text-amber-800 mt-2">{correctCount}/{PATCHES.length} corretos</p>
      </div>
      <div className="sm:w-48">
        <p className="text-[10px] font-bold uppercase text-amber-700 mb-1 text-center">Referência</p>
        <img loading="lazy" decoding="async" src={image} alt="Modelo" className="rounded-xl border-2 border-amber-300 shadow w-full object-contain" />
      </div>
    </div>
  );
}

/* ====================================================
   5) DRAW — free draw on a dotted canvas
==================================================== */
function DrawGame({ onComplete, done, image }: { onComplete: () => void; done: boolean; image: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [strokes, setStrokes] = useState(0);

  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d")!;
    ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.strokeStyle = "#0f172a";
    ctx.lineTo(e.clientX - r.left, e.clientY - r.top);
    ctx.stroke();
  };
  const end = () => { if (drawing.current) setStrokes((s) => s + 1); drawing.current = false; };
  const clear = () => {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setStrokes(0);
  };

  return (
    <div className="grid sm:grid-cols-[1fr_auto] gap-4">
      <div>
        <div
          className="relative w-full aspect-[4/3] bg-white rounded-xl border-2 border-amber-300 overflow-hidden"
          style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="absolute inset-0 w-full h-full touch-none"
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <button onClick={clear} className="text-xs font-bold bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-full">🧽 Limpar</button>
          <span className="text-xs font-bold text-amber-800">{strokes} traço(s)</span>
          <button
            disabled={done || strokes < 3}
            onClick={onComplete}
            className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1.5 rounded-full disabled:opacity-50 shadow"
          >
            ✓ Concluir
          </button>
        </div>
      </div>
      <div className="sm:w-48">
        <p className="text-[10px] font-bold uppercase text-amber-700 mb-1 text-center">Modelos</p>
        <img loading="lazy" decoding="async" src={image} alt="Modelos" className="rounded-xl border-2 border-amber-300 shadow w-full object-contain" />
      </div>
    </div>
  );
}

/* ====================================================
   6) COUNT — count shapes
==================================================== */
function CountGame({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  const SHAPES = [
    { key: "square", emoji: "🟩", label: "Quadrado verde", correct: 5 },
    { key: "tri",    emoji: "🔺", label: "Triângulo",     correct: 7 },
    { key: "circle", emoji: "⭕", label: "Círculo",       correct: 6 },
    { key: "rect",   emoji: "🟦", label: "Retângulo azul", correct: 6 },
  ];
  const [vals, setVals] = useState<Record<string, string>>({});
  const allCorrect = SHAPES.every((s) => +vals[s.key] === s.correct);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {SHAPES.map((s) => (
          <div key={s.key} className="bg-amber-50 rounded-xl p-3 border-2 border-amber-200 text-center">
            <div className="text-4xl mb-1">{s.emoji}</div>
            <div className="font-display font-bold text-xs text-amber-900 mb-2">{s.label}</div>
            <input
              type="number"
              min={0}
              max={20}
              inputMode="numeric"
              value={vals[s.key] ?? ""}
              onChange={(e) => setVals((v) => ({ ...v, [s.key]: e.target.value }))}
              className={`w-20 text-center font-display font-extrabold text-xl rounded-lg border-2 py-1 ${+vals[s.key] === s.correct ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-300"}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <button
          disabled={done || !allCorrect}
          onClick={onComplete}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-display font-bold px-6 py-2 rounded-full shadow disabled:opacity-50"
        >
          {allCorrect ? "✓ Conferir e Concluir" : "Preencha todas corretamente"}
        </button>
      </div>
    </div>
  );
}

/* ====================================================
   7) WORD SEARCH — find Olympic sport words
==================================================== */
const WS_WORDS = ["JUDO", "TENIS", "KARATE", "CICLISMO"];
const WS_GRID = [
  "BFGVNDERJUDOSWF",
  "ASDDASDFGHYUJUC",
  "SFSETENISERVTBV",
  "QQTYAAERWSCEDGG",
  "UWGFCDFEAZBXCHO",
  "EEHRAERTYOFOSJL",
  "TRJTOYSALTOCXKF",
  "ETMGASXCZRTDWEE",
  "QYKBERTGBHUSEMG",
  "KARATEFGHJKARKY",
  "SPCGEPLOCUDFRSU",
  "CICLISMOAQWERTI",
];

function WordSearchGame({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  const [found, setFound] = useState<string[]>([]);
  const [sel, setSel] = useState<{ r: number; c: number }[]>([]);

  const word = sel.map(({ r, c }) => WS_GRID[r][c]).join("");

  useEffect(() => {
    if (!sel.length) return;
    const upper = word.toUpperCase();
    if (WS_WORDS.includes(upper) && !found.includes(upper)) {
      setFound((f) => [...f, upper]);
      setSel([]);
    }
  }, [word, sel, found]);

  useEffect(() => {
    if (!done && found.length === WS_WORDS.length) onComplete();
  }, [found, done, onComplete]);

  const toggle = (r: number, c: number) => {
    setSel((s) => {
      const exists = s.find((p) => p.r === r && p.c === c);
      if (exists) return s.filter((p) => !(p.r === r && p.c === c));
      return [...s, { r, c }];
    });
  };

  return (
    <div>
      <p className="text-center text-xs text-muted-foreground mb-2">
        Toque nas letras para formar uma palavra. Encontre todas:
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {WS_WORDS.map((w) => (
          <span key={w} className={`px-2 py-1 rounded-full text-xs font-display font-bold ${found.includes(w) ? "bg-emerald-200 text-emerald-800 line-through" : "bg-slate-200 text-slate-800"}`}>
            {w}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="inline-grid mx-auto" style={{ gridTemplateColumns: `repeat(${WS_GRID[0].length}, minmax(0, 1fr))`, gap: 2 }}>
          {WS_GRID.flatMap((row, r) =>
            row.split("").map((ch, c) => {
              const selected = sel.some((p) => p.r === r && p.c === c);
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => toggle(r, c)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 text-xs font-mono font-bold border rounded ${selected ? "bg-amber-400 border-amber-700 text-amber-950" : "bg-white border-slate-300 hover:bg-amber-50"}`}
                >
                  {ch}
                </button>
              );
            })
          )}
        </div>
      </div>
      <p className="text-center text-xs font-bold text-amber-800 mt-3">
        Selecionado: <span className="font-mono">{word || "—"}</span> · Encontradas {found.length}/{WS_WORDS.length}
      </p>
    </div>
  );
}
