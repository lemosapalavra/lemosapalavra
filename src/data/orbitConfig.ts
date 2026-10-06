import iconAssistir from "@/assets/home/icon-assistir-upload.png.asset.json";
import iconEstudo from "@/assets/home/icon-estudo-biblico.png";
import iconAtividades from "@/assets/home/icon-atividades-v2.png";
import iconOracao from "@/assets/home/icon-oracao-upload.png.asset.json";
import iconDevocionais from "@/assets/home/icon-devocionais-upload.png.asset.json";
import iconAlbum from "@/assets/home/icon-album-upload.png.asset.json";
import iconJogos from "@/assets/home/icon-jogos-v2.png";
import iconOuca from "@/assets/icon-louvores.png";

export interface OrbitItem {
  icon: string;
  label: string;
  sublabel?: string;
  route: string;
  hidden?: boolean;
}

const KEY = "lemos_orbit_config_v9";

export function defaultOrbit(): OrbitItem[] {
  return [
    { icon: iconAssistir.url, label: "VEJA", route: "/lemosplay" },
    { icon: iconOuca, label: "OUÇA", route: "/musicas" },
    { icon: iconEstudo, label: "ESTUDO BÍBLICO", route: "/historias-do-dia" },
    { icon: iconAtividades, label: "APRENDA", route: "/atividades" },
    { icon: iconJogos, label: "JOGOS", route: "/jogos" },
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
