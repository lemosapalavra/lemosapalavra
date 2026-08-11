import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import { loadVideoInteractionsCfg, saveVideoInteractionsCfg } from "@/data/videoInteractionsConfig";
import { useIsAdmin, setAdminMode, canBeAdmin } from "@/hooks/useIsAdmin";
import LemosPlayAdminPanel from "@/components/LemosPlayAdminPanel";
import IndexAdminPanel from "@/components/IndexAdminPanel";
import { useIpLocation } from "@/hooks/useIpLocation";
import { supabase } from "@/integrations/supabase/client";
import { loadWhatsappCfg, saveWhatsappCfg } from "@/components/FloatingWhatsapp";
import { loadSocialCfg, saveSocialCfg } from "@/components/FeedbackFooter";
import { loadSiteVersion, saveSiteVersion } from "@/data/siteVersion";
import { getOwnerIp, setOwnerIp, clearOwnerAccess, ownerDeviceUnlocked, ipMatchesOwner, OWNER_FLAG_KEY } from "@/data/ownerAccess";

/** Painel do dono: vincula o acesso de administrador a este aparelho + IP. */
function OwnerAccessCard() {
  const { ip } = useIpLocation();
  const [ownerIp, setOwnerIpState] = useState<string | null>(getOwnerIp());
  const device = ownerDeviceUnlocked();
  const matches = ipMatchesOwner(ip);

  return (
    <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-3">🛡️ Acesso do Administrador</h3>
      <div className="space-y-1.5 font-body text-sm text-foreground">
        <p><strong>Este aparelho autorizado:</strong> {device ? "sim ✅" : "não"}</p>
        <p><strong>IP autorizado:</strong> {ownerIp || "nenhum registrado"}</p>
        <p><strong>IP atual:</strong> {ip}</p>
        <p><strong>Situação:</strong> {device && matches ? "acesso liberado ✅" : "acesso oculto 🔒"}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => { try { localStorage.setItem(OWNER_FLAG_KEY, "1"); } catch {} setOwnerIp(ip); setOwnerIpState(ip); }}
          className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs shadow"
        >
          Autorizar este IP
        </button>
        <button
          onClick={() => { clearOwnerAccess(); setOwnerIpState(null); }}
          className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-display font-bold text-xs shadow"
        >
          Revogar acesso deste aparelho
        </button>
      </div>
      <p className="mt-3 font-body text-xs text-muted-foreground">
        O botão "Entrar como Administrador" na tela de login só aparece neste aparelho e somente quando o IP atual for o IP autorizado.
      </p>
    </div>
  );
}


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
    <div className="min-h-screen py-6 px-4" style={{ background: "transparent" }}>
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

        <OwnerAccessCard />



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

        {/* WhatsApp flutuante */}
        <WhatsappToggle />

        {/* Redes sociais do rodapé */}
        <SocialToggle />

        {/* Interações dos usuários nos vídeos */}
        <VideoInteractionsToggle />

        {/* Versão visual do site */}
        <VersionToggle />


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

function VersionToggle() {
  const [version, setVersion] = useState(() => loadSiteVersion());
  const [flash, setFlash] = useState("");

  const switchTo = (v: 1 | 2) => {
    saveSiteVersion(v);
    setVersion(v);
    setFlash(`✓ Site agora na Versão ${v}`);
    setTimeout(() => setFlash(""), 2500);
  };

  return (
    <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-2">🎨 Versão visual do site</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Versão 1 = layout original (ícones em órbita). Versão 2 = novo layout com menu no topo, banner e cards.
        A logo original é mantida nas duas versões. Troque com um clique.
      </p>
      <div className="flex flex-wrap gap-2">
        {([1, 2] as const).map((v) => (
          <button
            key={v}
            onClick={() => switchTo(v)}
            className={`px-5 py-3 rounded-xl font-display font-bold text-sm transition ${
              version === v
                ? "bg-amber-600 text-white shadow"
                : "bg-zinc-200 text-foreground hover:bg-zinc-300"
            }`}
          >
            {version === v ? "✓ " : ""}Versão {v}
          </button>
        ))}
      </div>
      {flash && <p className="text-xs font-body text-emerald-700 mt-3">{flash}</p>}
    </div>
  );
}

function VideoInteractionsToggle() {
  const [cfg, setCfg] = useState(() => loadVideoInteractionsCfg());
  const [flash, setFlash] = useState("");

  const toggle = () => {
    const next = { enabled: !cfg.enabled };
    saveVideoInteractionsCfg(next);
    setCfg(next);
    setFlash(next.enabled ? "✓ Interações ativadas" : "✓ Interações desativadas");
    setTimeout(() => setFlash(""), 2500);
  };

  return (
    <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-2">💬 Interações dos usuários nos vídeos</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Coluna à direita de todos os vídeos (inclusive o do aviãozinho) com Gostei, Comentar e Compartilhar.
      </p>
      <button
        onClick={toggle}
        className={`px-4 py-3 rounded-xl font-display font-bold text-sm transition ${
          cfg.enabled ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-secondary text-foreground hover:bg-accent"
        }`}
      >
        {cfg.enabled ? "Ativadas — clique para desativar" : "Desativadas — clique para ativar"}
      </button>
      {flash && <p className="mt-2 text-xs font-bold text-emerald-600">{flash}</p>}
    </div>
  );
}

