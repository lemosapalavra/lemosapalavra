import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import ActivityNav from "@/components/ActivityNav";
import CelebrationAnimation from "@/components/CelebrationAnimation";
import CoinBadge from "@/components/CoinBadge";
import { COINS } from "@/data/coinRewards";
import { saveToMural } from "@/lib/mural";
import imgDavi from "@/assets/historia-davi-golias.png";
import imgNoe from "@/assets/historia-noe-1.png";
import imgMoises from "@/assets/historia-moises-1.png";
import imgCriacao from "@/assets/historia-criacao.png";
import imgAdaoEva from "@/assets/historia-adao-eva-1.png";
import imgMandamentos from "@/assets/historia-10-mandamentos.png";

type Props = {
  onBack: () => void;
  celebrate: (m: string, c: number, e?: string) => void;
  celebration: { show: boolean; message: string; coins: number; emoji: string };
  closeCelebration: () => void;
  bgStyle: React.CSSProperties;
};

type Pair = { id: string; phrase: string; image: string; label: string };

const sheets: { id: string; title: string; emoji: string; pairs: Pair[] }[] = [
  {
    id: "amor", title: "Amor", emoji: "❤️",
    pairs: [
      { id: "a1", phrase: "O jovem que confiou em Deus para enfrentar Golias", image: imgDavi, label: "Davi e Golias" },
      { id: "a2", phrase: "Construiu uma grande arca obedecendo a Deus", image: imgNoe, label: "Noé e a Arca" },
      { id: "a3", phrase: "Conduziu o povo pelo mar que Deus abriu", image: imgMoises, label: "Moisés" },
    ],
  },
  {
    id: "alegria", title: "Alegria", emoji: "😀",
    pairs: [
      { id: "b1", phrase: "Deus criou o céu, a terra e todos os animais", image: imgCriacao, label: "A Criação" },
      { id: "b2", phrase: "Foram o primeiro homem e a primeira mulher", image: imgAdaoEva, label: "Adão e Eva" },
      { id: "b3", phrase: "Deus entregou suas leis em tábuas de pedra", image: imgMandamentos, label: "Dez Mandamentos" },
    ],
  },
  {
    id: "paz", title: "Paz", emoji: "🕊️",
    pairs: [
      { id: "c1", phrase: "Venceu um gigante usando uma funda", image: imgDavi, label: "Davi" },
      { id: "c2", phrase: "Reuniu sua família e os animais na arca", image: imgNoe, label: "Noé" },
      { id: "c3", phrase: "Recebeu os mandamentos no monte", image: imgMandamentos, label: "Moisés" },
    ],
  },
  {
    id: "paciencia", title: "Paciência", emoji: "⏳",
    pairs: [
      { id: "d1", phrase: "Esperou o dilúvio terminar confiando em Deus", image: imgNoe, label: "Noé na Arca" },
      { id: "d2", phrase: "Confiou em Deus diante de um inimigo muito maior", image: imgDavi, label: "Davi corajoso" },
      { id: "d3", phrase: "Guiou o povo de Deus pelo deserto", image: imgMoises, label: "Moisés no deserto" },
    ],
  },
  {
    id: "bondade", title: "Bondade", emoji: "🎁",
    pairs: [
      { id: "e1", phrase: "Deus fez um mundo bom e cheio de vida", image: imgCriacao, label: "Mundo criado por Deus" },
      { id: "e2", phrase: "Deus cuidou de uma família durante o dilúvio", image: imgNoe, label: "Família de Noé" },
      { id: "e3", phrase: "Deus libertou seu povo da escravidão", image: imgMoises, label: "Libertação com Moisés" },
    ],
  },
  {
    id: "dominio", title: "Domínio Próprio", emoji: "🙏",
    pairs: [
      { id: "f1", phrase: "As orientações de Deus ensinam escolhas corretas", image: imgMandamentos, label: "Mandamentos" },
      { id: "f2", phrase: "Deus criou as pessoas para cuidar do mundo", image: imgAdaoEva, label: "Adão e Eva" },
      { id: "f3", phrase: "A coragem pode caminhar junto com a fé", image: imgDavi, label: "Davi e Golias" },
    ],
  },
];

