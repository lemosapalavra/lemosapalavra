import { useIconVisible } from "@/lib/iconVisibility";
import { useEffect, useState } from "react";
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
  "/": "Oieee! 🌈 Escolha uma aventura! Vídeos, tarefas, devocionais e orações dão moedinhas para o álbum! 🪙",
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
  "jigsaw": "Peça por peça! 🧩 Monte o quebra-cabeça! 🌟",
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
  "album:pack": "Tcharããã! 🎁 Abra o pacotinho e descubra as surpresas! ✨",
  "album:trade": "Repetiu? 🔄 Vamos trocar pela figurinha que falta! 😄",
};

export default function MascoteLia() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAlbum = location.pathname.startsWith("/album");
  const [expanded, setExpanded] = useState(false);
  const [context, setContext] = useState<string | null>(null);

  // Recolhe ao trocar de página
  useEffect(() => { setExpanded(false); setContext(null); }, [location.pathname]);

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

  const currentContext = location.pathname === "/jogos" && context && !["memory","jigsaw","pairs"].includes(context) ? null : context;
  const message = location.pathname === "/login" || location.pathname === "/login-sms"
    ? PAGE_TIPS[location.pathname]
    : (currentContext && CONTEXT_TIPS[currentContext]) || PAGE_TIPS[location.pathname] || (!logged ? LOGIN_TIP : PAGE_TIPS["/"]);

  const avatar = isHome && !context ? lia1 : lia2;
  const liaVisible = useIconVisible("lia");

  if (!liaVisible) return null;

  if (!expanded) {
    return (
      <div className={`fixed left-2 z-[45] flex flex-col items-center gap-2 sm:left-4 ${isAlbum ? "bottom-[152px] sm:bottom-[166px]" : "bottom-3"}`}>
      <Button variant="ghost"
        onMouseEnter={() => setExpanded(true)}
        onFocus={() => setExpanded(true)}
        onClick={() => setExpanded(true)}
        aria-label="Falar com a LIA, sua ajudante"
        title="Falar com a LIA, sua ajudante"
        className="h-auto flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-yellow-400"
      >
        <span className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] rounded-full bg-white shadow-[0_5px_18px_rgba(120,58,8,.65),0_0_0_3px_rgba(255,217,87,.65)] border-[3px] border-amber-400 overflow-hidden block animate-[liaFloat_3.4s_ease-in-out_infinite]">
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
    <div onMouseLeave={() => setExpanded(false)}
      className={`fixed left-2 z-[45] flex flex-col items-start gap-1 sm:left-4 ${isAlbum ? "bottom-[152px] sm:bottom-[166px]" : "bottom-3"}`}>
      {/* Balão acima da cabeça da LIA */}
      <div className="pointer-events-auto relative w-[78vw] max-w-sm rounded-2xl bg-white/95 backdrop-blur border-2 border-amber-300 shadow-xl px-3 py-2">
        <p className="font-body text-[15px] sm:text-base text-amber-900 leading-relaxed">{message}</p>
        <span className="absolute left-6 -bottom-2 w-3 h-3 rotate-45 bg-white border-r-2 border-b-2 border-amber-300" />
      </div>

      <div className="flex flex-col items-center gap-2">
      <Button variant="ghost"
        onClick={() => setExpanded(false)}
        aria-label="Recolher a LIA"
        title="Toque para recolher a LIA"
        className="pointer-events-auto h-auto flex-col transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:ring-4 focus-visible:ring-yellow-400"
      >
        <img
          src={avatar}
          alt="LIA, a mascote que ajuda você a navegar"
          className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] object-cover object-top rounded-full border-[3px] border-amber-400 shadow-[0_5px_18px_rgba(120,58,8,.65),0_0_0_3px_rgba(255,217,87,.65)] animate-[liaFloat_3.4s_ease-in-out_infinite] select-none"
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
