import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, ChevronRight, Sparkles, X } from "lucide-react";
import { awardProgress } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";

const verses = [
 { reference:"Salmo 23:1", before:"O Senhor é o meu", after:"; nada me faltará.", answer:"Pastor", options:["Pastor","Amigo","Rei"], explanation:"Davi compara Deus a um pastor que cuida, protege e guia suas ovelhas. Deus também cuida de nós." },
 { reference:"Salmo 119:105", before:"Lâmpada para os meus pés é a tua", after:", e luz para o meu caminho.", answer:"palavra", options:["palavra","coroa","casa"], explanation:"A Palavra de Deus nos orienta, assim como uma luz ilumina nosso caminho." },
 { reference:"Filipenses 4:13", before:"Tudo posso naquele que me", after:".", answer:"fortalece", options:["fortalece","esconde","esquece"], explanation:"Podemos confiar na força que Cristo nos dá para enfrentar os desafios." },
 { reference:"1 João 4:8", before:"Deus é", after:".", answer:"amor", options:["amor","ouro","vento"], explanation:"O amor faz parte de quem Deus é. Podemos demonstrá-lo cuidando das pessoas." },
 { reference:"Gênesis 1:1", before:"No princípio, criou Deus os céus e a", after:".", answer:"terra", options:["terra","arca","estrela"], explanation:"A Bíblia começa contando que Deus é o Criador dos céus e da terra." },
];
export default function CompleteVersiculo({onClose}:{onClose:()=>void}) {
 const [step,setStep]=useState(-1);
 const [selected,setSelected]=useState<string|null>(null);
 const [completed,setCompleted]=useState(false);
 const verse=verses[Math.max(0,Math.min(step,verses.length-1))];
 const correct=selected===verse.answer;
 useEffect(()=>{
  const handle=(e:Event)=>{e.preventDefault();onClose();};
  window.addEventListener("lemos:back",handle);
  window.dispatchEvent(new CustomEvent("lemos:lia-context",{detail:"Complete o Versículo: escolha a palavra que falta na passagem bíblica."}));
  return ()=>{window.removeEventListener("lemos:back",handle);window.dispatchEvent(new CustomEvent("lemos:lia-context",{detail:null}));};
 },[onClose]);
 const next=()=>{
  if(step===verses.length-1){
   if(!completed){awardProgress("activity:complete-versiculo",COINS.quiz,true,"Versículos completados!");setCompleted(true);}
   setStep(verses.length);
  } else {setStep(s=>s+1);setSelected(null);}
 };
 return <section className="fixed inset-x-0 bottom-[calc(70px+env(safe-area-inset-bottom,0px))] top-[85px] z-[60] overflow-y-auto bg-gradient-to-b from-sky-200 via-amber-50 to-emerald-100 px-4 py-5 text-amber-950">
  <div className="mx-auto max-w-xl">
   <div className="flex items-center justify-between"><button onClick={onClose} className="rounded-full border-2 border-amber-500 bg-white p-2 shadow" aria-label="Voltar para Aprenda"><X/></button><span className="text-sm font-bold text-amber-900">Aprenda • Complete o Versículo</span></div>
   <header className="mt-4 rounded-[28px] border-4 border-amber-500 bg-gradient-to-b from-amber-700 to-amber-950 p-5 text-center text-white shadow-xl"><BookOpen className="mx-auto mb-2 h-12 w-12 text-amber-200"/><h1 className="text-2xl font-black text-amber-200 sm:text-3xl">Complete o Versículo</h1><p className="mt-2 text-sm font-semibold">Descubra a palavra que falta na Bíblia!</p></header>
   {step===-1 ? <div className="mt-6 rounded-[28px] border-2 border-amber-300 bg-white/95 p-6 text-center shadow-lg"><span className="text-6xl">📖✨</span><p className="mt-4 text-lg font-bold">Leia o versículo e escolha a palavra correta entre três alternativas.</p><p className="mt-3 text-sm">São cinco desafios. Ao completar todos, você ganha as moedinhas da atividade!</p><button onClick={()=>setStep(0)} className="mt-6 rounded-full bg-amber-500 px-8 py-3 font-black text-amber-950 shadow-lg">Vamos começar! <ChevronRight className="inline"/></button></div> :
   step>=verses.length ? <div className="mt-6 rounded-[28px] border-4 border-yellow-400 bg-white p-7 text-center shadow-xl"><span className="text-6xl">🏆</span><h2 className="mt-3 text-2xl font-black">Parabéns!</h2><p className="mt-3">Você completou os cinco versículos e aprendeu mais sobre a Palavra de Deus!</p><p className="mt-3 font-bold text-emerald-700">Moedinhas da atividade concedidas conforme as regras do site.</p><button onClick={onClose} className="mt-6 rounded-full bg-emerald-600 px-7 py-3 font-bold text-white">Voltar ao Aprenda</button></div> :
   <div className="mt-5 rounded-[28px] border-[3px] border-amber-400 bg-[#fff9e8] p-5 text-center shadow-xl">
    <div className="mx-auto mb-5 w-fit rounded-full bg-amber-200 px-5 py-2 text-sm font-black">Pergunta {step+1} de {verses.length}</div>
    <p className="text-xl font-black leading-relaxed">“{verse.before} <span className={selected&&correct?"text-emerald-700":"text-amber-700"}>{selected&&correct?verse.answer:"________"}</span>{verse.after}”</p><p className="mt-3 text-sm font-bold text-amber-700">{verse.reference}</p>
    <div className="mt-6 grid gap-3">{verse.options.map(option=><button key={option} disabled={selected!==null} onClick={()=>setSelected(option)} className={`rounded-full border-2 px-4 py-3 text-lg font-extrabold shadow-sm transition ${selected===option?(correct?"border-emerald-600 bg-emerald-200":"border-rose-500 bg-rose-100"):"border-amber-400 bg-white"} disabled:opacity-90`}>{option}</button>)}</div>
    {selected&&<div className="mt-5 rounded-2xl border-2 border-amber-300 bg-white p-4 text-left"><p className={`flex items-center gap-2 font-black ${correct?"text-emerald-700":"text-rose-700"}`}>{correct?<CheckCircle2/>:<Sparkles/>}{correct?"Muito bem!":"Quase! Tente novamente."}</p>{correct?<><p className="mt-2 text-sm leading-relaxed">{verse.explanation}</p><button onClick={next} className="mt-4 w-full rounded-full bg-emerald-600 px-5 py-3 font-bold text-white">{step===verses.length-1?"Concluir atividade":"Próxima pergunta"} <ChevronRight className="inline"/></button></>:<button onClick={()=>setSelected(null)} className="mt-3 rounded-full bg-amber-400 px-5 py-2 font-bold">Tentar outra palavra</button>}</div>}
   </div>}
  </div>
 </section>;
}
