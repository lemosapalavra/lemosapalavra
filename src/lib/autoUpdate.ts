/**
 * Auto-atualização: garante que o usuário sempre veja a última versão do site.
 *
 * Estratégia: lê o index.html do servidor (sem cache) e compara o hash do
 * bundle principal com o que está carregado. Se mudou, recarrega a página
 * uma única vez (evita loop com uma trava em sessionStorage).
 */

const RELOAD_FLAG = "lemos_auto_reload_at";
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos

async function fetchCurrentBuildId(): Promise<string | null> {
  try {
    const res = await fetch(`/?_v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const html = await res.text();
    const matches = Array.from(html.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+)"/g)).map((m) => m[1]);
    if (!matches.length) return null;
    return matches.sort().join("|");
  } catch {
    return null;
  }
}

function loadedBuildId(): string {
  const urls: string[] = [];
  document.querySelectorAll<HTMLScriptElement>("script[src]").forEach((s) => {
    const u = s.getAttribute("src") || "";
    if (u.includes("/assets/")) urls.push(u);
  });
  document.querySelectorAll<HTMLLinkElement>('link[href]').forEach((l) => {
    const u = l.getAttribute("href") || "";
    if (u.includes("/assets/")) urls.push(u);
  });
  return urls.sort().join("|");
}

async function clearCaches() {
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.update().catch(() => {})));
    }
  } catch {
    /* ignore */
  }
}

/** Não interrompe o usuário: vídeo/áudio tocando, tela cheia ou modal aberto. */
function isBusy(): boolean {
  if (document.fullscreenElement) return true;
  const media = Array.from(document.querySelectorAll<HTMLMediaElement>("video, audio"));
  if (media.some((m) => !m.paused && !m.ended)) return true;
  // iframes de vídeo (YouTube/Vimeo/Bunny) — não recarrega enquanto existirem
  if (document.querySelector('iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="mediadelivery"]')) return true;
  return false;
}

async function checkForUpdate() {
  if (document.visibilityState === "hidden") return;
  if (isBusy()) return;
  const current = loadedBuildId();
  if (!current) return;
  const remote = await fetchCurrentBuildId();
  if (!remote || remote === current) return;

  // trava anti-loop: no máximo um reload automático por sessão
  if (sessionStorage.getItem(RELOAD_FLAG)) return;
  sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));

  await clearCaches();
  window.location.reload();
}


/** Inicia o monitoramento de novas versões. Retorna função de limpeza. */
export function startAutoUpdate(): () => void {
  if (import.meta.env.DEV) return () => {};

  // Verifica ao abrir, ao voltar para a aba e periodicamente.
  checkForUpdate();
  const onVisible = () => {
    if (document.visibilityState === "visible") checkForUpdate();
  };
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("focus", onVisible);
  const id = window.setInterval(checkForUpdate, CHECK_INTERVAL);

  return () => {
    document.removeEventListener("visibilitychange", onVisible);
    window.removeEventListener("focus", onVisible);
    window.clearInterval(id);
  };
}
