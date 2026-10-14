import { useIconVisible } from "@/lib/iconVisibility";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const lia1 = "/lia-mascote.png";
const lia2 = "/lia-mascote.png";
import { Button } from "@/components/ui/button";

/**
 * LIA — mascote guia do site.
 * Fica recolhida como um ícone pequeno (não atrapalha no celular).
 * Um toque abre a LIA grande com o balão acima da cabeça dela;
 * outro toque recolhe de novo.
 *
 * O texto do balão muda conforme a página E conforme o contexto enviado
 * por outras telas pelo evento `lemos:lia-context` (atividade aberta,
 * figurinha ampliada, etc.), nunca repetindo a mesma fala.
 */

const PAGE_TIPS: Record<string, string> = {
  "/": "Oiii! 🌟 Que alegria te ver! Vamos brincar? Escolha um botão colorido e venha comigo!",
  "/biblia": "Oba! 📖 Vamos abrir a Bíblia e descobrir uma história linda? Escolha um livrinho!",
  "/louvores": "Lá, lá, lá! 🎵 Vamos cantar juntinhos? Escolha sua música favorita!",
  "/veja": "Pipoca imaginária pronta? 🍿 Escolha uma historinha e aperte o play!",
  "/ouca": "Que tal cantar comigo? 🎶 Escolha um louvor bem bonito!",
  "/musicas": "Vamos cantar? Escolha um louvor e toque no vídeo para ouvir.",
  "/lemosplay": "Eba, hora da historinha! 🎬 Escolha um vídeo e vamos assistir!",
  "/jogos": "Vamos brincar? 🧩 Tem memória, quebra-cabeça, palavrinhas e quiz! Qual você escolhe?",
  "/atividades": "Detetive da Bíblia, preparado? 🔎 Escolha uma parte de Quem Sou Eu e descubra as pistas!",
  "/devocionais": "Psiu! 💖 Que tal uma palavrinha de carinho de Deus para o seu dia?",
  "/pedidos-oracao": "Vamos falar com Deus? 🙏 Ele adora ouvir o que está no nosso coração!",
  "/album": "Uau, figurinhas! ✨ Junte moedinhas, abra pacotinhos e complete seu álbum!",
  "/historias-do-dia": "Escolha uma história bíblica do dia para ler e aprender!",
  "/historias-biblicas": "Escolha uma história bíblica para conhecer seus personagens e ensinamentos.",
  "/login": "Oiii! 💛 Já tem conta? Digite seu nome e celular! É novo por aqui? Vamos fazer seu cadastro!",
  "/login-sms": "Siga as instruções da tela para acessar sua conta com o celular.",
  "/admin/whatsapp": "Esta é uma ferramenta de administração para gerenciar mensagens.",
  "/familia": "Esta página reúne momentos de fé e aprendizado para toda a família.",
  "/config": "Aqui ficam as configurações reservadas à administração do site.",
  "/estatisticas": "Este painel reúne as estatísticas de uso do site.",
};

/** Falas por contexto — enviadas por `lemos:lia-context`. */
const CONTEXT_TIPS: Record<string, string> = {
  // Atividades
  quiz: "No Quiz Bíblico, leia cada pergunta, escolha uma alternativa e veja quantas respostas acertou.",
  memory: "Vamos testar a memória? 🧠 Vire duas cartinhas e ache os pares!",
  coloring: "No Colorir, escolha uma cor e toque no desenho. Quer trocar? É só escolher outra cor e tocar de novo no mesmo lugar.",
  pairs: "Em Ligue os Pares, escolha um personagem bíblico e depois o acontecimento correspondente.",
  jigsaw: "Peça por peça! 🧩 Vamos montar essa imagem juntos?",
  wordsearch: "No Caça-Palavras, arraste o dedo sobre as letras para marcar as palavras da lista.",
  maze: "No Labirinto, encontre o caminho correto até a chegada.",
  crossword: "Aqui você procura as palavras na grade e marca cada uma na lista embaixo. Achou todas? Ganha moedinhas 🪙.",
  connectdots: "Em Ligue os Pontos, toque numa frase e depois na imagem relacionada. Verde indica acerto e vermelho indica outra tentativa.",
  assemble: "Em Monte e Descubra, toque em duas peças para trocá-las de lugar. Montou a imagem? Escolha o nome certo da história e ganhe moedinhas 🪙.",
  "edu:circles": "Em Pinte os Círculos, escolha a cor indicada e pinte cada círculo.",
  "edu:connect": "Em Ligue as Cores, arraste ligando cada ponto à cor correspondente.",
  // Álbum
  "album:cover": "Olha só! 🌈 O Volume 1 está esperando por você! O Volume 2 ainda está sendo preparado!",
  "album:pages": "Vamos colecionar? 🪙 Com 3 moedinhas você abre um pacotinho de 5 figurinhas! As repetidas podem ir para a Sala de Trocas. Que legal!",

  "album:sticker": "Aqui você amplia a figurinha: use + e − para dar zoom, arraste para mover e toque em “Ler na Bíblia” para ver a passagem.",
  "album:pack": "Tcharam! 🎁 Toque nas figurinhas e descubra a surpresa!",
  "album:trade": "Figurinha repetida? 🔄 Vamos trocar por uma que falta!",
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
    "Oi! Para começar, toque em Entrar: é só o seu nome e o seu celular. Ainda não tem conta? Toque em Criar uma conta.";

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
    <div className={`fixed left-2 z-[45] flex flex-col items-start gap-1 pointer-events-none sm:left-4 ${isAlbum ? "bottom-[152px] sm:bottom-[166px]" : "bottom-3"}`}>
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
