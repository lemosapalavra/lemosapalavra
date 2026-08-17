import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import lia1 from "@/assets/lia-1.png.asset.json";
import lia2 from "@/assets/lia-2.png.asset.json";

/**
 * LIA — mascote guia do site.
 * - Visitante (sem login) na home: LIA_1 convidando a pedir ajuda.
 * - Depois de entrar: LIA_2 em todas as páginas, com um balão ACIMA da cabeça
 *   dela explicando o que fazer naquele ambiente/atividade.
 */

const PAGE_TIPS: Record<string, string> = {
  "/": "Toque nos ícones que giram ao redor da logo para navegar: Bíblia, Vídeos, Álbum, Atividades e mais. Cada visita rende moedinhas 🪙!",
  "/biblia": "Escolha o livro e o capítulo. Toque no ícone de ouvir 🔊 e eu leio a Palavra para você.",
  "/louvores": "Escolha um louvor e aperte o play ▶️. Você pode curtir, comentar e compartilhar com a família.",
  "/devocionais": "Leia o devocional de hoje até o fim para ganhar suas moedinhas 🪙.",
  "/pedidos-oracao": "Escreva seu pedido e escolha a categoria. Vamos orar juntos por você! 🙏",
  "/atividades": "Escolha uma atividade tocando no ícone. Cada uma dá moedinhas 🪙 uma vez por dia.",
  "/album": "Junte moedinhas 🪙, abra pacotinhos e complete o álbum. Toque numa figurinha para ampliar e dar zoom.",
  "/lemosplay": "Deslize para ver as categorias: Gênesis, Jesus, Séries e Músicas. Assista até o fim e ganhe moedinhas 🪙.",
  "/historias-biblicas": "Escolha uma história e assista até o final para ganhar suas moedinhas 🪙.",
  "/login": "Preencha nome, celular e senha para criar sua conta. Já tem conta? Use a aba Entrar.",
  "/config": "Aqui você configura o site: vídeos, faixas, contatos e novidades.",
  "/estatisticas": "Este painel mostra o que os usuários mais acessam no site.",
};

const ACTIVITY_TIPS: Record<string, string> = {
  quiz: "No Quiz, escolha a categoria e toque na resposta certa. Acertando tudo você ganha moedinhas 🪙!",
  memory: "Na Memória, vire duas cartinhas por vez e encontre os pares iguais até limpar o tabuleiro.",
  coloring: "No Colorir, escolha uma cor na paleta e toque nas partes do desenho para pintar.",
  jigsaw: "No Quebra-Cabeça, toque em duas peças para trocá-las de lugar até montar a imagem.",
  wordsearch: "No Caça-Palavras, arraste o dedo sobre as letras para marcar as palavras da lista.",
  "edu:circles": "Em Pinte os Círculos, escolha a cor indicada e pinte cada círculo certinho.",
  "edu:connect": "Em Ligue as Cores, arraste ligando cada ponto à cor correspondente.",
};

export default function MascoteLia() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [helped, setHelped] = useState(false);
  const [open, setOpen] = useState(true);
  const [logged, setLogged] = useState(false);
  const [activity, setActivity] = useState<string | null>(null);

  useEffect(() => {
    setOpen(true);
    if (!isHome) setHelped(true);
  }, [location.pathname, isHome]);

  useEffect(() => {
    const check = () => {
      try { setLogged(!!localStorage.getItem("lemos_user")); } catch { setLogged(false); }
    };
    check();
    window.addEventListener("storage", check);
    window.addEventListener("lemos_admin_change", check);
    const t = setInterval(check, 2000);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("lemos_admin_change", check);
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    const onCtx = (e: Event) => setActivity((e as CustomEvent).detail || null);
    window.addEventListener("lemos:lia-context", onCtx);
    return () => window.removeEventListener("lemos:lia-context", onCtx);
  }, []);

  const showLia2 = logged || !isHome || helped;

  let message: string;
  if (activity && ACTIVITY_TIPS[activity]) {
    message = ACTIVITY_TIPS[activity];
  } else if (!logged && isHome) {
    message = helped
      ? "Para entrar: toque em Entrar/Cadastrar. Preencha seu nome, celular e senha, escolha um avatar e pronto!"
      : "Olá! Eu sou a LIA. Clique em mim se precisa de minha ajuda 💛";
  } else {
    message = PAGE_TIPS[location.pathname] || PAGE_TIPS["/"];
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Falar com a LIA"
        title="Falar com a LIA"
        className="fixed bottom-4 left-3 z-[70] w-14 h-14 rounded-full bg-white shadow-xl border-2 border-amber-300 overflow-hidden hover:scale-110 transition"
      >
        <img src={showLia2 ? lia2.url : lia1.url} alt="LIA" className="w-full h-full object-cover object-top" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 left-2 z-[70] flex flex-col items-center gap-1 w-28 sm:w-32 pointer-events-none">
      {/* Balão ACIMA da cabeça da LIA, com a setinha apontando para ela */}
      <div className="pointer-events-auto relative w-[70vw] max-w-xs sm:max-w-sm rounded-2xl bg-white/95 backdrop-blur border-2 border-amber-300 shadow-xl px-3 py-2 pr-7 self-start">
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar ajuda da LIA"
          title="Fechar"
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center"
        >
          <X className="w-3 h-3" />
        </button>
        <p className="font-body text-[11px] sm:text-xs text-amber-900 leading-snug">{message}</p>
        {!logged && isHome && !helped && (
          <button
            onClick={() => setHelped(true)}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-display font-extrabold text-[11px] shadow"
          >
            Quero sua ajuda
          </button>
        )}
        <span className="absolute left-8 -bottom-2 w-3 h-3 rotate-45 bg-white border-r-2 border-b-2 border-amber-300" />
      </div>

      <button
        onClick={() => !logged && isHome && !helped && setHelped(true)}
        aria-label="LIA, sua ajudante"
        title="LIA, sua ajudante"
        className="pointer-events-auto shrink-0 focus:outline-none self-start"
      >
        <img
          src={showLia2 ? lia2.url : lia1.url}
          alt="LIA, a mascote que ajuda você a navegar"
          className="w-24 sm:w-28 h-auto drop-shadow-xl animate-[liaFloat_3.4s_ease-in-out_infinite] select-none"
          draggable={false}
        />
      </button>

      <style>{`
        @keyframes liaFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
