// Configuração do aviãozinho com faixa exibido na página inicial.
// A mensagem muda conforme o evento (Dia dos Pais, Natal, Páscoa, etc.)
// e o link do vídeo pode ser atualizado pelo painel admin.

import { monthInRange } from "@/data/trainBannerConfig";
import bisVideo from "@/assets/14-bis/ele-e-o-meu-irmao/ele-e-o-meu-irmao.mp4.asset.json";

export interface EventBannerConfig {
  enabled: boolean;
  callToAction: string; // texto principal (ex: "Clique aqui")
  message: string;       // mensagem sazonal (ex: "Feliz Dia dos Pais")
  videoUrl: string;      // link do vídeo a abrir
  scheduleEnabled: boolean; // exibir apenas no período comemorativo
  startMonth: number;       // 1-12 (vale para todos os anos)
  endMonth: number;         // 1-12 (vale para todos os anos)
}

// v5: agendamento passou a ser apenas por mês (válido em todos os anos).
const KEY = "lemos_event_banner_v6";

export function defaultEventBanner(): EventBannerConfig {
  return {
    enabled: true,
    callToAction: "Clique aqui",
    message: "Ele é o meu irmão",
    videoUrl: bisVideo.url,
    scheduleEnabled: false,
    startMonth: 1,
    endMonth: 12,
  };
}

export function loadEventBanner(): EventBannerConfig {
  try {
    // limpa configurações antigas (versões anteriores do aviãozinho)
    try { localStorage.removeItem("lemos_event_banner_v3"); } catch { /* noop */ }
    try { localStorage.removeItem("lemos_event_banner_v4"); } catch { /* noop */ }
    try { localStorage.removeItem("lemos_event_banner_v5"); } catch { /* noop */ }
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultEventBanner();
    const parsed = JSON.parse(raw) as Partial<EventBannerConfig>;
    return { ...defaultEventBanner(), ...parsed };
  } catch {
    return defaultEventBanner();
  }
}

/** O aviãozinho aparece? Considera o liga/desliga e o mês comemorativo. */
export function isBannerActive(cfg: EventBannerConfig): boolean {
  if (!cfg.enabled) return false;
  if (!cfg.scheduleEnabled) return true;
  return monthInRange(new Date().getMonth() + 1, cfg.startMonth, cfg.endMonth);
}


export function saveEventBanner(cfg: EventBannerConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event("lemos_event_banner_change"));
}

export function resetEventBanner() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("lemos_event_banner_change"));
}
