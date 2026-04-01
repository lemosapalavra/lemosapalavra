// Chapter counts for each book of the Bible
export const bookChapters: Record<string, number> = {
  "Gênesis": 50, "Êxodo": 40, "Levítico": 27, "Números": 36, "Deuteronômio": 34,
  "Josué": 24, "Juízes": 21, "Rute": 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Reis": 22, "2 Reis": 25, "1 Crônicas": 29, "2 Crônicas": 36, "Esdras": 10,
  "Neemias": 13, "Ester": 10, "Jó": 42, "Salmos": 150, "Provérbios": 31,
  "Eclesiastes": 12, "Cânticos": 8, "Isaías": 66, "Jeremias": 52, "Lamentações": 5,
  "Ezequiel": 48, "Daniel": 12, "Oséias": 14, "Joel": 3, "Amós": 9,
  "Obadias": 1, "Jonas": 4, "Miquéias": 7, "Naum": 3, "Habacuque": 3,
  "Sofonias": 3, "Ageu": 2, "Zacarias": 14, "Malaquias": 4,
  "Mateus": 28, "Marcos": 16, "Lucas": 24, "João": 21, "Atos": 28,
  "Romanos": 16, "1 Coríntios": 16, "2 Coríntios": 13, "Gálatas": 6, "Efésios": 6,
  "Filipenses": 4, "Colossenses": 4, "1 Tessalonicenses": 5, "2 Tessalonicenses": 3,
  "1 Timóteo": 6, "2 Timóteo": 4, "Tito": 3, "Filemom": 1, "Hebreus": 13,
  "Tiago": 5, "1 Pedro": 5, "2 Pedro": 3, "1 João": 5, "2 João": 1,
  "3 João": 1, "Judas": 1, "Apocalipse": 22,
};

// Key verses for each book (summary verses) - shown when opening a chapter
// These are original summaries inspired by the themes of each chapter, not copied text
export const chapterThemes: Record<string, Record<number, string>> = {
  "Gênesis": {
    1: "A criação do mundo em seis dias. Deus cria a luz, o céu, a terra, os mares, as plantas, os astros, os animais e o ser humano.",
    2: "O descanso de Deus no sétimo dia. A criação de Adão e Eva no Jardim do Éden.",
    3: "A tentação da serpente. Adão e Eva desobedecem a Deus e são expulsos do Éden.",
    4: "Caim e Abel. O primeiro assassinato. Caim mata seu irmão por inveja.",
    5: "Genealogia de Adão a Noé. Os patriarcas que viveram antes do dilúvio.",
    6: "A maldade dos homens. Deus decide enviar o dilúvio. Noé é escolhido para construir a arca.",
    7: "Noé entra na arca com sua família e os animais. O dilúvio cobre toda a terra.",
    8: "As águas do dilúvio baixam. Noé envia a pomba. A arca repousa no Monte Ararate.",
    9: "A aliança de Deus com Noé. O arco-íris como sinal da promessa.",
    10: "A tábua das nações. Os descendentes de Sem, Cam e Jafé.",
    11: "A Torre de Babel. Deus confunde as línguas. Genealogia de Sem a Abrão.",
    12: "O chamado de Abrão. Deus promete fazer dele uma grande nação. Abrão vai para o Egito.",
  },
  "Salmos": {
    1: "O justo é como árvore plantada junto a ribeiros de águas. O caminho dos ímpios perecerá.",
    23: "O Senhor é meu pastor, nada me faltará. Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum.",
    91: "Aquele que habita no esconderijo do Altíssimo. Sobre mil cairão ao teu lado, mas tu não serás atingido.",
    119: "O maior salmo da Bíblia. Celebração da Palavra de Deus e de Seus mandamentos.",
    150: "Louvai ao Senhor! Todo ser que respira louve ao Senhor!",
  },
  "Provérbios": {
    1: "O temor do Senhor é o princípio da sabedoria. Conselhos de um pai ao seu filho.",
    3: "Confia no Senhor de todo o teu coração. Em todos os teus caminhos reconhece-O.",
    31: "A mulher virtuosa. Seu valor excede o de rubis.",
  },
  "Mateus": {
    1: "Genealogia de Jesus Cristo. O anjo anuncia a José que Maria conceberá pelo Espírito Santo.",
    5: "O Sermão do Monte. As Bem-aventuranças. Sal da terra e luz do mundo.",
    6: "A oração do Pai Nosso. Não ajunteis tesouros na terra. Buscai primeiro o Reino de Deus.",
    7: "Não julgueis. A porta estreita. A casa sobre a rocha.",
    28: "A ressurreição de Jesus. A Grande Comissão: ide e fazei discípulos de todas as nações.",
  },
  "João": {
    1: "No princípio era o Verbo. O Verbo se fez carne e habitou entre nós.",
    3: "Jesus e Nicodemos. É necessário nascer de novo. Porque Deus amou o mundo de tal maneira...",
    14: "Eu sou o Caminho, a Verdade e a Vida. A promessa do Espírito Santo Consolador.",
    15: "Eu sou a videira, vós sois os ramos. Permanecei em mim. Amai-vos uns aos outros.",
  },
  "Apocalipse": {
    1: "A revelação de Jesus Cristo. João na ilha de Patmos. A visão do Filho do Homem glorificado.",
    21: "Novo céu e nova terra. A Nova Jerusalém desce do céu. Deus enxugará toda lágrima.",
    22: "O rio da água da vida. A árvore da vida. Eis que venho sem demora!",
  },
};
