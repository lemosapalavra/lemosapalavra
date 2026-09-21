import { Link } from "react-router-dom";
import ShareButton from "@/components/ShareButton";
import logo from "@/assets/logo-central.png";
import { SITE_NAV } from "@/components/SiteHeader";
export default function SiteFooter() {
 return <footer className="relative z-20 mt-14 bg-lemos-navy pb-20 text-primary-foreground md:pb-0">
  <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-[180px_1fr_auto] md:items-center">
   <div className="flex items-center gap-3"><img src={logo} alt="Lemos a Palavra" className="h-16 w-16 object-contain"/><p className="font-display text-sm font-bold">Deus Fonte de Amor</p></div>
   <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label="Links do rodapé">{SITE_NAV.map(([l,t])=><Link key={t} to={t} className="text-xs font-bold text-primary-foreground/85 hover:text-lemos-yellow">{l}</Link>)}</nav>
   <ShareButton variant="inline" className="bg-primary/20 text-primary-foreground hover:bg-primary/30" />
  </div>
  <p className="border-t border-primary-foreground/15 px-5 py-4 text-center text-xs text-primary-foreground/80">✝️ Projeto cristão, sem interesses financeiros ou político. Dedicado somente ao Evangelho de Jesus Cristo a todas gerações. Faça parte, compartilhe!</p>
 </footer>
}
