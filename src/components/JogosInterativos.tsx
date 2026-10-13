import { useEffect, useMemo, useState } from "react";
import avatarJesus from "@/assets/avatar-jesus.png";
import avatarMaria from "@/assets/avatar-maria.png";
import avatarDavi from "@/assets/avatar-davi.png";
import avatarDaniel from "@/assets/avatar-daniel.png";
import avatarMoises from "@/assets/avatar-moises.png";
import avatarAnjo from "@/assets/avatar-anjo.png";

type GameId = "memory" | "maze" | "jigsaw" | "wordbuilder" | "quiz";
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
 const reset=()=>{
  setDeck(scramble(12).map(i=>i%6));setTurned([]);setFound([]);
  setTiles(scramble(9));setChosen(null);setRound(0);setLetters([]);
  setSelected(null);setAnswers({});setMazeStep(0);
 };
 useEffect(()=>{reset();},[game]);
 const currentWord=wordRounds[round%wordRounds.length];
 const shuffledLetters=useMemo(()=>scramble(Array.from(currentWord.answer).length),[round]);
 const doneWord=letters.map(i=>currentWord.answer[shuffledLetters[i]]).join("");
 const gameTitle:Record<GameId,string>={memory:"Memória Bíblica",maze:"Labirinto",jigsaw:"Quebra-Cabeça",wordbuilder:"Construtor de Palavras",quiz:"Quiz Bíblico"};
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
 return <section className="fixed inset-x-0 bottom-0 top-[118px] sm:top-[130px] z-[55] overflow-y-auto bg-[#fff7df] px-3 pt-3 pb-5 text-amber-950" role="dialog" aria-modal="true" aria-label={gameTitle[game]}>
  <div className="mx-auto max-w-3xl rounded-3xl border-4 border-amber-400 bg-white/95 p-4 shadow-xl">
   <div className="mb-4 flex items-center justify-between gap-3">
    <h2 className="text-xl font-black sm:text-2xl">{gameTitle[game]}</h2>
   </div>
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
