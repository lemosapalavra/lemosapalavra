import bgCriacao1 from "@/assets/album/criacao-1.webp";
import bgCriacao2 from "@/assets/album/criacao-2.webp";
import bgPatriarcas1 from "@/assets/album/patriarcas-1.webp";
import bgPatriarcas2 from "@/assets/album/patriarcas-2.webp";
import bgExodo1 from "@/assets/album/exodo-1.webp";
import bgExodo2 from "@/assets/album/exodo-2.webp";
import bgMilagres1 from "@/assets/album/milagres-1.webp";
import bgMilagres2 from "@/assets/album/milagres-2.webp";
import bgReis1 from "@/assets/album/reis-1.webp";
import bgReis2 from "@/assets/album/reis-2.webp";
import bgIgreja1 from "@/assets/album/igreja-1.webp";
import bgIgreja2 from "@/assets/album/igreja-2.webp";
import bgEnsinamentos1 from "@/assets/album/ensinamentos-1.webp";
import bgEnsinamentos2 from "@/assets/album/ensinamentos-2.webp";
import bgLugares1 from "@/assets/album/lugares-1.webp";
import bgLugares2 from "@/assets/album/lugares-2.webp";
import bgApocalipse1 from "@/assets/album/apocalipse-1.webp";
import bgApocalipse2 from "@/assets/album/apocalipse-2.webp";
import bgPersonagens1 from "@/assets/album/personagens-1.webp";
import bgPersonagens2 from "@/assets/album/personagens-2.webp";
import bgProfetas1 from "@/assets/album/profetas-1.webp";
import bgProfetas2 from "@/assets/album/profetas-2.webp";
import bgVersiculos1 from "@/assets/album/versiculos-1.webp";
import bgVersiculos2 from "@/assets/album/versiculos-2.webp";

// Cropped sticker artwork from attachments (16 each)
const heroisImgs = Object.values(
  import.meta.glob("@/assets/album/herois-stickers/*.webp", { eager: true, import: "default" })
) as string[];
const historiasImgs = Object.values(
  import.meta.glob("@/assets/album/historias-stickers/*.webp", { eager: true, import: "default" })
) as string[];
const personagensImgs = Object.values(
  import.meta.glob("@/assets/album/personagens-stickers/*.webp", { eager: true, import: "default" })
) as string[];

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

function build(items: Entry[], images?: string[]): Sticker[] {
  const padded = [...items];
  while (padded.length < 16) padded.push(items[padded.length % items.length]);
  return padded.slice(0, 16).map((n, i) => ({
    id: 0,
    name: n[0],
    emoji: n[1],
    reference: n[2],
    rarity: i === 0 ? "reliquia" : i <= 2 ? "rara" : "normal",
    image: images?.[i],
  }));
}

