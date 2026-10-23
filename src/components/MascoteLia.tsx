import { useIconVisible } from "@/lib/iconVisibility";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLocation } from "react-router-dom";
const lia1 = "/lia-mascote.png";
const lia2 = "/lia-mascote.png";
import { Button } from "@/components/ui/button";

/**
 * LIA — mascote guia do site.
 * Fica recolhida como um ícone pequeno (não atrapalha no celular).
 * Passar o mouse abre a ajuda automaticamente; no celular, um toque abre;
 * ao sair com o mouse, a ajuda recolhe; no celular, outro toque recolhe.
 *
 * O texto do balão muda conforme a página E conforme o contexto enviado
 * por outras telas pelo evento `lemos:lia-context` (atividade aberta,
 * figurinha ampliada, etc.), nunca repetindo a mesma fala.
 */

const PAGE_TIPS: Record<string, string> = {
  "/": "Oieee! 💛 Escolha Veja, Ouça, Aprenda ou Álbum para começar nossa aventura! ✨",
  "/biblia": "Obaaa! 📖 Escolha uma história da Bíblia! Vamos descobrir juntos? ✨",
  "/louvores": "Lá, lá, lá! 🎶 Escolha um louvor e cante comigo! 🎤",
  "/veja": "Pipoca pronta? 🍿 Escolha um vídeo! Assista e ganhe moedinhas! 🪙",
  "/ouca": "Ouviu a música? 🎵 Escolha um louvor e cante comigo! 💛",
  "/musicas": "Iupiii! 🎤 Escolha uma música e solte a voz! 🎶",
  "/lemosplay": "Ebaaa, cinema! 🎬 Escolha um vídeo, assista e ganhe moedinhas! 🪙",
  "/jogos": "Obaaa, brincadeira! 🧩 Escolha um jogo, complete e ganhe moedinhas! 🪙",
  "/atividades": "Ei, detetive! 🔎 Escolha uma tarefa, termine e ganhe moedinhas! 🪙",
  "/devocionais": "Oieee! 💖 Vamos ler o devocional de hoje? Leia e ganhe moedinhas! 🪙",
  "/pedidos-oracao": "Psiu! 🙏 Vamos conversar com Deus? Ore com carinho e ganhe moedinhas! 💛",
  "/album": "Uau, figurinhas! 🎁 Junte moedinhas, abra pacotinhos e complete seu álbum! 🌈",
  "/historias-do-dia": "Obaaa! 📚 Qual será a historinha de hoje? Vamos descobrir! ✨",
  "/historias-biblicas": "Era uma vez... 📖 Escolha uma história da Bíblia! 🌟",
  "/login": "Oieee! 💛 Já tem conta? Entre! É novo? Vamos nos cadastrar! 🎈",
  "/login-sms": "Trim-trim! 📱 Digite seu código e venha brincar! ✨",
  "/admin/whatsapp": "Oie! 💌 Vamos cuidar dos recadinhos? 🌷",
  "/familia": "Ebaaa, família! 🥰 Vamos aprender e brincar juntos? 🌻",
  "/config": "Psiu! ⚙️ Aqui ficam os ajustes especiais! ✨",
  "/estatisticas": "Uauuu! 📊 Vamos ver os números das aventuras? ⭐",
};

