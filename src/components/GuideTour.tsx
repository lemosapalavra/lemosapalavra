import { useEffect, useState } from "react";
import { HelpCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Guia visual de uso do site (como entrar, ganhar moedinhas, comprar pacotes,
 * colecionar e trocar figurinhas). Aparece automaticamente na primeira visita
 * e pode ser reaberto a qualquer momento pelo botão flutuante "Como funciona".
 */

const SEEN_KEY = "lemos_guide_seen_v1";

type Step = {
  emoji: string;
  title: string;
  text: string;
  action?: { label: string; to: string };
};

const steps: Step[] = [
  {
    emoji: "🔐",
    title: "1. Entre ou cadastre-se",
    text:
      "Toque em “Entrar” no topo da página e crie sua conta com Nome, Celular e Senha. Depois de entrar, o site fica todo colorido e liberado!",
    action: { label: "Ir para Entrar", to: "/login" },
  },
  {
    emoji: "🪙",
    title: "2. Ganhe moedinhas",
    text:
      "Você ganha moedinhas assistindo aos vídeos até o fim, lendo o devocional do dia, ouvindo louvores e completando as atividades (quiz, memória, colorir, caça-palavras...).",
    action: { label: "Ver atividades", to: "/atividades" },
  },
  {
    emoji: "🎁",
    title: "3. Compre pacotes de figurinhas",
    text:
      "No Álbum, use 3 moedinhas para abrir um pacote com 5 figurinhas — sempre com 1 figurinha especial (rara ou relíquia)!",
    action: { label: "Abrir o Álbum", to: "/album" },
  },
  {
    emoji: "📗",
    title: "4. Colecione e descubra",
    text:
      "Cada figurinha tem uma moldura: cinza (normal), prata (rara) e dourada (relíquia). Toque na figurinha para ampliar, dar zoom e ler a passagem bíblica dela.",
  },
  {
    emoji: "🔁",
    title: "5. Repetidas e trocas",
    text:
      "Figurinhas repetidas aparecem com um número (x2, x3...). Use o botão “Trocar repetidas” no Álbum para transformá-las em novas figurinhas que ainda faltam.",
    action: { label: "Ver minhas figurinhas", to: "/album" },
  },
  {
    emoji: "🏆",
    title: "6. Complete o álbum",
    text:
      "Ao completar categorias você ganha medalhas. Volte todos os dias: sempre há vídeos, louvores e desafios novos para ganhar mais moedinhas!",
  },
];

export default function GuideTour() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) {
        const t = setTimeout(() => setOpen(true), 1200);
        return () => clearTimeout(t);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const openIt = () => { setI(0); setOpen(true); };
    window.addEventListener("lemos:open-guide", openIt);
    return () => window.removeEventListener("lemos:open-guide", openIt);
  }, []);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
  };

  if (location.pathname === "/login") {
    // no login já existe orientação própria; mantém só o botão de ajuda
  }

  const s = steps[i];

  return (
    <>
      {/* Botão flutuante de ajuda */}
      <button
        onClick={() => { setI(0); setOpen(true); }}
        className="fixed left-4 bottom-24 z-[70] flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-sm font-bold text-amber-950 shadow-lg border-2 border-amber-600/40 hover:scale-105 transition-transform"
        aria-label="Como funciona o site"
        title="Como funciona: entrar, ganhar moedinhas e colecionar figurinhas"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Como funciona</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center bg-black/60 p-3 animate-fade-in"
          onClick={close}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border-4 border-amber-400 bg-popover p-6 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-muted hover:bg-muted/70"
              aria-label="Fechar guia"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center">
              <span className="block text-6xl animate-bounce">{s.emoji}</span>
              <h2 className="font-display mt-3 text-xl font-extrabold text-foreground">{s.title}</h2>
              <p className="font-body mt-2 text-sm leading-relaxed text-foreground/80">{s.text}</p>
            </div>

            {s.action && (
              <button
                onClick={() => { close(); navigate(s.action!.to); }}
                className="mt-4 w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3 font-display text-sm font-bold text-amber-950 shadow hover:scale-[1.02] transition-transform"
              >
                {s.action.label} →
              </button>
            )}

            {/* Passos */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => setI((v) => Math.max(0, v - 1))}
                disabled={i === 0}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted disabled:opacity-30"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-1.5">
                {steps.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setI(idx)}
                    className={`h-2.5 cursor-pointer rounded-full transition-all ${
                      idx === i ? "w-6 bg-amber-500" : "w-2.5 bg-amber-500/30"
                    }`}
                  />
                ))}
              </div>

              {i < steps.length - 1 ? (
                <button
                  onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-amber-950"
                  aria-label="Próximo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={close}
                  className="rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white"
                >
                  Começar!
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
