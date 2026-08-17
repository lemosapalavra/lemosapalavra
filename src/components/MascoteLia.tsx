import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import lia1 from "@/assets/lia-1.png.asset.json";
import lia2 from "@/assets/lia-2.png.asset.json";

/**
 * LIA — mascote guia do site.
 * - Página inicial: LIA_1 com o balão "Clique em mim se precisa de minha ajuda".
 *   Ao clicar em "Quero sua ajuda", troca para LIA_2 explicando como entrar/cadastrar.
 * - Demais páginas: LIA_2 com uma dica de navegação da página atual.
 */

const PAGE_TIPS: Record<string, string> = {
  "/biblia": "Aqui você lê a Bíblia! Escolha o livro e o capítulo, e toque no ícone de ouvir para eu ler para você.",
  "/louvores": "Escolha um louvor e aperte o play. Curta, comente e compartilhe com a família!",
  "/devocionais": "Leia o devocional do dia e ganhe moedinhas 🪙 ao terminar.",
  "/pedidos-oracao": "Escreva seu pedido de oração e escolha a categoria. Vamos orar juntos!",
  "/atividades": "Escolha uma atividade: colorir, caça-palavras, memória ou quebra-cabeça. Cada uma dá moedinhas!",
  "/album": "Junte moedinhas 🪙, abra pacotinhos e complete seu álbum de figurinhas. Toque numa figurinha para ampliar.",
  "/lemosplay": "Aqui ficam os vídeos! Deslize para ver as categorias: Gênesis, Jesus, Séries e Músicas.",
  "/historias-biblicas": "Escolha uma história e assista. Depois volte para ganhar suas moedinhas!",
  "/login": "Preencha nome, celular e senha para criar sua conta. Já tem conta? Use a aba Entrar.",
};

const HOME_TIP =
  "Toque nos ícones que giram ao redor da logo para navegar: Bíblia, Vídeos, Álbum, Atividades e mais!";

export default function MascoteLia() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [helped, setHelped] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
    if (!isHome) setHelped(true);
  }, [location.pathname, isHome]);

  const showLia2 = !isHome || helped;

  const message = isHome
    ? helped
      ? "Para entrar: toque em Entrar/Cadastrar. Se ainda não tem conta, preencha seu nome, celular e senha, escolha um avatar e pronto! Depois é só voltar aqui e aproveitar tudo."
      : "Olá! Eu sou a LIA. Clique em mim se precisa de minha ajuda 💛"
    : PAGE_TIPS[location.pathname] || HOME_TIP;

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
    <div className="fixed bottom-3 left-2 z-[70] flex items-end gap-2 max-w-[78vw] sm:max-w-sm pointer-events-none">
      <button
        onClick={() => isHome && !helped && setHelped(true)}
        aria-label="LIA, sua ajudante"
        title="LIA, sua ajudante"
        className="pointer-events-auto shrink-0 focus:outline-none"
      >
        <img
          src={showLia2 ? lia2.url : lia1.url}
          alt="LIA, a mascote que ajuda você a navegar"
          className="w-24 sm:w-28 h-auto drop-shadow-xl animate-[liaFloat_3.4s_ease-in-out_infinite] select-none"
          draggable={false}
        />
      </button>

      <div className="pointer-events-auto relative mb-6 rounded-2xl bg-white/95 backdrop-blur border-2 border-amber-300 shadow-xl px-3 py-2 pr-7">
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar ajuda da LIA"
          title="Fechar"
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center"
        >
          <X className="w-3 h-3" />
        </button>
        <p className="font-body text-[11px] sm:text-xs text-amber-900 leading-snug">{message}</p>
        {isHome && !helped && (
          <button
            onClick={() => setHelped(true)}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-display font-extrabold text-[11px] shadow"
          >
            Quero sua ajuda
          </button>
        )}
        <span className="absolute -left-2 bottom-3 w-3 h-3 rotate-45 bg-white border-l-2 border-b-2 border-amber-300" />
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
