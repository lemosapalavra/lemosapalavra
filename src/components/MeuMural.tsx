import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { loadMural, removeMuralItem, updateMuralItem, MURAL_EVENT, type MuralItem } from "@/lib/mural";

/** Janela "Meu Mural" — quadro de cortiça com as atividades salvas pregadas nele. */

const PALETTE = [
  "#e11d48", "#f97316", "#facc15", "#22c55e", "#0ea5e9",
  "#6366f1", "#a855f7", "#ec4899", "#78350f", "#111827",
];

/** Editor simples: continua pintando/desenhando por cima da atividade salva. */
function MuralEditor({ item, onClose }: { item: MuralItem; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(PALETTE[0]);
  const [size, setSize] = useState(10);
  const [eraserHint, setEraserHint] = useState(false);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const max = 1000;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
    };
    img.onerror = () => setEraserHint(true);
    img.src = item.image;
  }, [item.image]);

  const pos = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };
  const paint = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  };

  const saveBack = () => {
    const c = canvasRef.current;
    if (!c) return;
    try {
      updateMuralItem(item.id, { image: c.toDataURL("image/png") });
      toast.success("Atividade atualizada no mural! 🖼️");
      onClose();
    } catch {
      toast.error("Não foi possível salvar esta edição.");
    }
  };

  return (
    <div className="fixed inset-0 z-[95] bg-black/70 flex items-center justify-center p-3" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border-4 border-amber-300 p-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-extrabold text-amber-900">✏️ Continuar editando</h3>
          <button onClick={onClose} title="Fechar" className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 font-bold text-amber-900">✕</button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              title="Escolher esta cor"
              className={`w-7 h-7 rounded-full border-2 shadow ${color === c ? "border-amber-900 scale-110" : "border-white"}`}
              style={{ background: c }}
            />
          ))}
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            title="Tamanho do pincel"
            className="h-8 rounded-full border-2 border-amber-300 bg-white px-2 font-display text-xs font-bold text-amber-900"
          >
            <option value={5}>Fino</option>
            <option value={10}>Médio</option>
            <option value={22}>Grosso</option>
          </select>
        </div>

        <canvas
          ref={canvasRef}
          onPointerDown={(e) => { drawing.current = true; paint(e); }}
          onPointerMove={paint}
          onPointerUp={() => { drawing.current = false; }}
          onPointerLeave={() => { drawing.current = false; }}
          className="w-full h-auto rounded-2xl border-2 border-amber-200 bg-white touch-none cursor-crosshair"
        />
        {eraserHint && (
          <p className="font-body text-[11px] text-rose-600 mt-1">Esta atividade não pode ser editada aqui.</p>
        )}

        <button onClick={saveBack} className="btn-cartoon w-full mt-3 py-2.5 text-sm">💾 Salvar no mural</button>
      </div>
    </div>
  );
}

