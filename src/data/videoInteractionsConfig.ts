/** Configuração das interações (Gostei, Comentar, Compartilhar) exibidas nos vídeos. */

const KEY = "lemos_video_interactions_v1";
export const VIDEO_INTERACTIONS_EVENT = "lemos_video_interactions_change";

export interface VideoInteractionsCfg {
  enabled: boolean;
}

export function loadVideoInteractionsCfg(): VideoInteractionsCfg {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { enabled: true };
    return { enabled: JSON.parse(raw)?.enabled !== false };
  } catch {
    return { enabled: true };
  }
}

export function saveVideoInteractionsCfg(cfg: VideoInteractionsCfg) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cfg));
  } catch {}
  window.dispatchEvent(new Event(VIDEO_INTERACTIONS_EVENT));
}
