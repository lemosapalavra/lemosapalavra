import muralMotivacao from "@/assets/murais/mural-motivacao.jpg.asset.json";
import muralReflexao from "@/assets/murais/mural-reflexao.jpg.asset.json";
import muralSabedoria from "@/assets/murais/mural-sabedoria.jpg.asset.json";

export type MuralId = "reflexao" | "motivacao" | "sabedoria";

export interface MuralDef {
  id: MuralId;
  title: string;
  bgUrl: string;
  /** Frames (px approximate) — where the text should sit inside the image (%). */
  textArea: { top: string; left: string; right: string; bottom: string };
  /** Text color that reads well over this frame's inner area. */
  textColor: string;
  textShadow?: string;
  /** Frases editáveis. A frase do dia é escolhida por rotação. */
  phrases: string[];
}

export interface MuraisConfig {
  reflexao: MuralDef;
  motivacao: MuralDef;
  sabedoria: MuralDef;
}

const KEY = "lemos_murais_config_v1";

export function defaultMurais(): MuraisConfig {
  return {
    reflexao: {
      id: "reflexao",
      title: "Mural da Reflexão",
      bgUrl: muralReflexao.url,
      // quadro preto iluminado — texto claro
      textArea: { top: "22%", left: "14%", right: "14%", bottom: "18%" },
      textColor: "#f5e9c8",
      textShadow: "0 2px 8px rgba(0,0,0,0.65)",
      phrases: [
        "Adicione suas frases no painel Admin ⚙️",
      ],
    },
    motivacao: {
      id: "motivacao",
      title: "Mural da Motivação",
      bgUrl: muralMotivacao.url,
      // quadro grande verde-azulado com moldura de madeira
      textArea: { top: "12%", left: "22%", right: "18%", bottom: "34%" },
      textColor: "#ffffff",
      textShadow: "0 2px 10px rgba(0,0,0,0.5)",
      phrases: [
        "Adicione suas frases no painel Admin ⚙️",
      ],
    },
    sabedoria: {
      id: "sabedoria",
      title: "Mural da Sabedoria",
      bgUrl: muralSabedoria.url,
      // quadro branco sobre madeira — texto escuro
      textArea: { top: "10%", left: "20%", right: "18%", bottom: "36%" },
      textColor: "#1a1a1a",
      textShadow: "0 1px 2px rgba(255,255,255,0.6)",
      phrases: [
        "Adicione suas frases no painel Admin ⚙️",
      ],
    },
  };
}

export function loadMurais(): MuraisConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultMurais();
    const parsed = JSON.parse(raw) as Partial<MuraisConfig>;
    const def = defaultMurais();
    return {
      reflexao: { ...def.reflexao, ...(parsed.reflexao ?? {}), bgUrl: def.reflexao.bgUrl },
      motivacao: { ...def.motivacao, ...(parsed.motivacao ?? {}), bgUrl: def.motivacao.bgUrl },
      sabedoria: { ...def.sabedoria, ...(parsed.sabedoria ?? {}), bgUrl: def.sabedoria.bgUrl },
    };
  } catch {
    return defaultMurais();
  }
}

export function saveMurais(cfg: MuraisConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new Event("lemos_murais_change"));
}

export function resetMurais() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("lemos_murais_change"));
}

/** Retorna a frase do dia (rotação diária baseada na data). */
export function phraseOfTheDay(mural: MuralDef): string {
  const phrases = mural.phrases.filter((p) => p.trim().length > 0);
  if (phrases.length === 0) return "";
  const now = new Date();
  const dayIndex = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000)
  );
  return phrases[dayIndex % phrases.length];
}
