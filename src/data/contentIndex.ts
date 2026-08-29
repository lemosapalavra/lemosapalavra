import { filmesVideos, seriesGroups } from "./bibleVideos";
import { louvores } from "./louvores";
import { defaultMusicas } from "./lemosPlayConfig";

/** Títulos de todos os vídeos do Lemos Play (filmes + séries). */
export const lemosPlayTitles: string[] = [
  ...filmesVideos.map((v) => v.title),
  ...seriesGroups.flatMap((g) => g.videos.map((v) => v.title)),
];

/** Títulos das músicas e louvores. */
export const louvoresTitles: string[] = [
  ...louvores.map((l) => l.title),
  ...defaultMusicas.map((m) => m.title),
];