/** Falas por contexto — enviadas por `lemos:lia-context`. */
const CONTEXT_TIPS: Record<string, string> = {
  "quiz": "Quiz Bíblico! 🏆 Escolha a resposta e ganhe moedinhas! 🪙",
  "memory": "Cadê o par? 🃏 Ache as cartinhas iguais! ✨",
  "coloring": "Obaaa, artista! 🎨 Pinte bem bonito e ganhe moedinhas! 🪙",
  "pairs": "Quem combina? 🧩 Encontre os pares certinhos! 💕",
  "jigsaw": "Ebaaa, quebra-cabeça! 🧩 Troque as pecinhas até formar a imagem! 🤩",
  "wordbuilder": "Uau, letrinhas! 🔤 Descubra a palavra e monte com as letras! 🌟",
  "wordsearch": "Detetive de palavras! 🔎 Ache todas as escondidinhas! 🎉",
  "maze": "Cadê a saída? 🗺️ Encontre o caminho! Eu torço por você! 💛",
  "crossword": "Vamos descobrir palavras? 🔤 Complete a cruzadinha! ✨",
  "connectdots": "Um, dois, três! 🌟 Ligue a frase à imagem certa! 💕",
  "assemble": "Peça daqui, peça dali! 🧩 Monte e descubra a história! ✨",
  "edu:circles": "Obaaa, cores! 🖍️ Pinte os círculos certinhos! 🌈",
  "edu:connect": "Vamos ligar as cores? 🌈 Una os pontinhos! 💫",
  "album:cover": "Uau, Volume 1! 📒 Junte moedinhas e complete seu álbum! 🪙🎁",
  "album:pages": "Obaaa, figurinhas! 🎁 Com 3 moedinhas, abra 5 figurinhas! 🪙",
  "album:sticker": "Que figurinha lindaaa! 🤩 Dê zoom e leia sua história! 📖",
  "album:pack": "Tcharããã, clique no pacotinho para abrir e surpreenda-se! 🎁✨",
  "album:trade": "Repetiu? 🔄 Vamos trocar pela figurinha que falta! 😄",
};

