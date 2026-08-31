// Configuração do trenzinho ("Pegue o trem da Vida") exibido na página inicial.
// Mesma estrutura do aviãozinho: liga/desliga, textos e vídeo escolhidos pelo admin.

import tremVideo from "@/assets/trenzinho/trem-da-vida.mp4.asset.json";

export interface TrainBannerConfig {
  enabled: boolean;
  callToAction: string;  // texto principal (ex: "Clique aqui")
  message: string;       // mensagem sazonal / convite
  videoUrl: string;      // link do vídeo a abrir ao clicar no trenzinho
  scheduleEnabled: boolean;
  startDate: string;     // YYYY-MM-DD
  endDate: string;       // YYYY-MM-DD
}

const KEY = "lemos_train_banner_v1";

export function defaultTrainBanner(): TrainBannerConfig {
  return {
    enabled: true,
    callToAction: "Clique aqui",
    message: "Pegue o trem da Vida",
    videoUrl: tremVideo.url,
    scheduleEnabled: false,
    startDate: "",
    endDate: "",
  };
}

export function loadTrainBanner(): TrainBannerConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultTrainBanner();
    const parsed = JSON.parse(raw) as Partial<TrainBannerConfig>;
    return { ...defaultTrainBanner(), ...parsed };
  } catch {
    return defaultTrainBanner();
  }
}

function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** O trenzinho aparece? Considera o liga/desliga e o período comemorativo. */
export function isTrainActive(cfg: TrainBannerConfig): boolean {
  if (!cfg.enabled) return false;
  if (!cfg.scheduleEnabled) return true;
  const t = today();
  if (cfg.startDate && t < cfg.startDate) return false;
  if (cfg.endDate && t > cfg.endDate) return false;
  return true;
}

export const TRAIN_BANNER_EVENT = "lemos_train_banner_change";

export function saveTrainBanner(cfg: TrainBannerConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event(TRAIN_BANNER_EVENT));
}

export function resetTrainBanner() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(TRAIN_BANNER_EVENT));
}
