export interface DailyMessage {
  title: string;
  text: string;
  verse: string;
  emoji: string;
}

export const DAILY_MESSAGES: DailyMessage[] = [
  { title: "Deus é o seu refúgio", text: "Em cada momento difícil, lembre-se: Ele está mais perto do que você imagina.", verse: "Salmos 46:1", emoji: "🕊️" },
  { title: "A fé move montanhas", text: "Acredite no impossível hoje. O que parece obstáculo pode ser o começo de um milagre.", verse: "Mateus 17:20", emoji: "⛰️" },
  { title: "Ame como Ele te amou", text: "Um sorriso, uma palavra gentil, um abraço — o amor de Deus se manifesta em atitudes simples.", verse: "João 13:34", emoji: "💛" },
  { title: "Nova misericórdia a cada manhã", text: "O ontem já passou. Hoje é uma nova página escrita pelas mãos do Criador.", verse: "Lamentações 3:22-23", emoji: "🌅" },
  { title: "Confie no plano de Deus", text: "Mesmo quando não entender o caminho, confie em Quem traça a rota.", verse: "Provérbios 3:5-6", emoji: "🗺️" },
  { title: "Você é luz do mundo", text: "Brilhe onde você estiver. Sua alegria pode iluminar o dia de alguém.", verse: "Mateus 5:14", emoji: "✨" },
  { title: "Paz que excede o entendimento", text: "Respire fundo. Deus cuida de tudo o que você não consegue resolver sozinho.", verse: "Filipenses 4:7", emoji: "🌿" },
  { title: "Grato por tudo", text: "A gratidão transforma o pouco em muito e o comum em milagre.", verse: "1 Tessalonicenses 5:18", emoji: "🙏" },
  { title: "Coragem, filho(a) de Deus!", text: "Não temas, pois Ele vai com você por onde quer que andes.", verse: "Josué 1:9", emoji: "🦁" },
  { title: "Sonhe grande com Deus", text: "Ele é capaz de fazer infinitamente mais do que pedimos ou pensamos.", verse: "Efésios 3:20", emoji: "🌈" },
  { title: "Perdoe e liberte-se", text: "Perdoar não muda o passado, mas liberta o seu coração para o futuro.", verse: "Colossenses 3:13", emoji: "🕊️" },
  { title: "Deus ouve sua oração", text: "Fale com Ele como quem fala com um amigo. Ele está sempre disponível.", verse: "1 Pedro 5:7", emoji: "💬" },
  { title: "Você é criação maravilhosa", text: "Feito com propósito, cuidado e amor. Você tem valor infinito aos olhos de Deus.", verse: "Salmos 139:14", emoji: "🌟" },
  { title: "A alegria do Senhor é sua força", text: "Sorria! Existe motivo para celebrar em cada respiração.", verse: "Neemias 8:10", emoji: "😊" },
  { title: "Semeie o bem hoje", text: "Cada gesto de bondade é uma semente que produzirá fruto na hora certa.", verse: "Gálatas 6:9", emoji: "🌱" },
  { title: "Ele carrega você", text: "Nos dias em que faltarem forças, Ele te sustentará com Sua destra fiel.", verse: "Isaías 41:10", emoji: "🤲" },
  { title: "Descanse em Deus", text: "Vinde a mim, todos os que estais cansados. Nele há descanso verdadeiro.", verse: "Mateus 11:28", emoji: "🌙" },
  { title: "Palavras que edificam", text: "Use sua voz para abençoar. Palavras têm poder de vida e morte.", verse: "Provérbios 18:21", emoji: "🗣️" },
  { title: "Milagres acontecem", text: "Mantenha os olhos abertos: Deus está agindo mesmo quando você não vê.", verse: "Jeremias 33:3", emoji: "🎁" },
  { title: "Amor que nunca falha", text: "Nem altura, nem profundidade, nem qualquer coisa poderá te separar do amor de Deus.", verse: "Romanos 8:38-39", emoji: "❤️" },
  { title: "Persevere na fé", text: "A corrida é longa, mas a recompensa é eterna. Não desista.", verse: "Hebreus 12:1", emoji: "🏃" },
  { title: "Ore sem cessar", text: "A oração é a chave que abre portas que ninguém consegue fechar.", verse: "1 Tessalonicenses 5:17", emoji: "🔑" },
  { title: "Deus enxerga o coração", text: "Não se preocupe com aparências. O que importa é o que há dentro de você.", verse: "1 Samuel 16:7", emoji: "💗" },
  { title: "Renove sua mente", text: "Pensamentos bons produzem vida boa. Escolha meditar no que é verdadeiro.", verse: "Filipenses 4:8", emoji: "🧠" },
  { title: "Não estás sozinho", text: "Onde dois ou três estiverem reunidos em Meu nome, ali estarei no meio deles.", verse: "Mateus 18:20", emoji: "🤝" },
  { title: "Fruto do Espírito", text: "Amor, alegria, paz, paciência — cultive hoje um desses frutos.", verse: "Gálatas 5:22", emoji: "🍇" },
  { title: "Prosperidade da alma", text: "Que sua alma prospere, e tudo mais virá por acréscimo.", verse: "3 João 1:2", emoji: "🌻" },
  { title: "Nada é impossível", text: "Para Deus, nenhuma palavra é sem poder. Creia hoje.", verse: "Lucas 1:37", emoji: "🌠" },
  { title: "Louvor em toda hora", text: "Louvai ao Senhor sempre! O louvor abre céus e transforma ambientes.", verse: "Salmos 34:1", emoji: "🎵" },
  { title: "Você é vencedor", text: "Em Cristo somos mais que vencedores. A vitória já é sua.", verse: "Romanos 8:37", emoji: "🏆" },
  { title: "Espere no Senhor", text: "Os que esperam no Senhor renovam as forças e sobem com asas como águias.", verse: "Isaías 40:31", emoji: "🦅" },
];

export function getTodayMessage(): DailyMessage {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DAILY_MESSAGES[day % DAILY_MESSAGES.length];
}
