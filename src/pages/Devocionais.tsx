import PageHeader from "@/components/PageHeader";
import iconDevocionais from "@/assets/icon-devocionais.png";

const devos = [
  { title: "Deus me Ama", verse: "João 3:16", text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." },
  { title: "Confiar em Deus", verse: "Provérbios 3:5", text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento." },
  { title: "Ser Corajoso", verse: "Josué 1:9", text: "Não fui eu que ordenei a você? Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar." },
  { title: "Obedecer aos Pais", verse: "Efésios 6:1", text: "Filhos, obedeçam a seus pais no Senhor, pois isso é justo." },
  { title: "Ser Bondoso", verse: "Efésios 4:32", text: "Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo." },
  { title: "Não Ter Medo", verse: "Isaías 41:10", text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a minha destra fiel." },
];

export default function Devocionais() {
  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Devocionais" subtitle="Momentos com Deus todos os dias" icon={iconDevocionais} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {devos.map((d, i) => (
            <div key={i} className="bg-popover rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border">
              <h3 className="font-display text-lg font-bold text-foreground">{d.title}</h3>
              <p className="text-primary font-body text-sm font-semibold mt-1">{d.verse}</p>
              <p className="font-body text-sm text-muted-foreground mt-2">{d.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
