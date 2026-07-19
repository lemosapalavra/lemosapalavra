import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import { loadAnalytics, resetAnalytics, type AnalyticsData } from "@/hooks/useAnalyticsTracker";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";

type GlobalRow = { page: string; total: number; uniqueUsers: number };

const fmtTime = (s: number) => {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m < 60) return `${m}m ${sec}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
};

export default function Estatisticas() {
  const navigate = useNavigate();
  const admin = useIsAdmin();
  const [data, setData] = useState<AnalyticsData>(() => loadAnalytics());
  const [ip, setIp] = useState<string>("—");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!admin) {
      navigate("/config");
      return;
    }
    try {
      const raw = localStorage.getItem("lemos_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((j) => setIp(j.ip || "—"))
      .catch(() => setIp("indisponível"));
  }, [admin, navigate]);

  const refresh = () => setData(loadAnalytics());

  const pages = useMemo(
    () => Object.entries(data.pageViews).sort((a, b) => b[1] - a[1]),
    [data]
  );
  const maxViews = pages[0]?.[1] || 1;

  const clicks = useMemo(
    () => Object.entries(data.clicks).sort((a, b) => b[1] - a[1]),
    [data]
  );
  const maxClicks = clicks[0]?.[1] || 1;

  const times = useMemo(
    () => Object.entries(data.timeOnPage).sort((a, b) => b[1] - a[1]),
    [data]
  );
  const maxTime = times[0]?.[1] || 1;

  // Daily evolution (last 14 days)
  const daily = useMemo(() => {
    const out: { day: string; visits: number; time: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      out.push({
        day: key.slice(5),
        visits: data.dailyVisits[key] || 0,
        time: data.dailyTime[key] || 0,
      });
    }
    return out;
  }, [data]);
  const maxDaily = Math.max(1, ...daily.map((d) => d.visits));

  const handleReset = () => {
    if (confirm("Zerar todas as estatísticas deste dispositivo?")) {
      resetAnalytics();
      refresh();
    }
  };

  if (!admin) return null;

  const totalClicks = Object.values(data.clicks).reduce((a, b) => a + b, 0);
  const totalViews = Object.values(data.pageViews).reduce((a, b) => a + b, 0);

  return (
    <div
      className="min-h-screen py-6 px-4"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
    >
      <div className="max-w-5xl mx-auto">
        <PageHeader title="Estatísticas" subtitle="Evolução de acessos, cliques e tempo de navegação" />

        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={refresh}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm shadow hover:scale-105 transition"
          >
            🔄 Atualizar
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-display font-bold text-sm shadow hover:scale-105 transition"
          >
            🗑️ Zerar dados
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Sessões", value: data.totalSessions, emoji: "🚀" },
            { label: "Acessos", value: totalViews, emoji: "👁️" },
            { label: "Cliques", value: totalClicks, emoji: "🖱️" },
            { label: "Tempo total", value: fmtTime(data.totalTime), emoji: "⏱️" },
          ].map((k) => (
            <div
              key={k.label}
              className="bg-popover rounded-2xl p-4 shadow-md border border-border text-center"
            >
              <span className="text-3xl block mb-1">{k.emoji}</span>
              <p className="font-display text-lg font-bold text-foreground">{k.value}</p>
              <p className="font-body text-xs text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Evolution chart */}
        <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">
            📈 Evolução de Acessos (últimos 14 dias)
          </h3>
          <div className="flex items-end gap-2 h-44">
            {daily.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col-reverse h-36">
                  <div
                    className="bg-gradient-to-t from-primary to-amber-400 rounded-t-md transition-all"
                    style={{ height: `${(d.visits / maxDaily) * 100}%` }}
                    title={`${d.visits} acessos • ${fmtTime(d.time)}`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-body">{d.day}</span>
                <span className="text-[10px] font-display font-bold text-foreground">{d.visits}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-popover rounded-2xl p-5 shadow-md border border-border">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">📄 Páginas mais acessadas</h3>
            {pages.length === 0 ? (
              <p className="text-sm text-muted-foreground font-body">Sem dados ainda. Navegue pelo site para gerar estatísticas.</p>
            ) : (
              <div className="space-y-2">
                {pages.map(([page, count]) => (
                  <div key={page}>
                    <div className="flex justify-between text-sm font-body text-foreground">
                      <span>{page}</span>
                      <span className="font-display font-bold text-primary">{count}x</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                        style={{ width: `${(count / maxViews) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-popover rounded-2xl p-5 shadow-md border border-border">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">🖱️ Cliques por página</h3>
            {clicks.length === 0 ? (
              <p className="text-sm text-muted-foreground font-body">Sem dados ainda.</p>
            ) : (
              <div className="space-y-2">
                {clicks.map(([page, count]) => (
                  <div key={page}>
                    <div className="flex justify-between text-sm font-body text-foreground">
                      <span>{page}</span>
                      <span className="font-display font-bold text-primary">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-blue-500"
                        style={{ width: `${(count / maxClicks) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Time on page */}
        <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">⏱️ Tempo de Navegação por Página</h3>
          {times.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body">Sem dados ainda.</p>
          ) : (
            <div className="space-y-2">
              {times.map(([page, seconds]) => (
                <div key={page}>
                  <div className="flex justify-between text-sm font-body text-foreground">
                    <span>{page}</span>
                    <span className="font-display font-bold text-primary">{fmtTime(seconds)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                      style={{ width: `${(seconds / maxTime) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users panel */}
        <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">👥 Dados do(s) Usuário(s) deste dispositivo</h3>
          {!user ? (
            <p className="text-sm text-muted-foreground font-body">Nenhum cadastro encontrado neste dispositivo.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2 pr-3">Avatar</th>
                    <th className="py-2 pr-3">Nome</th>
                    <th className="py-2 pr-3">E-mail</th>
                    <th className="py-2 pr-3">Telefone</th>
                    <th className="py-2 pr-3">Nascimento</th>
                    <th className="py-2 pr-3">Função</th>
                    <th className="py-2 pr-3">IP</th>
                    <th className="py-2 pr-3">Cadastro</th>
                    <th className="py-2 pr-3">Páginas que mais visitou</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50 align-top">
                    <td className="py-2 pr-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : "—"}
                    </td>
                    <td className="py-2 pr-3">{user.name || "—"}</td>
                    <td className="py-2 pr-3">{user.email || "—"}</td>
                    <td className="py-2 pr-3">{user.phone || "—"}</td>
                    <td className="py-2 pr-3">{user.birthDate || "—"}</td>
                    <td className="py-2 pr-3 capitalize">{user.role || "—"}</td>
                    <td className="py-2 pr-3 tabular-nums">{ip}</td>
                    <td className="py-2 pr-3 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleString("pt-BR") : "—"}
                    </td>
                    <td className="py-2 pr-3 text-xs min-w-[220px]">
                      {pages.length === 0 ? (
                        <span className="text-muted-foreground">Sem navegação ainda</span>
                      ) : (
                        <ul className="space-y-1">
                          {pages.slice(0, 5).map(([p, c], i) => (
                            <li key={p} className="flex items-center justify-between gap-2">
                              <span className="truncate">
                                <span className="font-display font-bold text-primary mr-1">{i + 1}º</span>
                                {p}
                              </span>
                              <span className="font-display font-bold text-emerald-600 whitespace-nowrap">
                                {c}x
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-3">
                ⚠️ Dados armazenados localmente neste dispositivo. Para um painel central com todos os usuários do site (em todos os dispositivos), é necessário ativar o backend com tabela de perfis.
              </p>
            </div>
          )}
        </div>

        <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">ℹ️ Informações da sessão</h3>
          <div className="text-sm font-body text-foreground space-y-1">
            <p><strong>Primeiro acesso:</strong> {new Date(data.firstSeen).toLocaleString("pt-BR")}</p>
            <p><strong>Último acesso:</strong> {new Date(data.lastSeen).toLocaleString("pt-BR")}</p>
            <p><strong>IP atual:</strong> {ip}</p>
          </div>
        </div>
      </div>
      <FeedbackFooter />
    </div>
  );
}
