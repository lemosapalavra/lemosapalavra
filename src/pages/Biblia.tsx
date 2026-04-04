import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import iconBiblia from "@/assets/icon-biblia.png";
import iconVT from "@/assets/icon-velho-testamento.png";
import iconNT from "@/assets/icon-novo-testamento.png";
import iconDic from "@/assets/icon-dicionario.png";
import { bookChapters, chapterThemes } from "@/data/bibleStructure";

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

// Mapping from Portuguese book names to bible-api.com book IDs
const bookIdMap: Record<string, string> = {
  "Gênesis": "GEN", "Êxodo": "EXO", "Levítico": "LEV", "Números": "NUM", "Deuteronômio": "DEU",
  "Josué": "JOS", "Juízes": "JDG", "Rute": "RUT", "1 Samuel": "1SA", "2 Samuel": "2SA",
  "1 Reis": "1KI", "2 Reis": "2KI", "1 Crônicas": "1CH", "2 Crônicas": "2CH", "Esdras": "EZR",
  "Neemias": "NEH", "Ester": "EST", "Jó": "JOB", "Salmos": "PSA", "Provérbios": "PRO",
  "Eclesiastes": "ECC", "Cânticos": "SNG", "Isaías": "ISA", "Jeremias": "JER", "Lamentações": "LAM",
  "Ezequiel": "EZK", "Daniel": "DAN", "Oséias": "HOS", "Joel": "JOL", "Amós": "AMO",
  "Obadias": "OBA", "Jonas": "JON", "Miquéias": "MIC", "Naum": "NAM", "Habacuque": "HAB",
  "Sofonias": "ZEP", "Ageu": "HAG", "Zacarias": "ZEC", "Malaquias": "MAL",
  "Mateus": "MAT", "Marcos": "MRK", "Lucas": "LUK", "João": "JHN", "Atos": "ACT",
  "Romanos": "ROM", "1 Coríntios": "1CO", "2 Coríntios": "2CO", "Gálatas": "GAL", "Efésios": "EPH",
  "Filipenses": "PHP", "Colossenses": "COL", "1 Tessalonicenses": "1TH", "2 Tessalonicenses": "2TH",
  "1 Timóteo": "1TI", "2 Timóteo": "2TI", "Tito": "TIT", "Filemom": "PHM", "Hebreus": "HEB",
  "Tiago": "JAS", "1 Pedro": "1PE", "2 Pedro": "2PE", "1 João": "1JN", "2 João": "2JN",
  "3 João": "3JN", "Judas": "JUD", "Apocalipse": "REV",
};

