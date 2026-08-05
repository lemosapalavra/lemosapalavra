import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { logEvent } from "@/lib/logEvent";

const SITE_URL = "https://lemosapalavra.live";
const TEXT =
  "Conheça o Lemos a Palavra — histórias bíblicas, atividades e louvores para todas as gerações!";

interface Props {
  /** Título extra (ex.: nome do vídeo) para personalizar o compartilhamento. */
  label?: string;
  /** Estilo flutuante fixo (padrão) ou inline dentro de um conteúdo. */
  variant?: "floating" | "inline";
  className?: string;
}

export async function shareSite(label?: string) {
  const title = label ? `Lemos a Palavra — ${label}` : "Lemos a Palavra";
  const url = SITE_URL;
  const text = label ? `${TEXT}\n\n${label}` : TEXT;
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success("Link copiado! Agora é só enviar aos seus amigos 💙");
    }
    logEvent(`Compartilhar${label ? `: ${label}` : ""}`);
    return true;
  } catch {
    return false;
  }
}

/** Botão de compartilhamento disponível em todas as páginas e nos vídeos. */
export default function ShareButton({ label, variant = "floating", className = "" }: Props) {
  const [done, setDone] = useState(false);

  const onClick = async () => {
    const ok = await shareSite(label);
    if (ok) {
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    }
  };

  if (variant === "inline") {
    return (
      <button
        onClick={onClick}
        aria-label="Compartilhar"
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition active:scale-95 ${className}`}
      >
        {done ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        <span>Compartilhar</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label="Compartilhar o site"
      title="Compartilhe com seus amigos"
      className={`fixed bottom-56 right-4 z-40 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl flex items-center justify-center transition hover:scale-110 active:scale-95 ${className}`}
    >
      {done ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
    </button>
  );
}
