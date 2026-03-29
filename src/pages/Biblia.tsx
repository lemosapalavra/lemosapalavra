import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import iconBiblia from "@/assets/icon-biblia.png";

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
  { term: "Gênesis", def: "Primeiro livro da Bíblia; narra a criação do mundo e a origem da humanidade." },
  { term: "Gentio", def: "Pessoa não judia; as nações fora de Israel." },
  { term: "Getsêmani", def: "Jardim onde Jesus orou antes de Sua prisão e crucificação." },
  { term: "Glória", def: "Esplendor e majestade de Deus; Sua presença manifestada." },
  { term: "Golias", def: "Gigante filisteu derrotado pelo jovem Davi com uma funda." },
  { term: "Graça", def: "Favor imerecido de Deus para com a humanidade." },
  { term: "Habacuque", def: "Profeta que questionou Deus sobre a injustiça e recebeu resposta." },
  { term: "Hebreus", def: "Carta sobre a superioridade de Cristo e a fé dos patriarcas." },
  { term: "Heresia", def: "Ensino contrário às doutrinas fundamentais da fé cristã." },
  { term: "Herodes", def: "Rei da Judeia que tentou matar o menino Jesus." },
  { term: "Holocausto", def: "Sacrifício em que o animal era totalmente queimado em oferta a Deus." },
  { term: "Hosana", def: "Exclamação de louvor que significa 'Salva-nos, Senhor'." },
  { term: "Humildade", def: "Virtude de reconhecer a dependência de Deus; oposto do orgulho." },
  { term: "Idolatria", def: "Adoração de falsos deuses ou qualquer coisa no lugar de Deus." },
  { term: "Igreja", def: "Corpo de Cristo; comunidade dos crentes reunidos para adoração." },
  { term: "Imaculada", def: "Sem mancha; referente à pureza de Maria." },
  { term: "Imposição de Mãos", def: "Gesto de bênção, cura ou consagração no serviço de Deus." },
  { term: "Incenso", def: "Substância aromática queimada como oferta a Deus no Templo." },
  { term: "Intercessão", def: "Orar por outras pessoas, pedindo ajuda e proteção de Deus." },
  { term: "Isaías", def: "Grande profeta que anunciou a vinda do Messias." },
  { term: "Isaque", def: "Filho de Abraão e Sara, filho da promessa de Deus." },
  { term: "Israel", def: "Nação escolhida por Deus; também nome dado a Jacó." },
  { term: "Jacó", def: "Filho de Isaque, pai das doze tribos de Israel." },
  { term: "Jejum", def: "Abstinência voluntária de alimento para buscar a Deus." },
  { term: "Jeremias", def: "Profeta chorão que pregou contra a idolatria de Judá." },
  { term: "Jericó", def: "Cidade cujas muralhas caíram pela fé de Josué e do povo." },
  { term: "Jerusalém", def: "Cidade Santa; centro religioso e político de Israel." },
  { term: "Jesus", def: "Filho de Deus, Salvador do mundo, Messias prometido." },
  { term: "Jezabel", def: "Rainha ímpia que promoveu a idolatria em Israel." },
  { term: "Jó", def: "Homem justo que sofreu grandes provações mas manteve a fé em Deus." },
  { term: "João", def: "Apóstolo amado de Jesus; autor do Evangelho e do Apocalipse." },
  { term: "João Batista", def: "Profeta que preparou o caminho para Jesus, batizando no rio Jordão." },
  { term: "Joel", def: "Profeta que anunciou o derramamento do Espírito Santo." },
  { term: "Jonas", def: "Profeta engolido por um grande peixe; pregou em Nínive." },
  { term: "Jordão", def: "Rio onde Jesus foi batizado por João Batista." },
  { term: "José", def: "Filho de Jacó vendido pelos irmãos; tornou-se governador do Egito." },
  { term: "José (pai de Jesus)", def: "Esposo de Maria, carpinteiro de Nazaré, pai adotivo de Jesus." },
  { term: "Josué", def: "Sucessor de Moisés que liderou Israel na conquista da Terra Prometida." },
  { term: "Jubileu", def: "Ano de libertação e restauração celebrado a cada cinquenta anos." },
  { term: "Judas Iscariotes", def: "Discípulo que traiu Jesus por trinta moedas de prata." },
  { term: "Judá", def: "Quarta tribo de Israel; tribo real da qual Jesus descende." },
  { term: "Juízo", def: "Ato de Deus de julgar as ações dos seres humanos." },
  { term: "Juízo Final", def: "Julgamento definitivo de toda a humanidade por Deus." },
  { term: "Justiça", def: "Retidão moral; conformidade com a vontade de Deus." },
  { term: "Justificação", def: "Ato de Deus de declarar o pecador justo pela fé em Cristo." },
  { term: "Lamentações", def: "Livro de lamentos pela destruição de Jerusalém." },
  { term: "Lavagem dos Pés", def: "Ato de Jesus lavando os pés dos discípulos como exemplo de serviço." },
  { term: "Lázaro", def: "Amigo de Jesus que foi ressuscitado dos mortos." },
  { term: "Lei", def: "Os mandamentos e estatutos dados por Deus a Israel." },
  { term: "Levita", def: "Membro da tribo de Levi, dedicado ao serviço do Templo." },
  { term: "Levítico", def: "Terceiro livro da Bíblia com leis sobre sacrifícios e santidade." },
  { term: "Liberdade", def: "Livramento do pecado e da morte através de Cristo." },
  { term: "Livro da Vida", def: "Registro celestial dos nomes dos que são salvos." },
  { term: "Louvor", def: "Expressão de gratidão e adoração a Deus através de palavras e música." },
  { term: "Lucas", def: "Médico e autor do terceiro Evangelho e do livro de Atos." },
  { term: "Luz", def: "Símbolo de Deus, verdade e justiça; Jesus é a Luz do Mundo." },
  { term: "Maná", def: "Alimento milagroso dado por Deus aos israelitas no deserto." },
  { term: "Mandamento", def: "Ordem divina para guiar a conduta do povo de Deus." },
  { term: "Marcos", def: "Autor do segundo Evangelho; companheiro de Paulo e Pedro." },
  { term: "Maria", def: "Mãe de Jesus, escolhida por Deus para gerar o Salvador." },
  { term: "Maria Madalena", def: "Seguidora de Jesus, primeira testemunha da ressurreição." },
  { term: "Marta", def: "Irmã de Lázaro e Maria, conhecida por sua hospitalidade." },
  { term: "Mártir", def: "Pessoa que morre pela fé em Cristo." },
  { term: "Mateus", def: "Cobrador de impostos que se tornou apóstolo e autor do primeiro Evangelho." },
  { term: "Mediador", def: "Aquele que intercede entre duas partes; Jesus é o mediador entre Deus e os homens." },
  { term: "Meditação", def: "Reflexão profunda sobre a Palavra de Deus e Sua vontade." },
  { term: "Melquisedeque", def: "Sacerdote e rei de Salém; prefiguração de Cristo." },
  { term: "Messias", def: "O Ungido de Deus; o Salvador prometido nas Escrituras." },
  { term: "Milagre", def: "Evento sobrenatural realizado pelo poder de Deus." },
  { term: "Ministério", def: "Serviço dedicado a Deus e ao próximo." },
  { term: "Mirra", def: "Resina aromática usada em unguentos e no sepultamento de Jesus." },
  { term: "Misericórdia", def: "Compaixão de Deus que perdoa e não aplica o castigo merecido." },
  { term: "Missão", def: "Tarefa dada por Deus para espalhar o Evangelho." },
  { term: "Missionário", def: "Pessoa enviada para pregar o Evangelho em outros lugares." },
  { term: "Moisés", def: "Líder que tirou os israelitas do Egito; recebeu os Dez Mandamentos." },
  { term: "Monte Sinai", def: "Montanha onde Deus entregou a Lei a Moisés." },
  { term: "Morte", def: "Separação da alma do corpo; vencida por Cristo na ressurreição." },
  { term: "Mundo", def: "O sistema de valores contrários a Deus; também a criação de Deus." },
  { term: "Murmuração", def: "Queixa contra Deus ou Seus líderes; atitude condenada na Bíblia." },
  { term: "Naum", def: "Profeta que anunciou a destruição de Nínive." },
  { term: "Nazaré", def: "Cidade onde Jesus cresceu, na região da Galileia." },
  { term: "Neemias", def: "Líder que reconstruiu os muros de Jerusalém após o exílio." },
  { term: "Nínive", def: "Capital da Assíria onde Jonas pregou arrependimento." },
  { term: "Noé", def: "Homem justo que construiu a arca por ordem de Deus antes do dilúvio." },
  { term: "Novo Testamento", def: "Segunda parte da Bíblia com 27 livros sobre Jesus e a Igreja." },
  { term: "Obediência", def: "Submissão à vontade de Deus e aos Seus mandamentos." },
  { term: "Oferta", def: "Presente voluntário dado a Deus como expressão de adoração." },
  { term: "Oração", def: "Comunicação com Deus através de louvor, confissão, petição e gratidão." },
  { term: "Ordenança", def: "Prática instituída por Jesus: batismo e Santa Ceia." },
  { term: "Orgulho", def: "Exaltação própria; pecado que afasta o homem de Deus." },
  { term: "Oséias", def: "Profeta cujo casamento simbolizou o amor fiel de Deus por Israel." },
  { term: "Páscoa", def: "Festa que celebra a libertação de Israel do Egito; também a ressurreição de Cristo." },
  { term: "Paciência", def: "Capacidade de esperar com confiança nos planos de Deus." },
  { term: "Pacto", def: "Acordo solene entre Deus e Seu povo." },
  { term: "Palavra de Deus", def: "A Bíblia Sagrada; também se refere a Jesus como Verbo de Deus." },
  { term: "Parábola", def: "História curta contada por Jesus com ensinamento moral ou espiritual." },
  { term: "Paraíso", def: "Lugar de felicidade eterna na presença de Deus." },
  { term: "Pastor", def: "Líder espiritual que cuida e ensina o rebanho de Deus." },
  { term: "Paulo", def: "Apóstolo dos gentios; escreveu grande parte do Novo Testamento." },
  { term: "Paz", def: "Serenidade interior que vem do relacionamento com Deus." },
  { term: "Pecado", def: "Transgressão da lei divina; ato contrário à vontade de Deus." },
  { term: "Pecado Original", def: "A primeira desobediência de Adão e Eva que afetou toda a humanidade." },
  { term: "Pedro", def: "Apóstolo líder, chamado de 'rocha' por Jesus." },
  { term: "Penitência", def: "Arrependimento sincero dos pecados com desejo de mudança." },
  { term: "Pentateuco", def: "Os cinco primeiros livros da Bíblia escritos por Moisés." },
  { term: "Pentecostes", def: "Dia em que o Espírito Santo desceu sobre os discípulos." },
  { term: "Perdão", def: "Ato de absolver alguém de uma ofensa; central na fé cristã." },
  { term: "Perseguição", def: "Sofrimento por causa da fé em Cristo." },
  { term: "Petição", def: "Pedido feito a Deus em oração." },
  { term: "Piedade", def: "Devoção e reverência a Deus; vida de santidade." },
  { term: "Profecia", def: "Mensagem de Deus transmitida por um profeta." },
  { term: "Profeta", def: "Pessoa chamada por Deus para transmitir Sua mensagem." },
  { term: "Promessa", def: "Compromisso de Deus de cumprir Sua palavra." },
  { term: "Propiciação", def: "Sacrifício que satisfaz a justiça de Deus contra o pecado." },
  { term: "Provérbios", def: "Livro de sabedoria com conselhos práticos para a vida." },
  { term: "Providência", def: "Cuidado constante de Deus por Sua criação." },
  { term: "Purificação", def: "Processo de limpeza espiritual dos pecados." },
  { term: "Querubim", def: "Anjo de alta ordem que guarda a presença de Deus." },
  { term: "Rabi", def: "Mestre; título dado a Jesus por seus seguidores." },
  { term: "Raquel", def: "Esposa amada de Jacó, mãe de José e Benjamim." },
  { term: "Redenção", def: "Ato de Deus de libertar a humanidade do pecado através de Jesus." },
  { term: "Regeneração", def: "Novo nascimento espiritual operado pelo Espírito Santo." },
  { term: "Reino de Deus", def: "Governo soberano de Deus sobre todas as coisas." },
  { term: "Ressurreição", def: "Volta à vida; Jesus ressuscitou ao terceiro dia." },
  { term: "Revelação", def: "Ato de Deus de Se fazer conhecer aos seres humanos." },
  { term: "Romanos", def: "Carta de Paulo à igreja em Roma sobre a justificação pela fé." },
  { term: "Rute", def: "Moabita fiel à sua sogra Noemi; ancestral do rei Davi." },
  { term: "Sábado", def: "Dia de descanso consagrado a Deus, sétimo dia da semana." },
  { term: "Sabedoria", def: "Conhecimento aplicado à vida segundo a vontade de Deus." },
  { term: "Sacerdote", def: "Mediador entre Deus e o povo, oferecendo sacrifícios." },
  { term: "Sacramento", def: "Ato sagrado instituído por Cristo como meio de graça." },
  { term: "Sacrifício", def: "Oferta feita a Deus; Jesus é o sacrifício perfeito e definitivo." },
  { term: "Saduceu", def: "Membro de grupo religioso judaico que negava a ressurreição." },
  { term: "Salmos", def: "Livro de orações, louvores e cânticos a Deus." },
  { term: "Salomão", def: "Rei sábio de Israel, filho de Davi, construtor do Templo." },
  { term: "Salvação", def: "Livramento do pecado e da condenação eterna por meio de Cristo." },
  { term: "Samaritano", def: "Habitante de Samaria; Jesus contou a parábola do bom samaritano." },
  { term: "Samuel", def: "Profeta e juiz que ungiu os primeiros reis de Israel." },
  { term: "Sangue", def: "Símbolo de vida e expiação; o sangue de Jesus purifica do pecado." },
  { term: "Santidade", def: "Estado de pureza e separação para Deus." },
  { term: "Santificação", def: "Processo de tornar-se mais semelhante a Cristo." },
  { term: "Santo", def: "Separado para Deus; pessoa dedicada à vida cristã." },
  { term: "Sara", def: "Esposa de Abraão, mãe de Isaque na velhice." },
  { term: "Satanás", def: "O adversário; anjo caído que se opõe a Deus." },
  { term: "Semeador", def: "Parábola de Jesus sobre diferentes respostas à Palavra de Deus." },
  { term: "Sermão do Monte", def: "Ensino de Jesus sobre o Reino de Deus em Mateus 5-7." },
  { term: "Servo", def: "Pessoa que serve a Deus e ao próximo com humildade." },
  { term: "Sinagoga", def: "Local de reunião e ensino da Torá no judaísmo." },
  { term: "Sofonias", def: "Profeta que anunciou o Dia do Senhor." },
  { term: "Tabernáculo", def: "Tenda sagrada usada como santuário portátil no deserto." },
  { term: "Tábuas da Lei", def: "Pedras onde Deus escreveu os Dez Mandamentos." },
  { term: "Templo", def: "Casa de Deus em Jerusalém, construída por Salomão." },
  { term: "Tentação", def: "Provação ou estímulo ao pecado; Jesus foi tentado mas não pecou." },
  { term: "Tessalonicenses", def: "Cartas de Paulo à igreja em Tessalônica sobre a volta de Cristo." },
  { term: "Testemunho", def: "Relato pessoal da ação de Deus na vida de alguém." },
  { term: "Tiago", def: "Apóstolo; autor da epístola que ensina sobre fé e obras." },
  { term: "Timóteo", def: "Jovem discípulo e companheiro de Paulo no ministério." },
  { term: "Tito", def: "Companheiro de Paulo; carta sobre a organização da igreja." },
  { term: "Torá", def: "Os cinco primeiros livros da Bíblia; a Lei de Moisés." },
  { term: "Transfiguração", def: "Evento em que Jesus revelou Sua glória divina a Pedro, Tiago e João." },
  { term: "Tribo", def: "Uma das doze divisões do povo de Israel." },
  { term: "Trindade", def: "Deus em três pessoas: Pai, Filho e Espírito Santo." },
  { term: "Última Ceia", def: "Última refeição de Jesus com os discípulos antes da crucificação." },
  { term: "Unção", def: "Derramar óleo como sinal de consagração e poder do Espírito Santo." },
  { term: "Urim e Tumim", def: "Objetos usados pelo sumo sacerdote para consultar a vontade de Deus." },
  { term: "Vaidade", def: "Busca por coisas passageiras; o Eclesiastes diz que tudo é vaidade." },
  { term: "Verdade", def: "Jesus disse: 'Eu sou o Caminho, a Verdade e a Vida'." },
  { term: "Vida Eterna", def: "Existência sem fim na presença de Deus, dada pela fé em Cristo." },
  { term: "Videira", def: "Jesus disse: 'Eu sou a videira, vós sois os ramos'." },
  { term: "Vigília", def: "Período de oração e adoração, geralmente noturno." },
  { term: "Vinho", def: "Símbolo do sangue de Cristo na Santa Ceia." },
  { term: "Voto", def: "Promessa solene feita a Deus." },
  { term: "Zacarias", def: "Profeta que teve visões sobre a restauração de Israel." },
  { term: "Zaqueu", def: "Cobrador de impostos que subiu numa árvore para ver Jesus." },
  { term: "Zelo", def: "Fervor e dedicação intensa no serviço a Deus." },
  { term: "Sião", def: "Monte em Jerusalém; símbolo da presença de Deus e do Seu povo." },
  { term: "Ídolo", def: "Imagem ou objeto adorado no lugar do Deus verdadeiro." },
  { term: "Impureza", def: "Estado de contaminação ritual ou moral." },
  { term: "Iniquidade", def: "Maldade profunda; pecado grave contra Deus." },
  { term: "Inspiração", def: "Ação do Espírito Santo guiando os autores da Bíblia." },
  { term: "Javé", def: "Nome pessoal de Deus revelado a Moisés; 'Eu Sou o que Sou'." },
  { term: "Jezreel", def: "Vale fértil em Israel; local de batalhas importantes." },
  { term: "Jordânia", def: "Região além do rio Jordão; terra de passagem para Israel." },
  { term: "Justo", def: "Pessoa que vive de acordo com a vontade de Deus." },
  { term: "Kenosis", def: "Esvaziamento de Cristo ao se tornar humano." },
  { term: "Laodiceia", def: "Igreja morna criticada no Apocalipse por sua indiferença." },
  { term: "Legião", def: "Grande número de demônios que possuíam um homem curado por Jesus." },
  { term: "Leproso", def: "Pessoa com lepra; Jesus curou muitos leprosos." },
  { term: "Libertação", def: "Livramento do poder do pecado e de forças espirituais malignas." },
  { term: "Liturgia", def: "Forma de adoração comunitária estruturada." },
  { term: "Ló", def: "Sobrinho de Abraão, resgatado antes da destruição de Sodoma." },
  { term: "Macedônia", def: "Região onde Paulo plantou igrejas em Filipos e Tessalônica." },
  { term: "Magnificat", def: "Cântico de Maria louvando a Deus pela vinda do Salvador." },
  { term: "Malaquias", def: "Último profeta do Antigo Testamento; anunciou a vinda do mensageiro." },
  { term: "Maldição", def: "Consequência da desobediência a Deus; oposto da bênção." },
  { term: "Manaém", def: "Profeta e mestre na igreja de Antioquia." },
  { term: "Manjedoura", def: "Cocho para alimentar animais onde Jesus foi colocado ao nascer." },
  { term: "Maranata", def: "Expressão aramaica que significa 'O Senhor vem' ou 'Vem, Senhor'." },
  { term: "Miriã", def: "Irmã de Moisés que liderou cânticos de louvor." },
  { term: "Moabe", def: "Terra a leste do Mar Morto; origem de Rute." },
  { term: "Monte Carmelo", def: "Montanha onde Elias confrontou os profetas de Baal." },
  { term: "Monte das Oliveiras", def: "Monte próximo a Jerusalém associado a Jesus." },
  { term: "Natal", def: "Celebração do nascimento de Jesus Cristo." },
  { term: "Nardo", def: "Perfume caro derramado sobre Jesus por Maria." },
  { term: "Nicodemos", def: "Fariseu que visitou Jesus à noite para aprender sobre o novo nascimento." },
  { term: "Obadias", def: "Profeta que anunciou o julgamento contra Edom." },
  { term: "Onésimo", def: "Escravo fugido convertido por Paulo; tema da carta a Filemom." },
  { term: "Onipotente", def: "Todo-poderoso; atributo de Deus." },
  { term: "Onipresente", def: "Presente em todos os lugares; atributo de Deus." },
  { term: "Onisciente", def: "Que tudo sabe; atributo de Deus." },
  { term: "Ovelha", def: "Símbolo dos seguidores de Deus; Jesus é o Bom Pastor." },
  { term: "Palmeira", def: "Símbolo de vitória; ramos usados na entrada de Jesus em Jerusalém." },
  { term: "Pão da Vida", def: "Título de Jesus: 'Eu sou o pão da vida'." },
  { term: "Patriarca", def: "Pai fundador do povo de Israel: Abraão, Isaque, Jacó." },
  { term: "Pecador", def: "Todo ser humano que transgride a lei de Deus." },
  { term: "Pedra Angular", def: "Cristo como fundamento e sustentação da Igreja." },
  { term: "Pentecostalismo", def: "Movimento que enfatiza os dons do Espírito Santo." },
  { term: "Peregrino", def: "Viajante em busca de Deus; cristão neste mundo." },
  { term: "Plenitude", def: "Totalidade; em Cristo habita toda a plenitude da divindade." },
  { term: "Predestinação", def: "Plano soberano de Deus para a salvação." },
  { term: "Pregação", def: "Proclamação da Palavra de Deus ao público." },
  { term: "Presbítero", def: "Líder da igreja; ancião responsável pelo ensino e cuidado pastoral." },
  { term: "Primogênito", def: "Primeiro filho; Jesus é o primogênito de toda a criação." },
  { term: "Principado", def: "Poder espiritual; forças do mal mencionadas por Paulo." },
  { term: "Queda", def: "A desobediência de Adão e Eva que trouxe o pecado ao mundo." },
  { term: "Rabino", def: "Mestre da lei judaica; título de respeito." },
  { term: "Raíz de Jessé", def: "Título messiânico de Jesus, descendente de Jessé, pai de Davi." },
  { term: "Raptura", def: "Arrebatamento dos crentes ao encontro de Cristo nos ares." },
  { term: "Rebeca", def: "Esposa de Isaque, mãe de Esaú e Jacó." },
  { term: "Reconciliação", def: "Restauração do relacionamento entre Deus e a humanidade por Cristo." },
  { term: "Reforma", def: "Movimento de renovação da igreja iniciado no século XVI." },
  { term: "Remissão", def: "Perdão completo dos pecados pela obra de Cristo." },
  { term: "Renúncia", def: "Abandono do pecado e do mundo para seguir a Cristo." },
  { term: "Repouso", def: "Descanso em Deus; confiar em Sua provisão." },
  { term: "Ressurreição dos Mortos", def: "Crença de que todos ressuscitarão no último dia." },
  { term: "Retidão", def: "Vida reta e justa diante de Deus." },
  { term: "Rio Jordão", def: "Rio principal de Israel onde Jesus foi batizado." },
  { term: "Rocha", def: "Símbolo de Deus como refúgio e fundamento firme." },
  { term: "Salmista", def: "Autor dos Salmos; principalmente o rei Davi." },
  { term: "Samaritana", def: "Mulher com quem Jesus conversou no poço de Jacó." },
  { term: "Sansão", def: "Juiz de Israel dotado de força sobrenatural." },
  { term: "Sarça Ardente", def: "Arbusto em chamas de onde Deus falou com Moisés." },
  { term: "Sarepta", def: "Cidade onde Elias foi sustentado por uma viúva." },
  { term: "Serafim", def: "Anjo de seis asas que adora a Deus continuamente." },
  { term: "Shekinah", def: "Presença gloriosa de Deus manifestada visivelmente." },
  { term: "Silas", def: "Companheiro de Paulo em suas viagens missionárias." },
  { term: "Simão", def: "Nome original de Pedro; também outros personagens bíblicos." },
  { term: "Soberania", def: "Autoridade suprema de Deus sobre toda a criação." },
  { term: "Sodoma", def: "Cidade destruída por Deus devido à sua grande maldade." },
  { term: "Sumo Sacerdote", def: "Líder religioso máximo de Israel; Jesus é nosso Sumo Sacerdote." },
  { term: "Tabor", def: "Monte associado à transfiguração de Jesus." },
  { term: "Taça da Ira", def: "Símbolo do julgamento divino no Apocalipse." },
  { term: "Talento", def: "Unidade de peso e moeda; parábola sobre usar os dons de Deus." },
  { term: "Targum", def: "Tradução e interpretação aramaica das Escrituras." },
  { term: "Teofania", def: "Aparição visível de Deus aos seres humanos." },
  { term: "Terra Prometida", def: "Canaã, a terra que Deus prometeu dar a Abraão." },
  { term: "Trigo", def: "Símbolo dos fiéis na parábola do trigo e do joio." },
  { term: "Ungir", def: "Derramar óleo sobre alguém como sinal de escolha divina." },
  { term: "Uriel", def: "Anjo mencionado em textos apócrifos como portador de luz." },
  { term: "Vaticínio", def: "Profecia ou predição divina." },
  { term: "Véu do Templo", def: "Cortina que separava o Santo dos Santos; rasgou-se na morte de Jesus." },
  { term: "Verbo", def: "Título de Jesus: 'No princípio era o Verbo, e o Verbo era Deus'." },
  { term: "Viúva de Naim", def: "Mãe cujo filho Jesus ressuscitou." },
  { term: "Viúva Pobre", def: "Mulher que deu tudo o que tinha como oferta no Templo." },
  { term: "Vocação", def: "Chamado de Deus para um propósito específico." },
  { term: "Xenofobia", def: "Medo de estrangeiros; a Bíblia ensina acolher o estrangeiro." },
  { term: "Yahweh", def: "Nome sagrado de Deus no Antigo Testamento." },
  { term: "Zebedeu", def: "Pai dos apóstolos Tiago e João." },
  { term: "Zedequias", def: "Último rei de Judá antes do exílio babilônico." },
];

