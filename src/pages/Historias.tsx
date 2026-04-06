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

const stories = [
  { title: "Davi e Golias", img: avatarDavi, desc: "Um menino corajoso enfrenta um gigante", color: "from-amber-400 to-orange-500", story: "Era uma vez um menino chamado Davi, que cuidava das ovelhas do seu pai. Ele era pequeno, mas tinha um coração enorme e cheio de fé em Deus.\n\nUm dia, um gigante chamado Golias desafiou o exército de Israel. Todos tinham medo dele, mas Davi não!\n\n— Eu vou lutar contra esse gigante! — disse Davi. — Deus vai me ajudar!\n\nDavi pegou cinco pedrinhas e sua funda. Com uma única pedra, acertou Golias na testa, e o gigante caiu!\n\n🌟 Lição: Não importa o tamanho do seu problema, com Deus ao seu lado, você pode vencer!", likes: 245, emoji: "⚔️", duration: "4:30" },
  { title: "Daniel na Cova dos Leões", img: avatarDaniel, desc: "A fé que fechou a boca dos leões", color: "from-yellow-400 to-amber-500", story: "Daniel amava a Deus e orava três vezes por dia. Mas o rei fez uma lei: ninguém podia orar a outro deus, só ao rei!\n\nDaniel não parou de orar. Ele abria a janela e orava a Deus, como sempre fazia.\n\nPor causa disso, Daniel foi jogado na cova dos leões! Mas ele não teve medo.\n\n— Deus vai me proteger! — disse Daniel.\n\nDeus enviou um anjo que fechou a boca dos leões! Na manhã seguinte, Daniel estava são e salvo.\n\n🌟 Lição: Nunca pare de orar. Deus sempre ouve nossas orações e nos protege!", likes: 312, emoji: "🦁", duration: "3:45" },
  { title: "Moisés e o Mar Vermelho", img: avatarMoises, desc: "Deus abre caminho pelo mar", color: "from-blue-400 to-cyan-500", story: "O povo de Israel era escravo no Egito. Deus escolheu Moisés para libertá-los!\n\nMoisés foi até o Faraó e disse: — Deixe meu povo ir!\n\nO povo chegou na beira do Mar Vermelho. Na frente, o mar. Atrás, o exército do Faraó.\n\nMas Deus disse a Moisés: — Levante sua vara sobre o mar!\n\nMoisés obedeceu, e o mar se abriu em dois! O povo passou pelo meio, em terra seca!\n\n🌟 Lição: Quando parece não ter saída, Deus abre o caminho!", likes: 189, emoji: "🌊", duration: "5:00" },
  { title: "José do Egito", img: avatarJose, desc: "De escravo a governador", color: "from-purple-400 to-pink-500", story: "José era o filho favorito de Jacó e ganhou uma túnica colorida. Seus irmãos ficaram com ciúmes e o venderam como escravo!\n\nJosé foi levado para o Egito. Mesmo sendo escravo, ele trabalhou duro e Deus estava com ele.\n\nUm dia, o Faraó teve um sonho que ninguém conseguia explicar. José interpretou: viriam 7 anos de fartura e 7 de fome.\n\nO Faraó ficou tão impressionado que fez José governador do Egito!\n\n🌟 Lição: Deus pode transformar coisas ruins em coisas boas!", likes: 278, emoji: "👑", duration: "4:15" },
  { title: "João Batista", img: avatarJoao, desc: "O profeta que preparou o caminho", color: "from-green-400 to-emerald-500", story: "João Batista era um profeta especial. Ele vivia no deserto e pregava às margens do rio Jordão:\n— Arrependam-se, pois o Reino dos Céus está próximo!\n\nUm dia, Jesus veio até João para ser batizado. João disse:\n— Eu é que preciso ser batizado por Ti!\n\nMas Jesus insistiu, e quando saiu da água, o céu se abriu e o Espírito de Deus desceu como uma pomba.\n\n🌟 Lição: Deus tem uma missão especial para cada um de nós!", likes: 156, emoji: "🕊️", duration: "3:30" },
  { title: "O Nascimento de Jesus", img: avatarMaria, desc: "A maior história já contada", color: "from-sky-400 to-blue-500", story: "Maria era uma jovem bondosa que amava a Deus. Um anjo apareceu e disse:\n— Maria, você foi escolhida para ser a mãe do Salvador!\n\nMaria e José viajaram para Belém. Jesus nasceu em uma manjedoura, cercado de animais.\n\nUma estrela brilhante apareceu no céu! Pastores vieram visitar o bebê, e anjos cantavam:\n— Glória a Deus nas alturas e paz na Terra!\n\n🌟 Lição: Jesus veio ao mundo porque Deus nos ama!", likes: 421, emoji: "⭐", duration: "4:00" },
  { title: "Jesus Acalma a Tempestade", img: avatarJesus, desc: "Paz no meio da tempestade", color: "from-indigo-400 to-violet-500", story: "Jesus e seus discípulos entraram em um barco. Jesus adormeceu.\n\nDe repente, uma tempestade terrível começou! Os discípulos ficaram apavorados:\n— Mestre! Nós vamos afundar!\n\nJesus acordou e disse ao vento e às ondas:\n— Silêncio! Acalmem-se!\n\nImediatamente tudo ficou calmo.\n\n🌟 Lição: Jesus tem poder sobre todas as coisas. Podemos confiar Nele!", likes: 334, emoji: "⛵", duration: "3:15" },
  { title: "Abraão e Isaque", img: avatarAbraao, desc: "A fé que não vacilou", color: "from-rose-400 to-red-500", story: "Abraão esperou muitos anos para ter um filho. Quando já era muito velho, Deus lhe deu Isaque!\n\nMas Deus pediu algo muito difícil: levar Isaque ao monte.\n\nAbraão confiava em Deus. Subiu o monte com Isaque.\n\nQuando Abraão ia obedecer, um anjo gritou:\n— Abraão! Pare! Agora sei que você teme a Deus!\n\nDeus havia providenciado um carneiro!\n\n🌟 Lição: Quando confiamos em Deus, Ele sempre providencia!", likes: 198, emoji: "🐑", duration: "3:50" },
];

export default function Historias() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLike = (idx: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="relative z-10">
        <PageHeader title="Histórias" subtitle="Deslize para ver mais" icon={iconHistorias} />
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

              {(s as any).videoId ? (
                <div className="w-full rounded-2xl overflow-hidden shadow-2xl mb-2" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${(s as any).videoId}?rel=0`}
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
                <span className="text-white/60 text-sm font-body">↓ Deslize para mais</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
