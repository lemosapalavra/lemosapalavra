import { useEffect, useState } from "react";
import { X, Plus, Trash2, RotateCcw, Save, ArrowUp, ArrowDown, Pencil, ExternalLink, Search } from "lucide-react";
import { LemosPlayConfig, PlayEntry, SeriesGroupCfg, defaultConfig, loadConfig, resetConfig, saveConfig } from "@/data/lemosPlayConfig";
import MediaPickerModal from "@/components/MediaPickerModal";

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

  const handleSave = () => { saveConfig(cfg); setDirty(false); };
  const handleReset = () => {
    if (!confirm("Restaurar configurações padrão? Suas edições serão perdidas.")) return;
    resetConfig();
    setCfg(defaultConfig());
    setDirty(false);
  };


  type CatKey = "filmes" | "musicas" | "louvores" | `series:${string}`;
  const CAT_LABEL: Record<"filmes" | "musicas" | "louvores", string> = {
    filmes: "Filmes",
    musicas: "Músicas",
    louvores: "Louvores",
  };
  const moveEntry = (from: CatKey, id: string, to: CatKey) => {
    if (from === to) return;
    // pull entry
    let entry: PlayEntry | undefined;
    const next: LemosPlayConfig = { ...cfg, series: cfg.series.map((g) => ({ ...g, videos: [...g.videos] })), filmes: [...cfg.filmes], musicas: [...cfg.musicas], louvores: [...cfg.louvores] };
    const pull = (arr: PlayEntry[]) => {
      const i = arr.findIndex((x) => x.id === id);
      if (i >= 0) { entry = arr[i]; arr.splice(i, 1); }
    };
    if (from === "filmes") pull(next.filmes);
    else if (from === "musicas") pull(next.musicas);
    else if (from === "louvores") pull(next.louvores);
    else {
      const gid = from.slice(7);
      const g = next.series.find((x) => x.id === gid);
      if (g) pull(g.videos);
    }
    if (!entry) return;
    if (to === "filmes") next.filmes.push(entry);
    else if (to === "musicas") next.musicas.push(entry);
    else if (to === "louvores") next.louvores.push(entry);
    else {
      const gid = to.slice(7);
      const g = next.series.find((x) => x.id === gid);
      if (g) g.videos.push(entry);
    }
    update(next);
  };

  const moveTargets: { key: CatKey; label: string }[] = [
    { key: "filmes", label: "🎬 Filmes" },
    { key: "musicas", label: "🎵 Músicas" },
    { key: "louvores", label: "🙌 Louvores" },
    ...cfg.series.map((g) => ({ key: `series:${g.id}` as CatKey, label: `📺 Série: ${g.title}` })),
  ];

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
          {tab === "filmes" && <PlayList items={cfg.filmes} onChange={(v) => updateList("filmes", v)} currentCategory="filmes" moveTargets={moveTargets} onMove={(id, to) => moveEntry("filmes", id, to as CatKey)} />}
          {tab === "musicas" && <PlayList items={cfg.musicas} onChange={(v) => updateList("musicas", v)} currentCategory="musicas" moveTargets={moveTargets} onMove={(id, to) => moveEntry("musicas", id, to as CatKey)} />}
          {tab === "louvores" && <PlayList items={cfg.louvores} onChange={(v) => updateList("louvores", v)} currentCategory="louvores" moveTargets={moveTargets} onMove={(id, to) => moveEntry("louvores", id, to as CatKey)} />}
          {tab === "series" && (
            <SeriesEditor groups={cfg.series} onChange={(g) => update({ ...cfg, series: g })} moveTargets={moveTargets} onMoveFromGroup={(gid, id, to) => moveEntry(`series:${gid}` as CatKey, id, to as CatKey)} />
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

type MoveTarget = { key: string; label: string };
function PlayList({ items, onChange, currentCategory, moveTargets, onMove }: { items: PlayEntry[]; onChange: (v: PlayEntry[]) => void; currentCategory?: string; moveTargets?: MoveTarget[]; onMove?: (id: string, to: string) => void }) {
  const add = (section?: string) =>
    onChange([...items, { id: newId(), title: "Novo vídeo", src: "", ...(section ? { section } : {}) }]);
  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));
  const patch = (id: string, p: Partial<PlayEntry>) => onChange(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const move = (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };
  const [editingId, setEditingId] = useState<string | null>(null);
  const [picker, setPicker] = useState<{ id: string; field: "src" | "poster" } | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const SECTION_ORDER = ["Gênesis", "Êxodo", "Jó", "Daniel", "Profetas", "Vida de Jesus", "Milagres de Jesus", "Parábolas", "Apocalipse", "Louvores", "Músicas"];
  const OTHER = "Sem categoria";
  const groups = new Map<string, { item: PlayEntry; idx: number }[]>();
  items.forEach((it, idx) => {
    const s = (it.section && it.section.trim()) || OTHER;
    if (!groups.has(s)) groups.set(s, []);
    groups.get(s)!.push({ item: it, idx });
  });
  const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
    const ia = SECTION_ORDER.indexOf(a);
    const ib = SECTION_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  const visibleKeys = filter === "all" ? sortedKeys : sortedKeys.filter((k) => k === filter);

  const isOpen = (k: string) => openSections[k] !== false; // default open

  const renderCard = (it: PlayEntry, idx: number) => {
    const editing = editingId === it.id;
    return (
      <div key={it.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-zinc-500 font-mono w-8">#{String(idx + 1).padStart(2, "0")}</span>
          <input value={it.title} onChange={(e) => patch(it.id, { title: e.target.value })} placeholder="Título" className={inputCls + " flex-1"} />
          <button onClick={() => move(it.id, -1)} className="w-9 h-9 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center" title="Mover para cima">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button onClick={() => move(it.id, 1)} className="w-9 h-9 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center" title="Mover para baixo">
            <ArrowDown className="w-4 h-4" />
          </button>
          <button onClick={() => setEditingId(editing ? null : it.id)} className={`w-9 h-9 rounded flex items-center justify-center ${editing ? "bg-amber-600 hover:bg-amber-700" : "bg-zinc-800 hover:bg-zinc-700"}`} title="Editar URL e capa">
            <Pencil className="w-4 h-4" />
          </button>
          {it.src && (
            <a href={it.src} target="_blank" rel="noreferrer" className="w-9 h-9 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center" title="Abrir URL">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button onClick={() => remove(it.id)} className="w-9 h-9 rounded bg-red-900/40 hover:bg-red-900/70 flex items-center justify-center" title="Remover">
            <Trash2 className="w-4 h-4 text-red-300" />
          </button>
        </div>
        {editing && (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <label className="block text-[11px] text-zinc-400">Livro / Tema</label>
            <input value={it.section ?? ""} onChange={(e) => patch(it.id, { section: e.target.value })} placeholder="Ex: Gênesis, Êxodo, Vida de Jesus…" className={inputCls} />
            <label className="block text-[11px] text-zinc-400">URL do vídeo</label>
            <div className="flex gap-2">
              <input value={it.src} onChange={(e) => patch(it.id, { src: e.target.value })} placeholder="YouTube, Vimeo, /videos/arquivo.mp4 ou clique em Procurar" className={inputCls + " flex-1"} />
              <button
                type="button"
                onClick={() => setPicker({ id: it.id, field: "src" })}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-xs font-bold flex items-center gap-1 whitespace-nowrap"
                title="Procurar vídeo já existente no site"
              >
                <Search className="w-3.5 h-3.5" /> Procurar
              </button>
            </div>
            <label className="block text-[11px] text-zinc-400">URL da capa / ícone (opcional)</label>
            <div className="flex gap-2">
              <input value={it.poster ?? ""} onChange={(e) => patch(it.id, { poster: e.target.value })} placeholder="https://... ou clique em Procurar" className={inputCls + " flex-1"} />
              <button
                type="button"
                onClick={() => setPicker({ id: it.id, field: "poster" })}
                className="px-3 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-xs font-bold flex items-center gap-1 whitespace-nowrap"
                title="Procurar capa já existente no site"
              >
                <Search className="w-3.5 h-3.5" /> Procurar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <MediaPickerModal
        open={!!picker}
        kind={picker?.field === "poster" ? "image" : "video"}
        currentUrl={picker ? (items.find((x) => x.id === picker.id)?.[picker.field] ?? "") : ""}
        onClose={() => setPicker(null)}
        onSelect={(url) => picker && patch(picker.id, { [picker.field]: url } as Partial<PlayEntry>)}
      />

      {/* Filtro por livro/tema */}
      <div className="flex flex-wrap gap-2 items-center bg-zinc-900/70 border border-zinc-800 rounded-lg p-2">
        <span className="text-xs text-zinc-400 px-1">Livro / Tema:</span>
        <button
          onClick={() => setFilter("all")}
          className={`px-2.5 py-1 rounded text-xs font-semibold ${filter === "all" ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
        >
          Todos ({items.length})
        </button>
        {sortedKeys.map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-2.5 py-1 rounded text-xs font-semibold ${filter === k ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
          >
            {k} ({groups.get(k)!.length})
          </button>
        ))}
      </div>

      {visibleKeys.map((k) => (
        <div key={k} className="space-y-2">
          <button
            onClick={() => setOpenSections((s) => ({ ...s, [k]: !isOpen(k) }))}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700"
          >
            <span className="text-sm font-bold text-white">📚 {k}</span>
            <span className="text-xs text-zinc-400">{groups.get(k)!.length} vídeo(s) {isOpen(k) ? "▾" : "▸"}</span>
          </button>
          {isOpen(k) && (
            <div className="space-y-2 pl-2 border-l-2 border-zinc-800">
              {groups.get(k)!.map(({ item, idx }) => renderCard(item, idx))}
              <button
                onClick={() => add(k === OTHER ? undefined : k)}
                className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-zinc-700 hover:border-red-600 hover:text-red-400 rounded text-xs text-zinc-400 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar em {k}
              </button>
            </div>
          )}
        </div>
      ))}

      <button onClick={() => add()} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-zinc-700 hover:border-red-600 hover:text-red-400 rounded-lg text-sm text-zinc-400 transition">
        <Plus className="w-4 h-4" /> Adicionar vídeo (sem categoria)
      </button>
    </div>
  );
}

function SeriesEditor({ groups, onChange, moveTargets, onMoveFromGroup }: { groups: SeriesGroupCfg[]; onChange: (g: SeriesGroupCfg[]) => void; moveTargets?: MoveTarget[]; onMoveFromGroup?: (groupId: string, id: string, to: string) => void }) {
  const addGroup = () =>
    onChange([...groups, { id: newId(), title: "Nova Série", videos: [] }]);
  const removeGroup = (id: string) => {
    if (!confirm("Remover esta série e todos seus vídeos?")) return;
    onChange(groups.filter((g) => g.id !== id));
  };
  const patchGroup = (id: string, p: Partial<SeriesGroupCfg>) =>
    onChange(groups.map((g) => (g.id === id ? { ...g, ...p } : g)));
  const moveGroup = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= groups.length) return;
    const next = [...groups];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {groups.map((g, gi) => (
        <div key={g.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <input value={g.title} onChange={(e) => patchGroup(g.id, { title: e.target.value })} placeholder="Nome da série" className={inputCls + " flex-1 font-bold"} />
            <button onClick={() => moveGroup(gi, -1)} disabled={gi === 0} className="w-9 h-9 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 flex items-center justify-center" title="Mover série para cima">
              <ArrowUp className="w-4 h-4" />
            </button>
            <button onClick={() => moveGroup(gi, 1)} disabled={gi === groups.length - 1} className="w-9 h-9 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 flex items-center justify-center" title="Mover série para baixo">
              <ArrowDown className="w-4 h-4" />
            </button>
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
