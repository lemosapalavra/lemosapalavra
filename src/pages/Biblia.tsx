import { useState, lazy, Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import iconBiblia from "@/assets/icon-biblia.png";
import iconVT from "@/assets/icon-velho-testamento.jpg";
import iconNT from "@/assets/icon-novo-testamento.jpg";
import iconDic from "@/assets/icon-dicionario.jpg";

const antigoTestamento = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
  "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel",
  "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras",
  "Neemias", "Ester", "Jó", "Salmos", "Provérbios",
  "Eclesiastes", "Cânticos", "Isaías", "Jeremias", "Lamentações",
  "Ezequiel", "Daniel", "Oséias", "Joel", "Amós",
  "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque",
  "Sofonias", "Ageu", "Zacarias", "Malaquias",
];

const novoTestamento = [
  "Mateus", "Marcos", "Lucas", "João", "Atos",
  "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios",
  "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
  "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus",
  "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João",
  "3 João", "Judas", "Apocalipse",
];

// Simplified book summaries for when user clicks
const bookSummaries: Record<string, string> = {
  "Gênesis": "O livro dos começos: criação do mundo, Adão e Eva, Noé, Abraão, Isaque, Jacó e José. Mostra como Deus criou tudo e escolheu um povo para Si.",
  "Êxodo": "A saída do Egito: Moisés liberta o povo de Israel da escravidão, as 10 pragas, a travessia do Mar Vermelho e os Dez Mandamentos no Monte Sinai.",
  "Levítico": "Leis de santidade: regras para sacrifícios, festas e a vida do povo de Deus. Ensina que Deus é santo e quer que Seu povo também seja.",
  "Números": "A jornada no deserto: contagem do povo, as murmurações, os espias e a peregrinação de 40 anos até a Terra Prometida.",
  "Deuteronômio": "A segunda lei: Moisés repete as leis de Deus e despede-se do povo antes de entrarem na Terra Prometida.",
  "Josué": "A conquista da Terra Prometida: Josué lidera Israel na travessia do Jordão, a queda de Jericó e a divisão da terra entre as tribos.",
  "Juízes": "Ciclos de pecado e libertação: Deus levanta juízes como Gideão, Sansão e Débora para salvar Israel de seus inimigos.",
  "Rute": "História de amor e fidelidade: Rute, uma estrangeira, escolhe seguir o Deus de Israel e se torna ancestral do rei Davi.",
  "1 Samuel": "De Samuel a Saul: o último juiz, a escolha do primeiro rei e a ascensão do jovem Davi.",
  "2 Samuel": "O reinado de Davi: suas vitórias, seu pecado e as consequências, mas também o coração de adorador.",
  "1 Reis": "Salomão e a divisão: a sabedoria de Salomão, a construção do Templo e a divisão do reino em dois.",
  "2 Reis": "Reis e profetas: a história dos reis de Israel e Judá até o exílio na Babilônia.",
  "1 Crônicas": "A genealogia e o reinado de Davi sob a perspectiva da adoração e do Templo.",
  "2 Crônicas": "De Salomão ao exílio: a história de Judá com foco no Templo e na adoração.",
  "Esdras": "O retorno do exílio: o povo volta da Babilônia e reconstrói o Templo de Jerusalém.",
  "Neemias": "A reconstrução dos muros: Neemias lidera a restauração de Jerusalém com fé e determinação.",
  "Ester": "Coragem real: a rainha Ester arrisca sua vida para salvar o povo judeu da destruição.",
  "Jó": "O sofrimento do justo: Jó perde tudo mas mantém a fé, e Deus o restaura duplamente.",
  "Salmos": "O livro de orações e louvores: 150 cânticos que expressam alegria, dor, esperança e adoração a Deus.",
  "Provérbios": "Sabedoria para a vida: conselhos práticos de Salomão para viver com sabedoria e temor a Deus.",
  "Eclesiastes": "O sentido da vida: reflexões sobre a vaidade das coisas e o verdadeiro propósito da existência.",
  "Cânticos": "O cântico do amor: poema de amor entre o noivo e a noiva, simbolizando o amor de Deus pelo Seu povo.",
  "Isaías": "O profeta messiânico: visões da glória de Deus, profecias sobre Jesus e a esperança de salvação.",
  "Jeremias": "O profeta chorão: alertas sobre o juízo de Deus, mas também promessas de uma nova aliança.",
  "Lamentações": "Lamentos pela destruição de Jerusalém, mas com esperança na fidelidade de Deus.",
  "Ezequiel": "Visões de glória: o profeta no exílio vê a glória de Deus e profetiza a restauração de Israel.",
  "Daniel": "Fé na adversidade: Daniel e seus amigos permanecem fiéis a Deus na Babilônia; visões proféticas.",
  "Oséias": "Amor fiel: Deus ama Israel como um esposo fiel, mesmo quando o povo é infiel.",
  "Joel": "O Dia do Senhor: chamado ao arrependimento e promessa do derramamento do Espírito Santo.",
  "Amós": "Justiça social: o profeta pastor denuncia a opressão e a injustiça em Israel.",
  "Obadias": "O julgamento de Edom: o menor livro do AT anuncia o juízo contra o orgulho.",
  "Jonas": "O profeta relutante: Jonas foge de Deus, é engolido por um peixe e prega em Nínive.",
  "Miquéias": "Justiça e misericórdia: profecias sobre o nascimento do Messias em Belém.",
  "Naum": "A queda de Nínive: Deus é justo e julga as nações que oprimem Seu povo.",
  "Habacuque": "Diálogo com Deus: o profeta questiona a injustiça e aprende a viver pela fé.",
  "Sofonias": "O Dia do Senhor: juízo sobre as nações e promessa de restauração.",
  "Ageu": "Reconstruam o Templo: Deus encoraja o povo a priorizar Sua casa.",
  "Zacarias": "Visões de esperança: profecias messiânicas e a restauração de Jerusalém.",
  "Malaquias": "O último profeta: Deus repreende a desobediência e promete enviar Seu mensageiro.",
  "Mateus": "Jesus, o Rei: o Evangelho que mostra Jesus como o Messias prometido a Israel.",
  "Marcos": "Jesus, o Servo: o Evangelho mais curto, cheio de ação e milagres de Jesus.",
  "Lucas": "Jesus, o Salvador: o Evangelho mais detalhado, mostrando Jesus como amigo de todos.",
  "João": "Jesus, o Filho de Deus: o Evangelho espiritual que revela a divindade de Jesus.",
  "Atos": "A Igreja nasce: o Espírito Santo desce, os apóstolos pregam e a Igreja se espalha pelo mundo.",
  "Romanos": "A justificação pela fé: Paulo explica como somos salvos pela graça de Deus.",
  "1 Coríntios": "Problemas na igreja: Paulo orienta sobre divisões, dons espirituais e o amor.",
  "2 Coríntios": "O ministério de Paulo: defesa de seu apostolado e a força na fraqueza.",
  "Gálatas": "Liberdade em Cristo: Paulo combate o legalismo e ensina sobre a graça.",
  "Efésios": "A Igreja de Cristo: unidade, armadura de Deus e vida no Espírito.",
  "Filipenses": "Alegria em Cristo: Paulo escreve da prisão sobre alegria e contentamento.",
  "Colossenses": "A supremacia de Cristo: Jesus é acima de tudo e suficiente para tudo.",
  "1 Tessalonicenses": "A volta de Jesus: Paulo encoraja sobre a esperança da segunda vinda.",
  "2 Tessalonicenses": "Firmeza na fé: instruções sobre o Dia do Senhor e a perseverança.",
  "1 Timóteo": "Instruções pastorais: Paulo orienta seu jovem discípulo no ministério.",
  "2 Timóteo": "Última carta de Paulo: encorajamento para permanecer firme na fé.",
  "Tito": "Liderança saudável: instruções sobre a organização da igreja em Creta.",
  "Filemom": "Perdão e reconciliação: Paulo intercede pelo escravo Onésimo.",
  "Hebreus": "Cristo é superior: Jesus é maior que os anjos, Moisés e os sacerdotes.",
  "Tiago": "Fé com obras: a verdadeira fé se demonstra através das ações.",
  "1 Pedro": "Esperança no sofrimento: encorajamento para cristãos perseguidos.",
  "2 Pedro": "Crescimento espiritual: alertas contra falsos mestres.",
  "1 João": "Deus é amor: certeza da salvação e a importância de amar uns aos outros.",
  "2 João": "Caminhar na verdade: breve carta sobre verdade e amor.",
  "3 João": "Hospitalidade cristã: elogio aos fiéis e repreensão aos orgulhosos.",
  "Judas": "Contender pela fé: alerta contra falsos mestres que corrompem a graça.",
  "Apocalipse": "A revelação final: visões de Jesus glorificado, o juízo final e o novo céu e nova terra.",
};

