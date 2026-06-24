import { filmesVideos, seriesGroups, type BibleVideo, type BibleVideoGroup } from "@/data/bibleVideos";
import moises3d from "@/assets/lemos-play/moises-3d.png.asset.json";
import jonasBaleia from "@/assets/lemos-play/jonas-e-a-baleia.png.asset.json";
import abraaoObediencia from "@/assets/lemos-play/abraao-e-a-obediencia.png.asset.json";
import abraaoTesteThumb from "@/assets/lemos-play/abraao-e-o-teste.png.asset.json";
import provadosPeloFogoThumb from "@/assets/lemos-play/provados-pelo-fogo.png.asset.json";
import esauEJacoThumb from "@/assets/lemos-play/esau-e-jaco.png.asset.json";
import joThumb from "@/assets/lemos-play/jo.png.asset.json";
import danielLeoes from "@/assets/lemos-play/daniel-na-cova-dos-leoes.png.asset.json";
import doMeuJeito3d from "@/assets/lemos-play/do-meu-jeito-3d.png.asset.json";
import paiEFilhoThumb from "@/assets/lemos-play/pai-e-filho.png.asset.json";
import umDeNosThumb from "@/assets/lemos-play/e-se-ele-fosse-um-de-nos.png.asset.json";
import espiritoSantoThumb from "@/assets/lemos-play/espirito-santo-i.png.asset.json";
import serFielThumb from "@/assets/lemos-play/ser-fiel-thumb.png.asset.json";
import gracaAleluiaThumb from "@/assets/lemos-play/graca-aleluia.png.asset.json";
import palavraEternaThumb from "@/assets/lemos-play/palavra-eterna.png.asset.json";
import curaParaliticoThumb from "@/assets/lemos-play/cura-paralitico-thumb.png.asset.json";
import aTempestadeThumb from "@/assets/lemos-play/a-tempestade-thumb.png.asset.json";
import expulsaDemoniosThumb from "@/assets/lemos-play/jesus-expulsa-demonios-thumb.png.asset.json";
import eleVive1Thumb from "@/assets/lemos-play/ele-vive-parte1-thumb.png.asset.json";
import eleVive2Thumb from "@/assets/lemos-play/ele-vive-parte2-thumb.png.asset.json";
import eleVive3Thumb from "@/assets/lemos-play/ele-vive-parte3-thumb.png.asset.json";
import doMeuJeitoVid from "@/assets/lemos-play/do-meu-jeito.mp4.asset.json";
import paiEFilhoVid from "@/assets/lemos-play/pai-e-filho.mp4.asset.json";
import umDeNosVid from "@/assets/lemos-play/um-de-nos.mp4.asset.json";
import entraCasaVid from "@/assets/lemos-play/entra-na-minha-casa.mp4.asset.json";
import espiritoSantoVid from "@/assets/lemos-play/espirito-santo.mp4.asset.json";
import aleluiaVid from "@/assets/lemos-play/aleluia.mp4.asset.json";
import palavraEternaVid from "@/assets/lemos-play/palavra-eterna.mp4.asset.json";
import souFielVid from "@/assets/lemos-play/sou-fiel.mp4.asset.json";
import fazMilagreVid from "@/assets/lemos-play/faz-um-milagre-em-mim.mp4.asset.json";
import ressuscitaMeVid from "@/assets/lemos-play/ressuscita-me.mp4.asset.json";
import fazMilagreThumb from "@/assets/lemos-play/faz-um-milagre-em-mim.png.asset.json";
import ressuscitaMeThumb from "@/assets/lemos-play/ressuscita-me.png.asset.json";

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

const KEY = "lemos_play_config_v24";
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
  "Jesus Expulsa Demônios": expulsaDemoniosThumb.url,
  "Ele Vive — Parte I": eleVive1Thumb.url,
  "Ele Vive — Parte II": eleVive2Thumb.url,
  "Ele Vive — Parte III": eleVive3Thumb.url,
};