export default function MeuMural({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<MuralItem[]>([]);
  const [zoom, setZoom] = useState<MuralItem | null>(null);
  const [edit, setEdit] = useState<MuralItem | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const sync = () => setItems(loadMural());
    sync();
    window.addEventListener(MURAL_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(MURAL_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [open]);

  if (!open) return null;

  const share = async (item: MuralItem) => {
    const text = `Olha a minha atividade "${item.title}" no Lemos a Palavra! ✝️`;
    try {
      if (item.image.startsWith("data:") && navigator.canShare) {
        const blob = await (await fetch(item.image)).blob();
        const file = new File([blob], `${item.title}.png`, { type: blob.type || "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text, title: item.title });
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ text, title: item.title, url: window.location.origin });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      toast.success("Link copiado para compartilhar!");
    } catch { /* cancelado */ }
  };

  // Fundo de cortiça (textura feita com gradientes — sem imagem externa).
  const corkStyle: React.CSSProperties = {
    backgroundColor: "#c98f4e",
    backgroundImage:
      "radial-gradient(circle at 12% 18%, rgba(120,60,20,0.35) 0 2px, transparent 3px)," +
      "radial-gradient(circle at 63% 41%, rgba(90,45,15,0.30) 0 3px, transparent 4px)," +
      "radial-gradient(circle at 34% 77%, rgba(140,80,35,0.35) 0 2px, transparent 3px)," +
      "radial-gradient(circle at 85% 88%, rgba(110,55,20,0.28) 0 3px, transparent 4px)," +
      "radial-gradient(circle at 50% 50%, rgba(255,220,170,0.25), rgba(150,95,45,0.35))",
    backgroundSize: "38px 38px, 57px 57px, 43px 43px, 71px 71px, 100% 100%",
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border-[10px] border-[#8b5a2b] shadow-2xl p-4"
        style={corkStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-extrabold text-xl text-amber-50 drop-shadow">🖼️ Meu Mural</h2>
          <button onClick={onClose} title="Fechar" className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 font-bold text-amber-900">✕</button>
        </div>

        <p className="font-body text-sm text-amber-50/95 mb-4 drop-shadow">
          Aqui ficam as atividades que você pregou no mural. Toque para ver maior, continue editando, mude o nome ou compartilhe.
        </p>

        {items.length === 0 ? (
          <p className="font-body text-sm text-amber-50 text-center py-8 drop-shadow">
            Seu mural está vazio. Faça uma atividade e toque em “Salvar no Meu Mural”.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((it, i) => (
              <div
                key={it.id}
                className="relative rounded-sm bg-[#fffdf5] p-2 pt-4 shadow-[0_8px_16px_rgba(0,0,0,0.35)] flex flex-col gap-1"
                style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
              >
                {/* tachinha */}
                <span
                  aria-hidden
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full shadow-md"
                  style={{ background: "radial-gradient(circle at 35% 30%, #ff8a8a, #b91c1c 70%)" }}
                />
                <button onClick={() => setZoom(it)} className="rounded-sm overflow-hidden bg-white border border-amber-200" title="Ver maior">
                  <img src={it.image} alt={it.title} loading="lazy" className="w-full aspect-square object-contain" />
                </button>
                {editing === it.id ? (
                  <div className="flex gap-1">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-amber-300 px-2 py-1 text-xs font-body"
                      aria-label="Novo nome da atividade"
                    />
                    <button
                      onClick={() => { updateMuralItem(it.id, { title: draft.trim() || it.title }); setEditing(null); }}
                      className="px-2 rounded-lg bg-emerald-500 text-white text-xs font-bold"
                      title="Salvar nome"
                    >✓</button>
                  </div>
                ) : (
                  <p className="font-display font-bold text-[11px] text-amber-900 truncate" title={it.title}>{it.title}</p>
                )}
                <p className="font-body text-[10px] text-muted-foreground">
                  {new Date(it.createdAt).toLocaleDateString("pt-BR")}
                </p>
                <button
                  onClick={() => setEdit(it)}
                  title="Continuar editando a atividade"
                  className="w-full py-1 rounded-lg bg-amber-100 border border-amber-300 text-[11px] font-display font-bold text-amber-900"
                >
                  ✏️ Continuar editando
                </button>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(it.id); setDraft(it.title); }} title="Mudar o nome" className="flex-1 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-bold text-amber-900">🏷️</button>
                  <button onClick={() => share(it)} title="Compartilhar" className="flex-1 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-bold text-amber-900">📤</button>
                  <button onClick={() => removeMuralItem(it.id)} title="Apagar" className="flex-1 py-1 rounded-lg bg-white border border-red-300 text-[11px] font-bold text-red-600">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {zoom && (
          <div className="fixed inset-0 z-[90] bg-black/70 flex items-center justify-center p-4" onClick={() => setZoom(null)}>
            <img src={zoom.image} alt={zoom.title} className="max-w-full max-h-[85vh] object-contain rounded-2xl bg-white" />
          </div>
        )}

        {edit && <MuralEditor item={edit} onClose={() => setEdit(null)} />}
      </div>
    </div>
  );
}