const dicionario: { term: string; def: string }[] = [
  { term: "Aarão", def: "Irmão de Moisés, primeiro sumo sacerdote de Israel." },
  { term: "Abade", def: "Superior de um mosteiro ou comunidade religiosa." },
  { term: "Abba", def: "Palavra aramaica para 'Pai', usada por Jesus para se referir a Deus." },
  { term: "Abel", def: "Segundo filho de Adão e Eva, morto por seu irmão Caim." },
  { term: "Abençoar", def: "Invocar o favor divino sobre alguém ou algo." },
  { term: "Abismo", def: "Lugar de confinamento de demônios; profundeza sem fim." },
  { term: "Abominação", def: "Algo que causa repulsa a Deus; prática detestável." },
  { term: "Abraão", def: "Pai da fé, chamado por Deus para ser pai de muitas nações." },
  { term: "Absolvição", def: "Perdão dos pecados concedido por Deus." },
  { term: "Acácia", def: "Madeira usada na construção da Arca da Aliança e do Tabernáculo." },
  { term: "Adoração", def: "Ato de reverência e louvor a Deus, reconhecendo Sua grandeza." },
  { term: "Advento", def: "Período de preparação para a celebração do nascimento de Cristo." },
  { term: "Aflição", def: "Sofrimento ou tribulação que pode levar ao crescimento espiritual." },
  { term: "Ágape", def: "Amor incondicional de Deus; a forma mais elevada de amor." },
  { term: "Ageu", def: "Profeta que encorajou a reconstrução do Templo de Jerusalém." },
  { term: "Água Viva", def: "Símbolo do Espírito Santo e da vida eterna em Cristo." },
  { term: "Aleluia", def: "Expressão de louvor que significa 'Louvai ao Senhor'." },
  { term: "Alfa e Ômega", def: "Primeiro e último; título de Cristo como princípio e fim de tudo." },
  { term: "Aliança", def: "Acordo entre Deus e Seu povo, com promessas e compromissos." },
  { term: "Altar", def: "Local sagrado onde se ofereciam sacrifícios a Deus." },
  { term: "Amém", def: "Palavra que significa 'assim seja'; afirmação de concordância." },
  { term: "Amós", def: "Profeta pastor que pregou contra a injustiça social em Israel." },
  { term: "Anátema", def: "Maldição ou separação de algo consagrado a Deus." },
  { term: "Ancião", def: "Líder respeitado na comunidade de fé; presbítero." },
  { term: "André", def: "Apóstolo de Jesus, irmão de Pedro, primeiro a ser chamado." },
  { term: "Anjo", def: "Mensageiro celestial enviado por Deus para cumprir Sua vontade." },
  { term: "Anunciação", def: "Quando o anjo Gabriel anunciou a Maria que ela seria mãe de Jesus." },
  { term: "Apocalipse", def: "Revelação divina sobre os últimos tempos; último livro da Bíblia." },
  { term: "Apóstolo", def: "Discípulo enviado por Jesus para pregar o Evangelho ao mundo." },
  { term: "Arca da Aliança", def: "Baú sagrado que continha as Tábuas da Lei, a vara de Arão e o maná." },
  { term: "Arca de Noé", def: "Embarcação construída por Noé para salvar sua família e os animais do dilúvio." },
  { term: "Arrependimento", def: "Mudança de mente e coração, voltando-se do pecado para Deus." },
  { term: "Ascensão", def: "A subida de Jesus ao céu, quarenta dias após Sua ressurreição." },
  { term: "Assembleia", def: "Reunião do povo de Deus para adoração e instrução." },
  { term: "Atos dos Apóstolos", def: "Livro que narra a história da Igreja primitiva após a ascensão de Jesus." },
  { term: "Autoridade", def: "Poder legítimo dado por Deus para governar ou ensinar." },
  { term: "Avivamento", def: "Renovação espiritual que traz novo vigor à fé." },
  { term: "Baal", def: "Falso deus dos cananeus; ídolo combatido pelos profetas." },
  { term: "Babel", def: "Torre construída pelos homens; símbolo de orgulho e confusão." },
  { term: "Babilônia", def: "Império que conquistou Judá; símbolo de pecado e opressão." },
  { term: "Batismo", def: "Rito de purificação e entrada na comunidade cristã." },
  { term: "Beatitude", def: "Bem-aventurança; declaração de felicidade espiritual feita por Jesus." },
  { term: "Belém", def: "Cidade onde Jesus nasceu; significa 'Casa do Pão'." },
  { term: "Bênção", def: "Favor divino derramado sobre pessoas, coisas ou situações." },
  { term: "Bereia", def: "Cidade onde os crentes examinavam as Escrituras diariamente." },
  { term: "Betânia", def: "Aldeia próxima a Jerusalém onde viviam Lázaro, Marta e Maria." },
  { term: "Bíblia", def: "A Palavra de Deus; coleção de livros sagrados do Antigo e Novo Testamento." },
  { term: "Blasfêmia", def: "Falar de modo irreverente contra Deus ou coisas sagradas." },
  { term: "Cafarnaum", def: "Cidade à beira do Mar da Galileia onde Jesus fez muitos milagres." },
  { term: "Caim", def: "Primeiro filho de Adão e Eva; matou seu irmão Abel." },
  { term: "Cálice", def: "Copa usada na Última Ceia; símbolo do sangue de Cristo." },
  { term: "Calvário", def: "Monte onde Jesus foi crucificado; também chamado Gólgota." },
  { term: "Caminho", def: "Jesus disse: 'Eu sou o Caminho, a Verdade e a Vida'." },
  { term: "Canaã", def: "Terra Prometida por Deus a Abraão e seus descendentes." },
  { term: "Cânon", def: "Lista oficial dos livros aceitos como parte da Bíblia Sagrada." },
  { term: "Cânticos", def: "Livro poético da Bíblia que celebra o amor." },
  { term: "Caridade", def: "Amor ao próximo demonstrado através de ações bondosas." },
  { term: "Carne", def: "Natureza humana pecaminosa, em oposição ao Espírito." },
  { term: "Cenáculo", def: "Sala superior onde Jesus celebrou a Última Ceia com os discípulos." },
  { term: "Centurião", def: "Oficial romano que comandava cem soldados; alguns tiveram fé em Jesus." },
  { term: "Circuncisão", def: "Sinal da aliança entre Deus e Abraão, praticado nos meninos judeus." },
  { term: "Cisma", def: "Divisão dentro da igreja ou comunidade de fé." },
  { term: "Clamor", def: "Oração fervorosa e urgente dirigida a Deus." },
  { term: "Colossenses", def: "Carta de Paulo à igreja em Colossos sobre a supremacia de Cristo." },
  { term: "Comunhão", def: "Participação em comum da vida cristã; celebração da Ceia do Senhor." },
  { term: "Concílio", def: "Assembleia de líderes da igreja para decidir questões de fé." },
  { term: "Condenação", def: "Sentença de punição pelo pecado; separação de Deus." },
  { term: "Confissão", def: "Reconhecimento dos pecados diante de Deus, buscando perdão." },
  { term: "Consagração", def: "Ato de dedicar algo ou alguém ao serviço de Deus." },
  { term: "Consolação", def: "Conforto divino dado em tempos de tristeza ou sofrimento." },
  { term: "Conversão", def: "Transformação radical de vida ao aceitar Jesus como Salvador." },
  { term: "Cordeiro", def: "Símbolo de Jesus Cristo como sacrifício pelos pecados do mundo." },
  { term: "Corinto", def: "Cidade grega onde Paulo fundou uma igreja." },
  { term: "Coroa", def: "Símbolo de recompensa eterna para os fiéis." },
  { term: "Criação", def: "Ato divino de trazer todas as coisas à existência." },
  { term: "Cristo", def: "O Ungido; título de Jesus como o Messias prometido." },
  { term: "Crucificação", def: "Método de execução pelo qual Jesus morreu pelos pecados da humanidade." },
  { term: "Cruz", def: "Instrumento da morte de Jesus; símbolo central da fé cristã." },
  { term: "Culto", def: "Reunião para adoração, oração e ensino da Palavra de Deus." },
  { term: "Davi", def: "Rei de Israel, autor de muitos Salmos, ancestral de Jesus." },
  { term: "Decálogo", def: "Os Dez Mandamentos dados por Deus a Moisés no Monte Sinai." },
  { term: "Demônio", def: "Espírito maligno que se opõe a Deus e tenta os seres humanos." },
  { term: "Deserto", def: "Lugar de provação e encontro com Deus na Bíblia." },
  { term: "Deuteronômio", def: "Quinto livro da Bíblia; segunda lei dada por Moisés." },
  { term: "Deus", def: "O Criador do universo, Todo-Poderoso, eterno e amoroso." },
  { term: "Devocional", def: "Momento de meditação e oração pessoal com Deus." },
  { term: "Diácono", def: "Servo da igreja que auxilia nas necessidades práticas da congregação." },
  { term: "Dilúvio", def: "Inundação universal enviada por Deus nos dias de Noé." },
  { term: "Discípulo", def: "Seguidor e aprendiz de Jesus Cristo." },
  { term: "Dízimo", def: "Oferta de dez por cento da renda, dedicada a Deus." },
  { term: "Doutrina", def: "Ensino sistemático das verdades da fé cristã." },
  { term: "Eclesiastes", def: "Livro da Bíblia que reflete sobre o sentido da vida." },
  { term: "Éden", def: "Jardim paradisíaco criado por Deus para Adão e Eva." },
  { term: "Efésios", def: "Carta de Paulo à igreja em Éfeso sobre a unidade em Cristo." },
  { term: "Eleição", def: "Escolha soberana de Deus de pessoas para Seu propósito." },
  { term: "Elias", def: "Profeta poderoso que confrontou os profetas de Baal." },
  { term: "Eliseu", def: "Profeta sucessor de Elias, realizou muitos milagres." },
  { term: "Emanuel", def: "Nome que significa 'Deus conosco'; título profético de Jesus." },
  { term: "Encarnação", def: "Deus se fez carne na pessoa de Jesus Cristo." },
  { term: "Epifania", def: "Manifestação de Deus; celebração da visita dos Reis Magos." },
  { term: "Epístola", def: "Carta escrita pelos apóstolos às igrejas primitivas." },
  { term: "Escatologia", def: "Estudo das últimas coisas: morte, juízo, céu e inferno." },
  { term: "Escrituras", def: "Os textos sagrados da Bíblia, inspirados por Deus." },
  { term: "Esperança", def: "Confiança firme nas promessas de Deus para o futuro." },
  { term: "Espírito Santo", def: "Terceira pessoa da Trindade; Deus presente e ativo nos crentes." },
  { term: "Ester", def: "Rainha judia que salvou seu povo da destruição na Pérsia." },
  { term: "Eternidade", def: "Existência sem fim; vida com Deus para sempre." },
  { term: "Eucaristia", def: "Celebração da Ceia do Senhor; ação de graças." },
  { term: "Eva", def: "Primeira mulher criada por Deus, mãe da humanidade." },
  { term: "Evangelho", def: "A boa notícia da salvação em Jesus Cristo." },
  { term: "Evangelista", def: "Pessoa que proclama o Evangelho; autor dos quatro Evangelhos." },
  { term: "Exílio", def: "Período em que o povo de Israel foi levado cativo para a Babilônia." },
  { term: "Êxodo", def: "Saída dos israelitas do Egito sob a liderança de Moisés." },
  { term: "Expiação", def: "Remoção do pecado através do sacrifício de Cristo." },
  { term: "Ezequiel", def: "Profeta que teve visões da glória de Deus durante o exílio." },
  { term: "Faraó", def: "Título dos reis do Egito; opressor do povo de Israel." },
  { term: "Fariseu", def: "Membro de grupo religioso judaico que enfatizava a lei." },
  { term: "Fé", def: "Confiança e crença em Deus e em Suas promessas." },
  { term: "Felicidade", def: "Estado de bem-aventurança que vem de uma vida com Deus." },
  { term: "Festa dos Tabernáculos", def: "Celebração judaica da colheita e da peregrinação no deserto." },
  { term: "Filemom", def: "Carta de Paulo pedindo perdão para o escravo Onésimo." },
  { term: "Filipenses", def: "Carta de Paulo à igreja em Filipos sobre a alegria em Cristo." },
  { term: "Frutos do Espírito", def: "Amor, alegria, paz, paciência, benignidade, bondade, fé, mansidão, domínio próprio." },
  { term: "Gálatas", def: "Carta de Paulo sobre a liberdade em Cristo e contra o legalismo." },
  { term: "Galileia", def: "Região no norte de Israel onde Jesus cresceu e iniciou Seu ministério." },
  { term: "Genealogia", def: "Lista de ancestrais; a linhagem de Jesus é registrada nos Evangelhos." },
  { term: "Gênesis", def: "Primeiro livro da Bíblia; narra a criação do mundo." },
  { term: "Gentio", def: "Pessoa não judia; as nações fora de Israel." },
  { term: "Getsêmani", def: "Jardim onde Jesus orou antes de Sua prisão." },
  { term: "Glória", def: "Esplendor e majestade de Deus; Sua presença manifestada." },
  { term: "Golias", def: "Gigante filisteu derrotado pelo jovem Davi." },
  { term: "Graça", def: "Favor imerecido de Deus para com a humanidade." },
  { term: "Habacuque", def: "Profeta que questionou Deus sobre a injustiça." },
  { term: "Hebreus", def: "Carta sobre a superioridade de Cristo." },
  { term: "Heresia", def: "Ensino contrário às doutrinas fundamentais da fé cristã." },
  { term: "Herodes", def: "Rei da Judeia que tentou matar o menino Jesus." },
  { term: "Holocausto", def: "Sacrifício totalmente queimado em oferta a Deus." },
  { term: "Hosana", def: "Exclamação de louvor: 'Salva-nos, Senhor'." },
  { term: "Humildade", def: "Virtude de reconhecer a dependência de Deus." },
  { term: "Idolatria", def: "Adoração de falsos deuses." },
  { term: "Igreja", def: "Corpo de Cristo; comunidade dos crentes." },
  { term: "Imaculada", def: "Sem mancha; referente à pureza." },
  { term: "Imposição de Mãos", def: "Gesto de bênção, cura ou consagração." },
  { term: "Incenso", def: "Substância aromática queimada como oferta no Templo." },
  { term: "Intercessão", def: "Orar por outras pessoas." },
  { term: "Isaías", def: "Grande profeta que anunciou a vinda do Messias." },
  { term: "Isaque", def: "Filho de Abraão e Sara, filho da promessa." },
  { term: "Israel", def: "Nação escolhida por Deus; também nome dado a Jacó." },
  { term: "Jacó", def: "Filho de Isaque, pai das doze tribos de Israel." },
  { term: "Jejum", def: "Abstinência voluntária de alimento para buscar a Deus." },
  { term: "Jeremias", def: "Profeta chorão que pregou contra a idolatria." },
  { term: "Jericó", def: "Cidade cujas muralhas caíram pela fé." },
  { term: "Jerusalém", def: "Cidade Santa; centro religioso de Israel." },
  { term: "Jesus", def: "Filho de Deus, Salvador do mundo." },
  { term: "Jezabel", def: "Rainha ímpia que promoveu a idolatria." },
  { term: "Jó", def: "Homem justo que sofreu mas manteve a fé." },
  { term: "João", def: "Apóstolo amado de Jesus." },
  { term: "João Batista", def: "Profeta que preparou o caminho para Jesus." },
  { term: "Joel", def: "Profeta que anunciou o derramamento do Espírito Santo." },
  { term: "Jonas", def: "Profeta engolido por um grande peixe." },
  { term: "Jordão", def: "Rio onde Jesus foi batizado." },
  { term: "José", def: "Filho de Jacó vendido; tornou-se governador do Egito." },
  { term: "Josué", def: "Sucessor de Moisés na conquista da Terra Prometida." },
  { term: "Jubileu", def: "Ano de libertação celebrado a cada 50 anos." },
  { term: "Judas Iscariotes", def: "Discípulo que traiu Jesus." },
  { term: "Judá", def: "Tribo real da qual Jesus descende." },
  { term: "Juízo", def: "Ato de Deus de julgar as ações humanas." },
  { term: "Juízo Final", def: "Julgamento definitivo de toda a humanidade." },
  { term: "Justiça", def: "Retidão moral conforme a vontade de Deus." },
  { term: "Justificação", def: "Deus declara o pecador justo pela fé." },
  { term: "Lamentações", def: "Livro de lamentos pela destruição de Jerusalém." },
  { term: "Lavagem dos Pés", def: "Ato de Jesus como exemplo de serviço." },
  { term: "Lázaro", def: "Amigo de Jesus que foi ressuscitado." },
  { term: "Lei", def: "Os mandamentos dados por Deus a Israel." },
  { term: "Levita", def: "Membro da tribo de Levi, dedicado ao serviço do Templo." },
  { term: "Levítico", def: "Terceiro livro da Bíblia com leis sobre sacrifícios." },
  { term: "Liberdade", def: "Livramento do pecado através de Cristo." },
  { term: "Livro da Vida", def: "Registro celestial dos nomes dos que são salvos." },
  { term: "Louvor", def: "Expressão de gratidão e adoração a Deus." },
  { term: "Lucas", def: "Médico e autor do terceiro Evangelho." },
  { term: "Luz", def: "Símbolo de Deus e verdade; Jesus é a Luz do Mundo." },
  { term: "Maná", def: "Alimento milagroso dado por Deus no deserto." },
  { term: "Mandamento", def: "Ordem divina para guiar a conduta." },
  { term: "Marcos", def: "Autor do segundo Evangelho." },
  { term: "Maria", def: "Mãe de Jesus, escolhida por Deus." },
  { term: "Maria Madalena", def: "Primeira testemunha da ressurreição." },
  { term: "Marta", def: "Irmã de Lázaro, conhecida por sua hospitalidade." },
  { term: "Mártir", def: "Pessoa que morre pela fé em Cristo." },
  { term: "Mateus", def: "Cobrador de impostos que se tornou apóstolo." },
  { term: "Mediador", def: "Jesus é o mediador entre Deus e os homens." },
  { term: "Meditação", def: "Reflexão profunda sobre a Palavra de Deus." },
  { term: "Melquisedeque", def: "Sacerdote e rei de Salém; prefiguração de Cristo." },
  { term: "Messias", def: "O Ungido de Deus; o Salvador prometido." },
  { term: "Milagre", def: "Evento sobrenatural realizado pelo poder de Deus." },
  { term: "Ministério", def: "Serviço dedicado a Deus e ao próximo." },
  { term: "Mirra", def: "Resina aromática usada no sepultamento de Jesus." },
  { term: "Misericórdia", def: "Compaixão de Deus que perdoa." },
  { term: "Missão", def: "Tarefa dada por Deus para espalhar o Evangelho." },
  { term: "Missionário", def: "Pessoa enviada para pregar o Evangelho." },
  { term: "Moisés", def: "Líder que tirou Israel do Egito." },
  { term: "Monte Sinai", def: "Montanha onde Deus entregou a Lei." },
  { term: "Morte", def: "Separação da alma do corpo; vencida por Cristo." },
  { term: "Mundo", def: "Sistema de valores contrários a Deus." },
  { term: "Murmuração", def: "Queixa contra Deus; atitude condenada." },
  { term: "Naum", def: "Profeta que anunciou a destruição de Nínive." },
  { term: "Nazaré", def: "Cidade onde Jesus cresceu." },
  { term: "Neemias", def: "Líder que reconstruiu os muros de Jerusalém." },
  { term: "Nínive", def: "Capital da Assíria onde Jonas pregou." },
  { term: "Noé", def: "Homem justo que construiu a arca." },
  { term: "Novo Testamento", def: "Segunda parte da Bíblia com 27 livros." },
  { term: "Obediência", def: "Submissão à vontade de Deus." },
  { term: "Oferta", def: "Presente voluntário dado a Deus." },
  { term: "Oração", def: "Comunicação com Deus." },
  { term: "Ordenança", def: "Prática instituída por Jesus: batismo e Ceia." },
  { term: "Orgulho", def: "Exaltação própria; pecado que afasta de Deus." },
  { term: "Oséias", def: "Profeta cujo casamento simbolizou o amor de Deus." },
  { term: "Páscoa", def: "Festa da libertação de Israel e ressurreição de Cristo." },
  { term: "Paciência", def: "Capacidade de esperar nos planos de Deus." },
  { term: "Pacto", def: "Acordo solene entre Deus e Seu povo." },
  { term: "Palavra de Deus", def: "A Bíblia Sagrada; também Jesus como Verbo." },
  { term: "Parábola", def: "História de Jesus com ensinamento espiritual." },
  { term: "Paraíso", def: "Lugar de felicidade eterna." },
  { term: "Pastor", def: "Líder espiritual que cuida do rebanho de Deus." },
  { term: "Paulo", def: "Apóstolo dos gentios." },
  { term: "Paz", def: "Serenidade do relacionamento com Deus." },
  { term: "Pecado", def: "Transgressão da lei divina." },
  { term: "Pecado Original", def: "Primeira desobediência de Adão e Eva." },
  { term: "Pedro", def: "Apóstolo líder, chamado de 'rocha'." },
  { term: "Penitência", def: "Arrependimento sincero dos pecados." },
  { term: "Pentateuco", def: "Os cinco primeiros livros da Bíblia." },
  { term: "Pentecostes", def: "Dia em que o Espírito Santo desceu." },
  { term: "Perdão", def: "Ato de absolver alguém; central na fé cristã." },
  { term: "Perseguição", def: "Sofrimento por causa da fé." },
  { term: "Petição", def: "Pedido feito a Deus em oração." },
  { term: "Piedade", def: "Devoção e reverência a Deus." },
  { term: "Profecia", def: "Mensagem de Deus por um profeta." },
  { term: "Profeta", def: "Pessoa chamada por Deus para transmitir Sua mensagem." },
  { term: "Promessa", def: "Compromisso de Deus de cumprir Sua palavra." },
  { term: "Propiciação", def: "Sacrifício que satisfaz a justiça divina." },
  { term: "Provérbios", def: "Livro de sabedoria com conselhos práticos." },
  { term: "Providência", def: "Cuidado constante de Deus." },
  { term: "Purificação", def: "Processo de limpeza espiritual." },
  { term: "Querubim", def: "Anjo que guarda a presença de Deus." },
  { term: "Rabi", def: "Mestre; título dado a Jesus." },
  { term: "Raquel", def: "Esposa amada de Jacó." },
  { term: "Redenção", def: "Libertação do pecado por Jesus." },
  { term: "Regeneração", def: "Novo nascimento espiritual." },
  { term: "Reino de Deus", def: "Governo soberano de Deus." },
  { term: "Ressurreição", def: "Volta à vida; Jesus ressuscitou." },
  { term: "Revelação", def: "Deus se faz conhecer aos homens." },
  { term: "Romanos", def: "Carta sobre justificação pela fé." },
  { term: "Rute", def: "Moabita fiel; ancestral de Davi." },
  { term: "Sábado", def: "Dia de descanso consagrado." },
  { term: "Sabedoria", def: "Conhecimento aplicado segundo Deus." },
  { term: "Sacerdote", def: "Mediador entre Deus e o povo." },
  { term: "Sacramento", def: "Ato sagrado instituído por Cristo." },
  { term: "Sacrifício", def: "Oferta feita a Deus; Jesus é o sacrifício perfeito." },
  { term: "Saduceu", def: "Grupo religioso que negava a ressurreição." },
  { term: "Salmos", def: "Livro de orações e louvores." },
  { term: "Salomão", def: "Rei sábio, construtor do Templo." },
  { term: "Salvação", def: "Livramento do pecado por Cristo." },
  { term: "Samaritano", def: "Habitante de Samaria; parábola do bom samaritano." },
  { term: "Samuel", def: "Profeta e juiz que ungiu os primeiros reis." },
  { term: "Sangue", def: "Símbolo de vida e expiação." },
  { term: "Santidade", def: "Estado de pureza para Deus." },
  { term: "Santificação", def: "Processo de tornar-se como Cristo." },
  { term: "Santo", def: "Separado para Deus." },
  { term: "Sara", def: "Esposa de Abraão, mãe de Isaque." },
  { term: "Satanás", def: "O adversário; anjo caído." },
  { term: "Semeador", def: "Parábola sobre respostas à Palavra." },
  { term: "Sermão do Monte", def: "Ensino de Jesus em Mateus 5-7." },
  { term: "Servo", def: "Pessoa que serve a Deus com humildade." },
  { term: "Sinagoga", def: "Local de reunião e ensino." },
  { term: "Sofonias", def: "Profeta que anunciou o Dia do Senhor." },
  { term: "Tabernáculo", def: "Tenda sagrada usada no deserto." },
  { term: "Tábuas da Lei", def: "Pedras com os Dez Mandamentos." },
  { term: "Templo", def: "Casa de Deus em Jerusalém." },
  { term: "Tentação", def: "Estímulo ao pecado; Jesus foi tentado mas não pecou." },
  { term: "Tessalonicenses", def: "Cartas sobre a volta de Cristo." },
  { term: "Testemunho", def: "Relato da ação de Deus na vida." },
  { term: "Tiago", def: "Apóstolo; autor da epístola sobre fé e obras." },
  { term: "Timóteo", def: "Jovem discípulo de Paulo." },
  { term: "Tito", def: "Companheiro de Paulo." },
  { term: "Torá", def: "Os cinco primeiros livros; a Lei de Moisés." },
  { term: "Transfiguração", def: "Jesus revelou Sua glória divina." },
  { term: "Tribo", def: "Uma das doze divisões de Israel." },
  { term: "Trindade", def: "Deus em três pessoas: Pai, Filho e Espírito Santo." },
  { term: "Última Ceia", def: "Última refeição de Jesus com os discípulos." },
  { term: "Unção", def: "Derramar óleo como sinal de consagração." },
  { term: "Urim e Tumim", def: "Objetos para consultar a vontade de Deus." },
  { term: "Vaidade", def: "Busca por coisas passageiras." },
  { term: "Verdade", def: "Jesus: 'Eu sou o Caminho, a Verdade e a Vida'." },
  { term: "Vida Eterna", def: "Existência sem fim com Deus." },
  { term: "Videira", def: "Jesus: 'Eu sou a videira, vós sois os ramos'." },
  { term: "Vigília", def: "Período de oração, geralmente noturno." },
  { term: "Vinho", def: "Símbolo do sangue de Cristo." },
  { term: "Voto", def: "Promessa solene feita a Deus." },
  { term: "Zacarias", def: "Profeta de visões de esperança." },
  { term: "Zaqueu", def: "Cobrador que subiu numa árvore para ver Jesus." },
  { term: "Zelo", def: "Fervor no serviço a Deus." },
  { term: "Sião", def: "Monte em Jerusalém; presença de Deus." },
  { term: "Ídolo", def: "Objeto adorado no lugar de Deus." },
  { term: "Impureza", def: "Estado de contaminação moral." },
  { term: "Iniquidade", def: "Maldade profunda contra Deus." },
  { term: "Inspiração", def: "Ação do Espírito Santo guiando os autores da Bíblia." },
  { term: "Javé", def: "Nome pessoal de Deus: 'Eu Sou o que Sou'." },
  { term: "Justo", def: "Pessoa que vive conforme Deus." },
  { term: "Laodiceia", def: "Igreja morna criticada no Apocalipse." },
  { term: "Legião", def: "Grande número de demônios curados por Jesus." },
  { term: "Leproso", def: "Pessoa com lepra; Jesus curou muitos." },
  { term: "Libertação", def: "Livramento do poder do pecado." },
  { term: "Ló", def: "Sobrinho de Abraão, resgatado de Sodoma." },
  { term: "Magnificat", def: "Cântico de Maria louvando a Deus." },
  { term: "Malaquias", def: "Último profeta do Antigo Testamento." },
  { term: "Maldição", def: "Consequência da desobediência a Deus." },
  { term: "Manjedoura", def: "Cocho onde Jesus foi colocado ao nascer." },
  { term: "Maranata", def: "'O Senhor vem' ou 'Vem, Senhor'." },
  { term: "Miriã", def: "Irmã de Moisés que liderou cânticos." },
  { term: "Monte Carmelo", def: "Elias confrontou os profetas de Baal." },
  { term: "Monte das Oliveiras", def: "Monte próximo a Jerusalém associado a Jesus." },
  { term: "Natal", def: "Celebração do nascimento de Jesus." },
  { term: "Nardo", def: "Perfume caro derramado sobre Jesus." },
  { term: "Nicodemos", def: "Fariseu que aprendeu sobre o novo nascimento." },
  { term: "Obadias", def: "Profeta que anunciou julgamento contra Edom." },
  { term: "Onésimo", def: "Escravo convertido por Paulo." },
  { term: "Onipotente", def: "Todo-poderoso; atributo de Deus." },
  { term: "Onipresente", def: "Presente em todos os lugares." },
  { term: "Onisciente", def: "Que tudo sabe; atributo de Deus." },
  { term: "Ovelha", def: "Símbolo dos seguidores de Deus." },
  { term: "Palmeira", def: "Símbolo de vitória na entrada de Jesus." },
  { term: "Pão da Vida", def: "Título de Jesus." },
  { term: "Patriarca", def: "Pai fundador: Abraão, Isaque, Jacó." },
  { term: "Pecador", def: "Todo ser humano que transgride a lei." },
  { term: "Pedra Angular", def: "Cristo como fundamento da Igreja." },
  { term: "Peregrino", def: "Viajante em busca de Deus." },
  { term: "Plenitude", def: "Em Cristo habita toda a plenitude." },
  { term: "Pregação", def: "Proclamação da Palavra de Deus." },
  { term: "Presbítero", def: "Líder e ancião da igreja." },
  { term: "Primogênito", def: "Primeiro filho; Jesus é o primogênito." },
  { term: "Queda", def: "Desobediência de Adão e Eva." },
  { term: "Rabino", def: "Mestre da lei judaica." },
  { term: "Raíz de Jessé", def: "Título messiânico de Jesus." },
  { term: "Rebeca", def: "Esposa de Isaque, mãe de Esaú e Jacó." },
  { term: "Reconciliação", def: "Restauração do relacionamento com Deus." },
  { term: "Remissão", def: "Perdão completo dos pecados." },
  { term: "Renúncia", def: "Abandono do pecado para seguir Cristo." },
  { term: "Retidão", def: "Vida reta diante de Deus." },
  { term: "Rio Jordão", def: "Rio principal onde Jesus foi batizado." },
  { term: "Rocha", def: "Símbolo de Deus como refúgio." },
  { term: "Salmista", def: "Autor dos Salmos; principalmente Davi." },
  { term: "Samaritana", def: "Mulher que conversou com Jesus no poço." },
  { term: "Sansão", def: "Juiz de força sobrenatural." },
  { term: "Sarça Ardente", def: "Arbusto de onde Deus falou com Moisés." },
  { term: "Serafim", def: "Anjo de seis asas que adora a Deus." },
  { term: "Shekinah", def: "Presença gloriosa de Deus manifestada." },
  { term: "Silas", def: "Companheiro de Paulo." },
  { term: "Soberania", def: "Autoridade suprema de Deus." },
  { term: "Sodoma", def: "Cidade destruída por grande maldade." },
  { term: "Sumo Sacerdote", def: "Líder religioso máximo; Jesus é nosso Sumo Sacerdote." },
  { term: "Talento", def: "Parábola sobre usar os dons de Deus." },
  { term: "Teofania", def: "Aparição visível de Deus." },
  { term: "Terra Prometida", def: "Canaã, prometida a Abraão." },
  { term: "Ungir", def: "Derramar óleo como sinal de escolha divina." },
  { term: "Véu do Templo", def: "Cortina que rasgou na morte de Jesus." },
  { term: "Verbo", def: "Título de Jesus: 'No princípio era o Verbo'." },
  { term: "Viúva Pobre", def: "Mulher que deu tudo como oferta." },
  { term: "Vocação", def: "Chamado de Deus para um propósito." },
  { term: "Yahweh", def: "Nome sagrado de Deus no AT." },
  { term: "Zebedeu", def: "Pai dos apóstolos Tiago e João." },
  { term: "Adorar", def: "Prostrar-se diante de Deus com reverência." },
  { term: "Agonia", def: "Sofrimento intenso de Jesus no Getsêmani." },
  { term: "Altar de Bronze", def: "Onde se queimavam os sacrifícios no Tabernáculo." },
  { term: "Ameaça", def: "Perigo que os cristãos enfrentam por sua fé." },
  { term: "Ananias", def: "Discípulo que batizou Paulo em Damasco." },
  { term: "Anticristo", def: "Opositor de Cristo nos últimos tempos." },
  { term: "Apostasia", def: "Abandono da fé cristã." },
  { term: "Árvore do Conhecimento", def: "Árvore proibida no Jardim do Éden." },
  { term: "Asafe", def: "Levita e autor de vários Salmos." },
  { term: "Balaão", def: "Profeta pagão que Deus usou para abençoar Israel." },
  { term: "Barnabé", def: "Companheiro de Paulo nas primeiras viagens missionárias." },
  { term: "Bartimeu", def: "Cego curado por Jesus em Jericó." },
  { term: "Beelzebul", def: "Nome dado ao príncipe dos demônios." },
  { term: "Benjamim", def: "Menor filho de Jacó e Raquel." },
  { term: "Betesda", def: "Tanque em Jerusalém onde Jesus curou um paralítico." },
  { term: "Caná", def: "Cidade onde Jesus fez o primeiro milagre." },
  { term: "Cativeiro", def: "Período em que Israel esteve exilado na Babilônia." },
  { term: "Centurião de Cafarnaum", def: "Soldado romano cuja fé impressionou Jesus." },
  { term: "Dádiva", def: "Dom ou presente dado por Deus." },
  { term: "Decreto", def: "Ordem divina que governa o curso da história." },
  { term: "Delícias", def: "Prazeres que Deus oferece aos que O buscam." },
  { term: "Edificar", def: "Construir espiritualmente; fortalecer a fé." },
  { term: "Eleazar", def: "Filho de Arão, sucessor como sumo sacerdote." },
  { term: "Enoque", def: "Homem que andou com Deus e foi arrebatado." },
  { term: "Esaú", def: "Filho de Isaque que vendeu sua primogenitura." },
  { term: "Estêvão", def: "Primeiro mártir cristão apedrejado por sua fé." },
  { term: "Figueira", def: "Árvore simbólica; Jesus amaldiçoou uma sem frutos." },
  { term: "Filisteus", def: "Povo inimigo de Israel." },
  { term: "Fonte", def: "Símbolo de vida e renovação espiritual." },
  { term: "Fortaleza", def: "Deus como refúgio e proteção." },
  { term: "Gamaliel", def: "Mestre fariseu que aconselhou moderação com os apóstolos." },
  { term: "Gideão", def: "Juiz que venceu os midianitas com 300 homens." },
  { term: "Gólem", def: "Termo hebraico para algo informe; usado no Salmo 139." },
  { term: "Hagar", def: "Serva de Sara, mãe de Ismael." },
  { term: "Herança", def: "Bênção prometida por Deus aos Seus filhos." },
  { term: "Hissopo", def: "Planta usada em rituais de purificação." },
  { term: "Ímpio", def: "Pessoa que vive sem Deus." },
  { term: "Inimigo", def: "Forças espirituais que se opõem ao povo de Deus." },
  { term: "Ismael", def: "Filho de Abraão com Hagar." },
  { term: "Jafé", def: "Filho de Noé; ancestral de muitas nações." },
  { term: "Jessé", def: "Pai do rei Davi." },
  { term: "Joabe", def: "General do exército de Davi." },
  { term: "José de Arimateia", def: "Homem rico que cedeu seu túmulo para Jesus." },
  { term: "Judeu", def: "Descendente de Judá; praticante do judaísmo." },
  { term: "Jugo", def: "Instrumento de trabalho; Jesus oferece um jugo suave." },
  { term: "Ladrão na Cruz", def: "Um dos dois crucificados com Jesus que se arrependeu." },
  { term: "Lídia", def: "Primeira convertida na Europa; vendedora de púrpura." },
  { term: "Madalena", def: "Outro nome para Maria Madalena." },
  { term: "Mar Morto", def: "Lago salgado na região de Israel." },
  { term: "Matias", def: "Apóstolo escolhido para substituir Judas." },
  { term: "Misael", def: "Companheiro de Daniel na Babilônia." },
  { term: "Mordecai", def: "Primo de Ester que a ajudou a salvar seu povo." },
  { term: "Nabucodonosor", def: "Rei da Babilônia que conquistou Jerusalém." },
  { term: "Natal", def: "Celebração do nascimento de Jesus Cristo." },
  { term: "Nazareno", def: "Jesus, por ter crescido em Nazaré." },
  { term: "Nuvem", def: "Símbolo da presença e guia de Deus." },
  { term: "Oliveira", def: "Árvore sagrada; símbolo de paz e unção." },
  { term: "Paracleto", def: "Consolador; título do Espírito Santo." },
  { term: "Passagem", def: "Travessia; Deus abre caminhos para Seu povo." },
  { term: "Peniel", def: "Lugar onde Jacó lutou com Deus." },
  { term: "Pilar", def: "Coluna de sustentação; metáfora da fé firme." },
  { term: "Praga", def: "Castigo divino enviado ao Egito." },
  { term: "Príncipe da Paz", def: "Título messiânico de Jesus em Isaías." },
  { term: "Puro", def: "Limpo diante de Deus; sem pecado." },
  { term: "Rebanho", def: "O povo de Deus sob o cuidado do Pastor." },
  { term: "Refúgio", def: "Lugar seguro na presença de Deus." },
  { term: "Relíquia", def: "Objeto sagrado preservado por devoção." },
  { term: "Remanescente", def: "Porção fiel do povo de Deus." },
  { term: "Resgate", def: "Ato de libertar pagando um preço; Cristo nos resgatou." },
  { term: "Salmão", def: "Ancestral de Davi na genealogia de Jesus." },
  { term: "Selá", def: "Pausa meditativa nos Salmos." },
  { term: "Sem", def: "Filho de Noé; ancestral dos semitas." },
  { term: "Serpente", def: "Símbolo de Satanás; tentou Eva no Éden." },
  { term: "Sinai", def: "Península onde Deus deu a Lei a Moisés." },
  { term: "Tabita", def: "Discípula ressuscitada por Pedro; também chamada Dorcas." },
  { term: "Tesouro", def: "Jesus ensinou a acumular tesouros no céu." },
  { term: "Trono", def: "Assento de autoridade; Deus reina do Seu trono." },
  { term: "Uva", def: "Fruto da videira; símbolo de abundância." },
  { term: "Vigário", def: "Representante de Cristo na terra." },
  { term: "Vinha", def: "Plantação de uvas; metáfora do povo de Deus." },
  { term: "Zelo", def: "Fervor e dedicação intensa no serviço a Deus." },
];

