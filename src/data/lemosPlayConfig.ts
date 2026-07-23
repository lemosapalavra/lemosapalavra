import { filmesVideos, seriesGroups, type BibleVideo, type BibleVideoGroup } from "@/data/bibleVideos";
import moises3d from "@/assets/lemos-play/moises-3d.png.asset.json";
import jonasBaleia from "@/assets/lemos-play/jonas-e-a-baleia.png.asset.json";
import abraaoObediencia from "@/assets/lemos-play/abraao-e-a-obediencia.png.asset.json";
import abraaoTesteThumb from "@/assets/lemos-play/abraao-e-o-teste.png.asset.json";
import provadosPeloFogoThumb from "@/assets/lemos-play/provados-pelo-fogo.png.asset.json";
import esauEJacoThumb from "@/assets/lemos-play/esau-e-jaco.png.asset.json";
import joThumb from "@/assets/lemos-play/jo.png.asset.json";
import danielLeoes from "@/assets/lemos-play/daniel-na-cova-dos-leoes.png.asset.json";
import doMeuJeito3d from "@/assets/lemos-play/do-meu-jeito-thumb-v2.png.asset.json";
import paiEFilhoThumb from "@/assets/lemos-play/pai-e-filho-thumb-v2.png.asset.json";
import umDeNosThumb from "@/assets/lemos-play/um-de-nos-thumb-v2.png.asset.json";
import espiritoSantoThumb from "@/assets/lemos-play/espirito-santo-v2.jpg.asset.json";
import serFielThumb from "@/assets/lemos-play/ser-fiel-v2.png.asset.json";
import gracaAleluiaThumb from "@/assets/lemos-play/aleluia-v2.png.asset.json";
import palavraEternaThumb from "@/assets/lemos-play/palavra-eterna-v2.png.asset.json";
import curaParaliticoThumb from "@/assets/lemos-play/cura-paralitico-thumb.png.asset.json";
import aTempestadeThumb from "@/assets/lemos-play/tempestades-v2.png.asset.json";
import expulsaDemoniosThumb from "@/assets/lemos-play/jesus-expulsa-demonios-thumb.png.asset.json";
import doMeuJeitoVid from "@/assets/lemos-play/do-meu-jeito-v2.mp4.asset.json";
import paiEFilhoVid from "@/assets/lemos-play/pai-e-filho-v2.mp4.asset.json";
import umDeNosVid from "@/assets/lemos-play/um-de-nos-v2.mp4.asset.json";
import entraCasaVid from "@/assets/lemos-play/entra-na-minha-casa.mp4.asset.json";
import espiritoSantoVid from "@/assets/lemos-play/espirito-santo.mp4.asset.json";
import aleluiaVid from "@/assets/lemos-play/aleluia.mp4.asset.json";
import palavraEternaVid from "@/assets/lemos-play/palavra-eterna.mp4.asset.json";
import souFielVid from "@/assets/lemos-play/sou-fiel.mp4.asset.json";
import fazMilagreVid from "@/assets/lemos-play/faz-um-milagre-em-mim.mp4.asset.json";
import ressuscitaMeVid from "@/assets/lemos-play/ressuscita-me.mp4.asset.json";
import tempestadesVid from "@/assets/lemos-play/tempestades.mp4.asset.json";
import fazMilagreThumb from "@/assets/lemos-play/faz-milagre-v2.png.asset.json";
import ressuscitaMeThumb from "@/assets/lemos-play/ressuscita-me-v2.png.asset.json";
import deusEstaAquiVid from "@/assets/lemos-play/deus-esta-aqui.mp4.asset.json";
import yeshuaVid from "@/assets/lemos-play/yeshua.mp4.asset.json";
import ressuscitaMe2Vid from "@/assets/lemos-play/ressuscita-me-2.mp4.asset.json";
import deusEstaAquiThumb from "@/assets/lemos-play/deus-esta-aqui-v2.png.asset.json";
import yeshuaThumb from "@/assets/lemos-play/yeshua-v3.png.asset.json";
import oAdorareiVid from "@/assets/lemos-play/o-adorarei.mp4.asset.json";
import oAdorareiThumb from "@/assets/lemos-play/o-adorarei.png.asset.json";
import meuQueridoSenhorVid from "@/assets/lemos-play/meu-querido-senhor.mp4.asset.json";
import meuQueridoSenhorThumb from "@/assets/lemos-play/meu-querido-senhor.png.asset.json";
import yeshua2Vid from "@/assets/lemos-play/yeshua-2.mp4.asset.json";
import yeshua3Thumb from "@/assets/lemos-play/yeshua-3.png.asset.json";

