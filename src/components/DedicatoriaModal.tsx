import { useState, useEffect, useCallback } from "react";
import dedicatoriaBg from "@/assets/dedicatoria-bg.png";

// Each entry: aramaic line + Portuguese with **bold** markers preserved from the original PDF.
const dedicatoriaTexts: { aramaic: string; pt: string }[] = [
  {
    aramaic: "ܗܢܐ ܦܘܪܫܢܐ ܐܬܝܠܕ ܡܢ ܣܘܟܝܐ ܫܪܝܪܐ ܕܢܚܘܐ ܚ̈ܝܐ ܘܝܘ̈ܠܦܢܐ ܕܝܫܘܥ",
    pt: "Este projeto nasceu do desejo sincero de apresentar a **vida**, os ensinamentos e o caminho de **Jesus**, de forma acessível, visual e fiel às Escrituras.",
  },
  {
    aramaic: "ܡܩܪܒ ܐܢܐ ܗܢܐ ܦܘܪܫܢܐ ܒܬܘܕܝܬܐ ܘܒܗܝܡܢܘܬܐ",
    pt: "Dedico, este projeto, com **GRATIDÃO** e **FÉ** à:",
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
    aramaic: "ܠܚܒܪܬܝ ܐܠܝܐܬ ܕܚܡܫܝܢ ܘܐܪܒܥ ܘܠܒܥܠܗ ܠܝܒܠܕܘ",
    pt: "À minha amiga **Eliete** do 54, que sem medir esforços enfrentou caminhos difíceis para me socorrer em meu quinto AVC, e a seu marido **Livaldo**, instrumentos do cuidado e da providência divina.",
  },
  {
    aramaic: "ܠܫܪܒܬܐ ܕܠܝܡܘܣ ܘܐܡܝ ܒܐܝܩܪܐ ܡܪܬ ܪܝܓ̰ܐܢ ܘܚܬܝ ܡܪܝܣܐ",
    pt: "À família **Lemos**, minha mãe de consideração Sra. **Rejane**, e minha irmã **Marisa**, são pessoas que **Deus** os levantou em meu caminho como instrumentos de apoio, cuidado e constância.",
  },
  {
    aramaic: "ܘܠܐ ܛܥܐ ܐܢܐ ܠܗܘ ܕܗܘܐ ܠܝ ܐܒܐ ܫܪܝܪܐ ܡܪܝ ܐܪܠܝܢܕܘ ܦܪܢܣܝܣܩܘ ܕܠܝܡܘܣ",
    pt: "Não poderia esquecer daquele que foi para mim um verdadeiro pai por consideração, homem íntegro, sábio e pescador o Sr. **Arlindo Francisco de Lemos** (*Arlindo de Jé*), cuja inspiração continua viva e presente em minha caminhada.",
  },
  {
    aramaic: "ܐܠܗܐ ܢܛܪ ܠܗ ܒܫܠܡܗ",
    pt: "Que Deus o tenha em sua paz.",
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
    aramaic: "ܝܘܡܢܐ ܡܣܬܟܠ ܐܢܐ ܕܐܠܗܐ ܒܡܪܘܬܗ ܡܫܠܛ ܥܠ ܟܠ",
    pt: "Hoje compreendo que **Deus**, em sua __soberania__, permite que pessoas entrem e saiam de nossas vidas, é conforme o seu propósito, e não ao meu.",
  },
  {
    aramaic: "ܒܚ̈ܝܝ ܥܒܪܬ ܒܢܣ̈ܝܘܢܐ ܘܐܘ̈ܠܨܢܐ ܘܦܘܪ̈ܩܢܐ ܕܠܐ ܡܨܝܐ",
    pt: "Em minha vida passei por muitas provações, tribulações e livramentos impossíveis de superar. Humanamente dizendo, nem era para eu ainda estar aqui.",
  },
  {
    aramaic: "ܒܪܡ ܡܠܬܗ ܕܡܪܝܐ ܩܝܡܐ ܠܥܠܡ. ܐܡܪ ܕܟܠ ܗܠܝܢ ܢܥܒܪܘܢ",
    pt: "Mas a palavra do Senhor permanece firme. Disse que tudo isso passaria e falou ao meu coração, prometeu que iria me levantar e me abençoar.",
  },
  {
    aramaic: "ܟܠ ܝܘܡܐ ܚܕܬܐ ܗܘܐ ܣܗܕܘܬܐ ܚܝܬܐ ܕܚܘܒܗ ܒܝܫܘܥ ܡܫܝܚܐ",
    pt: "Assim, cada novo dia de minha vida se torna um __testemunho vivo__ do seu amor e do seu plano manifestado por meio de seu filho, Jesus Cristo.",
  },
  {
    aramaic: "ܠܐܠܗܐ ܟܠ ܐܝܩܪܐ ܘܟܠ ܬܫܒܘܚܬܐ ܗܫܐ ܘܠܥܠܡ ܥܠܡܝܢ. ܐܡܝܢ.",
    pt: "A Deus, toda a honra e toda glória, agora e para sempre. Amém.",
  },
  {
    aramaic: "",
    pt: "**Marcello Borbas**\n*Visionário Amante das escrituras sagradas*",
  },
];