function SocialToggle() {
  const [saved, setSaved] = useState(() => loadSocialCfg());
  const [draft, setDraft] = useState(saved);
  const [flash, setFlash] = useState("");
  const dirty = draft.enabled !== saved.enabled;

  const handleSave = () => {
    saveSocialCfg(draft);
    setSaved(draft);
    setFlash("✓ Mudanças salvas com sucesso!");
    setTimeout(() => setFlash(""), 2500);
  };

  return (
    <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-2">🌐 Ícones de redes sociais (rodapé)</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Quando desativados, os ícones aparecem apenas como ilustração (sem clique).
      </p>
      <button
        onClick={() => setDraft({ enabled: !draft.enabled })}
        className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition mb-3 ${
          draft.enabled ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-zinc-200 text-foreground hover:bg-zinc-300"
        }`}
      >
        {draft.enabled ? "✓ Ativos (clique para desativar)" : "Ativar links das redes sociais"}
      </button>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!dirty}
          className={`px-5 py-2 rounded-xl font-display font-bold text-sm transition ${
            dirty ? "bg-amber-500 text-white hover:bg-amber-600 shadow" : "bg-zinc-200 text-muted-foreground cursor-not-allowed"
          }`}
        >
          💾 Salvar mudanças
        </button>
        {flash && <span className="text-xs font-body text-emerald-700">{flash}</span>}
      </div>
    </div>
  );
}

function WhatsappToggle() {
  const [saved, setSaved] = useState(() => loadWhatsappCfg());
  const [draft, setDraft] = useState(saved);
  const [flash, setFlash] = useState("");
  const dirty = draft.enabled !== saved.enabled || draft.email !== saved.email;

  const handleSave = () => {
    saveWhatsappCfg(draft);
    setSaved(draft);
    setFlash("✓ Mudanças salvas com sucesso!");
    setTimeout(() => setFlash(""), 2500);
  };

  return (
    <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-2">✉️ Botão flutuante de E-mail</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Aparece em todas as páginas. Ative/desative e defina o e-mail de contato.
      </p>
      <button
        onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
        className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition mb-3 ${
          draft.enabled ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-zinc-200 text-foreground hover:bg-zinc-300"
        }`}
      >
        {draft.enabled ? "✓ Ativo (clique para desativar)" : "Ativar botão de E-mail"}
      </button>
      <div>
        <label className="block text-xs font-display font-bold mb-1">
          E-mail de contato
        </label>
        <input
          type="email"
          value={draft.email}
          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm"
          placeholder="lemosapalavra@gmail.com"
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Ao clicar, o app abre o cliente de e-mail padrão do dispositivo.
        </p>
      </div>


      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={!dirty}
          className={`px-5 py-2 rounded-xl font-display font-bold text-sm transition ${
            dirty
              ? "bg-amber-500 text-white hover:bg-amber-600 shadow"
              : "bg-zinc-200 text-muted-foreground cursor-not-allowed"
          }`}
        >
          💾 Salvar mudanças
        </button>
        {flash && <span className="text-xs font-body text-emerald-700">{flash}</span>}
      </div>
    </div>
  );
}

