import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ACTIVITY_AGE_RANGES,
  SITE_GAMES,
  SITE_SECTIONS,
  type ActivityAgeRange,
  type ContentAccessMap,
  type ContentGroup,
  loadContentAccess,
  saveContentAccess,
} from "@/lib/contentAccess";
import { loadActivityAccess, saveActivityAccess } from "@/lib/activityAccess";

const ACTIVITIES = [
  { id: "quiz", title: "Quiz Bíblico" },
  { id: "memory", title: "Memória" },
  { id: "coloring", title: "Colorir" },
  { id: "jigsaw", title: "Quebra-Cabeça" },
  { id: "wordsearch", title: "Caça-Palavras" },
  { id: "edu:circles", title: "Pinte os Círculos" },
  { id: "edu:connect", title: "Ligue as Cores" },
  { id: "maze", title: "Labirinto" },
  { id: "crossword", title: "Cruzadinha Bíblica" },
  { id: "wordbuilder", title: "Construtor de Palavras" },
  { id: "connectdots", title: "Ligue os Pontos" },
  { id: "assemble", title: "Monte e Descubra" },
];

const GROUPS: { id: ContentGroup; label: string; items: { id: string; title: string }[] }[] = [
  { id: "secoes", label: "Páginas do site", items: SITE_SECTIONS },
  { id: "atividades", label: "Atividades", items: ACTIVITIES },
  { id: "jogos", label: "Jogos Bíblicos", items: SITE_GAMES },
];

export default function ContentAccessConfig() {
  const [range, setRange] = useState<ActivityAgeRange>("criancas");
  const [group, setGroup] = useState<ContentGroup>("secoes");
  const [map, setMap] = useState<ContentAccessMap>(() => loadContentAccess());
  const selectedGroup = useMemo(() => GROUPS.find((item) => item.id === group) ?? GROUPS[0], [group]);
  const allIds = selectedGroup.items.map((item) => item.id);
  const current = map[group]?.[range] ?? allIds;

  const setCurrent = (ids: string[]) => {
    setMap((old) => ({ ...old, [group]: { ...old[group], [range]: ids } }));
  };

  const toggle = (id: string) => setCurrent(current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const save = () => {
    saveContentAccess(map);
    const activityMap = loadActivityAccess();
    const configuredActivities = map.atividades ?? {};
    saveActivityAccess({ ...activityMap, ...configuredActivities });
    toast.success("Conteúdo por faixa etária atualizado! ✅");
  };

  return (
    <section className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6" aria-labelledby="content-age-title">
      <h2 id="content-age-title" className="font-display text-lg font-bold text-foreground">Conteúdo por faixa etária</h2>
      <p className="font-body text-xs text-muted-foreground mt-1 mb-4">Escolha o que cada faixa poderá acessar. Esta área aparece somente para o administrador.</p>

      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Faixas etárias">
        {ACTIVITY_AGE_RANGES.map((item) => (
          <button key={item.id} type="button" onClick={() => setRange(item.id)} className={`px-3 py-2 rounded-full font-display text-xs font-bold border transition ${range === item.id ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary"}`}>
            {item.emoji} {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4" role="tablist" aria-label="Tipos de conteúdo">
        {GROUPS.map((item) => (
          <button key={item.id} type="button" onClick={() => setGroup(item.id)} className={`min-h-11 px-2 py-2 rounded-lg font-display text-xs font-bold border transition ${group === item.id ? "bg-secondary text-secondary-foreground border-secondary" : "bg-background text-foreground border-border hover:border-secondary"}`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        {selectedGroup.items.map((item) => (
          <label key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 cursor-pointer hover:border-primary">
            <input type="checkbox" checked={current.includes(item.id)} onChange={() => toggle(item.id)} className="w-4 h-4 accent-emerald-600" />
            <span className="font-body text-sm text-foreground">{item.title}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <button type="button" onClick={() => setCurrent(allIds)} className="px-4 py-2 rounded-full border border-border font-display text-xs font-bold hover:border-primary">Liberar todos</button>
        <button type="button" onClick={() => setCurrent([])} className="px-4 py-2 rounded-full border border-border font-display text-xs font-bold hover:border-primary">Bloquear todos</button>
        <button type="button" onClick={save} className="btn-cartoon px-6 py-2 text-sm">Salvar alterações</button>
      </div>
    </section>
  );
}
