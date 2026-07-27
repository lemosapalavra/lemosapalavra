import { useState, useEffect, useCallback, useRef } from "react";
import dedicatoriaBg from "@/assets/pergaminho.png";

const dedicatoriaTexts: { aramaic: string; pt: string }[] = [
  {
    aramaic: "ܗܢܐ ܦܘܪܫܢܐ ܐܬܝܠܕ ܡܢ ܣܘܟܝܐ ܫܪܝܪܐ ܕܢܚܘܐ ܚ̈ܝܐ ܘܝܘ̈ܠܦܢܐ ܕܝܫܘܥ",
    pt: "Este projeto nasceu do desejo sincero de apresentar a **vida**, os ensinamentos e o caminho de **Jesus**, de forma acessível, visual e fiel às Escrituras.",
  },
  {
    aramaic: "ܡܩܪܒ ܐܢܐ ܗܢܐ ܦܘܪܫܢܐ ܒܬܘܕܝܬܐ ܘܒܗܝܡܢܘܬܐ",
    pt: "Dedico, este projeto, com **GRATIDÃO** e **FÉ** á:",
  },
  {
    aramaic: "ܠܐܠܗܐ ܐܚܝܕ ܟܠ ܘܠܛܠܝܐ ܝܫܘܥ ܕܚܘܒܗ ܡܫܚܠܦ ܘܡܐܣܐ ܘܦܪܩ",
    pt: "**Deus** Todo-Poderoso e ao Menino **Jesus**, cujo amor transforma, cura e salva. Foi ele quem me sustentou nas dificuldades, guiou meus passos e fortaleceu o meu coração.",
  },
  {
    aramaic: "ܠܐܢܬܬܝ ܡܪܬܐ ܘܠܒܪܝ ܡܬܝ ܣܡ̈ܟܐ ܕܡܣܝܒܪܢܘܬܐ ܘܕܣܒܪܐ",
    pt: "À minha esposa **Marta** e ao meu filho **Matheus**, sustentáculo de perseverança e esperança.",
  },
  {
    aramaic: "ܠܚܒܪܬܝ ܐܠܝܬ ܘܠܒܥܠܗ ܠܝܒܠܕܘ ܐܝܟ ܐܝܕ̈ܐ ܕܚܘܣܝܐ ܘܦܪܢܣܐ ܕܐܠܗܐ",
    pt: "À minha amiga **Eliete** do 54, que sem medir esforços enfrentou caminhos difíceis para me socorrer em meu quinto AVC, e a seu marido **Livaldo**, instrumentos do cuidado e da providência divina.",
  },
  {
    aramaic: "ܠܫܪܒܬܐ ܕܠܝܡܘܣ ܘܠܪܓ̰ܢ ܘܠܡܪܝܣܐ ܕܗܘܘ ܣܡ̈ܟܐ ܘܚܘܣܝܐ ܒܐܘܪܚܝ",
    pt: "À família **Lemos**, minha mãe de consideração Sra. **Rejane**, e minha irmã **Marisa**, pessoas que **Deus** os levantaram em meu caminho como instrumentos de apoio, cuidado e constância.",
  },
  {
    aramaic: "ܘܠܐ ܐܛܥܐ ܠܐܪܠܝܢܕܘ ܦܪܢܣܝܣܩܘ ܕܠܝܡܘܣ ܓܒܪܐ ܟܐܢܐ ܘܚܟܝܡܐ",
    pt: "Sem, e jamais esquecer daquele que foi para mim um verdadeiro pai por consideração, homem íntegro, sábio e pescador o Sr. **Arlindo Francisco de Lemos** (*Arlindo de Jé*), cuja inspiração continua viva e presente em minha caminhada.",
  },
  {
    aramaic: "ܐܠܗܐ ܢܛܪ ܠܗ ܒܫܠܡܗ",
    pt: "**Que Deus o tenha em sua paz.**",
  },
  {
    aramaic: "ܡܘܕܐ ܐܢܐ ܐܦ ܠܐܝܠܝܢ ܕܠܐ ܝܕ̈ܥܐ ܠܥ̈ܝܢܝ ܕܐܠܗܐ ܣܡ ܐܢܘܢ ܒܐܘܪܚܝ",
    pt: "Agradeço ainda àqueles que, anônimos aos meus olhos, **Deus** os colocou em meu caminho: médicos, enfermeiras, técnicos, anestesistas, instrumentistas e a toda uma estrutura hospitalar por onde passei. Foi por meio dos quais o Senhor manifestou o seu amor e seu cuidado, para com os seus.",
  },
  {
    aramaic: "ܗܝܡܢܘ — ܐܠܗܐ ܗܘܐ!",
    pt: "**Acreditem, foi Deus!**",
  },
  {
    aramaic: "ܝܘܡܢܐ ܡܣܬܟܠ ܐܢܐ ܕܐܠܗܐ ܒܣܘܒܪܢܘܬܗ ܫܒܩ ܕܢܥܠܘܢ ܘܢܦܩܘܢ ܐܢܫ̈ܐ ܡܢ ܚ̈ܝܝܢ",
    pt: "Hoje compreendo que Deus, em sua __soberania__, permite que pessoas entrem e saiam de nossas vidas, é conforme o seu propósito, e não ao meu.",
  },
  {
    aramaic: "ܒܚ̈ܝܝ ܥܒܪܬ ܒܢܣ̈ܝܘܢܐ ܘܐܘ̈ܠܨܢܐ ܘܦܘܪ̈ܩܢܐ ܕܠܐ ܡܨܝܐ",
    pt: "Em minha vida passei por muitas provações, tribulações e livramentos impossíveis de superar. Humanamente dizendo, nem era para eu ainda estar aqui.",
  },
  {
    aramaic: "ܒܪܡ ܡܠܬܗ ܕܡܪܝܐ ܩܝܡܐ ܠܥܠܡ. ܐܡܪ ܕܟܠ ܗܠܝܢ ܢܥܒܪܘܢ ܘܢܩܝܡܢܝ",
    pt: "Mas a palavra do Senhor permanece firme. Disse que tudo isso passaria e falou ao meu coração, prometeu que iria me levantar e me abençoar.",
  },
  {
    aramaic: "ܟܠ ܝܘܡܐ ܚܕܬܐ ܗܘܐ ܣܗܕܘܬܐ ܚܝܬܐ ܕܚܘܒܗ ܒܝܫܘܥ ܡܫܝܚܐ",
    pt: "Assim, cada novo dia de minha vida se torna um __testemunho vivo__ do seu amor e do seu plano manifestado por meio de seu filho, **Jesus Cristo**.",
  },
  {
    aramaic: "ܠܐܠܗܐ ܟܠ ܐܝܩܪܐ ܘܟܠ ܬܫܒܘܚܬܐ ܗܫܐ ܘܠܥܠܡ ܥܠܡܝܢ. ܐܡܝܢ",
    pt: "A Deus, toda a honra e toda glória, agora e para sempre. Amém.",
  },
  {
    aramaic: "",
    pt: "{{signature}}Marcello Borbas{{/signature}}\n*Visionário Amante das escrituras sagradas*",
  },
];

