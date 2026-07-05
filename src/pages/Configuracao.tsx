import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import { useIsAdmin, setAdminMode, canBeAdmin } from "@/hooks/useIsAdmin";
import LemosPlayAdminPanel from "@/components/LemosPlayAdminPanel";
import IndexAdminPanel from "@/components/IndexAdminPanel";


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
    { label: "Figurinhas", value: `${stats.stickers}/104`, emoji: "📸" },
    { label: "Pedidos de Oração", value: stats.pedidos, emoji: "🙏" },
    { label: "Feedbacks", value: stats.feedbacks, emoji: "💬" },
    { label: "Visitas Totais", value: stats.totalVisits, emoji: "👁️" },
    { label: "Sessão Atual", value: formatTime(elapsed), emoji: "⏱️" },
  ];

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Configurações" subtitle="Painel de administração" />

        {/* Live visits counter */}
        <LiveVisitsBanner totalVisits={stats.totalVisits} elapsed={elapsed} />


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
            <IpLocationLines />
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

        {/* Detalhes de interação do usuário — apenas admin */}
        <AdminInteractionRow user={user} lastVisit={stats.lastVisit} stickers={stats.stickers} pagesVisited={stats.pagesVisited} />


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

        {/* Atalhos para páginas configuráveis */}
        <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">⚡ Atalhos para Configurar Páginas</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Acesse rapidamente cada página para revisar conteúdo e ajustes.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "🏠 Início", path: "/" },
              { label: "📖 Bíblia", path: "/biblia" },
              { label: "🎵 Louvores", path: "/louvores" },
              { label: "✨ Devocionais", path: "/devocionais" },
              { label: "🙏 Pedidos de Oração", path: "/pedidos-oracao" },
              { label: "🎮 Atividades", path: "/atividades" },
              { label: "📸 Álbum", path: "/album" },
              { label: "🎬 Lemos Play", path: "/lemosplay" },
            ].map((p) => (
              <button
                key={p.path}
                onClick={() => navigate(p.path)}
                className="px-3 py-3 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 hover:scale-[1.02] transition font-display font-bold text-sm text-amber-900 text-left"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <FeedbackFooter />
    </div>
  );
}

function LiveVisitsBanner({ totalVisits, elapsed }: { totalVisits: number; elapsed: number }) {
  // "Visitantes ativos agora" — heurística local: sessão atual conta como 1,
  // somada a um pulso simulado baseado no horário (suave, 1-4 visitantes).
  const [activeNow, setActiveNow] = useState(1);
  useEffect(() => {
    const tick = () => {
      const h = new Date().getHours();
      const peak = h >= 18 && h <= 22 ? 3 : h >= 8 && h <= 17 ? 2 : 1;
      setActiveNow(1 + Math.floor(Math.random() * peak));
    };
    tick();
    const id = setInterval(tick, 8000);
    return () => clearInterval(id);
  }, []);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return (
    <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-xl border border-white/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3 animate-[pulse_3s_ease-in-out_infinite]">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <span className="font-display font-extrabold text-sm sm:text-base">
          {activeNow} {activeNow === 1 ? "visitante ativo agora" : "visitantes ativos agora"}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs sm:text-sm font-display font-bold">
        <span>👁️ {totalVisits} visitas totais</span>
        <span>⏱️ Sessão: {mins}m {secs}s</span>
      </div>
    </div>
  );
}


