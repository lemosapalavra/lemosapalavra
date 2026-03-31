import { Heart, MessageCircle, Share2, Download, UserPlus, Clock, Coins } from "lucide-react";

interface KwaiSideActionsProps {
  likes: number;
  isLiked: boolean;
  onToggleLike: () => void;
  duration?: string;
  coins?: number;
}

export default function KwaiSideActions({ likes, isLiked, onToggleLike, duration = "3:00", coins = 2 }: KwaiSideActionsProps) {
  return (
    <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20">
      {/* Follow */}
      <button className="flex flex-col items-center gap-0.5">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <UserPlus size={20} className="text-white" />
        </div>
        <span className="text-white text-[10px] font-bold">Seguir</span>
      </button>

      {/* Like */}
      <button onClick={onToggleLike} className="flex flex-col items-center gap-0.5">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLiked ? "bg-red-500" : "bg-white/20 backdrop-blur-sm"}`}>
          <Heart size={20} className="text-white" fill={isLiked ? "white" : "none"} />
        </div>
        <span className="text-white text-[10px] font-bold">{likes + (isLiked ? 1 : 0)}</span>
      </button>

      {/* Comment */}
      <button className="flex flex-col items-center gap-0.5">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <MessageCircle size={20} className="text-white" />
        </div>
        <span className="text-white text-[10px] font-bold">Amém</span>
      </button>

      {/* Share */}
      <button className="flex flex-col items-center gap-0.5">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Share2 size={20} className="text-white" />
        </div>
        <span className="text-white text-[10px] font-bold">Enviar</span>
      </button>

      {/* Download */}
      <button className="flex flex-col items-center gap-0.5">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Download size={20} className="text-white" />
        </div>
        <span className="text-white text-[10px] font-bold">Baixar</span>
      </button>

      {/* Duration + Coins */}
      <div className="flex flex-col items-center gap-1 mt-2 bg-black/30 backdrop-blur-sm rounded-xl px-2 py-1.5">
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-white/70" />
          <span className="text-white/70 text-[10px]">{duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Coins size={12} className="text-yellow-400" />
          <span className="text-yellow-400 text-[10px] font-bold">+{coins}</span>
        </div>
      </div>
    </div>
  );
}
