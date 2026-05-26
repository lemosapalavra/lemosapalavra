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

const defaultMusicas: PlayEntry[] = [
  { id: "m1", title: "Do meu Jeito", src: "https://iframe.mediadelivery.net/embed/660719/6400db8d-69e9-4b99-8c19-9a512f714662?autoplay=true&preload=true" },
  { id: "m2", title: "Pai e Filho", src: "https://iframe.mediadelivery.net/embed/660719/c1358bec-0118-4db8-8b34-8dce8c765fe2?autoplay=true&preload=true" },
  { id: "m3", title: "Um de Nós", src: "https://iframe.mediadelivery.net/embed/660719/4a4cfdb3-e26c-4dc9-9363-f045feca99be?autoplay=true&preload=true" },
];

const defaultLouvores: PlayEntry[] = [
  { id: "lv1", title: "Espírito Santo", src: "https://iframe.mediadelivery.net/embed/660653/ed00cfd9-9b30-4803-bf53-8070ec0b5be9?autoplay=true&preload=true" },
  { id: "lv2", title: "Sou Fiel", src: "https://iframe.mediadelivery.net/embed/660653/2336364c-8169-4926-ac1a-1fc6baa6a0c5?autoplay=true&preload=true" },
  { id: "lv3", title: "Graça Aleluia", src: "https://iframe.mediadelivery.net/embed/660653/ae17b103-e921-4ebb-bb23-2ae690c2e5a5?autoplay=true&preload=true" },
  { id: "lv4", title: "Palavra Eterna", src: "https://iframe.mediadelivery.net/embed/660653/49bd5ac8-4537-45f6-9b25-d8af4da7d099?autoplay=true&preload=true" },
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

export function loadConfig(): LemosPlayConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw) as Partial<LemosPlayConfig>;
    const def = defaultConfig();
    return {
      filmes: parsed.filmes ?? def.filmes,
      series: parsed.series ?? def.series,
      musicas: parsed.musicas ?? def.musicas,
      louvores: parsed.louvores ?? def.louvores,
    };
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