const bookSummaries: Record<string, string> = {
  "Gênesis": "O livro dos começos: criação do mundo, Adão e Eva, Noé, Abraão, Isaque, Jacó e José.",
  "Êxodo": "A saída do Egito: Moisés, as 10 pragas, travessia do Mar Vermelho e os Dez Mandamentos.",
  "Levítico": "Leis de santidade: regras para sacrifícios, festas e a vida do povo de Deus.",
  "Números": "A jornada no deserto: contagem do povo, murmurações e peregrinação de 40 anos.",
  "Deuteronômio": "A segunda lei: Moisés repete as leis antes de entrarem na Terra Prometida.",
  "Josué": "Conquista da Terra Prometida: travessia do Jordão, queda de Jericó, divisão da terra.",
  "Juízes": "Ciclos de pecado e libertação: Gideão, Sansão, Débora salvam Israel.",
  "Rute": "Fidelidade: Rute segue o Deus de Israel e se torna ancestral de Davi.",
  "1 Samuel": "De Samuel a Saul: o último juiz, primeiro rei e ascensão de Davi.",
  "2 Samuel": "O reinado de Davi: vitórias, pecado e consequências.",
  "1 Reis": "Salomão e a divisão: sabedoria, Templo e divisão do reino.",
  "2 Reis": "Reis e profetas até o exílio na Babilônia.",
  "1 Crônicas": "Genealogia e reinado de Davi focado na adoração.",
  "2 Crônicas": "De Salomão ao exílio com foco no Templo.",
  "Esdras": "Retorno do exílio e reconstrução do Templo.",
  "Neemias": "Reconstrução dos muros de Jerusalém.",
  "Ester": "A rainha que salvou o povo judeu.",
  "Jó": "O sofrimento do justo e a restauração por Deus.",
  "Salmos": "150 cânticos de alegria, dor, esperança e adoração.",
  "Provérbios": "Sabedoria prática para viver com temor a Deus.",
  "Eclesiastes": "O sentido da vida e o propósito verdadeiro.",
  "Cânticos": "Poema de amor simbolizando o amor de Deus.",
  "Isaías": "Profecias sobre Jesus e a esperança de salvação.",
  "Jeremias": "Alertas sobre juízo e promessas de nova aliança.",
  "Lamentações": "Lamentos pela destruição de Jerusalém.",
  "Ezequiel": "Visões de glória e restauração de Israel.",
  "Daniel": "Fé na Babilônia e visões proféticas.",
  "Oséias": "Amor fiel de Deus por Israel infiel.",
  "Joel": "Chamado ao arrependimento e promessa do Espírito.",
  "Amós": "Justiça social e denúncia da opressão.",
  "Obadias": "Julgamento contra o orgulho de Edom.",
  "Jonas": "O profeta relutante e Nínive arrependida.",
  "Miquéias": "Justiça, misericórdia e profecia sobre Belém.",
  "Naum": "A queda de Nínive pelo juízo divino.",
  "Habacuque": "O justo viverá pela fé.",
  "Sofonias": "O Dia do Senhor e restauração.",
  "Ageu": "Encorajamento para reconstruir o Templo.",
  "Zacarias": "Visões messiânicas e restauração de Jerusalém.",
  "Malaquias": "Último profeta: repreensão e promessa do mensageiro.",
  "Mateus": "Jesus, o Rei prometido a Israel.",
  "Marcos": "Jesus, o Servo cheio de ação e milagres.",
  "Lucas": "Jesus, o Salvador amigo de todos.",
  "João": "Jesus, o Filho de Deus eterno.",
  "Atos": "A Igreja nasce pelo Espírito Santo.",
  "Romanos": "Justificação pela fé e graça de Deus.",
  "1 Coríntios": "Orientações sobre divisões, dons e amor.",
  "2 Coríntios": "Força na fraqueza e ministério de Paulo.",
  "Gálatas": "Liberdade em Cristo contra o legalismo.",
  "Efésios": "Unidade da Igreja e armadura de Deus.",
  "Filipenses": "Alegria e contentamento em Cristo.",
  "Colossenses": "Supremacia e suficiência de Cristo.",
  "1 Tessalonicenses": "Esperança da segunda vinda de Jesus.",
  "2 Tessalonicenses": "Firmeza e o Dia do Senhor.",
  "1 Timóteo": "Instruções pastorais ao jovem Timóteo.",
  "2 Timóteo": "Última carta de Paulo: permaneça firme.",
  "Tito": "Liderança saudável na igreja de Creta.",
  "Filemom": "Perdão e reconciliação pelo escravo Onésimo.",
  "Hebreus": "Cristo é superior a tudo.",
  "Tiago": "Fé verdadeira se demonstra em obras.",
  "1 Pedro": "Esperança no sofrimento.",
  "2 Pedro": "Alertas contra falsos mestres.",
  "1 João": "Deus é amor; certeza da salvação.",
  "2 João": "Caminhar na verdade e amor.",
  "3 João": "Hospitalidade e fidelidade cristã.",
  "Judas": "Contender pela fé contra falsos mestres.",
  "Apocalipse": "Visões do fim: Jesus glorificado, juízo e novo céu.",
};

