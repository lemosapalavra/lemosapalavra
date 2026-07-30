import { Facebook, Instagram, MessageCircle } from "lucide-react";

const HANDLE = "@lemosapalavra";

const links = [
  { href: "https://facebook.com/lemosapalavra", label: "Facebook", Icon: Facebook, bg: "#1877F2" },
  { href: "https://instagram.com/lemosapalavra", label: "Instagram", Icon: Instagram, bg: "#E1306C" },
  { href: "https://wa.me/5515981842767", label: "WhatsApp", Icon: MessageCircle, bg: "#25D366" },
];

export default function FeedbackFooter() {
  return (
    <footer className="w-full mt-10 py-6 flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        {links.map(({ href, label, Icon, bg }) => (
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
        ))}
      </div>
      <p className="font-display font-bold text-sm text-primary">{HANDLE}</p>
    </footer>
  );
}
