import { getLiaFeminineVoice } from "@/lib/liaVoice";
import { useIconVisible } from "@/lib/iconVisibility";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { useLocation } from "react-router-dom";
const liaForPages = "/lia-paginas.webp";
const liaFallback = "/lia-mascote.png";
import { Button } from "@/components/ui/button";

const cleanSpeechText = (text: string) => text.replace(/[^\p{L}\p{N}\p{P}\p{Zs}\n]/gu, "").replace(/\s+/g, " ").trim();

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
  "/": "Olá, sou a LIA!\nEscolha entre os ícones flutuantes: Veja, Ouça, Aprenda ou Álbum\ne comece sua escalada Bíblica!",
  "/biblia": "Aqui você encontra a Bíblia! 📖 Escolha o Antigo ou o Novo Testamento para descobrir a Palavra de Deus. 💛",
  "/louvores": "Lá, lá, lá! 🎶 Escolha um louvor e cante comigo! 🎤",
  "/veja": "Pipoca pronta? 🍿 Escolha um vídeo! Assista e ganhe moedinhas! 🪙",
  "/ouca": "Ouviu a música? 🎵 Escolha um louvor e cante comigo! 💛",
  "/musicas": "Iupiii! 🎤 Escolha uma música e solte a voz! 🎶",
  "/lemosplay": "Ebaaa, cinema! 🎬 Escolha um vídeo, assista e ganhe moedinhas! 🪙",
  "/jogos": "Vamos brincar e aprender! 🧩 Escolha Memória, Quiz, Quebra-Cabeça ou Palavras. Depois volte ao Aprenda para mais descobertas! ✨",
  "/atividades": "Bem-vindo ao Aprenda! 🌟 Escolha um jogo ou o desafio Quem Sou Eu? de hoje. Complete as atividades e ganhe moedinhas! 🪙",
  "/devocionais": "Oieee! 💖 Vamos ler o devocional de hoje? Leia e ganhe moedinhas! 🪙",
  "/pedidos-oracao": "Psiu! 🙏 Vamos conversar com Deus? Ore com carinho e ganhe moedinhas! 💛",
  "/tesouros": "Tesouros da Palavra! 🏆 Aqui você acompanha seus status e descobre os materiais bíblicos que poderá desbloquear! ✨",
  "/album": "Este é o Álbum! 🎁 Use suas moedinhas para abrir pacotinhos e completar o Volume 1. O Volume 2 será liberado depois! 🌈",
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
  const onHome = location.pathname === "/";
  
  const [expanded, setExpanded] = useState(false);
  const [speaking,setSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [context, setContext] = useState<string | null>(null);

  useEffect(() => {
    const openFromArtwork = () => setExpanded(true);
    window.addEventListener("lemos:lia-open", openFromArtwork);
    return () => window.removeEventListener("lemos:lia-open", openFromArtwork);
  }, []);

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
    const speech = new SpeechSynthesisUtterance(cleanSpeechText(message));
    speech.lang="pt-BR"; speech.rate=0.94; speech.pitch=1.18;
    const femaleVoice = getLiaFeminineVoice(window.speechSynthesis.getVoices());
    // Nem todos os celulares disponibilizam uma voz feminina. Use a voz
    // portuguesa disponível ou a voz padrão para não deixar a LIA muda.
    const availableVoices = window.speechSynthesis.getVoices();
    const portugueseVoice = availableVoices.find((voice) => voice.lang.toLowerCase() === "pt-br")
      || availableVoices.find((voice) => voice.lang.toLowerCase().startsWith("pt"));
    if (femaleVoice || portugueseVoice) speech.voice = femaleVoice || portugueseVoice!;
    speech.onend=speech.onerror=()=>{ if(speechRef.current===speech){speechRef.current=null;setSpeaking(false);} };
    speechRef.current=speech;setSpeaking(true);window.speechSynthesis.speak(speech);
  };
  const avatar = liaForPages;
  const liaVisible = useIconVisible("lia");
  const liaPosition = location.pathname === "/album"
    ? "bottom-[calc(90px+env(safe-area-inset-bottom,0px))]"
    : "bottom-[calc(77px+env(safe-area-inset-bottom,0px))]";

  if (!liaVisible) return null;

  if (!expanded) {
    return (
      <div data-lemos-lia="" className={`fixed z-[9998] flex flex-col items-center gap-2 left-[-16px] sm:left-[-12px] ${liaPosition}`}>
      <Button variant="ghost"
        onMouseEnter={(event) => { if ((event.nativeEvent as PointerEvent).pointerType !== "touch") setExpanded(true); }}
        onFocus={() => setExpanded(true)}
        onClick={() => setExpanded(true)}
        aria-label="Falar com a LIA, sua ajudante"
        title="Falar com a LIA, sua ajudante"
        className="h-auto flex flex-col items-center gap-1 !bg-transparent !border-0 !shadow-none hover:!bg-transparent transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-yellow-400"
      >
        <span className={"w-[clamp(120px,41.28vw,196.8px)] h-[clamp(120px,41.28vw,196.8px)] block animate-[liaFloat_3.4s_ease-in-out_infinite] drop-shadow-[0_0_12px_rgba(255,215,70,.95)]"}>
          <img src={avatar} alt="LIA" className="w-full h-full object-contain object-bottom" loading="eager" onError={(e) => { if (e.currentTarget.src.endsWith("lia-paginas.webp")) e.currentTarget.src = liaFallback; }} />
        </span>
        <span className={"sr-only"}>
          Oi, sou a LIA
        </span>
      </Button>
      
        <style>{`@keyframes liaFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }`}</style>
      </div>
    );
  }

  return (
    <div onMouseLeave={(event) => { if (!onHome && (event.nativeEvent as PointerEvent).pointerType !== "touch") setExpanded(false); }}
      className={`fixed z-[9998] flex flex-col items-end gap-1 left-[-16px] sm:left-[-12px] ${liaPosition}`}>
      {/* Ajuda com o mesmo painel azul, cabeçalho e controles da página de login. */}
      <div role="dialog" aria-label="Ajuda da LIA" className={onHome
        ? "pointer-events-auto fixed bottom-[calc(325px+env(safe-area-inset-bottom,0px))] left-2 z-[9999] w-[min(320px,calc(100vw-16px))] max-h-[45dvh] overflow-y-auto rounded-2xl border-2 border-amber-300 bg-[#102f4a]/95 p-3 text-white shadow-[0_0_22px_rgba(255,215,80,.6)]"
        : location.pathname === "/album"
        ? "pointer-events-auto fixed bottom-[calc(245px+env(safe-area-inset-bottom,0px))] left-2 z-[9999] w-[min(320px,calc(100vw-16px))] max-h-[45dvh] overflow-y-auto rounded-2xl border-2 border-amber-300 bg-[#102f4a]/95 p-3 text-white shadow-[0_0_22px_rgba(255,215,80,.6)]"
        : "pointer-events-auto relative w-[min(78vw,320px)] max-w-sm rounded-2xl border-2 border-amber-300 bg-[#102f4a]/95 p-3 text-white shadow-[0_0_22px_rgba(255,215,80,.6)]"}>
        <div className="flex items-center justify-between gap-2 border-b border-white/25 pb-2">
          <strong className="text-sm text-yellow-300">POSSO AJUDAR?</strong>
          <div className="flex items-center gap-1">
            <button type="button" onClick={toggleSpeech} aria-label={speaking ? "Parar leitura" : "Ouvir orientação da página"} className="rounded-lg bg-white/15 p-2">{speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
            <button type="button" onClick={() => { setExpanded(false); window.speechSynthesis?.cancel(); speechRef.current=null; setSpeaking(false); }} aria-label="Fechar ajuda" className="rounded-lg bg-white/15 p-2"><X size={20} /></button>
          </div>
        </div>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{cleanSpeechText(message)}</p>
      </div>

      <div className="flex flex-col items-center gap-2">
      <Button variant="ghost"
        onClick={() => { setExpanded(false); window.speechSynthesis?.cancel(); speechRef.current=null; setSpeaking(false); }}
        aria-label="Recolher a LIA"
        title="Toque para recolher a LIA"
        className="pointer-events-auto h-auto flex-col !bg-transparent !border-0 !shadow-none hover:!bg-transparent transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-yellow-400"
      >
        <img
          src={avatar}
          alt="LIA, a mascote que ajuda você a navegar"
          className={"w-[clamp(120px,41.28vw,196.8px)] h-[clamp(120px,41.28vw,196.8px)] object-contain object-bottom drop-shadow-[0_0_12px_rgba(255,215,70,.95)] animate-[liaFloat_3.4s_ease-in-out_infinite] select-none"}
          onError={(e) => { if (e.currentTarget.src.endsWith("lia-paginas.webp")) e.currentTarget.src = liaFallback; }}
          draggable={false}
        />
        <span className={"sr-only"}>
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