import { dicionarioBiblico as dicionario } from "@/data/bibleDictionary";
  { term: "Abba", def: "Palavra aramaica para 'Pai', usada por Jesus para se referir a Deus." },
  { term: "Abel", def: "Segundo filho de Adão e Eva, morto por seu irmão Caim." },
  { term: "Abençoar", def: "Invocar o favor divino sobre alguém ou algo." },
  { term: "Abismo", def: "Lugar de confinamento de demônios; profundeza sem fim." },
  { term: "Abominação", def: "Algo que causa repulsa a Deus; prática detestável." },
  { term: "Abraão", def: "Pai da fé, chamado por Deus para ser pai de muitas nações." },
  { term: "Acácia", def: "Madeira usada na construção da Arca da Aliança e do Tabernáculo." },
  { term: "Adoração", def: "Ato de reverência e louvor a Deus." },
  { term: "Aflição", def: "Sofrimento que pode levar ao crescimento espiritual." },
  { term: "Ágape", def: "Amor incondicional de Deus; a forma mais elevada de amor." },
  { term: "Água Viva", def: "Símbolo do Espírito Santo e da vida eterna em Cristo." },
  { term: "Aleluia", def: "Expressão de louvor: 'Louvai ao Senhor'." },
  { term: "Alfa e Ômega", def: "Título de Cristo como princípio e fim de tudo." },
  { term: "Aliança", def: "Acordo entre Deus e Seu povo com promessas." },
  { term: "Altar", def: "Local sagrado onde se ofereciam sacrifícios a Deus." },
  { term: "Amém", def: "'Assim seja'; afirmação de concordância." },
  { term: "Anátema", def: "Maldição ou separação de algo consagrado." },
  { term: "Ancião", def: "Líder respeitado na comunidade de fé." },
  { term: "André", def: "Apóstolo, irmão de Pedro, primeiro a ser chamado." },
  { term: "Anjo", def: "Mensageiro celestial enviado por Deus." },
  { term: "Anunciação", def: "O anjo Gabriel anuncia a Maria a vinda de Jesus." },
  { term: "Apocalipse", def: "Revelação divina sobre os últimos tempos." },
  { term: "Apóstolo", def: "Discípulo enviado por Jesus para pregar." },
  { term: "Arca da Aliança", def: "Baú sagrado com as Tábuas da Lei." },
  { term: "Arca de Noé", def: "Embarcação para salvar do dilúvio." },
  { term: "Arrependimento", def: "Mudança de mente, voltando-se do pecado para Deus." },
  { term: "Ascensão", def: "Subida de Jesus ao céu após a ressurreição." },
  { term: "Atos", def: "Livro que narra a história da Igreja primitiva." },
  { term: "Baal", def: "Falso deus dos cananeus combatido pelos profetas." },
  { term: "Babel", def: "Torre símbolo de orgulho e confusão de línguas." },
  { term: "Babilônia", def: "Império que conquistou Judá; símbolo de opressão." },
  { term: "Batismo", def: "Rito de purificação e entrada na comunidade cristã." },
  { term: "Beatitude", def: "Declaração de felicidade espiritual feita por Jesus." },
  { term: "Belém", def: "Cidade onde Jesus nasceu; 'Casa do Pão'." },
  { term: "Bênção", def: "Favor divino derramado sobre pessoas." },
  { term: "Bíblia", def: "A Palavra de Deus; livros sagrados do AT e NT." },
  { term: "Blasfêmia", def: "Falar de modo irreverente contra Deus." },
  { term: "Cafarnaum", def: "Cidade onde Jesus fez muitos milagres." },
  { term: "Caim", def: "Primeiro filho de Adão e Eva; matou Abel." },
  { term: "Cálice", def: "Copa da Última Ceia; símbolo do sangue de Cristo." },
  { term: "Calvário", def: "Monte onde Jesus foi crucificado." },
  { term: "Caminho", def: "Jesus: 'Eu sou o Caminho, a Verdade e a Vida'." },
  { term: "Canaã", def: "Terra Prometida por Deus a Abraão." },
  { term: "Cânon", def: "Lista oficial dos livros da Bíblia." },
  { term: "Caridade", def: "Amor ao próximo em ações bondosas." },
  { term: "Carne", def: "Natureza humana pecaminosa, oposta ao Espírito." },
  { term: "Cenáculo", def: "Sala da Última Ceia de Jesus." },
  { term: "Centurião", def: "Oficial romano; alguns tiveram fé em Jesus." },
  { term: "Circuncisão", def: "Sinal da aliança entre Deus e Abraão." },
  { term: "Comunhão", def: "Participação na vida cristã; Ceia do Senhor." },
  { term: "Confissão", def: "Reconhecimento dos pecados diante de Deus." },
  { term: "Consagração", def: "Dedicar algo ou alguém ao serviço de Deus." },
  { term: "Conversão", def: "Transformação ao aceitar Jesus como Salvador." },
  { term: "Cordeiro", def: "Símbolo de Jesus como sacrifício pelos pecados." },
  { term: "Criação", def: "Ato divino de trazer tudo à existência." },
  { term: "Cristo", def: "O Ungido; título de Jesus como Messias." },
  { term: "Crucificação", def: "Método de execução pelo qual Jesus morreu." },
  { term: "Cruz", def: "Instrumento da morte de Jesus; símbolo central da fé." },
  { term: "Davi", def: "Rei de Israel, autor de Salmos, ancestral de Jesus." },
  { term: "Decálogo", def: "Os Dez Mandamentos dados a Moisés." },
  { term: "Demônio", def: "Espírito maligno que se opõe a Deus." },
  { term: "Deserto", def: "Lugar de provação e encontro com Deus." },
  { term: "Deus", def: "Criador do universo, Todo-Poderoso, eterno e amoroso." },
  { term: "Diácono", def: "Servo da igreja nas necessidades práticas." },
  { term: "Dilúvio", def: "Inundação universal nos dias de Noé." },
  { term: "Discípulo", def: "Seguidor e aprendiz de Jesus Cristo." },
  { term: "Dízimo", def: "Oferta de dez por cento dedicada a Deus." },
  { term: "Doutrina", def: "Ensino das verdades da fé cristã." },
  { term: "Éden", def: "Jardim paradisíaco criado para Adão e Eva." },
  { term: "Eleição", def: "Escolha soberana de Deus para Seu propósito." },
  { term: "Elias", def: "Profeta que confrontou os profetas de Baal." },
  { term: "Eliseu", def: "Profeta sucessor de Elias com muitos milagres." },
  { term: "Emanuel", def: "'Deus conosco'; título profético de Jesus." },
  { term: "Encarnação", def: "Deus se fez carne em Jesus Cristo." },
  { term: "Epístola", def: "Carta dos apóstolos às igrejas primitivas." },
  { term: "Escatologia", def: "Estudo das últimas coisas: morte, juízo, céu." },
  { term: "Escrituras", def: "Os textos sagrados da Bíblia inspirados por Deus." },
  { term: "Esperança", def: "Confiança nas promessas de Deus." },
  { term: "Espírito Santo", def: "Terceira pessoa da Trindade; Deus nos crentes." },
  { term: "Ester", def: "Rainha que salvou o povo judeu." },
  { term: "Eternidade", def: "Existência sem fim; vida com Deus para sempre." },
  { term: "Eucaristia", def: "Celebração da Ceia do Senhor." },
  { term: "Eva", def: "Primeira mulher criada por Deus." },
  { term: "Evangelho", def: "A boa notícia da salvação em Jesus Cristo." },
  { term: "Exílio", def: "Período de Israel cativo na Babilônia." },
  { term: "Expiação", def: "Remoção do pecado pelo sacrifício de Cristo." },
  { term: "Faraó", def: "Título dos reis do Egito; opressor de Israel." },
  { term: "Fariseu", def: "Grupo religioso que enfatizava a lei." },
  { term: "Fé", def: "Confiança e crença em Deus e Suas promessas." },
  { term: "Frutos do Espírito", def: "Amor, alegria, paz, paciência, benignidade, bondade, fé, mansidão, domínio próprio." },
  { term: "Galileia", def: "Região onde Jesus cresceu e iniciou Seu ministério." },
  { term: "Gentio", def: "Pessoa não judia; as nações fora de Israel." },
  { term: "Getsêmani", def: "Jardim onde Jesus orou antes da prisão." },
  { term: "Glória", def: "Esplendor e majestade de Deus." },
  { term: "Golias", def: "Gigante filisteu derrotado por Davi." },
  { term: "Graça", def: "Favor imerecido de Deus para a humanidade." },
  { term: "Herodes", def: "Rei que tentou matar o menino Jesus." },
  { term: "Holocausto", def: "Sacrifício totalmente queimado a Deus." },
  { term: "Hosana", def: "'Salva-nos, Senhor'; exclamação de louvor." },
  { term: "Humildade", def: "Reconhecer a dependência de Deus." },
  { term: "Idolatria", def: "Adoração de falsos deuses." },
  { term: "Igreja", def: "Corpo de Cristo; comunidade dos crentes." },
  { term: "Imposição de Mãos", def: "Gesto de bênção, cura ou consagração." },
  { term: "Incenso", def: "Substância queimada como oferta no Templo." },
  { term: "Intercessão", def: "Orar em favor de outras pessoas." },
  { term: "Isaías", def: "Grande profeta que anunciou o Messias." },
  { term: "Isaque", def: "Filho de Abraão e Sara, filho da promessa." },
  { term: "Israel", def: "Nação escolhida por Deus; nome dado a Jacó." },
  { term: "Jacó", def: "Filho de Isaque, pai das doze tribos." },
  { term: "Jejum", def: "Abstinência de alimento para buscar a Deus." },
  { term: "Jericó", def: "Cidade cujas muralhas caíram pela fé." },
  { term: "Jerusalém", def: "Cidade Santa; centro religioso de Israel." },
  { term: "Jesus", def: "Filho de Deus, Salvador do mundo." },
  { term: "Jó", def: "Homem justo que sofreu mas manteve a fé." },
  { term: "João", def: "Apóstolo amado de Jesus." },
  { term: "João Batista", def: "Profeta que preparou o caminho para Jesus." },
  { term: "Jonas", def: "Profeta engolido por um grande peixe." },
  { term: "Jordão", def: "Rio onde Jesus foi batizado." },
  { term: "José", def: "Filho de Jacó; governador do Egito." },
  { term: "Josué", def: "Sucessor de Moisés na conquista da terra." },
  { term: "Jubileu", def: "Ano de libertação celebrado a cada 50 anos." },
  { term: "Judas Iscariotes", def: "Discípulo que traiu Jesus." },
  { term: "Juízo Final", def: "Julgamento definitivo de toda a humanidade." },
  { term: "Justiça", def: "Retidão moral conforme a vontade de Deus." },
  { term: "Justificação", def: "Deus declara o pecador justo pela fé." },
  { term: "Lavagem dos Pés", def: "Exemplo de serviço dado por Jesus." },
  { term: "Lázaro", def: "Amigo de Jesus que foi ressuscitado." },
  { term: "Lei", def: "Os mandamentos dados por Deus a Israel." },
  { term: "Levita", def: "Membro da tribo de Levi, servo do Templo." },
  { term: "Livro da Vida", def: "Registro celestial dos salvos." },
  { term: "Louvor", def: "Expressão de gratidão e adoração a Deus." },
  { term: "Luz", def: "Símbolo de Deus; Jesus é a Luz do Mundo." },
  { term: "Maná", def: "Alimento milagroso dado no deserto." },
  { term: "Mandamento", def: "Ordem divina para guiar a conduta." },
  { term: "Maria", def: "Mãe de Jesus, escolhida por Deus." },
  { term: "Maria Madalena", def: "Primeira testemunha da ressurreição." },
  { term: "Mártir", def: "Pessoa que morre por sua fé em Cristo." },
  { term: "Mediador", def: "Jesus media entre Deus e os homens." },
  { term: "Melquisedeque", def: "Sacerdote e rei de Salém; prefiguração de Cristo." },
  { term: "Messias", def: "O Ungido de Deus; o Salvador prometido." },
  { term: "Milagre", def: "Evento sobrenatural pelo poder de Deus." },
  { term: "Mirra", def: "Resina aromática usada no sepultamento de Jesus." },
  { term: "Misericórdia", def: "Compaixão de Deus que perdoa os pecados." },
  { term: "Moisés", def: "Líder que tirou Israel do Egito." },
  { term: "Monte Sinai", def: "Montanha onde Deus entregou a Lei." },
  { term: "Noé", def: "Homem justo que construiu a arca." },
  { term: "Obediência", def: "Submissão à vontade de Deus." },
  { term: "Oferta", def: "Presente voluntário dado a Deus." },
  { term: "Oração", def: "Comunicação com Deus." },
  { term: "Parábola", def: "História com ensinamento espiritual." },
  { term: "Paraíso", def: "Lugar de felicidade eterna com Deus." },
  { term: "Páscoa", def: "Festa da libertação e ressurreição de Cristo." },
  { term: "Pastor", def: "Líder espiritual que cuida do rebanho." },
  { term: "Paulo", def: "Apóstolo dos gentios, autor de epístolas." },
  { term: "Paz", def: "Serenidade do relacionamento com Deus." },
  { term: "Pecado", def: "Transgressão da lei divina." },
  { term: "Pedro", def: "Apóstolo líder, chamado de 'rocha'." },
  { term: "Pentateuco", def: "Os cinco primeiros livros da Bíblia." },
  { term: "Pentecostes", def: "Dia em que o Espírito Santo desceu." },
  { term: "Perdão", def: "Ato de absolver; central na fé cristã." },
  { term: "Profecia", def: "Mensagem de Deus por um profeta." },
  { term: "Profeta", def: "Pessoa chamada para transmitir mensagem de Deus." },
  { term: "Promessa", def: "Compromisso de Deus de cumprir Sua palavra." },
  { term: "Providência", def: "Cuidado constante de Deus pela criação." },
  { term: "Querubim", def: "Anjo que guarda a presença de Deus." },
  { term: "Redenção", def: "Libertação do pecado por Jesus." },
  { term: "Regeneração", def: "Novo nascimento espiritual em Cristo." },
  { term: "Reino de Deus", def: "Governo soberano de Deus sobre tudo." },
  { term: "Ressurreição", def: "Volta à vida; Jesus ressuscitou ao terceiro dia." },
  { term: "Revelação", def: "Deus se faz conhecer aos homens." },
  { term: "Rute", def: "Moabita fiel; ancestral do rei Davi." },
  { term: "Sábado", def: "Dia de descanso consagrado a Deus." },
  { term: "Sabedoria", def: "Conhecimento aplicado segundo a vontade de Deus." },
  { term: "Sacerdote", def: "Mediador entre o povo e Deus no Templo." },
  { term: "Sacramento", def: "Sinal visível da graça invisível de Deus." },
  { term: "Sacrifício", def: "Oferta a Deus; morte de Cristo pelos pecados." },
  { term: "Sadoquita", def: "Grupo que não acreditava na ressurreição." },
  { term: "Saduceu", def: "Líder religioso que negava a ressurreição." },
  { term: "Salvação", def: "Livramento do pecado e da morte eterna." },
  { term: "Samaritano", def: "Habitante de Samaria; Jesus contou a parábola do Bom Samaritano." },
  { term: "Sangue", def: "Símbolo de vida e da expiação em Cristo." },
  { term: "Santificação", def: "Processo de tornar-se santo pela ação do Espírito." },
  { term: "Santo", def: "Separado para Deus; puro e consagrado." },
  { term: "Sião", def: "Monte de Jerusalém; símbolo da morada de Deus." },
  { term: "Tabernáculo", def: "Tenda sagrada onde Deus habitava entre Israel." },
  { term: "Templo", def: "Lugar de adoração em Jerusalém." },
  { term: "Tentação", def: "Provação para testar a fé." },
  { term: "Testamento", def: "Aliança entre Deus e Seu povo." },
  { term: "Transfiguração", def: "Jesus revelou Sua glória no monte." },
  { term: "Trindade", def: "Deus em três pessoas: Pai, Filho e Espírito Santo." },
  { term: "Unção", def: "Consagração com óleo para serviço divino." },
  { term: "Verdade", def: "Jesus: 'Eu sou a Verdade'." },
  { term: "Vida Eterna", def: "Vida sem fim com Deus pela fé em Cristo." },
  { term: "Vinha", def: "Símbolo de Israel; Jesus é a Videira Verdadeira." },
  { term: "Vocação", def: "Chamado de Deus para servir." },
  { term: "Zaqueu", def: "Publicano baixinho que subiu na árvore para ver Jesus." },
];

