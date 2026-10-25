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
  "/": "Aqui é tudo bem facinho!\n\nEscolha um ícone flutuante e comece sua aventura bíblica!\n\nLá no alto, ganhe moedinhas fazendo tarefinhas superfáceis!\n\nNo seu ícone, acompanhe sua categoria e conquistas!\n\nE no menu de baixo, descubra maneiras de viver e compartilhar sua fé!\n\nProntinho! Vamos aprender e nos divertir com a Palavra de Deus!",
  "/biblia": "Olha! Esta é a Bíblia, o seu guia de vida!\n\nEscolha o Antigo ou o Novo Testamento e embarque numa linda aventura pela Palavra de Deus!\n\nE sabe o que é mais legal? Enquanto você lê e aprende, também ganha moedinhas!\n\nA cada página, uma nova descoberta. Cada palavrinha é uma sementinha de amor que Jesus planta em seu coração!",
  "/louvores": "Lá, lá, lá! 🎶 Escolha um louvor e cante comigo! 🎤",
  "/veja": "Hoje tem cinema!\n\nEscolha um vídeo e embarque numa aventura cheia de histórias incríveis da Bíblia!\n\nCada história traz uma linda lição de fé, amor e amizade com Deus!\n\nAssista, aprenda e ainda ganhe moedinhas!",
  "/ouca": "Oi, que tal cantarmos?\n\nEscolha uma música, solte a voz e espalhe alegria por todo lugar!\n\nSabia que cantar louvores é uma linda maneira de agradecer e demonstrar nosso amor a Deus?\n\nCante com o coração, divirta-se e ganhe moedinhas!",
  "/musicas": "Iupiii! 🎤 Escolha uma música e solte a voz! 🎶",
  "/lemosplay": "Ebaaa, cinema! 🎬 Escolha um vídeo, assista e ganhe moedinhas! 🪙",
  "/jogos": "Vamos brincar e aprender! 🧩 Escolha Memória, Quiz, Quebra-Cabeça ou Palavras. Depois volte ao Aprenda para mais descobertas! ✨",
  "/atividades": "Olá! Que tal brincarmos e aprendermos um pouquinho a mais com a Bíblia?\n\nEscolha um joguinho ou encare o desafio Quem Sou Eu de hoje!\n\nCada desafio é uma aventura cheia de descobertas sobre a Palavra de Deus!\n\nDivirta-se, complete as atividades e ganhe muitas moedinhas!",
  "/devocionais": "Olá! Vamos ler o devocional de hoje?\n\nTem uma mensagem especial de Deus esperando por você!\n\nLeia e encha seu coração de amor e ainda ganhe moedinhas!\n\nCada devocional é um carinho de Deus que ilumina seu dia e ensina seu coração a espalhar amor e bondade!",
  "/pedidos-oracao": "Olá, que tal conversarmos com Deus hoje?\n\nOrar é abrir seu coraçãozinho e contar tudinho para Ele, é como fazemos com nosso melhor amigo!\n\nA cada oração, seu coração se enche de fé, amor e esperança!\n\nOre com carinho e ainda ganhe moedinhas!",
  "/tesouros": "Tesouros da Palavra! 🏆 Aqui você acompanha seus status e descobre os materiais bíblicos que poderá desbloquear! ✨",
  "/album": "Bem-vindo ao Álbum de volume um!\n\nQue tal colecionar figurinhas e descobrir histórias incríveis da Bíblia?\n\nJunte suas moedinhas, abra pacotinhos e encontre novas surpresas!\n\nCada figurinha é um pedacinho dessa linda aventura com Deus!\n\nComplete seu álbum e prepare-se para o próximo desafio!",
  "/historias-do-dia": "Obaaa! 📚 Qual será a historinha de hoje? Vamos descobrir! ✨",
  "/historias-biblicas": "Era uma vez... 📖 Escolha uma história da Bíblia! 🌟",
  "/login": "Olá, é uma imensa alegria ter você por aqui!\nSeja muito bem-vindo ao nosso cantinho de fé, amor e descobertas!\n\nVamos lá! Comece entrando com o Google ou clique no envelope para receber seu link por e-mail.\n\nFacilite seu acesso! Baixe o atalho no celular, espere um pouquinho e prontinho!\n\nAgora é só aproveitar! Jesus te ama e nós também!",
  "/login-sms": "Trim-trim! 📱 Digite seu código e venha brincar! ✨",
  "/admin/whatsapp": "Oie! 💌 Vamos cuidar dos recadinhos? 🌷",
  "/familia": "Ebaaa, família! 🥰 Vamos aprender e brincar juntos? 🌻",
  "/config": "Psiu! ⚙️ Aqui ficam os ajustes especiais! ✨",
  "/estatisticas": "Uauuu! 📊 Vamos ver os números das aventuras? ⭐",
};

