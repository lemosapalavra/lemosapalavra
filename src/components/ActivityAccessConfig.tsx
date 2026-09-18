import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  ACTIVITY_AGE_RANGES,
  ActivityAccessMap,
  ActivityAgeRange,
  loadActivityAccess,
  saveActivityAccess,
} from "@/lib/activityAccess";

type Props = {
  open: boolean;
  onClose: () => void;
  activities: { id: string; title: string }[];
};

/** Painel exclusivo do administrador: liga/desliga atividades por faixa etária. */
export default function ActivityAccessConfig({ open, onClose, activities }: Props) {
  const [map, setMap] = useState<ActivityAccessMap>({});
  const [range, setRange] = useState<ActivityAgeRange>("criancas");

  useEffect(() => {
    if (open) setMap(loadActivityAccess());
  }, [open]);

  if (!open) return null;

  const allIds = activities.map((a) => a.id);
  const current = map[range] ?? allIds;
  const isOn = (id: string) => current.includes(id);

  const toggle = (id: string) => {
    const next = isOn(id) ? current.filter((x) => x !== id) : [...current, id];
    setMap((m) => ({ ...m, [range]: next }));
  };

  const setAll = (on: boolean) => setMap((m) => ({ ...m, [range]: on ? allIds : [] }));

  const save = () => {
    saveActivityAccess(map);
    toast.success("Atividades liberadas atualizadas! ✅");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-popover w-full max-w-lg rounded-2xl border-2 border-primary/40 shadow-2xl p-4 my-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="font-display font-extrabold text-lg text-foreground">
            ⚙️ Atividades por faixa etária
          </h2>
          <button onClick={onClose} aria-label="Fechar" title="Fechar" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {ACTIVITY_AGE_RANGES.map((a) => (
            <button
              key={a.id}
              onClick={() => setRange(a.id)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold transition ${
                range === a.id ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground hover:border-primary"
              }`}
            >
              {a.emoji} {a.label}
            </button>
          ))}
        </div>

        <div className="grid gap-2 max-h-[45vh] overflow-y-auto pr-1">
          {activities.map((a) => (
            <label key={a.id} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 cursor-pointer hover:border-primary">
              <input type="checkbox" checked={isOn(a.id)} onChange={() => toggle(a.id)} className="w-4 h-4 accent-emerald-600" />
              <span className="font-body text-sm text-foreground">{a.title}</span>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <button onClick={() => setAll(true)} className="px-4 py-2 rounded-full border border-border font-display text-xs font-bold hover:border-primary">Liberar todas</button>
          <button onClick={() => setAll(false)} className="px-4 py-2 rounded-full border border-border font-display text-xs font-bold hover:border-primary">Bloquear todas</button>
          <button onClick={save} className="btn-cartoon px-6 py-2.5 text-sm">💾 Salvar</button>
        </div>
      </div>
    </div>
  );
}