function renderRich(text: string) {
  const tokens = text.split(/(\{\{signature\}\}[^]*?\{\{\/signature\}\}|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|\n)/g);
  return tokens.map((tok, i) => {
    if (tok === "\n") return <br key={i} />;
    if (tok.startsWith("{{signature}}") && tok.endsWith("{{/signature}}")) {
      const name = tok.slice("{{signature}}".length, -"{{/signature}}".length);
      return (
      <span
          key={i}
          style={{
            fontFamily: "'Yellowtail', 'Kaufmann BT', 'Kaufmann', 'Allura', cursive",
            fontSize: "2.2em",
            fontWeight: 400,
            color: "#3d2208",
            display: "inline-block",
            lineHeight: 1.1,
            letterSpacing: "0.01em",
          }}
        >
          {name}
        </span>
      );
    }
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return <strong key={i} style={{ color: "#5a2a05" }}>{tok.slice(2, -2)}</strong>;
    }
    if (tok.startsWith("__") && tok.endsWith("__")) {
      return <span key={i} style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>{tok.slice(2, -2)}</span>;
    }
    if (tok.startsWith("*") && tok.endsWith("*") && tok.length > 2) {
      return <em key={i}>{tok.slice(1, -1)}</em>;
    }
    return <span key={i}>{tok}</span>;
  });
}

