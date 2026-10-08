import { useEffect, useState } from "react";
import { Heart, MessageCircle, UserPlus, UserCheck, Send } from "lucide-react";
import ShareButton from "@/components/ShareButton";

interface Props {
  /** Identificador único do vídeo (usado para salvar curtidas/comentários). */
  videoId: string;
  className?: string;
}

type Store = { liked: boolean; following: boolean; comments: string[] };

const KEY = "lemos_video_social_v1";

function loadAll(): Record<string, Store> {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

function saveAll(all: Record<string, Store>) {
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch {}
}

/** Barra de interação (Gostei, Seguir, Comentar) exibida junto de todos os vídeos. */
export default function VideoInteractions({ videoId, className = "" }: Props) {
  const [state, setState] = useState<Store>({ liked: false, following: false, comments: [] });
  const [openComments, setOpenComments] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const all = loadAll();
    setState(all[videoId] ?? { liked: false, following: false, comments: [] });
    setOpenComments(false);
    setDraft("");
  }, [videoId]);

  const patch = (p: Partial<Store>) => {
    setState((prev) => {
      const next = { ...prev, ...p };
      const all = loadAll();
      all[videoId] = next;
      saveAll(all);
      return next;
    });
  };

  const addComment = () => {
    const text = draft.trim();
    if (!text) return;
    patch({ comments: [...state.comments, text] });
    setDraft("");
  };

  const btn = "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-bold transition active:scale-95";

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => patch({ liked: !state.liked })}
          className={`${btn} ${state.liked ? "bg-red-700 text-white" : "bg-red-500 text-white hover:bg-red-600"}`}
          aria-pressed={state.liked}
        >
          <Heart className="w-4 h-4" fill={state.liked ? "currentColor" : "none"} />
          {state.liked ? "Gostei" : "Gostei"}
        </button>

        <button
          onClick={() => patch({ following: !state.following })}
          className={`${btn} ${state.following ? "bg-emerald-500 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}
          aria-pressed={state.following}
        >
          {state.following ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {state.following ? "Seguindo" : "Seguir"}
        </button>

        <button
          onClick={() => setOpenComments((o) => !o)}
          className={`${btn} bg-white/15 text-white hover:bg-white/25`}
        >
          <MessageCircle className="w-4 h-4" />
          Comentar{state.comments.length ? ` (${state.comments.length})` : ""}
        </button>

        <ShareButton variant="inline" label={videoId} />
      </div>

      {openComments && (
        <div className="mt-3 rounded-2xl bg-black/50 backdrop-blur p-3">
          <div className="max-h-32 overflow-y-auto space-y-2 mb-2">
            {state.comments.length === 0 && (
              <p className="text-white/60 text-xs text-center">Seja o primeiro a comentar 🙌</p>
            )}
            {state.comments.map((c, i) => (
              <p key={i} className="text-white text-xs bg-white/10 rounded-lg px-2.5 py-1.5">{c}</p>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
              placeholder="Escreva um comentário..."
              className="flex-1 rounded-full bg-white/90 text-black text-xs px-3 py-2 outline-none"
            />
            <button
              onClick={addComment}
              className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
              aria-label="Enviar comentário"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
