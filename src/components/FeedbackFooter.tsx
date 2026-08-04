import { useEffect, useState } from "react";
import { Instagram, MessageCircle } from "lucide-react";

const HANDLE = "@lemosapalavra";
const LS_SOCIAL = "lemos_social_enabled";

/** Redes sociais: desativadas (não clicáveis) por padrão; ativáveis em Configurações. */
export function loadSocialCfg() {
  const v = localStorage.getItem(LS_SOCIAL);
  return { enabled: v === "1" };
}

export function saveSocialCfg(cfg: { enabled: boolean }) {
  localStorage.setItem(LS_SOCIAL, cfg.enabled ? "1" : "0");
  window.dispatchEvent(new Event("lemos_social_change"));
}

const links = [
  { href: "https://wa.me/5515981842767", label: "WhatsApp", Icon: MessageCircle, bg: "#25D366" },
  { href: "https://instagram.com/lemosapalavra", label: "Instagram", Icon: Instagram, bg: "#E1306C" },
];

export default function FeedbackFooter() {
  const [cfg, setCfg] = useState(() => loadSocialCfg());

  useEffect(() => {
    const h = () => setCfg(loadSocialCfg());
    window.addEventListener("lemos_social_change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("lemos_social_change", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  return (
    <footer className="w-full mt-10 py-6 flex flex-col items-center justify-center gap-2 text-center">
      <div className="flex items-center justify-center gap-3">
        {links.map(({ href, label, Icon, bg }) =>
          cfg.enabled ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} ${HANDLE}`}
              title={`${label} ${HANDLE}`}
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              style={{ background: bg }}
            >
              <Icon className="w-5 h-5 text-white" />
            </a>
          ) : (
            <span
              key={label}
              aria-label={`${label} ${HANDLE}`}
              title={`${label} ${HANDLE}`}
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-md opacity-60 pointer-events-none grayscale"
              style={{ background: bg }}
            >
              <Icon className="w-5 h-5 text-white" />
            </span>
          )
        )}
        <p className="font-display font-bold text-sm text-primary">{HANDLE}</p>
      </div>
    </footer>
  );
}
