// Catálogo dinâmico de vídeos/imagens disponíveis no site para uso no painel admin.
// Fonte da verdade: bibleVideos.ts (filmes + séries) + defaultConfig (músicas/louvores).
import { filmesVideos, seriesGroups } from "@/data/bibleVideos";
import { defaultConfig } from "@/data/lemosPlayConfig";

import moises3d from "@/assets/lemos-play/moises-3d.png.asset.json";
import jonasBaleia from "@/assets/lemos-play/jonas-e-a-baleia.png.asset.json";
import abraaoObediencia from "@/assets/lemos-play/abraao-e-a-obediencia.png.asset.json";
import abraaoTeste from "@/assets/lemos-play/abraao-e-o-teste.png.asset.json";
import provadosFogo from "@/assets/lemos-play/provados-pelo-fogo.png.asset.json";
import esauEJaco from "@/assets/lemos-play/esau-e-jaco.png.asset.json";
import jo from "@/assets/lemos-play/jo.png.asset.json";
import daniel from "@/assets/lemos-play/daniel-na-cova-dos-leoes.png.asset.json";
import doMeuJeito from "@/assets/lemos-play/do-meu-jeito-3d.png.asset.json";
import paiFilho from "@/assets/lemos-play/pai-e-filho.png.asset.json";
import umDeNos from "@/assets/lemos-play/e-se-ele-fosse-um-de-nos.png.asset.json";
import espiritoSanto from "@/assets/lemos-play/espirito-santo-i.png.asset.json";
import serFiel from "@/assets/lemos-play/ser-fiel-thumb.png.asset.json";
import gracaAleluia from "@/assets/lemos-play/graca-aleluia.png.asset.json";
import palavraEterna from "@/assets/lemos-play/palavra-eterna.png.asset.json";
import joseEgitoIcon from "@/assets/lemos-play/jose-egito.png.asset.json";

export interface MediaItem {
  label: string;
  url: string;
  kind: "video" | "image";
  group: string;
}

const buildVideos = (): MediaItem[] => {
  const items: MediaItem[] = [];
  const seen = new Set<string>();
  const push = (m: MediaItem) => {
    if (!m.url || seen.has(m.url)) return;
    seen.add(m.url);
    items.push(m);
  };

  // Filmes
  filmesVideos.forEach((v) =>
    push({ label: v.title, url: v.src, kind: "video", group: `Filmes · ${v.section ?? "Geral"}` }),
  );

  // Séries (agrupadas por série)
  seriesGroups.forEach((g) =>
    g.videos.forEach((v) =>
      push({ label: v.title, url: v.src, kind: "video", group: `Séries · ${g.title}` }),
    ),
  );

  // Músicas & Louvores (a partir do default config)
  try {
    const def = defaultConfig();
    def.musicas.forEach((m) => push({ label: m.title, url: m.src, kind: "video", group: "Músicas" }));
    def.louvores.forEach((m) => push({ label: m.title, url: m.src, kind: "video", group: "Louvores" }));
  } catch {}

  return items;
};

export const availableVideos: MediaItem[] = buildVideos();

export const availablePosters: MediaItem[] = [
  { label: "Moisés 3D", url: moises3d.url, kind: "image", group: "Capas" },
  { label: "Jonas e a Baleia", url: jonasBaleia.url, kind: "image", group: "Capas" },
  { label: "Abraão e a Obediência", url: abraaoObediencia.url, kind: "image", group: "Capas" },
  { label: "Abraão e o Teste", url: abraaoTeste.url, kind: "image", group: "Capas" },
  { label: "Provados pelo Fogo", url: provadosFogo.url, kind: "image", group: "Capas" },
  { label: "Esaú e Jacó", url: esauEJaco.url, kind: "image", group: "Capas" },
  { label: "Jó", url: jo.url, kind: "image", group: "Capas" },
  { label: "Daniel na Cova dos Leões", url: daniel.url, kind: "image", group: "Capas" },
  { label: "José do Egito", url: joseEgitoIcon.url, kind: "image", group: "Capas" },
  { label: "Do meu Jeito", url: doMeuJeito.url, kind: "image", group: "Capas · Música" },
  { label: "Pai e Filho", url: paiFilho.url, kind: "image", group: "Capas · Música" },
  { label: "E se Ele fosse Um de Nós", url: umDeNos.url, kind: "image", group: "Capas · Música" },
  { label: "Espírito Santo", url: espiritoSanto.url, kind: "image", group: "Capas · Louvor" },
  { label: "Sou Fiel", url: serFiel.url, kind: "image", group: "Capas · Louvor" },
  { label: "Graça Aleluia", url: gracaAleluia.url, kind: "image", group: "Capas · Louvor" },
  { label: "Palavra Eterna", url: palavraEterna.url, kind: "image", group: "Capas · Louvor" },
];
