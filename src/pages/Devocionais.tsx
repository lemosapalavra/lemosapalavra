import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import CoinBadge from "@/components/CoinBadge";
import iconDevocionais from "@/assets/icon-devocionais.png";

const DEVO_COINS = 2;

const devos = [
  { title: "Deus me Ama", verse: "João 3:16", text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", reflection: "Deus nos ama de um jeito tão grande que enviou Jesus para nos salvar. Quando você se sentir sozinho, lembre-se: Deus te ama mais do que qualquer pessoa neste mundo!", prayer: "Querido Deus, obrigado por me amar tanto. Ajude-me a sentir Seu amor todos os dias. Amém.", emoji: "💛", accent: "from-amber-300 to-yellow-400" },
  { title: "Confiar em Deus", verse: "Provérbios 3:5", text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", reflection: "Às vezes queremos resolver tudo sozinhos, mas Deus nos pede para confiar Nele. Ele sabe o que é melhor para nós, mesmo quando não entendemos.", prayer: "Pai, ajude-me a confiar em Ti em todos os momentos, especialmente quando eu não entender o que está acontecendo. Amém.", emoji: "🌈", accent: "from-sky-300 to-cyan-400" },
  { title: "Ser Corajoso", verse: "Josué 1:9", text: "Não fui eu que ordenei a você? Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.", reflection: "Deus promete estar sempre conosco. Quando tiver medo de alguma coisa, lembre-se que o Deus Todo-Poderoso caminha ao seu lado!", prayer: "Senhor, me dê coragem para enfrentar os meus medos. Sei que o Senhor está comigo em todos os lugares. Amém.", emoji: "🦁", accent: "from-orange-300 to-amber-400" },
  { title: "Obedecer aos Pais", verse: "Efésios 6:1", text: "Filhos, obedeçam a seus pais no Senhor, pois isso é justo.", reflection: "Deus colocou nossos pais para nos proteger e ensinar. Obedecer a eles é uma forma de obedecer a Deus e mostrar que somos sábios!", prayer: "Deus, me ajude a obedecer meus pais com alegria, mesmo quando for difícil. Obrigado pela minha família. Amém.", emoji: "🏡", accent: "from-pink-300 to-rose-400" },
  { title: "Ser Bondoso", verse: "Efésios 4:32", text: "Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo.", reflection: "Ser bondoso é como espalhar a luz de Jesus pelo mundo. Um sorriso, uma palavra amiga ou um abraço podem mudar o dia de alguém!", prayer: "Jesus, me ajude a ser bondoso com todos, especialmente com aqueles que são diferentes de mim. Amém.", emoji: "🫶", accent: "from-emerald-300 to-teal-400" },
  { title: "Não Ter Medo", verse: "Isaías 41:10", text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a minha destra fiel.", reflection: "O medo é natural, mas Deus é maior que qualquer medo! Ele promete nos fortalecer e nos segurar com Sua mão poderosa.", prayer: "Pai Celestial, quando o medo vier, me lembre de que o Senhor está comigo. Obrigado por me proteger. Amém.", emoji: "🕊️", accent: "from-violet-300 to-fuchsia-400" },
  { title: "A Oração", verse: "Filipenses 4:6", text: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus.", reflection: "A oração é como uma conversa com o melhor amigo. Podemos contar tudo para Deus — alegrias, tristezas, medos e sonhos!", prayer: "Senhor, obrigado por me ouvir sempre. Ensina-me a orar mais e a confiar que Tu cuidas de tudo. Amém.", emoji: "🙏", accent: "from-blue-300 to-indigo-400" },
  { title: "Luz do Mundo", verse: "Mateus 5:14-16", text: "Vocês são a luz do mundo. Não se pode esconder uma cidade construída sobre um monte.", reflection: "Jesus diz que somos a luz do mundo! Quando fazemos coisas boas, é como acender uma lanterna no escuro — todos podem ver o amor de Deus em nós.", prayer: "Jesus, me ajude a brilhar a Sua luz em todas as situações, na escola, em casa e com os amigos. Amém.", emoji: "✨", accent: "from-yellow-300 to-orange-400" },
];

function HistoriasBiblicasSection() {
  return (
    <div className="rounded-[24px] border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-pink-50 p-5 shadow-md text-center">
      <p className="font-display text-base font-bold text-amber-900 mb-1">
        📖 Histórias bíblicas para crianças
      </p>
      <p className="font-body text-sm text-amber-800 mb-3">
        Aprofunde a fé da criançada com narrativas bíblicas divertidas e edificantes.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/historias-biblicas"
          className="inline-block rounded-full bg-white/80 border border-amber-200 px-4 py-2 font-display text-sm font-extrabold text-primary hover:underline shadow-sm"
        >
          história bíblica infantil
        </Link>
        <Link
          to="/historias-biblicas"
          className="inline-block rounded-full bg-white/80 border border-amber-200 px-4 py-2 font-display text-sm font-extrabold text-primary hover:underline shadow-sm"
        >
          contos bíblicos infantis
        </Link>
      </div>
    </div>
  );
}

export default function Devocionais() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todayIdx = dayOfYear % devos.length;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen py-6 px-4"
      style={{ background: "linear-gradient(180deg, hsl(195,88%,90%), hsl(44,100%,93%) 42%, hsl(332,86%,92%))" }}
    >
      <div className="max-w-5xl mx-auto">
        <PageHeader title="Devocionais" subtitle="Momentos com Deus todos os dias" icon={iconDevocionais} />

        {selected === null ? (
          <div>
            <section className="relative overflow-hidden rounded-[30px] border-2 border-amber-200 bg-gradient-to-br from-sky-100 via-amber-50 to-pink-100 shadow-2xl mb-6">
              <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(circle at 15% 25%, #fff6bf, transparent 24%), radial-gradient(circle at 82% 22%, #c7f0ff, transparent 24%), radial-gradient(circle at 50% 85%, #ffd2e1, transparent 28%)" }} />
              <div className="relative px-6 py-8 text-center">
                <div className="flex items-center justify-center gap-3 text-5xl mb-3">
                  <span>☁️</span><span>✝️</span><span>🌈</span>
                </div>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-amber-950 mb-2">Oi, amiguinho!</h2>
                <p className="font-body text-sm sm:text-base text-amber-900 max-w-2xl mx-auto leading-relaxed">
                  Vamos passar um tempinho com Jesus hoje? Cada devocional tem uma palavra da Bíblia,
                  um pensamento especial e uma oração feita para crianças.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white/80 border border-amber-300 text-amber-900 font-display font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow">
                  🔄 Os devocionais se alternam dia a dia — sempre com novas opções para você descobrir!
                </div>
              </div>
            </section>

            <div
              onClick={() => setSelected(todayIdx)}
              className="relative overflow-hidden rounded-[28px] border-2 border-amber-200 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 p-6 shadow-xl mb-6 cursor-pointer hover:scale-[1.01] transition-all"
            >
              <div className="absolute right-4 top-4 w-20 h-20 rounded-full bg-white/40 blur-2xl" />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`w-20 h-20 rounded-[24px] bg-gradient-to-br ${devos[todayIdx].accent} flex items-center justify-center text-5xl shadow-lg shrink-0 mx-auto sm:mx-0`}>
                  {devos[todayIdx].emoji}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 font-display text-xs font-extrabold bg-white/80 text-amber-950 px-3 py-1 rounded-full shadow mb-2">
                    🌟 Devocional de hoje
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-amber-950">{devos[todayIdx].title}</h3>
                  <p className="font-display text-amber-700 text-sm font-bold mt-1">📜 {devos[todayIdx].verse}</p>
                  <p className="font-body text-sm text-amber-900/90 mt-2 line-clamp-2 italic">"{devos[todayIdx].text}"</p>
                </div>
                <div className="shrink-0 self-center">
                  <CoinBadge amount={DEVO_COINS + 1} size="xs" label="ao ler" />
                </div>
              </div>
            </div>

            <h3 className="font-display text-lg font-extrabold text-amber-900 mb-3 flex items-center gap-2">📚 Todos os devocionais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devos.map((d, i) => (
                <div
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`rounded-[24px] p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-2 bg-gradient-to-br ${
                    i === todayIdx ? "from-amber-100 to-orange-100 border-amber-300" : "from-white to-sky-50 border-sky-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${d.accent} flex items-center justify-center text-3xl shadow-md shrink-0`}>
                      {d.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-extrabold text-foreground">{d.title}</h3>
                      <p className="font-display text-primary text-xs font-bold mt-0.5">📜 {d.verse}</p>
                      <p className="font-body text-xs text-muted-foreground mt-2 line-clamp-2 italic">"{d.text}"</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="font-display text-xs text-primary font-bold">Toque para ler →</p>
                        <CoinBadge amount={DEVO_COINS} size="xs" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 mb-4">
              <HistoriasBiblicasSection />
            </div>
          </div>
        ) : (
          <div className="rounded-[30px] p-6 shadow-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-50">
            <button
              onClick={() => setSelected(null)}
              className="text-primary font-display text-sm font-bold mb-4 hover:underline"
            >
              ← Voltar aos devocionais
            </button>

            <div className="text-center mb-5">
              <div className={`w-24 h-24 rounded-[28px] bg-gradient-to-br ${devos[selected].accent} flex items-center justify-center text-6xl shadow-lg mx-auto mb-3`}>
                {devos[selected].emoji}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-amber-950">{devos[selected].title}</h2>
              <p className="text-amber-700 font-display text-base font-bold mt-1">📜 {devos[selected].verse}</p>
            </div>

            <div className="grid gap-4">
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-[24px] p-5 border-2 border-amber-200 shadow-sm">
                <h4 className="font-display text-sm font-extrabold text-amber-900 mb-2 flex items-center gap-2">📜 A Palavra de Deus</h4>
                <p className="font-body text-amber-950 italic leading-relaxed">"{devos[selected].text}"</p>
              </div>

              <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-[24px] p-5 border-2 border-sky-200 shadow-sm">
                <h4 className="font-display text-sm font-extrabold text-sky-900 mb-2 flex items-center gap-2">💭 Para pensar</h4>
                <p className="font-body text-sky-950 leading-relaxed">{devos[selected].reflection}</p>
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-[24px] p-5 border-2 border-pink-200 shadow-sm">
                <h4 className="font-display text-sm font-extrabold text-pink-900 mb-2 flex items-center gap-2">🙏 Vamos orar juntos</h4>
                <p className="font-body text-pink-950 italic leading-relaxed">{devos[selected].prayer}</p>
              </div>
            </div>

            <p className="text-center text-xs font-body text-amber-700 italic mt-5">✝️ Que Deus abençoe seu dia! ✝️</p>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto mt-8 mb-4">
        <div className="rounded-[24px] border-2 border-sky-200 bg-gradient-to-r from-sky-50 to-amber-50 p-5 shadow-md text-center">
          <p className="font-display text-base font-bold text-amber-900 mb-1">
            📖 Quer mais histórias da Bíblia?
          </p>
          <p className="font-body text-sm text-amber-800 mb-3">
            Leia nossas histórias bíblicas narradas especialmente para crianças.
          </p>
          <Link
            to="/historias-biblicas"
            className="inline-block font-display text-sm font-extrabold text-primary hover:underline"
          >
            história bíblica infantil →
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-4 mb-4">
        <div className="rounded-[24px] border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-amber-50 p-5 shadow-md text-center">
          <p className="font-display text-base font-bold text-amber-900 mb-1">
            🌟 Explore a Bíblia com as crianças
          </p>
          <p className="font-body text-sm text-amber-800 mb-3">
            Narrativas bíblicas ilustradas e contadas para toda a família.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/historias-biblicas"
              className="inline-block rounded-full bg-white/80 border border-pink-200 px-4 py-2 font-display text-sm font-extrabold text-primary hover:underline shadow-sm"
            >
              histórias bíblicas para crianças
            </Link>
            <Link
              to="/historias-biblicas"
              className="inline-block rounded-full bg-white/80 border border-pink-200 px-4 py-2 font-display text-sm font-extrabold text-primary hover:underline shadow-sm"
            >
              narrativas bíblicas para crianças
            </Link>
          </div>
        </div>
      </div>

      <FeedbackFooter />
    </div>
  );
}
