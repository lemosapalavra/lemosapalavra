import { BookOpen, Heart, Home, MoonStar } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import MobileTabBar from "@/components/MobileTabBar";
import SiteFooter from "@/components/SiteFooter";
import familyAsset from "@/assets/grupo-moises.png";
const cards=[
 ["Momento em família","Separe alguns minutos para ler uma história bíblica e conversar sobre o que ela ensina.",BookOpen,"/historias-do-dia"],
 ["Oração em família","Agradeçam juntos e entreguem a Deus as alegrias e preocupações do dia.",Heart,"/pedidos-oracao"],
 ["Aprender brincando","Escolham uma atividade e participem juntos das descobertas das crianças.",Home,"/atividades"],
 ["Antes de dormir","Terminem o dia com uma oração, um abraço e uma palavra de esperança.",MoonStar,"/pedidos-oracao"],
] as const;
export default function Familia(){return <div className="min-h-screen bg-background"><SiteHeader/><main>
  <section className="overflow-hidden bg-secondary/15"><div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 md:grid-cols-2 md:py-16"><div><p className="font-display font-bold text-primary">❤️ PARA TODA A FAMÍLIA</p><h1 className="mt-2 font-display text-4xl font-extrabold text-lemos-navy sm:text-5xl">Crescendo juntos na Palavra</h1><p className="mt-4 max-w-xl text-lg text-muted-foreground">Conteúdos para pais, mães, avós e responsáveis viverem momentos de fé, conversa e aprendizado com as crianças.</p></div><img src={familyAsset} alt="Família aprendendo junta" className="mx-auto aspect-[4/3] w-full max-w-lg rounded-2xl object-contain p-5 shadow-cartoon"/></div></section>
 <section className="mx-auto max-w-7xl px-5 py-12"><div className="grid gap-4 sm:grid-cols-2">{cards.map(([t,d,I,to])=><Link key={t} to={to} className="group rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-cartoon"><I className="h-10 w-10 text-primary"/><h2 className="mt-4 font-display text-2xl font-extrabold text-lemos-navy">{t}</h2><p className="mt-2 text-muted-foreground">{d}</p><span className="mt-5 inline-block font-display font-bold text-primary">VER CONTEÚDO →</span></Link>)}</div></section>
 <section className="bg-lemos-sky/25 px-5 py-12 text-center"><h2 className="font-display text-3xl font-extrabold text-lemos-navy">Jesus é o centro da nossa família</h2><p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Um espaço seguro e acolhedor para todas as gerações conhecerem o Evangelho de forma simples.</p></section>
 </main><SiteFooter/><MobileTabBar/></div>}
