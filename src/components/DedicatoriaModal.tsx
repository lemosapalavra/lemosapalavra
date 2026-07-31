import { useState, useEffect, useCallback, useRef } from "react";
import dedicatoriaBg from "@/assets/pergaminho.png";
import { speakSoftly } from "@/lib/speak";
import { awardOnce } from "@/hooks/useCoins";
import { DEDICATORIA_COINS } from "@/data/coinRewards";


const dedicatoriaTexts: { aramaic: string; pt: string }[] = [
  {
    aramaic: "ܗܢܐ ܥܒܕܐ ܐܬܝܠܕ ܡܢ ܣܘܟܝܐ ܫܪܝܪܐ ܕܢܚܘܐ ܚ̈ܝܐ ܘܝܘ̈ܠܦܢܐ ܕܝܫܘܥ",
    pt: "Esta obra nasceu do sincero desejo de apresentar a vida e os ensinamentos daquele que é o Caminho, a Verdade e a Vida, o mesmo ontem, hoje e para sempre: nosso **Senhor Jesus Cristo**.",
  },
  {
    aramaic: "ܡܩܪܒ ܐܢܐ ܗܢܐ ܥܒܕܐ ܠܐܠܗܐ ܐܚܝܕ ܟܠ ܘܠܝܫܘܥ ܡܫܝܚܐ ܡܪܝ ܘܦܪܘܩܝ",
    pt: "Dedico esta obra a **Deus Todo-Poderoso** e a **Jesus Cristo**, meu Senhor e Salvador, cuja graça, misericórdia e amor têm sustentado minha vida.",
  },
  {
    aramaic: "ܒܪܡ ܐܠܗܐ ܒܪ̈ܚܡܘܗܝ ܟܬܒ ܠܝ ܩܦܠܐܘܢ ܚܕܬܐ",
    pt: "Após sobreviver a cinco AVCs, aos olhos humanos, minha história já poderia ter chegado ao fim.\n\n**Mas Deus, em Sua infinita misericórdia, escreveu um novo capítulo**, transformando minha vida em um testemunho vivo de Sua fidelidade, de Seu amor e de Seu poder.",
  },
  {
    aramaic: "ܠܐܢܬܬܝ ܡܪܬܐ ܘܠܒܪܝ ܡܬܝ ܬܘܕܝܬܐ ܕܠܥܠܡ",
    pt: "Minha eterna gratidão à minha esposa, **Marta**, companheira; ao meu filho, **Matheus**, o perseverante; aos profissionais da saúde que participaram da minha recuperação; à Sra. **Eliete** e ao Sr. **Livaldo**, do 54, instrumentos do cuidado e da providência divina. e à memória do Sr. **Arlindo** Francisco de Lemos (*Arlindo de Jé*).",
  },
  {
    aramaic: "ܝܘܡܢܐ ܡܣܬܟܠ ܐܢܐ ܕܐܠܗܐ ܡܕܒܪ ܟܠ ܐܘܪܚܐ ܕܚ̈ܝܝܢ",
    pt: "Hoje compreendo que **Deus** conduz cada etapa de nossa história e que nada escapa à Sua __soberania__.",
  },
  {
    aramaic: "ܨܒܝܢܝ ܕܢܡܛܐ ܗܢܐ ܥܒܕܐ ܠܛܠ̈ܝܐ ܘܠܥܠܝ̈ܡܐ ܘܠܫܪ̈ܒܬܐ",
    pt: "Oro para que esta obra alcance crianças, jovens e famílias, conduzindo cada pessoa a conhecer mais profundamente nosso **Senhor Jesus Cristo** e a descobrir que Sua Palavra continua viva, transformando vidas, restaurando corações e renovando a esperança.",
  },
  {
    aramaic: "ܘܐܢ ܚܕ ܢܦܫܐ ܬܬܩܪܒ ܠܡܫܝܚܐ ܟܠܗ ܥܡܠܐ ܫܘܐ ܗܘܐ",
    pt: "Se, por meio desta obra, uma única vida se aproximar de **Jesus Cristo**, todo o caminho percorrido, todas as provações enfrentadas e todo o esforço dedicado terão valido a pena.",
  },
  {
    aramaic: "ܠܐܠܗܐ ܫܘܒܚܐ ܘܐܝܩܪܐ ܘܬܫܒܘܚܬܐ ܠܥܠܡ ܥܠܡܝܢ ܐܡܝܢ",
    pt: "**A Deus sejam toda a honra, toda a glória e todo o louvor, pelos séculos dos séculos. Amém.**",
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
      if (!window.speechSynthesis) { alert("Seu navegador não suporta leitura em voz alta."); return; }
      const start = Math.max(0, Math.min(from, Math.max(0, plainText.length - 1)));
      offsetRef.current = start;
      charRef.current = start;
      setSpeaking(true);
      speakSoftly(plainText, {
        from: start,
        onProgress: (idx) => {
          charRef.current = idx;
          saveProgress({ charIndex: idx, scrollTop: scrollRef.current?.scrollTop ?? 0 });
        },
        onEnd: () => {
          setSpeaking(false);
          saveProgress({ charIndex: 0, scrollTop: 0 });
          awardOnce("dedicatoria:ouvida", DEDICATORIA_COINS, "Você assistiu e ouviu a Dedicatória!");
        },
        onError: () => setSpeaking(false),
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
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-24 sm:pt-28 overflow-y-auto"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[85vh]"
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
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
                <button
                  onClick={toggleListen}
                  className="h-11 px-5 rounded-full flex items-center gap-2 text-sm font-extrabold hover:scale-110 transition-transform ring-2 ring-white/70"
                  style={{ background: speaking ? "#8b2b2b" : "#1e5bd6", color: "#ffffff", boxShadow: "0 6px 18px rgba(0,0,0,0.45)" }}
                  aria-label={speaking ? "Parar leitura" : charRef.current > 0 ? "Continuar leitura" : "Ouvir dedicatória"}
                  title={speaking ? "Parar leitura" : charRef.current > 0 ? "Continuar de onde parou" : "Ouvir dedicatória (+5 🪙)"}
                >
                  {speaking ? "⏹️ Parar" : charRef.current > 0 ? "▶️ Continuar" : "🔊 Ouvir  🪙 +5"}
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