/** Falas por contexto — enviadas por `lemos:lia-context`. */
const CONTEXT_TIPS: Record<string, string> = {
  "biblia:pesquisar": "Vamos explorar a Bíblia?\n\nBem-vindo ao Pesquisar na Bíblia!\n\nQuer encontrar uma história, um versículo ou uma palavra especial de Deus?\n\nÉ bem facinho! Digite o que procura e deixe a Bíblia revelar suas lindas mensagens!\n\nCada pesquisa é uma nova descoberta, cheia de fé, amor e sabedoria!\n\nVamos descobrir juntinhos os tesouros da Palavra de Deus!",
  "biblia:novo": "Agora vamos começar uma nova aventura!\n\nEste é o Novo Testamento!\n\nAqui você vai conhecer a linda história de Jesus, desde seu nascimento até seus milagres, ensinamentos e sua maravilhosa ressurreição!\n\nDescubra como Jesus ensinou o amor, o perdão, a bondade e nos mostrou o caminho para Deus!\n\nAbra seu coração, caminhe com Jesus nessa aventura e ganhe moedinhas enquanto aprende!",
  "biblia:antigo": "Agora é a hora! Vamos viajar no tempo?\n\nBem-vindo ao Velho Testamento!\n\nAqui começa uma aventura incrível, desde a criação do mundo até as histórias de Noé, Abraão, Moisés e do corajoso Davi!\n\nCada história revela o amor, as promessas e os ensinamentos de Deus!\n\nAbra seu coração, descubra essas maravilhas e ganhe moedinhas enquanto aprende!",
  "quiz": "Bem-vindo ao Quiz Bíblico de hoje!\n\nBrinque e descubra as maravilhas da Bíblia!\n\nNo Quiz Bíblico de hoje, cada perguntinha é uma aventura cheia de surpresas e descobertas sobre Deus!\n\nPense com carinho, escolha suas respostas e mostre tudo o que aprendeu!\n\nComplete os desafios, divirta-se e ganhe muitas moedinhas!",
  "activity:Quiz Bíblico": "Bem-vindo ao Quiz Bíblico de hoje!\n\nBrinque e descubra as maravilhas da Bíblia!\n\nNo Quiz Bíblico de hoje, cada perguntinha é uma aventura cheia de surpresas e descobertas sobre Deus!\n\nPense com carinho, escolha suas respostas e mostre tudo o que aprendeu!\n\nComplete os desafios, divirta-se e ganhe muitas moedinhas!",
  "activity:Quem Sou Eu? — Parte 3": "Olá! Chegamos ao Quem Sou Eu de hoje — Parte 3!\n\nPreparado para desvendar novos mistérios da Bíblia?\n\nLeia as dicas, pense com carinho e descubra quem está escondidinho em cada desafio!\n\nCada resposta é uma nova descoberta sobre os personagens da Palavra de Deus!\n\nVamos brincar, aprender e descobrir tudinho juntinhos!",
  "memory": "Vamos brincar de Memória!\n\nVire duas cartinhas e tente encontrar os personagens iguais!\n\nCada imagem esconde um amiguinho que já conhecemos nas histórias da Bíblia!\n\nPreste atenção, guarde as imagens na memória e encontre todos os pares!\n\nComplete o desafio ganhando moedinhas!",
  "coloring": "Obaaa, artista! 🎨 Pinte bem bonito e ganhe moedinhas! 🪙",
  "pairs": "Quem combina? 🧩 Encontre os pares certinhos! 💕",
  "jigsaw": "Chegou a hora do Quebra-Cabeça!\n\nQue tal juntar as pecinhas e descobrir uma linda cena da Bíblia?\n\nOlhe com atenção, encaixe cada pecinha no seu lugar e veja a história ganhar vida!\n\nCada imagem montada revela uma surpresa especial da Palavra de Deus!\n\nComplete o desafio, ganhe moedinhas e troque por pacotinhos de figurinhas para seu álbum!",
  "wordbuilder": "Olá, este é o Construtor de Palavras!\n\nAqui você monta as palavrinhas com sabedoria!\n\nCada letrinha monta uma palavrinha. É muito bom descobrir sobre a Palavra de Deus!\n\nPense com carinho, escolha suas letrinhas e mostre o que aprendeu!\n\nMonte as palavrinhas e divirta-se ganhando muitas moedinhas!",
  "wordsearch": "Detetive de palavras! 🔎 Ache todas as escondidinhas! 🎉",
  "maze": "Cadê a saída? 🗺️ Encontre o caminho! Eu torço por você! 💛",
  "crossword": "Vamos descobrir palavras? 🔤 Complete a cruzadinha! ✨",
  "connectdots": "Um, dois, três! 🌟 Ligue a frase à imagem certa! 💕",
  "assemble": "Peça daqui, peça dali! 🧩 Monte e descubra a história! ✨",
  "edu:circles": "Obaaa, cores! 🖍️ Pinte os círculos certinhos! 🌈",
  "edu:connect": "Vamos ligar as cores? 🌈 Una os pontinhos! 💫",
  "album:cover": "Uau, Volume 1! 📒 Junte moedinhas e complete seu álbum! 🪙🎁",
  "album:pages": "Oba... Chegou a hora das figurinhas!\n\nCom apenas 3 moedinhas, você abre um pacotinho com 5 figurinhas surpresa!\n\nQue emoção! Será que vem aquela figurinha que falta no seu álbum?\n\nAbra, descubra, colecione e divirta-se nessa aventura bíblica!",
  "album:sticker": "Que figurinha lindaaa! 🤩 Dê zoom e leia sua história! 📖",
  "album:pack": "Tcharããã, clique no pacotinho para abrir e surpreenda-se! 🎁✨",
  "album:trade": "Repetiu? 🔄 Vamos trocar pela figurinha que falta! 😄",
};

