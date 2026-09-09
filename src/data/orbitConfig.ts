import iconAtividades from "@/assets/icon-atividades.png";
import iconAlbum from "@/assets/icon-album.png";
import iconHistoriasDia from "@/assets/historias/icone-historias.png.asset.json";
import iconPedidos from "@/assets/icon-pedidos-oracao.png";
import lemosPlayLogo from "@/assets/lemos-play-logo.png";

export interface OrbitItem {
  icon: string;
  label: string;
  sublabel?: string;
  route: string;
}

const KEY = "lemos_orbit_config_v6";

export function defaultOrbit(): OrbitItem[] {
  return [
    { icon: lemosPlayLogo, label: "ASSISTA", sublabel: "Filmes, Séries, Louvores", route: "/lemosplay" },
    { icon: iconAlbum, label: "ÁLBUM", sublabel: "Colecione os Heróis da Fé", route: "/album" },
    { icon: iconHistoriasDia.url, label: "HISTÓRIAS", sublabel: "Duas histórias novas por dia", route: "/historias-do-dia" },
    { icon: iconPedidos, label: "PEDIDOS\nDE ORAÇÃO", sublabel: "Fale com Deus", route: "/pedidos-oracao" },
    { icon: iconAtividades, label: "ATIVIDADES", sublabel: "Atividades Educativas", route: "/atividades" },
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
