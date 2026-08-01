import { useEffect, useState } from "react";
import { X, RotateCcw, Save, Plus, Trash2, Search } from "lucide-react";
import MediaPickerModal from "@/components/MediaPickerModal";
import { OrbitItem, defaultOrbit, loadOrbit, resetOrbit, saveOrbit } from "@/data/orbitConfig";
import {
  MuraisConfig,
  MuralId,
  defaultMurais,
  loadMurais,
  resetMurais,
  saveMurais,
} from "@/data/muraisConfig";
import {
  EventBannerConfig,
  defaultEventBanner,
  loadEventBanner,
  resetEventBanner,
  saveEventBanner,
} from "@/data/eventBannerConfig";

interface Props {
  open: boolean;
  onClose: () => void;
}

const inputCls =
  "w-full bg-white border border-zinc-300 rounded px-2 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-primary";

type Tab = "menu" | "murais" | "aviaozinho";

export default function IndexAdminPanel({ open, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("menu");
  const [items, setItems] = useState<OrbitItem[]>(() => loadOrbit());
  const [murais, setMurais] = useState<MuraisConfig>(() => loadMurais());
  const [banner, setBanner] = useState<EventBannerConfig>(() => loadEventBanner());
  const [dirty, setDirty] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setItems(loadOrbit());
      setMurais(loadMurais());
      setBanner(loadEventBanner());
      setDirty(false);
    }
  }, [open]);

  if (!open) return null;

  const patchMenu = (idx: number, p: Partial<OrbitItem>) => {
    setItems((arr) => arr.map((x, i) => (i === idx ? { ...x, ...p } : x)));
    setDirty(true);
  };

  const patchMural = (id: MuralId, phrases: string[]) => {
    setMurais((m) => ({ ...m, [id]: { ...m[id], phrases } }));
    setDirty(true);
  };

  const patchBanner = (p: Partial<EventBannerConfig>) => {
    setBanner((b) => ({ ...b, ...p }));
    setDirty(true);
  };

  const handleSave = () => {
    saveOrbit(items);
    saveMurais(murais);
    saveEventBanner(banner);
    setDirty(false);
  };

  const handleReset = () => {
    if (!confirm("Restaurar tudo (menu + murais + aviãozinho) ao padrão?")) return;
    resetOrbit();
    resetMurais();
    resetEventBanner();
    setItems(defaultOrbit());
    setMurais(defaultMurais());
    setBanner(defaultEventBanner());
    setDirty(false);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-foreground">⚙️ Configuração — Página Inicial</h2>
            <p className="text-xs text-muted-foreground">Menu em órbita e murais motivacionais.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-3 border-b">
          {(["menu", "murais", "aviaozinho"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-sm font-semibold rounded-t-md transition ${
                tab === t ? "bg-zinc-100 text-foreground border-b-2 border-primary" : "text-zinc-500 hover:text-foreground"
              }`}
            >
              {t === "menu" ? "🌐 Menu Órbita" : t === "murais" ? "🖼️ Murais" : "✈️ Aviãozinho"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tab === "menu" &&
            items.map((it, idx) => (
              <div key={idx} className="bg-zinc-50 border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <img loading="lazy" decoding="async" src={it.icon} alt={it.label} className="w-12 h-12 rounded-full object-cover border" />
                  <span className="text-xs font-bold text-zinc-500">Item #{idx + 1}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="text-xs font-semibold text-zinc-700">
                    Rótulo
                    <input value={it.label} onChange={(e) => patchMenu(idx, { label: e.target.value })} className={inputCls + " mt-1"} />
                  </label>
                  <label className="text-xs font-semibold text-zinc-700">
                    Rota
                    <input value={it.route} onChange={(e) => patchMenu(idx, { route: e.target.value })} className={inputCls + " mt-1"} />
                  </label>
                  <label className="text-xs font-semibold text-zinc-700 sm:col-span-2">
                    Subtítulo (opcional)
                    <input value={it.sublabel ?? ""} onChange={(e) => patchMenu(idx, { sublabel: e.target.value })} className={inputCls + " mt-1"} />
                  </label>
                  <label className="text-xs font-semibold text-zinc-700 sm:col-span-2">
                    URL do ícone (opcional, sobrescreve o padrão)
                    <input value={it.icon} onChange={(e) => patchMenu(idx, { icon: e.target.value })} className={inputCls + " mt-1"} />
                  </label>
                </div>
              </div>
            ))}

          {tab === "murais" && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500">
                Cada mural mostra uma frase rotativa (uma por dia). Adicione quantas quiser.
              </p>
              {(["reflexao", "motivacao", "sabedoria"] as MuralId[]).map((id) => {
                const m = murais[id];
                return (
                  <div key={id} className="bg-zinc-50 border rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-3">
                      <img loading="lazy" decoding="async" src={m.bgUrl} alt={m.title} className="w-16 h-20 object-cover rounded border" />
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{m.title}</h3>
                        <p className="text-[11px] text-zinc-500">{m.phrases.length} frase(s)</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {m.phrases.map((p, i) => (
                        <div key={i} className="flex gap-2">
                          <textarea
                            value={p}
                            onChange={(e) => {
                              const next = [...m.phrases];
                              next[i] = e.target.value;
                              patchMural(id, next);
                            }}
                            rows={2}
                            placeholder="Escreva a frase…"
                            className={inputCls + " flex-1 resize-none"}
                          />
                          <button
                            onClick={() => patchMural(id, m.phrases.filter((_, j) => j !== i))}
                            className="w-9 h-9 rounded bg-red-100 hover:bg-red-200 flex items-center justify-center shrink-0"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => patchMural(id, [...m.phrases, ""])}
                        className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-zinc-300 hover:border-primary hover:text-primary rounded text-xs text-zinc-500 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar frase
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "aviaozinho" && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">
                Um aviãozinho puxa uma faixa "Clique aqui" e a mensagem sazonal.
                Clicando, abre o vídeo configurado (YouTube, Vimeo, MP4 direto, etc.).
              </p>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <input
                  type="checkbox"
                  checked={banner.enabled}
                  onChange={(e) => patchBanner({ enabled: e.target.checked })}
                />
                Exibir aviãozinho na página inicial
              </label>
              <div className="rounded-lg border border-zinc-200 p-3 space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={banner.scheduleEnabled}
                    onChange={(e) => patchBanner({ scheduleEnabled: e.target.checked })}
                  />
                  Exibir somente em data comemorativa
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-semibold text-zinc-700 block">
                    Início
                    <input
                      type="date"
                      value={banner.startDate}
                      disabled={!banner.scheduleEnabled}
                      onChange={(e) => patchBanner({ startDate: e.target.value })}
                      className={inputCls + " mt-1 disabled:opacity-50"}
                    />
                  </label>
                  <label className="text-xs font-semibold text-zinc-700 block">
                    Fim
                    <input
                      type="date"
                      value={banner.endDate}
                      disabled={!banner.scheduleEnabled}
                      onChange={(e) => patchBanner({ endDate: e.target.value })}
                      className={inputCls + " mt-1 disabled:opacity-50"}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Fora do período configurado o aviãozinho não aparece na página inicial.
                </p>
              </div>
              <label className="text-xs font-semibold text-zinc-700 block">
                Chamada (texto da faixa)
                <input
                  value={banner.callToAction}
                  onChange={(e) => patchBanner({ callToAction: e.target.value })}
                  placeholder="Clique aqui"
                  className={inputCls + " mt-1"}
                />
              </label>
              <label className="text-xs font-semibold text-zinc-700 block">
                Mensagem sazonal / tema do evento
                <input
                  value={banner.message}
                  onChange={(e) => patchBanner({ message: e.target.value })}
                  placeholder="Feliz Dia dos Pais"
                  className={inputCls + " mt-1"}
                />
              </label>
              <label className="text-xs font-semibold text-zinc-700 block">
                Link do vídeo (YouTube, Vimeo, MP4, etc.)
                <div className="flex gap-2 mt-1">
                  <input
                    value={banner.videoUrl}
                    onChange={(e) => patchBanner({ videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={inputCls + " flex-1"}
                  />
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold flex items-center gap-1 whitespace-nowrap"
                    title="Procurar vídeo já existente no site"
                  >
                    <Search className="w-3.5 h-3.5" /> Procurar no site
                  </button>
                </div>
              </label>
              <MediaPickerModal
                open={pickerOpen}
                kind="video"
                currentUrl={banner.videoUrl}
                onClose={() => setPickerOpen(false)}
                onSelect={(url) => patchBanner({ videoUrl: url })}
              />
            </div>
          )}
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
