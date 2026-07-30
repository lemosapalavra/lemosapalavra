import espiritoSantoThumb from "@/assets/lemos-play/espirito-santo-i.png.asset.json";
import serFielThumb from "@/assets/lemos-play/ser-fiel-thumb.png.asset.json";
import gracaAleluiaThumb from "@/assets/lemos-play/graca-aleluia.png.asset.json";
import palavraEternaThumb from "@/assets/lemos-play/palavra-eterna.png.asset.json";
import fazMilagreThumb from "@/assets/lemos-play/faz-um-milagre-em-mim.png.asset.json";
import espiritoSantoVid from "@/assets/lemos-play/espirito-santo-v2.mp4.asset.json";
import espiritoSantoCover from "@/assets/lemos-play/espirito-santo-cover.jpg.asset.json";
import aleluiaVid from "@/assets/lemos-play/aleluia.mp4.asset.json";
import palavraEternaVid from "@/assets/lemos-play/palavra-eterna.mp4.asset.json";
import souFielVid from "@/assets/lemos-play/sou-fiel.mp4.asset.json";
import fazMilagreVid from "@/assets/lemos-play/faz-um-milagre-em-mim.mp4.asset.json";

export interface Louvor {
  title: string;
  src: string;
  thumb: string;
}

const allLouvores: Louvor[] = [
  { title: "Faz um Milagre em Mim", src: fazMilagreVid.url, thumb: fazMilagreThumb.url },
  { title: "Espírito Santo", src: espiritoSantoVid.url, thumb: espiritoSantoCover.url },
  { title: "Sou Fiel", src: souFielVid.url, thumb: serFielThumb.url },
  { title: "Graça Aleluia", src: aleluiaVid.url, thumb: gracaAleluiaThumb.url },
  { title: "Palavra Eterna", src: palavraEternaVid.url, thumb: palavraEternaThumb.url },
];

// Esconde os louvores cujo link está quebrado
export const louvores: Louvor[] = allLouvores.filter((l) => !!l.src);

export { espiritoSantoThumb };
