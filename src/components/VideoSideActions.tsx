import { useEffect, useMemo, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { shareSite } from "@/components/ShareButton";
import {
  loadVideoInteractionsCfg,
  VIDEO_INTERACTIONS_EVENT,
} from "@/data/videoInteractionsConfig";

interface Props {
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

function getFakeCounts(videoId: string) {
  let hash = 0;
  for (let i = 0; i < videoId.length; i++) {
    hash = (hash << 5) - hash + videoId.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);
  const views = 1200 + (abs % 988000);
  return {
    likes: Math.floor(views * (0.02 + (abs % 80) / 1000)),
    shares: Math.floor(views * (0.001 + (abs % 40) / 10000)),
  };
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

/** Compartilhar à esquerda e gostei à direita, sob o vídeo. */
export default function VideoSideActions({ videoId, className = "" }: Props) {
  const [enabled, setEnabled] = useState(() => loadVideoInteractionsCfg().enabled);
  const [state, setState] = useState<Store>({ liked: false, following: false, comments: [] });
  const counts = useMemo(() => getFakeCounts(videoId), [videoId]);

  useEffect(() => {
    const syncEnabled = () => setEnabled(loadVideoInteractionsCfg().enabled);
    window.addEventListener(VIDEO_INTERACTIONS_EVENT, syncEnabled);
    window.addEventListener("storage", syncEnabled);
    return () => {
      window.removeEventListener(VIDEO_INTERACTIONS_EVENT, syncEnabled);
      window.removeEventListener("storage", syncEnabled);
    };
  }, []);

  useEffect(() => {
    setState(loadAll()[videoId] ?? { liked: false, following: false, comments: [] });
  }, [videoId]);

  if (!enabled) return null;

  const toggleLike = () => {
    setState((previous) => {
      const next = { ...previous, liked: !previous.liked };
      const all = loadAll();
      all[videoId] = next;
      saveAll(all);
      return next;
    });
  };

  const stop = (event: React.MouseEvent) => event.stopPropagation();
  const control = "flex flex-col items-center gap-1 text-primary-foreground transition active:scale-90";
  const circle = "grid h-11 w-11 place-items-center rounded-full border border-white/40 shadow-lg backdrop-blur-sm";

  return (
    <div
      className={`absolute inset-x-3 bottom-3 z-30 flex items-end justify-between ${className}`}
      onClick={stop}
    >
      <button
        type="button"
        onClick={() => void shareSite(videoId)}
        className={control}
        aria-label="Compartilhar vídeo"
        title="Compartilhar"
      >
        <span className={`${circle} bg-green-600 text-white`}><Share2 className="h-5 w-5" /></span>
        <span className="text-[10px] font-bold drop-shadow">{formatCount(counts.shares)}</span>
      </button>

      <button
        type="button"
        onClick={toggleLike}
        className={control}
        aria-label="Gostei"
        title="Gostei"
        aria-pressed={state.liked}
      >
        <span className={`${circle} bg-red-600 text-white`}>
          <Heart className="h-5 w-5" fill={state.liked ? "currentColor" : "none"} />
        </span>
        <span className="text-[10px] font-bold drop-shadow">{formatCount(counts.likes + (state.liked ? 1 : 0))}</span>
      </button>
    </div>
  );
}
