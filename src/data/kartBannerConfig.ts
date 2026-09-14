// Configuração do kartzinho ("Feliz Aniversário") exibido na página inicial.
// Mesma estrutura do aviãozinho e do trenzinho: liga/desliga, textos e vídeo.
// O agendamento usa apenas dia e mês, repetindo todos os anos.

import kartVideo from "@/assets/kartzinho/feliz-aniversario-2.mp4.asset.json";

export interface KartBannerConfig {
  enabled: boolean;
  callToAction: string;
  message: string;
  videoUrl: string;
  scheduleEnabled: boolean;
  startDay: number;
  startMonth: number;
  endDay: number;
  endMonth: number;
}

const KEY = "lemos_kart_banner_v2";

export const KART_BANNER_EVENT = "lemos_kart_banner_change";

export function defaultKartBanner(): KartBannerConfig {
  return {
    enabled: true,
    callToAction: "Clique aqui",
    message: "Feliz Aniversário",
    videoUrl: kartVideo.url,
    scheduleEnabled: true,
    startDay: 14,
    startMonth: 9,
    endDay: 14,
    endMonth: 9,
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

/** Compara dia/mês num intervalo recorrente anual (aceita virada de ano). */
export function dayMonthInRange(
  today: Date,
  startDay: number,
  startMonth: number,
  endDay: number,
  endMonth: number,
): boolean {
  const v = (m: number, d: number) => m * 100 + d;
  const now = v(today.getMonth() + 1, today.getDate());
  const start = v(startMonth, startDay);
  const end = v(endMonth, endDay);
  return start <= end ? now >= start && now <= end : now >= start || now <= end;
}

export function isKartActive(cfg: KartBannerConfig): boolean {
  if (!cfg.enabled) return false;
  if (!cfg.scheduleEnabled) return true;
  return dayMonthInRange(new Date(), cfg.startDay, cfg.startMonth, cfg.endDay, cfg.endMonth);
}

export function saveKartBanner(cfg: KartBannerConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event(KART_BANNER_EVENT));
}

export function resetKartBanner() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(KART_BANNER_EVENT));
}
