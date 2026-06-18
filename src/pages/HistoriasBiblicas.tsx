import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import iconHistorias from "@/assets/icon-historias.png";

interface Story {
  slug: string;
  title: string;
  subtitle: string;
  reference: string;
  ageRange: string;
  paragraphs: string[];
  lesson: string;
}

const stories: Story[] = [
  {
    slug: "a-criacao",
    title: "A Criação do Mundo",
    subtitle: "Como Deus criou tudo o que existe em sete dias",
    reference: "Gênesis 1 e 2",
    ageRange: "3 a 10 anos",
    paragraphs: [
      "No começo de tudo, antes mesmo de existir o sol, a lua ou as estrelinhas piscando no céu, só existia Deus. E Deus, com muito amor, decidiu criar um mundo lindo para encher de vida.",
      "No primeiro dia, Deus disse: 'Haja luz!' — e a luz apareceu, separando o dia da noite. No segundo dia, Ele fez o céu azul. No terceiro, separou os mares da terra firme e plantou árvores, flores e frutos coloridos.",
      "No quarto dia, Deus colocou o sol para iluminar o dia, a lua e as estrelas para brilharem à noite. No quinto, encheu os mares de peixes e o céu de pássaros que cantam pela manhã.",
      "No sexto dia, Deus criou todos os animais da terra — leões, coelhinhos, elefantes, formigas — e, por último, fez o ser humano à Sua imagem. Adão e Eva foram os primeiros, criados com muito carinho.",
      "No sétimo dia, Deus descansou e abençoou esse dia. Tudo estava perfeito, e Ele viu que tudo era muito bom.",
    ],
    lesson:
      "Cada flor, cada bichinho e cada criança foi pensada por Deus. Você também foi criado com amor e tem um lugar especial neste mundo.",
  },
  {
    slug: "noe-e-a-arca",
    title: "Noé e a Arca",
    subtitle: "A grande viagem que salvou os animais do dilúvio",
    reference: "Gênesis 6 a 9",
    ageRange: "4 a 12 anos",
    paragraphs: [
      "Havia muito tempo que as pessoas tinham se esquecido de Deus e faziam coisas ruins. Mas existia um homem chamado Noé, que amava a Deus e ensinava seus filhos a fazerem o bem.",
      "Deus pediu a Noé que construísse uma arca enorme — um barco grande como um prédio — porque uma chuva muito forte iria cobrir toda a terra. Noé obedeceu, mesmo que os vizinhos rissem dele.",
      "Quando a arca ficou pronta, os animais começaram a chegar em duplas: dois leões, duas girafas, dois coelhinhos, dois passarinhos... Cada espécie entrou junto com Noé, sua esposa, seus três filhos e suas noras.",
      "A chuva caiu por quarenta dias e quarenta noites. A água cobriu até as montanhas mais altas. Mas dentro da arca, todos estavam seguros e protegidos.",
      "Depois de muitos dias, Noé soltou uma pombinha que voltou trazendo uma folhinha verde — sinal de que a terra estava seca de novo. Deus colocou um arco-íris no céu como promessa: nunca mais um dilúvio cobriria toda a terra.",
    ],
    lesson:
      "Quando você confia em Deus e faz o que é certo, mesmo quando ninguém entende, Ele cuida de você como cuidou de Noé e dos animais.",
  },
  {
    slug: "davi-e-golias",
    title: "Davi e Golias",
    subtitle: "O menino corajoso que venceu o gigante com uma funda",
    reference: "1 Samuel 17",
    ageRange: "5 a 12 anos",
    paragraphs: [
      "Davi era um menino pastor que cuidava das ovelhas do seu pai. Era pequeno, mas tinha um coração grande e gostava de cantar para Deus enquanto tocava sua harpinha no campo.",
      "Naquela época, o povo de Israel estava em guerra com os filisteus. O exército inimigo tinha um soldado chamado Golias — um gigante de quase três metros de altura, com uma armadura pesada e uma espada enorme. Todos os soldados de Israel tremiam só de ouvi-lo gritar.",
      "Um dia, Davi foi levar comida para seus irmãos no acampamento e viu o gigante zombando do povo de Deus. Davi disse ao rei Saul: 'Eu vou enfrentá-lo! O mesmo Deus que me ajudou contra o leão e o urso vai me ajudar agora.'",
      "Davi não usou armadura. Pegou apenas sua funda e cinco pedrinhas lisas do riacho. Quando Golias o viu, riu alto. Mas Davi correu, girou a funda e atirou uma pedrinha que acertou bem na testa do gigante. Golias caiu no chão!",
      "O exército de Israel comemorou. Aquele dia, todos aprenderam que o tamanho não importa quando se tem fé em Deus.",
    ],
    lesson:
      "Você pode ser pequeno, mas com Deus do seu lado, nenhum medo é grande demais. A fé vale mais do que armas e tamanho.",
  },
  {
    slug: "jonas-e-a-baleia",
    title: "Jonas e a Baleia",
    subtitle: "O profeta que aprendeu a obedecer a Deus dentro de um peixe gigante",
    reference: "Livro de Jonas",
    ageRange: "4 a 10 anos",
    paragraphs: [
      "Deus pediu a Jonas que fosse à cidade de Nínive avisar o povo para parar de fazer coisas erradas. Mas Jonas teve medo e tentou fugir num barco para o lado contrário!",
      "No meio do mar, uma tempestade enorme começou a sacudir o barco. Os marinheiros ficaram apavorados. Jonas, então, contou que estava fugindo de Deus e pediu que o jogassem no mar.",
      "Quando Jonas caiu na água, um peixe gigantesco apareceu e o engoliu inteirinho! Lá dentro, no escuro, Jonas orou a Deus e pediu perdão por ter desobedecido.",
      "Depois de três dias, o peixe levou Jonas até a praia e o devolveu, são e salvo. Dessa vez, Jonas correu para Nínive e contou a mensagem de Deus. O povo todo se arrependeu e Deus os perdoou.",
    ],
    lesson:
      "Quando Deus pede algo para você, é sempre por amor. Obedecer logo é o caminho mais feliz — e Ele dá novas chances quando a gente erra.",
  },
  {
    slug: "daniel-na-cova-dos-leoes",
    title: "Daniel na Cova dos Leões",
    subtitle: "Como a oração protegeu Daniel dos leões famintos",
    reference: "Daniel 6",
    ageRange: "5 a 12 anos",
    paragraphs: [
      "Daniel era um homem muito sábio que servia o rei Dario, mas, acima de tudo, amava muito a Deus. Todos os dias, três vezes ao dia, ele se ajoelhava perto da janela e fazia uma oração.",
      "Alguns invejosos convenceram o rei a fazer uma lei: por trinta dias, ninguém poderia orar a outro deus além do próprio rei. Quem desobedecesse seria jogado na cova dos leões!",
      "Daniel ficou sabendo, mas continuou orando como sempre. Os invejosos correram para contar ao rei. Triste, o rei foi obrigado a cumprir a lei e mandou Daniel para a cova.",
      "Mas Deus enviou um anjo que fechou a boca dos leões. Daniel passou a noite inteira lá dentro, sem nenhum arranhão! Pela manhã, o rei correu até a cova e ouviu a voz de Daniel: 'Meu Deus me livrou!'",
    ],
    lesson:
      "Falar com Deus todos os dias é um tesouro. Mesmo nas situações mais difíceis, a oração tem o poder de proteger seu coração.",
  },
];

