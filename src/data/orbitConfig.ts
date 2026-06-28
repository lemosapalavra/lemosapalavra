import iconAtividades from "@/assets/icon-atividades.png";
import iconAlbum from "@/assets/icon-album.png";
import iconDevocionais from "@/assets/icon-devocionais.png";
import iconPedidos from "@/assets/icon-pedidos-oracao.png";
import lemosPlayLogo from "@/assets/lemos-play-logo.png";

export interface OrbitItem {
  icon: string;
  label: string;
  sublabel?: string;
  route: string;
}

const KEY = "lemos_orbit_config_v2";

export function defaultOrbit(): OrbitItem[] {
  return [
    { icon: lemosPlayLogo, label: "HISTÓRIAS", sublabel: "Filmes, Séries e Músicas", route: "/lemosplay" },
    { icon: iconAlbum, label: "ÁLBUM", sublabel: "Heróis da Fé", route: "/album" },
    { icon: iconDevocionais, label: "DEVOCIONAIS", route: "/devocionais" },
    { icon: iconPedidos, label: "PEDIDOS\nDE ORAÇÃO", route: "/pedidos-oracao" },
    { icon: iconAtividades, label: "ATIVIDADES\nEDUCACIONAIS", route: "/atividades" },
  ];
}

export function loadOrbit(): OrbitItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultOrbit();
    const parsed = JSON.parse(raw) as Partial<OrbitItem>[];
    const def = defaultOrbit();
    return def.map((d, i) => ({
      ...d,
      ...parsed[i],
    }));
  } catch {
    return defaultOrbit();
  }
}

export function saveOrbit(items: OrbitItem[]) {
  // store only editable fields to keep default icons
  const editable = items.map((it) => ({
    label: it.label,
    sublabel: it.sublabel,
    route: it.route,
    icon: it.icon,
  }));
  localStorage.setItem(KEY, JSON.stringify(editable));
  window.dispatchEvent(new Event("lemos_orbit_change"));
}

export function resetOrbit() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("lemos_orbit_change"));
}
