import { useEffect, useMemo, useRef, useState } from "react";
import { awardProgress } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import avatarJesus from "@/assets/avatar-jesus.png";
import avatarMaria from "@/assets/avatar-maria.png";
import avatarDavi from "@/assets/avatar-davi.png";
import avatarDaniel from "@/assets/avatar-daniel.png";
import avatarMoises from "@/assets/avatar-moises.png";
import avatarAnjo from "@/assets/avatar-anjo.png";

type GameId = "memory" | "maze" | "jigsaw" | "wordbuilder" | "quiz" | "pairs" | "fishing";
const pictures = [
 {name:"Jesus",src:avatarJesus},{name:"Maria",src:avatarMaria},
 {name:"Davi",src:avatarDavi},{name:"Daniel",src:avatarDaniel},
 {name:"Moisés",src:avatarMoises},{name:"Anjo",src:avatarAnjo},
];
const wordRounds = [
 {hint:"Quem construiu a arca?",answer:"NOÉ"},
 {hint:"Quem venceu Golias?",answer:"DAVI"},
 {hint:"Quem ficou na cova dos leões?",answer:"DANIEL"},
 {hint:"Quem conduziu o povo pelo mar?",answer:"MOISÉS"},
 {hint:"Quem nasceu em Belém?",answer:"JESUS"},
];
const quizRounds = [
 {q:"Quem construiu a arca?",options:["Moisés","Noé","Davi"],answer:1},
 {q:"Quem venceu Golias?",options:["Davi","Daniel","José"],answer:0},
 {q:"Quem foi lançado na cova dos leões?",options:["Pedro","Jonas","Daniel"],answer:2},
 {q:"Quantos pães Jesus multiplicou na história dos cinco pães e dois peixes?",options:["Cinco","Sete","Doze"],answer:0},
 {q:"Quem foi engolido por um grande peixe?",options:["Abraão","Jonas","Paulo"],answer:1},
];
const scramble = (length:number) => {
 const a=Array.from({length},(_,i)=>i);
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
 if(a.every((v,i)=>v===i)&&a.length>1)[a[0],a[1]]=[a[1],a[0]];
 return a;
};
export default function JogosInterativos({game}:{game:GameId;onClose?:()=>void}) {
 const [fishCaught,setFishCaught]=useState<number[]>([]);
 const [deck,setDeck]=useState<number[]>([]);
 const [turned,setTurned]=useState<number[]>([]);
 const [found,setFound]=useState<number[]>([]);
 const [tiles,setTiles]=useState<number[]>([]);
 const [chosen,setChosen]=useState<number|null>(null);
 const [round,setRound]=useState(0);
 const [letters,setLetters]=useState<number[]>([]);
 const [selected,setSelected]=useState<number|null>(null);
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [mazeStep,setMazeStep]=useState(0);
 const [pairChoice,setPairChoice]=useState<number|null>(null);
 const [pairFound,setPairFound]=useState<number[]>([]);
 const reset=()=>{
  setFishCaught([]);
  setDeck(scramble(12).map(i=>i%6));setTurned([]);setFound([]);
  setTiles(scramble(9));setChosen(null);setRound(0);setLetters([]);
  setSelected(null);setAnswers({});setMazeStep(0);setPairChoice(null);setPairFound([]);
 };
 useEffect(()=>{reset();},[game]);
 const currentWord=wordRounds[round%wordRounds.length];
 const shuffledLetters=useMemo(()=>scramble(Array.from(currentWord.answer).length),[round]);
 const doneWord=letters.map(i=>currentWord.answer[shuffledLetters[i]]).join("");
 const gameTitle:Record<GameId,string>={memory:"Memória Bíblica",maze:"Labirinto",jigsaw:"Quebra-Cabeça",wordbuilder:"Construtor de Palavras",quiz:"Quiz Bíblico",pairs:"Ligue os Pares",fishing:"Pescaria Bíblica"};
 const flip=(i:number)=>{
  if(found.includes(i)||turned.includes(i)||turned.length===2)return;
  const next=[...turned,i];setTurned(next);
  if(next.length===2 && deck[next[0]]===deck[next[1]]){setFound(prev=>[...prev,...next]);setTurned([]);}
 };
 const chooseTile=(i:number)=>{
  if(chosen===null){setChosen(i);return;}
  if(chosen!==i){setTiles(prev=>{const next=[...prev];[next[chosen],next[i]]=[next[i],next[chosen]];return next;});}
  setChosen(null);
 };
 const puzzleImage=avatarJesus;
 const rewardKey = `activity:game:${game}`;
 const rewardAmount = game === "memory" ? COINS.memory : game === "jigsaw" ? COINS.jigsaw : game === "wordbuilder" ? COINS.wordbuilder : game === "quiz" ? COINS.quiz : game === "maze" ? COINS.maze : COINS.connect;
 const total = game === "memory" ? deck.length : game === "jigsaw" ? 9 : game === "wordbuilder" ? wordRounds.length : game === "quiz" ? quizRounds.length : game === "fishing" ? 6 : game === "pairs" ? 5 : 8;
 const completed = game === "memory" ? deck.length > 0 && found.length === deck.length
  : game === "jigsaw" ? tiles.length === 9 && tiles.every((x,i)=>x===i)
  : game === "wordbuilder" ? round >= wordRounds.length
  : game === "quiz" ? Object.keys(answers).length === quizRounds.length && quizRounds.every((q,i)=>answers[i]===q.answer)
  : game === "fishing" ? fishCaught.length === 6
  : game === "pairs" ? pairFound.length === 5 : mazeStep === 8;
 const progress = game === "memory" ? found.length : game === "jigsaw" ? (tiles.length ? tiles.filter((x,i)=>x===i).length : 0)
  : game === "wordbuilder" ? round : game === "quiz" ? Object.keys(answers).length
  : game === "fishing" ? fishCaught.length : game === "pairs" ? pairFound.length : mazeStep;
 const quizAwardRequested = useRef(false);
 useEffect(() => { quizAwardRequested.current = false; }, [game]);
 useEffect(() => {
  if (game !== "quiz" || !completed || quizAwardRequested.current) return;
  quizAwardRequested.current = true;
  const submitted = quizRounds.map((_, i) => answers[i]);
  void (async () => {
   const { data: sessionResult, error: sessionError } = await supabase.auth.getSession();
   if (sessionError || !sessionResult.session?.access_token) {
    toast.error("Entre novamente com sua conta Google para receber os pontos do Tesouro.");
    return;
   }
   const { data, error } = await supabase.functions.invoke("award-quiz-points", {
    body: { answers: submitted },
    headers: { Authorization: `Bearer ${sessionResult.session.access_token}` },
   });
   if (error) {
    const response = "context" in error ? (error as { context?: Response }).context : undefined;
    const status = response?.status;
    // Only report a safe HTTP status, never session tokens or private server errors.
    console.warn("Falha na premiação do Quiz", { status: status ?? "sem resposta" });
    toast.error(status === 401 || status === 403
     ? "Sua sessão não foi aceita (401/403). Saia, entre novamente com Google e refaça o Quiz."
     : status === 422
     ? "As respostas não foram aceitas pelo servidor (422)."
     : `Não foi possível registrar os pontos do Tesouro${status ? ` (erro ${status})` : " (falha de conexão)"}.`);
    return;
   }
   if (data?.awarded) {
    toast.success("Você ganhou 50 pontos no Tesouros da Palavra!");
    window.dispatchEvent(new Event("lemos:reward-experience"));
   } else if (data?.awarded === false) {
    toast.info("Este Quiz já foi premiado. Seus pontos anteriores foram preservados.");
    window.dispatchEvent(new Event("lemos:reward-experience"));
   } else {
    toast.error("O servidor não confirmou a premiação. Tente novamente mais tarde.");
   }
  })();
 }, [game, completed, answers]);
 const latest = useRef({progress:0,completed:false});
 latest.current = {progress,completed};
 useEffect(() => {
  if (completed) awardProgress(rewardKey, rewardAmount, true, "Atividade concluída! Você recebeu o prêmio integral.");
 }, [completed, rewardKey, rewardAmount]);
 useEffect(() => {
  return () => {
   if (latest.current.progress > 0 && !latest.current.completed) {
    awardProgress(rewardKey, rewardAmount, false, "Atividade incompleta: revise e conclua para receber as moedas restantes.");
   }
  };
 }, [rewardKey, rewardAmount]);

 return <section className="fixed inset-x-0 bottom-0 top-[205px] sm:top-[225px] z-[55] overflow-y-auto bg-[#fff7df] px-3 pt-3 pb-5 text-amber-950" role="dialog" aria-modal="true" aria-label={gameTitle[game]}>
  <div className="mx-auto max-w-3xl rounded-3xl border-4 border-amber-400 bg-white/95 p-4 shadow-xl">
   <div className="mb-4 flex items-center justify-between gap-3">
    <h2 className="text-xl font-black sm:text-2xl">{gameTitle[game]}</h2>
   </div>
   {game==="fishing" && <>
    <p className="mb-4">Pesque os peixinhos e descubra mensagens da Bíblia!</p>
    <div className="grid grid-cols-3 gap-3 rounded-2xl bg-sky-200 p-5">
      {["Jesus nos ama","Deus é amor","Tenha fé","Seja bondoso","Perdoe","Ore sempre"].map((msg,i)=>
        <button key={i} disabled={fishCaught.includes(i)} onClick={()=>setFishCaught(a=>[...a,i])}
          className="min-h-24 rounded-2xl bg-sky-100 p-2 text-center text-sm font-bold text-blue-900 shadow-lg disabled:bg-green-100">
          <span className="block text-4xl">{fishCaught.includes(i)?"🎣":"🐟"}</span>{fishCaught.includes(i)?msg:"Pescar"}
        </button>)}
    </div>
    {fishCaught.length===6 && <p className="mt-4 text-center font-black text-green-700">Parabéns! Você pescou todos os peixinhos!</p>}
    <button onClick={()=>setFishCaught([])} className="mt-4 rounded-full bg-amber-300 px-5 py-2 font-bold">Jogar novamente</button>
   </>}
   {game==="memory" && <>
    <p className="mb-3">Encontre os pares de imagens dos personagens bíblicos.</p>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{deck.map((id,i)=>{
     const face=turned.includes(i)||found.includes(i);
     return <button key={i} onClick={()=>flip(i)} aria-label={face?pictures[id].name:"Virar carta"} className={`aspect-square overflow-hidden rounded-xl border-4 ${found.includes(i)?"border-green-500": "border-amber-400"} bg-sky-100`}>
      {face?<img src={pictures[id].src} alt={pictures[id].name} className="h-full w-full object-contain"/>:<span className="text-5xl">📖</span>}
     </button>;
    })}</div>
    {turned.length===2 && <button onClick={()=>setTurned([])} className="mt-3 rounded-full bg-amber-300 px-5 py-2 font-bold">Continuar</button>}
    {found.length===deck.length && <p className="mt-3 font-bold text-green-700">Parabéns! Você encontrou todas as imagens!</p>}
   </>}
   {game==="jigsaw" && <>
    <p className="mb-3">Toque em duas peças para trocar de posição e montar a imagem de Jesus.</p>
    <div className="mx-auto grid aspect-square w-full max-w-[420px] grid-cols-3 overflow-hidden rounded-xl border-4 border-amber-400">{tiles.map((piece,i)=>
     <button key={i} onClick={()=>chooseTile(i)} aria-label={`Peça ${i+1}`} className={`relative overflow-hidden border border-white/60 ${chosen===i?"ring-4 ring-inset ring-yellow-400":""}`}>
      <span className="absolute inset-0" style={{backgroundImage:`url("${puzzleImage}")`,backgroundSize:"300% 300%",backgroundPosition:`${piece%3*50}% ${Math.floor(piece/3)*50}%`}}/>
     </button>
    )}</div>
    {tiles.every((x,i)=>x===i)?<p className="mt-3 text-center font-bold text-green-700">Parabéns! Quebra-cabeça completo!</p>:<p className="mt-3 text-center">Organize as 9 peças para formar a imagem.</p>}
    <button onClick={()=>setTiles(scramble(9))} className="mt-3 rounded-full bg-amber-300 px-5 py-2 font-bold">Embaralhar novamente</button>
   </>}
   {game==="wordbuilder" && <>
    <p className="mb-2 font-bold">{currentWord.hint}</p>
    <p className="mb-3 text-2xl font-black tracking-[0.25em]">{doneWord || "□".repeat(currentWord.answer.length)}</p>
    <div className="flex flex-wrap gap-2">{shuffledLetters.map((letterIndex,i)=><button key={i} disabled={letters.includes(i)} onClick={()=>setLetters(prev=>[...prev,i])}
     className="h-12 w-12 rounded-xl border-2 border-amber-500 bg-yellow-100 text-xl font-black disabled:opacity-30">{currentWord.answer[letterIndex]}</button>)}</div>
    {letters.length===currentWord.answer.length && <p className={`mt-3 font-bold ${doneWord===currentWord.answer?"text-green-700":"text-red-700"}`}>{doneWord===currentWord.answer?"Muito bem! Palavra correta!":"Tente outra ordem para as letras."}</p>}
    <div className="mt-4 flex flex-wrap gap-2">
     <button onClick={()=>setLetters([])} className="rounded-full bg-amber-200 px-4 py-2 font-bold">Recomeçar palavra</button>
     {doneWord===currentWord.answer && <button onClick={()=>{setRound(r=>r+1);setLetters([]);}} className="rounded-full bg-green-700 px-4 py-2 font-bold text-white">Próxima palavra</button>}
    </div>
   </>}
   {game==="quiz" && <>
    <p className="mb-3">Responda às perguntas bíblicas e descubra sua pontuação.</p>
    {quizRounds.map((item,i)=><div key={i} className="mb-4 rounded-xl border border-amber-200 p-3">
     <p className="mb-2 font-bold">{i+1}. {item.q}</p>
     <div className="flex flex-wrap gap-2">{item.options.map((opt,j)=><button key={j} onClick={()=>setAnswers(a=>({...a,[i]:j}))}
      className={`rounded-full border-2 px-3 py-2 ${answers[i]===j?"border-green-700 bg-green-100":"border-amber-300 bg-white"}`}>{opt}</button>)}</div>
    </div>)}
    {Object.keys(answers).length===quizRounds.length && <p className="font-extrabold text-green-700">Você acertou {quizRounds.filter((q,i)=>answers[i]===q.answer).length} de {quizRounds.length} perguntas!</p>}
    <button onClick={()=>setAnswers({})} className="mt-3 rounded-full bg-amber-200 px-4 py-2 font-bold">Refazer quiz</button>
   </>}
   {game==="pairs" && <>
    <p className="mb-3">Escolha um personagem e depois o acontecimento correspondente.</p>
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-2">{["Noé","Davi","Daniel","Moisés","Jonas"].map((name,i)=><button key={name} disabled={pairFound.includes(i)} onClick={()=>setPairChoice(i)} className={`min-h-14 rounded-xl border-2 p-2 font-bold ${pairFound.includes(i)?"border-green-500 bg-green-100":pairChoice===i?"border-amber-600 bg-amber-200":"border-amber-300 bg-white"}`}>{name}{pairFound.includes(i)?" ✓":""}</button>)}</div>
      <div className="flex flex-col gap-2">{[{label:"Venceu Golias",id:1},{label:"Construiu a arca",id:0},{label:"Atravessou o mar",id:3},{label:"Esteve no grande peixe",id:4},{label:"Na cova dos leões",id:2}].map((item)=><button key={item.id} disabled={pairFound.includes(item.id)} onClick={()=>{if(pairChoice===null)return;if(pairChoice===item.id)setPairFound(prev=>[...prev,item.id]);setPairChoice(null);}} className={`min-h-14 rounded-xl border-2 p-2 text-sm font-bold ${pairFound.includes(item.id)?"border-green-500 bg-green-100":"border-amber-300 bg-white"}`}>{item.label}{pairFound.includes(item.id)?" ✓":""}</button>)}</div>
    </div>
    {pairFound.length===5?<p className="mt-4 font-bold text-green-700">Parabéns! Você ligou todos os pares!</p>:<p className="mt-3 text-sm">Pares encontrados: {pairFound.length} de 5.</p>}
    <button onClick={()=>{setPairChoice(null);setPairFound([]);}} className="mt-3 rounded-full bg-amber-200 px-4 py-2 font-bold">Recomeçar</button>
   </>}
   {game==="maze" && <>
    <p className="mb-3">Ajude Davi a encontrar o caminho até a saída! Siga as setas corretas.</p>
    <div className="mx-auto grid w-fit grid-cols-5 gap-1 rounded-xl bg-amber-100 p-2">{Array.from({length:25},(_,i)=>{
     const path=[0,1,6,11,12,13,18,23,24];const active=path.slice(0,mazeStep+1).includes(i);
     return <button key={i} onClick={()=>{if(path[mazeStep+1]===i)setMazeStep(x=>x+1);}}
      className={`flex h-12 w-12 items-center justify-center rounded-md border ${path.includes(i)?"bg-white":"bg-amber-700"} ${active?"border-green-600 bg-green-200":"border-amber-300"}`}>
      {i===0?"👦":i===24?"🏁":active?"🟢":""}</button>;
    })}</div>
    {mazeStep===8 && <p className="mt-3 font-bold text-green-700">Você chegou ao final do labirinto!</p>}
    <button onClick={()=>setMazeStep(0)} className="mt-3 rounded-full bg-amber-200 px-4 py-2 font-bold">Recomeçar</button>
   </>}
  </div>
 </section>;
}
