import { awardProgress } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import quemSouEu1 from "@/assets/aprenda/quem-sou-eu-1.webp";
import palavrasIcon from "@/assets/jogos/construa-palavras-icon.webp";
import memoriaIcon from "@/assets/jogos/memoria-icon.webp";
import quebraIcon from "@/assets/jogos/quebra-cabeca-icon.webp";
import quizIcon from "@/assets/jogos/quiz-biblico-icon.webp";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type Activity = { title: string; kind: "vf" | "character" | "quiz" | "memory"; questions?: { text: string; answer: string; options?: string[] }[]; cards?: string[]; verse: string };
const vf = (title: string, verse: string, statements: [string, boolean][]): Activity => ({title, kind:"vf",verse,questions:statements.map(([text,answer])=>({text,answer:answer?"V":"F",options:["V","F"]}))});
const who = (title: string, verse: string, answers: [string,string][], names:string[]):Activity => ({title,kind:"character",verse,questions:answers.map(([text,answer])=>({text,answer,options:names}))});
const quiz = (title:string,verse:string,items:[string,string,string[]][]):Activity=>({title,kind:"quiz",verse,questions:items.map(([text,answer,options])=>({text,answer,options}))});
const activities:Activity[] = [
vf("Davi e Golias","1 Samuel 17:32–50",[
["Davi confiava que Deus o ajudaria.",true],["Davi decidiu lutar usando a armadura de Saul.",false],["Davi escolheu cinco pedras lisas no riacho.",true],["Golias era um soldado do exército de Israel.",false],["Davi enfrentou Golias com uma funda.",true],["Davi venceu Golias confiando em Deus.",true]]),
vf("Jesus Acalma a Tempestade","Marcos 4:35–41",[
["Jesus e os discípulos entraram em um barco.",true],["Um forte vendaval começou durante a viagem.",true],["Jesus estava acordado e dirigia o barco.",false],["Os discípulos acordaram Jesus e pediram ajuda.",true],["Jesus repreendeu o vento, e tudo ficou calmo.",true],["Os discípulos acalmaram a tempestade sozinhos.",false]]),
vf("Zaqueu Encontra Jesus","Lucas 19:1–10",[
["Zaqueu morava na cidade de Jericó.",true],["Zaqueu trabalhava como pescador.",false],["Zaqueu era de pequena estatura.",true],["Zaqueu subiu em uma árvore para ver Jesus.",true],["Jesus ignorou Zaqueu e continuou andando.",false],["Zaqueu recebeu Jesus com alegria.",true]]),
vf("O Bom Samaritano","Lucas 10:30–37",[
["Um homem viajava de Jerusalém para Jericó.",true],["Os assaltantes tiraram os seus pertences e o feriram.",true],["O sacerdote parou e cuidou do homem.",false],["O levita levou o homem para uma hospedaria.",false],["O samaritano teve compaixão do homem.",true],["O samaritano cuidou dele e o levou para uma hospedaria.",true]]),
{title:"Memória: Noé e os Animais",kind:"memory",verse:"Gênesis 6:19–22",cards:["LEÃO","ELEFANTE","GIRAFA","POMBA","OVELHA","ZEBRA"]},
{title:"Memória: Símbolos Bíblicos",kind:"memory",verse:"Histórias bíblicas",cards:["ARCA","LEÃO","ESTRELA","FUNDA","GRANDE PEIXE","TÁBUAS"]},
who("Quem Sou Eu? — Parte 1","Personagens bíblicos",[
["Construí uma grande arca e recebi os animais.","NOÉ"],["Deus me usou para abrir um caminho pelo mar.","MOISÉS"],["Enfrentei um gigante usando uma funda e uma pedra.","DAVI"],["Confiei em Deus dentro de uma cova com leões.","DANIEL"],["Estive dentro de um grande peixe e depois fui a Nínive.","JONAS"],["Subi em uma árvore porque queria ver Jesus.","ZAQUEU"]],["JONAS","DAVI","ZAQUEU","NOÉ","DANIEL","MOISÉS"]),
who("Quem Sou Eu? — Parte 2","Personagens bíblicos",[
["Deixei a minha terra e segui para onde Deus me mostrou.","ABRAÃO"],["Deus me ajudou a interpretar sonhos no Egito.","JOSÉ"],["Fiquei conhecido por minha grande força e meu cabelo comprido.","SANSÃO"],["Tornei-me rainha e agi com coragem para ajudar o meu povo.","ESTER"],["Eu era pescador e caminhei sobre as águas em direção a Jesus.","PEDRO"],["Encontrei Jesus em uma viagem perto de Damasco.","PAULO"]],["PEDRO","ESTER","JOSÉ","PAULO","ABRAÃO","SANSÃO"]),
who("Quem Sou Eu? — Parte 3","Personagens bíblicos",[
["Liderei o povo ao redor de Jericó até as muralhas caírem.","JOSUÉ"],["Deus me escolheu para vencer com apenas trezentos homens.","GIDEÃO"],["Ainda menino, ouvi Deus chamar o meu nome durante a noite.","SAMUEL"],["Pedi sabedoria a Deus para governar o povo.","SALOMÃO"],["Escolhi permanecer com Noemi e acompanhar o seu povo.","RUTE"],["Vi Jesus ressuscitado e contei a notícia aos discípulos.","MARIA MADALENA"]],["RUTE","SAMUEL","JOSUÉ","MARIA MADALENA","GIDEÃO","SALOMÃO"]),
who("Quem Sou Eu? — Parte 4","Personagens bíblicos",[
["Orei, e Deus enviou fogo sobre o altar.","ELIAS"],["Deus me usou para multiplicar o azeite de uma viúva.","ELISEU"],["Liderei a reconstrução dos muros de Jerusalém.","NEEMIAS"],["Fui profetisa e liderei o povo de Israel.","DÉBORA"],["Batizei Jesus nas águas do rio Jordão.","JOÃO BATISTA"],["Jesus chamou o meu nome, e eu saí do sepulcro.","LÁZARO"]],["DÉBORA","LÁZARO","ELISEU","JOÃO BATISTA","NEEMIAS","ELIAS"]),
vf("A Coragem da Rainha Ester","Ester 4:15–17 e 5:1–3",[
["Ester era uma rainha.",true],["Ester pediu que o povo jejuasse por três dias.",true],["Ester decidiu que nunca iria falar com o rei.",false],["Ester entrou no pátio do rei mesmo sem ter sido chamada.",true],["O rei ficou zangado e mandou Ester embora.",false],["O rei recebeu Ester e estendeu o cetro de ouro.",true]]),
vf("Daniel na Cova dos Leões","Daniel 6:10–23",[
["Daniel continuou orando a Deus.",true],["Daniel foi lançado em uma fornalha de fogo.",false],["Os leões feriram Daniel.",false],["Deus enviou um anjo e fechou a boca dos leões.",true],["O rei foi depressa à cova logo pela manhã.",true],["Daniel saiu da cova sem nenhum ferimento.",true]]),
quiz("Quiz: Noé e a Arca","Gênesis 6:13–22; 8:15–22; 9:12–17",[
["Quem recebeu de Deus a ordem para construir a arca?","Noé",["Moisés","Noé","Davi"]],["O que Deus mandou Noé construir?","Uma arca",["Uma arca","Um palácio","Uma torre"]],["Quem entrou na arca com Noé?","Sua família e os animais",["Sua família e os animais","Apenas os animais","Somente os reis"]],["Qual sinal Deus colocou nas nuvens?","Um arco-íris",["Uma estrela","Um arco-íris","Uma lua"]],["O que Noé fez quando Deus lhe deu as instruções?","Obedeceu",["Obedeceu","Esqueceu","Fugiu"]]]),
quiz("Quiz: Jesus Alimenta a Multidão","João 6:1–13",[
["Quem tinha os pães e os peixes?","Um rapaz",["Um rapaz","Um soldado","Um rei"]],["Quantos pães o rapaz tinha?","Cinco",["Dois","Cinco","Doze"]],["Quantos peixes havia?","Dois",["Dois","Cinco","Sete"]],["Onde o povo se sentou?","Na grama",["Na areia","Na grama","Em cadeiras"]],["Quantos cestos foram preenchidos com as sobras?","Doze",["Cinco","Dez","Doze"]]]),
quiz("Quiz: Jonas e o Grande Peixe","Jonas 1–3",[
["Para qual cidade Deus mandou Jonas ir?","Nínive",["Belém","Nínive","Jericó"]],["Em que Jonas embarcou ao tentar fugir?","Em um barco de pesca",["Em um carro","Em uma carruagem","Em um barco de pesca"]],["O que aconteceu durante a viagem?","Veio uma tempestade",["Caiu neve","Veio uma tempestade","Surgiu um arco-íris"]],["O que engoliu Jonas?","Um grande peixe",["Um grande peixe","Um leão","Uma águia"]],["Quanto tempo Jonas ficou no ventre do peixe?","Três dias e três noites",["Um dia","Três dias e três noites","Sete dias"]]]),
quiz("Quiz: Jesus Acalma a Tempestade","Marcos 4:35–41",[
["Onde Jesus e os discípulos estavam?","Em um barco",["Em um barco","Em uma casa","Em uma carruagem"]],["O que surgiu durante a travessia?","Um vendaval",["Um vendaval","Um arco-íris","Uma estrela"]],["O que Jesus estava fazendo?","Dormindo",["Pescando","Dormindo","Remando"]],["O que os discípulos fizeram?","Acordaram Jesus",["Acordaram Jesus","Voltaram a dormir","Saíram do barco"]],["O que aconteceu quando Jesus falou?","Tudo ficou calmo",["Tudo ficou calmo","A chuva aumentou","O barco afundou"]]])
,
quiz("Quiz: O Nascimento de Jesus","Lucas 2:1–20",[
["Em qual cidade Jesus nasceu?","Belém",["Nazaré","Belém","Jericó"]],["Onde Maria colocou o bebê Jesus?","Numa manjedoura",["Num trono","Numa manjedoura","Num barco"]],["Quem recebeu a notícia dos anjos?","Os pastores",["Os soldados","Os pastores","Os comerciantes"]]]),
vf("Moisés e o Mar Vermelho","Êxodo 14:13–31",[
["Deus abriu um caminho pelo mar para o povo passar.",true],["Moisés construiu uma ponte de madeira.",false],["O povo atravessou o mar em terra seca.",true],["Deus abandonou o povo durante a travessia.",false]]),
quiz("Quiz: A Ovelha Perdida","Lucas 15:3–7",[
["Quantas ovelhas o pastor tinha?","Cem",["Dez","Cem","Doze"]],["Quantas ovelhas se perderam?","Uma",["Uma","Cinco","Dez"]],["O que o pastor fez ao encontrá-la?","Alegrou-se",["Alegrou-se","Escondeu-se","Foi embora"]]]),
vf("A Fé de Abraão","Gênesis 12:1–9",[
["Deus chamou Abraão para sair de sua terra.",true],["Abraão desobedeceu e nunca viajou.",false],["Abraão confiou na promessa de Deus.",true],["Deus prometeu abençoar Abraão.",true]]),
quiz("Quiz: Jesus e as Crianças","Marcos 10:13–16",[
["Quem foi levado até Jesus?","As crianças",["Os soldados","As crianças","Os comerciantes"]],["Como Jesus recebeu as crianças?","Com carinho",["Com carinho","Com desprezo","Com medo"]],["O que Jesus fez pelas crianças?","Abençoou-as",["Abençoou-as","Ignorou-as","Mandou-as embora"]]])
];
const weekdayNames = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
const activityIcons = ["📖","⛵","🌳","❤️","🦁","🌈","👑","🐟","⭐","🕊️","💪","🙏","🚢","🍞","🐋","🌊","👶","🌊","🐑","✨","👧"];
function shuffle<T,>(arr:T[]):T[]{return [...arr].sort(()=>Math.random()-.5);}
export default function BrincandoBiblia({onBack,onGameSelect}:{onBack:()=>void;onGameSelect?:(game:"memory"|"jigsaw"|"wordbuilder"|"quiz")=>void}) {
 const [index,setIndex]=useState<number|null>(null);
 const [params,setParams]=useSearchParams();
 const today = new Date();
 const weekday = today.getDay();
 const dayIndex = (weekday + 6) % 7;
 const dailyIndices = [0,1,2].map(n=>dayIndex*3+n);
 const todayLabel = weekdayNames[weekday];
 const [answers,setAnswers]=useState<Record<number,string>>({});
 const [checked,setChecked]=useState(false);
 const [deck,setDeck]=useState<{id:number;name:string}[]>([]);
 const [flipped,setFlipped]=useState<number[]>([]);
 const [matched,setMatched]=useState<number[]>([]);
 const [moves,setMoves]=useState(0);
 useEffect(() => {
  window.dispatchEvent(new CustomEvent("lemos:lia-context", {
   detail: index === null ? null : `activity:${activities[index].title}`
  }));
  return () => { window.dispatchEvent(new CustomEvent("lemos:lia-context", { detail: null })); };
 }, [index]);
 const open=(i:number)=>{setIndex(i);setAnswers({});setChecked(false);setFlipped([]);setMatched([]);setMoves(0);const a=activities[i];if(a.cards)setDeck(shuffle(a.cards.flatMap((name,id)=>[{id,name},{id,name}])));};
 useEffect(() => {
  const game = params.get("jogo");
  if (!game) return;
  const gameToActivity: Record<string, number> = { memory: 4, maze: 1, jigsaw: 6, wordbuilder: 7, quiz: 12 };
  const target = gameToActivity[game];
  if (target !== undefined) {
    open(target);
    setParams({}, { replace: true });
  }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [params]);
 useEffect(() => {
  if (index === null) return;
  const onBack = (event: Event) => { event.preventDefault(); setIndex(null); };
  window.addEventListener("lemos:back", onBack);
  return () => window.removeEventListener("lemos:back", onBack);
 }, [index]);
 const selectCard=(i:number)=>{if(flipped.includes(i)||matched.includes(i)||flipped.length===2)return;const next=[...flipped,i];setFlipped(next);if(next.length===2){setMoves(m=>m+1);if(deck[next[0]].id===deck[next[1]].id){setMatched(m=>[...m,...next]);setFlipped([]);}}};
 const current=index===null?null:activities[index];
 const score=current?.questions?.filter((q,i)=>answers[i]===q.answer).length??0;
 const activityReward = index === null ? "" : `activity:learn:${index}`;
 const activityCompleted = Boolean(current && (current.kind === "memory" ? deck.length > 0 && matched.length === deck.length : checked && score === current.questions?.length));
 const activityStarted = Boolean(current && (current.kind === "memory" ? moves > 0 : Object.keys(answers).length > 0));
 const rewardSnapshot = useRef({started:false,completed:false});
 rewardSnapshot.current = {started:activityStarted,completed:activityCompleted};
 useEffect(() => {
  if (activityCompleted && activityReward) awardProgress(activityReward, COINS.quiz, true, "Desafio concluído!");
 }, [activityCompleted, activityReward]);
 useEffect(() => {
  if (!activityReward) return;
  return () => {
   if (rewardSnapshot.current.started && !rewardSnapshot.current.completed)
    awardProgress(activityReward, COINS.quiz, false, "Desafio incompleto. Revise e conclua para receber as moedas restantes.");
  };
 }, [activityReward]);
 const dayNumber = Math.floor(Date.now() / 86400000);
 const dailyWhoIndex = 6 + (dayNumber % 4);
 const dailyWho = { activityIndex: dailyWhoIndex, icon: quemSouEu1, title: "Quem Sou Eu?" };
 const games = [
  { id: "memory" as const, label: "Memória Bíblica", icon: memoriaIcon },
  { id: "jigsaw" as const, label: "Quebra-Cabeça", icon: quebraIcon },
  { id: "wordbuilder" as const, label: "Construtor de Palavras", icon: palavrasIcon },
  { id: "quiz" as const, label: "Quiz Bíblico", icon: quizIcon },
 ];
 // Cinco posições simétricas nas laterais e no topo, sem invadir o
 // centro ilustrado nem a área inferior reservada à LIA.
 const positions = [
  {left:"50%",top:"17%"}, // Quem Sou Eu?
  {left:"83%",top:"32%"}, // Memória Bíblica
  {left:"83%",top:"55%"}, // Quebra-Cabeça: abaixo da Memória
  {left:"17%",top:"55%"}, // Construtor: abaixo do Quiz
  {left:"17%",top:"32%"}, // Quiz Bíblico
 ];
 if (index===null || !current) {
  return (
   <section className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
    <button type="button" onClick={()=>open(dailyWho.activityIndex)} aria-label="Quem Sou Eu? — desafio do dia" title="Quem Sou Eu? — desafio do dia"
      className="absolute pointer-events-auto aspect-square w-[clamp(62px,18vw,100px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent p-0 animate-[lemosGentleFloat_5s_ease-in-out_infinite] hover:scale-110 drop-shadow-[0_0_15px_rgba(255,215,60,.8)]"
      style={positions[0]}>
      <img src={dailyWho.icon} alt="Quem Sou Eu?" className="h-full w-full object-contain" />
    </button>
    {games.map((game,n)=>(
      <button key={game.id} type="button" onClick={()=>onGameSelect?.(game.id)} aria-label={game.label} title={game.label}
       className="absolute pointer-events-auto flex aspect-square w-[clamp(62px,18vw,100px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-transparent p-0 drop-shadow-[0_0_15px_rgba(255,215,60,.85)] transition-transform hover:scale-110 active:scale-95"
       style={positions[n+1]}>
       <img src={game.icon} alt={game.label} className="h-full w-full object-contain" />
      </button>
    ))}
   </section>
  );
 }
 const total = current.questions?.length ?? 0;
 const memoryPictures: Record<string,string> = {
 "LEÃO":"🦁","ELEFANTE":"🐘","GIRAFA":"🦒","POMBA":"🕊️","OVELHA":"🐑","ZEBRA":"🦓",
 "ARCA":"🚢","ESTRELA":"⭐","FUNDA":"🪨","GRANDE PEIXE":"🐋","TÁBUAS":"📜"
 };
 const memory = (
  <>
   <p className="text-center mb-3">Encontre os pares! Movimentos: {moves} • Pares: {matched.length/2} de {current.cards?.length}</p>
   <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
    {deck.map((card,i)=>{
     const shown = flipped.includes(i)||matched.includes(i);
     const cls = matched.includes(i)?"bg-emerald-200 border-emerald-500":flipped.includes(i)?"bg-amber-100 border-amber-500":"bg-blue-600 border-yellow-400 text-white";
     return <button key={i} onClick={()=>selectCard(i)} aria-label={shown?card.name:"Virar carta"} className={"min-h-24 rounded-xl border-2 font-bold text-xs sm:text-base p-2 "+cls}>{shown?<span role="img" aria-label={card.name} className="text-4xl sm:text-6xl">{memoryPictures[card.name] || "📖"}</span>:<span className="text-4xl">📖</span>}</button>;
    })}
   </div>
   {flipped.length===2 && <button className="mt-4 rounded-full bg-amber-500 px-5 py-2 font-bold" onClick={()=>setFlipped([])}>Continuar</button>}
   {matched.length===deck.length && <p className="text-center mt-4 text-emerald-800 font-extrabold">🎉 Parabéns! Você encontrou todos os pares!</p>}
  </>
 );
 const questions = (
  <>
   <div className="space-y-3">
    {current.questions?.map((q,i)=>(
     <div key={i} className="rounded-xl border border-amber-200 bg-white p-3">
      <p className="font-bold text-slate-800 mb-2">{i+1}. {q.text}</p>
      <div className="flex flex-wrap gap-2">
       {q.options?.map(opt=>(
        <button key={opt} disabled={checked} onClick={()=>setAnswers(a=>({...a,[i]:opt}))}
         className={"rounded-full border-2 px-3 py-1.5 text-sm font-bold "+(answers[i]===opt?"bg-amber-300 border-amber-600 text-slate-900":"bg-white border-slate-200 text-slate-800")}>{opt}</button>
       ))}
      </div>
      {checked && <p className={"mt-2 text-sm font-bold "+(answers[i]===q.answer?"text-emerald-700":"text-rose-700")}>{answers[i]===q.answer?"✓ Correto!":"Resposta: "+q.answer}</p>}
     </div>
    ))}
   </div>
   <div className="mt-5 flex gap-3 justify-center">
    {!checked ? (
     <button disabled={Object.keys(answers).length!==total} onClick={()=>{setChecked(true);toast.success("Respostas conferidas!");}} className="rounded-full bg-emerald-600 text-white px-6 py-3 font-extrabold disabled:opacity-40">Conferir respostas</button>
    ) : (
     <>
      <p className="font-extrabold text-emerald-800">Você acertou {score} de {total}!</p>
      <button onClick={()=>{setAnswers({});setChecked(false);}} className="rounded-full bg-amber-500 px-5 py-2 font-bold">Tentar novamente</button>
     </>
    )}
   </div>
  </>
 );
 return (
  <section className="fixed inset-x-0 bottom-0 top-[118px] sm:top-[130px] z-[55] overflow-y-auto bg-amber-50 p-4">
   <div className="mx-auto max-w-4xl rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-amber-100 via-white to-sky-100 p-4 shadow-xl">
    <h2 className="text-center text-xl font-extrabold text-amber-950">{current.title}</h2>
    <p className="mb-5 text-center text-sm text-amber-800">📖 {current.verse}</p>
    {current.kind==="memory" ? memory : questions}
   </div>
  </section>
 );
}