type Tab = "antigo" | "novo" | "dicionario";

export default function Biblia() {
  const [tab, setTab] = useState<Tab>("antigo");
  const [search, setSearch] = useState("");
  const [dictSearch, setDictSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const filterBooks = (books: string[]) =>
    books.filter((b) => b.toLowerCase().includes(search.toLowerCase()));

  const filteredDict = dictSearch.trim().length >= 2
    ? dicionario.filter(
        (d) =>
          d.term.toLowerCase().includes(dictSearch.toLowerCase()) ||
          d.def.toLowerCase().includes(dictSearch.toLowerCase())
      ).slice(0, 30)
    : [];

  const tabs = [
    { key: "antigo" as Tab, label: "Antigo Testamento", count: 39, icon: iconVT },
    { key: "novo" as Tab, label: "Novo Testamento", count: 27, icon: iconNT },
    { key: "dicionario" as Tab, label: "Dicionário Bíblico", count: dicionario.length, icon: iconDic },
  ];

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Bíblia" subtitle="66 livros para explorar" icon={iconBiblia} />

        {/* Tabs with icons */}
        <div className="flex gap-3 mb-6 flex-wrap justify-center">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelectedBook(null); }}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                tab === t.key
                  ? "bg-primary/10 border-2 border-primary shadow-lg scale-105"
                  : "bg-popover border-2 border-border hover:border-primary/50"
              }`}
              style={{ minWidth: 100 }}
            >
              <img src={t.icon} alt={t.label} className="w-16 h-16 rounded-xl object-cover" />
              <span className="font-display text-xs font-bold text-foreground text-center leading-tight">{t.label}</span>
              <span className="text-[10px] text-muted-foreground">({t.count})</span>
            </button>
          ))}
        </div>

        {/* Search for books */}
        {(tab === "antigo" || tab === "novo") && !selectedBook && (
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Pesquisar livro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-12 pr-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Book detail view */}
        {selectedBook && (
          <div className="bg-popover rounded-2xl p-6 shadow-lg border border-border mb-4">
            <button
              onClick={() => setSelectedBook(null)}
              className="text-primary font-display text-sm font-bold mb-4 hover:underline"
            >
              ← Voltar
            </button>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">📖 {selectedBook}</h2>
            <p className="font-body text-foreground leading-relaxed">
              {bookSummaries[selectedBook] || "Conteúdo em breve..."}
            </p>
          </div>
        )}

        {/* Book grid */}
        {tab === "antigo" && !selectedBook && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filterBooks(antigoTestamento).map((book, i) => (
              <div
                key={i}
                onClick={() => setSelectedBook(book)}
                className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center"
              >
                <span className="text-2xl block mb-1">📜</span>
                <span className="font-body text-sm text-foreground font-semibold">{book}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "novo" && !selectedBook && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filterBooks(novoTestamento).map((book, i) => (
              <div
                key={i}
                onClick={() => setSelectedBook(book)}
                className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center"
              >
                <span className="text-2xl block mb-1">✝️</span>
                <span className="font-body text-sm text-foreground font-semibold">{book}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "dicionario" && (
          <div>
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Digite pelo menos 2 letras para buscar..."
                value={dictSearch}
                onChange={(e) => setDictSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-12 pr-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {dictSearch.trim().length < 2 ? (
              <div className="text-center py-12">
                <span className="text-6xl block mb-4">🔍</span>
                <p className="font-display text-lg font-bold text-foreground">Use a lupa para buscar</p>
                <p className="font-body text-sm text-muted-foreground mt-2">
                  O dicionário contém {dicionario.length} termos extraídos de toda a Bíblia.
                </p>
              </div>
            ) : filteredDict.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-body text-muted-foreground">Nenhum resultado para "{dictSearch}"</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDict.map((d, i) => (
                  <div key={i} className="bg-popover rounded-2xl p-4 shadow-md border border-border">
                    <h3 className="font-display text-lg font-bold text-primary">{d.term}</h3>
                    <p className="font-body text-sm text-foreground mt-1">{d.def}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <FeedbackFooter />
    </div>
  );
}
