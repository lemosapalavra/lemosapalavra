import criacao from "@/assets/album-faixas/criacao.png.asset.json";
import herois from "@/assets/album-faixas/herois.png.asset.json";
import milagres from "@/assets/album-faixas/milagres.png.asset.json";
import parabolas from "@/assets/album-faixas/parabolas.png.asset.json";
import animais from "@/assets/album-faixas/animais.png.asset.json";
import momentos from "@/assets/album-faixas/momentos.png.asset.json";

/** Faixas (placas) ilustradas por categoria do álbum. */
export const albumFaixas: Record<string, string> = {
  criacao: criacao.url,
  herois: herois.url,
  milagres: milagres.url,
  parabolas: parabolas.url,
  animais: animais.url,
  momentos: momentos.url,
};
