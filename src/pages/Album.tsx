import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
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

export default function Album() {
  const [selectedCategory, setSelectedCategory] = useState(0);

  const collected = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("lemos_stickers") || "[]") as number[];
    } catch { return [] as number[]; }
  }, []);

  const buySticker = () => {
    const user = JSON.parse(localStorage.getItem("lemos_user") || "{}");
    const coins = user.coins || 0;
    if (coins < 5) {
      alert("Você precisa de pelo menos 5 moedinhas para comprar uma figurinha!");
      return;
    }
    const uncollected = stickerNames.map((_, i) => i).filter(i => !collected.includes(i));
    if (uncollected.length === 0) {
      alert("Parabéns! Você já tem todas as figurinhas! 🎉");
      return;
    }
    const randomIdx = uncollected[Math.floor(Math.random() * uncollected.length)];
    const newCollected = [...collected, randomIdx];
    localStorage.setItem("lemos_stickers", JSON.stringify(newCollected));
    user.coins = coins - 5;
    localStorage.setItem("lemos_user", JSON.stringify(user));
    alert(`Você ganhou a figurinha: ${stickerNames[randomIdx]}! 🎉`);
    window.location.reload();
  };

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

        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={buySticker} className="btn-cartoon px-4 py-2 text-sm">
            🪙 Comprar Figurinha (5 moedas)
          </button>
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

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {catStickers.map((name, i) => {
            const globalIdx = catStart + i;
            const isCollected = collected.includes(globalIdx);
            const cat = stickerCategories[selectedCategory];
            const emoji = cat.emojis[i % cat.emojis.length];

            return (
              <div
                key={globalIdx}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center text-center p-1 transition-all ${
                  isCollected
                    ? "bg-popover border-primary/50 shadow-md"
                    : "bg-muted/30 border-border opacity-40"
                }`}
                title={isCollected ? name : "???"}
              >
                <span className="text-xl">{isCollected ? emoji : "❓"}</span>
                <span className="text-[8px] font-display font-bold text-foreground leading-tight mt-0.5">
                  {isCollected ? name : `#${globalIdx + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <FeedbackFooter />
    </div>
  );
}
