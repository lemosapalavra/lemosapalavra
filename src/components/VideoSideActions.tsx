import { useEffect, useState, useMemo } from "react";
import { Heart, MessageCircle, Share2, Send, X, Eye } from "lucide-react";
import { shareSite } from "@/components/ShareButton";
import {
  loadVideoInteractionsCfg,
  VIDEO_INTERACTIONS_EVENT,
} from "@/data/videoInteractionsConfig";

interface Props {
  /** Identificador único do vídeo. */
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

/**
 * Coluna de interações à direita do vídeo: Gostei, Comentar e Compartilhar.
 * Pode ser desligada pelo admin em Configurações.
 */
export default function VideoSideActions({ videoId, className = "" }: Props) {
  const [enabled, setEnabled] = useState(() => loadVideoInteractionsCfg().enabled);
  const [state, setState] = useState<Store>({ liked: false, following: false, comments: [] });
  const [openComments, setOpenComments] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const h = () => setEnabled(loadVideoInteractionsCfg().enabled);
    window.addEventListener(VIDEO_INTERACTIONS_EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(VIDEO_INTERACTIONS_EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  useEffect(() => {
    const all = loadAll();
    setState(all[videoId] ?? { liked: false, following: false, comments: [] });
    setOpenComments(false);
    setDraft("");
  }, [videoId]);

  if (!enabled) return null;

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

  const circle =
    "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/15 transition active:scale-90";

  return (
    <>
      <div className={`absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-5 ${className}`}>
        <button onClick={() => patch({ liked: !state.liked })} className="flex flex-col items-center gap-1" aria-pressed={state.liked}>
          <span className={`${circle} ${state.liked ? "bg-red-600" : "bg-white/20"}`}>
            <Heart className="w-6 h-6 text-white" fill={state.liked ? "white" : "none"} />
          </span>
          <span className="text-white text-[10px] font-bold drop-shadow">Gostei</span>
        </button>

        <button onClick={() => setOpenComments(true)} className="flex flex-col items-center gap-1">
          <span className={`${circle} bg-white/20`}>
            <MessageCircle className="w-6 h-6 text-white" />
          </span>
          <span className="text-white text-[10px] font-bold drop-shadow">
            Comentar{state.comments.length ? ` (${state.comments.length})` : ""}
          </span>
        </button>

        <button onClick={() => shareSite(videoId)} className="flex flex-col items-center gap-1">
          <span className={`${circle} bg-emerald-500/90`}>
            <Share2 className="w-6 h-6 text-white" />
          </span>
          <span className="text-white text-[10px] font-bold drop-shadow">Compartilhar</span>
        </button>
      </div>

      {openComments && (
        <div className="absolute inset-x-0 bottom-0 z-40 p-3" onClick={(e) => e.stopPropagation()}>
          <div className="mx-auto w-full max-w-md rounded-2xl bg-black/70 backdrop-blur p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-xs font-bold">Comentários</p>
              <button onClick={() => setOpenComments(false)} aria-label="Fechar comentários" className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
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
              <button onClick={addComment} className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center" aria-label="Enviar comentário">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
