/**
 * Reinício global de sessões.
 *
 * Sempre que este valor mudar, todos os aparelhos que abrirem o site
 * serão deslogados uma única vez (limpa a sessão do backend e os dados
 * locais do perfil), forçando um novo login/cadastro.
 */
export const SESSION_EPOCH = "2026-08-08-reset-1";

const EPOCH_KEY = "lemos_session_epoch";

export function needsGlobalLogout(): boolean {
  try {
    return localStorage.getItem(EPOCH_KEY) !== SESSION_EPOCH;
  } catch {
    return false;
  }
}

export function markGlobalLogoutDone() {
  try {
    localStorage.setItem(EPOCH_KEY, SESSION_EPOCH);
  } catch {
    /* ignore */
  }
}

/** Limpa apenas os dados de sessão/perfil, preservando progresso do usuário. */
export function clearLocalSession() {
  try {
    localStorage.removeItem("lemos_user");
    localStorage.removeItem("lemos_admin_mode");
    sessionStorage.removeItem("lemos_admin_verified");
  } catch {
    /* ignore */
  }
}
