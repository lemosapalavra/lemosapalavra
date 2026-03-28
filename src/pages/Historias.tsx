import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
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
  { title: "Davi e Golias", img: avatarDavi, desc: "Um menino corajoso enfrenta um gigante", story: "Era uma vez um menino chamado Davi, que cuidava das ovelhas do seu pai. Ele era pequeno, mas tinha um coração enorme e cheio de fé em Deus.\n\nUm dia, um gigante chamado Golias desafiou o exército de Israel. Todos tinham medo dele, mas Davi não!\n\n— Eu vou lutar contra esse gigante! — disse Davi. — Deus vai me ajudar!\n\nDavi pegou cinco pedrinhas e sua funda. Com uma única pedra, acertou Golias na testa, e o gigante caiu!\n\nTodo mundo ficou admirado. Davi venceu porque confiou em Deus, não em suas próprias forças.\n\n🌟 Lição: Não importa o tamanho do seu problema, com Deus ao seu lado, você pode vencer!" },
  { title: "Daniel na Cova dos Leões", img: avatarDaniel, desc: "A fé que fechou a boca dos leões", story: "Daniel amava a Deus e orava três vezes por dia. Mas o rei fez uma lei: ninguém podia orar a outro deus, só ao rei!\n\nDaniel não parou de orar. Ele abria a janela e orava a Deus, como sempre fazia.\n\nPor causa disso, Daniel foi jogado na cova dos leões! Mas ele não teve medo.\n\n— Deus vai me proteger! — disse Daniel.\n\nDeus enviou um anjo que fechou a boca dos leões! Na manhã seguinte, Daniel estava são e salvo.\n\nO rei ficou tão impressionado que mandou todos respeitarem o Deus de Daniel!\n\n🌟 Lição: Nunca pare de orar. Deus sempre ouve nossas orações e nos protege!" },
  { title: "Moisés e o Mar Vermelho", img: avatarMoises, desc: "Deus abre caminho pelo mar", story: "O povo de Israel era escravo no Egito. Deus escolheu Moisés para libertá-los!\n\nMoisés foi até o Faraó e disse: — Deixe meu povo ir!\n\nDepois de muitas pragas, o Faraó deixou o povo sair. Mas logo mudou de ideia e mandou seu exército atrás deles!\n\nO povo chegou na beira do Mar Vermelho. Na frente, o mar. Atrás, o exército do Faraó. Parecia não ter saída!\n\nMas Deus disse a Moisés: — Levante sua vara sobre o mar!\n\nMoisés obedeceu, e o mar se abriu em dois! O povo passou pelo meio, em terra seca!\n\nQuando o exército tentou segui-los, a água voltou e os cobriu.\n\n🌟 Lição: Quando parece não ter saída, Deus abre o caminho!" },
  { title: "José do Egito", img: avatarJose, desc: "De escravo a governador", story: "José era o filho favorito de Jacó e ganhou uma túnica colorida. Seus irmãos ficaram com ciúmes e o venderam como escravo!\n\nJosé foi levado para o Egito. Mesmo sendo escravo, ele trabalhou duro e Deus estava com ele.\n\nDepois de muitas dificuldades, José foi parar na prisão, mas Deus lhe deu o dom de interpretar sonhos.\n\nUm dia, o Faraó teve um sonho que ninguém conseguia explicar. José interpretou: viriam 7 anos de fartura e 7 de fome.\n\nO Faraó ficou tão impressionado que fez José governador do Egito!\n\nAnos depois, seus irmãos vieram pedir comida, sem saber que era José. Ele os perdoou e disse:\n\n— Vocês planejaram o mal, mas Deus transformou em bem!\n\n🌟 Lição: Deus pode transformar coisas ruins em coisas boas!" },
  { title: "João Batista", img: avatarJoao, desc: "O profeta que preparou o caminho", story: "João Batista era um profeta especial. Ele vivia no deserto, vestia roupas de pelo de camelo e comia mel silvestre.\n\nDeus deu a João uma missão importante: preparar o caminho para Jesus!\n\nJoão pregava às margens do rio Jordão:\n— Arrependam-se, pois o Reino dos Céus está próximo!\n\nMuitas pessoas vinham ouvir João e eram batizadas no rio.\n\nUm dia, Jesus veio até João para ser batizado. João disse:\n— Eu é que preciso ser batizado por Ti!\n\nMas Jesus insistiu, e quando saiu da água, o céu se abriu e o Espírito de Deus desceu como uma pomba. Uma voz do céu disse:\n— Este é o meu Filho amado!\n\n🌟 Lição: Deus tem uma missão especial para cada um de nós!" },
  { title: "O Nascimento de Jesus", img: avatarMaria, desc: "A maior história já contada", story: "Maria era uma jovem bondosa que amava a Deus. Um dia, um anjo apareceu e disse:\n— Maria, você foi escolhida para ser a mãe do Salvador!\n\nMaria ficou surpresa, mas disse: — Que aconteça conforme a vontade de Deus.\n\nMaria e José viajaram para Belém. A cidade estava cheia e não havia lugar na hospedaria. Jesus nasceu em uma manjedoura, cercado de animais.\n\nUma estrela brilhante apareceu no céu! Pastores vieram visitar o bebê, e anjos cantavam:\n— Glória a Deus nas alturas e paz na Terra!\n\nReis magos vieram de longe, trazendo presentes: ouro, incenso e mirra.\n\n🌟 Lição: Jesus veio ao mundo porque Deus nos ama e quer estar perto de nós!" },
  { title: "Jesus Acalma a Tempestade", img: avatarJesus, desc: "Paz no meio da tempestade", story: "Um dia, Jesus e seus discípulos entraram em um barco para atravessar o lago. Jesus estava tão cansado que adormeceu.\n\nDe repente, uma tempestade terrível começou! As ondas eram enormes e o barco balançava muito.\n\nOs discípulos ficaram apavorados:\n— Mestre! Mestre! Nós vamos afundar!\n\nJesus acordou, ficou de pé e disse ao vento e às ondas:\n— Silêncio! Acalmem-se!\n\nE imediatamente tudo ficou calmo. O vento parou, o mar ficou liso como um espelho.\n\nOs discípulos ficaram maravilhados:\n— Quem é este que até o vento e o mar obedecem?!\n\n🌟 Lição: Jesus tem poder sobre todas as coisas. Podemos confiar Nele em qualquer situação!" },
  { title: "Abraão e Isaque", img: avatarAbraao, desc: "A fé que não vacilou", story: "Abraão esperou muitos anos para ter um filho. Quando já era muito velho, Deus lhe deu Isaque — o filho da promessa!\n\nAbraão amava Isaque mais que tudo. Mas um dia, Deus pediu algo muito difícil:\n— Abraão, leve Isaque ao monte e ofereça-o a mim.\n\nAbraão ficou triste, mas confiava em Deus. Subiu o monte com Isaque.\n\nIsaque perguntou: — Pai, cadê o cordeiro para o sacrifício?\n\nAbraão respondeu: — Deus vai providenciar, meu filho.\n\nQuando Abraão ia obedecer, um anjo gritou:\n— Abraão! Pare! Agora sei que você teme a Deus!\n\nAbraão olhou e viu um carneiro preso nos arbustos. Deus havia providenciado!\n\n🌟 Lição: Quando confiamos em Deus, Ele sempre providencia o que precisamos!" },
];

