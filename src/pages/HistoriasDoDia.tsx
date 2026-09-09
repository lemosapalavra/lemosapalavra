import { useEffect, useRef, useState } from "react";
import PageHeader from "@/components/PageHeader";
import CoinBadge from "@/components/CoinBadge";
import { awardOnce, todayKey } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import { historiasDoDia, type HistoriaBiblica } from "@/data/historiasBiblicas";
import iconHistoriasDia from "@/assets/historias/icone-historias.png.asset.json";

const HIST_COINS = COINS.devocional;

const PALETTE = [
  "#e11d48", "#f97316", "#facc15", "#22c55e", "#0ea5e9", "#6366f1",
  "#a855f7", "#ec4899", "#78350f", "#f5d0a9", "#111827", "#94a3b8",
];

function ColoringCanvas({ historia }: { historia: HistoriaBiblica }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(PALETTE[3]);
  const [size, setSize] = useState(14);
  const [eraser, setEraser] = useState(false);
  const drawing = useRef(false);
  const storageKey = `lemos_pintura_hist_${historia.id}`;

  // Restaura a pintura salva
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
      img.src = saved;
    }
  }, [storageKey]);

  const save = () => {
    const c = canvasRef.current;
    if (!c) return;
    try { localStorage.setItem(storageKey, c.toDataURL("image/png")); } catch { /* espaço cheio */ }
  };

  const pos = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };

  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    draw(e);
  };
  const draw = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const { x, y } = pos(e);
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    save();
  };

  return (
    <div className="mt-4">
      <p className="font-body text-xs text-amber-800 mb-2 text-center">
        🎨 Pinte com calma! O desenho é bem detalhado — sua pintura fica <strong>salva</strong> e você pode voltar
        e continuar de onde parou quando quiser.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        {PALETTE.map((c) => (
          <button
            key={c}
            title={`Pintar com esta cor`}
            onClick={() => { setColor(c); setEraser(false); }}
            className={`w-8 h-8 rounded-full border-2 shadow ${color === c && !eraser ? "border-amber-900 scale-110" : "border-white"}`}
            style={{ background: c }}
          />
        ))}
        <button
          onClick={() => setEraser((v) => !v)}
          title="Apagar"
          className={`px-3 h-8 rounded-full font-display text-xs font-extrabold border-2 shadow ${eraser ? "bg-amber-900 text-white border-amber-900" : "bg-white text-amber-900 border-amber-300"}`}
        >
          🧽 Apagar
        </button>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          title="Tamanho do pincel"
          className="h-8 rounded-full border-2 border-amber-300 bg-white px-2 font-display text-xs font-bold text-amber-900"
        >
          <option value={6}>Pincel fino</option>
          <option value={14}>Pincel médio</option>
          <option value={28}>Pincel grosso</option>
        </select>
        <button
          onClick={() => {
            const c = canvasRef.current;
            const ctx = c?.getContext("2d");
            if (c && ctx) { ctx.clearRect(0, 0, c.width, c.height); localStorage.removeItem(storageKey); }
          }}
          title="Começar a pintura de novo"
          className="px-3 h-8 rounded-full font-display text-xs font-extrabold bg-white text-rose-700 border-2 border-rose-300 shadow"
        >
          ♻️ Recomeçar
        </button>
      </div>

      <div ref={wrapRef} className="relative mx-auto w-full max-w-xl rounded-2xl overflow-hidden border-2 border-amber-200 bg-white shadow-inner">
        <img
          src={historia.imagem}
          alt={`Desenho para colorir — ${historia.titulo}`}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto select-none pointer-events-none"
        />
        <canvas
          ref={canvasRef}
          width={800}
          height={1000}
          onPointerDown={start}
          onPointerMove={draw}
          onPointerUp={end}
          onPointerLeave={end}
          className="absolute inset-0 w-full h-full touch-none mix-blend-multiply cursor-crosshair"
        />
      </div>
    </div>
  );
}

