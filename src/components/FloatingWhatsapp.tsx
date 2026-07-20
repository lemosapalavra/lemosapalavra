import { useEffect, useState } from "react";

const LS_ENABLED = "lemos_whatsapp_enabled";
const LS_PHONE = "lemos_whatsapp_phone";

export function loadWhatsappCfg() {
  const enabled = localStorage.getItem(LS_ENABLED);
  const stored = localStorage.getItem(LS_PHONE);
  // Migração: se o valor salvo era um @username (não suportado pelo wa.me),
  // limpamos para forçar o admin a informar um telefone real.
  const phone =
    stored && !/^@/.test(stored.trim()) && /\d/.test(stored) ? stored : "";
  return {
    enabled: enabled === null ? true : enabled === "1",
    phone,
  };
}

export function saveWhatsappCfg(cfg: { enabled: boolean; phone: string }) {
  localStorage.setItem(LS_ENABLED, cfg.enabled ? "1" : "0");
  localStorage.setItem(LS_PHONE, cfg.phone);
  window.dispatchEvent(new Event("lemos_whatsapp_change"));
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
  // wa.me só funciona com número de telefone (com DDI). Usernames como
  // "@lemosapalavra" produzem o erro "esse número não está no WhatsApp".
  const phone = (cfg.phone || "").replace(/\D/g, "");
  if (phone.length < 10) return null;
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Olá! Vim pelo app Lemos a Palavra 🙏"
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco no WhatsApp"
      className="fixed bottom-5 right-5 z-[80] w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-2xl border-2 border-white flex items-center justify-center transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white" aria-hidden="true">
        <path d="M19.11 17.36c-.28-.14-1.65-.81-1.9-.9-.26-.09-.44-.14-.63.14-.19.28-.72.9-.88 1.09-.16.19-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.37-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.46-.48-.63-.49l-.54-.01c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34 0 1.38 1 2.72 1.14 2.9.14.19 1.97 3 4.77 4.21.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.26-.19-.54-.33zM16.02 5.33c-5.9 0-10.7 4.79-10.7 10.68 0 1.88.49 3.72 1.42 5.34L5.33 27.02l5.86-1.36c1.56.85 3.32 1.3 5.13 1.3h.01c5.9 0 10.7-4.79 10.7-10.68 0-2.85-1.11-5.53-3.13-7.55a10.6 10.6 0 0 0-7.58-3.14zm0 19.55h-.01a8.85 8.85 0 0 1-4.51-1.24l-.32-.19-3.34.77.79-3.25-.21-.34a8.83 8.83 0 0 1-1.35-4.72c0-4.9 4.01-8.89 8.94-8.89 2.39 0 4.63.93 6.32 2.61a8.83 8.83 0 0 1 2.61 6.29c0 4.9-4.02 8.89-8.94 8.89z" />
      </svg>
    </a>
  );
}
