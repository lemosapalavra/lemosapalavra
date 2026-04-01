import { Heart, MessageCircle, Share2, Download, UserPlus, Clock, Coins } from "lucide-react";

interface KwaiSideActionsProps {
  likes: number;
  isLiked: boolean;
  onToggleLike: () => void;
  duration?: string;
  coins?: number;
  totalCoins?: number;
}

export default function KwaiSideActions({ likes, isLiked, onToggleLike, duration = "3:00", coins = 2, totalCoins }: KwaiSideActionsProps) {
  const displayCoins = totalCoins ?? (() => {
    try { return JSON.parse(localStorage.getItem("lemos_user") || "{}").coins || 0; } catch { return 0; }
  })();

  return (
    <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-20">
      {/* Follow */}
      <button className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
          <UserPlus size={22} className="text-white" />
        </div>
        <span className="text-white text-[10px] font-bold drop-shadow">Seguir</span>
      </button>

      {/* Like */}
      <button onClick={onToggleLike} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${isLiked ? "bg-red-500 shadow-lg shadow-red-500/30" : "bg-white/20 backdrop-blur-sm border border-white/10"}`}>
          <Heart size={22} className="text-white" fill={isLiked ? "white" : "none"} />
        </div>
        <span className="text-white text-[10px] font-bold drop-shadow">{likes + (isLiked ? 1 : 0)}</span>
      </button>

      {/* Comment */}
      <button className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
          <MessageCircle size={22} className="text-white" />
        </div>
        <span className="text-white text-[10px] font-bold drop-shadow">Amém</span>
      </button>

      {/* Share */}
      <button className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
          <Share2 size={22} className="text-white" />
        </div>
        <span className="text-white text-[10px] font-bold drop-shadow">Enviar</span>
      </button>

      {/* Download */}
      <button className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
        <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
          <Download size={22} className="text-white" />
        </div>
        <span className="text-white text-[10px] font-bold drop-shadow">Baixar</span>
      </button>

      {/* Stats panel */}
      <div className="flex flex-col items-center gap-1.5 mt-1 bg-black/40 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/10">
        <div className="flex items-center gap-1">
          <Clock size={13} className="text-white/80" />
          <span className="text-white/80 text-[10px] font-bold">{duration}</span>
        </div>
        <div className="w-full h-px bg-white/10" />
        <div className="flex items-center gap-1">
          <Coins size={13} className="text-yellow-400" />
          <span className="text-yellow-400 text-[10px] font-bold">{displayCoins}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px]">🪙</span>
          <span className="text-green-400 text-[10px] font-bold">+{coins}</span>
        </div>
      </div>
    </div>
  );
}
