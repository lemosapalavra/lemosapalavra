import { useEffect, useState } from "react";

/** Ícones fixos do site que o administrador pode ligar/desligar. */
export const SITE_ICONS = [
  { id: "lia", title: "Mascote LIA" },
  { id: "usuario", title: "Ícone do usuário" },
  { id: "dedicatoria", title: "Dedicatória" },
  { id: "atalho", title: "Baixar atalho" },
  { id: "14bis", title: "14 Bis voando" },
  { id: "kart", title: "Kartzinho" },
];

const KEY = "lemos_icon_visibility_v5";
const PREVIOUS_KEY = "lemos_icon_visibility_v4";
const EVT = "lemos_icon_visibility_change";

export function loadHiddenIcons(): string[] {
  const restored = new Set(["lia", "usuario", "dedicatoria", "14bis"]);
  const defaults = SITE_ICONS.filter((icon) => !restored.has(icon.id)).map((icon) => icon.id);
  try {
    const current = localStorage.getItem(KEY);
    const raw = current ?? localStorage.getItem(PREVIOUS_KEY);
    if (!raw) return defaults;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaults;
    return parsed.filter((id): id is string =>
      typeof id === "string" && (current !== null || !restored.has(id))
    );
  } catch {
    return defaults;
  }
}

export function setIconHidden(id: string, hidden: boolean) {
  const cur = new Set(loadHiddenIcons());
  hidden ? cur.add(id) : cur.delete(id);
  localStorage.setItem(KEY, JSON.stringify([...cur]));
  window.dispatchEvent(new Event(EVT));
}

export function useIconVisible(id: string) {
  const [visible, setVisible] = useState(() => !loadHiddenIcons().includes(id));
  useEffect(() => {
    const h = () => setVisible(!loadHiddenIcons().includes(id));
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => { window.removeEventListener(EVT, h); window.removeEventListener("storage", h); };
  }, [id]);
  return visible;
}
