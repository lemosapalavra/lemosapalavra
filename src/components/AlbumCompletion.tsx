import { useEffect, useMemo, useState } from "react";
import { X, Trophy, GraduationCap, ScrollText, Crown, BookOpen, Printer } from "lucide-react";

/* =========================================================
   Album Completion Center
   Renders: Medals · Final Quiz · Certificate · Hall of Fame · Volume 2 (coming soon)
   ========================================================= */

export const MEDALS = [
  { key: "explorador", pct: 25, name: "Explorador da Bíblia", emoji: "🧭", color: "from-emerald-400 to-teal-600" },
  { key: "guerreiro", pct: 50, name: "Guerreiro da Fé", emoji: "⚔️", color: "from-sky-400 to-indigo-600" },
  { key: "mestre", pct: 75, name: "Mestre da Palavra", emoji: "📖", color: "from-amber-400 to-orange-600" },
  { key: "heroi", pct: 100, name: "Herói Bíblico", emoji: "👑", color: "from-yellow-300 to-amber-600" },
] as const;

const QUIZ: { q: string; opts: string[]; answer: number }[] = [
  { q: "Quem construiu a arca para salvar os animais do dilúvio?", opts: ["Moisés", "Noé", "Abraão", "Davi"], answer: 1 },
  { q: "Quem enfrentou o gigante Golias com uma funda?", opts: ["Sansão", "Saul", "Davi", "Jônatas"], answer: 2 },
  { q: "Quem foi lançado na cova dos leões e saiu ileso?", opts: ["José", "Daniel", "Elias", "Jonas"], answer: 1 },
  { q: "Quem recebeu de Deus os Dez Mandamentos?", opts: ["Moisés", "Aarão", "Josué", "Samuel"], answer: 0 },
  { q: "Quem foi engolido por um grande peixe?", opts: ["Pedro", "Paulo", "Jonas", "Tomé"], answer: 2 },
];

type HallEntry = { name: string; avatar?: string; date: string; medal: string };

const HALL_KEY = "lemos_hall_fame_v1";
const QUIZ_KEY = "lemos_album_v1_quiz_passed";
const COMPLETED_KEY = "lemos_album_v1_completed_at";

function readHall(): HallEntry[] {
  try { return JSON.parse(localStorage.getItem(HALL_KEY) || "[]"); } catch { return []; }
}
function writeHall(arr: HallEntry[]) { localStorage.setItem(HALL_KEY, JSON.stringify(arr.slice(0, 100))); }

function getUser(): { name?: string; avatar?: string } {
  try { return JSON.parse(localStorage.getItem("lemos_user") || "{}"); } catch { return {}; }
}

export function getEarnedMedals(totalOwned: number, total: number) {
  if (!total) return [];
  const pct = (totalOwned / total) * 100;
  return MEDALS.filter((m) => pct >= m.pct);
}

export function isAlbumComplete(totalOwned: number, total: number) {
  return total > 0 && totalOwned >= total;
}

interface Props {
  totalOwned: number;
  total: number;
  onClose: () => void;
}

type Tab = "medalhas" | "quiz" | "certificado" | "hall" | "volume2";

