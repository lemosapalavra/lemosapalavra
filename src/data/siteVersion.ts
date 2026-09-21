/** Versão visual do site: 1 (órbita), 2 (cards anterior) ou 3 (plataforma atual). */
export type SiteVersion = 1 | 2 | 3;

const LS_KEY = "lemos_site_version";
export const SITE_VERSION_EVENT = "lemos_site_version_change";

export function loadSiteVersion(): SiteVersion {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === "1" || saved === "2") return Number(saved) as SiteVersion;
    return 3;
  } catch {
    return 3;
  }
}

export function saveSiteVersion(v: SiteVersion) {
  try {
    localStorage.setItem(LS_KEY, String(v));
  } catch {}
  window.dispatchEvent(new Event(SITE_VERSION_EVENT));
}

export function toggleSiteVersion(): SiteVersion {
  const next: SiteVersion = loadSiteVersion() === 3 ? 1 : 3;
  saveSiteVersion(next);
  return next;
}
