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

const BUNNY = (id: string) => `https://iframe.mediadelivery.net/embed/660536/${id}?autoplay=true`;
export { BUNNY };

export const seriesVideos: BibleVideo[] = [
  { title: "Adão e Eva — Parte I", icon: iconAdaoEva1, src: BUNNY("2e91578e-033a-41ee-925e-e7c8263761f5") },
  { title: "Adão e Eva — Parte II", icon: iconAdaoEva2, src: BUNNY("95eed0a7-d4ee-42cd-8838-a11a378e5be9") },
  { title: "Noé e a Arca — Parte I", icon: iconNoe1, src: BUNNY("f390899d-48ba-4f8b-8bff-5da2a9e0bb06") },
  { title: "Noé e a Arca — Parte II", icon: iconNoe2, src: BUNNY("8beb646a-746b-42fd-8be5-f6acdd11a522") },
  { title: "Moisés — Parte I", icon: iconMoises1, src: BUNNY("3a7dcf5f-6f4b-41a1-9af5-5353e7a5eea0") },
  { title: "Moisés — Parte II", icon: iconMoises2, src: BUNNY("902b0a08-13a9-4bb7-9050-714971012c16") },
  { title: "Moisés — Parte III", icon: iconMoises3, src: BUNNY("50392cc2-49d4-45c4-bd69-c2edf55be14d") },
];

export const filmesVideos: BibleVideo[] = [
  { title: "A Criação", icon: iconCriacao, src: BUNNY("2889e4ae-7f95-4bbb-be0f-ccc9e094477c") },
  { title: "A Batalha dos Anjos", icon: iconBatalha, src: BUNNY("c46984a1-dcf7-45f9-95bd-e479beae1851") },
  { title: "Davi e Golias", icon: iconDaviGolias, src: BUNNY("3ced4ec8-0858-4daf-a883-aff21ae614f1") },
  { title: "Os Dez Mandamentos", icon: icon10Mandamentos, src: BUNNY("e355453e-4890-4215-9f27-6741ee1760cb") },
];