const raw: Category[] = [
  {
    key: "herois", name: "Heróis da Fé", icon: "🦸", color: "from-yellow-400 to-amber-600",
    bgs: [bgPersonagens1, bgPersonagens2],
    stickers: build([
      ["Jesus", "✝️", "Mateus 1:21"],
      ["Davi", "🎵", "1 Samuel 17"],
      ["Moisés", "📜", "Êxodo 3"],
      ["Rute", "🌾", "Rute 1:16"],
      ["Josué", "⚔️", "Josué 1:9"],
      ["Maria", "🕊️", "Lucas 1:38"],
      ["Ester", "👑", "Ester 4:14"],
      ["Paulo", "✉️", "Atos 9"],
      ["Noé", "🌈", "Gênesis 6-9"],
      ["Samuel", "🪔", "1 Samuel 3"],
      ["Daniel", "🦁", "Daniel 6"],
      ["Lázaro", "✨", "João 11"],
      ["Bartimeu", "👁️", "Marcos 10:46-52"],
      ["João Batista", "🌿", "Mateus 3"],
      ["Zaqueu", "🌳", "Lucas 19:1-10"],
      ["Noemi", "💞", "Rute 1"],
    ], heroisImgs),
  },
  {
    key: "historias", name: "Histórias Bíblicas", icon: "📖", color: "from-sky-400 to-blue-700",
    bgs: [bgCriacao1, bgCriacao2],
    stickers: build([
      ["Criação", "🌍", "Gênesis 1"],
      ["Arca de Noé", "🚢", "Gênesis 6-9"],
      ["Abraão e Isaque", "🔥", "Gênesis 22"],
      ["José do Egito", "👑", "Gênesis 37-50"],
      ["Moisés e o Mar", "🌊", "Êxodo 14"],
      ["Jonas e o Peixe", "🐳", "Jonas 1-2"],
      ["Natividade", "👶", "Lucas 2"],
      ["Travessia do Mar Vermelho", "💧", "Êxodo 14"],
      ["A Torre de Babel", "🏯", "Gênesis 11"],
      ["Débora e Baraque", "⚔️", "Juízes 4"],
      ["Davi e Golias", "🪨", "1 Samuel 17"],
      ["A Entrada em Jerusalém", "🌿", "Mateus 21"],
      ["A Última Ceia", "🍞", "Lucas 22"],
      ["A Crucificação", "✝️", "João 19"],
      ["A Ressurreição", "🌅", "Mateus 28"],
      ["Pentecostes", "🔥", "Atos 2"],
    ], historiasImgs),
  },
  {
    key: "personagens", name: "Personagens", icon: "👥", color: "from-emerald-400 to-green-600",
    bgs: [bgPersonagens1, bgPersonagens2],
    stickers: build([
      ["Ana", "🙏", "1 Samuel 1"],
      ["Eli", "👴", "1 Samuel 3"],
      ["Absalão", "🧒", "2 Samuel 18"],
      ["Salomão", "👑", "1 Reis 3"],
      ["Isaías", "📜", "Isaías 6"],
      ["Jeremias", "✍️", "Jeremias 1"],
      ["Ezequiel", "📖", "Ezequiel 1"],
      ["Daniel", "🦁", "Daniel 6"],
      ["Sansão", "💪", "Juízes 13-16"],
      ["Rute", "🌾", "Rute 1"],
      ["Daniel jovem", "🌟", "Daniel 1"],
      ["Estêvão", "🕊️", "Atos 7"],
      ["José do Egito", "🌅", "Gênesis 41"],
      ["José e o Sonho", "💭", "Gênesis 37"],
      ["Faraó", "🏛️", "Êxodo 5"],
      ["Rainha Ester", "👸", "Ester 4"],
    ], personagensImgs),
  },
  {
    key: "criacao", name: "Criação", icon: "🌍", color: "from-sky-400 to-blue-600",
    bgs: [bgCriacao1, bgCriacao2],
    stickers: build([
      ["Adão e Eva", "👫", "Gênesis 2"], ["Jardim do Éden", "🌳", "Gênesis 2:8"], ["Sétimo Dia", "🕊️", "Gênesis 2:2"],
      ["Sol e Lua", "☀️", "Gênesis 1:16"], ["Mar e Peixes", "🐟", "Gênesis 1:21"], ["Aves do Céu", "🦅", "Gênesis 1:20"],
      ["Animais da Terra", "🦁", "Gênesis 1:24"], ["Plantas e Flores", "🌷", "Gênesis 1:11"],
      ["Estrelas", "⭐", "Gênesis 1:16"], ["Espírito sobre as Águas", "💨", "Gênesis 1:2"], ["Galáxias", "🌌", "Salmos 19:1"],
      ["Rios e Mares", "🌊", "Gênesis 1:10"], ["Montanhas", "⛰️", "Salmos 95:4"], ["Frutos da Terra", "🍎", "Gênesis 1:29"],
      ["Anjos da Criação", "👼", "Jó 38:7"], ["Descanso de Deus", "😴", "Gênesis 2:3"],
    ]),
  },
  {
    key: "patriarcas", name: "Patriarcas", icon: "⛺", color: "from-amber-400 to-orange-600",
    bgs: [bgPatriarcas1, bgPatriarcas2],
    stickers: build([
      ["Abraão", "🧔", "Gênesis 12"], ["Sara", "👵", "Gênesis 18"], ["Isaque", "👨", "Gênesis 21"],
      ["Jacó", "👴", "Gênesis 28"], ["Esaú", "🏹", "Gênesis 25"], ["José do Egito", "👑", "Gênesis 37"],
      ["Rebeca", "👰", "Gênesis 24"], ["Raquel", "💍", "Gênesis 29"],
      ["Lia", "👩", "Gênesis 29"], ["Os 12 Filhos", "✨", "Gênesis 49"], ["Tendas", "⛺", "Hebreus 11:9"],
      ["Rebanhos", "🐑", "Gênesis 30"], ["Promessa de Deus", "🌈", "Gênesis 15"], ["Altar de Pedras", "🪨", "Gênesis 28:18"],
      ["Estrelas do Céu", "⭐", "Gênesis 15:5"], ["Caminho de Canaã", "🐪", "Gênesis 12:5"],
    ]),
  },
  {
    key: "exodo", name: "Êxodo", icon: "🏔️", color: "from-red-400 to-rose-600",
    bgs: [bgExodo1, bgExodo2],
    stickers: build([
      ["Moisés", "🧙", "Êxodo 2"], ["Sarça Ardente", "🔥", "Êxodo 3"], ["Mar Vermelho", "🌊", "Êxodo 14"],
      ["Tábuas da Lei", "📜", "Êxodo 20"], ["Maná", "🍞", "Êxodo 16"], ["Faraó", "🤴", "Êxodo 5"],
      ["Vara de Moisés", "🦯", "Êxodo 4"], ["Coluna de Fogo", "🔥", "Êxodo 13:21"],
      ["Tabernáculo", "⛺", "Êxodo 26"], ["Arca da Aliança", "📦", "Êxodo 25"],
    ]),
  },
  {
    key: "milagres", name: "Milagres", icon: "🐟", color: "from-cyan-400 to-teal-600",
    bgs: [bgMilagres1, bgMilagres2],
    stickers: build([
      ["Multiplicação dos Pães", "🍞", "João 6"], ["Água em Vinho", "🍷", "João 2"], ["Cura do Cego", "👁️", "João 9"],
      ["Lázaro Ressuscita", "✨", "João 11"], ["Tempestade Acalmada", "⛵", "Marcos 4"], ["Andar sobre as Águas", "💧", "Mateus 14"],
      ["Pesca Milagrosa", "🎣", "Lucas 5"], ["Cura do Paralítico", "🧎", "Marcos 2"],
      ["Os 10 Leprosos", "🙏", "Lucas 17"], ["Filha de Jairo", "👧", "Marcos 5"],
    ]),
  },
  {
    key: "reis", name: "Reis", icon: "👑", color: "from-yellow-400 to-amber-600",
    bgs: [bgReis1, bgReis2],
    stickers: build([
      ["Davi", "🎵", "1 Samuel 16"], ["Salomão", "👑", "1 Reis 3"], ["Saul", "⚔️", "1 Samuel 9"],
      ["Davi e Golias", "🪨", "1 Samuel 17"], ["Templo de Salomão", "🏛️", "1 Reis 6"], ["Trono Real", "🪑", "1 Reis 10"],
      ["Coroa de Ouro", "👑", "Salmos 21:3"], ["Cetro Real", "🔱", "Ester 5:2"],
      ["Rainha de Sabá", "👸", "1 Reis 10"], ["Harpa de Davi", "🎼", "1 Samuel 16:23"],
    ]),
  },
  {
    key: "ensinamentos", name: "Ensinamentos de Jesus", icon: "❤️", color: "from-pink-400 to-rose-600",
    bgs: [bgEnsinamentos1, bgEnsinamentos2],
    stickers: build([
      ["Sermão do Monte", "⛰️", "Mateus 5"], ["Bem-Aventuranças", "💖", "Mateus 5:3-12"], ["Pai Nosso", "🙏", "Mateus 6:9"],
      ["Bom Samaritano", "🤝", "Lucas 10:25"], ["Filho Pródigo", "🤗", "Lucas 15:11"], ["Ovelha Perdida", "🐑", "Lucas 15:4"],
      ["Semeador", "🌱", "Mateus 13"], ["Pérola Preciosa", "🦪", "Mateus 13:45"],
      ["Talentos", "💰", "Mateus 25:14"], ["Reino dos Céus", "☁️", "Mateus 13:31"],
    ]),
  },
  {
    key: "igreja", name: "A Igreja", icon: "🔥", color: "from-orange-400 to-red-600",
    bgs: [bgIgreja1, bgIgreja2],
    stickers: build([
      ["Pentecostes", "🔥", "Atos 2"], ["Pedro", "🗝️", "Mateus 16:18"], ["Paulo", "✉️", "Atos 9"],
      ["Estêvão", "🌟", "Atos 7"], ["Batismo", "💧", "Atos 2:38"], ["Ceia do Senhor", "🍞", "1 Coríntios 11"],
      ["Cenáculo", "🏠", "Atos 1:13"], ["Conversão de Paulo", "⚡", "Atos 9"],
      ["Igreja Primitiva", "⛪", "Atos 2:42"], ["Diáconos", "🤲", "Atos 6"],
    ]),
  },
  {
    key: "lugares", name: "Lugares", icon: "📍", color: "from-emerald-400 to-green-600",
    bgs: [bgLugares1, bgLugares2],
    stickers: build([
      ["Jerusalém", "🏛️", "Salmos 122"], ["Belém", "⭐", "Lucas 2:4"], ["Nazaré", "🏘️", "Lucas 1:26"],
      ["Mar da Galileia", "🌊", "Mateus 4:18"], ["Rio Jordão", "🏞️", "Mateus 3:13"], ["Monte das Oliveiras", "🌳", "Lucas 22:39"],
      ["Calvário", "✝️", "Lucas 23:33"], ["Tumba Vazia", "🕊️", "Mateus 28"],
      ["Getsêmani", "🌿", "Mateus 26:36"], ["Cafarnaum", "🏠", "Mateus 4:13"],
    ]),
  },
  {
    key: "versiculos", name: "Versículos", icon: "📖", color: "from-violet-400 to-purple-600",
    bgs: [bgVersiculos1, bgVersiculos2],
    stickers: build([
      ["João 3:16", "💝", "João 3:16"], ["Salmo 23", "🐑", "Salmos 23"], ["Filipenses 4:13", "💪", "Filipenses 4:13"],
      ["Romanos 8:28", "🤲", "Romanos 8:28"], ["Provérbios 3:5", "🙇", "Provérbios 3:5"], ["Mateus 6:33", "👑", "Mateus 6:33"],
      ["Isaías 41:10", "🦅", "Isaías 41:10"], ["Salmo 91", "🛡️", "Salmos 91"],
      ["Jeremias 29:11", "🌈", "Jeremias 29:11"], ["1 Coríntios 13", "❤️", "1 Coríntios 13"],
    ]),
  },
  {
    key: "profetas", name: "Profetas", icon: "📜", color: "from-stone-400 to-amber-700",
    bgs: [bgProfetas1, bgProfetas2],
    stickers: build([
      ["Isaías", "📜", "Isaías 6"], ["Jeremias", "😢", "Jeremias 1"], ["Ezequiel", "👁️", "Ezequiel 1"],
      ["Daniel", "🦁", "Daniel 6"], ["Jonas", "🐳", "Jonas 1"], ["Elias", "🔥", "1 Reis 18"],
      ["Eliseu", "🪔", "2 Reis 2"], ["Oséias", "💔", "Oséias 1"],
      ["Amós", "🐏", "Amós 1"], ["Miqueias", "⚖️", "Miqueias 6:8"],
    ]),
  },
  {
    key: "apocalipse", name: "Apocalipse", icon: "🌅", color: "from-fuchsia-500 to-rose-600",
    bgs: [bgApocalipse1, bgApocalipse2],
    stickers: build([
      ["Nova Jerusalém", "🏙️", "Apocalipse 21"], ["Cordeiro de Deus", "🐑", "Apocalipse 5"], ["Trono de Deus", "👑", "Apocalipse 4"],
      ["7 Selos", "🔏", "Apocalipse 5-8"], ["7 Trombetas", "🎺", "Apocalipse 8-11"], ["Anjos", "👼", "Apocalipse 7"],
      ["Livro da Vida", "📖", "Apocalipse 20:12"], ["Árvore da Vida", "🌳", "Apocalipse 22:2"],
      ["Mar de Vidro", "💎", "Apocalipse 4:6"], ["Aleluia", "✨", "Apocalipse 19"],
    ]),
  },
];

let nextId = 0;
export const categories: Category[] = raw.map((c) => ({
  ...c,
  stickers: c.stickers.map((s) => ({ ...s, id: nextId++ })),
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