// Render Portuguese text supporting **bold**, *italic*, and __underline__ markers
function renderRich(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|\n)/g);
  return tokens.map((tok, i) => {
    if (tok === "\n") return <br key={i} />;
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
            {/* Parchment scroll with rolled edges */}
            <div className="relative">
              {/* Top rolled edge */}
              <div
                className="h-6 rounded-t-full mx-2"
                style={{
                  background: "linear-gradient(180deg, #8b5a2b 0%, #b8860b 50%, #6b3a0a 100%)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)",
                }}
              />
              <div
                className="overflow-y-auto max-h-[78vh] p-6 sm:p-10 relative"
                style={{
                  backgroundColor: "#ecd7a8",
                  backgroundImage: `url(${dedicatoriaBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  boxShadow:
                    "inset 0 0 80px rgba(139,90,43,0.45), inset 0 0 12px rgba(80,40,10,0.5)",
                  borderLeft: "3px solid #8b5a2b",
                  borderRight: "3px solid #8b5a2b",
                }}
              >
                {/* Faint stains for parchment realism */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 15% 20%, rgba(120,60,10,0.12), transparent 25%), radial-gradient(circle at 85% 70%, rgba(80,40,10,0.10), transparent 22%), radial-gradient(circle at 50% 90%, rgba(120,70,20,0.10), transparent 30%)",
                  }}
                />

                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform z-20"
                  style={{ background: "#6b3a0a", color: "#f7e9c9", boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}
                  aria-label="Fechar"
                >
                  ✕
                </button>

                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h2
                      className="text-2xl sm:text-3xl font-bold mb-1"
                      style={{ color: "#5a2a05", fontFamily: "serif", letterSpacing: "0.05em" }}
                    >
                      ✦ ܡܩܪܒܢܘܬܐ ✦
                    </h2>
                    <p className="text-xs italic tracking-wider" style={{ color: "#7a4a10" }}>
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
                              className="text-right text-base sm:text-lg leading-relaxed transition-all duration-1000 font-bold"
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
                            className="text-sm sm:text-base leading-relaxed whitespace-pre-line transition-all duration-1000 overflow-hidden"
                            style={{
                              color: "#3d2208",
                              fontFamily: "'Cormorant Garamond', 'Garamond', serif",
                              opacity: isTranslated ? 1 : 0,
                              maxHeight: isTranslated ? "600px" : 0,
                              filter: isTranslated ? "none" : "blur(8px)",
                              textAlign: "justify",
                            }}
                          >
                            <p style={{ overflow: "hidden" }}>
                              {renderRich(item.pt)}
                            </p>
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
              {/* Bottom rolled edge */}
              <div
                className="h-6 rounded-b-full mx-2"
                style={{
                  background: "linear-gradient(0deg, #8b5a2b 0%, #b8860b 50%, #6b3a0a 100%)",
                  boxShadow: "0 -4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Cormorant+Garamond:wght@400;600;700&display=swap');
        @keyframes scrollOpen {
          0% { transform: scaleY(0.01) scaleX(0.6); opacity: 0; }
          40% { transform: scaleY(0.4) scaleX(0.85); opacity: 0.7; }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
