import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, Download, Sparkles } from "lucide-react";
import { getTodayMessage } from "@/data/dailyMessages";

const LIKE_KEY = "lemos_inspiration_likes";
const COMMENT_KEY = "lemos_inspiration_comments";

interface Comment { name: string; text: string; ts: number; }

export default function InspirationBanner() {
  const msg = getTodayMessage();
  const dayKey = new Date().toDateString();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    try {
      const l = JSON.parse(localStorage.getItem(LIKE_KEY) || "{}");
      setLiked(!!l[dayKey]);
      setLikes(l[`${dayKey}_count`] || Math.floor(30 + Math.random() * 120));
      const c = JSON.parse(localStorage.getItem(COMMENT_KEY) || "{}");
      setComments(c[dayKey] || []);
    } catch {}
  }, [dayKey]);

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    const newCount = Math.max(0, likes + (next ? 1 : -1));
    setLikes(newCount);
    try {
      const l = JSON.parse(localStorage.getItem(LIKE_KEY) || "{}");
      l[dayKey] = next;
      l[`${dayKey}_count`] = newCount;
      localStorage.setItem(LIKE_KEY, JSON.stringify(l));
    } catch {}
    if (next) doFlash("💛 Amém!");
  };

  const doFlash = (t: string) => {
    setFlash(t);
    setTimeout(() => setFlash(null), 1400);
  };

  const shareText = `${msg.emoji} ${msg.title}\n\n"${msg.text}"\n\n— ${msg.verse}\n\nLemos, a palavra 📖`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: msg.title, text: shareText });
        doFlash("✨ Compartilhado");
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareText);
      doFlash("📋 Copiado para enviar");
    } catch {
      doFlash("Não foi possível compartilhar");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([shareText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mensagem-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    doFlash("⬇️ Baixado");
  };

  const submitComment = () => {
    if (!text.trim()) return;
    let name = "Anônimo";
    try {
      const u = JSON.parse(localStorage.getItem("lemos_user") || "{}");
      if (u.name) name = u.name;
    } catch {}
    const c: Comment = { name, text: text.trim().slice(0, 240), ts: Date.now() };
    const next = [c, ...comments].slice(0, 50);
    setComments(next);
    setText("");
    try {
      const all = JSON.parse(localStorage.getItem(COMMENT_KEY) || "{}");
      all[dayKey] = next;
      localStorage.setItem(COMMENT_KEY, JSON.stringify(all));
    } catch {}
    doFlash("💬 Amém compartilhado");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 mb-4">
      <div
        className="relative overflow-hidden rounded-3xl shadow-2xl border-2 border-white/50"
        style={{
          background:
            "linear-gradient(135deg, hsl(28 95% 62%) 0%, hsl(340 82% 62%) 55%, hsl(280 70% 55%) 100%)",
        }}
      >
        {/* Sparkles */}
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <Sparkles className="absolute top-3 right-4 w-6 h-6 text-white animate-pulse" />
          <Sparkles className="absolute bottom-6 left-4 w-4 h-4 text-white animate-pulse" style={{ animationDelay: "0.6s" }} />
          <Sparkles className="absolute top-1/2 right-1/3 w-5 h-5 text-white animate-pulse" style={{ animationDelay: "1.2s" }} />
        </div>

        <div className="relative p-5 sm:p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-display font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
              ✨ Mensagem de hoje
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-4xl sm:text-5xl drop-shadow-lg animate-[bounce_2s_ease-in-out_infinite]">
              {msg.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-extrabold text-lg sm:text-2xl leading-tight drop-shadow">
                {msg.title}
              </h2>
              <p className="font-body text-sm sm:text-base mt-1 text-white/95 leading-snug">
                {msg.text}
              </p>
              <p className="mt-2 text-xs sm:text-sm font-display font-bold italic text-yellow-100 drop-shadow">
                📖 {msg.verse}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-around bg-black/20 backdrop-blur-sm rounded-2xl px-2 py-2 border border-white/20">
            <ActionBtn
              onClick={toggleLike}
              icon={<Heart className={`w-5 h-5 ${liked ? "fill-white text-white" : "text-white"}`} />}
              label={String(likes)}
              active={liked}
            />
            <ActionBtn
              onClick={() => setCommentsOpen((v) => !v)}
              icon={<MessageCircle className="w-5 h-5 text-white" />}
              label={comments.length ? `${comments.length}` : "Amém"}
            />
            <ActionBtn
              onClick={handleShare}
              icon={<Share2 className="w-5 h-5 text-white" />}
              label="Enviar"
            />
            <ActionBtn
              onClick={handleDownload}
              icon={<Download className="w-5 h-5 text-white" />}
              label="Baixar"
            />
          </div>

          {/* Flash toast */}
          {flash && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white text-foreground font-display font-bold text-xs px-3 py-1.5 rounded-full shadow-lg animate-fade-in">
              {flash}
            </div>
          )}
        </div>

        {/* Comments panel */}
        {commentsOpen && (
          <div className="relative bg-white/95 backdrop-blur p-4 border-t border-white/40">
            <div className="flex gap-2 mb-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
                placeholder="Deixe seu Amém, oração ou reflexão..."
                className="flex-1 px-3 py-2 rounded-xl border-2 border-amber-200 bg-white text-sm font-body text-foreground focus:outline-none focus:border-amber-400"
                maxLength={240}
              />
              <button
                onClick={submitComment}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-display font-bold text-sm shadow hover:scale-[1.02] transition"
              >
                Enviar
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {comments.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">Seja o primeiro a comentar 💛</p>
              )}
              {comments.map((c, i) => (
                <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  <p className="text-xs font-display font-bold text-amber-900">{c.name}</p>
                  <p className="text-sm text-foreground">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  onClick,
  icon,
  label,
  active,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition active:scale-90 ${
        active ? "bg-white/25" : "hover:bg-white/15"
      }`}
    >
      {icon}
      <span className="text-[10px] sm:text-xs font-display font-bold text-white drop-shadow">{label}</span>
    </button>
  );
}