/** Ligue os Pontos: linha reta da frase até a imagem certa (verde = certo, vermelho = errado). */
export default function ConnectMatchGame({ onBack, celebrate, celebration, closeCelebration, bgStyle }: Props) {
  const daily = useMemo(() => {
    const start = new Date().getDate() % sheets.length;
    return Array.from({ length: 3 }, (_, k) => sheets[(start + k) % sheets.length]);
  }, []);
  const [idx, setIdx] = useState(0);
  const sheet = daily[idx];

  const rightOrder = useMemo(() => {
    const arr = [...sheet.pairs];
    return [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
  }, [sheet]);

  const [sel, setSel] = useState<string | null>(null);
  const [linked, setLinked] = useState<string[]>([]);
  const [wrong, setWrong] = useState<{ from: string; to: string } | null>(null);
  const [, force] = useState(0);
  const [done, setDone] = useState<string[]>([]);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => { force((n) => n + 1); }, [idx, linked, wrong]);
  useEffect(() => {
    const onResize = () => force((n) => n + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { setSel(null); setLinked([]); setWrong(null); }, [idx]);

  const complete = linked.length === sheet.pairs.length;

  useEffect(() => {
    if (complete && !done.includes(sheet.id)) {
      setDone((d) => [...d, sheet.id]);
      celebrate(`Você ligou tudo certinho em ${sheet.title}!`, COINS.connectdots, "✏️");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete]);

  const pickRight = (rightId: string) => {
    if (!sel) { toast.info("Escolha primeiro uma frase à esquerda 👈"); return; }
    if (sel === rightId) {
      setLinked((l) => (l.includes(sel) ? l : [...l, sel]));
      setSel(null);
      setWrong(null);
    } else {
      setWrong({ from: sel, to: rightId });
      setTimeout(() => setWrong(null), 1200);
    }
  };

  const anchor = (el: HTMLElement | null, side: "left" | "right") => {
    const box = boxRef.current;
    if (!el || !box) return null;
    const b = box.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: side === "left" ? r.right - b.left : r.left - b.left,
      y: r.top - b.top + r.height / 2,
    };
  };

  const lines: { key: string; x1: number; y1: number; x2: number; y2: number; ok: boolean }[] = [];
  linked.forEach((id) => {
    const a = anchor(leftRefs.current[id], "left");
    const b = anchor(rightRefs.current[id], "right");
    if (a && b) lines.push({ key: id, x1: a.x, y1: a.y, x2: b.x, y2: b.y, ok: true });
  });
  if (wrong) {
    const a = anchor(leftRefs.current[wrong.from], "left");
    const b = anchor(rightRefs.current[wrong.to], "right");
    if (a && b) lines.push({ key: "wrong", x1: a.x, y1: a.y, x2: b.x, y2: b.y, ok: false });
  }

  return (
    <div className="min-h-screen py-6 px-4" style={bgStyle}>
      <div className="max-w-2xl mx-auto">
        <ActivityNav onBack={onBack} title="Ligue os Pontos" subtitle={sheet.title} />

        <p className="text-center font-body text-xs sm:text-sm text-amber-900 mb-3">
          Toque na frase e depois no desenho certo. A linha fica <b className="text-emerald-600">verde</b> quando acerta e{" "}
          <b className="text-red-600">vermelha</b> quando erra.
        </p>

        <div ref={boxRef} className="relative bg-white rounded-2xl border-2 border-primary/40 shadow p-3 sm:p-5">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {lines.map((l) => (
              <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke={l.ok ? "#16a34a" : "#dc2626"} strokeWidth={5} strokeLinecap="round" />
            ))}
          </svg>

          <div className="relative grid grid-cols-2 gap-3 sm:gap-6">
            <div className="flex flex-col gap-3">
              {sheet.pairs.map((p) => {
                const ok = linked.includes(p.id);
                const active = sel === p.id;
                return (
                  <button
                    key={p.id}
                    ref={(el) => { leftRefs.current[p.id] = el; }}
                    onClick={() => !ok && setSel(active ? null : p.id)}
                    className={`text-left rounded-2xl border-2 px-3 py-3 min-h-[68px] font-body text-xs sm:text-sm transition
                      ${ok ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : active ? "bg-amber-100 border-amber-500 text-amber-900"
                        : "bg-white border-amber-200 text-foreground hover:border-primary"}`}
                  >
                    {ok ? "✅ " : "•  "}{p.phrase}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3">
              {rightOrder.map((p) => {
                const ok = linked.includes(p.id);
                return (
                  <button
                    key={p.id}
                    ref={(el) => { rightRefs.current[p.id] = el; }}
                    onClick={() => !ok && pickRight(p.id)}
                    className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-3 min-h-[68px] transition
                      ${ok ? "bg-emerald-50 border-emerald-500" : "bg-white border-amber-200 hover:border-primary"}`}
                  >
                     <img src={p.image} alt="" loading="lazy" className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-md object-contain bg-background" />
                    <span className="font-display font-bold text-[11px] sm:text-sm text-foreground text-left">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className={`text-center font-display font-bold mt-3 ${complete ? "text-emerald-600" : "text-muted-foreground"}`}>
          {complete ? "🎉 Tudo ligado corretamente!" : `${linked.length} de ${sheet.pairs.length} ligações certas`}
        </p>

        <div className="flex gap-2 flex-wrap mt-4 justify-center">
          {daily.map((s, i) => (
            <button key={s.id} onClick={() => setIdx(i)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold transition ${idx === i ? "bg-primary text-primary-foreground" : "bg-popover border border-border text-foreground hover:border-primary"}`}>
              {s.emoji} {s.title}{done.includes(s.id) ? " ✅" : ""}
            </button>
          ))}
          <button onClick={() => { setLinked([]); setSel(null); setWrong(null); }}
            className="px-3 py-1.5 rounded-full border border-border font-display text-xs font-bold hover:border-primary">
            🔄 Recomeçar
          </button>
          <button
            disabled={!complete}
            onClick={() => {
              const c = document.createElement("canvas");
              c.width = 700; c.height = 420;
              const ctx = c.getContext("2d")!;
              ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
              ctx.fillStyle = "#78350f"; ctx.font = "bold 28px sans-serif";
              ctx.fillText(`Ligue os Pontos · ${sheet.title}`, 24, 50);
              ctx.font = "20px sans-serif";
              sheet.pairs.forEach((p, i) => {
                ctx.fillStyle = "#16a34a";
                 ctx.fillText(`${p.label} — ${p.phrase}`, 24, 110 + i * 46);
              });
              saveToMural({ title: `Ligue os Pontos · ${sheet.title}`, image: c.toDataURL("image/png"), activity: "Ligue os Pontos" });
              toast.success("Pregado no Meu Mural! 🖼️");
            }}
            className="px-3 py-1.5 rounded-full border border-border font-display text-xs font-bold hover:border-primary disabled:opacity-40"
          >
            🖼️ Salvar no Meu Mural
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <CoinBadge amount={COINS.connectdots} size="md" label="ao concluir tudo certo" />
        </div>
      </div>
      <CelebrationAnimation {...celebration} onClose={closeCelebration} />
    </div>
  );
}
