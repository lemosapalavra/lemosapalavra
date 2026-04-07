import { useState, useEffect, useCallback } from "react";

const dedicatoriaTexts = [
  {
    aramaic: "ܗܢܐ ܦܘܪܫܢܐ ܐܬܝܠܕ ܡܢ ܣܘܟܝܐ ܫܪܝܪܐ ܕܢܚܘܐ ܚ̈ܝܐ ܘܝܘ̈ܠܦܢܐ ܕܝܫܘܥ",
    pt: "Este projeto nasceu do desejo sincero de apresentar a vida, os ensinamentos e o caminho de Jesus de forma acessível, visual e fiel às Escrituras.",
  },
  {
    aramaic: "ܡܩܪܒ ܐܢܐ ܗܢܐ ܦܘܪܫܢܐ ܒܬܘܕܝܬܐ ܘܒܗܝܡܢܘܬܐ ܠܐܠܗܐ ܘܠܝܫܘܥ",
    pt: "Dedico, este projeto, com GRATIDÃO e FÉ a Deus Todo-Poderoso e ao Menino Jesus, cujo amor transforma, cura e salva.",
  },
  {
    aramaic: "ܗܘ ܕܣܡܟܢܝ ܒܥܩ̈ܬܐ ܘܕܒܪ ܦܣ̈ܥܬܝ ܘܚܝܠ ܠܒܝ",
    pt: "Foi Ele quem me sustentou nas dificuldades, guiou meus passos e fortaleceu o meu coração.",
  },
  {
    aramaic: "ܠܐܢܬܬܝ ܡܪܬܐ ܘܠܒܪܝ ܡܬܝ ܣܡ̈ܟܐ ܕܡܣܝܒܪܢܘܬܐ",
    pt: "À minha esposa Marta e ao meu filho Matheus, sustentáculo de perseverança e esperança.",
  },
  {
    aramaic: "ܠܚܒܪܬܝ ܐܠܝܐܬ ܕܚܡܫܝܢ ܘܐܪܒܥ ܕܠܐ ܟܠܬ ܚܝ̈ܠܐ",
    pt: "À minha amiga Eliete do 54, que sem medir esforços enfrentou caminhos difíceis para me socorrer em meu quinto AVC, e a seu marido Livaldo, instrumentos do cuidado e da providência divina.",
  },
  {
    aramaic: "ܠܫܪܒܬܐ ܕܠܝܡܘܣ ܘܐܡܝ ܒܐܝܩܪܐ ܡܪܬ ܪܝܓ̰ܐܢ ܘܚܬܝ ܡܪܝܣܐ",
    pt: "À família Lemos, minha mãe de consideração Sra. Rejane, e minha irmã Marisa, pessoas que Deus levantou em meu caminho como instrumentos de apoio, cuidado e constância.",
  },
  {
    aramaic: "ܘܠܐ ܛܥܐ ܐܢܐ ܠܗܘ ܕܗܘܐ ܠܝ ܐܒܐ ܫܪܝܪܐ ܡܪܝ ܐܪܠܝܢܕܘ",
    pt: "Sem jamais esquecer daquele que foi para mim um verdadeiro pai por consideração, homem íntegro, sábio e pescador: Sr. Arlindo Francisco de Lemos (Arlindo de Jé), cuja inspiração continua viva e presente em minha caminhada.",
  },
  {
    aramaic: "ܐܠܗܐ ܢܛܪ ܠܗ ܒܫܠܡܗ",
    pt: "Que Deus o tenha em sua paz.",
  },
  {
    aramaic: "ܡܘܕܐ ܐܢܐ ܐܦ ܠܐܝܠܝܢ ܕܠܐ ܝܕ̈ܥܐ ܠܥ̈ܝܢܝ ܐܣ̈ܘܬܐ ܘܡܫܡ̈ܫܢܬܐ",
    pt: "Agradeço ainda àqueles que, anônimos aos meus olhos, Deus os colocou em meu caminho: médicos, enfermeiras, técnicos, anestesistas, instrumentistas e toda a estrutura hospitalar por onde passei.",
  },
  {
    aramaic: "ܗܝܡܢܘ — ܐܠܗܐ ܗܘܐ!",
    pt: "Acreditem, foi Deus!",
  },
  {
    aramaic: "ܝܘܡܢܐ ܡܣܬܟܠ ܐܢܐ ܕܐܠܗܐ ܡܫܠܛ ܒܡܪܘܬܗ ܥܠ ܟܠ",
    pt: "Hoje compreendo que Deus, em sua soberania, permite que pessoas entrem e saiam de nossas vidas, conforme o seu propósito, e não o meu.",
  },
  {
    aramaic: "ܒܚ̈ܝܝ ܥܒܪܬ ܒܢܣ̈ܝܘܢܐ ܘܐܘ̈ܠܨܢܐ ܘܦܘܪ̈ܩܢܐ ܕܠܐ ܡܨܝܐ",
    pt: "Em minha vida passei por muitas provações, tribulações e livramentos impossíveis de superar. Humanamente dizendo, nem era para eu ainda estar aqui.",
  },
  {
    aramaic: "ܒܪܡ ܡܠܬܗ ܕܡܪܝܐ ܩܝܡܐ ܠܥܠܡ. ܐܡܪ ܕܟܠ ܗܠܝܢ ܢܥܒܪܘܢ",
    pt: "Mas a Palavra do Senhor permanece firme. Disse que tudo isso passaria e falou ao meu coração, prometeu que iria me levantar e me abençoar.",
  },
  {
    aramaic: "ܟܠ ܝܘܡܐ ܚܕܬܐ ܗܘܐ ܣܗܕܘܬܐ ܚܝܬܐ ܕܚܘܒܗ ܒܝܫܘܥ ܡܫܝܚܐ",
    pt: "Assim, cada novo dia de minha vida se torna um testemunho vivo do seu amor e do seu plano manifestado por meio de seu filho, Jesus Cristo.",
  },
  {
    aramaic: "ܠܐܠܗܐ ܟܠ ܐܝܩܪܐ ܘܟܠ ܬܫܒܘܚܬܐ ܗܫܐ ܘܠܥܠܡ ܥܠܡܝܢ. ܐܡܝܢ.",
    pt: "A Deus, toda a honra e toda glória, agora e para sempre. Amém.",
  },
  {
    aramaic: "",
    pt: "Marcelo Borbas — LEMOS a Palavra\nVisionário amante das Escrituras Sagradas",
  },
];

