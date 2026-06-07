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

export interface BibleVideo {
  title: string;
  icon: string;
  src: string;
}

const LOCAL_VIDEO = (file: string) => `/videos/${file}`;
const UNAVAILABLE_VIDEO = "";
const BUNNY = (id: string) => `https://iframe.mediadelivery.net/embed/660536/${id}?autoplay=true`;
export { BUNNY };

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
    title: "Moisés",
    icon: grupoMoises,
    videos: [
      { title: "Moisés — Parte I", icon: iconMoises1, src: UNAVAILABLE_VIDEO },
      { title: "Moisés — Parte II", icon: iconMoises2, src: UNAVAILABLE_VIDEO },
      { title: "Moisés — Parte III", icon: iconMoises3, src: UNAVAILABLE_VIDEO },
    ],
  },
];

export const filmesVideos: BibleVideo[] = [
  { title: "A Criação", icon: iconCriacao, src: LOCAL_VIDEO("a-criacao.mp4") },
  { title: "A Batalha dos Anjos", icon: iconBatalha, src: LOCAL_VIDEO("batalha-dos-anjos.mp4") },
  { title: "Davi e Golias", icon: iconDaviGolias, src: UNAVAILABLE_VIDEO },
  { title: "Os Dez Mandamentos", icon: icon10Mandamentos, src: UNAVAILABLE_VIDEO },
];
