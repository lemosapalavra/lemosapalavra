// Catálogo de vídeos/imagens já disponíveis no site para uso no painel admin.
import vidCriacao from "@/assets/lemos-play/a-criacao.mp4.asset.json";
import vidBatalha from "@/assets/lemos-play/a-batalha-dos-anjos.mp4.asset.json";
import vid10mFilme from "@/assets/lemos-play/10-mandamentos-filme.mp4.asset.json";
import vidEJ1 from "@/assets/lemos-play/esau-jaco-1.mp4.asset.json";
import vidEJ2 from "@/assets/lemos-play/esau-jaco-2.mp4.asset.json";
import vidEJ3 from "@/assets/lemos-play/esau-jaco-3.mp4.asset.json";
import vidJose1 from "@/assets/lemos-play/jose-egito-1.mp4.asset.json";
import vidJose2 from "@/assets/lemos-play/jose-egito-2.mp4.asset.json";
import vidJose3 from "@/assets/lemos-play/jose-egito-3.mp4.asset.json";
import vidJo1 from "@/assets/lemos-play/jo-1.mp4.asset.json";
import vidJo2 from "@/assets/lemos-play/jo-2.mp4.asset.json";
import vidJo3 from "@/assets/lemos-play/jo-3.mp4.asset.json";
import vidDavi1 from "@/assets/lemos-play/davi-golias-1.mp4.asset.json";
import vidDavi2 from "@/assets/lemos-play/davi-golias-2.mp4.asset.json";
import vidAdaoEva from "@/assets/lemos-play/adao-eva.mp4.asset.json";
import vidNoeArcaFilme from "@/assets/lemos-play/noe-arca-filme.mp4.asset.json";
import vidMoises1 from "@/assets/lemos-play/moises-1.mp4.asset.json";
import vidMoises2 from "@/assets/lemos-play/moises-2.mp4.asset.json";
import vidMoises3 from "@/assets/lemos-play/moises-3.mp4.asset.json";

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

export const availableVideos: MediaItem[] = [
  { label: "A Criação", url: vidCriacao.url, kind: "video", group: "Filmes" },
  { label: "A Batalha dos Anjos", url: vidBatalha.url, kind: "video", group: "Filmes" },
  { label: "Adão e Eva (filme)", url: vidAdaoEva.url, kind: "video", group: "Filmes" },
  { label: "Noé e a Arca (filme)", url: vidNoeArcaFilme.url, kind: "video", group: "Filmes" },
  { label: "Os 10 Mandamentos (filme)", url: vid10mFilme.url, kind: "video", group: "Filmes" },
  { label: "Moisés — Parte I", url: vidMoises1.url, kind: "video", group: "Séries · Moisés" },
  { label: "Moisés — Parte II", url: vidMoises2.url, kind: "video", group: "Séries · Moisés" },
  { label: "Moisés — Parte III", url: vidMoises3.url, kind: "video", group: "Séries · Moisés" },
  { label: "Esaú e Jacó — Parte I", url: vidEJ1.url, kind: "video", group: "Séries · Esaú e Jacó" },
  { label: "Esaú e Jacó — Parte II", url: vidEJ2.url, kind: "video", group: "Séries · Esaú e Jacó" },
  { label: "Esaú e Jacó — Parte III", url: vidEJ3.url, kind: "video", group: "Séries · Esaú e Jacó" },
  { label: "José do Egito — Parte I", url: vidJose1.url, kind: "video", group: "Séries · José do Egito" },
  { label: "José do Egito — Parte II", url: vidJose2.url, kind: "video", group: "Séries · José do Egito" },
  { label: "José do Egito — Parte III", url: vidJose3.url, kind: "video", group: "Séries · José do Egito" },
  { label: "Jó — Parte I", url: vidJo1.url, kind: "video", group: "Séries · Jó" },
  { label: "Jó — Parte II", url: vidJo2.url, kind: "video", group: "Séries · Jó" },
  { label: "Jó — Parte III", url: vidJo3.url, kind: "video", group: "Séries · Jó" },
  { label: "Davi e Golias — Parte I", url: vidDavi1.url, kind: "video", group: "Séries · Davi e Golias" },
  { label: "Davi e Golias — Parte II", url: vidDavi2.url, kind: "video", group: "Séries · Davi e Golias" },
  { label: "Sou Fiel (louvor)", url: "/videos/ser-fiel.mp4", kind: "video", group: "Louvores" },
  { label: "Graça Aleluia (louvor)", url: "/videos/aleluia.mp4", kind: "video", group: "Louvores" },
  { label: "Palavra Eterna (louvor)", url: "/videos/palavra-eterna.mp4", kind: "video", group: "Louvores" },
];

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
