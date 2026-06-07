import { filmesVideos, seriesGroups, type BibleVideo, type BibleVideoGroup } from "@/data/bibleVideos";

export interface PlayEntry {
  id: string;
  title: string;
  src: string; // full iframe embed url
  poster?: string; // optional image url
}

export interface SeriesGroupCfg {
  id: string;
  title: string;
  icon?: string;
  videos: PlayEntry[];
}

export interface LemosPlayConfig {
  filmes: PlayEntry[];
  series: SeriesGroupCfg[];
  musicas: PlayEntry[];
  louvores: PlayEntry[];
}

const KEY = "lemos_play_config_v1";
const LOCAL_VIDEO = (file: string) => `/videos/${file}`;
const LOCAL_POSTER = (file: string) => `/videos/${file}`;
const UNAVAILABLE_VIDEO = "";

const defaultMusicas: PlayEntry[] = [
  { id: "m1", title: "Do meu Jeito", src: UNAVAILABLE_VIDEO },
  { id: "m2", title: "Pai e Filho", src: UNAVAILABLE_VIDEO },
  { id: "m3", title: "Um de Nós", src: UNAVAILABLE_VIDEO },
];

const defaultLouvores: PlayEntry[] = [
  { id: "lv1", title: "Espírito Santo", src: UNAVAILABLE_VIDEO },
  { id: "lv2", title: "Sou Fiel", src: LOCAL_VIDEO("ser-fiel.mp4") },
  { id: "lv3", title: "Graça Aleluia", src: LOCAL_VIDEO("aleluia.mp4"), poster: LOCAL_POSTER("aleluia-poster.jpg") },
  { id: "lv4", title: "Palavra Eterna", src: LOCAL_VIDEO("palavra-eterna.mp4"), poster: LOCAL_POSTER("palavra-eterna-poster.jpg") },
];

function fromVideo(v: BibleVideo, id: string): PlayEntry {
  return { id, title: v.title, src: v.src, poster: v.icon };
}

function fromGroup(g: BibleVideoGroup, gid: string): SeriesGroupCfg {
  return {
    id: gid,
    title: g.title,
    icon: g.icon,
    videos: g.videos.map((v, i) => fromVideo(v, `${gid}_${i}`)),
  };
}

export function defaultConfig(): LemosPlayConfig {
  return {
    filmes: filmesVideos.map((v, i) => fromVideo(v, `f${i}`)),
    series: seriesGroups.map((g, i) => fromGroup(g, `sg${i}`)),
    musicas: defaultMusicas,
    louvores: defaultLouvores,
  };
}

const flattenDefaults = (cfg: LemosPlayConfig) => [
  ...cfg.filmes,
  ...cfg.musicas,
  ...cfg.louvores,
  ...cfg.series.flatMap((g) => g.videos),
];

const repairBrokenBunnyLinks = (items: PlayEntry[], defaultsById: Map<string, PlayEntry>) =>
  items.map((item) => {
    if (!item.src.includes("iframe.mediadelivery.net")) return item;
    const fallback = defaultsById.get(item.id);
    return fallback ? { ...item, src: fallback.src, poster: item.poster ?? fallback.poster } : { ...item, src: "" };
  });

const repairConfig = (cfg: LemosPlayConfig, def: LemosPlayConfig): LemosPlayConfig => {
  const defaultsById = new Map(flattenDefaults(def).map((item) => [item.id, item]));
  return {
    filmes: repairBrokenBunnyLinks(cfg.filmes, defaultsById),
    musicas: repairBrokenBunnyLinks(cfg.musicas, defaultsById),
    louvores: repairBrokenBunnyLinks(cfg.louvores, defaultsById),
    series: cfg.series.map((group) => ({ ...group, videos: repairBrokenBunnyLinks(group.videos, defaultsById) })),
  };
};

export function loadConfig(): LemosPlayConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw) as Partial<LemosPlayConfig>;
    const def = defaultConfig();
    return repairConfig({
      filmes: parsed.filmes ?? def.filmes,
      series: parsed.series ?? def.series,
      musicas: parsed.musicas ?? def.musicas,
      louvores: parsed.louvores ?? def.louvores,
    }, def);
  } catch {
    return defaultConfig();
  }
}

export function saveConfig(cfg: LemosPlayConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event("lemos_play_config_change"));
}

export function resetConfig() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("lemos_play_config_change"));
}
