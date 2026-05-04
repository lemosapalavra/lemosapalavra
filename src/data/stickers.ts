import bgCriacao from "@/assets/album/criacao.png";
import bgExodo from "@/assets/album/exodo.png";
import bgIgreja from "@/assets/album/igreja.png";
import bgApocalipse from "@/assets/album/apocalipse.png";

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
  bg?: string;
  stickers: Sticker[];
}

// Helper: build 10 stickers per category. Distribution: 7 normais, 2 raras, 1 relíquia
function build(prefix: string, names: [string, string][]): Sticker[] {
  // names: [name, emoji]
  return names.slice(0, 10).map((n, i) => ({
    id: 0, // assigned later
    name: n[0],
    emoji: n[1],
    rarity: i === 0 ? "reliquia" : i <= 2 ? "rara" : "normal",
  }));
}

const raw: Category[] = [
  {
    key: "criacao", name: "Criação", icon: "🌍", color: "from-sky-400 to-blue-600", bg: bgCriacao,
    stickers: build("c", [
      ["Adão e Eva", "👫"], ["Jardim do Éden", "🌳"], ["Sétimo Dia", "🕊️"],
      ["Sol e Lua", "☀️"], ["Mar e Peixes", "🐟"], ["Aves do Céu", "🦅"],
      ["Animais da Terra", "🦁"], ["Plantas e Flores", "🌷"], ["Estrelas", "⭐"], ["Espírito sobre as Águas", "💨"],
    ]),
  },
  {
    key: "patriarcas", name: "Patriarcas", icon: "⛺", color: "from-amber-400 to-orange-600",
    stickers: build("p", [
      ["Abraão", "🧔"], ["Sara", "👵"], ["Isaque", "👨"],
      ["Jacó", "👴"], ["Esaú", "🏹"], ["José do Egito", "👑"],
      ["Rebeca", "👰"], ["Raquel", "💍"], ["Lia", "👩"], ["Os 12 Filhos", "✨"],
    ]),
  },
  {
    key: "exodo", name: "Êxodo", icon: "🏔️", color: "from-red-400 to-rose-600", bg: bgExodo,
    stickers: build("e", [
      ["Moisés", "🧙"], ["Sarça Ardente", "🔥"], ["Mar Vermelho", "🌊"],
      ["Tábuas da Lei", "📜"], ["Maná", "🍞"], ["Faraó", "🤴"],
      ["Vara de Moisés", "🦯"], ["Coluna de Fogo", "🔥"], ["Tabernáculo", "⛺"], ["Arca da Aliança", "📦"],
    ]),
  },
  {
    key: "milagres", name: "Milagres", icon: "🐟", color: "from-cyan-400 to-teal-600",
    stickers: build("m", [
      ["Multiplicação dos Pães", "🍞"], ["Água em Vinho", "🍷"], ["Cura do Cego", "👁️"],
      ["Lázaro Ressuscita", "✨"], ["Tempestade Acalmada", "⛵"], ["Andar sobre as Águas", "💧"],
      ["Pesca Milagrosa", "🎣"], ["Cura do Paralítico", "🧎"], ["Os 10 Leprosos", "🙏"], ["Filha de Jairo", "👧"],
    ]),
  },
  {
    key: "reis", name: "Reis", icon: "👑", color: "from-yellow-400 to-amber-600",
    stickers: build("r", [
      ["Davi", "🎵"], ["Salomão", "👑"], ["Saul", "⚔️"],
      ["Davi e Golias", "🪨"], ["Templo de Salomão", "🏛️"], ["Trono Real", "🪑"],
      ["Coroa de Ouro", "👑"], ["Cetro Real", "🔱"], ["Rainha de Sabá", "👸"], ["Harpa de Davi", "🎼"],
    ]),
  },
  {
    key: "ensinamentos", name: "Ensinamentos de Jesus", icon: "❤️", color: "from-pink-400 to-rose-600",
    stickers: build("j", [
      ["Sermão do Monte", "⛰️"], ["Bem-Aventuranças", "💖"], ["Pai Nosso", "🙏"],
      ["Bom Samaritano", "🤝"], ["Filho Pródigo", "🤗"], ["Ovelha Perdida", "🐑"],
      ["Semeador", "🌱"], ["Pérola Preciosa", "🦪"], ["Talentos", "💰"], ["Reino dos Céus", "☁️"],
    ]),
  },
  {
    key: "igreja", name: "A Igreja", icon: "🔥", color: "from-orange-400 to-red-600", bg: bgIgreja,
    stickers: build("ig", [
      ["Pentecostes", "🔥"], ["Pedro", "🗝️"], ["Paulo", "✉️"],
      ["Estêvão", "🌟"], ["Batismo", "💧"], ["Ceia do Senhor", "🍞"],
      ["Cenáculo", "🏠"], ["Conversão de Paulo", "⚡"], ["Igreja Primitiva", "⛪"], ["Diáconos", "🤲"],
    ]),
  },
  {
    key: "personagens", name: "Personagens Bíblicos", icon: "👥", color: "from-purple-400 to-indigo-600",
    stickers: build("pe", [
      ["Jesus Cristo", "✝️"], ["Maria", "💙"], ["José", "🪚"],
      ["João Batista", "🐫"], ["Maria Madalena", "💐"], ["Marta", "🍲"],
      ["Lázaro", "🤍"], ["Zaqueu", "🌳"], ["Nicodemos", "🌙"], ["Centurião", "🛡️"],
    ]),
  },
  {
    key: "lugares", name: "Lugares", icon: "📍", color: "from-emerald-400 to-green-600",
    stickers: build("l", [
      ["Jerusalém", "🏛️"], ["Belém", "⭐"], ["Nazaré", "🏘️"],
      ["Mar da Galileia", "🌊"], ["Rio Jordão", "🏞️"], ["Monte das Oliveiras", "🌳"],
      ["Calvário", "✝️"], ["Tumba Vazia", "🕊️"], ["Getsêmani", "🌿"], ["Cafarnaum", "🏠"],
    ]),
  },
  {
    key: "versiculos", name: "Versículos", icon: "📖", color: "from-violet-400 to-purple-600",
    stickers: build("v", [
      ["João 3:16", "💝"], ["Salmo 23", "🐑"], ["Filipenses 4:13", "💪"],
      ["Romanos 8:28", "🤲"], ["Provérbios 3:5", "🙇"], ["Mateus 6:33", "👑"],
      ["Isaías 41:10", "🦅"], ["Salmo 91", "🛡️"], ["Jeremias 29:11", "🌈"], ["1 Coríntios 13", "❤️"],
    ]),
  },
  {
    key: "profetas", name: "Profetas", icon: "📜", color: "from-stone-400 to-amber-700",
    stickers: build("pr", [
      ["Isaías", "📜"], ["Jeremias", "😢"], ["Ezequiel", "👁️"],
      ["Daniel", "🦁"], ["Jonas", "🐳"], ["Elias", "🔥"],
      ["Eliseu", "🪔"], ["Oséias", "💔"], ["Amós", "🐏"], ["Miqueias", "⚖️"],
    ]),
  },
  {
    key: "apocalipse", name: "Apocalipse", icon: "🌅", color: "from-fuchsia-500 to-rose-600",
    stickers: build("a", [
      ["Nova Jerusalém", "🏙️"], ["Cordeiro de Deus", "🐑"], ["Trono de Deus", "👑"],
      ["7 Selos", "🔏"], ["7 Trombetas", "🎺"], ["Anjos", "👼"],
      ["Livro da Vida", "📖"], ["Árvore da Vida", "🌳"], ["Mar de Vidro", "💎"], ["Aleluia", "✨"],
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