interface DedicatoriaModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function DedicatoriaModal({ open: externalOpen, onOpenChange }: DedicatoriaModalProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  // Phase: 0 = show aramaic, 1+ = translating line by line
  const [translatedCount, setTranslatedCount] = useState(0);
  const [allAramaicVisible, setAllAramaicVisible] = useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const startAnimation = useCallback(() => {
    setTranslatedCount(0);
    setAllAramaicVisible(false);

    // First show all aramaic lines fading in
    setTimeout(() => setAllAramaicVisible(true), 300);

    // After 3 seconds, start translating one by one
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 max-w-lg w-full max-h-[85vh] overflow-hidden"
            style={{ animation: "scrollOpen 0.8s ease-out forwards" }}
          >
            <div
              className="rounded-2xl border-4 overflow-y-auto max-h-[85vh] p-6 sm:p-8"
              style={{
                borderColor: "#b8860b",
                background: "linear-gradient(180deg, #f5e6c8 0%, #e8d5a8 30%, #f0dbb8 60%, #e0c890 100%)",
                boxShadow: "0 0 30px rgba(0,0,0,0.4), inset 0 0 40px rgba(139,90,43,0.15)",
              }}
            >
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform z-10"
                style={{ background: "#b8860b", color: "#fff" }}
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-1"
                  style={{ color: "#5a3a1a", fontFamily: "serif" }}
                >
                  ✦ ܡܩܪܒܢܘܬܐ ✦
                </h2>
                <p className="text-xs italic" style={{ color: "#8b6914" }}>
                  Dedicatória
                </p>
              </div>

              <div className="space-y-4">
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
                      {/* Aramaic text - fades out when translated */}
                      {item.aramaic && (
                        <p
                          className="text-right text-base sm:text-lg leading-relaxed transition-all duration-1000"
                          style={{
                            color: "#6b3a0a",
                            fontFamily: "serif",
                            direction: "rtl",
                            opacity: isTranslated ? 0 : 1,
                            maxHeight: isTranslated ? 0 : "200px",
                            overflow: "hidden",
                            marginBottom: isTranslated ? 0 : "4px",
                          }}
                        >
                          {item.aramaic}
                        </p>
                      )}

                      {/* Portuguese text - fades in magically */}
                      <p
                        className="text-sm sm:text-base leading-relaxed whitespace-pre-line transition-all duration-1000"
                        style={{
                          color: "#3d2b0f",
                          opacity: isTranslated ? 1 : 0,
                          maxHeight: isTranslated ? "300px" : 0,
                          overflow: "hidden",
                          filter: isTranslated ? "none" : "blur(8px)",
                        }}
                      >
                        {item.pt}
                      </p>
                    </div>
                  );
                })}
              </div>

              {translatedCount >= dedicatoriaTexts.length && (
                <div
                  className="text-center mt-6 text-2xl animate-fade-in"
                >
                  ✝️ 🕊️ ✝️
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scrollOpen {
          0% {
            transform: scaleY(0.01) scaleX(0.6);
            opacity: 0;
          }
          40% {
            transform: scaleY(0.4) scaleX(0.8);
            opacity: 0.7;
          }
          100% {
            transform: scaleY(1) scaleX(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}