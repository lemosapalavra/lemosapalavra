export type MuralItem = {
  id: string;
  title: string;
  /** dataURL (pinturas) ou URL de imagem da atividade */
  image: string;
  activity: string;
  createdAt: number;
};

const KEY = "lemos_mural";
export const MURAL_EVENT = "lemos:mural";

export function loadMural(): MuralItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? (raw as MuralItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: MuralItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, 60)));
  } catch { /* quota */ }
  window.dispatchEvent(new CustomEvent(MURAL_EVENT));
}

export function saveToMural(item: Omit<MuralItem, "id" | "createdAt">): MuralItem {
  const full: MuralItem = { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now() };
  persist([full, ...loadMural()]);
  return full;
}

export function updateMuralItem(id: string, patch: Partial<Pick<MuralItem, "title" | "image">>) {
  persist(loadMural().map((i) => (i.id === id ? { ...i, ...patch } : i)));
}

export function removeMuralItem(id: string) {
  persist(loadMural().filter((i) => i.id !== id));
}
