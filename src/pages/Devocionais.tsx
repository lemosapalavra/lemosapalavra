import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import CoinBadge from "@/components/CoinBadge";
import iconDevocionais from "@/assets/icon-devocionais.png";

const DEVO_COINS = 2;

const devos = [
  { title: "Deus me Ama", verse: "João 3:16", text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", reflection: "Deus nos ama de um jeito tão grande que enviou Jesus para nos salvar. Quando você se sentir sozinho, lembre-se: Deus te ama mais do que qualquer pessoa neste mundo!", prayer: "Querido Deus, obrigado por me amar tanto. Ajude-me a sentir Seu amor todos os dias. Amém." },
  { title: "Confiar em Deus", verse: "Provérbios 3:5", text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", reflection: "Às vezes queremos resolver tudo sozinhos, mas Deus nos pede para confiar Nele. Ele sabe o que é melhor para nós, mesmo quando não entendemos.", prayer: "Pai, ajude-me a confiar em Ti em todos os momentos, especialmente quando eu não entender o que está acontecendo. Amém." },
  { title: "Ser Corajoso", verse: "Josué 1:9", text: "Não fui eu que ordenei a você? Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.", reflection: "Deus promete estar sempre conosco. Quando tiver medo de alguma coisa, lembre-se que o Deus Todo-Poderoso caminha ao seu lado!", prayer: "Senhor, me dê coragem para enfrentar os meus medos. Sei que o Senhor está comigo em todos os lugares. Amém." },
  { title: "Obedecer aos Pais", verse: "Efésios 6:1", text: "Filhos, obedeçam a seus pais no Senhor, pois isso é justo.", reflection: "Deus colocou nossos pais para nos proteger e ensinar. Obedecer a eles é uma forma de obedecer a Deus e mostrar que somos sábios!", prayer: "Deus, me ajude a obedecer meus pais com alegria, mesmo quando for difícil. Obrigado pela minha família. Amém." },
  { title: "Ser Bondoso", verse: "Efésios 4:32", text: "Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo.", reflection: "Ser bondoso é como espalhar a luz de Jesus pelo mundo. Um sorriso, uma palavra amiga ou um abraço podem mudar o dia de alguém!", prayer: "Jesus, me ajude a ser bondoso com todos, especialmente com aqueles que são diferentes de mim. Amém." },
  { title: "Não Ter Medo", verse: "Isaías 41:10", text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a minha destra fiel.", reflection: "O medo é natural, mas Deus é maior que qualquer medo! Ele promete nos fortalecer e nos segurar com Sua mão poderosa.", prayer: "Pai Celestial, quando o medo vier, me lembre de que o Senhor está comigo. Obrigado por me proteger. Amém." },
  { title: "A Oração", verse: "Filipenses 4:6", text: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus.", reflection: "A oração é como uma conversa com o melhor amigo. Podemos contar tudo para Deus — alegrias, tristezas, medos e sonhos!", prayer: "Senhor, obrigado por me ouvir sempre. Ensina-me a orar mais e a confiar que Tu cuidas de tudo. Amém." },
  { title: "Luz do Mundo", verse: "Mateus 5:14-16", text: "Vocês são a luz do mundo. Não se pode esconder uma cidade construída sobre um monte.", reflection: "Jesus diz que somos a luz do mundo! Quando fazemos coisas boas, é como acender uma lanterna no escuro — todos podem ver o amor de Deus em nós.", prayer: "Jesus, me ajude a brilhar a Sua luz em todas as situações, na escola, em casa e com os amigos. Amém." },
];

export default function Devocionais() {
  // Daily devotional: rotate based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todayIdx = dayOfYear % devos.length;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Devocionais" subtitle="Momentos com Deus todos os dias" icon={iconDevocionais} />

        {selected === null ? (
          <div>
            {/* Today's devotional highlight */}
            <div 
              onClick={() => setSelected(todayIdx)}
              className="bg-primary/10 rounded-2xl p-5 shadow-lg border-2 border-primary mb-6 cursor-pointer hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌅</span>
                <span className="font-display text-xs font-bold text-primary uppercase">Devocional de Hoje</span>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">📖 {devos[todayIdx].title}</h3>
              <p className="text-primary font-body text-sm font-semibold mt-1">{devos[todayIdx].verse}</p>
              <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{devos[todayIdx].text}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="font-body text-xs text-primary font-bold">Toque para ler →</p>
                <CoinBadge amount={DEVO_COINS + 1} size="xs" label="ao ler" />
              </div>
            </div>

            <h3 className="font-display text-md font-bold text-foreground mb-3">📚 Todos os Devocionais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {devos.map((d, i) => (
                <div
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`bg-popover rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border ${i === todayIdx ? "border-primary" : "border-border"}`}
                >
                  <h3 className="font-display text-lg font-bold text-foreground">📖 {d.title}</h3>
                  <p className="text-primary font-body text-sm font-semibold mt-1">{d.verse}</p>
                  <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-2">{d.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-body text-xs text-primary">Clique para ler →</p>
                    <CoinBadge amount={DEVO_COINS} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-popover rounded-2xl p-6 shadow-lg border border-border">
            <button
              onClick={() => setSelected(null)}
              className="text-primary font-display text-sm font-bold mb-4 hover:underline"
            >
              ← Voltar aos devocionais
            </button>

            <h2 className="font-display text-2xl font-bold text-foreground mb-1">📖 {devos[selected].title}</h2>
            <p className="text-primary font-display text-lg font-semibold mb-4">{devos[selected].verse}</p>

            <div className="bg-accent/20 rounded-xl p-4 mb-4">
              <h4 className="font-display text-sm font-bold text-foreground mb-2">📜 Versículo</h4>
              <p className="font-body text-foreground italic leading-relaxed">{devos[selected].text}</p>
            </div>

            <div className="bg-primary/10 rounded-xl p-4 mb-4">
              <h4 className="font-display text-sm font-bold text-foreground mb-2">💭 Reflexão</h4>
              <p className="font-body text-foreground leading-relaxed">{devos[selected].reflection}</p>
            </div>

            <div className="bg-secondary/10 rounded-xl p-4">
              <h4 className="font-display text-sm font-bold text-foreground mb-2">🙏 Oração</h4>
              <p className="font-body text-foreground italic leading-relaxed">{devos[selected].prayer}</p>
            </div>
          </div>
        )}
      </div>
      <FeedbackFooter />
    </div>
  );
}
