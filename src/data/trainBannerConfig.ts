// Configuração do trenzinho ("Pegue o trem da Vida") exibido na página inicial.
// Mesma estrutura do aviãozinho: liga/desliga, textos e vídeo escolhidos pelo admin.

import tremVideo from "@/assets/trenzinho/trem-da-vida.mp4.asset.json";

export interface TrainBannerConfig {
  enabled: boolean;
  callToAction: string;  // texto principal (ex: "Clique aqui")
  message: string;       // mensagem sazonal / convite
  videoUrl: string;      // link do vídeo a abrir ao clicar no trenzinho
  scheduleEnabled: boolean;
  startMonth: number;    // 1-12 (vale para todos os anos)
  endMonth: number;      // 1-12 (vale para todos os anos)
}

const KEY = "lemos_train_banner_v2";

export function defaultTrainBanner(): TrainBannerConfig {
  return {
    enabled: true,
    callToAction: "Clique aqui",
    message: "Pegue o trem da Vida",
    videoUrl: tremVideo.url,
    scheduleEnabled: false,
    startMonth: 1,
    endMonth: 12,
  };
}

export function loadTrainBanner(): TrainBannerConfig {
  try {
    try { localStorage.removeItem("lemos_train_banner_v1"); } catch { /* noop */ }
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultTrainBanner();
    const parsed = JSON.parse(raw) as Partial<TrainBannerConfig>;
    return { ...defaultTrainBanner(), ...parsed };
  } catch {
    return defaultTrainBanner();
  }
}

/**
 * O trenzinho aparece? Considera o liga/desliga e o período comemorativo
 * definido apenas por mês — válido em todos os anos, indefinidamente.
 */
export function isTrainActive(cfg: TrainBannerConfig): boolean {
  if (!cfg.enabled) return false;
  if (!cfg.scheduleEnabled) return true;
  return monthInRange(new Date().getMonth() + 1, cfg.startMonth, cfg.endMonth);
}

/** Intervalo de meses, aceitando períodos que viram o ano (ex.: 11 → 2). */
export function monthInRange(month: number, start: number, end: number): boolean {
  if (!start || !end) return true;
  return start <= end ? month >= start && month <= end : month >= start || month <= end;
}

export const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];


export const TRAIN_BANNER_EVENT = "lemos_train_banner_change";

export function saveTrainBanner(cfg: TrainBannerConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event(TRAIN_BANNER_EVENT));
}

export function resetTrainBanner() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(TRAIN_BANNER_EVENT));
}