export default function Historias() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Histórias" subtitle="Histórias bíblicas para toda família" icon={iconHistorias} />

        {selected === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stories.map((s, i) => (
              <div
                key={i}
                onClick={() => setSelected(i)}
                className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border flex items-center gap-4"
              >
                <img src={s.img} alt={s.title} className="w-16 h-16 rounded-full border-2 border-primary/30" />
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{s.desc}</p>
                  <p className="font-body text-xs text-primary mt-1">Clique para ler →</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-popover rounded-2xl p-6 shadow-lg border border-border">
            <button
              onClick={() => setSelected(null)}
              className="text-primary font-display text-sm font-bold mb-4 hover:underline"
            >
              ← Voltar às histórias
            </button>

            <div className="flex items-center gap-4 mb-4">
              <img src={stories[selected].img} alt={stories[selected].title} className="w-20 h-20 rounded-full border-2 border-primary/30 shadow-md" />
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">{stories[selected].title}</h2>
                <p className="font-body text-sm text-muted-foreground">{stories[selected].desc}</p>
              </div>
            </div>

            <div className="bg-accent/20 rounded-xl p-5">
              <p className="font-body text-foreground whitespace-pre-line leading-relaxed">{stories[selected].story}</p>
            </div>
          </div>
        )}
      </div>
      <FeedbackFooter />
    </div>
  );
}
