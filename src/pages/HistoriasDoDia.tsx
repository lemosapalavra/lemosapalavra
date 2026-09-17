import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveToMural } from "@/lib/mural";
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
  const maskRef = useRef<Uint8Array | null>(null);
  const [color, setColor] = useState(PALETTE[3]);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 800, h: 1000 });
  const [ready, setReady] = useState(false);
  const storageKey = `lemos_pintura_hist_${historia.id}`;

  // Carrega o desenho, monta a "máscara" dos contornos e restaura a pintura salva.
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const maxW = 900;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      setDims({ w, h });

      const off = document.createElement("canvas");
      off.width = w; off.height = h;
      const octx = off.getContext("2d")!;
      octx.fillStyle = "#ffffff";
      octx.fillRect(0, 0, w, h);
      octx.drawImage(img, 0, 0, w, h);
      const data = octx.getImageData(0, 0, w, h).data;
      const mask = new Uint8Array(w * h);
      for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
        mask[j] = lum < 110 ? 1 : 0;
      }
      maskRef.current = mask;

      // restaura pintura salva
      requestAnimationFrame(() => {
        const c = canvasRef.current;
        const ctx = c?.getContext("2d");
        if (!c || !ctx) return;
        ctx.clearRect(0, 0, c.width, c.height);
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const prev = new Image();
          prev.onload = () => ctx.drawImage(prev, 0, 0, c.width, c.height);
          prev.src = saved;
        }
        setReady(true);
      });
    };
    img.src = historia.imagem;
    return () => { cancelled = true; };
  }, [historia.imagem, storageKey]);

  const save = () => {
    const c = canvasRef.current;
    if (!c) return;
    try { localStorage.setItem(storageKey, c.toDataURL("image/png")); } catch { /* espaço cheio */ }
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  /** Clique simples: pinta (ou repinta) toda a área fechada. */
  const fillAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    const mask = maskRef.current;
    if (!c || !mask) return;
    const ctx = c.getContext("2d")!;
    const r = c.getBoundingClientRect();
    const w = c.width, h = c.height;
    const sx = Math.floor(((e.clientX - r.left) / r.width) * w);
    const sy = Math.floor(((e.clientY - r.top) / r.height) * h);
    if (sx < 0 || sy < 0 || sx >= w || sy >= h) return;
    if (mask[sy * w + sx]) return;

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const [rr, gg, bb] = hexToRgb(color);
    const visited = new Uint8Array(w * h);
    const stack: number[] = [sx, sy];
    while (stack.length) {
      const y = stack.pop()!;
      const x = stack.pop()!;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const m = y * w + x;
      if (visited[m] || mask[m]) continue;
      visited[m] = 1;
      const p = m * 4;
      data[p] = rr; data[p + 1] = gg; data[p + 2] = bb; data[p + 3] = 255;
      stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
    }
    ctx.putImageData(imgData, 0, 0);
    save();
  };

  const reset = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) { ctx.clearRect(0, 0, c.width, c.height); localStorage.removeItem(storageKey); }
  };

  const toMural = () => {
    const c = canvasRef.current;
    if (!c) return;
    const out = document.createElement("canvas");
    out.width = c.width; out.height = c.height;
    const octx = out.getContext("2d")!;
    octx.fillStyle = "#ffffff";
    octx.fillRect(0, 0, out.width, out.height);
    octx.drawImage(c, 0, 0);
    const outline = new Image();
    outline.crossOrigin = "anonymous";
    outline.onload = () => {
      octx.globalCompositeOperation = "multiply";
      octx.drawImage(outline, 0, 0, out.width, out.height);
      saveToMural({ title: historia.titulo, image: out.toDataURL("image/png"), activity: "Histórias" });
      toast.success("Pregado no Meu Mural! 🖼️");
    };
    outline.onerror = () => {
      saveToMural({ title: historia.titulo, image: out.toDataURL("image/png"), activity: "Histórias" });
      toast.success("Pregado no Meu Mural! 🖼️");
    };
    outline.src = historia.imagem;
  };

  return (
    <div className="mt-4">
      <p className="font-body text-xs text-amber-800 mb-2 text-center">
        🪣 Escolha uma cor e <strong>toque em cada parte do desenho</strong> para pintar. Sua pintura fica
        <strong> salva</strong> e você pode continuar depois.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
        {PALETTE.map((c) => (
          <button
            key={c}
            title="Pintar com esta cor"
            onClick={() => setColor(c)}
            className={`w-8 h-8 rounded-full border-2 shadow ${color === c ? "border-amber-900 scale-110" : "border-white"}`}
            style={{ background: c }}
          />
        ))}
        <button
          onClick={reset}
          title="Começar a pintura de novo"
          className="px-3 h-8 rounded-full font-display text-xs font-extrabold bg-white text-rose-700 border-2 border-rose-300 shadow"
        >
          ♻️ Recomeçar
        </button>
        <button
          onClick={toMural}
          title="Guardar esta pintura no Meu Mural"
          className="px-3 h-8 rounded-full font-display text-xs font-extrabold bg-white text-amber-900 border-2 border-amber-300 shadow"
        >
          🖼️ Colocar no Mural
        </button>
      </div>

      <div
        className="relative mx-auto w-full max-w-xl rounded-2xl overflow-hidden border-2 border-amber-200 bg-white shadow-inner"
        style={{ aspectRatio: `${dims.w} / ${dims.h}` }}
      >
        <canvas
          ref={canvasRef}
          width={dims.w}
          height={dims.h}
          onClick={fillAt}
          className="absolute inset-0 w-full h-full touch-none cursor-pointer"
        />
        <img
          src={historia.imagem}
          alt={`Desenho para colorir — ${historia.titulo}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          style={{ mixBlendMode: "multiply" }}
        />
        {!ready && (
          <span className="absolute inset-0 flex items-center justify-center font-display text-xs text-amber-800">
            Preparando o desenho…
          </span>
        )}
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
