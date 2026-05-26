import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import { useIsAdmin, setAdminMode } from "@/hooks/useIsAdmin";


export default function Configuracao() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [sessionStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({
    totalVisits: 0,
    pedidos: 0,
    feedbacks: 0,
    stickers: 0,
    coins: 0,
    lastVisit: "",
    pagesVisited: {} as Record<string, number>,
  });

  useEffect(() => {
    const stored = localStorage.getItem("lemos_user");
    if (!stored) {
      navigate("/");
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);

    const pedidos = JSON.parse(localStorage.getItem("lemos_pedidos_v2") || "[]");
    const feedbacks = JSON.parse(localStorage.getItem("lemos_feedbacks") || "[]");
    const stickers = JSON.parse(localStorage.getItem("lemos_stickers") || "[]");
    const visits = JSON.parse(localStorage.getItem("lemos_page_visits") || "{}");
    const lastVisit = localStorage.getItem("lemos_last_visit") || "";

    setStats({
      totalVisits: Object.values(visits).reduce<number>((a, b) => a + Number(b), 0),
      pedidos: pedidos.length,
      feedbacks: feedbacks.length,
      stickers: stickers.length,
      coins: u.coins || 0,
      lastVisit,
      pagesVisited: visits,
    });
  }, [navigate]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStart) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const handleResetCoins = () => {
    if (!user) return;
    if (confirm("Tem certeza que deseja zerar as moedas?")) {
      user.coins = 0;
      localStorage.setItem("lemos_user", JSON.stringify(user));
      setUser({ ...user });
      setStats(s => ({ ...s, coins: 0 }));
    }
  };

  const handleClearPedidos = () => {
    if (confirm("Apagar todos os pedidos de oração?")) {
      localStorage.removeItem("lemos_pedidos_v2");
      setStats(s => ({ ...s, pedidos: 0 }));
    }
  };

  const handleClearFeedbacks = () => {
    if (confirm("Apagar todos os feedbacks?")) {
      localStorage.removeItem("lemos_feedbacks");
      setStats(s => ({ ...s, feedbacks: 0 }));
    }
  };

  const handleClearStickers = () => {
    if (confirm("Apagar todas as figurinhas coletadas?")) {
      localStorage.removeItem("lemos_stickers");
      setStats(s => ({ ...s, stickers: 0 }));
    }
  };

  const handleClearVisits = () => {
    if (confirm("Zerar estatísticas de visitas?")) {
      localStorage.removeItem("lemos_page_visits");
      setStats(s => ({ ...s, pagesVisited: {}, totalVisits: 0 }));
    }
  };

  if (!user) return null;

  const statCards = [
    { label: "Moedas", value: stats.coins, emoji: "🪙" },
    { label: "Figurinhas", value: `${stats.stickers}/250`, emoji: "📸" },
    { label: "Pedidos de Oração", value: stats.pedidos, emoji: "🙏" },
    { label: "Feedbacks", value: stats.feedbacks, emoji: "💬" },
    { label: "Visitas Totais", value: stats.totalVisits, emoji: "👁️" },
    { label: "Sessão Atual", value: formatTime(elapsed), emoji: "⏱️" },
  ];

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Configurações" subtitle="Painel de administração" />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {statCards.map((s, i) => (
            <div key={i} className="bg-popover rounded-2xl p-4 shadow-md border border-border text-center">
              <span className="text-3xl block mb-1">{s.emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{s.value}</p>
              <p className="font-body text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">👤 Perfil do Usuário</h3>
          <div className="space-y-2 font-body text-sm text-foreground">
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Função:</strong> {user.role || "Não definida"}</p>
            <p><strong>Nascimento:</strong> {user.birth || "Não informado"}</p>
            <p><strong>Última Visita:</strong> {stats.lastVisit || "Hoje"}</p>
            <p><strong>Tempo na Sessão:</strong> {formatTime(elapsed)}</p>
            <p><strong>Navegador:</strong> {navigator.userAgent.split("(")[0]}</p>
            <p><strong>Plataforma:</strong> {navigator.platform}</p>
            <p><strong>Idioma:</strong> {navigator.language}</p>
            <p><strong>Resolução:</strong> {window.screen.width}x{window.screen.height}</p>
          </div>
        </div>

        {/* Page Visit Stats */}
        {Object.keys(stats.pagesVisited).length > 0 && (
          <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">📊 Páginas Visitadas</h3>
            <div className="space-y-2">
              {Object.entries(stats.pagesVisited).map(([page, count]) => (
                <div key={page} className="flex items-center justify-between">
                  <span className="font-body text-sm text-foreground">{page}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (count as number) * 10)}%` }} />
                    </div>
                    <span className="font-display text-sm font-bold text-primary">{count as number}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin mode */}
        <AdminModeToggle />

        {/* Actions */}
        <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">🔧 Ações de Gerenciamento</h3>
          <div className="space-y-2">
            <button onClick={handleResetCoins} className="w-full text-left px-4 py-3 rounded-xl border border-border bg-background hover:bg-destructive/10 transition-colors font-body text-sm text-foreground">
              🪙 Zerar moedas
            </button>
            <button onClick={handleClearPedidos} className="w-full text-left px-4 py-3 rounded-xl border border-border bg-background hover:bg-destructive/10 transition-colors font-body text-sm text-foreground">
              🙏 Apagar pedidos de oração
            </button>
            <button onClick={handleClearFeedbacks} className="w-full text-left px-4 py-3 rounded-xl border border-border bg-background hover:bg-destructive/10 transition-colors font-body text-sm text-foreground">
              💬 Apagar feedbacks
            </button>
            <button onClick={handleClearStickers} className="w-full text-left px-4 py-3 rounded-xl border border-border bg-background hover:bg-destructive/10 transition-colors font-body text-sm text-foreground">
              📸 Apagar figurinhas coletadas
            </button>
            <button onClick={handleClearVisits} className="w-full text-left px-4 py-3 rounded-xl border border-border bg-background hover:bg-destructive/10 transition-colors font-body text-sm text-foreground">
              📊 Zerar estatísticas de visitas
            </button>
          </div>
        </div>
      </div>
      <FeedbackFooter />
    </div>
  );
}
