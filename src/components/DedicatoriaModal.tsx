import { useState } from "react";
import iconDedicatoria from "@/assets/icon-dedicatoria.png";

const dedicatoriaTexts = [
  {
    aramaic: "ܗܢܐ ܦܘܪܫܢܐ ܐܬܝܠܕ ܡܢ ܣܘܟܝܐ ܫܪܝܪܐ",
    pt: "Este projeto nasceu do desejo sincero de apresentar a vida, os ensinamentos e o caminho de Jesus de forma acessível, visual e fiel às Escrituras.",
  },
  {
    aramaic: "ܡܩܪܒ ܐܢܐ ܗܢܐ ܦܘܪܫܢܐ ܒܬܘܕܝܬܐ ܘܒܗܝܡܢܘܬܐ",
    pt: "Dedico este projeto, com GRATIDÃO e FÉ, a Deus Todo-Poderoso e ao Menino Jesus, cujo amor transforma, cura e salva.",
  },
  {
    aramaic: "ܗܘ ܕܣܡܟܢܝ ܒܥܩ̈ܬܐ ܘܕܒܪ ܦܣ̈ܥܬܝ",
    pt: "Foi Ele quem me sustentou nas dificuldades, guiou meus passos e fortaleceu o meu coração.",
  },
  {
    aramaic: "ܠܐܢܬܬܝ ܡܪܬܐ ܘܠܒܪܝ ܡܬܝ",
    pt: "À minha esposa Marta e ao meu filho Matheus, sustentáculo de perseverança e esperança.",
  },
  {
    aramaic: "ܠܚܒܪܬܝ ܐܠܝܐܬ ܕܠܐ ܟܠܬ ܚܝ̈ܠܐ",
    pt: "À minha amiga Eliete, que sem medir esforços enfrentou caminhos difíceis para me socorrer, e a seu marido Livaldo, instrumentos do cuidado divino.",
  },
  {
    aramaic: "ܠܫܪܒܬܐ ܕܠܝܡܘܣ ܘܐܡܝ ܒܐܝܩܪܐ ܡܪܬ ܪܝܓ̰ܐܢ",
    pt: "À família Lemos, minha mãe de consideração Sra. Rejane, e minha irmã Marisa, instrumentos de apoio e constância.",
  },
  {
    aramaic: "ܘܠܐ ܛܥܐ ܐܢܐ ܠܗܘ ܕܗܘܐ ܠܝ ܐܒܐ ܫܪܝܪܐ",
    pt: "Sem jamais esquecer daquele que foi para mim um verdadeiro pai: Sr. Arlindo Francisco de Lemos, cuja inspiração continua viva em minha caminhada.",
  },
  {
    aramaic: "ܐܠܗܐ ܢܛܪ ܠܗ ܒܫܠܡܗ",
    pt: "Que Deus o tenha em sua paz.",
  },
  {
    aramaic: "ܡܘܕܐ ܐܢܐ ܐܦ ܠܐܝܠܝܢ ܕܠܐ ܝܕ̈ܥܐ ܠܥ̈ܝܢܝ",
    pt: "Agradeço ainda àqueles que, anônimos aos meus olhos, Deus os colocou em meu caminho: médicos, enfermeiras e toda a equipe hospitalar.",
  },
  {
    aramaic: "ܗܝܡܢܘ — ܐܠܗܐ ܗܘܐ!",
    pt: "Acreditem, foi Deus!",
  },
  {
    aramaic: "ܟܠ ܝܘܡܐ ܚܕܬܐ ܗܘܐ ܣܗܕܘܬܐ ܚܝܬܐ ܕܚܘܒܗ",
    pt: "Cada novo dia de minha vida se torna um testemunho vivo do seu amor e do seu plano, manifestado por meio de Jesus Cristo.",
  },
  {
    aramaic: "ܠܐܠܗܐ ܟܠ ܐܝܩܪܐ ܘܟܠ ܬܫܒܘܚܬܐ ܠܥܠܡ. ܐܡܝܢ.",
    pt: "A Deus, toda a honra e toda glória, agora e para sempre. Amém.",
  },
  {
    aramaic: "",
    pt: "Marcelo Borbas — LEMOS a Palavra\nVisionário amante das Escrituras Sagradas",
  },
];

export default function DedicatoriaModal() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(0);

  const handleOpen = () => {
    setOpen(true);
    setRevealed(0);
    // Gradually reveal lines
    dedicatoriaTexts.forEach((_, i) => {
      setTimeout(() => setRevealed((prev) => Math.max(prev, i + 1)), 800 * (i + 1));
    });
  };

  const handleClose = () => {
    setOpen(false);
    setRevealed(0);
  };

  return (
    <>
      {/* Floating pulsing icon */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 animate-pulse hover:animate-none hover:scale-110 transition-transform"
        style={{
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.35))",
        }}
        title="Dedicatória"
      >
        <img
          src={iconDedicatoria}
          alt="Dedicatória"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl"
        />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          {/* Parchment scroll */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 max-w-lg w-full max-h-[85vh] overflow-hidden"
            style={{
              animation: "scrollOpen 0.8s ease-out forwards",
            }}
          >
            {/* Parchment background */}
            <div
              className="rounded-2xl border-4 overflow-y-auto max-h-[85vh] p-6 sm:p-8"
              style={{
                borderColor: "#b8860b",
                background: "linear-gradient(180deg, #f5e6c8 0%, #e8d5a8 30%, #f0dbb8 60%, #e0c890 100%)",
                boxShadow: "0 0 30px rgba(0,0,0,0.4), inset 0 0 40px rgba(139,90,43,0.15)",
              }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform"
                style={{ background: "#b8860b", color: "#fff" }}
              >
                ✕
              </button>

              {/* Title */}
              <div className="text-center mb-6">
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-1"
                  style={{ color: "#5a3a1a", fontFamily: "serif" }}
                >
                  ✦ Dedicatória ✦
                </h2>
                <p className="text-xs italic" style={{ color: "#8b6914" }}>
                  ܡܩܪܒܢܘܬܐ — Em Aramaico e Português
                </p>
              </div>

              {/* Text lines */}
              <div className="space-y-5">
                {dedicatoriaTexts.map((item, i) => (
                  <div
                    key={i}
                    className="transition-all duration-700"
                    style={{
                      opacity: i < revealed ? 1 : 0,
                      transform: i < revealed ? "translateY(0)" : "translateY(20px)",
                    }}
                  >
                    {item.aramaic && (
                      <p
                        className="text-right text-base sm:text-lg mb-1 leading-relaxed"
                        style={{
                          color: "#6b3a0a",
                          fontFamily: "serif",
                          direction: "rtl",
                        }}
                      >
                        {item.aramaic}
                      </p>
                    )}
                    <p
                      className="text-sm sm:text-base leading-relaxed whitespace-pre-line"
                      style={{ color: "#3d2b0f" }}
                    >
                      {item.pt}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom ornament */}
              {revealed >= dedicatoriaTexts.length && (
                <div
                  className="text-center mt-6 text-2xl transition-opacity duration-1000"
                  style={{ opacity: 1 }}
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
