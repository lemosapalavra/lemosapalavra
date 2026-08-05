import { useEffect, useState } from "react";
import { Mail } from "lucide-react";

const LS_ENABLED = "lemos_whatsapp_enabled";
const LS_EMAIL = "lemos_contact_email";
const DEFAULT_EMAIL = "lemosapalavra@gmail.com";

export function loadWhatsappCfg() {
  const enabled = localStorage.getItem(LS_ENABLED);
  const stored = localStorage.getItem(LS_EMAIL);
  return {
    enabled: enabled === null ? true : enabled === "1",
    email: stored && stored.includes("@") ? stored : DEFAULT_EMAIL,
  };
}

export function saveWhatsappCfg(cfg: { enabled: boolean; email: string }) {
  localStorage.setItem(LS_ENABLED, cfg.enabled ? "1" : "0");
  localStorage.setItem(LS_EMAIL, cfg.email);
  window.dispatchEvent(new Event("lemos_whatsapp_change"));
}

function buildHref(email: string): string {
  const subject = encodeURIComponent("Contato — Lemos a Palavra");
  const body = encodeURIComponent("Olá! Vim pelo app Lemos a Palavra 🙏\n\n");
  const to = email && email.includes("@") ? email : DEFAULT_EMAIL;
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

export default function FloatingWhatsapp() {
  const [cfg, setCfg] = useState(() => loadWhatsappCfg());

  useEffect(() => {
    const h = () => setCfg(loadWhatsappCfg());
    window.addEventListener("lemos_whatsapp_change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("lemos_whatsapp_change", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  if (!cfg.enabled) return null;
  const href = buildHref(cfg.email);

  return (
    <a
      href={href}
      aria-label={`Fale conosco por e-mail ${cfg.email}`}
      className="fixed bottom-40 right-4 z-[80] w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 shadow-2xl border-2 border-white flex items-center justify-center transition-transform hover:scale-110"
    >
      <Mail className="w-7 h-7 text-white" aria-hidden="true" />
    </a>
  );
}
