/** Catálogo inicial. Só disponibilizar arquivos reais após publicação e revisão. */
export const STATUS = [
  { id: "bronze", name: "Bronze", title: "Aprendiz da Palavra", min: 0, color: "#b87333" },
  { id: "prata", name: "Prata", title: "Explorador da Bíblia", min: 100, color: "#9ca3af" },
  { id: "ouro", name: "Ouro", title: "Guardião da Palavra", min: 300, color: "#eab308" },
  { id: "esmeralda", name: "Esmeralda", title: "Semeador da Fé", min: 600, color: "#059669" },
  { id: "rubi", name: "Rubi", title: "Mensageiro da Esperança", min: 1000, color: "#dc2626" },
  { id: "diamante", name: "Diamante", title: "Embaixador da Palavra", min: 1500, color: "#2563eb" },
] as const;

export type StatusId = (typeof STATUS)[number]["id"];
export type MaterialPremio = {
  id: string;
  title: string;
  description: string;
  requiredStatus: StatusId;
  /** Somente arquivos publicados e aprovados em /public podem ser disponibilizados. */
  url?: string;
};

export const MATERIAIS: MaterialPremio[] = [
  { id: "colorir", title: "Desenhos bíblicos para colorir", description: "Atividades de pintura e criatividade", requiredStatus: "bronze" },
  { id: "palavras", title: "Caça-palavras e desafios", description: "Jogos educativos para imprimir", requiredStatus: "prata" },
  { id: "historias", title: "Histórias bíblicas ilustradas", description: "Leitura e aprendizado", requiredStatus: "ouro" },
  { id: "familia", title: "Atividades em família", description: "Momentos de fé compartilhados", requiredStatus: "esmeralda" },
  { id: "colecao", title: "Coleção bíblica especial", description: "Estudos e certificados temáticos", requiredStatus: "rubi" },
  { id: "biblioteca", title: "Biblioteca Diamante", description: "Conteúdos exclusivos e materiais anteriores", requiredStatus: "diamante" },
];
export function statusForPoints(points: number) {
  return [...STATUS].reverse().find(s => points >= s.min) || STATUS[0];
}