export default function MascoteLia() {
  const location = useLocation();
  const onHome = location.pathname === "/";
  const onAlbum = location.pathname === "/album";
  const onVideos = ["/lemosplay", "/veja", "/ouca", "/musicas", "/louvores"].includes(location.pathname);
  const persistentHelp = onAlbum || onVideos;
  // On content-heavy screens, keep the assistant compact so it does not cover questions or text.
  const compactLia = !onHome;
  const liaSize = compactLia ? "w-[clamp(132px,36vw,164px)] h-[clamp(132px,36vw,164px)]" : "w-[clamp(120px,41.28vw,196.8px)] h-[clamp(120px,41.28vw,196.8px)]";
  
  const [expanded, setExpanded] = useState(false);
  const [speaking,setSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);
  const [context, setContext] = useState<string | null>(null);

  useEffect(() => {
    const openFromArtwork = () => setExpanded(true);
    window.addEventListener("lemos:lia-open", openFromArtwork);
    return () => window.removeEventListener("lemos:lia-open", openFromArtwork);
  }, []);

  // Recolhe ao trocar de página
  useEffect(() => { setExpanded(false); setContext(null); recordedAudioRef.current?.pause(); recordedAudioRef.current = null; window.speechSynthesis?.cancel(); speechRef.current=null; setSpeaking(false); }, [location.pathname]);
  useEffect(() => () => { recordedAudioRef.current?.pause(); window.speechSynthesis?.cancel(); }, []);

  useEffect(() => {
    const onCtx = (e: Event) => { recordedAudioRef.current?.pause(); recordedAudioRef.current = null; window.speechSynthesis?.cancel(); speechRef.current = null; setSpeaking(false); setContext(((e as CustomEvent).detail as string) || null); };
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
  const activityMessage = currentContext && CONTEXT_TIPS[currentContext] ? CONTEXT_TIPS[currentContext] : currentContext?.startsWith("activity:")
    ? `Obaaa! 📖 ${currentContext.slice(9)}! Vamos descobrir as respostas juntinhos? 🌟`
    : null;
  const message = location.pathname === "/login" || location.pathname === "/login-sms"
    ? PAGE_TIPS[location.pathname]
    : activityMessage || (currentContext && CONTEXT_TIPS[currentContext]) || PAGE_TIPS[location.pathname] || (!logged ? LOGIN_TIP : PAGE_TIPS["/"]);

  const ACTIVITY_HIGHLIGHTS: Record<string, string> = {
    "quiz": "No Quiz Bíblico de hoje, cada perguntinha é uma aventura cheia de surpresas e descobertas sobre Deus!",
    "activity:Quiz Bíblico": "No Quiz Bíblico de hoje, cada perguntinha é uma aventura cheia de surpresas e descobertas sobre Deus!",
    "activity:Quem Sou Eu? — Parte 3": "Cada resposta é uma nova descoberta sobre os personagens da Palavra de Deus!",
    "memory": "Cada imagem esconde um amiguinho que já conhecemos nas histórias da Bíblia!",
    "jigsaw": "Cada imagem montada revela uma surpresa especial da Palavra de Deus!",
    "wordbuilder": "Cada letrinha monta uma palavrinha. É muito bom descobrir sobre a Palavra de Deus!",
  };
  const activityHighlight = location.pathname === "/atividades" && currentContext ? ACTIVITY_HIGHLIGHTS[currentContext] : undefined;
  const activityParts = activityHighlight ? message.split(activityHighlight) : null;

  const toggleSpeech = () => {
    if (speaking) { recordedAudioRef.current?.pause(); recordedAudioRef.current = null; window.speechSynthesis?.cancel(); speechRef.current=null; setSpeaking(false); return; }
    recordedAudioRef.current?.pause();
    recordedAudioRef.current = null;
    window.speechSynthesis?.cancel();
    if (location.pathname === "/biblia" && currentContext === "biblia:pesquisar") {
      const audio = new Audio("/audio/lia/lia-pesquisa-biblia.mp3");
      recordedAudioRef.current = audio;
      audio.onended = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); } };
      audio.onerror = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } };
      setSpeaking(true);
      void audio.play().catch(() => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } });
      return;
    }
    if (location.pathname === "/biblia" && currentContext === "biblia:novo") {
      const audio = new Audio("/audio/lia/lia-biblia-novo-testamento.mp3");
      recordedAudioRef.current = audio;
      audio.onended = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); } };
      audio.onerror = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } };
      setSpeaking(true);
      void audio.play().catch(() => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } });
      return;
    }
    if (location.pathname === "/biblia" && currentContext === "biblia:antigo") {
      const audio = new Audio("/audio/lia/lia-biblia-velho-testamento.mp3");
      recordedAudioRef.current = audio;
      audio.onended = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); } };
      audio.onerror = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } };
      setSpeaking(true);
      void audio.play().catch(() => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } });
      return;
    }
    if (location.pathname === "/atividades" && (currentContext === "activity:Quem Sou Eu? — Parte 3" || currentContext === "activity:Quiz Bíblico" || currentContext === "quiz" || currentContext === "wordbuilder" || currentContext === "memory" || currentContext === "jigsaw")) {
      const audio = new Audio(currentContext === "activity:Quem Sou Eu? — Parte 3" ? "/audio/lia/lia-quem-sou-eu-parte-3.mp3" : currentContext === "wordbuilder" ? "/audio/lia/lia-construtor-palavras.mp3" : currentContext === "memory" ? "/audio/lia/lia-memoria.mp3" : currentContext === "jigsaw" ? "/audio/lia/lia-quebra-cabeca.mp3" : "/audio/lia/lia-quiz-biblico.mp3");
      recordedAudioRef.current = audio;
      audio.onended = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); } };
      audio.onerror = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } };
      setSpeaking(true);
      void audio.play().catch(() => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } });
      return;
    }
    if (location.pathname === "/login" || location.pathname === "/" || location.pathname === "/biblia" || location.pathname === "/devocionais" || location.pathname === "/pedidos-oracao" || location.pathname === "/veja" || location.pathname === "/ouca" || location.pathname === "/atividades" || location.pathname === "/album") {
      const audioPath = location.pathname === "/" ? "/audio/lia/lia-inicio.mp3" : location.pathname === "/biblia" ? "/audio/lia/lia-biblia.mp3" : location.pathname === "/devocionais" ? "/audio/lia/lia-devocional.mp3" : location.pathname === "/pedidos-oracao" ? "/audio/lia/lia-orar.mp3" : location.pathname === "/veja" ? "/audio/lia/lia-veja.mp3" : location.pathname === "/ouca" ? "/audio/lia/lia-ouca.mp3" : location.pathname === "/atividades" && currentContext === "jigsaw" ? "/audio/lia/lia-quebra-cabeca.mp3" : location.pathname === "/atividades" && currentContext === "memory" ? "/audio/lia/lia-memoria.mp3" : location.pathname === "/atividades" && currentContext === "wordbuilder" ? "/audio/lia/lia-construtor-palavras.mp3" : location.pathname === "/atividades" && (currentContext === "activity:Quiz Bíblico" || currentContext === "quiz") ? "/audio/lia/lia-quiz-biblico.mp3" : location.pathname === "/atividades" && currentContext === "activity:Quem Sou Eu? — Parte 3" ? "/audio/lia/lia-quem-sou-eu-parte-3.mp3" : location.pathname === "/atividades" ? (currentContext ? "" : "/audio/lia/lia-aprenda.mp3") : location.pathname === "/album" ? (currentContext === "album:pages" ? "/audio/lia/lia-album-vol1.mp3" : "/audio/lia/lia-album.mp3") : "/audio/lia/lia-login.mp3";
      if (!audioPath) { speakBrowserVoice(); return; }
      const audio = new Audio(audioPath);
      recordedAudioRef.current = audio;
      audio.onended = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); } };
      audio.onerror = () => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } };
      setSpeaking(true);
      audio.play().catch(() => { if (recordedAudioRef.current === audio) { recordedAudioRef.current = null; setSpeaking(false); speakBrowserVoice(); } });
      return;
    }
    speakBrowserVoice();
  };
  const speakBrowserVoice = () => {
    if (!("speechSynthesis" in window)) return;
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
  const liaPosition = location.pathname === "/atividades"
    ? "top-[48px] bottom-auto sm:top-[58px]"
    : persistentHelp
      ? "bottom-[calc(90px+env(safe-area-inset-bottom,0px))]"
      : "bottom-[calc(77px+env(safe-area-inset-bottom,0px))]";

  // O álbum depende da LIA para explicar pacotinhos e figurinhas.
  if (!liaVisible && !persistentHelp) return null;

  if (!expanded) {
    return (
      <div data-lemos-lia="" className={`fixed z-[9998] flex flex-col items-center gap-2 ${compactLia ? "left-0 sm:left-1" : "left-[-16px] sm:left-[-12px]"} ${liaPosition}`}>
      <Button variant="ghost"
        onMouseEnter={(event) => { if (!persistentHelp && (event.nativeEvent as PointerEvent).pointerType !== "touch") setExpanded(true); }}
        onFocus={() => { if (!persistentHelp) setExpanded(true); }}
        onClick={() => setExpanded(true)}
        aria-label="Falar com a LIA, sua ajudante"
        title="Falar com a LIA, sua ajudante"
        className="h-auto flex flex-col items-center gap-1 !bg-transparent !border-0 !shadow-none hover:!bg-transparent transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-yellow-400"
      >
        <span className={`${liaSize} block animate-[liaFloat_3.4s_ease-in-out_infinite] drop-shadow-[0_0_12px_rgba(255,215,70,.95)]`}>
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
    <div data-lemos-lia="" onMouseLeave={(event) => { if (!onHome && !persistentHelp && (event.nativeEvent as PointerEvent).pointerType !== "touch") setExpanded(false); }}
      className={`fixed z-[9998] flex flex-col items-end gap-1 ${compactLia ? "left-0 sm:left-1" : "left-[-16px] sm:left-[-12px]"} ${liaPosition}`}>
      {/* Balão de fala padrão da LIA: branco, borda dourada e ponta voltada à mascote. */}
      <div role="dialog" aria-label="Ajuda da LIA" className={`pointer-events-auto fixed left-2 right-2 ${location.pathname === "/atividades" ? "top-[calc(48px+clamp(132px,36vw,164px))] bottom-auto sm:top-[calc(58px+clamp(132px,36vw,164px))]" : "bottom-[calc(100px+env(safe-area-inset-bottom,0px))] sm:bottom-[calc(120px+env(safe-area-inset-bottom,0px))]"} z-[9999] w-auto max-w-[320px] max-h-[min(42dvh,300px)] break-words rounded-[26px] border-[3px] border-amber-400 bg-white/95 p-3 text-slate-900 shadow-[0_5px_22px_rgba(115,66,0,.35)]`}>
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-[17px] left-[52px] h-[30px] w-[30px] rotate-45 border-b-[3px] border-r-[3px] border-amber-400 bg-white" />
        <div className="relative flex items-center justify-end gap-2 border-b border-amber-200 pb-2">
          <div className="flex items-center gap-1">
            <button type="button" onClick={toggleSpeech} aria-label={speaking ? "Parar leitura" : "Ouvir orientação da página"} className="rounded-full bg-green-700 p-2 text-white hover:bg-green-600">{speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
            <button type="button" onClick={() => { setExpanded(false); recordedAudioRef.current?.pause(); recordedAudioRef.current=null; window.speechSynthesis?.cancel(); speechRef.current=null; setSpeaking(false); }} aria-label="Fechar ajuda" className="rounded-full bg-amber-100 p-2 text-amber-950 hover:bg-amber-200"><X size={20} /></button>
          </div>
        </div>
        <p className="relative mt-3 max-h-[calc(min(42dvh,300px)-90px)] overflow-y-auto overscroll-contain whitespace-pre-line text-sm font-medium leading-relaxed text-slate-900">{location.pathname === "/biblia" ? <>{cleanSpeechText(message).split("A cada página, uma nova descoberta. Cada palavrinha é uma sementinha de amor que Jesus planta em seu coração!")[0]}<strong className="block mt-2 font-extrabold text-amber-900">A cada página, uma nova descoberta. Cada palavrinha é uma sementinha de amor que Jesus planta em seu coração!</strong></> : location.pathname === "/devocionais" ? <>{cleanSpeechText(message).split("Cada devocional é um carinho de Deus que ilumina seu dia e ensina seu coração a espalhar amor e bondade!")[0]}<strong className="block mt-2 font-extrabold text-amber-900">Cada devocional é um carinho de Deus que ilumina seu dia e ensina seu coração a espalhar amor e bondade!</strong></> : location.pathname === "/pedidos-oracao" ? <>{cleanSpeechText(message).split("A cada oração, seu coração se enche de fé, amor e esperança!")[0]}<strong className="block mt-2 font-extrabold text-amber-900">A cada oração, seu coração se enche de fé, amor e esperança!</strong><span className="block mt-2">Ore com carinho e ainda ganhe moedinhas!</span></> : location.pathname === "/veja" ? <>{cleanSpeechText(message).split("Cada história traz uma linda lição de fé, amor e amizade com Deus!")[0]}<strong className="block mt-2 font-extrabold text-amber-900">Cada história traz uma linda lição de fé, amor e amizade com Deus!</strong><span className="block mt-2">Assista, aprenda e ainda ganhe moedinhas!</span></> : location.pathname === "/ouca" ? <>{cleanSpeechText(message).split("Sabia que cantar louvores é uma linda maneira de agradecer e demonstrar nosso amor a Deus?")[0]}<strong className="block mt-2 font-extrabold text-amber-900">Sabia que cantar louvores é uma linda maneira de agradecer e demonstrar nosso amor a Deus?</strong><span className="block mt-2">Cante com o coração, divirta-se e ganhe moedinhas!</span></> : location.pathname === "/atividades" && activityParts && activityParts.length === 2 ? <>{activityParts[0]}<strong className="block mt-2 font-extrabold text-amber-900">{activityHighlight}</strong>{activityParts[1]}</> : location.pathname === "/atividades" ? <>{message}</> : location.pathname === "/album" && currentContext === "album:pages" ? <>{cleanSpeechText(message).split("Abra, descubra, colecione e divirta-se nessa aventura bíblica!")[0]}<strong className="block mt-2 font-extrabold text-amber-900">Abra, descubra, colecione e divirta-se nessa aventura bíblica!</strong></> : location.pathname === "/album" && !currentContext ? <>{cleanSpeechText(message).split("Cada figurinha é um pedacinho dessa linda aventura com Deus!")[0]}<strong className="block mt-2 font-extrabold text-amber-900">Cada figurinha é um pedacinho dessa linda aventura com Deus!</strong><span className="block mt-2">Complete seu álbum e prepare-se para o próximo desafio!</span></> : cleanSpeechText(message)}</p>
      </div>

      <div className="flex flex-col items-center gap-2">
      <Button variant="ghost"
        onClick={() => { setExpanded(false); recordedAudioRef.current?.pause(); recordedAudioRef.current=null; window.speechSynthesis?.cancel(); speechRef.current=null; setSpeaking(false); }}
        aria-label="Recolher a LIA"
        title="Toque para recolher a LIA"
        className="pointer-events-auto h-auto flex-col !bg-transparent !border-0 !shadow-none hover:!bg-transparent transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-yellow-400"
      >
        <img
          src={avatar}
          alt="LIA, a mascote que ajuda você a navegar"
          className={`${liaSize} object-contain object-bottom drop-shadow-[0_0_12px_rgba(255,215,70,.95)] animate-[liaFloat_3.4s_ease-in-out_infinite] select-none`}
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
