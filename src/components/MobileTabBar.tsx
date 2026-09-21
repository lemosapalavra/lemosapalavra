import { Link, useLocation } from "react-router-dom";
import { Gamepad2, Home, Menu, Play, Sparkles } from "lucide-react";
const items = [["Início", "/", Home], ["Assistir", "/lemosplay", Play], ["Atividades", "/atividades", Gamepad2], ["Oração", "/pedidos-oracao", Sparkles], ["Menu", "/familia", Menu]] as const;
export default function MobileTabBar() {
 const { pathname } = useLocation();
 return <nav className="fixed inset-x-0 bottom-0 z-[60] grid grid-cols-5 border-t border-border bg-lemos-navy px-1 pb-[env(safe-area-inset-bottom)] text-primary-foreground shadow-2xl md:hidden" aria-label="Navegação rápida">
  {items.map(([label,to,Icon]) => <Link key={label} to={to} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold ${pathname===to ? "text-lemos-yellow" : "text-primary-foreground/80"}`}><Icon className="h-5 w-5"/><span>{label}</span></Link>)}
 </nav>
}
