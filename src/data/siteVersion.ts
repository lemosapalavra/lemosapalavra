/** A identidade visual ativa do site é exclusivamente a versão original. */
export type SiteVersion = 1;

const LS_KEY = "lemos_site_version";
export const SITE_VERSION_EVENT = "lemos_site_version_change";

export function loadSiteVersion(): SiteVersion {
  try { localStorage.setItem(LS_KEY, "1"); } catch {}
  return 1;
}

export function saveSiteVersion(v: SiteVersion) {
  try {
    localStorage.setItem(LS_KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(SITE_VERSION_EVENT));
}

export function toggleSiteVersion(): SiteVersion {
  saveSiteVersion(1);
  return 1;
}
