import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { SITE_ICONS, loadHiddenIcons, setIconHidden } from "@/lib/iconVisibility";
import { loadOrbit, saveOrbit, type OrbitItem } from "@/data/orbitConfig";

/** Liga/desliga cada ícone do site (menu da página inicial e ícones fixos). */
export default function IconVisibilityConfig() {
  const [hidden, setHidden] = useState<string[]>(() => loadHiddenIcons());
  const [orbit, setOrbit] = useState<OrbitItem[]>(() => loadOrbit());

  useEffect(() => {
    const h = () => setOrbit(loadOrbit());
    window.addEventListener("lemos_orbit_change", h);
    return () => window.removeEventListener("lemos_orbit_change", h);
  }, []);

  const toggleOrbit = (i: number, on: boolean) => {
    const next = orbit.map((it, idx) => (idx === i ? { ...it, hidden: !on } : it));
    saveOrbit(next);
    setOrbit(next);
  };

  const toggleIcon = (id: string, on: boolean) => {
    setIconHidden(id, !on);
    setHidden(loadHiddenIcons());
  };

  const Row = ({ label, on, onChange, icon }: { label: string; on: boolean; onChange: (v: boolean) => void; icon?: string }) => (
    <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 cursor-pointer">
      {icon && <img src={icon} alt="" className="h-9 w-9 rounded-full object-contain" />}
      <span className="flex-1 font-body text-sm text-foreground">{label}</span>
      <span className="text-xs font-display font-bold text-muted-foreground">{on ? "Ativo" : "Desativado"}</span>
      <Switch checked={on} onCheckedChange={onChange} aria-label={`Ativar ${label}`} />
    </label>
  );

  return (
    <section className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
      <h2 className="font-display text-lg font-bold text-foreground">Ícones do site</h2>
      <p className="font-body text-xs text-muted-foreground mt-1 mb-4">Ative ou desative cada ícone. A mudança vale na hora.</p>
      <p className="font-display text-xs font-bold mb-2">Menu da página inicial</p>
      <div className="grid sm:grid-cols-2 gap-2 mb-4">
        {orbit.map((it, i) => (
          <Row key={i} label={it.label} icon={it.icon} on={!it.hidden} onChange={(v) => toggleOrbit(i, v)} />
        ))}
      </div>
      <p className="font-display text-xs font-bold mb-2">Outros ícones</p>
      <div className="grid sm:grid-cols-2 gap-2">
        {SITE_ICONS.map((it) => (
          <Row key={it.id} label={it.title} on={!hidden.includes(it.id)} onChange={(v) => toggleIcon(it.id, v)} />
        ))}
      </div>
    </section>
  );
}
