import { useEffect, useState } from "react";
import { X, RotateCcw, Save } from "lucide-react";
import { OrbitItem, defaultOrbit, loadOrbit, resetOrbit, saveOrbit } from "@/data/orbitConfig";

interface Props {
  open: boolean;
  onClose: () => void;
}

const inputCls = "w-full bg-white border border-zinc-300 rounded px-2 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-primary";

export default function IndexAdminPanel({ open, onClose }: Props) {
  const [items, setItems] = useState<OrbitItem[]>(() => loadOrbit());
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setItems(loadOrbit());
      setDirty(false);
    }
  }, [open]);

  if (!open) return null;

  const patch = (idx: number, p: Partial<OrbitItem>) => {
    setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, ...p } : x)));
    setDirty(true);
  };

  const handleSave = () => {
    saveOrbit(items);
    setDirty(false);
  };

  const handleReset = () => {
    if (!confirm("Restaurar menu padrão?")) return;
    resetOrbit();
    setItems(defaultOrbit());
    setDirty(false);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-foreground">⚙️ Configuração — Página Inicial</h2>
            <p className="text-xs text-muted-foreground">Edite os itens do menu em órbita ao redor da logo.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="bg-zinc-50 border rounded-lg p-3">
              <div className="flex items-center gap-3 mb-2">
                <img src={it.icon} alt={it.label} className="w-12 h-12 rounded-full object-cover border" />
                <span className="text-xs font-bold text-zinc-500">Item #{idx + 1}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="text-xs font-semibold text-zinc-700">
                  Rótulo
                  <input value={it.label} onChange={(e) => patch(idx, { label: e.target.value })} className={inputCls + " mt-1"} />
                </label>
                <label className="text-xs font-semibold text-zinc-700">
                  Rota
                  <input value={it.route} onChange={(e) => patch(idx, { route: e.target.value })} className={inputCls + " mt-1"} />
                </label>
                <label className="text-xs font-semibold text-zinc-700 sm:col-span-2">
                  Subtítulo (opcional)
                  <input value={it.sublabel ?? ""} onChange={(e) => patch(idx, { sublabel: e.target.value })} className={inputCls + " mt-1"} />
                </label>
                <label className="text-xs font-semibold text-zinc-700 sm:col-span-2">
                  URL do ícone (opcional, sobrescreve o padrão)
                  <input value={it.icon} onChange={(e) => patch(idx, { icon: e.target.value })} className={inputCls + " mt-1"} />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 border-t gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 rounded bg-zinc-100 hover:bg-zinc-200 text-sm">
            <RotateCcw className="w-4 h-4" /> Restaurar padrão
          </button>
          <div className="flex items-center gap-2">
            {dirty && <span className="text-xs text-amber-600">Alterações não salvas</span>}
            <button onClick={onClose} className="px-3 py-2 rounded bg-zinc-100 hover:bg-zinc-200 text-sm">Cancelar</button>
            <button onClick={handleSave} disabled={!dirty} className="flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold">
              <Save className="w-4 h-4" /> Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
