import iconAssistir from "@/assets/home/veja.png.asset.json";
import iconAtividades from "@/assets/home/aprenda.png.asset.json";
import iconAlbum from "@/assets/home/album.png.asset.json";
import iconOuca from "@/assets/home/ouca.png.asset.json";

export interface OrbitItem {
  icon: string;
  label: string;
  sublabel?: string;
  route: string;
  hidden?: boolean;
}

const KEY = "lemos_orbit_config_v10";

export function defaultOrbit(): OrbitItem[] {
  return [
    { icon: iconAssistir.url, label: "VEJA", route: "/lemosplay" },
    { icon: iconOuca.url, label: "OUÇA", route: "/musicas" },
    { icon: iconAtividades.url, label: "APRENDA", route: "/atividades" },
    { icon: iconAlbum.url, label: "ÁLBUM", route: "/album" },
    { icon: "/home/faca.png", label: "FAÇA", route: "/atividades" },
  ];
}

export function loadOrbit(): OrbitItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultOrbit();
    const parsed = JSON.parse(raw) as Partial<OrbitItem>[];
    const def = defaultOrbit();
    // NEVER trust stored icon URLs — only labels/sublabels/routes/hidden are editable.
    return def.map((d, i) => ({
      ...d,
      label: parsed[i]?.label ?? d.label,
      sublabel: parsed[i]?.sublabel ?? d.sublabel,
      route: parsed[i]?.route ?? d.route,
      hidden: parsed[i]?.hidden ?? false,
    }));
  } catch {
    return defaultOrbit();
  }
}

export function saveOrbit(items: OrbitItem[]) {
  const editable = items.map((it) => ({ label: it.label, sublabel: it.sublabel, route: it.route, hidden: !!it.hidden }));
  localStorage.setItem(KEY, JSON.stringify(editable));
  window.dispatchEvent(new Event("lemos_orbit_change"));
}

export function resetOrbit() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("lemos_orbit_change"));
}
