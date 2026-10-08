import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-central.png";

export const SITE_NAV = [
  ["INÍCIO", "/"], ["VEJA", "/lemosplay"], ["OUÇA", "/lemosplay?view=ouca"], ["APRENDA", "/atividades"],
  ["ORAÇÃO", "/pedidos-oracao"], ["DEVOCIONAIS", "/historias-do-dia"],
  ["FAÇA", "/atividades"], ["ÁLBUM", "/album"], ["FAMÍLIA", "/familia"],
] as const;

export default function SiteHeader({ onSearch }: { onSearch?: () => void }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname + location.search;
  const isActive = (to: string) => to === "/" ? location.pathname === "/" : to === "/lemosplay" ? location.pathname === "/lemosplay" && !new URLSearchParams(location.search).has("view") : current === to || (to !== "/lemosplay?view=ouca" && location.pathname === to);
  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center gap-3 px-4 sm:px-6">
      <Link to="/" className="shrink-0" aria-label="Lemos a Palavra — início">
        <img src={logo} alt="Lemos a Palavra" className="h-16 w-16 object-contain sm:h-[70px] sm:w-[70px]" />
      </Link>
      <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Menu principal">
        {SITE_NAV.map(([label, to]) => <Link key={label} to={to} aria-current={isActive(to) ? "page" : undefined} className={`rounded-full px-2.5 py-2 font-display text-xs font-extrabold transition hover:bg-secondary/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive(to) ? "bg-secondary/20 text-primary" : "text-foreground"}` }>{label}</Link>)}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <Button size="icon" variant="ghost" className="rounded-full" aria-label="Pesquisar" onClick={() => onSearch ? onSearch() : navigate("/?pesquisar=1")}><Search /></Button>
        <Button size="icon" className="rounded-full bg-lemos-navy text-primary-foreground hover:bg-lemos-navy/90 lg:hidden" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(v => !v)}>{open ? <X /> : <Menu />}</Button>
      </div>
    </div>
    {open && <nav className="grid grid-cols-2 gap-2 border-t border-border bg-background p-4 lg:hidden" aria-label="Menu para celular">
      {SITE_NAV.map(([label, to]) => <Link key={label} to={to} onClick={() => setOpen(false)} aria-current={isActive(to) ? "page" : undefined} className={`rounded-lg px-4 py-3 text-center font-display text-sm font-extrabold ${isActive(to) ? "bg-secondary/30 text-primary" : "bg-secondary/15 text-foreground"}`}>{label}</Link>)}
    </nav>}
  </header>;
}
