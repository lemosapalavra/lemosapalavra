import { useState, useEffect, useCallback } from "react";
import dedicatoriaBg from "@/assets/dedicatoria-bg.png";

// Each entry: aramaic line + Portuguese with **bold** markers preserved from the original PDF.
// Use {{signature}} marker so we can render the name with a special font (Kaufmann BT).
const dedicatoriaTexts: { aramaic: string; pt: string }[] = [
  {
    aramaic: "ܗܢܐ ܦܘܪܫܢܐ ܐܬܝܠܕ ܡܢ ܣܘܟܝܐ ܫܪܝܪܐ ܕܢܚܘܐ ܚ̈ܝܐ ܘܝܘ̈ܠܦܢܐ ܕܝܫܘܥ",
    pt: "Este é um projeto que nasceu do desejo sincero de apresentar a vida os ensinamentos e o caminho de **Jesus** de forma acessível visual e fiel às Escrituras.",
  },
  {
    aramaic: "ܡܩܪܒ ܐܢܐ ܗܢܐ ܦܘܪܫܢܐ ܒܬܘܕܝܬܐ ܘܒܗܝܡܢܘܬܐ",
    pt: "Dedico este projeto com **GRATIDÃO** e **FÉ** á:",
  },
  {
    aramaic: "ܠܐܠܗܐ ܐܚܝܕ ܟܠ ܘܠܛܠܝܐ ܝܫܘܥ ܕܚܘܒܗ ܡܫܚܠܦ ܘܡܐܣܐ ܘܦܪܩ",
    pt: "**Deus** Todo-Poderoso e ao Menino **Jesus**, cujo amor transforma, cura e salva. Foi ele quem me sustentou nas dificuldades, guiou meus passos e fortaleceu o meu coração.",
  },
  {
    aramaic: "ܠܐܢܬܬܝ ܡܪܬܐ ܘܠܒܪܝ ܡܬܝ ܣܡ̈ܟܐ ܕܡܣܝܒܪܢܘܬܐ ܘܕܣܒܪܐ",
    pt: "À minha esposa **Marta** e ao meu filho **Matheus** sustentáculo de perseverança e esperança.",
  },
  {
    aramaic: "ܠܚܒܪܬܝ ܐܠܝܐܬ ܕܚܡܫܝܢ ܘܐܪܒܥ ܘܠܒܥܠܗ ܠܝܒܠܕܘ",
    pt: "À minha amiga **Eliete** do 54, que sem medir esforços enfrentou caminhos difíceis para me socorrer em meu quinto AVC e a seu marido **Livaldo**, instrumentos do cuidado e da providência divina.",
  },
  {
    aramaic: "ܠܫܪܒܬܐ ܕܠܝܡܘܣ ܘܐܡܝ ܒܐܝܩܪܐ ܡܪܬ ܪܝܓ̰ܐܢ ܘܚܬܝ ܡܪܝܣܐ",
    pt: "À família **Lemos**, minha mãe de consideração Sra. **Maria Rejane**, e minha irmã **Marisa** pessoas que **Deus** levantou em meu caminho como instrumentos de apoio cuidado e de constância.",
  },
  {
    aramaic: "ܘܠܐ ܛܥܐ ܐܢܐ ܠܗܘ ܕܗܘܐ ܠܝ ܐܒܐ ܫܪܝܪܐ ܡܪܝ ܐܪܠܝܢܕܘ ܦܪܢܣܝܣܩܘ ܕܠܝܡܘܣ",
    pt: "Não poderia esquecer daquele que foi para mim um verdadeiro pai por consideração, homem íntegro, sábio e pescador Sr. **Arlindo Francisco de Lemos** (*Arlindo de Jé*) cuja inspiração continua viva e presente em minha caminhada.",
  },
  {
    aramaic: "ܐܠܗܐ ܢܛܪ ܠܗ ܒܫܠܡܗ",
    pt: "Que **Deus** o tenha em sua paz.",
  },
  {
    aramaic: "ܡܘܕܐ ܐܢܐ ܐܦ ܠܐܝܠܝܢ ܕܠܐ ܝܕ̈ܥܐ ܠܥ̈ܝܢܝ ܕܐܠܗܐ ܣܡ ܐܢܘܢ ܒܐܘܪܚܝ",
    pt: "Agradeço ainda àqueles que, anônimos aos meus olhos **Deus** os colocou em meu caminho: médicos, enfermeiras, técnicos, anestesistas, instrumentistas e a toda uma estrutura hospitalar por onde passei. Foi por meio dos quais o Senhor manifestou seu amor e seu cuidado, para com os seus.",
  },
  {
    aramaic: "ܗܝܡܢܘ — ܐܠܗܐ ܗܘܐ!",
    pt: "**Acreditem, foi Deus!**",
  },
  {
    aramaic: "ܝܘܡܢܐ ܡܣܬܟܠ ܐܢܐ ܕܐܠܗܐ ܒܡܪܘܬܗ ܡܫܠܛ ܥܠ ܟܠ",
    pt: "Hoje compreendo que **Deus**, em sua **Soberania** permite que pessoas entrem e saiam de nossas vidas, é conforme o seu propósito, e não ao meu.",
  },
  {
    aramaic: "ܒܚ̈ܝܝ ܥܒܪܬ ܒܢܣ̈ܝܘܢܐ ܘܐܘ̈ܠܨܢܐ ܘܦܘܪ̈ܩܢܐ ܕܠܐ ܡܨܝܐ",
    pt: "Em minha vida passei por muitas provações tribulações e livramentos impossíveis de superar. Humanamente dizendo: nem era para eu ainda estar aqui. Quem andou comigo sabe bem disso.",
  },
  {
    aramaic: "ܒܪܡ ܡܠܬܗ ܕܡܪܝܐ ܩܝܡܐ ܠܥܠܡ. ܐܡܪ ܕܟܠ ܗܠܝܢ ܢܥܒܪܘܢ",
    pt: "Mas a palavra do Senhor permanece firme. Disse que tudo isso passaria e falou ao meu coração, prometeu que iria me levantar e me abençoar.",
  },
  {
    aramaic: "ܟܠ ܝܘܡܐ ܚܕܬܐ ܗܘܐ ܣܗܕܘܬܐ ܚܝܬܐ ܕܚܘܒܗ ܒܝܫܘܥ ܡܫܝܚܐ",
    pt: "Hoje, a cada novo dia de minha vida se torna um **testemunho vivo** do amor e do seu plano manifestado por meio de seu filho, **Jesus Cristo**.",
  },
  {
    aramaic: "ܠܐܠܗܐ ܟܠ ܐܝܩܪܐ ܘܟܠ ܬܫܒܘܚܬܐ ܗܫܐ ܘܠܥܠܡ ܥܠܡܝܢ. ܐܡܝܢ.",
    pt: "A **Deus**, toda a honra e toda glória, agora e para sempre. **Amém.**",
  },
  {
    aramaic: "",
    pt: "{{signature}}Marcello Borbas{{/signature}}\n*Visionário Amante das escrituras sagradas*",
  },
];

