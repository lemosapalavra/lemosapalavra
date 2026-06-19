import iconCriacao from "@/assets/historia-criacao.png";
import iconBatalha from "@/assets/historia-batalha-anjos.png";
import iconAdaoEva1 from "@/assets/historia-adao-eva-1.png";
import iconNoe1 from "@/assets/historia-noe-1.png";
import iconDaviGolias from "@/assets/historia-davi-golias.png";
import icon10Mandamentos from "@/assets/historia-10-mandamentos.png";
import esauJacoIcon from "@/assets/lemos-play/esau-e-jaco.png.asset.json";
import esauJacoP1 from "@/assets/lemos-play/esau-jaco-parte-1.png.asset.json";
import esauJacoP2 from "@/assets/lemos-play/esau-jaco-parte-2.png.asset.json";
import esauJacoP3 from "@/assets/lemos-play/esau-jaco-parte-3.png.asset.json";
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
import joseEgitoCover from "@/assets/lemos-play/jose-egito-cover.png.asset.json";
import joseEgitoP1 from "@/assets/lemos-play/jose-egito-parte-1.png.asset.json";
import joseEgitoP2 from "@/assets/lemos-play/jose-egito-parte-2.png.asset.json";
import joseEgitoP3 from "@/assets/lemos-play/jose-egito-parte-3.png.asset.json";
import joIcon from "@/assets/lemos-play/jo.png.asset.json";
import joP1 from "@/assets/lemos-play/jo-parte-1-v2.png.asset.json";
import joP2 from "@/assets/lemos-play/jo-parte-2-v2.png.asset.json";
import joP3 from "@/assets/lemos-play/jo-parte-3-v2.png.asset.json";
import vidAdaoEva from "@/assets/lemos-play/adao-eva.mp4.asset.json";
import vidNoeArcaFilme from "@/assets/lemos-play/noe-arca-filme.mp4.asset.json";
import vidMoises1 from "@/assets/lemos-play/moises-1.mp4.asset.json";
import vidMoises2 from "@/assets/lemos-play/moises-2.mp4.asset.json";
import vidMoises3 from "@/assets/lemos-play/moises-3.mp4.asset.json";
import vidDaviFilme from "@/assets/lemos-play/davi-golias-filme.mp4.asset.json";
import vidJonasFilme from "@/assets/lemos-play/jonas-baleia-filme.mp4.asset.json";
import vidAbraao1 from "@/assets/lemos-play/abraao-1.mp4.asset.json";
import vidAbraao2 from "@/assets/lemos-play/abraao-2.mp4.asset.json";
import vidProvaFogo1 from "@/assets/lemos-play/prova-fogo-1.mp4.asset.json";
import vidProvaFogo2 from "@/assets/lemos-play/prova-fogo-2.mp4.asset.json";
import iconJonas from "@/assets/lemos-play/jonas-e-a-baleia.png.asset.json";
import iconAbraao from "@/assets/lemos-play/abraao-e-a-obediencia.png.asset.json";
import iconProvaFogo from "@/assets/lemos-play/provados-pelo-fogo.png.asset.json";
import moisesP1 from "@/assets/lemos-play/moises-parte-1-v2.png.asset.json";
import moisesP2 from "@/assets/lemos-play/moises-parte-2-v2.png.asset.json";
import moisesP3 from "@/assets/lemos-play/moises-parte-3-v2.png.asset.json";
import vidNoe1 from "@/assets/lemos-play/noe-1.mp4.asset.json";
import vidNoe2 from "@/assets/lemos-play/noe-2.mp4.asset.json";
import vidDavi1 from "@/assets/lemos-play/davi-golias-1.mp4.asset.json";
import vidDavi2 from "@/assets/lemos-play/davi-golias-2.mp4.asset.json";
import vid10m1 from "@/assets/lemos-play/10-mandamentos-1.mp4.asset.json";
import vid10m2 from "@/assets/lemos-play/10-mandamentos-2.mp4.asset.json";
import vid10m3 from "@/assets/lemos-play/10-mandamentos-3.mp4.asset.json";
import vidNascimentoJesus from "@/assets/lemos-play/nascimento-jesus.mp4.asset.json";
import nascimentoJesusThumb from "@/assets/lemos-play/nascimento-jesus-thumb.jpg.asset.json";


