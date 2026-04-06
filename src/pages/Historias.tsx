import { useState, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import KwaiSideActions from "@/components/KwaiSideActions";
import iconHistorias from "@/assets/icon-historias.png";

import avatarDavi from "@/assets/avatar-davi.png";
import avatarDaniel from "@/assets/avatar-daniel.png";
import avatarMoises from "@/assets/avatar-moises.png";
import avatarJose from "@/assets/avatar-jose.png";
import avatarJoao from "@/assets/avatar-joao.png";
import avatarMaria from "@/assets/avatar-maria.png";
import avatarJesus from "@/assets/avatar-jesus.png";
import avatarAbraao from "@/assets/avatar-abraao.png";

interface Story {
  title: string;
  img: string;
  desc: string;
  color: string;
  story: string;
  likes: number;
  emoji: string;
  duration: string;
  videoId?: string;
}

const stories: Story[] = [
  {
    title: "Davi e Golias",
    img: avatarDavi,
    desc: "Um menino corajoso enfrenta um gigante",
    color: "from-amber-400 to-orange-500",
    videoId: "_3022-1A6WI",
    story: "Era uma vez um menino chamado Davi...",
    likes: 245,
    emoji: "\u2694\uFE0F",
    duration: "4:30",
  },
  {
    title: "Daniel na Cova dos Le\u00F5es",
    img: avatarDaniel,
    desc: "A f\u00E9 que fechou a boca dos le\u00F5es",
    color: "from-yellow-400 to-amber-500",
    story: "Daniel amava a Deus e orava tr\u00EAs vezes por dia. Mas o rei fez uma lei: ningu\u00E9m podia orar a outro deus, s\u00F3 ao rei!\n\nDaniel n\u00E3o parou de orar. Ele abria a janela e orava a Deus, como sempre fazia.\n\nPor causa disso, Daniel foi jogado na cova dos le\u00F5es! Mas ele n\u00E3o teve medo.\n\n\u2014 Deus vai me proteger! \u2014 disse Daniel.\n\nDeus enviou um anjo que fechou a boca dos le\u00F5es! Na manh\u00E3 seguinte, Daniel estava s\u00E3o e salvo.\n\n\uD83C\uDF1F Li\u00E7\u00E3o: Nunca pare de orar. Deus sempre ouve nossas ora\u00E7\u00F5es e nos protege!",
    likes: 312,
    emoji: "\uD83E\uDD81",
    duration: "3:45",
  },
  {
    title: "Mois\u00E9s e o Mar Vermelho",
    img: avatarMoises,
    desc: "Deus abre caminho pelo mar",
    color: "from-blue-400 to-cyan-500",
    story: "O povo de Israel era escravo no Egito. Deus escolheu Mois\u00E9s para libert\u00E1-los!\n\nMois\u00E9s foi at\u00E9 o Fara\u00F3 e disse: \u2014 Deixe meu povo ir!\n\nO povo chegou na beira do Mar Vermelho. Na frente, o mar. Atr\u00E1s, o ex\u00E9rcito do Fara\u00F3.\n\nMas Deus disse a Mois\u00E9s: \u2014 Levante sua vara sobre o mar!\n\nMois\u00E9s obedeceu, e o mar se abriu em dois! O povo passou pelo meio, em terra seca!\n\n\uD83C\uDF1F Li\u00E7\u00E3o: Quando parece n\u00E3o ter sa\u00EDda, Deus abre o caminho!",
    likes: 189,
    emoji: "\uD83C\uDF0A",
    duration: "5:00",
  },
  {
    title: "Jos\u00E9 do Egito",
    img: avatarJose,
    desc: "De escravo a governador",
    color: "from-purple-400 to-pink-500",
    story: "Jos\u00E9 era o filho favorito de Jac\u00F3 e ganhou uma t\u00FAnica colorida. Seus irm\u00E3os ficaram com ci\u00FAmes e o venderam como escravo!\n\nJos\u00E9 foi levado para o Egito. Mesmo sendo escravo, ele trabalhou duro e Deus estava com ele.\n\nUm dia, o Fara\u00F3 teve um sonho que ningu\u00E9m conseguia explicar. Jos\u00E9 interpretou: viriam 7 anos de fartura e 7 de fome.\n\nO Fara\u00F3 ficou t\u00E3o impressionado que fez Jos\u00E9 governador do Egito!\n\n\uD83C\uDF1F Li\u00E7\u00E3o: Deus pode transformar coisas ruins em coisas boas!",
    likes: 278,
    emoji: "\uD83D\uDC51",
    duration: "4:15",
  },
  {
    title: "Jo\u00E3o Batista",
    img: avatarJoao,
    desc: "O profeta que preparou o caminho",
    color: "from-green-400 to-emerald-500",
    story: "Jo\u00E3o Batista era um profeta especial. Ele vivia no deserto e pregava \u00E0s margens do rio Jord\u00E3o:\n\u2014 Arrependam-se, pois o Reino dos C\u00E9us est\u00E1 pr\u00F3ximo!\n\nUm dia, Jesus veio at\u00E9 Jo\u00E3o para ser batizado. Jo\u00E3o disse:\n\u2014 Eu \u00E9 que preciso ser batizado por Ti!\n\nMas Jesus insistiu, e quando saiu da \u00E1gua, o c\u00E9u se abriu e o Esp\u00EDrito de Deus desceu como uma pomba.\n\n\uD83C\uDF1F Li\u00E7\u00E3o: Deus tem uma miss\u00E3o especial para cada um de n\u00F3s!",
    likes: 156,
    emoji: "\uD83D\uDD4A\uFE0F",
    duration: "3:30",
  },
  {
    title: "O Nascimento de Jesus",
    img: avatarMaria,
    desc: "A maior hist\u00F3ria j\u00E1 contada",
    color: "from-sky-400 to-blue-500",
    story: "Maria era uma jovem bondosa que amava a Deus. Um anjo apareceu e disse:\n\u2014 Maria, voc\u00EA foi escolhida para ser a m\u00E3e do Salvador!\n\nMaria e Jos\u00E9 viajaram para Bel\u00E9m. Jesus nasceu em uma manjedoura, cercado de animais.\n\nUma estrela brilhante apareceu no c\u00E9u! Pastores vieram visitar o beb\u00EA, e anjos cantavam:\n\u2014 Gl\u00F3ria a Deus nas alturas e paz na Terra!\n\n\uD83C\uDF1F Li\u00E7\u00E3o: Jesus veio ao mundo porque Deus nos ama!",
    likes: 421,
    emoji: "\u2B50",
    duration: "4:00",
  },
  {
    title: "Jesus Acalma a Tempestade",
    img: avatarJesus,
    desc: "Paz no meio da tempestade",
    color: "from-indigo-400 to-violet-500",
    story: "Jesus e seus disc\u00EDpulos entraram em um barco. Jesus adormeceu.\n\nDe repente, uma tempestade terr\u00EDvel come\u00E7ou! Os disc\u00EDpulos ficaram apavorados:\n\u2014 Mestre! N\u00F3s vamos afundar!\n\nJesus acordou e disse ao vento e \u00E0s ondas:\n\u2014 Sil\u00EAncio! Acalmem-se!\n\nImediatamente tudo ficou calmo.\n\n\uD83C\uDF1F Li\u00E7\u00E3o: Jesus tem poder sobre todas as coisas. Podemos confiar Nele!",
    likes: 334,
    emoji: "\u26F5",
    duration: "3:15",
  },
  {
    title: "Abra\u00E3o e Isaque",
    img: avatarAbraao,
    desc: "A f\u00E9 que n\u00E3o vacilou",
    color: "from-rose-400 to-red-500",
    story: "Abra\u00E3o esperou muitos anos para ter um filho. Quando j\u00E1 era muito velho, Deus lhe deu Isaque!\n\nMas Deus pediu algo muito dif\u00EDcil: levar Isaque ao monte.\n\nAbra\u00E3o confiava em Deus. Subiu o monte com Isaque.\n\nQuando Abra\u00E3o ia obedecer, um anjo gritou:\n\u2014 Abra\u00E3o! Pare! Agora sei que voc\u00EA teme a Deus!\n\nDeus havia providenciado um carneiro!\n\n\uD83C\uDF1F Li\u00E7\u00E3o: Quando confiamos em Deus, Ele sempre providencia!",
    likes: 198,
    emoji: "\uD83D\uDC11",
    duration: "3:50",
  },
];

export default function Historias() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLike = (idx: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="relative z-10">
        <PageHeader title="Hist\u00F3rias" subtitle="Deslize para ver mais" icon={iconHistorias} />
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {stories.map((s, i) => (
          <div key={i} className="snap-start h-[calc(100vh-80px)] relative flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-b ${s.color} opacity-90`} />

            <div className="relative z-10 flex flex-col items-center px-6 max-w-lg mx-auto w-full">
              <img src={s.img} alt={s.title} className="w-24 h-24 rounded-full border-4 border-white/30 shadow-2xl mb-3" />
              <span className="text-5xl mb-2">{s.emoji}</span>
              <h2 className="font-display text-2xl font-bold text-white text-center drop-shadow-lg">{s.title}</h2>
              <p className="font-body text-sm text-white/80 text-center mt-1 mb-3">{s.desc}</p>

              {s.videoId ? (
                <div className="w-full rounded-2xl overflow-hidden shadow-2xl mb-2" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${s.videoId}?rel=0`}
                    title={s.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-5 max-h-[40vh] overflow-y-auto w-full">
                  <p className="font-body text-white text-sm whitespace-pre-line leading-relaxed">{s.story}</p>
                </div>
              )}
            </div>

            <KwaiSideActions
              likes={s.likes}
              isLiked={liked.has(i)}
              onToggleLike={() => toggleLike(i)}
              duration={s.duration}
              coins={2}
            />

            {i < stories.length - 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce z-20">
                <span className="text-white/60 text-sm font-body">\u2193 Deslize para mais</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