export default function MascoteLia() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAlbum = location.pathname.startsWith("/album");
  const [expanded, setExpanded] = useState(false);
  const [speaking,setSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [context, setContext] = useState<string | null>(null);

  // Recolhe ao trocar de página
  useEffect(() => { setExpanded(false); setContext(null); window.speechSynthesis?.cancel(); speechRef.current=null; setSpeaking(false); }, [location.pathname]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  useEffect(() => {
    const onCtx = (e: Event) => setContext(((e as CustomEvent).detail as string) || null);
    window.addEventListener("lemos:lia-context", onCtx);
    return () => window.removeEventListener("lemos:lia-context", onCtx);
  }, []);

  // Enquanto não houver usuário (site em tons de cinza), a LIA fala apenas
  // sobre como entrar ou criar a conta.
  const [logged, setLogged] = useState<boolean>(() => {
    try { return !!localStorage.getItem("lemos_user"); } catch { return false; }
  });
  useEffect(() => {
    const sync = () => { try { setLogged(!!localStorage.getItem("lemos_user")); } catch {} };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("lemos:coins", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lemos:coins", sync);
    };
  }, [location.pathname]);

  const LOGIN_TIP =
    "Oieee! 💛 Entre ou crie sua conta para brincar! 🎈";

  const currentContext = context;
  const activityMessage = currentContext?.startsWith("activity:")
    ? `Obaaa! 📖 ${currentContext.slice(9)}! Vamos descobrir as respostas juntinhos? 🌟`
    : null;
  const message = location.pathname === "/login" || location.pathname === "/login-sms"
    ? PAGE_TIPS[location.pathname]
    : activityMessage || (currentContext && CONTEXT_TIPS[currentContext]) || PAGE_TIPS[location.pathname] || (!logged ? LOGIN_TIP : PAGE_TIPS["/"]);

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) { window.speechSynthesis.cancel(); speechRef.current=null; setSpeaking(false); return; }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang="pt-BR"; speech.rate=0.94;
    const voices=window.speechSynthesis.getVoices();
    speech.voice=voices.find(v=>/^pt-BR/i.test(v.lang)) || voices.find(v=>/^pt/i.test(v.lang)) || null;
    speech.onend=speech.onerror=()=>{ if(speechRef.current===speech){speechRef.current=null;setSpeaking(false);} };
    speechRef.current=speech;setSpeaking(true);window.speechSynthesis.speak(speech);
  };
  const avatar = isHome && !context ? lia1 : lia2;
  const liaVisible = useIconVisible("lia");
  const liaPosition = isAlbum ? "bottom-3 sm:bottom-4" : "bottom-3";

  if (!liaVisible) return null;

  if (!expanded) {
    return (
      <div className={`fixed left-2 z-[90] flex flex-col items-center gap-2 sm:left-4 ${liaPosition}`}>
      <Button variant="ghost"
        onMouseEnter={(event) => { if ((event.nativeEvent as PointerEvent).pointerType !== "touch") setExpanded(true); }}
        onFocus={() => setExpanded(true)}
        onClick={() => setExpanded(true)}
        aria-label="Falar com a LIA, sua ajudante"
        title="Falar com a LIA, sua ajudante"
        className="h-auto flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-yellow-400"
      >
        <span className="w-[88px] h-[88px] sm:w-[110px] sm:h-[110px] rounded-full bg-white shadow-[0_5px_18px_rgba(120,58,8,.65),0_0_0_3px_rgba(255,217,87,.65)] border-[3px] border-amber-400 overflow-hidden block animate-[liaFloat_3.4s_ease-in-out_infinite]">
          <img src={avatar} alt="LIA" className="w-full h-full object-contain object-center" loading="lazy" />
        </span>
        <span className="font-display font-extrabold text-[11px] sm:text-xs text-amber-900 bg-white/90 border border-amber-300 rounded-full px-2 py-0.5 shadow whitespace-nowrap">
          Oi, sou a LIA
        </span>
      </Button>
      
        <style>{`@keyframes liaFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`}</style>
      </div>
    );
  }

  return (
    <div onMouseLeave={(event) => { if ((event.nativeEvent as PointerEvent).pointerType !== "touch") setExpanded(false); }}
      className={`fixed left-2 z-[45] flex flex-col items-start gap-1 sm:left-4 ${liaPosition}`}>
      {/* Balão acima da cabeça da LIA */}
      <div className="pointer-events-auto relative w-[78vw] max-w-sm rounded-2xl bg-white/95 backdrop-blur border-2 border-amber-300 shadow-xl px-3 py-2">
        <p className="font-body text-[15px] sm:text-base text-amber-900 leading-relaxed">{message}</p>
        <button type="button" onClick={toggleSpeech} aria-label={speaking?"Parar fala da LIA":"Ouvir fala da LIA"} className="mt-2 flex items-center gap-2 rounded-lg bg-amber-200 px-3 py-1.5 text-sm font-bold text-amber-950">{speaking?<VolumeX size={18}/>:<Volume2 size={18}/>} {speaking?"Parar":"Ouvir a LIA"}</button>
        <span className="absolute left-6 -bottom-2 w-3 h-3 rotate-45 bg-white border-r-2 border-b-2 border-amber-300" />
      </div>

      <div className="flex flex-col items-center gap-2">
      <Button variant="ghost"
        onClick={() => { setExpanded(false); window.speechSynthesis?.cancel(); speechRef.current=null; setSpeaking(false); }}
        aria-label="Recolher a LIA"
        title="Toque para recolher a LIA"
        className="pointer-events-auto h-auto flex-col transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-yellow-400"
      >
        <img
          src={avatar}
          alt="LIA, a mascote que ajuda você a navegar"
          className="w-[88px] h-[88px] sm:w-[110px] sm:h-[110px] object-cover object-top rounded-full border-[3px] border-amber-400 shadow-[0_5px_18px_rgba(120,58,8,.65),0_0_0_3px_rgba(255,217,87,.65)] animate-[liaFloat_3.4s_ease-in-out_infinite] select-none"
          draggable={false}
        />
        <span className="mt-1 block font-display font-extrabold text-xs sm:text-sm text-amber-900 bg-white/90 border border-amber-300 rounded-full px-2 py-0.5 shadow whitespace-nowrap">
          Oi, sou a LIA
        </span>
      </Button>
      
      </div>

      <style>{`
        @keyframes liaFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