export interface BibleVideo {
  title: string;
  icon: string;
  src: string;
}

export const seriesVideos: BibleVideo[] = [
  { title: "Moisés — Parte I", icon: moisesP1.url, src: vidMoises1.url },
  { title: "Moisés — Parte II", icon: moisesP2.url, src: vidMoises2.url },
  { title: "Moisés — Parte III", icon: moisesP3.url, src: vidMoises3.url },
];

export interface BibleVideoGroup {
  title: string;
  icon: string;
  videos: BibleVideo[];
}

export const seriesGroups: BibleVideoGroup[] = [
  {
    title: "Os Irmãos Esaú e Jacó",
    icon: esauJacoIcon.url,
    videos: [
      { title: "Esaú e Jacó — Parte I", icon: esauJacoP1.url, src: vidEJ1.url },
      { title: "Esaú e Jacó — Parte II", icon: esauJacoP2.url, src: vidEJ2.url },
      { title: "Esaú e Jacó — Parte III", icon: esauJacoP3.url, src: vidEJ3.url },
    ],
  },
  {
    title: "Moisés",
    icon: moisesP1.url,
    videos: [
      { title: "Moisés — Parte I", icon: moisesP1.url, src: vidMoises1.url },
      { title: "Moisés — Parte II", icon: moisesP2.url, src: vidMoises2.url },
      { title: "Moisés — Parte III", icon: moisesP3.url, src: vidMoises3.url },
    ],
  },
  {
    title: "José do Egito",
    icon: joseEgitoCover.url,
    videos: [
      { title: "José do Egito — Parte I", icon: joseEgitoP1.url, src: vidJose1.url },
      { title: "José do Egito — Parte II", icon: joseEgitoP2.url, src: vidJose2.url },
      { title: "José do Egito — Parte III", icon: joseEgitoP3.url, src: vidJose3.url },
    ],
  },
  {
    title: "Jó",
    icon: joP1.url,
    videos: [
      { title: "Jó — Parte I", icon: joP1.url, src: vidJo1.url },
      { title: "Jó — Parte II", icon: joP2.url, src: vidJo2.url },
      { title: "Jó — Parte III", icon: joP3.url, src: vidJo3.url },
    ],
  },
  {
    title: "Abraão",
    icon: iconAbraao.url,
    videos: [
      { title: "Abraão — Parte I", icon: iconAbraao.url, src: vidAbraao1.url },
      { title: "Abraão — Parte II", icon: iconAbraao.url, src: vidAbraao2.url },
    ],
  },
  {
    title: "A Prova de Fogo",
    icon: iconProvaFogo.url,
    videos: [
      { title: "A Prova de Fogo — Parte I", icon: iconProvaFogo.url, src: vidProvaFogo1.url },
      { title: "A Prova de Fogo — Parte II", icon: iconProvaFogo.url, src: vidProvaFogo2.url },
    ],
  },
];

export const filmesVideos: BibleVideo[] = [
  { title: "A Criação", icon: iconCriacao, src: vidCriacao.url },
  { title: "A Batalha dos Anjos", icon: iconBatalha, src: vidBatalha.url },
  { title: "Adão e Eva", icon: iconAdaoEva1, src: vidAdaoEva.url },
  { title: "Noé e a Arca", icon: iconNoe1, src: vidNoeArcaFilme.url },
  { title: "Davi e Golias", icon: iconDaviGolias, src: vidDaviFilme.url },
  { title: "Jonas e a Baleia", icon: iconJonas.url, src: vidJonasFilme.url },
  { title: "Os 10 Mandamentos", icon: icon10Mandamentos, src: vid10mFilme.url },
];
