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

const KEY = "lemos_icon_visibility_v3";
const EVT = "lemos_icon_visibility_change";

export function loadHiddenIcons(): string[] {
  const defaults = ["atalho", "14bis", "kart"];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : defaults;
  } catch { return defaults; }
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
