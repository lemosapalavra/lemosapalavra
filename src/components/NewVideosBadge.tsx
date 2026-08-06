import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lemosPlayTitles, louvoresTitles } from "@/data/contentIndex";
import { getNewTitles, markSeen } from "@/lib/newContent";

/**
 * Aviso visível na página inicial quando há vídeos ou músicas novas.
 * Fica disponível até o usuário clicar (não some sozinho como o toast).
 */
export default function NewVideosBadge() {
  const navigate = useNavigate();
  const [novos, setNovos] = useState<{ videos: string[]; musicas: string[] }>({ videos: [], musicas: [] });

  const refresh = () => {
    setNovos({
      videos: getNewTitles("lemosplay", lemosPlayTitles),
      musicas: getNewTitles("louvores", louvoresTitles),
    });
  };

  useEffect(() => {
    refresh();
    window.addEventListener("lemos_new_content_change", refresh);
    return () => window.removeEventListener("lemos_new_content_change", refresh);
  }, []);

  const total = novos.videos.length + novos.musicas.length;
  if (total === 0) return null;

  const partes: string[] = [];
  if (novos.videos.length) partes.push(`${novos.videos.length} vídeo${novos.videos.length > 1 ? "s" : ""}`);
  if (novos.musicas.length) partes.push(`${novos.musicas.length} música${novos.musicas.length > 1 ? "s" : ""}`);

  const go = () => {
    markSeen("lemosplay", lemosPlayTitles);
    markSeen("louvores", louvoresTitles);
    navigate(novos.videos.length ? "/lemosplay" : "/louvores");
  };

  return (
    <button
      onClick={go}
      className="relative mx-auto mt-2 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 shadow-lg hover:scale-105 active:scale-95 transition"
      title="Ver as novidades"
    >
      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-extrabold text-amber-950 animate-bounce">
        {total}
      </span>
      <span className="text-lg leading-none">🔔</span>
      <span className="font-display font-extrabold text-sm text-primary-foreground">
        Novidade! {partes.join(" e ")} no site
      </span>
    </button>
  );
}