const defaultMusicas: PlayEntry[] = [
  { id: "m1", title: "Do meu Jeito", src: doMeuJeitoVid.url, poster: attachedThumbByTitle["Do meu Jeito"] },
  { id: "m2", title: "Pai e Filho", src: paiEFilhoVid.url, poster: attachedThumbByTitle["Pai e Filho"] },
  { id: "m3", title: "Um de Nós", src: umDeNosVid.url, poster: attachedThumbByTitle["Um de Nós"] },
];

const defaultLouvores: PlayEntry[] = [
  { id: "lv1", title: "Faz um Milagre em Mim", src: fazMilagreVid.url, poster: attachedThumbByTitle["Faz um Milagre em Mim"] },
  { id: "lv2", title: "Ressuscita-Me", src: ressuscitaMeVid.url, poster: attachedThumbByTitle["Ressuscita-Me"] },
  { id: "lv3", title: "Espírito Santo", src: espiritoSantoVid.url, poster: attachedThumbByTitle["Espírito Santo"] },
  { id: "lv4", title: "Sou Fiel", src: souFielVid.url, poster: attachedThumbByTitle["Sou Fiel"] },
  { id: "lv5", title: "Graça Aleluia", src: aleluiaVid.url, poster: attachedThumbByTitle["Graça Aleluia"] },
  { id: "lv6", title: "Palavra Eterna", src: palavraEternaVid.url, poster: attachedThumbByTitle["Palavra Eterna"] },
];

function resolvePoster(title: string, fallback?: string): string | undefined {
  return attachedThumbByTitle[title] ?? fallback;
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

const normalizeItemsWithDefaults = (items: PlayEntry[], defaultsById: Map<string, PlayEntry>) =>
  items.map((item) => {
    const fallback = defaultsById.get(item.id);
    return {
      ...item,
      poster: resolvePoster(item.title, item.poster ?? fallback?.poster),
    };
  });

const mergeById = (userItems: PlayEntry[], defaults: PlayEntry[]): PlayEntry[] => {
  const map = new Map<string, PlayEntry>();
  defaults.forEach((d) => map.set(d.id, d));
  userItems.forEach((u) => {
    const ex = map.get(u.id);
    if (ex) {
      // Prefer default src whenever it exists — user-saved empty/stale links
      // should never override a working CDN URL bundled with the app.
      const src = ex.src && ex.src.trim() ? ex.src : (u.src || "");
      map.set(u.id, { ...ex, ...u, src, poster: resolvePoster(u.title || ex.title, u.poster ?? ex.poster) });
    } else {
      map.set(u.id, { ...u, poster: resolvePoster(u.title, u.poster) });
    }
  });
  return Array.from(map.values());
};

const repairConfig = (cfg: LemosPlayConfig, def: LemosPlayConfig): LemosPlayConfig => {
  const defaultsById = new Map(flattenDefaults(def).map((item) => [item.id, item]));
  const norm = (items: PlayEntry[]) => normalizeItemsWithDefaults(items, defaultsById);
  return {
    filmes: mergeById(norm(cfg.filmes), def.filmes),
    musicas: mergeById(norm(cfg.musicas), def.musicas),
    louvores: mergeById(norm(cfg.louvores), def.louvores),
    series: (() => {
      const out = new Map<string, SeriesGroupCfg>();
      def.series.forEach((g) => out.set(g.id, g));
      cfg.series.forEach((g) => {
        const ex = out.get(g.id);
        const merged: SeriesGroupCfg = ex
          ? { ...ex, ...g, icon: resolvePoster(g.title || ex.title, g.icon ?? ex.icon), videos: mergeById(norm(g.videos), ex.videos) }
          : { ...g, icon: resolvePoster(g.title, g.icon), videos: norm(g.videos) };
        out.set(g.id, merged);
      });
      return Array.from(out.values());
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
