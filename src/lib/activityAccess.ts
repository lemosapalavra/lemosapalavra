/**
 * Controle (apenas do administrador) de quais atividades ficam disponíveis
 * para cada faixa etária. A configuração é guardada localmente e, quando
 * nenhuma regra existe, todas as atividades continuam liberadas.
 */
export const ACTIVITY_AGE_RANGES = [
  { id: "criancas", label: "Crianças (0–12)", emoji: "🧒" },
  { id: "adolescentes", label: "Adolescentes (13–17)", emoji: "🧑" },
  { id: "jovens", label: "Jovens adultos (18–24)", emoji: "🧑‍🎓" },
  { id: "adultos", label: "Adultos (25 e mais)", emoji: "🧔" },
] as const;

export type ActivityAgeRange = (typeof ACTIVITY_AGE_RANGES)[number]["id"];

const KEY = "lemos_activity_access_v1";

export type ActivityAccessMap = Partial<Record<ActivityAgeRange, string[]>>;

export function loadActivityAccess(): ActivityAccessMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ActivityAccessMap) : {};
  } catch {
    return {};
  }
}

export function saveActivityAccess(map: ActivityAccessMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("lemos:activity-access"));
  } catch {
    /* noop */
  }
}

export function currentUserAgeRange(): ActivityAgeRange | null {
  try {
    const u = JSON.parse(localStorage.getItem("lemos_user") || "null");
    const r = u?.ageRange || u?.age_range;
    return ACTIVITY_AGE_RANGES.some((a) => a.id === r) ? (r as ActivityAgeRange) : null;
  } catch {
    return null;
  }
}

/** Retorna os ids permitidos; `null` significa "todas liberadas". */
export function allowedActivityIds(): string[] | null {
  const range = currentUserAgeRange();
  if (!range) return null;
  const map = loadActivityAccess();
  const list = map[range];
  if (!list) return null;
  return list;
}
