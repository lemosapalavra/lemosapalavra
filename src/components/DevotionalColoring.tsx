import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveToMural } from "@/lib/mural";

const PALETTE = [
  "#e11d48", "#f97316", "#facc15", "#22c55e", "#0ea5e9", "#6366f1",
  "#a855f7", "#ec4899", "#78350f", "#f5d0a9", "#111827", "#94a3b8",
];

export default function ColoringCanvas({ image, title, id }: { image: string; title: string; id: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<Uint8Array | null>(null);
  const [color, setColor] = useState(PALETTE[3]);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 800, h: 1000 });
  const [ready, setReady] = useState(false);
  const historyRef = useRef<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const storageKey = `lemos_pintura_devo_${id}`;

  // Carrega o desenho, monta a "máscara" dos contornos e restaura a pintura salva.
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    historyRef.current = [];
    setCanUndo(false);
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
    img.src = image;
    return () => { cancelled = true; };
  }, [image, storageKey]);

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

    const before = c.toDataURL("image/webp", 0.85);
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
    historyRef.current = [...historyRef.current.slice(-9), before];
    setCanUndo(true);
    save();
  };

  const undo = () => {
    const previous = historyRef.current.pop();
    if (!previous) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const img = new Image();
    img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height); save(); };
    img.src = previous;
    setCanUndo(historyRef.current.length > 0);
  };

  const reset = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) { ctx.clearRect(0, 0, c.width, c.height); localStorage.removeItem(storageKey); historyRef.current = []; setCanUndo(false); }
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
      saveToMural({ title: title, image: out.toDataURL("image/webp", 0.85), activity: "Devocionais" });
      toast.success("Pregado no Meu Mural! 🖼️");
    };
    outline.onerror = () => {
      saveToMural({ title: title, image: out.toDataURL("image/webp", 0.85), activity: "Devocionais" });
      toast.success("Pregado no Meu Mural! 🖼️");
    };
    outline.src = image;
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
        <button onClick={undo} disabled={!canUndo} title="Desfazer a última cor" className="px-3 h-8 rounded-full font-display text-xs font-extrabold bg-background text-foreground border-2 border-border shadow disabled:opacity-50">↶ Desfazer</button>
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
          src={image}
          alt={`Desenho para colorir — ${title}`}
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

