import { useState, useEffect, useCallback, useRef } from "react";
import dedicatoriaBg from "@/assets/pergaminho.png";
import { awardOnce } from "@/hooks/useCoins";
import { DEDICATORIA_COINS } from "@/data/coinRewards";


const dedicatoriaTexts: { aramaic: string; pt: string }[] = [
  {
    aramaic: "ܗܢܐ ܥܒܕܐ ܐܬܝܠܕ ܡܢ ܣܘܟܝܐ ܫܪܝܪܐ ܕܢܚܘܐ ܚ̈ܝܐ ܘܝܘ̈ܠܦܢܐ ܕܝܫܘܥ",
    pt: "Esta obra nasceu do sincero desejo de apresentar a vida e os ensinamentos daquele que é o Caminho, a Verdade e a Vida, o mesmo ontem, hoje e sempre: nosso **Senhor Jesus Cristo**.",
  },
  {
    aramaic: "ܡܩܪܒ ܐܢܐ ܗܢܐ ܥܒܕܐ ܠܐܠܗܐ ܐܚܝܕ ܟܠ ܘܠܝܫܘܥ ܡܫܝܚܐ ܡܪܝ ܘܦܪܘܩܝ",
    pt: "Dedico esta obra a **Deus Todo-Poderoso** e a **Jesus Cristo**, meu Senhor e Salvador, cuja graça, misericórdia e amor têm sustentado minha vida.",
  },
  {
    aramaic: "ܒܪܡ ܐܠܗܐ ܒܪ̈ܚܡܘܗܝ ܟܬܒ ܠܝ ܩܦܠܐܘܢ ܚܕܬܐ",
    pt: "Após sobreviver a cinco AVCs, aos olhos humanos, minha história já poderia ter chegado ao fim.\n\n**Mas Deus, em Sua misericórdia, escreveu um novo capítulo**, transformando minha vida em um testemunho vivo de Sua fidelidade, de Seu amor e de Seu poder.",
  },
  {
    aramaic: "ܠܐܢܬܬܝ ܡܪܬܐ ܘܠܒܪܝ ܡܬܝ ܬܘܕܝܬܐ ܕܠܥܠܡ",
    pt: "Minha eterna gratidão à minha esposa, **Marta**, companheira;\nao meu filho, **Matheus**, o perseverante; e aos profissionais da saúde que participaram da minha recuperação;\nà Sra. **Eliete** e ao Sr. **Livaldo**, do 54, instrumentos de cuidado e providência;\nà memória do Sr. **Arlindo Francisco de Lemos** (*Arlindo de Jé*).",
  },
  {
    aramaic: "ܝܘܡܢܐ ܡܣܬܟܠ ܐܢܐ ܕܐܠܗܐ ܡܕܒܪ ܟܠ ܐܘܪܚܐ ܕܚ̈ܝܝܢ",
    pt: "Hoje compreendo que **Deus** conduz cada etapa de nossa história e que nada escapa à Sua soberania.",
  },
  {
    aramaic: "ܨܒܝܢܝ ܕܢܡܛܐ ܗܢܐ ܥܒܕܐ ܠܛܠ̈ܝܐ ܘܠܥܠܝ̈ܡܐ ܘܠܫܪ̈ܒܬܐ",
    pt: "Oro para que esta obra alcance crianças, jovens e famílias, conduzindo cada pessoa a conhecer mais profundamente a nosso Senhor **Jesus Cristo**, e a descobrir que Sua Palavra continua viva, transformando vidas, restaurando e renovando a esperança.",
  },
  {
    aramaic: "ܘܐܢ ܚܕ ܢܦܫܐ ܬܬܩܪܒ ܠܡܫܝܚܐ ܟܠܗ ܥܡܠܐ ܫܘܐ ܗܘܐ",
    pt: "Através desta obra, se uma única vida se aproximar de nosso **Jesus Cristo**, todo o caminho percorrido, todas as provações enfrentadas e todo o esforço dedicado terão valido a pena.",
  },
  {
    aramaic: "ܠܐܠܗܐ ܫܘܒܚܐ ܘܐܝܩܪܐ ܘܬܫܒܘܚܬܐ ܠܥܠܡ ܥܠܡܝܢ ܐܡܝܢ",
    pt: "**A Deus toda a honra, toda a glória e todo o louvor, pelos séculos dos séculos. Amém.**",
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

export default function DedicatoriaModal({ open: externalOpen, onOpenChange }: DedicatoriaModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [translatedCount, setTranslatedCount] = useState(0);
  const [allAramaicVisible, setAllAramaicVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

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

  useEffect(() => {
    if (!open) return;
    startAnimation();
  }, [open, startAnimation]);

  useEffect(() => {
    if (translatedCount >= dedicatoriaTexts.length) {
      awardOnce("dedicatoria:lida", DEDICATORIA_COINS, "Você leu a Dedicatória!");
    }
  }, [translatedCount]);

  const handleClose = () => {
    if (isControlled) onOpenChange?.(false);
    else setInternalOpen(false);
    setTranslatedCount(0);
    setAllAramaicVisible(false);
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
