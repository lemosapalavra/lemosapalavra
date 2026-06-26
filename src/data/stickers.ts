import bgCriacao1 from "@/assets/album/criacao-1.webp";
import bgCriacao2 from "@/assets/album/criacao-2.webp";
import bgPatriarcas1 from "@/assets/album/patriarcas-1.webp";
import bgExodo1 from "@/assets/album/exodo-1.webp";
import bgMilagres1 from "@/assets/album/milagres-1.webp";
import bgMilagres2 from "@/assets/album/milagres-2.webp";
import bgReis1 from "@/assets/album/reis-1.webp";
import bgIgreja1 from "@/assets/album/igreja-1.webp";
import bgEnsinamentos1 from "@/assets/album/ensinamentos-1.webp";
import bgLugares1 from "@/assets/album/lugares-1.webp";
import bgApocalipse1 from "@/assets/album/apocalipse-1.webp";
import bgPersonagens1 from "@/assets/album/personagens-1.webp";
import bgProfetas1 from "@/assets/album/profetas-1.webp";
import bgVersiculos1 from "@/assets/album/versiculos-1.webp";
import { generatedStickerImage } from "@/data/generatedStickerImages";


// Cropped sticker artwork (sorted by filename)
function loadSet(glob: Record<string, string>): string[] {
  return Object.entries(glob)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}
const heroisImgs = loadSet(import.meta.glob("@/assets/album/herois-stickers/*.webp", { eager: true, import: "default" }) as Record<string, string>);
const historiasImgs = loadSet(import.meta.glob("@/assets/album/historias-stickers/*.webp", { eager: true, import: "default" }) as Record<string, string>);
const personagensImgs = loadSet(import.meta.glob("@/assets/album/personagens-stickers/*.webp", { eager: true, import: "default" }) as Record<string, string>);
const profetasImgs = loadSet(import.meta.glob("@/assets/album/profetas-stickers/*.webp", { eager: true, import: "default" }) as Record<string, string>);
const milagresImgs = loadSet(import.meta.glob("@/assets/album/milagres-stickers/*.webp", { eager: true, import: "default" }) as Record<string, string>);
const lugaresImgs = loadSet(import.meta.glob("@/assets/album/lugares-stickers/*.webp", { eager: true, import: "default" }) as Record<string, string>);
const objetosImgs = loadSet(import.meta.glob("@/assets/album/objetos-stickers/*.webp", { eager: true, import: "default" }) as Record<string, string>);
const extrasImgs = loadSet(import.meta.glob("@/assets/album/extras-stickers/*.webp", { eager: true, import: "default" }) as Record<string, string>);

export type Rarity = "normal" | "rara" | "reliquia";

export interface Sticker {
  id: number;
  name: string;
  emoji: string;
  rarity: Rarity;
  image?: string;
  reference?: string;
}

export interface Category {
  key: string;
  name: string;
  icon: string;
  color: string;
  bgs?: (string | undefined)[];
  stickers: Sticker[];
}

type Entry = [name: string, emoji: string, reference?: string];

// 16 per category. Last = "reliquia" (especial dourada), penúltima e antepenúltima = "rara".
// Total: 13 normais + 2 raras + 1 relíquia por categoria = 208 figurinhas no álbum.
function build(items: Entry[], images?: string[]): Sticker[] {
  const last = items.length - 1;
  const penult = items.length - 2;
  const antepenult = items.length - 3;
  return items.map((n, i) => ({
    id: 0,
    name: n[0],
    emoji: n[1],
    reference: n[2],
    rarity:
      i === last ? "reliquia" : (i === penult || i === antepenult) ? "rara" : "normal",
    image: images?.[i],
  }));
}

