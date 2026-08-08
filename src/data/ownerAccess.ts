/**
 * Acesso do dono (administrador) — restrito ao aparelho E ao IP do dono.
 *
 * O atalho "Entrar como Administrador" só aparece quando:
 *  1) o aparelho foi desbloqueado uma vez com ?owner=1, e
 *  2) o IP atual é o mesmo IP que foi registrado nesse desbloqueio
 *     (ou está na lista fixa OWNER_IPS abaixo).
 *
 * Isso é apenas ocultação de UI — o poder real de administrador continua
 * sendo verificado no backend pela tabela user_roles.
 */

export const OWNER_FLAG_KEY = "lemos_owner_unlocked";
const OWNER_IP_KEY = "lemos_owner_ip";

/** IPs fixos autorizados (opcional). Preencha para liberar em outro aparelho. */
export const OWNER_IPS: string[] = [];

export function ownerDeviceUnlocked(): boolean {
  try {
    return localStorage.getItem(OWNER_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export function getOwnerIp(): string | null {
  try {
    return localStorage.getItem(OWNER_IP_KEY);
  } catch {
    return null;
  }
}

export function setOwnerIp(ip: string) {
  try {
    if (ip && !/carregando|indispon/i.test(ip)) localStorage.setItem(OWNER_IP_KEY, ip);
  } catch {
    /* ignore */
  }
}

export function clearOwnerAccess() {
  try {
    localStorage.removeItem(OWNER_FLAG_KEY);
    localStorage.removeItem(OWNER_IP_KEY);
  } catch {
    /* ignore */
  }
}

/** true quando o IP atual pertence ao dono. */
export function ipMatchesOwner(currentIp: string): boolean {
  if (!currentIp || /carregando|indispon/i.test(currentIp)) return false;
  if (OWNER_IPS.includes(currentIp)) return true;
  return getOwnerIp() === currentIp;
}
