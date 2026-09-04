import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const LINKS = [
  { label: "INÍCIO", to: "/" },
  { label: "ASSISTA", to: "/lemosplay" },
  { label: "ATIVIDADES", to: "/atividades" },
  { label: "ORAÇÃO", to: "/pedidos-oracao" },
  { label: "DEVOCIONAIS", to: "/devocionais" },
  { label: "ÁLBUM DE FIGURINHAS", to: "/album" },
];

/**
 * Navegação principal discreta da página inicial.
 * Horizontal no desktop, menu compacto (hambúrguer) no celular.
 */
export default function HomeTopNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Navegação principal" className="w-full">
      {/* Desktop */}
      <ul className="hidden md:flex items-center justify-center gap-2 lg:gap-3 flex-wrap">
        {LINKS.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.to === "/"}
              title={l.label}
              className="px-3.5 py-2 rounded-full font-display font-bold text-xs lg:text-sm tracking-wide text-foreground/85 hover:text-foreground hover:bg-amber-100/70 transition"
              activeClassName="bg-amber-200/80 text-foreground shadow-sm"
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile */}
      <div className="md:hidden flex justify-center">
        <button
          onClick={() => setOpen((v) => !v)}
          title="Abrir menu de navegação"
          aria-expanded={open}
          aria-label="Menu de navegação"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-amber-200 shadow-sm font-display font-bold text-sm text-foreground"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />} MENU
        </button>
      </div>
      {open && (
        <ul className="md:hidden mt-2 mx-auto max-w-[16rem] rounded-2xl bg-white/95 border border-amber-200 shadow-lg overflow-hidden">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                title={l.label}
                className="block px-4 py-3 font-display font-bold text-sm text-foreground/85 hover:bg-amber-100 transition"
                activeClassName="bg-amber-100 text-foreground"
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