// Render Portuguese text supporting **bold**, *italic*, __underline__, and {{signature}}...{{/signature}} markers
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
            fontFamily: "'Kaufmann BT', 'Kaufmann', 'Allura', 'Pinyon Script', cursive",
            fontSize: "1.9em",
            color: "#5a2a05",
            display: "inline-block",
            lineHeight: 1.2,
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

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const startAnimation = useCallback(() => {
    setTranslatedCount(0);
    setAllAramaicVisible(false);

    setTimeout(() => setAllAramaicVisible(true), 300);

    const startDelay = 3000;
    dedicatoriaTexts.forEach((_, i) => {
      setTimeout(() => {
        setTranslatedCount(prev => Math.max(prev, i + 1));
      }, startDelay + i * 1200);
    });
  }, []);

  useEffect(() => {
    if (open) {
      startAnimation();
    }
  }, [open, startAnimation]);

  const handleClose = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }
    setTranslatedCount(0);
    setAllAramaicVisible(false);
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
            {/* Parchment scroll background (image already includes rolled edges) */}
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

              {/* Inner content area sized to fit within the parchment (excluding rolled top/bottom of the image ~10% each) */}
              <div
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
                              fontFamily: "'EB Garamond', 'Cormorant Garamond', 'Book Antiqua', Garamond, serif",
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
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:wght@400;600;700&display=swap');
        @keyframes scrollOpen {
          0% { transform: scaleY(0.01) scaleX(0.6); opacity: 0; }
          40% { transform: scaleY(0.4) scaleX(0.85); opacity: 0.7; }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
