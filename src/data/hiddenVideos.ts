import felizAniversarioVideo from "@/assets/hidden/feliz-aniversario.mp4.asset.json";
import felizAniversarioPoster from "@/assets/hidden/feliz-aniversario.jpg.asset.json";
import diaDosPaisVideo from "@/assets/hidden/dia-dos-pais.mp4.asset.json";
import diaDosPaisPoster from "@/assets/hidden/dia-dos-pais.jpg.asset.json";
import tremDaVidaVideo from "@/assets/hidden/trem-da-vida.mp4.asset.json";
import tremDaVidaPoster from "@/assets/hidden/trem-da-vida.jpg.asset.json";

/** Senha mestra que libera a aba "Vídeos ocultos" no Ouça. */
export const HIDDEN_VIDEOS_PASSWORD = "091314";

const UNLOCK_KEY = "lemos_hidden_videos_unlocked_v1";

export interface HiddenVideo {
  id: string;
  title: string;
  src: string;
  poster: string;
}

export const HIDDEN_VIDEOS: HiddenVideo[] = [
  { id: "feliz-aniversario", title: "Feliz Aniversário", src: felizAniversarioVideo.url, poster: felizAniversarioPoster.url },
  { id: "dia-dos-pais", title: "Dia dos Pais", src: diaDosPaisVideo.url, poster: diaDosPaisPoster.url },
  { id: "trem-da-vida", title: "Trem da Vida", src: tremDaVidaVideo.url, poster: tremDaVidaPoster.url },
];

export function isHiddenUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function unlockHiddenVideos(password: string): boolean {
  if (password.trim() !== HIDDEN_VIDEOS_PASSWORD) return false;
  try {
    localStorage.setItem(UNLOCK_KEY, "1");
  } catch {
    /* sem armazenamento: desbloqueio vale só para esta sessão */
  }
  return true;
}

export function lockHiddenVideos(): void {
  try {
    localStorage.removeItem(UNLOCK_KEY);
  } catch {
    /* ignore */
  }
}
