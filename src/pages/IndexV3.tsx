import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Gamepad2, Heart, Image, Leaf, Play, Search, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileTabBar from "@/components/MobileTabBar";
import { searchContent, type SearchItem } from "@/lib/searchIndex";
import { filmesVideos } from "@/data/bibleVideos";
import hero from "@/assets/home-hero-jesus.jpg";
import logo from "@/assets/logo-central.png";
import lia from "@/assets/louvor-pai.png";
import prayer from "@/assets/icon-pedidos-oracao.png";
import family from "@/assets/grupo-moises.png";
import activityIcon from "@/assets/icon-atividades.png";
import prayerIcon from "@/assets/icon-pedidos-oracao.png";
import devotionalIcon from "@/assets/icon-devocionais.png";
import albumIcon from "@/assets/icon-album.png";
import storiesIcon from "@/assets/icon-historias.png";
import daviImage from "@/assets/historia-davi-golias.png";
import moisesImage from "@/assets/historia-moises-1.png";
import noeImage from "@/assets/historia-noe-1.png";
import criacaoImage from "@/assets/historia-criacao.png";
import jesusImage from "@/assets/historia-nova.png";

const quick=[
 ["ASSISTIR","Histórias, louvores e muito mais!",logo,"/lemosplay","bg-lemos-red"],
 ["HISTÓRIAS BÍBLICAS","Conheça grandes personagens da Bíblia.",storiesIcon,"/historias-do-dia","bg-lemos-blue"],
 ["ATIVIDADES","Brinque, aprenda e descubra!",activityIcon,"/atividades","bg-lemos-green"],
 ["ORAÇÃO","Converse com Deus!",prayerIcon,"/pedidos-oracao","bg-lemos-purple"],
 ["DEVOCIONAIS","Uma mensagem para o seu dia!",devotionalIcon,"/historias-do-dia","bg-lemos-orange"],
 ["ÁLBUM","Colecione as figurinhas!",albumIcon,"/album","bg-lemos-pink"],
] as const;

