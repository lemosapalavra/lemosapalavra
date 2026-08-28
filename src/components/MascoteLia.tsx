import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import lia1 from "@/assets/lia-1.png.asset.json";
import lia2 from "@/assets/lia-2.png.asset.json";

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
  "/": "Toque nos ícones que giram ao redor da logo para navegar: Bíblia, Vídeos, Álbum, Atividades e mais!",
  "/biblia": "Escolha o livro e o capítulo. Toque no ícone de ouvir 🔊 e eu leio a Palavra para você.",
  "/louvores": "Escolha um louvor e aperte o play ▶️. Dá para curtir, comentar e compartilhar com a família.",
  "/devocionais": "Leia o devocional de hoje até o fim para ganhar suas moedinhas 🪙.",
  "/pedidos-oracao": "Escreva seu pedido e escolha a categoria. Vamos orar juntos por você! 🙏",
  "/atividades": "Escolha uma atividade tocando no ícone. Cada uma dá moedinhas 🪙 uma vez por dia.",
  "/album": "Use 3 moedinhas 🪙 para abrir um pacote e toque em “Próxima” para virar a página do álbum.",
  "/lemosplay": "Deslize para ver as categorias: Gênesis, Jesus, Séries e Músicas. Assista até o fim e ganhe moedinhas 🪙.",
  "/historias-biblicas": "Escolha uma história e assista até o final para ganhar suas moedinhas 🪙.",
  "/login": "Preencha nome e celular para criar sua conta. Já tem conta? Use a aba Entrar.",
  "/config": "Aqui você configura o site: vídeos, faixas, contatos e novidades.",
  "/estatisticas": "Este painel mostra o que os usuários mais acessam no site.",
};

/** Falas por contexto — enviadas por `lemos:lia-context`. */
const CONTEXT_TIPS: Record<string, string> = {
  // Atividades
  quiz: "No Quiz, escolha a categoria e toque na resposta certa. Acertando tudo você ganha moedinhas 🪙!",
  memory: "Na Memória, vire duas cartinhas por vez e encontre os pares iguais.",
  coloring: "No Colorir, escolha uma cor e toque no desenho. Quer trocar? É só escolher outra cor e tocar de novo no mesmo lugar.",
  jigsaw: "No Quebra-Cabeça, toque em duas peças para trocá-las de lugar até montar a imagem.",
  wordsearch: "No Caça-Palavras, arraste o dedo sobre as letras para marcar as palavras da lista.",
  spot: "Nos 7 Erros, compare a cena de cima com a de baixo e toque, na cena de BAIXO, em cada coisa diferente. Acertou? Aparece um círculo vermelho. Ache todas e ganhe moedinhas 🪙.",
  crossword: "Na Cruzadinha, toque no número da dica, veja a figura e escreva a palavra da Bíblia nos quadradinhos.",
  "edu:circles": "Em Pinte os Círculos, escolha a cor indicada e pinte cada círculo.",
  "edu:connect": "Em Ligue as Cores, arraste ligando cada ponto à cor correspondente.",
  // Álbum
  "album:cover": "Esta é a capa do seu álbum. Toque nela para abrir e começar a colecionar!",
  "album:pages": "Toque em “Próxima” para virar a página e ver outras categorias de figurinhas.",
  "album:sticker": "Aqui você amplia a figurinha: use + e − para dar zoom, arraste para mover e toque em “Ler na Bíblia” para ver a passagem.",
  "album:pack": "Abrindo o pacote! Toque nas figurinhas para revelar cada uma delas.",
  "album:trade": "Aqui você troca as figurinhas repetidas por outras que ainda faltam no álbum.",
};

export default function MascoteLia() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [expanded, setExpanded] = useState(false);
  const [context, setContext] = useState<string | null>(null);

  // Recolhe ao trocar de página
  useEffect(() => { setExpanded(false); }, [location.pathname]);

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

  const message = !logged
    ? LOGIN_TIP
    : (context && CONTEXT_TIPS[context]) || PAGE_TIPS[location.pathname] || PAGE_TIPS["/"];

  const avatar = isHome && !context ? lia1.url : lia2.url;


  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        aria-label="Falar com a LIA, sua ajudante"
        title="Falar com a LIA, sua ajudante"
        className="fixed bottom-4 left-3 z-[45] w-12 h-12 rounded-full bg-white shadow-lg border-2 border-amber-300 overflow-hidden hover:scale-110 active:scale-95 transition"
      >
        <img src={avatar} alt="LIA" className="w-full h-full object-cover object-top" loading="lazy" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 left-2 z-[45] flex flex-col items-start gap-1 pointer-events-none">
      {/* Balão acima da cabeça da LIA */}
      <div className="pointer-events-auto relative w-[68vw] max-w-xs rounded-2xl bg-white/95 backdrop-blur border-2 border-amber-300 shadow-xl px-3 py-2">
        <p className="font-body text-[11px] sm:text-xs text-amber-900 leading-snug">{message}</p>
        <span className="absolute left-6 -bottom-2 w-3 h-3 rotate-45 bg-white border-r-2 border-b-2 border-amber-300" />
      </div>

      <button
        onClick={() => setExpanded(false)}
        aria-label="Recolher a LIA"
        title="Toque para recolher a LIA"
        className="pointer-events-auto focus:outline-none"
      >
        <img
          src={avatar}
          alt="LIA, a mascote que ajuda você a navegar"
          className="w-20 sm:w-24 h-auto drop-shadow-xl animate-[liaFloat_3.4s_ease-in-out_infinite] select-none"
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