export default function AlbumCompletion({ totalOwned, total, onClose }: Props) {
  const complete = isAlbumComplete(totalOwned, total);
  const earned = useMemo(() => getEarnedMedals(totalOwned, total), [totalOwned, total]);
  const user = getUser();
  const [tab, setTab] = useState<Tab>(complete ? "medalhas" : "medalhas");
  const [quizPassed, setQuizPassed] = useState(() => localStorage.getItem(QUIZ_KEY) === "true");

  // Mark completion date once
  useEffect(() => {
    if (complete && !localStorage.getItem(COMPLETED_KEY)) {
      localStorage.setItem(COMPLETED_KEY, new Date().toISOString());
    }
  }, [complete]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; enabled: boolean }[] = [
    { key: "medalhas", label: "Medalhas", icon: <Trophy className="w-4 h-4" />, enabled: true },
    { key: "quiz", label: "Quiz Final", icon: <GraduationCap className="w-4 h-4" />, enabled: complete },
    { key: "certificado", label: "Certificado", icon: <ScrollText className="w-4 h-4" />, enabled: complete && quizPassed },
    { key: "hall", label: "Hall da Fama", icon: <Crown className="w-4 h-4" />, enabled: true },
    { key: "volume2", label: "Volume 2", icon: <BookOpen className="w-4 h-4" />, enabled: true },
  ];

  return (
    <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto" onClick={onClose}>
      {/* 🎉 Party confetti — only on full completion */}
      {complete && (
        <>
          <div className="pointer-events-none fixed inset-0 z-[71] overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => {
              const colors = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#a855f7", "#fde047"];
              const left = (i * 37) % 100;
              const delay = (i % 12) * 0.18;
              const dur = 3 + ((i * 7) % 30) / 10;
              const size = 6 + (i % 5) * 2;
              const color = colors[i % colors.length];
              const rotate = (i * 47) % 360;
              return (
                <span
                  key={i}
                  style={{
                    left: `${left}%`,
                    background: color,
                    width: `${size}px`,
                    height: `${size * 1.6}px`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${dur}s`,
                    transform: `rotate(${rotate}deg)`,
                  }}
                  className="absolute -top-6 rounded-sm opacity-90 animate-[confettiFall_linear_infinite] shadow"
                />
              );
            })}
          </div>
          <div className="pointer-events-none fixed inset-0 z-[71] flex items-start justify-center">
            <div className="mt-6 text-5xl sm:text-6xl animate-[partyBounce_1.2s_ease-in-out_infinite]">🎊🎉🥳🎉🎊</div>
          </div>
        </>
      )}
      <div
        className="relative w-full max-w-3xl my-4 bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl shadow-2xl border-4 border-amber-500 overflow-hidden animate-[fadeUp_0.4s_ease-out] z-[72]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white px-5 py-4 text-center">
          <div className="text-4xl mb-1">{complete ? "🎉" : "🏆"}</div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl drop-shadow">
            {complete ? "Parabéns, Herói(na) da Fé!" : "Suas Conquistas"}
          </h2>
          <p className="text-xs sm:text-sm opacity-95">
            {complete
              ? "Você completou o Álbum Heróis da Fé — Volume 1! 🎊 Em breve chega o Volume II com muitas novidades!"
              : `Continue colecionando! ${totalOwned}/${total} figurinhas.`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 p-2 bg-amber-100/70 border-b border-amber-300">
          {tabs.map((t) => (
            <button
              key={t.key}
              disabled={!t.enabled}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-bold transition ${
                tab === t.key
                  ? "bg-amber-700 text-white shadow-lg"
                  : t.enabled
                  ? "bg-white text-amber-900 hover:bg-amber-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              title={!t.enabled ? "Complete o álbum para desbloquear" : ""}
            >
              {t.icon}
              {t.label}
              {!t.enabled && <span>🔒</span>}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto">
          {tab === "medalhas" && <MedalsPanel earned={earned} totalOwned={totalOwned} total={total} />}
          {tab === "quiz" && (
            <QuizPanel
              alreadyPassed={quizPassed}
              onPass={() => {
                localStorage.setItem(QUIZ_KEY, "true");
                setQuizPassed(true);
                // Add to hall of fame
                const hall = readHall();
                const exists = hall.find((e) => e.name === (user.name || "Anônimo"));
                if (!exists) {
                  hall.unshift({
                    name: user.name || "Anônimo",
                    avatar: user.avatar,
                    date: new Date().toISOString(),
                    medal: "Herói Bíblico",
                  });
                  writeHall(hall);
                }
                setTab("certificado");
              }}
            />
          )}
          {tab === "certificado" && <CertificatePanel user={user} />}
          {tab === "hall" && <HallPanel />}
          {tab === "volume2" && <Volume2Panel complete={complete} />}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

/* ============ MEDALS ============ */
function MedalsPanel({ earned, totalOwned, total }: { earned: typeof MEDALS[number][]; totalOwned: number; total: number }) {
  const pct = total ? (totalOwned / total) * 100 : 0;
  return (
    <div className="space-y-4">
      <div className="bg-white/80 rounded-2xl p-3 border-2 border-amber-300">
        <div className="flex justify-between text-xs font-bold text-amber-900 mb-1">
          <span>Progresso</span>
          <span>{totalOwned}/{total} ({Math.round(pct)}%)</span>
        </div>
        <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MEDALS.map((m) => {
          const got = earned.find((e) => e.key === m.key);
          return (
            <div
              key={m.key}
              className={`relative rounded-2xl p-3 text-center border-2 transition ${
                got
                  ? `bg-gradient-to-br ${m.color} text-white border-white shadow-xl scale-100`
                  : "bg-white/60 text-gray-400 border-gray-200 grayscale"
              }`}
            >
              <div className={`text-5xl mb-1 ${got ? "animate-bounce" : ""}`}>{m.emoji}</div>
              <div className="font-display font-extrabold text-xs leading-tight">{m.name}</div>
              <div className="text-[10px] mt-1 opacity-90">{m.pct}% do álbum</div>
              {got && <span className="absolute -top-2 -right-2 text-xl">✨</span>}
            </div>
          );
        })}
      </div>

      {earned.length === 0 && (
        <p className="text-center text-sm text-amber-900 italic">Colete mais figurinhas para ganhar sua primeira medalha! 💪</p>
      )}
    </div>
  );
}

/* ============ QUIZ ============ */
function QuizPanel({ alreadyPassed, onPass }: { alreadyPassed: boolean; onPass: () => void }) {
  const [answers, setAnswers] = useState<number[]>(Array(QUIZ.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  if (alreadyPassed && !submitted) {
    return (
      <div className="text-center space-y-3 py-4">
        <div className="text-6xl">🎓</div>
        <h3 className="font-display font-extrabold text-xl text-amber-900">Quiz Final aprovado!</h3>
        <p className="text-sm text-amber-800">Você já passou no quiz e pode gerar seu certificado.</p>
        <button onClick={onPass} className="btn-cartoon px-6 py-2 text-sm">📜 Ver Certificado</button>
      </div>
    );
  }

  const score = answers.reduce((a, ans, i) => a + (ans === QUIZ[i].answer ? 1 : 0), 0);
  const passed = score >= 4;

  const handleSubmit = () => {
    setSubmitted(true);
    if (passed) setTimeout(() => onPass(), 1500);
  };

  if (submitted) {
    return (
      <div className="text-center space-y-3 py-4">
        <div className="text-6xl">{passed ? "🎉" : "💪"}</div>
        <h3 className="font-display font-extrabold text-2xl text-amber-900">{passed ? "Aprovado!" : "Quase lá!"}</h3>
        <p className="text-lg font-bold text-amber-800">Você acertou {score} de {QUIZ.length}</p>
        {passed ? (
          <p className="text-sm text-emerald-700">Gerando seu certificado...</p>
        ) : (
          <button onClick={() => { setAnswers(Array(QUIZ.length).fill(-1)); setSubmitted(false); }} className="btn-cartoon px-6 py-2 text-sm">
            Tentar Novamente
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-amber-900 font-bold text-center">📚 Responda 4 de 5 perguntas corretamente para se graduar!</p>
      {QUIZ.map((q, i) => (
        <div key={i} className="bg-white/80 rounded-2xl p-3 border-2 border-amber-200">
          <p className="font-display font-bold text-sm text-amber-950 mb-2">{i + 1}. {q.q}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {q.opts.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => setAnswers((a) => { const n = [...a]; n[i] = oi; return n; })}
                className={`text-xs font-bold px-2 py-2 rounded-xl border-2 transition text-left ${
                  answers[i] === oi
                    ? "bg-amber-500 text-white border-amber-700"
                    : "bg-white text-amber-900 border-amber-200 hover:bg-amber-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={answers.some((a) => a === -1)}
        className="w-full btn-cartoon py-3 disabled:opacity-50"
      >
        ✅ Enviar Respostas
      </button>
    </div>
  );
}

/* ============ CERTIFICATE ============ */
function CertificatePanel({ user }: { user: { name?: string; avatar?: string } }) {
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const name = user.name || "Herói da Fé";

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=900,height=650");
    if (!win) return;
    const cert = document.getElementById("lemos-certificate-printable")?.outerHTML || "";
    win.document.write(`
      <html><head><title>Certificado — ${name}</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Georgia, serif; background: #f5e9c8; }
        .cert { max-width: 800px; margin: 0 auto; }
      </style></head><body>${cert}
      <script>window.onload = function() { window.print(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <div className="space-y-3">
      <div id="lemos-certificate-printable" className="cert relative bg-gradient-to-br from-yellow-50 to-amber-100 border-[12px] border-double border-amber-700 rounded-lg p-5 sm:p-8 text-center shadow-2xl">
        <div className="absolute top-2 left-2 text-3xl">✦</div>
        <div className="absolute top-2 right-2 text-3xl">✦</div>
        <div className="absolute bottom-2 left-2 text-3xl">✦</div>
        <div className="absolute bottom-2 right-2 text-3xl">✦</div>

        <p className="font-display text-xs sm:text-sm uppercase tracking-[0.3em] text-amber-700">Lemos a Palavra</p>
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-amber-900 mt-2" style={{ fontFamily: "Georgia, serif" }}>
          Certificado de Conclusão
        </h2>
        <div className="mx-auto my-3 w-24 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent" />

        <p className="text-sm sm:text-base text-amber-900 mb-3">Conferimos este certificado a</p>

        {user.avatar && (
          <img src={user.avatar} alt={name} className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-700 shadow-lg object-cover mb-2" />
        )}

        <p className="font-display text-2xl sm:text-3xl font-extrabold text-rose-700 my-2" style={{ fontFamily: "Georgia, serif" }}>
          {name}
        </p>

        <p className="text-sm sm:text-base text-amber-900 leading-relaxed max-w-md mx-auto my-3">
          por ter completado com fé e dedicação o<br />
          <strong>Álbum Bíblico Heróis da Fé — Volume 1</strong>,<br />
          colecionando todas as figurinhas sagradas e demonstrando<br />
          conhecimento da Palavra de Deus.
        </p>

        <div className="text-5xl my-2">👑</div>
        <p className="font-display font-extrabold text-amber-800 text-sm">Título: Herói Bíblico</p>

        <div className="flex justify-between items-end mt-5 px-2 sm:px-6 text-xs text-amber-900">
          <div className="text-center">
            <div className="border-t-2 border-amber-700 pt-1 px-3">{today}</div>
            <div className="text-[10px] uppercase tracking-wider mt-0.5">Data</div>
          </div>
          <div className="text-center">
            <div className="font-display italic text-base text-amber-800" style={{ fontFamily: "Brush Script MT, cursive" }}>Lemos a Palavra</div>
            <div className="border-t-2 border-amber-700 pt-0 px-3 text-[10px] uppercase tracking-wider">Assinatura Digital</div>
          </div>
        </div>
      </div>

      <button onClick={handlePrint} className="w-full btn-cartoon py-3 flex items-center justify-center gap-2">
        <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
      </button>
    </div>
  );
}

/* ============ HALL OF FAME ============ */
function HallPanel() {
  const [hall, setHall] = useState<HallEntry[]>(() => readHall());
  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className="text-4xl mb-1">👑</div>
        <h3 className="font-display font-extrabold text-xl text-amber-900">Galeria dos Campeões</h3>
        <p className="text-xs text-amber-800">Heróis que completaram o álbum e passaram no Quiz Final</p>
      </div>

      {hall.length === 0 ? (
        <div className="text-center bg-white/80 rounded-2xl p-6 border-2 border-dashed border-amber-300">
          <p className="text-sm text-amber-800 italic">Seja o primeiro Herói da Fé! 🏆</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {hall.map((h, i) => (
            <div key={i} className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl p-3 text-center border-2 border-amber-400 shadow">
              {i < 3 && <div className="text-xl">{["🥇", "🥈", "🥉"][i]}</div>}
              {h.avatar ? (
                <img src={h.avatar} alt={h.name} className="mx-auto w-14 h-14 rounded-full border-2 border-amber-600 object-cover mb-1" />
              ) : (
                <div className="text-3xl">👤</div>
              )}
              <div className="font-display font-extrabold text-xs text-amber-900 truncate">{h.name}</div>
              <div className="text-[9px] text-amber-700">{new Date(h.date).toLocaleDateString("pt-BR")}</div>
              <div className="text-[9px] mt-0.5 bg-amber-700 text-white rounded-full px-1.5 py-0.5 inline-block">{h.medal}</div>
            </div>
          ))}
        </div>
      )}

      {hall.length > 0 && (
        <button
          onClick={() => { if (confirm("Limpar Hall da Fama?")) { writeHall([]); setHall([]); } }}
          className="text-[10px] text-amber-700 underline mx-auto block"
        >
          Limpar galeria
        </button>
      )}
    </div>
  );
}

/* ============ VOLUME 2 ============ */
function Volume2Panel({ complete }: { complete: boolean }) {
  const themes = [
    { icon: "✨", name: "Milagres de Jesus" },
    { icon: "🌾", name: "Parábolas" },
    { icon: "👸", name: "Mulheres da Bíblia" },
    { icon: "📜", name: "Antigo Testamento II" },
    { icon: "🕊️", name: "Apocalipse Infantil" },
  ];

  // Compute leftover coins + repeated stickers → credits for Volume II
  const { remainingCoins, repeatCount, credits } = useMemo(() => {
    let coins = 0;
    try {
      const u = JSON.parse(localStorage.getItem("lemos_user") || "{}");
      coins = Number(u.coins || 0);
    } catch { /* noop */ }
    let repeats = 0;
    try {
      const owned = JSON.parse(localStorage.getItem("lemos_stickers_v2") || "{}");
      Object.values(owned).forEach((c: any) => { if ((c || 0) > 1) repeats += (c - 1); });
    } catch { /* noop */ }
    return { remainingCoins: coins, repeatCount: repeats, credits: coins + repeats };
  }, []);

  // Persist credits so they're reserved for Volume II
  useEffect(() => {
    if (complete) {
      localStorage.setItem("lemos_album_v2_credits", String(credits));
    }
  }, [complete, credits]);

  return (
    <div className="text-center space-y-4 py-2">
      <div className="text-6xl">📖</div>
      <h3 className="font-display font-extrabold text-2xl text-amber-900">Álbum Volume 2</h3>
      <div className="inline-block bg-gradient-to-r from-rose-500 to-orange-500 text-white px-5 py-2 rounded-full font-display font-extrabold shadow-lg animate-pulse">
        🚀 EM BREVE
      </div>

      {complete && (
        <div className="bg-gradient-to-br from-amber-100 to-yellow-50 border-2 border-amber-400 rounded-2xl p-4 max-w-md mx-auto shadow-lg">
          <div className="text-3xl mb-1">🎁</div>
          <p className="font-display font-extrabold text-amber-900 text-lg">
            Seus créditos para o Volume II
          </p>
          <p className="text-xs text-amber-800 mt-1 mb-3">
            Como você completou o álbum, suas <strong>moedas restantes</strong> e <strong>figurinhas repetidas</strong> serão convertidas em créditos para o próximo volume.
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/80 rounded-xl p-2 border border-amber-300">
              <div className="text-xl">🪙</div>
              <div className="font-display font-extrabold text-amber-900 tabular-nums">{remainingCoins}</div>
              <div className="text-[10px] uppercase text-amber-700">Moedas</div>
            </div>
            <div className="bg-white/80 rounded-xl p-2 border border-amber-300">
              <div className="text-xl">🔁</div>
              <div className="font-display font-extrabold text-amber-900 tabular-nums">{repeatCount}</div>
              <div className="text-[10px] uppercase text-amber-700">Repetidas</div>
            </div>
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl p-2 border border-amber-500 shadow">
              <div className="text-xl">⭐</div>
              <div className="font-display font-extrabold tabular-nums">{credits}</div>
              <div className="text-[10px] uppercase">Créditos VII</div>
            </div>
          </div>
          <p className="text-[11px] text-amber-700 italic mt-3">
            🔒 Créditos guardados com segurança. Basta aguardar o lançamento do Volume II!
          </p>
        </div>
      )}

      <p className="text-sm text-amber-800 max-w-md mx-auto">
        Está pronto para a próxima jornada? Estamos preparando novos temas incríveis para você continuar colecionando!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto text-left">
        {themes.map((t) => (
          <div key={t.name} className="bg-white/80 rounded-xl p-2.5 border-2 border-amber-200 flex items-center gap-2">
            <span className="text-2xl">{t.icon}</span>
            <span className="font-display font-bold text-sm text-amber-900">{t.name}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-amber-700 italic">Aguarde novidades em breve! 🙏</p>
    </div>
  );
}
