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

function legacyCopy(text: string) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export async function shareSite(label?: string) {
  const title = label ? `Lemos a Palavra — ${label}` : "Lemos a Palavra";
  const url = SITE_URL;
  const text = label ? `${TEXT}\n\n${label}` : TEXT;
  const full = `${text}\n${url}`;

  // 1) Compartilhamento nativo (celular)
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      logEvent(`Compartilhar${label ? `: ${label}` : ""}`);
      return true;
    } catch (err) {
      // Usuário cancelou → não tenta outro caminho
      if (err instanceof DOMException && err.name === "AbortError") return false;
    }
  }

  // 2) Área de transferência
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(full);
      toast.success("Link copiado! Agora é só enviar aos seus amigos 💙");
      logEvent(`Compartilhar${label ? `: ${label}` : ""}`);
      return true;
    }
  } catch {
    /* segue para o fallback */
  }

  // 3) Fallback antigo
  if (legacyCopy(full)) {
    toast.success("Link copiado! Agora é só enviar aos seus amigos 💙");
    logEvent(`Compartilhar${label ? `: ${label}` : ""}`);
    return true;
  }

  // 4) Último recurso: mostra o link para copiar manualmente
  toast("Copie e compartilhe este link:", { description: url, duration: 10000 });
  return true;
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
        title="Compartilhar"
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition active:scale-95 ${className}`}
      >
        {done ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
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
