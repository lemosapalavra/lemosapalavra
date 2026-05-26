import { useEffect, useState } from "react";
import { X, Plus, Trash2, RotateCcw, Save } from "lucide-react";
import { LemosPlayConfig, PlayEntry, SeriesGroupCfg, defaultConfig, loadConfig, resetConfig, saveConfig } from "@/data/lemosPlayConfig";

type Tab = "filmes" | "series" | "musicas" | "louvores";

interface Props {
  open: boolean;
  onClose: () => void;
}

const newId = () => `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

const inputCls = "w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500";

export default function LemosPlayAdminPanel({ open, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("filmes");
  const [cfg, setCfg] = useState<LemosPlayConfig>(() => loadConfig());
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (open) {
      setCfg(loadConfig());
      setDirty(false);
    }
  }, [open]);

  if (!open) return null;

  const update = (next: LemosPlayConfig) => {
    setCfg(next);
    setDirty(true);
  };

  const updateList = (key: "filmes" | "musicas" | "louvores", items: PlayEntry[]) => {
    update({ ...cfg, [key]: items });
  };

  const handleSave = () => {
    saveConfig(cfg);
    setDirty(false);
  };

  const handleReset = () => {
    if (!confirm("Restaurar configurações padrão? Suas edições serão perdidas.")) return;
    resetConfig();
    setCfg(defaultConfig());
    setDirty(false);
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "filmes", label: "Filmes", count: cfg.filmes.length },
    { key: "series", label: "Séries", count: cfg.series.reduce((a, g) => a + g.videos.length, 0) },
    { key: "musicas", label: "Músicas", count: cfg.musicas.length },
    { key: "louvores", label: "Louvores", count: cfg.louvores.length },
  ];

  return (
    <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col text-white" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div>
            <h2 className="text-lg font-bold">⚙️ Configuração — Lemos Play</h2>
            <p className="text-xs text-zinc-400">Edite títulos, links e adicione novos vídeos por categoria.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 border-b border-zinc-800">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2 text-sm font-semibold rounded-t-md transition ${
                tab === t.key ? "bg-zinc-800 text-white border-b-2 border-red-600" : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.label} <span className="text-xs opacity-60">({t.count})</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tab === "filmes" && <PlayList items={cfg.filmes} onChange={(v) => updateList("filmes", v)} />}
          {tab === "musicas" && <PlayList items={cfg.musicas} onChange={(v) => updateList("musicas", v)} />}
          {tab === "louvores" && <PlayList items={cfg.louvores} onChange={(v) => updateList("louvores", v)} />}
          {tab === "series" && (
            <SeriesEditor groups={cfg.series} onChange={(g) => update({ ...cfg, series: g })} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800 gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-sm">
            <RotateCcw className="w-4 h-4" /> Restaurar padrão
          </button>
          <div className="flex items-center gap-2">
            {dirty && <span className="text-xs text-amber-400">Alterações não salvas</span>}
            <button onClick={onClose} className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-sm">Cancelar</button>
            <button onClick={handleSave} disabled={!dirty} className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold">
              <Save className="w-4 h-4" /> Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayList({ items, onChange }: { items: PlayEntry[]; onChange: (v: PlayEntry[]) => void }) {
  const add = () => onChange([...items, { id: newId(), title: "Novo vídeo", src: "" }]);
  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));
  const patch = (id: string, p: Partial<PlayEntry>) => onChange(items.map((x) => (x.id === id ? { ...x, ...p } : x)));

  return (
    <div className="space-y-2">
      {items.map((it, idx) => (
        <div key={it.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-zinc-500 font-mono">#{String(idx + 1).padStart(2, "0")}</span>
            <input value={it.title} onChange={(e) => patch(it.id, { title: e.target.value })} placeholder="Título" className={inputCls + " flex-1"} />
            <button onClick={() => remove(it.id)} className="w-9 h-9 rounded bg-red-900/40 hover:bg-red-900/70 flex items-center justify-center" title="Remover">
              <Trash2 className="w-4 h-4 text-red-300" />
            </button>
          </div>
          <input value={it.src} onChange={(e) => patch(it.id, { src: e.target.value })} placeholder="URL do vídeo (iframe Bunny / YouTube embed)" className={inputCls + " mb-2"} />
          <input value={it.poster ?? ""} onChange={(e) => patch(it.id, { poster: e.target.value })} placeholder="URL da capa (opcional)" className={inputCls} />
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-700 hover:border-red-600 hover:text-red-400 rounded-lg text-sm text-zinc-400 transition">
        <Plus className="w-4 h-4" /> Adicionar vídeo
      </button>
    </div>
  );
}

function SeriesEditor({ groups, onChange }: { groups: SeriesGroupCfg[]; onChange: (g: SeriesGroupCfg[]) => void }) {
  const addGroup = () =>
    onChange([...groups, { id: newId(), title: "Nova Série", videos: [] }]);
  const removeGroup = (id: string) => {
    if (!confirm("Remover esta série e todos seus vídeos?")) return;
    onChange(groups.filter((g) => g.id !== id));
  };
  const patchGroup = (id: string, p: Partial<SeriesGroupCfg>) =>
    onChange(groups.map((g) => (g.id === id ? { ...g, ...p } : g)));

  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <input value={g.title} onChange={(e) => patchGroup(g.id, { title: e.target.value })} placeholder="Nome da série" className={inputCls + " flex-1 font-bold"} />
            <button onClick={() => removeGroup(g.id)} className="w-9 h-9 rounded bg-red-900/40 hover:bg-red-900/70 flex items-center justify-center" title="Remover série">
              <Trash2 className="w-4 h-4 text-red-300" />
            </button>
          </div>
          <input value={g.icon ?? ""} onChange={(e) => patchGroup(g.id, { icon: e.target.value })} placeholder="URL da capa da série (opcional)" className={inputCls + " mb-3"} />
          <div className="pl-3 border-l-2 border-zinc-700">
            <PlayList items={g.videos} onChange={(videos) => patchGroup(g.id, { videos })} />
          </div>
        </div>
      ))}
      <button onClick={addGroup} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-700 hover:border-red-600 hover:text-red-400 rounded-lg text-sm text-zinc-400 transition">
        <Plus className="w-4 h-4" /> Adicionar série
      </button>
    </div>
  );
}
