import { filmesVideos } from "@/data/bibleVideos";
import { historias } from "@/data/historiasBiblicas";
export type SearchItem = { title: string; type: string; to: string; image?: string; description?: string };
const fixed: SearchItem[] = [
 { title:"Atividades bíblicas", type:"Atividade", to:"/atividades", description:"Jogos, pinturas, labirintos e desafios" },
 { title:"Orações", type:"Oração", to:"/pedidos-oracao", description:"Converse com Deus em todos os momentos" },
 { title:"Álbum de figurinhas", type:"Álbum", to:"/album", description:"Colecione personagens e histórias da Bíblia" },
 { title:"Louvores e músicas", type:"Louvor", to:"/louvores", description:"Cante e louve com toda a família" },
];
export const searchItems: SearchItem[] = [
 ...fixed,
 ...filmesVideos.map(v => ({ title:v.title, type:"Vídeo", to:"/lemosplay", image:v.icon, description:v.section })),
 ...historias.map(h => ({ title:h.titulo, type:"História", to:"/historias-do-dia", image:h.imagem, description:h.referencia })),
];
export function searchContent(term:string) { const q=term.trim().toLocaleLowerCase("pt-BR"); return q.length<2?[]:searchItems.filter(i=>`${i.title} ${i.type} ${i.description||""}`.toLocaleLowerCase("pt-BR").includes(q)).slice(0,18); }
