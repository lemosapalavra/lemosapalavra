// Configuração do aviãozinho com faixa exibido na página inicial.
// A mensagem muda conforme o evento (Dia dos Pais, Natal, Páscoa, etc.)
// e o link do vídeo pode ser atualizado pelo painel admin.

export interface EventBannerConfig {
  enabled: boolean;
  callToAction: string; // texto principal (ex: "Clique aqui")
  message: string;       // mensagem sazonal (ex: "Feliz Dia dos Pais")
  videoUrl: string;      // link do vídeo a abrir
  scheduleEnabled: boolean; // exibir apenas no período comemorativo
  startDate: string;        // YYYY-MM-DD
  endDate: string;          // YYYY-MM-DD
}

// v4: nova chave para "resetar" a configuração em todos os aparelhos.
// O aviãozinho nasce desligado — só volta se o admin ativar de novo.
const KEY = "lemos_event_banner_v4";

export function defaultEventBanner(): EventBannerConfig {
  return {
    enabled: false,
    callToAction: "Clique aqui",
    message: "Feliz dia\nDos Pais",
    videoUrl: "",
    scheduleEnabled: false,
    startDate: "",
    endDate: "",
  };
}

export function loadEventBanner(): EventBannerConfig {
  try {
    // limpa configurações antigas (versões anteriores do aviãozinho)
    try { localStorage.removeItem("lemos_event_banner_v3"); } catch { /* noop */ }
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultEventBanner();
    const parsed = JSON.parse(raw) as Partial<EventBannerConfig>;
    return { ...defaultEventBanner(), ...parsed };
  } catch {
    return defaultEventBanner();
  }
}

/** Data local no formato YYYY-MM-DD. */
function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** O aviãozinho aparece? Considera o liga/desliga e o período comemorativo. */
export function isBannerActive(cfg: EventBannerConfig): boolean {
  if (!cfg.enabled) return false;
  if (!cfg.scheduleEnabled) return true;
  const t = today();
  if (cfg.startDate && t < cfg.startDate) return false;
  if (cfg.endDate && t > cfg.endDate) return false;
  return true;
}

export function saveEventBanner(cfg: EventBannerConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event("lemos_event_banner_change"));
}

export function resetEventBanner() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("lemos_event_banner_change"));
}
