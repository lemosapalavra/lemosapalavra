import iconAssistir from "@/assets/home/icon-assistir-upload.png.asset.json";
import iconHistorias from "@/assets/home/icon-historias-upload.png.asset.json";
import iconAtividades from "@/assets/home/icon-atividades-upload.png.asset.json";
import iconOracao from "@/assets/home/icon-oracao-upload.png.asset.json";
import iconDevocionais from "@/assets/home/icon-devocionais-upload.png.asset.json";
import iconAlbum from "@/assets/home/icon-album-upload.png.asset.json";
import iconJogos from "@/assets/home/icone-jogos.png.asset.json";

export interface OrbitItem {
  icon: string;
  label: string;
  sublabel?: string;
  route: string;
}

const KEY = "lemos_orbit_config_v7";

export function defaultOrbit(): OrbitItem[] {
  return [
    { icon: iconAssistir.url, label: "ASSISTIR", route: "/lemosplay" },
    { icon: iconHistorias.url, label: "HISTÓRIAS BÍBLICAS", route: "/historias-do-dia" },
    { icon: iconAtividades.url, label: "ATIVIDADES", route: "/atividades" },
    { icon: iconJogos.url, label: "JOGOS", route: "/jogos" },
    { icon: iconOracao.url, label: "ORAÇÃO", route: "/pedidos-oracao" },
    { icon: iconDevocionais.url, label: "DEVOCIONAIS", route: "/devocionais" },
    { icon: iconAlbum.url, label: "ÁLBUM", route: "/album" },
  ];
}

export function loadOrbit(): OrbitItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultOrbit();
    const parsed = JSON.parse(raw) as Partial<OrbitItem>[];
    const def = defaultOrbit();
    // NEVER trust stored icon URLs — bundler hashes change on every build,
    // so an older cached URL will 404. Only labels/sublabels/routes are editable.
    return def.map((d, i) => ({
      ...d,
      label: parsed[i]?.label ?? d.label,
      sublabel: parsed[i]?.sublabel ?? d.sublabel,
      route: parsed[i]?.route ?? d.route,
    }));
  } catch {
    return defaultOrbit();
  }
}

export function saveOrbit(items: OrbitItem[]) {
  // Store only editable fields — never the icon URL (see loadOrbit).
  const editable = items.map((it) => ({
    label: it.label,
    sublabel: it.sublabel,
    route: it.route,
  }));
  localStorage.setItem(KEY, JSON.stringify(editable));
  window.dispatchEvent(new Event("lemos_orbit_change"));
}

export function resetOrbit() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("lemos_orbit_change"));
}
