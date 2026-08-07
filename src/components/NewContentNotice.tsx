import { useEffect } from "react";
import { toast } from "sonner";
import { lemosPlayTitles, louvoresTitles } from "@/data/contentIndex";
import { getNewTitles, markSeen } from "@/lib/newContent";
import { notifyNewContent } from "@/lib/pushNotify";


/**
 * Avisa o usuário, uma vez por sessão, quando novos vídeos (Lemos Play) ou
 * novas músicas/louvores foram adicionados desde a última visita.
 */
export default function NewContentNotice() {
  useEffect(() => {
    if (sessionStorage.getItem("lemos_new_notice_shown") === "1") return;
    const t = setTimeout(() => {
      const novosVideos = getNewTitles("lemosplay", lemosPlayTitles);
      const novasMusicas = getNewTitles("louvores", louvoresTitles);
      const total = novosVideos.length + novasMusicas.length;
      if (total === 0) return;

      sessionStorage.setItem("lemos_new_notice_shown", "1");
      const partes: string[] = [];
      if (novosVideos.length) partes.push(`${novosVideos.length} vídeo${novosVideos.length > 1 ? "s" : ""}`);
      if (novasMusicas.length) partes.push(`${novasMusicas.length} música${novasMusicas.length > 1 ? "s" : ""}`);

      toast(`🎉 Novidade! ${partes.join(" e ")} novo(s) no site`, {
        description: [...novosVideos, ...novasMusicas].slice(0, 3).join(" • "),
        duration: 8000,
        action: {
          label: "Ver agora",
          onClick: () => {
            window.location.href = novosVideos.length ? "/lemosplay" : "/louvores";
          },
        },
        onDismiss: () => {
          markSeen("lemosplay", lemosPlayTitles);
          markSeen("louvores", louvoresTitles);
        },
      });
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return null;
}
