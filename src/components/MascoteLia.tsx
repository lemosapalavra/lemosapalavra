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
  "/": "Oieee, meu amiguinho! 🌈 Bem-vindo ao nosso cantinho de aventuras com Jesus! Escolha onde quer brincar primeiro! E olha só: assistindo aos vídeos, fazendo tarefas, lendo o devocional e orando, você pode juntar moedinhas para o álbum! 🪙✨",
  "/biblia": "Psiu, vem cá! 📖 A Bíblia está cheinha de histórias incríveis! Escolha um livrinho e vamos descobrir juntinhos! 🌟",
  "/louvores": "Lá, lá, lááá! 🎶 Preparou a voz? Escolha um louvor e cante bem bonito comigo! Quando terminar de assistir, você pode ganhar moedinhas! 🪙",
  "/veja": "Obaaa, sessão de cinema! 🍿🎬 Escolha um vídeo, fique bem confortável e vamos assistir! Terminou de ver? Ebaaa, pode ganhar moedinhas para as figurinhas! 🪙",
  "/ouca": "Shhh... ouviu a musiquinha? 🎵💛 Escolha um louvor, aperte o play e cante comigo! Depois de assistir, você pode juntar moedinhas para o álbum! 🪙",
  "/musicas": "Iupiii, hora da música! 🎤🎶 Escolha a sua favorita e solte essa voz linda! Assistiu tudinho? Você pode ganhar moedinhas! 🪙",
  "/lemosplay": "Uauuu, quantas aventuras na telinha! 🎬🤩 Escolha um vídeo e venha assistir comigo! Quando terminar, você pode ganhar moedinhas para comprar figurinhas! 🪙🎁",
  "/jogos": "Ebaaa, hora de brincar! 🧩😄 Qual joguinho você vai escolher? Eu vou torcer por você! Complete o desafio e ganhe moedinhas para o álbum! 🪙",
  "/atividades": "Olha só, pequeno detetive! 🔎✨ Aqui tem pistas e descobertas esperando por você! Escolha uma atividade, complete a tarefa e ganhe moedinhas! 🪙",
  "/devocionais": "Bom diaaa, coraçãozinho! 💖☀️ Vamos ler a palavrinha especial de Deus para hoje? Leia seu devocional diariamente e ganhe moedinhas para o álbum! 🪙",
  "/pedidos-oracao": "Psiu... que tal conversar com Deus? 🙏💛 Conte a Ele o que está no seu coração. É um momento muito especial! E aqui no site, ao orar, você também pode ganhar moedinhas! 🪙",
  "/album": "Tcharããã! 🎁🌈 Bem-vindo ao seu álbum de figurinhas! Vamos descobrir quais faltam? Para comprar pacotinhos, junte moedinhas assistindo aos vídeos, fazendo tarefas, lendo o devocional e orando! 🪙",
  "/historias-do-dia": "Obaaa, historinha do dia! 📚✨ Qual surpresa será que vamos descobrir hoje? Escolha uma história e venha comigo!",
  "/historias-biblicas": "Era uma vez... uma história da Bíblia! 📖🤩 Escolha uma aventura e vamos conhecer seus personagens juntinhos!",
  "/login": "Oieee! 💛 Que bom que você chegou! Já tem conta? Entre com seus dados! É sua primeira visita? Vamos criar sua conta e escolher um avatar bem lindão! 🎈",
  "/login-sms": "Trim-trim! 📱✨ Vamos conferir seu código para entrar? Siga os passinhos da tela e já, já começa a diversão!",
  "/admin/whatsapp": "Oie! 💌 Chegamos ao cantinho das mensagens! Vamos cuidar de cada recadinho com carinho? 🌷",
  "/familia": "Obaaa, a família chegou! 🥰🌻 Aqui todo mundo pode aprender e se divertir juntinho! Vamos explorar?",
  "/config": "Psiu, cuidador do nosso cantinho! ⚙️✨ Aqui estão os ajustes especiais do site. Vamos organizar tudinho?",
  "/estatisticas": "Uauuu, quantas descobertas! 📊⭐ Vamos espiar os números das nossas aventuras? Que curiosidade!",
};

/** Falas por contexto — enviadas por `lemos:lia-context`. */
const CONTEXT_TIPS: Record<string, string> = {
  "quiz": "Preparado para o Quiz Bíblico? 🏆🤩 Leia a perguntinha, escolha a resposta e... tcharããã! Complete o desafio para ganhar moedinhas! 🪙",
  "memory": "Cadê o parzinho? 🧠🃏 Vire duas cartinhas e procure as iguais! Quando terminar o joguinho, você pode ganhar moedinhas! 🪙",
  "coloring": "Obaaa, artista! 🎨🌈 Escolha suas cores favoritas e deixe o desenho bem lindão! Termine sua arte e conquiste moedinhas! 🪙",
  "pairs": "Quem combina com quem? 🧩💕 Escolha um personagem e encontre sua história! Complete os pares e ganhe moedinhas! 🪙",
  "jigsaw": "Uma pecinha aqui, outra ali... 🧩🤩 Vamos montar esse quebra-cabeça? Terminou? Ebaaa, moedinhas para você! 🪙",
  "wordsearch": "Olhinhos de detetive ligados! 🔎✨ Ache as palavras escondidinhas e marque todas! Complete a missão para ganhar moedinhas! 🪙",
  "maze": "Ai, ai, qual será o caminho? 🗺️😄 Vamos achar a saída do labirinto! Chegou ao final? Você pode ganhar moedinhas! 🪙",
  "crossword": "Olha quantas letrinhas! 🔤🌟 Descubra as palavras da cruzadinha e complete o desafio para ganhar moedinhas! 🪙",
  "connectdots": "Um, dois, três... combinou! 🌟💕 Ligue cada frase à imagem certinha! Complete tudo e ganhe moedinhas! 🪙",
  "assemble": "Peça daqui, peça dali... 🧩✨ Monte a imagem e adivinhe a história! Acertou? Ebaaa, você pode ganhar moedinhas! 🪙",
  "edu:circles": "Bolinhas coloridas, oba! 🖍️🔴 Escolha a cor indicada e pinte cada círculo! Complete a tarefa e ganhe moedinhas! 🪙",
  "edu:connect": "Vamos fazer um arco-íris? 🌈✨ Ligue cada pontinho à sua cor amiguinha! Terminou? Você pode ganhar moedinhas! 🪙",
  "album:cover": "Uauuu, olha essa capa! 🌈📒 O Volume 1 está esperando suas figurinhas! Junte moedinhas com vídeos, tarefas, devocionais e orações, compre pacotinhos e complete seu álbum! 🪙🎁",
  "album:pages": "Que coleção lindaaa! 🤩📒 Vamos descobrir quais figurinhas faltam? Cada pacotinho custa 3 moedinhas e traz 5 figurinhas! Ganhe moedas nas atividades, vídeos, devocionais e orações! 🪙",
  "album:sticker": "Ooooh, que figurinha especial! 🤩🔍 Aumente a imagem, explore os detalhes e toque em Ler na Bíblia para conhecer a história!",
  "album:pack": "Tcharããã! 🎁✨ Chegou a hora de abrir seu pacotinho! Toque nas figurinhas e descubra as surpresinhas!",
  "album:trade": "Opa, uma figurinha repetida! 🔄😄 Vamos visitar a Sala de Trocas e procurar aquela que está faltando? Que aventura!",
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
    "Oieee! 💛 Vamos começar nossa aventura? Coloque seu nome e celular para entrar! É sua primeira vez? Cadastre-se e venha brincar! 🎈";

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
