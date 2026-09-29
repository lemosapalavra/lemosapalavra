/**
 * Controle (apenas do administrador) de qual conteúdo do site fica
 * disponível para cada faixa etária: seções do site, atividades e jogos.
 * A configuração é guardada localmente; sem regra salva, tudo fica liberado.
 */
import { ACTIVITY_AGE_RANGES, type ActivityAgeRange, currentUserAgeRange } from "@/lib/activityAccess";

export { ACTIVITY_AGE_RANGES, currentUserAgeRange };
export type { ActivityAgeRange };

export type ContentGroup = "secoes" | "atividades" | "jogos";

export const SITE_SECTIONS: { id: string; title: string; route: string }[] = [
  { id: "lemosplay", title: "Assistir", route: "/lemosplay" },
  { id: "historias", title: "Estudo Bíblico", route: "/historias-do-dia" },
  { id: "atividades", title: "Atividades", route: "/atividades" },
  { id: "jogos", title: "Jogos", route: "/jogos" },
  { id: "oracao", title: "Oração", route: "/pedidos-oracao" },
  { id: "devocionais", title: "Devocionais", route: "/devocionais" },
  { id: "album", title: "Álbum de Figurinhas", route: "/album" },
  { id: "biblia", title: "Bíblia", route: "/biblia" },
  { id: "louvores", title: "Louvores", route: "/louvores" },
];

export const SITE_GAMES: { id: string; title: string }[] = [
  { id: "memory", title: "Memória Bíblica" },
  { id: "maze", title: "Labirinto" },
  { id: "jigsaw", title: "Quebra-Cabeça" },
  { id: "wordbuilder", title: "Construtor de Palavras" },
  { id: "quiz", title: "Quiz Bíblico" },
];

const KEY = "lemos_content_access_v1";

export type ContentAccessMap = Partial<Record<ContentGroup, Partial<Record<ActivityAgeRange, string[]>>>>;

export function loadContentAccess(): ContentAccessMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ContentAccessMap) : {};
  } catch {
    return {};
  }
}

export function saveContentAccess(map: ContentAccessMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("lemos:content-access"));
  } catch {
    /* noop */
  }
}

/** Ids liberados para o usuário atual; `null` significa "tudo liberado". */
export function allowedIds(group: ContentGroup): string[] | null {
  const range = currentUserAgeRange();
  if (!range) return null;
  const list = loadContentAccess()[group]?.[range];
  return list ?? null;
}

export function isAllowed(group: ContentGroup, id: string): boolean {
  const list = allowedIds(group);
  return !list || list.includes(id);
}
