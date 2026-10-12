import { useState } from "react";
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
];
function shuffle<T,>(arr:T[]):T[]{return [...arr].sort(()=>Math.random()-.5);}
export default function BrincandoBiblia({onBack}:{onBack:()=>void}) {
 const [index,setIndex]=useState<number|null>(null);
 const [answers,setAnswers]=useState<Record<number,string>>({});
 const [checked,setChecked]=useState(false);
 const [deck,setDeck]=useState<{id:number;name:string}[]>([]);
 const [flipped,setFlipped]=useState<number[]>([]);
 const [matched,setMatched]=useState<number[]>([]);
 const [moves,setMoves]=useState(0);
 const open=(i:number)=>{setIndex(i);setAnswers({});setChecked(false);setFlipped([]);setMatched([]);setMoves(0);const a=activities[i];if(a.cards)setDeck(shuffle(a.cards.flatMap((name,id)=>[{id,name},{id,name}])));};
 const selectCard=(i:number)=>{if(flipped.includes(i)||matched.includes(i)||flipped.length===2)return;const next=[...flipped,i];setFlipped(next);if(next.length===2){setMoves(m=>m+1);if(deck[next[0]].id===deck[next[1]].id){setMatched(m=>[...m,...next]);setFlipped([]);}}};
 const current=index===null?null:activities[index];
 const score=current?.questions?.filter((q,i)=>answers[i]===q.answer).length??0;
 return <section className="w-full max-w-4xl mx-auto px-3 py-6">
 <button onClick={index===null?onBack:()=>setIndex(null)} className="mb-4 rounded-full bg-white border-2 border-amber-400 px-5 py-2 font-bold text-amber-950 shadow">← {index===null?"Voltar às atividades":"Escolher outra atividade"}</button>
 <div className="rounded-3xl bg-gradient-to-b from-amber-100 via-white to-sky-100 border-4 border-amber-400 p-4 sm:p-7 shadow-xl">
 <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-950 text-center">🌟 Brincando e Aprendendo com a Bíblia</h1>
 <p className="text-center text-amber-900 mt-2">16 atividades inspiradas nas folhas do material enviado • responda, confira e tente novamente!</p>
 {index===null?<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">{activities.map((a,i)=><button key={i} onClick={()=>open(i)} className="rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 p-4 text-left shadow-sm"><span className="font-extrabold text-amber-950">{i+1}. {a.title}</span><span className="block text-sm text-slate-600">{a.kind==="vf"?"Verdadeiro ou falso":a.kind==="character"?"Acerte o personagem":a.kind==="memory"?"Jogo da memória":"Quiz bíblico"}</span></button>)}</div>:<div className="mt-6">
 <h2 className="text-xl sm:text-2xl text-center font-extrabold text-amber-950">{current?.title}</h2><p className="text-center text-sm text-amber-800 mb-5">📖 {current?.verse}</p>
 {current?.kind==="memory"?<><p className="text-center mb-3">Encontre os pares! Movimentos: {moves} • Pares: {matched.length/2} de {current.cards?.length}</p><div className="grid grid-cols-3 sm:grid-cols-4 gap-2">{deck.map((card,i)=><button key={i} onClick={()=>selectCard(i)} aria-label={flipped.includes(i)||matched.includes(i)?card.name:"Virar carta"} className={`min-h-24 rounded-xl border-2 font-bold text-xs sm:text-base p-2 ${matched.includes(i)?"bg-emerald-200 border-emerald-500":flipped.includes(i)?"bg-amber-100 border-amber-500":"bg-blue-600 border-yellow-400 text-white"}`}>{flipped.includes(i)||matched.includes(i)?card.name:"📖 ?"}</button>)}</div>{flipped.length===2&&<button className="mt-4 rounded-full bg-amber-500 px-5 py-2 font-bold" onClick={()=>setFlipped([])}>Continuar</button>}{matched.length===deck.length&&<p className="text-center mt-4 text-emerald-800 font-extrabold">🎉 Parabéns! Você encontrou todos os pares!</p>}</>:<>
 <div className="space-y-3">{current?.questions?.map((q,i)=><div key={i} className="rounded-xl border border-amber-200 bg-white p-3"><p className="font-bold text-slate-800 mb-2">{i+1}. {q.text}</p><div className="flex flex-wrap gap-2">{q.options?.map(opt=><button key={opt} disabled={checked} onClick={()=>setAnswers(a=>({...a,[i]:opt}))} className={`rounded-full border-2 px-3 py-1.5 text-sm font-bold ${answers[i]===opt?"bg-amber-300 border-amber-600 text-slate-900":"bg-white border-slate-200 text-slate-800"}`}>{opt}</button>)}</div>{checked&&<p className={`mt-2 text-sm font-bold ${answers[i]===q.answer?"text-emerald-700":"text-rose-700"}`}>{answers[i]===q.answer?"✓ Correto!":`Resposta: ${q.answer}`}</p>}</div>)}</div>
 <div className="mt-5 flex gap-3 justify-center">{!checked?<button disabled={Object.keys(answers).length!==(current?.questions?.length??0)} onClick={()=>{setChecked(true);toast.success("Respostas conferidas!")}} className="rounded-full bg-emerald-600 text-white px-6 py-3 font-extrabold disabled:opacity-40">Conferir respostas</button>:<><p className="font-extrabold text-emerald-800">Você acertou {score} de {current?.questions?.length}!</p><button onClick={()=>{setAnswers({});setChecked(false)}} className="rounded-full bg-amber-500 px-5 py-2 font-bold">Tentar novamente</button></>}</div>
 </>}
 </div>}
 </div></section>;
