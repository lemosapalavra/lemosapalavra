/**
 * Aviso de novidades: compara os títulos disponíveis em cada seção com os que
 * o usuário já viu (guardados localmente) e informa quantos são novos.
 */

export type ContentSection = "lemosplay" | "louvores";

const KEY = (s: ContentSection) => `lemos_seen_${s}_v1`;

function loadSeen(section: ContentSection): string[] | null {
  try {
    const raw = localStorage.getItem(KEY(section));
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch {
    return null;
  }
}

export function markSeen(section: ContentSection, titles: string[]) {
  try {
    localStorage.setItem(KEY(section), JSON.stringify(titles));
    window.dispatchEvent(new Event("lemos_new_content_change"));
  } catch {}
}

/** Títulos novos desde a última visita. Na primeira vez, nada é "novo". */
export function getNewTitles(section: ContentSection, titles: string[]): string[] {
  const seen = loadSeen(section);
  if (!seen) {
    markSeen(section, titles);
    return [];
  }
  return titles.filter((t) => !seen.includes(t));
}

export function getNewCount(section: ContentSection, titles: string[]): number {
  return getNewTitles(section, titles).length;
}