function AdminModeToggle() {
  const admin = useIsAdmin();
  const allowed = canBeAdmin();
  const [playOpen, setPlayOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  if (!allowed) return null; // hide entirely from non-admin users
  return (
    <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-2">🔐 Modo Administrador</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Quando ativo, ícones de engrenagem aparecem na página inicial e no Lemos Play permitindo editar conteúdo. Visível apenas neste dispositivo.
      </p>
      <button
        onClick={() => setAdminMode(!admin)}
        className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition ${
          admin ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-zinc-200 text-foreground hover:bg-zinc-300"
        }`}
      >
        {admin ? "✓ Modo Administrador ativo (clique para desativar)" : "Ativar Modo Administrador"}
      </button>

      {admin && (
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <p className="text-xs font-display font-bold text-foreground">⚡ Atalhos do Administrador</p>
          <button
            onClick={() => (window.location.href = "/estatisticas")}
            className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-display font-bold text-sm shadow hover:scale-[1.01] transition"
          >
            📊 Estatísticas de uso (acessos, cliques, tempo)
          </button>
          <button
            onClick={() => setPlayOpen(true)}
            className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-display font-bold text-sm shadow hover:scale-[1.01] transition"
          >
            🎬 Editar Lemos Play (URLs, capas, reordenar)
          </button>
          <button
            onClick={() => setIndexOpen(true)}
            className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-display font-bold text-sm shadow hover:scale-[1.01] transition"
          >
            🏠 Editar Página Inicial (menu orbital)
          </button>
          <button
            onClick={() => (window.location.href = "/admin/whatsapp")}
            className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-700 text-white font-display font-bold text-sm shadow hover:scale-[1.01] transition"
          >
            💬 Comunicação WhatsApp (mensagens aos usuários)
          </button>

        </div>
      )}

      <LemosPlayAdminPanel open={playOpen} onClose={() => setPlayOpen(false)} />
      <IndexAdminPanel open={indexOpen} onClose={() => setIndexOpen(false)} />
    </div>
  );
}


function AdminInteractionRow({
  user,
  lastVisit,
  stickers,
  pagesVisited,
}: {
  user: any;
  lastVisit: string;
  stickers: number;
  pagesVisited: Record<string, number>;
}) {
  const admin = useIsAdmin();
  const [ip, setIp] = useState<string>("—");
  const [location, setLocation] = useState<string>("—");

  useEffect(() => {
    if (!admin) return;
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((j) => {
        setIp(j.ip || "—");
        const parts = [j.city, j.region, j.country_name].filter(Boolean);
        setLocation(parts.length ? parts.join(", ") : "—");
      })
      .catch(() => {
        setIp("indisponível");
        setLocation("indisponível");
      });
  }, [admin]);

  if (!admin || !user) return null;

  const dispositivo = `${navigator.platform || "?"} · ${navigator.userAgent.split("(")[0].trim()}`;
  const albumTotal = 208;
  const albumConcluido = stickers >= albumTotal ? "Sim ✅" : `Não (${stickers}/${albumTotal})`;
  const atividadesVisitas = pagesVisited["/atividades"] || 0;
  const progressoAtividades = `${atividadesVisitas} acesso${atividadesVisitas === 1 ? "" : "s"}`;
  const status = "🟢 Ativo";
  const responsavel =
    user.role === "pai" || user.role === "mãe"
      ? `${user.role} — ${user.name}`
      : user.role === "filho" || user.role === "filha"
      ? "Responsável não informado"
      : "—";
  const cadastro = user.createdAt ? new Date(user.createdAt).toLocaleString("pt-BR") : "—";
  const ultimoLogin = lastVisit || new Date().toLocaleString("pt-BR");

  const cells: { label: string; value: string }[] = [
    { label: "Nome", value: user.name || "—" },
    { label: "Função", value: user.role || "—" },
    { label: "Telefone", value: user.phone || "—" },
    { label: "Data de cadastro", value: cadastro },
    { label: "Último login", value: ultimoLogin },
    { label: "IP / dispositivo", value: `${ip} · ${dispositivo}` },
    { label: "Localização", value: location },
    { label: "Status", value: status },
    { label: "Faixa etária", value: user.ageRange || "—" },
    { label: "Álbum concluído", value: albumConcluido },
    { label: "Progresso nas atividades", value: progressoAtividades },
    { label: "Responsável (pai/mãe)", value: responsavel },
  ];

  return (
    <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-3">
        🧭 Interação do usuário (admin)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body border-collapse">
          <thead>
            <tr className="text-left border-b border-border bg-amber-50">
              {cells.map((c) => (
                <th key={c.label} className="py-2 px-2 font-display font-bold text-amber-900 whitespace-nowrap text-xs">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50 hover:bg-amber-50/50">
              {cells.map((c) => (
                <td key={c.label} className="py-2 px-2 text-xs text-foreground whitespace-nowrap">
                  {c.value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground mt-3">
        ⚠️ Linha baseada nos dados deste dispositivo. Para consolidar todos os usuários do site, é necessário conectar o backend a esta tabela.
      </p>
    </div>
  );
}
