import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrbitMenu from "@/components/OrbitMenu";
import FeedbackFooter from "@/components/FeedbackFooter";
import iconUsuario from "@/assets/icon-usuario.png";

const labelToRoute: Record<string, string> = {
  "BÍBLIA": "/biblia",
  "LOUVORES": "/louvores",
  "MÚSICAS": "/musicas",
  "DEVOCIONAIS": "/devocionais",
  "PEDIDOS\nDE ORAÇÃO": "/pedidos-oracao",
  "ATIVIDADES": "/atividades",
  "HISTÓRIAS": "/historias",
};

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string; coins?: number } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lemos_user");
    if (stored) {
      const u = JSON.parse(stored);
      // Award daily visit coins
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem("lemos_last_visit");
      if (lastVisit !== today) {
        u.coins = (u.coins || 0) + 2;
        localStorage.setItem("lemos_user", JSON.stringify(u));
        localStorage.setItem("lemos_last_visit", today);
      }
      setUser(u);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("lemos_user");
    setUser(null);
  };

  const handleItemClick = (label: string) => {
    const route = labelToRoute[label];
    if (route) navigate(route);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center overflow-hidden relative"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
    >
      {/* Top right: user info */}
      {user && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-3 bg-popover/90 rounded-2xl px-4 py-2 shadow-lg border border-border">
          <div className="text-right">
            <p className="font-display text-sm font-bold text-foreground">{user.name}</p>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-lg">🪙</span>
              <span className="font-display text-sm font-bold text-primary">{user.coins || 0}</span>
            </div>
          </div>
          <img
            src={user.avatar || iconUsuario}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-primary/30 shadow-md"
          />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center">
        <div className="scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100">
          <OrbitMenu
            isAuthenticated={!!user}
            userName={user?.name}
            userAvatar={user?.avatar}
            onLoginClick={() => navigate("/login")}
            onLogout={handleLogout}
            onItemClick={handleItemClick}
          />
        </div>
      </div>

      {/* Ranking section */}
      {user && (
        <div className="w-full max-w-md mx-auto px-4 mb-4">
          <div className="bg-popover rounded-2xl p-4 shadow-lg border border-border">
            <h3 className="font-display text-lg font-bold text-foreground text-center mb-2">🏆 Ranking de Prêmios</h3>
            <div className="space-y-2">
              {[
                { coins: 10, prize: "🌟 Estrela de Bronze", desc: "Primeiros passos na fé" },
                { coins: 50, prize: "⭐ Estrela de Prata", desc: "Estudante dedicado" },
                { coins: 100, prize: "🏅 Medalha de Ouro", desc: "Guerreiro da Palavra" },
                { coins: 200, prize: "👑 Coroa Real", desc: "Mestre das Escrituras" },
                { coins: 500, prize: "🎖️ Selo Divino", desc: "Embaixador do Reino" },
              ].map((r, i) => {
                const earned = (user.coins || 0) >= r.coins;
                return (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-xl transition-all ${earned ? "bg-primary/10" : "opacity-40"}`}>
                    <span className="text-2xl">{r.prize.split(" ")[0]}</span>
                    <div className="flex-1">
                      <p className="font-display text-sm font-bold text-foreground">{r.prize}</p>
                      <p className="font-body text-xs text-muted-foreground">{r.desc} — {r.coins} moedas</p>
                    </div>
                    {earned && <span className="text-primary font-bold">✅</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <FeedbackFooter />
    </div>
  );
}
