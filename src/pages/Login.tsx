import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const avatars = [
  ["jesus","Jesus","✝️"],["maria","Maria","🕊️"],["davi","Davi","👑"],
  ["moises","Moisés","📜"],["abraao","Abraão","⭐"],["jose","José","🪚"],
  ["lia","Lia","🌸"],["marta","Marta","🌷"],["noe","Noé","🛶"],["paulo","Paulo","📖"]
];
const mask = (s:string) => { const d=s.replace(/\D/g,"").slice(0,11); return d.length>6 ? `(${d.slice(0,2)}) ${d.slice(2,d.length===11?7:6)}-${d.slice(d.length===11?7:6)}` : d.length>2 ? `(${d.slice(0,2)}) ${d.slice(2)}` : d; };
export default function Login(){
 const navigate=useNavigate();
 const [name,setName]=useState("");
 const [phone,setPhone]=useState("");
 const [avatar,setAvatar]=useState("jesus");
 const [busy,setBusy]=useState(false);
 const enter=async()=>{
  const digits=phone.replace(/\D/g,"");
  if(name.trim().length<2 || !/^\d{2}9\d{8}$/.test(digits)){toast({title:"Confira seus dados",description:"Informe seu nome e celular com DDD.",variant:"destructive"});return;}
  sessionStorage.setItem("lemos_registration_draft",JSON.stringify({name:name.trim(),phone:digits,avatar:"/avatars-login/"+avatar+".webp"}));
  setBusy(true);
  try{
   const {data:{user}}=await supabase.auth.getUser();
   if(user){navigate("/bem-vindo");return;}
   const {lovable}=await import("@/integrations/lovable/index");
   const result=await lovable.auth.signInWithOAuth("google",{redirect_uri:window.location.origin+"/bem-vindo"});
   if(result.error) throw result.error;
  }catch(e:any){toast({title:"Não foi possível continuar",description:e?.message||"Tente novamente.",variant:"destructive"});}
  finally{setBusy(false);}
 };
 return <main className="min-h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-amber-50 to-amber-200 px-4 py-8 text-amber-950">
  <div className="pointer-events-none absolute inset-0 opacity-40" style={{backgroundImage:"radial-gradient(circle at 12% 20%, #fff 0 2%, transparent 2.5%), radial-gradient(circle at 85% 15%, #fff 0 3%, transparent 3.5%)"}}/>
  <div className="relative mx-auto max-w-5xl">
   <header className="text-center mb-5">
    <div className="mx-auto mb-2 w-fit rounded-3xl border-4 border-amber-700 bg-gradient-to-b from-amber-400 to-amber-600 px-8 py-3 shadow-[0_8px_0_#92400e,0_18px_28px_#92400e66]">
     <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white" style={{textShadow:"2px 3px #78350f"}}>📖 Lemos a Palavra</h1>
    </div>
    <p className="mt-5 inline-block rounded-full bg-white/80 px-5 py-2 font-bold text-amber-900 shadow">Onde a Palavra ganha Vida</p>
   </header>
   <div className="grid items-center gap-5 lg:grid-cols-[1fr_minmax(0,640px)_1fr]">
    <aside className="hidden lg:block text-center"><div className="text-8xl drop-shadow-xl">🕊️</div><p className="mt-4 text-xl font-extrabold">Jesus te convida para uma linda jornada!</p></aside>
    <section className="rounded-[2rem] border-4 border-amber-300 bg-gradient-to-b from-[#fff9eb] to-[#ffe9bf] p-5 sm:p-8 shadow-[0_14px_0_#d9a34f,0_24px_45px_#78350f55]">
     <h2 className="text-center text-3xl sm:text-4xl font-black">Bem-vindo! 🌟</h2>
     <p className="mx-auto mt-2 mb-6 max-w-md text-center text-sm sm:text-base">Entre para descobrir histórias, jogos e atividades da Bíblia.</p>
     <div className="space-y-4">
      <label className="block font-bold">👤 Seu nome<input value={name} onChange={e=>setName(e.target.value)} maxLength={60} autoComplete="name" placeholder="Digite seu nome" className="mt-2 w-full rounded-2xl border-2 border-amber-200 bg-white p-3 text-base outline-none focus:border-amber-600"/></label>
      <label className="block font-bold">📱 Celular<input value={phone} onChange={e=>setPhone(mask(e.target.value))} inputMode="tel" autoComplete="tel-national" placeholder="(11) 99999-9999" className="mt-2 w-full rounded-2xl border-2 border-amber-200 bg-white p-3 text-base outline-none focus:border-amber-600"/></label>
      <div><h3 className="text-center text-xl font-black">Escolha seu Avatar</h3><p className="mb-3 text-center text-sm">Seu personagem bíblico favorito</p>
       <div className="grid grid-cols-5 gap-2">{avatars.map(([id,label,emoji])=><button key={id} type="button" onClick={()=>setAvatar(id)} aria-pressed={avatar===id} className={`rounded-xl border-2 p-1 text-center transition-transform hover:scale-105 ${avatar===id?"border-amber-600 bg-amber-200 ring-2 ring-yellow-400":"border-amber-200 bg-white/80"}`}>
       <span className="block text-3xl sm:text-4xl">{emoji}</span><span className="block truncate text-[10px] sm:text-xs font-bold">{label}</span></button>)}</div>
      </div>
      <button type="button" onClick={enter} disabled={busy} className="w-full rounded-2xl border-b-8 border-amber-700 bg-gradient-to-b from-yellow-400 to-amber-500 px-4 py-4 text-lg sm:text-xl font-black shadow-xl hover:brightness-105 disabled:opacity-50">{busy?"Preparando...":"➜ Entrar e Começar"}</button>
      <p className="text-center text-xs text-amber-800">Para proteger sua conta, a primeira entrada é confirmada com Google. Nome, celular e avatar serão salvos no seu perfil após a confirmação.</p>
      <button type="button" onClick={()=>navigate("/")} className="block mx-auto text-sm font-semibold underline">Conhecer o site como visitante</button>
     </div>
    </section>
    <aside className="hidden lg:block text-center"><div className="text-8xl drop-shadow-xl">🐑</div><p className="mt-4 text-xl font-extrabold">Aprenda, brinque e descubra a Palavra de Deus!</p></aside>
   </div>
 </div>
 </main>;
}
