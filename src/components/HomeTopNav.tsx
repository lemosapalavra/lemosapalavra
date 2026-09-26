import { NavLink } from "@/components/NavLink";

const LINKS = [
  { label: "INÍCIO", to: "/" },
  { label: "ASSISTA", to: "/lemosplay" },
  { label: "ATIVIDADES", to: "/atividades" },
  { label: "JOGOS", to: "/jogos" },
  { label: "ORAÇÃO", to: "/pedidos-oracao" },
  { label: "HISTÓRIAS", to: "/historias-do-dia" },
  { label: "DEVOCIONAIS", to: "/devocionais" },
  { label: "ÁLBUM DE FIGURINHAS", to: "/album" },
];

/**
 * Navegação principal — mesmos rótulos em desktop, tablet e celular.
 * No celular/tablet vira uma faixa rolável horizontalmente.
 */
export default function HomeTopNav() {
  return (
    <nav aria-label="Navegação principal" className="w-full">
      <ul className="flex flex-wrap items-center justify-center gap-2 lg:gap-3 px-1">
        {LINKS.map((l) => (
          <li key={l.to} className="shrink-0">
            <NavLink
              to={l.to}
              end={l.to === "/"}
              title={l.label}
              className="block whitespace-nowrap px-3.5 py-2 rounded-full font-display font-bold text-xs lg:text-sm tracking-wide text-foreground/85 hover:text-foreground hover:bg-amber-100/70 transition"
              activeClassName="bg-amber-200/80 text-foreground shadow-sm"
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}`}</style>
    </nav>
  );
}

