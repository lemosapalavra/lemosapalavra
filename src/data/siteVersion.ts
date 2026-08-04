/** Versão visual do site: 1 (órbita, original) ou 2 (novo layout com menu e cards). */
export type SiteVersion = 1 | 2;

const LS_KEY = "lemos_site_version";
export const SITE_VERSION_EVENT = "lemos_site_version_change";

export function loadSiteVersion(): SiteVersion {
  try {
    return localStorage.getItem(LS_KEY) === "2" ? 2 : 1;
  } catch {
    return 1;
  }
}

export function saveSiteVersion(v: SiteVersion) {
  try {
    localStorage.setItem(LS_KEY, String(v));
  } catch {}
  window.dispatchEvent(new Event(SITE_VERSION_EVENT));
}

export function toggleSiteVersion(): SiteVersion {
  const next: SiteVersion = loadSiteVersion() === 1 ? 2 : 1;
  saveSiteVersion(next);
  return next;
}