export default function HistoriasBiblicas() {
  return (
    <>
      <Helmet>
        <title>História Bíblica Infantil — Histórias da Bíblia para Crianças | Lemos a Palavra</title>
        <meta
          name="description"
          content="Coleção de história bíblica infantil em linguagem simples e cartoon: A Criação, Noé e a Arca, Davi e Golias, Jonas, Daniel e mais. Ideal para pais, educadores e escola dominical."
        />
        <link rel="canonical" href="https://lemosapalavra.lovable.app/historias-biblicas" />
        <meta property="og:title" content="História Bíblica Infantil — Histórias da Bíblia para Crianças" />
        <meta
          property="og:description"
          content="Histórias bíblicas infantis em formato narrativo, divertido e cartoon, com lição para o coração das crianças."
        />
        <meta property="og:url" content="https://lemosapalavra.lovable.app/historias-biblicas" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Histórias Bíblicas Infantis",
            description:
              "Coleção de histórias da Bíblia recontadas em linguagem infantil, com lições de fé e valores cristãos.",
            inLanguage: "pt-BR",
            url: "https://lemosapalavra.lovable.app/historias-biblicas",
            hasPart: stories.map((s) => ({
              "@type": "Article",
              headline: s.title,
              about: s.reference,
              url: `https://lemosapalavra.lovable.app/historias-biblicas#${s.slug}`,
            })),
          })}
        </script>
      </Helmet>

      <div
        className="min-h-screen py-4 px-4"
        style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
      >
        <div className="max-w-3xl mx-auto">
          <PageHeader
            title="Histórias Bíblicas Infantis"
            subtitle="Histórias da Bíblia recontadas para crianças"
            icon={iconHistorias}
          />

          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white shadow text-primary font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para o início
          </Link>

          <article className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-5 sm:p-7 mb-6 border border-amber-200">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mb-3">
              História Bíblica Infantil: aprenda a Bíblia brincando
            </h1>
            <p className="font-body text-foreground/85 leading-relaxed mb-3">
              Aqui você encontra uma coleção de <strong>história bíblica infantil</strong> contada
              de um jeito simples, divertido e em estilo cartoon, perfeita para crianças de 3 a 12
              anos, pais, professores de escola dominical e educadores cristãos.
            </p>
            <p className="font-body text-foreground/85 leading-relaxed">
              Cada história foi reescrita para ser fácil de entender, manter a atenção das crianças
              e terminar com uma lição preciosa para o coração. Escolha uma história abaixo e leia
              junto com a família.
            </p>
          </article>

          <nav aria-label="Lista de histórias" className="mb-6">
            <h2 className="font-display text-xl font-bold text-primary mb-3">
              Histórias da Bíblia para crianças
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {stories.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`#${s.slug}`}
                    className="flex items-center gap-2 bg-white/70 hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-amber-200 text-primary font-bold transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {stories.map((s) => (
            <article
              key={s.slug}
              id={s.slug}
              className="bg-white/85 backdrop-blur rounded-2xl shadow-lg p-5 sm:p-7 mb-6 border border-amber-200 scroll-mt-24"
            >
              <header className="mb-3">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
                  {s.title}
                </h2>
                <p className="font-body text-sm text-foreground/70 italic">{s.subtitle}</p>
                <p className="font-body text-xs text-foreground/60 mt-1">
                  <strong>Referência bíblica:</strong> {s.reference} ·{" "}
                  <strong>Indicada para:</strong> {s.ageRange}
                </p>
              </header>

              {s.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="font-body text-foreground/90 leading-relaxed mb-3 text-[15px] sm:text-base"
                >
                  {p}
                </p>
              ))}

              <aside className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-300">
                <p className="font-display font-bold text-amber-900 mb-1">💛 Lição da história</p>
                <p className="font-body text-amber-950 leading-relaxed">{s.lesson}</p>
              </aside>
            </article>
          ))}

          <section className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-5 sm:p-7 mb-10 border border-amber-200">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-3">
              Como usar estas histórias bíblicas com crianças
            </h2>
            <ul className="font-body text-foreground/85 leading-relaxed list-disc pl-5 space-y-2">
              <li>
                <strong>Em casa:</strong> leia uma história por noite, antes de dormir, e converse
                sobre a lição com seu filho.
              </li>
              <li>
                <strong>Na escola dominical:</strong> use a referência bíblica indicada para abrir
                a Bíblia e mostrar a história original.
              </li>
              <li>
                <strong>Atividades:</strong> peça à criança para desenhar o personagem favorito ou
                recontar a história com as próprias palavras.
              </li>
              <li>
                <strong>Memorização:</strong> escolha uma frase da lição da semana para a criança
                guardar no coração.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
