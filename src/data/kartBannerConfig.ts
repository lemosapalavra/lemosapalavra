// Configuração do kartzinho ("Feliz Aniversário") exibido na página inicial.
// Mesma estrutura do aviãozinho e do trenzinho: liga/desliga, textos e vídeo.

import kartVideo from "@/assets/kartzinho/feliz-aniversario.mp4.asset.json";
import { monthInRange } from "@/data/trainBannerConfig";

export interface KartBannerConfig {
  enabled: boolean;
  callToAction: string;
  message: string;
  videoUrl: string;
  scheduleEnabled: boolean;
  startMonth: number;
  endMonth: number;
}

const KEY = "lemos_kart_banner_v1";

export const KART_BANNER_EVENT = "lemos_kart_banner_change";

export function defaultKartBanner(): KartBannerConfig {
  return {
    enabled: true,
    callToAction: "Clique aqui",
    message: "Feliz Aniversário",
    videoUrl: kartVideo.url,
    scheduleEnabled: false,
    startMonth: 1,
    endMonth: 12,
  };
}

export function loadKartBanner(): KartBannerConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultKartBanner();
    const parsed = JSON.parse(raw) as Partial<KartBannerConfig>;
    return { ...defaultKartBanner(), ...parsed };
  } catch {
    return defaultKartBanner();
  }
}

export function isKartActive(cfg: KartBannerConfig): boolean {
  if (!cfg.enabled) return false;
  if (!cfg.scheduleEnabled) return true;
  return monthInRange(new Date().getMonth() + 1, cfg.startMonth, cfg.endMonth);
}

export function saveKartBanner(cfg: KartBannerConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event(KART_BANNER_EVENT));
}

export function resetKartBanner() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(KART_BANNER_EVENT));
}