export interface PlayEntry {
  id: string;
  title: string;
  src: string; // full iframe embed url
  poster?: string; // optional image url
  section?: string;
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

const KEY = "lemos_play_config_v58";
const LOCAL_VIDEO = (file: string) => `/videos/${file}`;
const LOCAL_POSTER = (file: string) => `/videos/${file}`;
const UNAVAILABLE_VIDEO = "";


const attachedThumbByTitle: Record<string, string> = {
  "Moisés": moises3d.url,
  "Jonas e a Baleia": jonasBaleia.url,
  "Abraão e a Obediência": abraaoObediencia.url,
  "Abraão e o Teste": abraaoTesteThumb.url,
  "Provados pelo fogo": provadosPeloFogoThumb.url,
  "Provados pelo Fogo": provadosPeloFogoThumb.url,
  "Esau e Jacó": esauEJacoThumb.url,
  "Esaú e Jacó": esauEJacoThumb.url,
  "Jó": joThumb.url,
  "Daniel na Cova dos Leões": danielLeoes.url,
  "Do meu Jeito": doMeuJeito3d.url,
  "Pai e Filho": paiEFilhoThumb.url,
  "Um de Nós": umDeNosThumb.url,
  "E se Ele Fosse Um de Nós": umDeNosThumb.url,
  "Espírito Santo": espiritoSantoThumb.url,
  "Espirito Santo": espiritoSantoThumb.url,
  "Sou Fiel": serFielThumb.url,
  "Graça Aleluia": gracaAleluiaThumb.url,
  "Graca Aleluia": gracaAleluiaThumb.url,
  "Palavra Eterna": palavraEternaThumb.url,
  "Faz um Milagre em Mim": fazMilagreThumb.url,
  "Ressuscita-Me": ressuscitaMeThumb.url,
  "Ressuscita Me": ressuscitaMeThumb.url,
  "A Cura do Paralítico": curaParaliticoThumb.url,
  "A Tempestade": aTempestadeThumb.url,
  "Tempestades": aTempestadeThumb.url,
  "Jesus Expulsa Demônios": expulsaDemoniosThumb.url,
};

const defaultMusicas: PlayEntry[] = [
  { id: "m4", title: "Meu Querido Senhor", src: meuQueridoSenhorVid.url, poster: meuQueridoSenhorThumb.url, section: "Músicas" },
  { id: "m1", title: "Do meu Jeito", src: doMeuJeitoVid.url, poster: attachedThumbByTitle["Do meu Jeito"], section: "Músicas" },
  { id: "m2", title: "Pai e Filho", src: paiEFilhoVid.url, poster: attachedThumbByTitle["Pai e Filho"], section: "Músicas" },
  { id: "m3", title: "Um de Nós", src: umDeNosVid.url, poster: attachedThumbByTitle["Um de Nós"], section: "Músicas" },
];

const defaultLouvores: PlayEntry[] = [
  { id: "lv1", title: "Faz um Milagre em Mim", src: fazMilagreVid.url, poster: attachedThumbByTitle["Faz um Milagre em Mim"], section: "Louvores" },
  
  { id: "lv4", title: "Sou Fiel", src: souFielVid.url, poster: attachedThumbByTitle["Sou Fiel"], section: "Louvores" },
  { id: "lv5", title: "Graça Aleluia", src: aleluiaVid.url, poster: attachedThumbByTitle["Graça Aleluia"], section: "Louvores" },
  { id: "lv6", title: "Palavra Eterna", src: palavraEternaVid.url, poster: attachedThumbByTitle["Palavra Eterna"], section: "Louvores" },
  { id: "lv7", title: "Tempestades", src: tempestadesVid.url, poster: aTempestadeThumb.url, section: "Louvores" },
  { id: "lv8", title: "Deus Está Aqui", src: deusEstaAquiVid.url, poster: deusEstaAquiThumb.url, section: "Louvores" },
  { id: "lv9", title: "Yeshua", src: yeshua2Vid.url, poster: yeshua3Thumb.url, section: "Louvores" },
  { id: "lv10", title: "Ressuscita-Me (Versão 2)", src: ressuscitaMe2Vid.url, poster: ressuscitaMeThumb.url, section: "Louvores" },
  { id: "lv11", title: "O Adorarei", src: oAdorareiVid.url, poster: oAdorareiThumb.url, section: "Louvores" },
];

function resolvePoster(title: string, fallback?: string): string | undefined {
  // User-provided poster wins; only fall back to attached thumbs when empty.
  if (fallback && fallback.trim()) return fallback;
  return attachedThumbByTitle[title];
}

function fromVideo(v: BibleVideo, id: string): PlayEntry {
  return { id, title: v.title, src: v.src, poster: resolvePoster(v.title, v.icon), section: v.section };
}


function fromGroup(g: BibleVideoGroup, gid: string): SeriesGroupCfg {
  return {
    id: gid,
    title: g.title,
    icon: resolvePoster(g.title, g.icon),
    videos: g.videos.map((v, i) => fromVideo(v, `${gid}_${i}`)),
  };
}

export function defaultConfig(): LemosPlayConfig {
  return {
    filmes: filmesVideos.map((v, i) => fromVideo(v, `f${i}`)),
    series: seriesGroups.map((g, i) => fromGroup(g, `s${i}`)),
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

const normalizeItemsWithDefaults = (items: PlayEntry[], defaultsById: Map<string, PlayEntry>) =>
  items.map((item) => ({ ...item }));

const mergeById = (userItems: PlayEntry[], defaults: PlayEntry[]): PlayEntry[] => {
  const map = new Map<string, PlayEntry>();
  defaults.forEach((d) => map.set(d.id, d));
  userItems.forEach((u) => {
    const ex = map.get(u.id);
    if (ex) {
      // User edits take precedence for title, src, poster, and section. Defaults
      // only fill in fields the user left blank. This way changes made via the
      // Lemos Play admin panel persist on the site until the user resets.
      map.set(u.id, {
        ...ex,
        ...u,
        title: u.title?.trim() ? u.title : ex.title,
        src: u.src?.trim() ? u.src : ex.src,
        poster: u.poster?.trim() ? u.poster : (ex.poster ?? resolvePoster(u.title || ex.title)),
        section: u.section ?? ex.section,
      });
    } else {
      map.set(u.id, { ...u, poster: u.poster?.trim() ? u.poster : resolvePoster(u.title) });
    }
  });
  // Preserve user's ordering when items exist there; append new defaults at the end.
  const ordered: PlayEntry[] = [];
  const seen = new Set<string>();
  userItems.forEach((u) => { const it = map.get(u.id); if (it) { ordered.push(it); seen.add(u.id); } });
  defaults.forEach((d) => { if (!seen.has(d.id)) { const it = map.get(d.id); if (it) { ordered.push(it); seen.add(d.id); } } });
  return ordered;
};

const repairConfig = (cfg: LemosPlayConfig, def: LemosPlayConfig): LemosPlayConfig => {
  const defaultsById = new Map(flattenDefaults(def).map((item) => [item.id, item]));
  const norm = (items: PlayEntry[]) => normalizeItemsWithDefaults(items, defaultsById);
  return {
    filmes: mergeById(norm(cfg.filmes), def.filmes),
    musicas: mergeById(norm(cfg.musicas), def.musicas),
    louvores: mergeById(norm(cfg.louvores), def.louvores),
    series: (() => {
      const out: SeriesGroupCfg[] = def.series.map((g) => {
        const userG = cfg.series.find((s) => s.id === g.id);
        return {
          ...g,
          title: userG?.title?.trim() ? userG.title : g.title,
          icon: userG?.icon?.trim() ? userG.icon : resolvePoster(g.title, g.icon),
          videos: mergeById(userG ? norm(userG.videos) : [], g.videos),
        };
      });
      return out;
    })(),
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