interface Verse {
  verse: number;
  text: string;
}

type Tab = "antigo" | "novo" | "dicionario";

export default function Biblia() {
  const [tab, setTab] = useState<Tab>("antigo");
  const [search, setSearch] = useState("");
  const [dictSearch, setDictSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [verseError, setVerseError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);

  // Fetch verses from bible-api.com when chapter is selected
  useEffect(() => {
    if (!selectedBook || !selectedChapter) {
      setVerses([]);
      setVerseError(null);
      return;
    }

    const bookId = bookIdMap[selectedBook];
    if (!bookId) {
      setVerseError("Livro não encontrado na API.");
      return;
    }

    setLoadingVerses(true);
    setVerseError(null);
    setVerses([]);

    fetch(`https://bible-api.com/data/almeida/${bookId}/${selectedChapter}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.verses && Array.isArray(data.verses)) {
          setVerses(
            data.verses.map((v: { verse: number; text: string }) => ({
              verse: v.verse,
              text: v.text.trim(),
            }))
          );
        } else {
          setVerseError("Formato de resposta inesperado.");
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar versículos:", err);
        setVerseError("Não foi possível carregar os versículos. Verifique sua conexão.");
      })
      .finally(() => setLoadingVerses(false));
  }, [selectedBook, selectedChapter]);

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

  const totalChapters = selectedBook ? (bookChapters[selectedBook] || 0) : 0;
  const chapterTheme = selectedBook && selectedChapter
    ? chapterThemes[selectedBook]?.[selectedChapter]
    : null;

  const goToNextChapter = () => {
    if (selectedBook && selectedChapter && selectedChapter < totalChapters) {
      setSelectedChapter(selectedChapter + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevChapter = () => {
    if (selectedBook && selectedChapter && selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderBookGrid = (books: string[], emoji: string) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {filterBooks(books).map((book, i) => (
        <div
          key={i}
          onClick={() => { setSelectedBook(book); setSelectedChapter(null); }}
          className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center"
        >
          <span className="text-2xl block mb-1">{emoji}</span>
          <span className="font-body text-sm text-foreground font-semibold">{book}</span>
          <span className="block text-[10px] text-muted-foreground mt-0.5">{bookChapters[book] || "?"} capítulos</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Bíblia" subtitle="66 livros para explorar" icon={iconBiblia} />

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap justify-center">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelectedBook(null); setSelectedChapter(null); }}
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

        {/* Search */}
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

        {/* Chapter view with full verses */}
        {selectedBook && selectedChapter && (
          <div className="bg-popover rounded-2xl p-5 sm:p-6 shadow-lg border border-border mb-4">
            <button
              onClick={() => setSelectedChapter(null)}
              className="text-primary font-display text-sm font-bold mb-4 hover:underline"
            >
              ← Voltar aos capítulos
            </button>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1">
              📖 {selectedBook} — Capítulo {selectedChapter}
            </h2>

            {/* Theme summary */}
            {chapterTheme && (
              <div className="bg-primary/5 rounded-xl p-3 mb-4 border border-primary/20">
                <p className="font-body text-sm text-foreground/80 italic">{chapterTheme}</p>
              </div>
            )}

            {/* Font size control */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-muted-foreground">Tamanho:</span>
              <button
                onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold hover:bg-muted/80"
              >
                A-
              </button>
              <span className="text-sm text-muted-foreground">{fontSize}px</span>
              <button
                onClick={() => setFontSize((s) => Math.min(28, s + 2))}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold hover:bg-muted/80"
              >
                A+
              </button>
            </div>

            {/* Verses */}
            {loadingVerses && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Carregando versículos...</p>
              </div>
            )}

            {verseError && (
              <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20 text-center">
                <p className="text-sm text-destructive">{verseError}</p>
                <button
                  onClick={() => {
                    // retry
                    const ch = selectedChapter;
                    setSelectedChapter(null);
                    setTimeout(() => setSelectedChapter(ch), 100);
                  }}
                  className="mt-2 text-xs text-primary underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!loadingVerses && !verseError && verses.length > 0 && (
              <div className="space-y-2" style={{ fontSize: `${fontSize}px` }}>
                {verses.map((v) => (
                  <p key={v.verse} className="font-body text-foreground leading-relaxed">
                    <span className="font-bold text-primary text-xs align-super mr-1">
                      {v.verse}
                    </span>
                    {v.text}
                  </p>
                ))}
              </div>
            )}

            {/* Chapter navigation */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
              <button
                onClick={goToPrevChapter}
                disabled={selectedChapter <= 1}
                className="flex items-center gap-1 text-sm font-display font-bold text-primary disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline"
              >
                ← Anterior
              </button>
              <span className="text-xs text-muted-foreground">
                Cap. {selectedChapter} de {totalChapters}
              </span>
              <button
                onClick={goToNextChapter}
                disabled={selectedChapter >= totalChapters}
                className="flex items-center gap-1 text-sm font-display font-bold text-primary disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline"
              >
                Próximo →
              </button>
            </div>

            {/* Translation credit */}
            <p className="text-[10px] text-muted-foreground text-center mt-4">
              Tradução João Ferreira de Almeida — Domínio Público — via bible-api.com
            </p>
          </div>
        )}

        {/* Book detail with chapters */}
        {selectedBook && !selectedChapter && (
          <div className="bg-popover rounded-2xl p-6 shadow-lg border border-border mb-4">
            <button
              onClick={() => setSelectedBook(null)}
              className="text-primary font-display text-sm font-bold mb-4 hover:underline"
            >
              ← Voltar
            </button>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">📖 {selectedBook}</h2>
            <p className="font-body text-foreground leading-relaxed mb-4">
              {bookSummaries[selectedBook] || "Conteúdo em breve..."}
            </p>

            <h3 className="font-display text-lg font-bold text-foreground mb-3">
              📑 Capítulos ({totalChapters})
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch)}
                  className="aspect-square rounded-xl border flex items-center justify-center font-display font-bold text-sm transition-all hover:scale-110 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Book grid */}
        {tab === "antigo" && !selectedBook && renderBookGrid(antigoTestamento, "📜")}
        {tab === "novo" && !selectedBook && renderBookGrid(novoTestamento, "✝️")}

        {/* Dictionary */}
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