export default function IndexV3(){
 const navigate=useNavigate(); const searchRef=useRef<HTMLElement>(null); const [query,setQuery]=useState(""); const [results,setResults]=useState<SearchItem[]>([]);
  const featured=filmesVideos.find(v=>v.title.includes("Davi e Golias")) || filmesVideos[0];
  const highlights = [
   ["Moisés", moisesImage],
   ["Noé e a Arca", noeImage],
   ["A Criação", criacaoImage],
   ["Jesus", jesusImage],
  ] as const;
 useEffect(()=>{if(new URLSearchParams(location.search).has("pesquisar")) searchRef.current?.scrollIntoView({behavior:"smooth"})},[]);
 const doSearch=(e:FormEvent)=>{e.preventDefault();setResults(searchContent(query))};
 return <div className="min-h-screen overflow-x-hidden bg-background text-foreground"><SiteHeader onSearch={()=>searchRef.current?.scrollIntoView({behavior:"smooth"})}/><main>
  <section className="relative min-h-[470px] overflow-hidden bg-lemos-sky sm:min-h-[520px]">
   <img src={hero} alt="Jesus ensinando a Palavra às crianças" width={1536} height={720} className="absolute inset-0 h-full w-full object-cover object-[36%_center] sm:object-center" fetchPriority="high"/>
   <div className="absolute inset-0 bg-gradient-to-t from-lemos-navy/45 via-transparent to-transparent sm:bg-gradient-to-l sm:from-background/80 sm:via-background/25 sm:to-transparent"/>
   <div className="relative mx-auto flex min-h-[470px] max-w-7xl items-end justify-center px-5 py-9 text-center sm:min-h-[520px] sm:items-center sm:justify-end sm:text-left">
    <div className="max-w-xl rounded-2xl bg-background/90 p-5 shadow-xl backdrop-blur-sm sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none"><h1 className="font-display text-4xl font-extrabold leading-tight text-lemos-navy sm:text-6xl">Bem-vindo ao<br/>Lemos a Palavra!</h1><p className="mt-3 text-lg font-bold text-lemos-navy sm:text-xl">Conheça Jesus, aprenda a Palavra e divirta-se!</p><Button size="lg" onClick={()=>navigate('/lemosplay')} className="mt-6 h-13 rounded-full bg-lemos-yellow px-7 font-display text-base font-extrabold text-lemos-navy shadow-cartoon hover:bg-lemos-yellow/90"><Play className="fill-current"/> COMEÇAR AGORA</Button></div>
   </div>
  </section>

  <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-extrabold text-lemos-navy sm:text-3xl"><Star className="fill-lemos-yellow text-lemos-yellow"/> O que você quer fazer?</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{quick.map(([t,d,img,to,color])=><Link key={t} to={to} className={`${color} group flex min-h-[190px] flex-col items-center rounded-2xl p-4 text-center text-primary-foreground shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring`}><span className="grid h-20 w-20 place-items-center rounded-2xl bg-background/90 shadow-lg"><img src={img} alt="" className="h-16 w-16 object-contain" loading="lazy"/></span><h3 className="mt-3 font-display text-base font-extrabold leading-tight">{t}</h3><p className="mt-1 text-xs font-semibold leading-snug text-primary-foreground/90">{d}</p></Link>)}</div></section>

   {featured && <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6"><div className="rounded-2xl bg-lemos-sky/25 p-4 sm:p-6"><h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-extrabold text-lemos-navy"><Play className="fill-current"/> Destaques</h2><div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]"><Link to="/lemosplay" className="group grid overflow-hidden rounded-2xl bg-background shadow-md sm:grid-cols-[1.1fr_1fr]"><img src={daviImage} alt={featured.title} className="h-full min-h-56 w-full object-contain p-3 transition group-hover:scale-105" loading="lazy"/><div className="flex flex-col justify-center p-6"><h3 className="font-display text-3xl font-extrabold text-lemos-navy">{featured.title}</h3><p className="mt-2 text-muted-foreground">Uma história sobre coragem e confiança em Deus.</p><span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm font-extrabold text-primary-foreground"><Play className="h-4 w-4 fill-current"/> ASSISTIR AGORA</span></div></Link><div><p className="mb-3 font-display font-extrabold text-lemos-navy">Mais conteúdos para você</p><div className="grid grid-cols-2 gap-3">{highlights.map(([title,image])=><Link key={title} to="/lemosplay" className="overflow-hidden rounded-xl bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-md"><img src={image} alt={title} className="aspect-video w-full object-contain p-2" loading="lazy"/><p className="p-2 font-display text-xs font-extrabold text-lemos-navy">{title}</p></Link>)}</div></div></div></div></section>}

  <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-10 sm:px-6 md:grid-cols-3">
    <Link to="/atividades" className="group relative min-h-56 overflow-hidden rounded-2xl bg-lemos-purple/15 p-6 shadow-md"><img src={lia} alt="Criança lendo a Bíblia" className="absolute bottom-0 left-1 h-44 w-[40%] object-contain transition group-hover:scale-105" loading="lazy"/><div className="ml-[42%]"><Gamepad2 className="text-lemos-purple"/><h2 className="mt-2 font-display text-2xl font-extrabold text-lemos-navy">VAMOS BRINCAR?</h2><p className="text-sm text-muted-foreground">Descubra atividades incríveis!</p><span className="mt-4 inline-flex rounded-full bg-lemos-purple px-4 py-2 font-display text-xs font-bold text-primary-foreground">VER ATIVIDADES</span></div></Link>
    <Link to="/pedidos-oracao" className="group relative min-h-56 overflow-hidden rounded-2xl bg-lemos-navy p-6 text-primary-foreground shadow-md"><img src={prayer} alt="Criança em oração" className="absolute inset-y-0 left-0 h-full w-[45%] object-contain p-3 transition group-hover:scale-105" loading="lazy"/><div className="relative ml-[45%]"><Heart/><h2 className="mt-2 font-display text-2xl font-extrabold">VAMOS ORAR?</h2><p className="text-sm text-primary-foreground/80">Escolha uma oração e fale com Deus.</p><span className="mt-4 inline-flex rounded-full bg-lemos-green px-4 py-2 font-display text-xs font-bold">VER ORAÇÕES</span></div></Link>
    <Link to="/familia" className="group relative min-h-56 overflow-hidden rounded-2xl bg-lemos-orange/15 p-6 shadow-md"><img src={family} alt="Família aprendendo" className="absolute inset-y-0 left-0 h-full w-[45%] object-contain p-3 transition group-hover:scale-105" loading="lazy"/><div className="relative ml-[45%]"><Users className="text-lemos-orange"/><h2 className="mt-2 font-display text-2xl font-extrabold text-lemos-navy">PARA A FAMÍLIA</h2><p className="text-sm text-muted-foreground">Dicas, mensagens e conteúdos especiais.</p><span className="mt-4 inline-flex rounded-full bg-lemos-orange px-4 py-2 font-display text-xs font-bold text-primary-foreground">VER MAIS</span></div></Link>
  </section>

  <section ref={searchRef} className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-10 sm:px-6"><div className="rounded-2xl border bg-card p-5 shadow-sm"><h2 className="font-display text-2xl font-extrabold text-lemos-navy">🔎 Pesquisar conteúdo</h2><form onSubmit={doSearch} className="mt-4 flex gap-2"><label className="sr-only" htmlFor="home-search">O que você procura?</label><input id="home-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="O que você procura?" className="h-12 min-w-0 flex-1 rounded-full border bg-background px-5 text-base outline-none focus:ring-2 focus:ring-ring"/><Button type="submit" size="icon" className="h-12 w-12 shrink-0 rounded-full" aria-label="Buscar"><Search/></Button></form>{results.length>0&&<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{results.map((r,i)=><Link key={`${r.title}-${i}`} to={r.to} className="flex items-center gap-3 rounded-xl border bg-background p-3 hover:border-primary"><div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary/20">{r.image?<img src={r.image} alt="" className="h-full w-full object-cover" loading="lazy"/>:<BookOpen/>}</div><div><span className="text-xs font-bold text-primary">{r.type}</span><h3 className="font-display font-extrabold text-lemos-navy">{r.title}</h3><p className="line-clamp-1 text-xs text-muted-foreground">{r.description}</p></div></Link>)}</div>}{query.length>=2&&results.length===0&&<p className="mt-4 text-muted-foreground">Nenhum conteúdo encontrado. Tente outra palavra.</p>}</div></section>

  <section className="bg-lemos-sky/25 px-5 py-12 text-center"><img src={logo} alt="" className="mx-auto h-20 w-20 object-contain" loading="lazy"/><h2 className="mt-3 font-display text-3xl font-extrabold text-lemos-navy">Jesus, nossa maior jornada</h2><p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Conhecer Jesus, aprender Sua Palavra e fazer a diferença com amor. Um projeto cristão para crianças, jovens e toda a família.</p><Link to="/familia" className="mt-5 inline-flex items-center gap-2 font-display font-extrabold text-primary">CONHEÇA NOSSA MISSÃO <ArrowRight/></Link></section>
 </main><SiteFooter/><MobileTabBar/></div>
}
