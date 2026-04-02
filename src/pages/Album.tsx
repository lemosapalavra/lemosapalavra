import { useState, useMemo, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import StickerPackAnimation, { StickerRarity, StickerResult } from "@/components/StickerPackAnimation";
import iconAlbum from "@/assets/icon-album.png";

const stickerCategories = [
  { name: "Personagens Bíblicos", emojis: ["👦", "👧", "👴", "👵", "👨", "👩", "🧔", "👸", "🤴", "👼"] },
  { name: "Animais da Bíblia", emojis: ["🐑", "🐪", "🦁", "🐟", "🕊️", "🐴", "🐂", "🐍", "🦅", "🐘"] },
  { name: "Lugares Sagrados", emojis: ["⛪", "🏔️", "🌊", "🏜️", "🌅", "🌳", "🏰", "⛺", "🗻", "🌄"] },
  { name: "Objetos Bíblicos", emojis: ["📜", "🏺", "⚔️", "🛡️", "🪨", "🕯️", "🍞", "🍷", "💍", "🎺"] },
  { name: "Milagres", emojis: ["✨", "🌟", "🔥", "🌈", "💧", "🌊", "☁️", "⭐", "💫", "🌙"] },
];

const stickerNames = [
  "Adão", "Eva", "Noé", "Abraão", "Sara", "Isaque", "Rebeca", "Jacó", "Raquel", "José",
  "Moisés", "Arão", "Miriã", "Josué", "Calebe", "Débora", "Gideão", "Sansão", "Rute", "Samuel",
  "Davi", "Salomão", "Elias", "Eliseu", "Isaías", "Jeremias", "Daniel", "Jonas", "Ester", "Neemias",
  "Maria", "José (pai)", "Jesus Bebê", "Jesus Menino", "Jesus Adulto", "João Batista", "Pedro", "Paulo", "Lucas", "Mateus",
  "Marcos", "Tiago", "André", "Felipe", "Tomé", "Bartolomeu", "Judas", "Maria Madalena", "Lázaro", "Zaqueu",
  "Ovelha Perdida", "Camelo de Rebeca", "Leão de Daniel", "Peixe de Jonas", "Pomba de Noé", "Corvo de Elias", "Burra de Balaão", "Serpente do Éden", "Águia de Isaías", "Cordeiro Pascal",
  "Boi da Manjedoura", "Jumento de Jesus", "Peixes e Pães", "Carneiro de Abraão", "Gafanhotos de João", "Cão de Lázaro", "Urso de Davi", "Formiga Sábia", "Baleias do Mar", "Cabras do Rebanho",
  "Cavalos do Apocalipse", "Lobos e Ovelhas", "Leoa e Filhotes", "Pássaros do Céu", "Abelhas de Sansão", "Rãs do Egito", "Moscas da Praga", "Gato do Templo", "Borboleta Renascida", "Tartaruga Paciente",
  "Girafa Curiosa", "Elefante Fiel", "Hipopótamo de Jó", "Crocodilo do Nilo", "Coelho Saltitante", "Cervo Sedento", "Andorinha do Templo", "Galinha Protetora", "Cisne Gracioso", "Flamingo Rosa",
  "Pinguim Pequeno", "Panda Amigo", "Urso Polar", "Cachorro Amigo", "Gatinho Carinhoso", "Papagaio Falante", "Tucano Colorido", "Arara Azul", "Beija-flor Veloz", "Borboleta do Jardim",
  "Jardim do Éden", "Monte Sinai", "Mar Vermelho", "Terra Prometida", "Belém", "Nazaré", "Jerusalém", "Templo de Salomão", "Rio Jordão", "Monte das Oliveiras",
  "Getsêmani", "Calvário", "Tumba Vazia", "Estrada de Damasco", "Arca de Noé", "Torre de Babel", "Poço de Jacó", "Tabernáculo", "Deserto do Sinai", "Jericó",
  "Babilônia", "Egito Antigo", "Palácio de Faraó", "Cova dos Leões", "Fornalha de Fogo", "Cenáculo", "Betânia", "Cafarnaum", "Galileia", "Samaria",
  "Mar da Galileia", "Monte Carmelo", "Vale de Elá", "Nínive", "Tiro e Sidom", "Antioquia", "Roma Antiga", "Ilha de Patmos", "Corinto", "Éfeso",
  "Filipos", "Tessalônica", "Creta", "Malta", "Sodoma", "Gomorra", "Monte Nebo", "Vale do Jordão", "Deserto de Judá", "Monte Hermon",
  "Tábuas da Lei", "Vara de Moisés", "Cajado de Davi", "Funda de Davi", "Arca da Aliança", "Maná do Céu", "Sarça Ardente", "Coluna de Fogo", "Estrela de Belém", "Presentes dos Magos",
  "Coroa de Espinhos", "Cruz de Jesus", "Pão da Ceia", "Cálice da Comunhão", "Manto de Elias", "Chave de Pedro", "Espada do Espírito", "Escudo da Fé", "Capacete da Salvação", "Cinturão da Verdade",
  "Sandálias da Paz", "Harpa de Davi", "Trombeta de Jericó", "Jarro de Azeite", "Rede de Pesca", "Lâmpada da Parábola", "Moeda da Viúva", "Perfume de Maria", "Toalha de Jesus", "Túnica de José",
  "Pergaminho Sagrado", "Candelabro do Templo", "Altar de Incenso", "Mesa dos Pães", "Cortina do Templo", "Pedra Angular", "Semente da Parábola", "Trigo e Joio", "Pérola Preciosa", "Tesouro Escondido",
  "Talentos de Ouro", "Denário Romano", "Rolo de Isaías", "Pedras do Peito", "Óleo da Unção", "Sal da Terra", "Fermento do Pão", "Frutos do Espírito", "Árvore da Vida", "Água da Vida",
  "Criação do Mundo", "Separação das Águas", "Pragas do Egito", "Travessia do Mar", "Água da Rocha", "Queda de Jericó", "Sol Parou", "Fogo do Céu", "Multiplicação dos Pães", "Água em Vinho",
  "Cura do Cego", "Cura do Paralítico", "Ressurreição de Lázaro", "Tempestade Acalmada", "Caminhando sobre Água", "Pesca Milagrosa", "Transfiguração", "Ressurreição de Jesus", "Ascensão ao Céu", "Pentecostes",
  "Cura de Naamã", "Machado Flutuando", "Azeite da Viúva", "Filho da Sunamita", "Muro de Fogo", "Escada de Jacó", "Burro que Falou", "Visão de Ezequiel", "Sonho de José", "Peixe com Moeda",
  "Sombra de Pedro", "Terremoto na Prisão", "Víbora sem Veneno", "Toalha de Paulo", "Cura do Leproso", "Demônios nos Porcos", "Filha de Jairo", "Servo do Centurião", "Mulher Curada", "Dez Leprosos",
  "Cego Bartimeu", "Surdo-Mudo", "Mão Mirrada", "Orelha Restaurada", "Anjo Libertador", "Línguas de Fogo", "Nuvem de Glória", "Arco-Íris de Noé", "Cidade Celestial", "Novo Céu e Nova Terra",
];

const rankingPrizes = [
  { coins: 10, prize: "🌟 Estrela de Bronze", desc: "Primeiros passos na fé" },
  { coins: 50, prize: "⭐ Estrela de Prata", desc: "Estudante dedicado" },
  { coins: 100, prize: "🏅 Medalha de Ouro", desc: "Guerreiro da Palavra" },
  { coins: 200, prize: "👑 Coroa Real", desc: "Mestre das Escrituras" },
  { coins: 500, prize: "🎖️ Selo Divino", desc: "Embaixador do Reino" },
];

// Rarity assignment: ~60% bronze, ~30% silver, ~10% gold
function getStickerRarity(idx: number): StickerRarity {
  if (idx % 10 === 0) return "ouro";
  if (idx % 3 === 0) return "prata";
  return "bronze";
}

export default function Album() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [packResult, setPackResult] = useState<StickerResult[] | null>(null);
  const [, setForceUpdate] = useState(0);

  const collected = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("lemos_stickers") || "[]") as number[];
    } catch { return [] as number[]; }
  }, []);

  const repeats = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("lemos_repeats") || "[]") as number[];
    } catch { return [] as number[]; }
  }, []);

  const userCoins = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("lemos_user") || "{}").coins || 0;
    } catch { return 0; }
  }, []);

  const buyPack = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("lemos_user") || "{}");
    const coins = user.coins || 0;
    if (coins < 10) {
      alert("Você precisa de 10 moedinhas para comprar um pacotinho (3 figurinhas)!");
      return;
    }

    const currentCollected = JSON.parse(localStorage.getItem("lemos_stickers") || "[]") as number[];
    const currentRepeats = JSON.parse(localStorage.getItem("lemos_repeats") || "[]") as number[];
    const results: StickerResult[] = [];

    for (let n = 0; n < 3; n++) {
      const allIndices = stickerNames.map((_, i) => i);
      const uncollected = allIndices.filter(i => !currentCollected.includes(i));
      
      let chosenIdx: number;
      // 80% chance of new sticker if available, 20% repeat
      if (uncollected.length > 0 && Math.random() < 0.8) {
        chosenIdx = uncollected[Math.floor(Math.random() * uncollected.length)];
      } else {
        chosenIdx = allIndices[Math.floor(Math.random() * allIndices.length)];
      }

      const isRepeat = currentCollected.includes(chosenIdx);
      const catIdx = Math.floor(chosenIdx / 50);
      const cat = stickerCategories[Math.min(catIdx, stickerCategories.length - 1)];
      const emoji = cat.emojis[chosenIdx % cat.emojis.length];

      if (!isRepeat) {
        currentCollected.push(chosenIdx);
      } else {
        currentRepeats.push(chosenIdx);
      }

      results.push({
        index: chosenIdx,
        name: stickerNames[chosenIdx],
        emoji,
        rarity: getStickerRarity(chosenIdx),
        isRepeat,
      });
    }

    localStorage.setItem("lemos_stickers", JSON.stringify(currentCollected));
    localStorage.setItem("lemos_repeats", JSON.stringify(currentRepeats));
    user.coins = coins - 10;
    localStorage.setItem("lemos_user", JSON.stringify(user));
    setPackResult(results);
  }, []);

  const closePack = useCallback(() => {
    setPackResult(null);
    setForceUpdate(v => v + 1);
    window.location.reload();
  }, []);

  const getCategoryStickers = (catIdx: number) => {
    const start = catIdx * 50;
    return stickerNames.slice(start, start + 50);
  };

  const catStickers = getCategoryStickers(selectedCategory);
  const catStart = selectedCategory * 50;

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Álbum de Figurinhas" subtitle={`${collected.length} de ${stickerNames.length} coletadas`} icon={iconAlbum} />

        <div className="flex gap-2 mb-4 flex-wrap items-center">
          <button onClick={buyPack} className="btn-cartoon px-4 py-2 text-sm">
            🎁 Comprar Pacotinho (10 moedas = 3 figurinhas)
          </button>
          {repeats.length > 0 && (
            <span className="font-body text-sm text-muted-foreground bg-popover px-3 py-1 rounded-full border border-border">
              📦 {repeats.length} repetidas para troca
            </span>
          )}
        </div>

        <div className="bg-background rounded-full h-4 mb-4 overflow-hidden border border-border">
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${(collected.length / stickerNames.length) * 100}%` }}
          />
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {stickerCategories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(i)}
              className={`px-3 py-1.5 rounded-full font-display text-xs font-bold transition-all ${
                selectedCategory === i
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-popover text-foreground border border-border"
              }`}
            >
              {cat.emojis[0]} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
          {catStickers.map((name, i) => {
            const globalIdx = catStart + i;
            const isCollected = collected.includes(globalIdx);
            const cat = stickerCategories[selectedCategory];
            const emoji = cat.emojis[i % cat.emojis.length];
            const rarity = getStickerRarity(globalIdx);
            const rarityBorder = rarity === "ouro" ? "border-yellow-400" : rarity === "prata" ? "border-gray-300" : "border-amber-700/50";

            return (
              <div
                key={globalIdx}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center text-center p-2 transition-all ${
                  isCollected
                    ? `bg-popover ${rarityBorder} shadow-md`
                    : "bg-muted/30 border-border opacity-40"
                }`}
                title={isCollected ? `${name} (${rarity})` : "???"}
              >
                {isCollected && (
                  <span className={`text-xs font-bold uppercase ${
                    rarity === "ouro" ? "text-yellow-500" : rarity === "prata" ? "text-gray-400" : "text-amber-700"
                  }`}>{rarity === "ouro" ? "🥇" : rarity === "prata" ? "🥈" : "🥉"}</span>
                )}
                <span className="text-3xl sm:text-4xl">{isCollected ? emoji : "❓"}</span>
                <span className="text-[10px] sm:text-xs font-display font-bold text-foreground leading-tight mt-1">
                  {isCollected ? name : `#${globalIdx + 1}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Ranking de Prêmios */}
        <div className="mt-8 bg-popover rounded-2xl p-4 shadow-lg border border-border">
          <h3 className="font-display text-lg font-bold text-foreground text-center mb-2">🏆 Ranking de Prêmios</h3>
          <div className="space-y-2">
            {rankingPrizes.map((r, i) => {
              const earned = userCoins >= r.coins;
              return (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-xl transition-all ${earned ? "bg-primary/10" : "opacity-40"}`}>
                  <span className="text-2xl">{r.prize.split(" ")[0]}</span>
                  <div className="flex-1">
                    <p className="font-display text-sm font-bold text-foreground">{r.prize}</p>
                    <p className="font-body text-xs text-muted-foreground">{r.desc} — {r.coins} moedas</p>
                  </div>
                  {earned && <span className="text-primary font-bold">✅</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Figurinhas repetidas */}
        {repeats.length > 0 && (
          <div className="mt-6 bg-popover rounded-2xl p-4 shadow-lg border border-border">
            <h3 className="font-display text-lg font-bold text-foreground text-center mb-2">📦 Figurinhas para Troca</h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
              {repeats.map((idx, i) => {
                const catIdx = Math.floor(idx / 50);
                const cat = stickerCategories[Math.min(catIdx, stickerCategories.length - 1)];
                const emoji = cat.emojis[idx % cat.emojis.length];
                return (
                  <div key={i} className="aspect-square rounded-xl border-2 border-red-300 bg-red-50/30 flex flex-col items-center justify-center p-1">
                    <span className="text-lg">{emoji}</span>
                    <span className="text-[7px] font-display font-bold text-foreground">{stickerNames[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <FeedbackFooter />

      {packResult && (
        <StickerPackAnimation stickers={packResult} onClose={closePack} />
      )}
    </div>
  );
}
