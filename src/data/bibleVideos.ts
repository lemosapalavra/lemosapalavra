import iconCriacao from "@/assets/historia-criacao.png";
import iconBatalha from "@/assets/historia-batalha-anjos.png";
import iconAdaoEva1 from "@/assets/historia-adao-eva-1.png";
import iconAdaoEva2 from "@/assets/historia-adao-eva-2.png";
import iconNoe1 from "@/assets/historia-noe-1.png";
import iconNoe2 from "@/assets/historia-noe-2.png";
import iconMoises1 from "@/assets/historia-moises-1.png";
import iconMoises2 from "@/assets/historia-moises-2.png";
import iconMoises3 from "@/assets/historia-moises-3.png";
import iconDaviGolias from "@/assets/historia-davi-golias.png";
import icon10Mandamentos from "@/assets/historia-10-mandamentos.png";
import grupoAdaoEva from "@/assets/grupo-adao-eva.png";
import grupoMoises from "@/assets/grupo-moises.png";
import esauJacoIcon from "@/assets/lemos-play/esau-e-jaco.png.asset.json";
import vidCriacao from "@/assets/lemos-play/a-criacao.mp4.asset.json";
import vidBatalha from "@/assets/lemos-play/a-batalha-dos-anjos.mp4.asset.json";
import vid10m1 from "@/assets/lemos-play/10-mandamentos-1.mp4.asset.json";
import vid10m2 from "@/assets/lemos-play/10-mandamentos-2.mp4.asset.json";
import vid10m3 from "@/assets/lemos-play/10-mandamentos-3.mp4.asset.json";
import vidEJ1 from "@/assets/lemos-play/esau-jaco-1.mp4.asset.json";
import vidEJ2 from "@/assets/lemos-play/esau-jaco-2.mp4.asset.json";
import vidEJ3 from "@/assets/lemos-play/esau-jaco-3.mp4.asset.json";
import vidJose1 from "@/assets/lemos-play/jose-egito-1.mp4.asset.json";
import vidJose2 from "@/assets/lemos-play/jose-egito-2.mp4.asset.json";
import vidJose3 from "@/assets/lemos-play/jose-egito-3.mp4.asset.json";
import vidJo1 from "@/assets/lemos-play/jo-1.mp4.asset.json";
import vidJo2 from "@/assets/lemos-play/jo-2.mp4.asset.json";
import vidJo3 from "@/assets/lemos-play/jo-3.mp4.asset.json";
import joseEgitoIcon from "@/assets/lemos-play/jose-egito.png.asset.json";
import joIcon from "@/assets/lemos-play/jo.png.asset.json";
import vidDavi1 from "@/assets/lemos-play/davi-golias-1.mp4.asset.json";
import vidDavi2 from "@/assets/lemos-play/davi-golias-2.mp4.asset.json";

export interface BibleVideo {
  title: string;
  icon: string;
  src: string;
}

const LOCAL_VIDEO = (file: string) => `/videos/${file}`;
const UNAVAILABLE_VIDEO = "";
export const seriesVideos: BibleVideo[] = [
  { title: "Adão e Eva — Parte I", icon: iconAdaoEva1, src: UNAVAILABLE_VIDEO },
  { title: "Adão e Eva — Parte II", icon: iconAdaoEva2, src: UNAVAILABLE_VIDEO },
  { title: "Noé e a Arca — Parte I", icon: iconNoe1, src: UNAVAILABLE_VIDEO },
  { title: "Noé e a Arca — Parte II", icon: iconNoe2, src: UNAVAILABLE_VIDEO },
  { title: "Moisés — Parte I", icon: iconMoises1, src: UNAVAILABLE_VIDEO },
  { title: "Moisés — Parte II", icon: iconMoises2, src: UNAVAILABLE_VIDEO },
  { title: "Moisés — Parte III", icon: iconMoises3, src: UNAVAILABLE_VIDEO },
];

export interface BibleVideoGroup {
  title: string;
  icon: string;
  videos: BibleVideo[];
}

export const seriesGroups: BibleVideoGroup[] = [
  {
    title: "Adão e Eva",
    icon: grupoAdaoEva,
    videos: [
      { title: "Adão e Eva — Parte I", icon: iconAdaoEva1, src: UNAVAILABLE_VIDEO },
      { title: "Adão e Eva — Parte II", icon: iconAdaoEva2, src: UNAVAILABLE_VIDEO },
    ],
  },
  {
    title: "Noé e a Arca",
    icon: iconNoe1,
    videos: [
      { title: "Noé e a Arca — Parte I", icon: iconNoe1, src: UNAVAILABLE_VIDEO },
      { title: "Noé e a Arca — Parte II", icon: iconNoe2, src: UNAVAILABLE_VIDEO },
    ],
  },
  {
    title: "Os Irmãos Esaú e Jacó",
    icon: esauJacoIcon.url,
    videos: [
      { title: "Esaú e Jacó — Parte I", icon: esauJacoIcon.url, src: vidEJ1.url },
      { title: "Esaú e Jacó — Parte II", icon: esauJacoIcon.url, src: vidEJ2.url },
      { title: "Esaú e Jacó — Parte III", icon: esauJacoIcon.url, src: vidEJ3.url },
    ],
  },
  {
    title: "Moisés",
    icon: grupoMoises,
    videos: [
      { title: "Moisés — Parte I", icon: iconMoises1, src: UNAVAILABLE_VIDEO },
      { title: "Moisés — Parte II", icon: iconMoises2, src: UNAVAILABLE_VIDEO },
      { title: "Moisés — Parte III", icon: iconMoises3, src: UNAVAILABLE_VIDEO },
    ],
  },
  {
    title: "José do Egito",
    icon: joseEgitoIcon.url,
    videos: [
      { title: "José do Egito — Parte I", icon: joseEgitoIcon.url, src: vidJose1.url },
      { title: "José do Egito — Parte II", icon: joseEgitoIcon.url, src: vidJose2.url },
      { title: "José do Egito — Parte III", icon: joseEgitoIcon.url, src: vidJose3.url },
    ],
  },
  {
    title: "Jó",
    icon: joIcon.url,
    videos: [
      { title: "Jó — Parte I", icon: joIcon.url, src: vidJo1.url },
      { title: "Jó — Parte II", icon: joIcon.url, src: vidJo2.url },
      { title: "Jó — Parte III", icon: joIcon.url, src: vidJo3.url },
    ],
  },
  {
    title: "Davi e Golias",
    icon: iconDaviGolias,
    videos: [
      { title: "Davi e Golias — Parte I", icon: iconDaviGolias, src: vidDavi1.url },
      { title: "Davi e Golias — Parte II", icon: iconDaviGolias, src: vidDavi2.url },
    ],
  },
  {
    title: "Os 10 Mandamentos",
    icon: icon10Mandamentos,
    videos: [
      { title: "Os 10 Mandamentos — Parte I", icon: icon10Mandamentos, src: vid10m1.url },
      { title: "Os 10 Mandamentos — Parte II", icon: icon10Mandamentos, src: vid10m2.url },
      { title: "Os 10 Mandamentos — Parte III", icon: icon10Mandamentos, src: vid10m3.url },
    ],
  },
];

export const filmesVideos: BibleVideo[] = [
  { title: "A Criação", icon: iconCriacao, src: vidCriacao.url },
  { title: "A Batalha dos Anjos", icon: iconBatalha, src: vidBatalha.url },
];