type Tab = "antigo" | "novo" | "dicionario";

export default function Biblia() {
  const [tab, setTab] = useState<Tab>("antigo");
  const [search, setSearch] = useState("");
  const [dictSearch, setDictSearch] = useState("");

  const filterBooks = (books: string[]) =>
    books.filter((b) => b.toLowerCase().includes(search.toLowerCase()));

  const filteredDict = dictSearch.trim().length >= 2
    ? dicionario.filter(
        (d) =>
          d.term.toLowerCase().includes(dictSearch.toLowerCase()) ||
          d.def.toLowerCase().includes(dictSearch.toLowerCase())
      ).slice(0, 20)
    : [];

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Bíblia" subtitle="66 livros para explorar" icon={iconBiblia} />

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "antigo" as Tab, label: "📜 Antigo Testamento", count: 39 },
            { key: "novo" as Tab, label: "✝️ Novo Testamento", count: 27 },
            { key: "dicionario" as Tab, label: "📖 Dicionário Bíblico", count: dicionario.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full font-display text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-popover text-foreground border border-border hover:border-primary/50"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Search for books */}
        {(tab === "antigo" || tab === "novo") && (
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

        {/* Content */}
        {tab === "antigo" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filterBooks(antigoTestamento).map((book, i) => (
              <div key={i} className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border">
                <span className="font-body text-sm text-foreground font-semibold">{book}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "novo" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filterBooks(novoTestamento).map((book, i) => (
              <div key={i} className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border">
                <span className="font-body text-sm text-foreground font-semibold">{book}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "dicionario" && (
          <div>
            {/* Search only */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Digite pelo menos 2 letras para buscar no dicionário..."
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
                  Digite o nome de uma palavra bíblica para encontrar sua definição.
                  <br />O dicionário contém {dicionario.length} termos extraídos de toda a Bíblia.
                </p>
              </div>
            ) : filteredDict.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-body text-muted-foreground">Nenhum resultado encontrado para "{dictSearch}"</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDict.map((d, i) => (
                  <div key={i} className="bg-popover rounded-2xl p-4 shadow-md border border-border">
                    <h3 className="font-display text-lg font-bold text-primary">{d.term}</h3>
                    <p className="font-body text-sm text-foreground mt-1">{d.def}</p>
                  </div>
                ))}
                {filteredDict.length === 20 && (
                  <p className="font-body text-xs text-muted-foreground text-center">Mostrando os primeiros 20 resultados. Refine sua busca.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <FeedbackFooter />
    </div>
  );
}