function StoryCard({ historia, index }: { historia: HistoriaBiblica; index: number }) {
  const [open, setOpen] = useState(index === 0);

  useEffect(() => {
    if (open) awardOnce(todayKey(`historia:${historia.id}`), HIST_COINS, "História lida");
  }, [open, historia.id]);

  return (
    <article className="rounded-[28px] border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 shadow-xl p-5 mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        title={open ? "Fechar história" : "Abrir história"}
        className="w-full text-left flex items-center gap-4"
      >
        <img
          src={historia.imagem}
          alt={historia.titulo}
          loading="lazy"
          decoding="async"
          className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-200 bg-white shrink-0"
        />
        <span className="flex-1">
          <span className="block font-display text-xl sm:text-2xl font-extrabold text-amber-950">{historia.titulo}</span>
          <span className="block font-display text-primary text-xs font-bold mt-0.5">📜 {historia.referencia}</span>
        </span>
        <CoinBadge amount={HIST_COINS} size="xs" label="ao ler" />
      </button>

      {open && (
        <div className="grid gap-3 mt-4">
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-[22px] p-4 border-2 border-amber-200">
            <h4 className="font-display text-sm font-extrabold text-amber-900 mb-1">📖 Versículo-chave</h4>
            <p className="font-body text-amber-950 italic leading-relaxed">{historia.versiculo}</p>
          </div>
          <div className="bg-white rounded-[22px] p-4 border-2 border-sky-200">
            <h4 className="font-display text-sm font-extrabold text-sky-900 mb-1">📚 História resumida</h4>
            <p className="font-body text-sky-950 leading-relaxed">{historia.resumo}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-[22px] p-4 border-2 border-emerald-200">
              <h4 className="font-display text-xs font-extrabold text-emerald-900 mb-1">🔎 Curiosidade bíblica</h4>
              <p className="font-body text-sm text-emerald-950">{historia.curiosidade}</p>
            </div>
            <div className="bg-violet-50 rounded-[22px] p-4 border-2 border-violet-200">
              <h4 className="font-display text-xs font-extrabold text-violet-900 mb-1">💡 O que quase ninguém percebe</h4>
              <p className="font-body text-sm text-violet-950">{historia.percebe}</p>
            </div>
            <div className="bg-rose-50 rounded-[22px] p-4 border-2 border-rose-200">
              <h4 className="font-display text-xs font-extrabold text-rose-900 mb-1">❤️ Aplicação para a vida</h4>
              <p className="font-body text-sm text-rose-950">{historia.aplicacao}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-yellow-50 rounded-[22px] p-4 border-2 border-yellow-200">
              <h4 className="font-display text-xs font-extrabold text-amber-900 mb-1">⭐ Missão da semana</h4>
              <p className="font-body text-sm text-amber-950">{historia.missao}</p>
            </div>
            <div className="bg-sky-50 rounded-[22px] p-4 border-2 border-sky-200">
              <h4 className="font-display text-xs font-extrabold text-sky-900 mb-1">💬 Pergunta para conversar</h4>
              <p className="font-body text-sm text-sky-950">{historia.pergunta}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-[22px] p-4 border-2 border-pink-200">
            <h4 className="font-display text-sm font-extrabold text-pink-900 mb-1">🙏 Vamos orar juntos</h4>
            <p className="font-body text-pink-950 italic leading-relaxed">{historia.oracao}</p>
          </div>
          {historia.frase && (
            <p className="text-center font-display text-sm font-extrabold text-amber-900">✝️ {historia.frase}</p>
          )}

          <ColoringCanvas historia={historia} />
        </div>
      )}
    </article>
  );
}

export default function HistoriasDoDia() {
  const doDia = historiasDoDia();

  return (
    <div
      className="min-h-screen py-6 px-4"
      style={{ background: "linear-gradient(180deg, hsl(195,88%,90%), hsl(44,100%,93%) 42%, hsl(332,86%,92%))" }}
    >
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Histórias" subtitle="Histórias bíblicas para crianças" icon={iconHistoriasDia.url} />

        <section className="rounded-[26px] border-2 border-amber-200 bg-white/80 shadow-md p-5 mb-6 text-center">
          <h2 className="font-display text-2xl font-extrabold text-amber-950 mb-1">📖 Histórias do dia</h2>
          <p className="font-body text-sm text-amber-900">
            Todo dia você encontra <strong>duas histórias diferentes</strong> da Bíblia para ler, conversar em família
            e colorir. Volte amanhã: as histórias mudam dia após dia!
          </p>
        </section>

        {doDia.map((h, i) => (
          <StoryCard key={h.id} historia={h} index={i} />
        ))}
      </div>
    </div>
  );
}