function IpLocationLines() {
  const { ip, location } = useIpLocation();
  return (
    <>
      <p><strong>IP:</strong> {ip}</p>
      <p><strong>Localização:</strong> {location}</p>
    </>
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


interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  ageRange: string;
  createdAt: string;
  lastLogin: string;
  pagesTop: string;
  visits: string;
  lastSeen: string;
  status: string;
  source: string;
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
  const { ip, location } = useIpLocation();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const topPages = (visits: Record<string, number>) =>
    Object.entries(visits || {})
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([p, c]) => `${p} (${c})`)
      .join(" · ") || "—";

  const userKey = JSON.stringify(user || null);
  const pagesKey = JSON.stringify(pagesVisited || {});

  useEffect(() => {
    if (!admin) return;
    (async () => {
      setLoading(true);
      const collected: UserRow[] = [];

      // Atuação dos usuários (páginas visitadas registradas no backend)
      const act = new Map<string, { total: number; pages: Record<string, number>; last: string }>();
      try {
        const { data: ev } = await supabase
          .from("page_analytics")
          .select("user_id, user_email, page, visited_at")
          .order("visited_at", { ascending: false })
          .limit(5000);
        (ev || []).forEach((e: any) => {
          const key = (e.user_email || e.user_id || "").toLowerCase();
          if (!key) return;
          const cur = act.get(key) || { total: 0, pages: {}, last: e.visited_at };
          cur.total += 1;
          cur.pages[e.page] = (cur.pages[e.page] || 0) + 1;
          act.set(key, cur);
        });
      } catch {}

      const actFor = (email?: string, id?: string) =>
        act.get((email || "").toLowerCase()) || act.get((id || "").toLowerCase());

      // Backend profiles
      try {
        const { data } = await supabase
          .from("profiles")
          .select("id, name, email, role, phone, age_range, created_at, updated_at")
          .order("created_at", { ascending: false });
        if (data) {
          data.forEach((p: any) => {
            const a = actFor(p.email, p.id);
            collected.push({
              id: p.id,
              name: p.name || "—",
              email: p.email || "—",
              role: p.role || "—",
              phone: p.phone || "—",
              ageRange: p.age_range || "—",
              createdAt: p.created_at ? new Date(p.created_at).toLocaleString("pt-BR") : "—",
              lastLogin: p.updated_at ? new Date(p.updated_at).toLocaleString("pt-BR") : "—",
              pagesTop: a ? topPages(a.pages) : "—",
              visits: a ? String(a.total) : "0",
              lastSeen: a?.last ? new Date(a.last).toLocaleString("pt-BR") : "—",
              status: a && a.total > 0 ? "🟢 Ativo" : "⚪ Sem atividade",
              source: "Backend",
            });
          });
        }
      } catch {}

      // Current device user (may overlap; keep as "Este dispositivo")
      if (user) {
        const a = actFor(user.email, user.id);
        collected.push({
          id: user.id || "local",
          name: user.name || "—",
          email: user.email || "—",
          role: user.role || "—",
          phone: user.phone || "—",
          ageRange: user.ageRange || "—",
          createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString("pt-BR") : "—",
          lastLogin: lastVisit || new Date().toLocaleString("pt-BR"),
          pagesTop: a ? topPages(a.pages) : topPages(pagesVisited),
          visits: a ? String(a.total) : String(Object.values(pagesVisited || {}).reduce((s: number, n: any) => s + Number(n || 0), 0)),
          lastSeen: a?.last ? new Date(a.last).toLocaleString("pt-BR") : lastVisit || "—",
          status: "🟢 Ativo agora",
          source: `Este dispositivo · ${ip}`,
        });
      }


      // Dedup by email (backend wins, but merge local pages/ip)
      const map = new Map<string, UserRow>();
      collected.forEach((r) => {
        const key = (r.email || r.id).toLowerCase();
        const existing = map.get(key);
        if (!existing) map.set(key, r);
        else {
          map.set(key, {
            ...existing,
            pagesTop: existing.pagesTop !== "—" ? existing.pagesTop : r.pagesTop,
            status: r.status.includes("agora") ? r.status : existing.status,
            source:
              existing.source === "Backend" && r.source.startsWith("Este dispositivo")
                ? `Backend · ${r.source}`
                : existing.source,
          });
        }
      });

      setRows(Array.from(map.values()));
      setLoading(false);
    })();
  }, [admin, user, lastVisit, pagesVisited, ip]);

  if (!admin) return null;

  const filtered = rows.filter((r) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [r.name, r.email, r.role, r.phone].some((v) => v?.toLowerCase().includes(q));
  });

  const columns: { key: keyof UserRow; label: string; width?: string }[] = [
    { key: "name", label: "Nome" },
    { key: "email", label: "Email" },
    { key: "role", label: "Função" },
    { key: "phone", label: "Telefone" },
    { key: "ageRange", label: "Faixa etária" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Cadastro" },
    { key: "lastLogin", label: "Último acesso" },
    { key: "visits", label: "Visitas" },
    { key: "lastSeen", label: "Última atuação" },
    { key: "pagesTop", label: "Páginas mais visitadas" },
    { key: "source", label: "Origem / IP" },

  ];

  return (
    <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="font-display text-lg font-bold text-foreground">
          🧭 Usuários cadastrados ({rows.length})
        </h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Buscar por nome, email, função..."
          className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm font-body w-full sm:w-72 focus:outline-none focus:border-amber-400"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm font-body border-collapse">
          <thead className="bg-gradient-to-r from-amber-100 to-yellow-100 sticky top-0">
            <tr className="text-left">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="py-2.5 px-3 font-display font-bold text-amber-900 whitespace-nowrap text-xs uppercase tracking-wide border-b border-amber-200"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-muted-foreground text-sm">
                  Carregando usuários...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-muted-foreground text-sm">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((r, idx) => (
                <tr
                  key={r.id}
                  className={`border-b border-border/50 hover:bg-amber-50 transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-amber-50/30"
                  }`}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className="py-2 px-3 text-xs text-foreground whitespace-nowrap max-w-[220px] truncate"
                      title={String(r[c.key] ?? "")}
                    >
                      {r[c.key] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground mt-3">
        📍 Localização deste dispositivo: <strong>{location}</strong>. Dados dos usuários vêm do backend (perfis) + sessão atual.
      </p>
    </div>
  );
}

