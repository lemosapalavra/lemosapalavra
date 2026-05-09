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

export type Rarity = "normal" | "rara" | "reliquia";

export interface Sticker {
  id: number;
  name: string;
  emoji: string;
  rarity: Rarity;
}

export interface Category {
  key: string;
  name: string;
  icon: string;
  color: string;
  /** Backgrounds per page (index 0 = page 1, index 1 = page 2). */
  bgs?: (string | undefined)[];
  stickers: Sticker[];
}

// 16 stickers per category (2 pages × 8). Distribution across the 16:
// page 1: 1 relíquia + 2 raras + 5 normais ; page 2: 8 normais
function build(names: [string, string][]): Sticker[] {
  const padded = [...names];
  // pad to 16 with repeats if needed
  while (padded.length < 16) padded.push(names[padded.length % names.length]);
  return padded.slice(0, 16).map((n, i) => ({
    id: 0,
    name: n[0],
    emoji: n[1],
    rarity: i === 0 ? "reliquia" : i <= 2 ? "rara" : "normal",
  }));
}

const raw: Category[] = [
  {
    key: "criacao", name: "Criação", icon: "🌍", color: "from-sky-400 to-blue-600",
    bgs: [bgCriacao1, bgCriacao2],
    stickers: build([
      ["Adão e Eva", "👫"], ["Jardim do Éden", "🌳"], ["Sétimo Dia", "🕊️"],
      ["Sol e Lua", "☀️"], ["Mar e Peixes", "🐟"], ["Aves do Céu", "🦅"],
      ["Animais da Terra", "🦁"], ["Plantas e Flores", "🌷"],
      ["Estrelas", "⭐"], ["Espírito sobre as Águas", "💨"], ["Galáxias", "🌌"],
      ["Rios e Mares", "🌊"], ["Montanhas", "⛰️"], ["Frutos da Terra", "🍎"],
      ["Anjos da Criação", "👼"], ["Descanso de Deus", "😴"],
    ]),
  },
  {
    key: "patriarcas", name: "Patriarcas", icon: "⛺", color: "from-amber-400 to-orange-600",
    bgs: [bgPatriarcas1, bgPatriarcas2],
    stickers: build([
      ["Abraão", "🧔"], ["Sara", "👵"], ["Isaque", "👨"],
      ["Jacó", "👴"], ["Esaú", "🏹"], ["José do Egito", "👑"],
      ["Rebeca", "👰"], ["Raquel", "💍"],
      ["Lia", "👩"], ["Os 12 Filhos", "✨"], ["Tendas", "⛺"],
      ["Rebanhos", "🐑"], ["Promessa de Deus", "🌈"], ["Altar de Pedras", "🪨"],
      ["Estrelas do Céu", "⭐"], ["Caminho de Canaã", "🐪"],
    ]),
  },
  {
    key: "exodo", name: "Êxodo", icon: "🏔️", color: "from-red-400 to-rose-600",
    bgs: [bgExodo1, bgExodo2],
    stickers: build([
      ["Moisés", "🧙"], ["Sarça Ardente", "🔥"], ["Mar Vermelho", "🌊"],
      ["Tábuas da Lei", "📜"], ["Maná", "🍞"], ["Faraó", "🤴"],
      ["Vara de Moisés", "🦯"], ["Coluna de Fogo", "🔥"],
      ["Tabernáculo", "⛺"], ["Arca da Aliança", "📦"],
    ]),
  },
  {
    key: "milagres", name: "Milagres", icon: "🐟", color: "from-cyan-400 to-teal-600",
    bgs: [bgMilagres1, bgMilagres2],
    stickers: build([
      ["Multiplicação dos Pães", "🍞"], ["Água em Vinho", "🍷"], ["Cura do Cego", "👁️"],
      ["Lázaro Ressuscita", "✨"], ["Tempestade Acalmada", "⛵"], ["Andar sobre as Águas", "💧"],
      ["Pesca Milagrosa", "🎣"], ["Cura do Paralítico", "🧎"],
      ["Os 10 Leprosos", "🙏"], ["Filha de Jairo", "👧"],
    ]),
  },
  {
    key: "reis", name: "Reis", icon: "👑", color: "from-yellow-400 to-amber-600",
    bgs: [bgReis1, bgReis2],
    stickers: build([
      ["Davi", "🎵"], ["Salomão", "👑"], ["Saul", "⚔️"],
      ["Davi e Golias", "🪨"], ["Templo de Salomão", "🏛️"], ["Trono Real", "🪑"],
      ["Coroa de Ouro", "👑"], ["Cetro Real", "🔱"],
      ["Rainha de Sabá", "👸"], ["Harpa de Davi", "🎼"],
    ]),
  },
  {
    key: "ensinamentos", name: "Ensinamentos de Jesus", icon: "❤️", color: "from-pink-400 to-rose-600",
    bgs: [bgEnsinamentos1, bgEnsinamentos2],
    stickers: build([
      ["Sermão do Monte", "⛰️"], ["Bem-Aventuranças", "💖"], ["Pai Nosso", "🙏"],
      ["Bom Samaritano", "🤝"], ["Filho Pródigo", "🤗"], ["Ovelha Perdida", "🐑"],
      ["Semeador", "🌱"], ["Pérola Preciosa", "🦪"],
      ["Talentos", "💰"], ["Reino dos Céus", "☁️"],
    ]),
  },
  {
    key: "igreja", name: "A Igreja", icon: "🔥", color: "from-orange-400 to-red-600",
    bgs: [bgIgreja1, bgIgreja2],
    stickers: build([
      ["Pentecostes", "🔥"], ["Pedro", "🗝️"], ["Paulo", "✉️"],
      ["Estêvão", "🌟"], ["Batismo", "💧"], ["Ceia do Senhor", "🍞"],
      ["Cenáculo", "🏠"], ["Conversão de Paulo", "⚡"],
      ["Igreja Primitiva", "⛪"], ["Diáconos", "🤲"],
    ]),
  },
  {
    key: "personagens", name: "Personagens Bíblicos", icon: "👥", color: "from-purple-400 to-indigo-600",
    bgs: [bgPersonagens1, bgPersonagens2],
    stickers: build([
      ["Jesus Cristo", "✝️"], ["Maria", "💙"], ["José", "🪚"],
      ["João Batista", "🐫"], ["Maria Madalena", "💐"], ["Marta", "🍲"],
      ["Lázaro", "🤍"], ["Zaqueu", "🌳"],
      ["Nicodemos", "🌙"], ["Centurião", "🛡️"],
    ]),
  },
  {
    key: "lugares", name: "Lugares", icon: "📍", color: "from-emerald-400 to-green-600",
    bgs: [bgLugares1, bgLugares2],
    stickers: build([
      ["Jerusalém", "🏛️"], ["Belém", "⭐"], ["Nazaré", "🏘️"],
      ["Mar da Galileia", "🌊"], ["Rio Jordão", "🏞️"], ["Monte das Oliveiras", "🌳"],
      ["Calvário", "✝️"], ["Tumba Vazia", "🕊️"],
      ["Getsêmani", "🌿"], ["Cafarnaum", "🏠"],
    ]),
  },
  {
    key: "versiculos", name: "Versículos", icon: "📖", color: "from-violet-400 to-purple-600",
    bgs: [bgVersiculos1, bgVersiculos2],
    stickers: build([
      ["João 3:16", "💝"], ["Salmo 23", "🐑"], ["Filipenses 4:13", "💪"],
      ["Romanos 8:28", "🤲"], ["Provérbios 3:5", "🙇"], ["Mateus 6:33", "👑"],
      ["Isaías 41:10", "🦅"], ["Salmo 91", "🛡️"],
      ["Jeremias 29:11", "🌈"], ["1 Coríntios 13", "❤️"],
    ]),
  },
  {
    key: "profetas", name: "Profetas", icon: "📜", color: "from-stone-400 to-amber-700",
    bgs: [bgProfetas1, bgProfetas2],
    stickers: build([
      ["Isaías", "📜"], ["Jeremias", "😢"], ["Ezequiel", "👁️"],
      ["Daniel", "🦁"], ["Jonas", "🐳"], ["Elias", "🔥"],
      ["Eliseu", "🪔"], ["Oséias", "💔"],
      ["Amós", "🐏"], ["Miqueias", "⚖️"],
    ]),
  },
  {
    key: "apocalipse", name: "Apocalipse", icon: "🌅", color: "from-fuchsia-500 to-rose-600",
    bgs: [bgApocalipse1, bgApocalipse2],
    stickers: build([
      ["Nova Jerusalém", "🏙️"], ["Cordeiro de Deus", "🐑"], ["Trono de Deus", "👑"],
      ["7 Selos", "🔏"], ["7 Trombetas", "🎺"], ["Anjos", "👼"],
      ["Livro da Vida", "📖"], ["Árvore da Vida", "🌳"],
      ["Mar de Vidro", "💎"], ["Aleluia", "✨"],
    ]),
  },
];

// Assign global ids
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