const raw: Category[] = [
  {
    key: "criacao", name: "A Criação", icon: "🌍", color: "from-sky-400 to-blue-600",
    bgs: [bgCriacao1, bgCriacao2],
    stickers: build([
      ["Deus Criando a Luz", "✨", "Gênesis 1:3"],
      ["O Sol e a Lua", "☀️", "Gênesis 1:16"],
      ["Animais da Terra", "🦁", "Gênesis 1:24"],
      ["Peixes e Aves", "🐟", "Gênesis 1:20"],
      ["Jardim do Éden", "🌳", "Gênesis 2:8"],
      ["Adão e Eva", "👫", "Gênesis 2:21"],
      ["O Descanso de Deus", "🕊️", "Gênesis 2:2"],
      ["Rios do Éden", "🏞️", "Gênesis 2:10"],
      ["A Serpente Astuta", "🐍", "Gênesis 3:1"],
      ["O Fruto Proibido", "🍎", "Gênesis 3:6"],
      ["Querubins Guardiões", "🗡️", "Gênesis 3:24"],
      ["Caim e Abel", "🌾", "Gênesis 4"],
      ["As Estrelas do Céu", "🌟", "Gênesis 1:16"],
      ["Sopro da Vida", "🌬️", "Gênesis 2:7"],
      ["A Primeira Família", "👨‍👩‍👦", "Gênesis 4:1"],
      ["A Criação Completa", "🌌", "Gênesis 1"],
    ], historiasImgs),
  },
  {
    key: "herois", name: "Heróis da Bíblia", icon: "🦸", color: "from-yellow-400 to-amber-600",
    bgs: [bgPersonagens1, bgPatriarcas1],
    stickers: build([
      ["Noé e a Arca", "🌈", "Gênesis 6-9"],
      ["Abraão e a Promessa", "🌟", "Gênesis 15"],
      ["José do Egito", "👑", "Gênesis 41"],
      ["Moisés no Mar Vermelho", "🌊", "Êxodo 14"],
      ["Davi e Golias", "🪨", "1 Samuel 17"],
      ["Daniel na Cova dos Leões", "🦁", "Daniel 6"],
      ["Ester a Rainha Corajosa", "👸", "Ester 4"],
      ["Josué Conquistador", "⚔️", "Josué 1"],
      ["Sansão o Forte", "💪", "Juízes 16"],
      ["Gideão Valente", "🛡️", "Juízes 6"],
      ["Elias o Profeta", "🔥", "1 Reis 18"],
      ["Salomão o Sábio", "📜", "1 Reis 3"],
      ["Jacó e a Escada", "🪜", "Gênesis 28"],
      ["Isaque o Prometido", "👶", "Gênesis 21"],
      ["Neemias Construtor", "🧱", "Neemias 2"],
      ["Os Grandes Heróis da Fé", "🏆", "Hebreus 11"],
    ], heroisImgs),
  },
  {
    key: "milagres", name: "Milagres de Jesus", icon: "✨", color: "from-cyan-400 to-teal-600",
    bgs: [bgMilagres1, bgMilagres2],
    stickers: build([
      ["Jesus Cura o Cego", "👁️", "João 9"],
      ["Multiplicação dos Pães", "🍞", "João 6"],
      ["Jesus Acalma a Tempestade", "⛵", "Marcos 4"],
      ["Água em Vinho", "🍷", "João 2"],
      ["Ressurreição de Lázaro", "✨", "João 11"],
      ["Jesus Anda Sobre as Águas", "💧", "Mateus 14"],
      ["Cura dos Dez Leprosos", "🙌", "Lucas 17"],
      ["Cura do Paralítico", "🛏️", "Marcos 2"],
      ["A Filha de Jairo", "👧", "Marcos 5"],
      ["A Mulher do Fluxo", "💗", "Marcos 5:25"],
      ["Pesca Milagrosa", "🎣", "Lucas 5"],
      ["Cura do Surdo-Mudo", "👂", "Marcos 7"],
      ["Expulsão de Demônios", "🕊️", "Marcos 5:8"],
      ["Cura na Piscina", "🏊", "João 5"],
      ["Cura da Mão Ressequida", "✋", "Marcos 3"],
      ["O Poder de Jesus", "🌟", "Marcos 5"],
    ], milagresImgs),
  },
  {
    key: "parabolas", name: "Parábolas de Jesus", icon: "📖", color: "from-pink-400 to-rose-600",
    bgs: [bgEnsinamentos1],
    stickers: build([
      ["O Bom Samaritano", "🤝", "Lucas 10:25"],
      ["O Filho Pródigo", "🤗", "Lucas 15:11"],
      ["A Ovelha Perdida", "🐑", "Lucas 15:4"],
      ["O Semeador", "🌱", "Mateus 13"],
      ["O Tesouro Escondido", "💰", "Mateus 13:44"],
      ["As Dez Virgens", "🕯️", "Mateus 25"],
      ["A Casa na Rocha", "🏠", "Mateus 7:24"],
      ["A Moeda Perdida", "🪙", "Lucas 15:8"],
      ["O Rico e Lázaro", "👔", "Lucas 16:19"],
      ["O Fariseu e o Publicano", "🙏", "Lucas 18:9"],
      ["A Rede de Pesca", "🕸️", "Mateus 13:47"],
      ["Os Talentos", "💎", "Mateus 25:14"],
      ["A Pérola Preciosa", "🦪", "Mateus 13:45"],
      ["O Grão de Mostarda", "🌰", "Mateus 13:31"],
      ["O Bom Pastor", "🐏", "João 10"],
      ["Jesus Ensinando ao Povo", "📜", "Mateus 5"],
    ], historiasImgs),
  },
  {
    key: "animais", name: "Animais da Bíblia", icon: "🐑", color: "from-green-400 to-emerald-600",
    bgs: [bgCriacao2],
    stickers: build([
      ["Os Animais da Arca", "🐘", "Gênesis 7"],
      ["O Grande Peixe de Jonas", "🐳", "Jonas 1-2"],
      ["Leões de Daniel", "🦁", "Daniel 6"],
      ["O Cordeiro", "🐑", "João 1:29"],
      ["A Pomba da Paz", "🕊️", "Gênesis 8:11"],
      ["O Jumentinho de Jesus", "🐴", "Mateus 21"],
      ["Os Corvos de Elias", "🦅", "1 Reis 17"],
      ["A Serpente de Bronze", "🐍", "Números 21"],
      ["O Galo de Pedro", "🐓", "Mateus 26:74"],
      ["O Bezerro de Ouro", "🐂", "Êxodo 32"],
      ["Os Cavalos de Faraó", "🐎", "Êxodo 14"],
      ["Lobo e Cordeiro", "🐺", "Isaías 11:6"],
      ["As Rãs do Egito", "🐸", "Êxodo 8"],
      ["Os Gafanhotos", "🦗", "Joel 2"],
      ["A Águia Renovada", "🦅", "Isaías 40:31"],
      ["A Grande Arca", "🚢", "Gênesis 6"],
    ], extrasImgs),
  },
  {
    key: "momentos", name: "Momentos Especiais", icon: "🌟", color: "from-amber-400 to-yellow-600",
    bgs: [bgIgreja1],
    stickers: build([
      ["O Nascimento de Jesus", "👶", "Lucas 2"],
      ["A Estrela de Belém", "⭐", "Mateus 2"],
      ["Os Pastores e os Anjos", "👼", "Lucas 2:8"],
      ["Os Reis Magos", "👑", "Mateus 2:11"],
      ["Entrada Triunfal", "🌿", "Mateus 21"],
      ["A Última Ceia", "🍞", "Lucas 22"],
      ["A Ressurreição", "🌅", "Mateus 28"],
      ["O Batismo de Jesus", "💧", "Mateus 3:13"],
      ["A Transfiguração", "✨", "Mateus 17"],
      ["Jesus no Templo aos 12", "📖", "Lucas 2:46"],
      ["Getsêmani", "🌳", "Mateus 26:36"],
      ["A Crucificação", "✝️", "João 19"],
      ["A Ascensão", "☁️", "Atos 1:9"],
      ["Pentecostes", "🔥", "Atos 2"],
      ["Anunciação a Maria", "👼", "Lucas 1:26"],
      ["Jesus Vive!", "✝️", "Mateus 28:6"],
    ], historiasImgs),
  },
  {
    key: "louvores", name: "Louvores e Adoração", icon: "🎵", color: "from-purple-400 to-fuchsia-600",
    bgs: [bgVersiculos1],
    stickers: build([
      ["Crianças Louvando", "👧", "Mateus 21:16"],
      ["Davi Tocando Harpa", "🎼", "1 Samuel 16:23"],
      ["Coral de Anjos", "👼", "Lucas 2:13"],
      ["Música para Jesus", "🎶", "Salmos 150"],
      ["Dançando de Alegria", "💃", "2 Samuel 6:14"],
      ["Trombetas de Jericó", "📯", "Josué 6"],
      ["Coração que Louva", "💖", "Salmos 9:1"],
      ["Mãos Levantadas", "🙌", "Salmos 134"],
      ["Salmos de Davi", "📜", "Salmos 23"],
      ["Pandeiro de Miriã", "🥁", "Êxodo 15:20"],
      ["Cântico de Moisés", "🎵", "Êxodo 15"],
      ["Hinos da Igreja", "🎤", "Efésios 5:19"],
      ["Adoração Familiar", "👪", "Salmos 100"],
      ["Aleluia ao Senhor", "🌟", "Salmos 146"],
      ["Sinos do Templo", "🔔", "Êxodo 28:33"],
      ["Louvor Celestial", "🎺", "Apocalipse 5:9"],
    ], objetosImgs),
  },
  {
    key: "versiculos", name: "Versículos Ilustrados", icon: "📜", color: "from-violet-400 to-purple-600",
    bgs: [bgVersiculos1],
    stickers: build([
      ["Deus é Amor", "❤️", "1 João 4:8"],
      ["O Senhor é Meu Pastor", "🐑", "Salmos 23"],
      ["Tudo Posso", "💪", "Filipenses 4:13"],
      ["Jesus me Ama", "💖", "João 3:16"],
      ["Não Temas", "🛡️", "Isaías 41:10"],
      ["Confia no Senhor", "🙏", "Provérbios 3:5"],
      ["Seja Forte e Corajoso", "🦁", "Josué 1:9"],
      ["Luz do Mundo", "💡", "Mateus 5:14"],
      ["Sal da Terra", "🧂", "Mateus 5:13"],
      ["Caminho, Verdade e Vida", "🛤️", "João 14:6"],
      ["Bem-aventurados", "🌈", "Mateus 5"],
      ["Pedi e Recebereis", "🙋", "Mateus 7:7"],
      ["Amai-vos uns aos outros", "🤗", "João 13:34"],
      ["Tudo concorre para o bem", "✨", "Romanos 8:28"],
      ["A Fé Move Montanhas", "⛰️", "Mateus 17:20"],
      ["Versículo de Ouro", "✨", "João 3:16"],
    ], personagensImgs),
  },
  {
    key: "antigo", name: "Antigo Testamento", icon: "📚", color: "from-stone-400 to-amber-700",
    bgs: [bgProfetas1, bgExodo1],
    stickers: build([
      ["Elias e o Fogo do Céu", "🔥", "1 Reis 18"],
      ["Jacó e a Escada", "🪜", "Gênesis 28"],
      ["Samuel no Templo", "🕯️", "1 Samuel 3"],
      ["Josué e Jericó", "📯", "Josué 6"],
      ["Gideão Guerreiro", "⚔️", "Juízes 7"],
      ["Rute e Noemi", "🌾", "Rute 1"],
      ["Eliseu e o Azeite", "🫒", "2 Reis 4"],
      ["Isaías Profeta", "📜", "Isaías 6"],
      ["Jeremias o Choroso", "💧", "Jeremias 1"],
      ["Ezequiel e os Ossos", "🦴", "Ezequiel 37"],
      ["Os Três no Forno", "🔥", "Daniel 3"],
      ["Jonas e Nínive", "🐳", "Jonas 3"],
      ["O Tabernáculo", "⛺", "Êxodo 26"],
      ["Arca da Aliança", "📦", "Êxodo 25"],
      ["Templo de Salomão", "🏛️", "1 Reis 6"],
      ["Profetas de Deus", "📜", "Hebreus 1:1"],
    ], profetasImgs),
  },
  {
    key: "novo", name: "Novo Testamento", icon: "✝️", color: "from-blue-400 to-indigo-600",
    bgs: [bgPersonagens1],
    stickers: build([
      ["João Batista", "🌿", "Mateus 3"],
      ["Pedro Pescador", "🎣", "Lucas 5"],
      ["Paulo Missionário", "✉️", "Atos 9"],
      ["Maria e o Anjo", "👼", "Lucas 1:26"],
      ["Os Discípulos", "👥", "Mateus 10"],
      ["Estêvão Mártir", "🌟", "Atos 7"],
      ["Lídia Comerciante", "💜", "Atos 16"],
      ["André o Apóstolo", "🎣", "João 1:40"],
      ["Tomé o Incrédulo", "🤔", "João 20"],
      ["Mateus Cobrador", "💰", "Mateus 9:9"],
      ["Tiago Apóstolo", "📖", "Tiago 1"],
      ["Lucas o Médico", "⚕️", "Colossenses 4:14"],
      ["Barnabé Encorajador", "🤲", "Atos 4:36"],
      ["Timóteo Discípulo", "✉️", "1 Timóteo 1"],
      ["Priscila e Áquila", "💞", "Atos 18"],
      ["Os Seguidores de Jesus", "✝️", "Atos 1"],
    ], personagensImgs),
  },
  {
    key: "mulheres", name: "Mulheres da Bíblia", icon: "👩", color: "from-pink-400 to-rose-600",
    bgs: [bgPersonagens1, bgIgreja1],
    stickers: build([
      ["Sara, mãe das nações", "👵", "Gênesis 17:15"],
      ["Rute, a fiel", "🌾", "Rute 1:16"],
      ["Ana, mãe de Samuel", "🙏", "1 Samuel 1"],
      ["Débora, juíza e profetisa", "⚖️", "Juízes 4-5"],
      ["Ester, a rainha corajosa", "👸", "Ester 4:14"],
      ["Maria, mãe de Jesus", "🌹", "Lucas 1:26"],
      ["Maria Madalena", "💧", "João 20:11"],
      ["Rebeca no Poço", "💧", "Gênesis 24"],
      ["Raquel a Amada", "💝", "Gênesis 29"],
      ["Lia a Frutífera", "🌿", "Gênesis 29:31"],
      ["Miriã Profetisa", "🥁", "Êxodo 15:20"],
      ["Abigail a Prudente", "🍞", "1 Samuel 25"],
      ["Marta e Maria", "🏡", "Lucas 10:38"],
      ["A Samaritana no Poço", "🚰", "João 4"],
      ["Dorcas a Bondosa", "🧵", "Atos 9:36"],
      ["Lídia, vendedora de púrpura", "💜", "Atos 16:14"],
    ], personagensImgs),
  },
  {
    key: "missoes", name: "Missões e Aventuras", icon: "🌍", color: "from-teal-400 to-cyan-600",
    bgs: [bgLugares1],
    stickers: build([
      ["Jonas e o Grande Peixe", "🐳", "Jonas 1"],
      ["Paulo no Navio", "⛵", "Atos 27"],
      ["Viagens Missionárias", "🗺️", "Atos 13"],
      ["Pregando para Multidões", "📢", "Atos 2"],
      ["Filipe e o Etíope", "📖", "Atos 8"],
      ["Barnabé Encorajador", "🤲", "Atos 11"],
      ["A Igreja de Antioquia", "⛪", "Atos 11:26"],
      ["Naufrágio em Malta", "🏝️", "Atos 28"],
      ["Paulo e Silas na Prisão", "⛓️", "Atos 16:25"],
      ["A Conversão de Saulo", "💡", "Atos 9"],
      ["Visão Macedônica", "🌙", "Atos 16:9"],
      ["O Concílio de Jerusalém", "🤝", "Atos 15"],
      ["Areópago de Atenas", "🏛️", "Atos 17:22"],
      ["Cartas às Igrejas", "✉️", "Apocalipse 2-3"],
      ["Missionários Modernos", "🌐", "Mateus 28:19"],
      ["Levando a Palavra", "📖", "Mateus 28:19"],
    ], lugaresImgs),
  },
  {
    key: "ultra", name: "Figurinhas Ultra Raras", icon: "👑", color: "from-fuchsia-500 to-rose-600",
    bgs: [bgApocalipse1, bgReis1],
    stickers: build([
      ["Jesus Rei dos Reis", "👑", "Apocalipse 19:16"],
      ["O Céu Glorioso", "☁️", "Apocalipse 21"],
      ["Anjos Adorando", "👼", "Apocalipse 5:11"],
      ["A Nova Jerusalém", "🏙️", "Apocalipse 21:2"],
      ["O Cordeiro de Deus", "🐑", "Apocalipse 5:6"],
      ["Os 24 Anciãos", "📜", "Apocalipse 4:4"],
      ["Rio da Vida", "💧", "Apocalipse 22:1"],
      ["A Árvore da Vida", "🌳", "Apocalipse 22:2"],
      ["O Livro da Vida", "📕", "Apocalipse 20:12"],
      ["Os Quatro Cavaleiros", "🐎", "Apocalipse 6"],
      ["Os Sete Selos", "📜", "Apocalipse 5"],
      ["O Arcanjo Miguel", "⚔️", "Apocalipse 12:7"],
      ["A Mulher Vestida de Sol", "☀️", "Apocalipse 12:1"],
      ["As Bodas do Cordeiro", "💍", "Apocalipse 19:7"],
      ["O Trono Branco", "⚖️", "Apocalipse 20:11"],
      ["Trono de Deus", "✨", "Apocalipse 4"],
    ], heroisImgs),
  },
];

let nextId = 0;
export const categories: Category[] = raw.map((c) => ({
  ...c,
  stickers: c.stickers.map((s, i) => ({
    ...s,
    id: nextId++,
    // Se houver arte gerada por IA específica para este nome, prioriza-a.
    image: generatedStickerImage(c.key, i) ?? s.image,
  })),
}));


export const allStickers: Sticker[] = categories.flatMap((c) => c.stickers);

export function rarityColor(r: Rarity): string {
  if (r === "reliquia") return "from-yellow-400 via-orange-400 to-amber-600";
  if (r === "rara") return "from-blue-400 to-indigo-600";
  return "from-slate-300 to-slate-500";
}

export function rarityLabel(r: Rarity): string {
  return r === "reliquia" ? "Relíquia" : r === "rara" ? "Rara" : "Normal";
}

export function rarityBorder(r: Rarity): string {
  if (r === "reliquia") return "border-yellow-400 shadow-yellow-400/50";
  if (r === "rara") return "border-blue-400 shadow-blue-400/40";
  return "border-slate-400 shadow-slate-400/20";
}
