// Configuração do aviãozinho com faixa exibido na página inicial.
// A mensagem muda conforme o evento (Dia dos Pais, Natal, Páscoa, etc.)
// e o link do vídeo pode ser atualizado pelo painel admin.

export interface EventBannerConfig {
  enabled: boolean;
  callToAction: string; // texto principal (ex: "Clique aqui")
  message: string;       // mensagem sazonal (ex: "Feliz Dia dos Pais")
  videoUrl: string;      // link do vídeo a abrir
}

const KEY = "lemos_event_banner_v2";

import diaDosPaisVideo from "@/assets/aviaozinho/dia-dos-pais/dia-dos-pais.mp4.asset.json";

export function defaultEventBanner(): EventBannerConfig {
  return {
    enabled: true,
    callToAction: "Clique aqui",
    message: "Dia dos Pais",
    videoUrl: diaDosPaisVideo.url,
  };
}

export function loadEventBanner(): EventBannerConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultEventBanner();
    const parsed = JSON.parse(raw) as Partial<EventBannerConfig>;
    return { ...defaultEventBanner(), ...parsed };
  } catch {
    return defaultEventBanner();
  }
}

export function saveEventBanner(cfg: EventBannerConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event("lemos_event_banner_change"));
}

export function resetEventBanner() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("lemos_event_banner_change"));
}