interface DedicatoriaModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PROGRESS_KEY = "lemos_dedicatoria_progress_v1";

type Progress = { charIndex: number; scrollTop: number };

function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Progress;
    if (typeof p?.charIndex !== "number") return null;
    return p;
  } catch { return null; }
}

function saveProgress(p: Progress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}

export default function DedicatoriaModal({ open: externalOpen, onOpenChange }: DedicatoriaModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [translatedCount, setTranslatedCount] = useState(0);
  const [allAramaicVisible, setAllAramaicVisible] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [resumed, setResumed] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const charRef = useRef(0);
  const offsetRef = useRef(0);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const plainText = dedicatoriaTexts
    .map((t) => t.pt.replace(/\{\{signature\}\}|\{\{\/signature\}\}/g, "").replace(/\*\*|__|\*/g, ""))
    .join(". ");

  const startAnimation = useCallback(() => {
    setTranslatedCount(0);
    setAllAramaicVisible(false);

    setTimeout(() => setAllAramaicVisible(true), 300);

    const startDelay = 2600;
    dedicatoriaTexts.forEach((_, i) => {
      setTimeout(() => {
        setTranslatedCount((prev) => Math.max(prev, i + 1));
      }, startDelay + i * 1000);
    });
  }, []);

  const stopSpeak = useCallback(() => {
    try { window.speechSynthesis?.cancel(); } catch {}
    setSpeaking(false);
  }, []);

  const speakFrom = useCallback((from: number) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) { alert("Seu navegador não suporta leitura em voz alta."); return; }
      synth.cancel();
      const start = Math.max(0, Math.min(from, Math.max(0, plainText.length - 1)));
      offsetRef.current = start;
      charRef.current = start;
      setSpeaking(true);
      ensureVoicesLoaded(() => {
        const u = new SpeechSynthesisUtterance(plainText.slice(start));
        applySoftVoice(u);
        u.onboundary = (e) => {
          charRef.current = start + (e.charIndex || 0);
          saveProgress({ charIndex: charRef.current, scrollTop: scrollRef.current?.scrollTop ?? 0 });
        };
        u.onend = () => {
          setSpeaking(false);
          saveProgress({ charIndex: 0, scrollTop: 0 });
          awardOnce("dedicatoria:ouvida", DEDICATORIA_COINS, "Você assistiu e ouviu a Dedicatória!");
        };
        u.onerror = () => setSpeaking(false);
        synth.speak(u);
      });
    } catch {
      setSpeaking(false);
    }
  }, [plainText]);


  const toggleListen = () => {
    if (speaking) {
      saveProgress({ charIndex: charRef.current, scrollTop: scrollRef.current?.scrollTop ?? 0 });
      stopSpeak();
      return;
    }
    speakFrom(charRef.current);
  };

  // Ao abrir: retoma do último ponto salvo (rolagem + leitura automática).
  useEffect(() => {
    if (!open) return;
    const prog = loadProgress();
    if (prog && prog.charIndex > 0) {
      setResumed(true);
      setAllAramaicVisible(true);
      setTranslatedCount(dedicatoriaTexts.length);
      charRef.current = prog.charIndex;
      const t = setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = prog.scrollTop || 0;
        speakFrom(prog.charIndex);
      }, 400);
      return () => clearTimeout(t);
    }
    setResumed(false);
    charRef.current = 0;
    startAnimation();
  }, [open, startAnimation, speakFrom]);

  useEffect(() => {
    if (!open) stopSpeak();
    return () => stopSpeak();
  }, [open, stopSpeak]);

  const handleClose = () => {
    saveProgress({ charIndex: speaking ? charRef.current : charRef.current, scrollTop: scrollRef.current?.scrollTop ?? 0 });
    stopSpeak();
    if (isControlled) onOpenChange?.(false);
    else setInternalOpen(false);
    setTranslatedCount(0);
    setAllAramaicVisible(false);
  };

  const restartFromStart = () => {
    charRef.current = 0;
    saveProgress({ charIndex: 0, scrollTop: 0 });
    setResumed(false);
    stopSpeak();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    startAnimation();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[90vh]"
            style={{ animation: "scrollOpen 0.9s ease-out forwards" }}
          >
            <div
              className="relative"
              style={{
                backgroundImage: `url(${dedicatoriaBg})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.55))",
              }}
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform z-20"
                style={{ background: "#6b3a0a", color: "#f7e9c9", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}
                aria-label="Fechar"
              >
                ✕
              </button>
              <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                <button
                  onClick={toggleListen}
                  className="h-9 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold hover:scale-105 transition-transform"
                  style={{ background: speaking ? "#8b2b2b" : "#6b3a0a", color: "#f7e9c9", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}
                  aria-label={speaking ? "Parar leitura" : charRef.current > 0 ? "Continuar leitura" : "Ouvir dedicatória"}
                  title={speaking ? "Parar leitura" : charRef.current > 0 ? "Continuar de onde parou" : "Ouvir dedicatória"}
                >
                  {speaking ? "⏹️ Parar" : charRef.current > 0 ? "▶️ Continuar" : "🔊 Ouvir"}
                </button>
                {resumed && (
                  <button
                    onClick={restartFromStart}
                    className="h-9 px-3 rounded-full text-xs font-bold hover:scale-105 transition-transform"
                    style={{ background: "#8a6a2a", color: "#f7e9c9", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}
                    title="Recomeçar do início"
                  >
                    ↺ Início
                  </button>
                )}
              </div>

              <div
                ref={scrollRef}
                className="overflow-y-auto relative"
                style={{
                  maxHeight: "78vh",
                  padding: "12% 10% 12% 10%",
                }}
              >
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h2
                      className="text-3xl sm:text-4xl font-bold mb-1"
                      style={{ color: "#5a2a05", fontFamily: "'EB Garamond', serif", letterSpacing: "0.05em" }}
                    >
                      ✦ ܡܩܪܒܢܘܬܐ ✦
                    </h2>
                    <p className="text-base italic tracking-wider" style={{ color: "#7a4a10", fontFamily: "'EB Garamond', serif" }}>
                      Dedicatória
                    </p>
                    <div
                      className="mx-auto mt-3 h-px w-2/3"
                      style={{ background: "linear-gradient(90deg, transparent, #8b5a2b, transparent)" }}
                    />
                  </div>

                  <div className="space-y-5">
                    {dedicatoriaTexts.map((item, i) => {
                      const isTranslated = i < translatedCount;

                      return (
                        <div
                          key={i}
                          className="transition-all duration-700 relative"
                          style={{
                            opacity: allAramaicVisible ? 1 : 0,
                            transform: allAramaicVisible ? "translateY(0)" : "translateY(15px)",
                            transitionDelay: `${i * 80}ms`,
                          }}
                        >
                          {item.aramaic && (
                            <p
                              className="text-right text-xl sm:text-2xl leading-relaxed transition-all duration-1000 font-bold"
                              style={{
                                color: "#5a2a05",
                                fontFamily: "'Noto Serif Hebrew', 'Times New Roman', serif",
                                direction: "rtl",
                                opacity: isTranslated ? 0 : 0.95,
                                maxHeight: isTranslated ? 0 : "200px",
                                overflow: "hidden",
                                marginBottom: isTranslated ? 0 : "6px",
                                textShadow: "0 1px 0 rgba(255,235,200,0.4)",
                              }}
                            >
                              {item.aramaic}
                            </p>
                          )}

                          <div
                            className="text-lg sm:text-xl leading-[1.7] whitespace-pre-line transition-all duration-1000 overflow-hidden"
                            style={{
                              color: "#3d2208",
                              fontFamily: "'Calibri', 'Carlito', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                              fontWeight: 500,
                              opacity: isTranslated ? 1 : 0,
                              maxHeight: isTranslated ? "800px" : 0,
                              filter: isTranslated ? "none" : "blur(8px)",
                              textAlign: "justify",
                            }}
                          >
                            <p>{renderRich(item.pt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {translatedCount >= dedicatoriaTexts.length && (
                    <div className="text-center mt-6 text-2xl animate-fade-in">
                      ✝️ 🕊️ ✝️
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&family=Allura&family=Pinyon+Script&family=Yellowtail&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
        @keyframes scrollOpen {
          0% { transform: scaleY(0.01) scaleX(0.6); opacity: 0; }
          40% { transform: scaleY(0.4) scaleX(0.85); opacity: 0.7; }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
