import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import { loadAnalytics, resetAnalytics, type AnalyticsData } from "@/hooks/useAnalyticsTracker";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";

type GlobalRow = { page: string; total: number; uniqueUsers: number };

type UserStat = {
  key: string;
  name: string;
  email: string | null;
  phone: string | null;
  ageRange: string | null;
  role: string | null;
  avatar: string | null;
  createdAt: string | null;
  events: { login: number; cadastro: number; download: number; share: number };
  pages: { page: string; count: number }[];
  totalViews: number;
  firstSeen: string | null;
  lastSeen: string | null;
};

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
  const [globalRows, setGlobalRows] = useState<GlobalRow[]>([]);
  const [globalRange, setGlobalRange] = useState<7 | 30 | 90>(30);
  const [globalTotal, setGlobalTotal] = useState<number>(0);
  const [globalUsers, setGlobalUsers] = useState<number>(0);
  const [loadingGlobal, setLoadingGlobal] = useState<boolean>(false);
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

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

  const loadGlobal = async () => {
    setLoadingGlobal(true);
    try {
      const since = new Date();
      since.setDate(since.getDate() - globalRange);
      const { data: rows, error } = await supabase
        .from("page_analytics")
        .select("page,user_id,user_email,visited_at")
        .gte("visited_at", since.toISOString())
        .limit(10000);
      if (error) throw error;
      const agg = new Map<string, { total: number; users: Set<string> }>();
      const allUsers = new Set<string>();
      (rows || []).forEach((r: any) => {
        const key = r.page || "—";
        const uid = r.user_id || r.user_email || "anon";
        if (!agg.has(key)) agg.set(key, { total: 0, users: new Set() });
        const a = agg.get(key)!;
        a.total += 1;
        a.users.add(uid);
        allUsers.add(uid);
      });
      const out: GlobalRow[] = Array.from(agg.entries())
        .map(([page, v]) => ({ page, total: v.total, uniqueUsers: v.users.size }))
        .sort((a, b) => b.total - a.total);
      setGlobalRows(out);
      setGlobalTotal(rows?.length || 0);
      setGlobalUsers(allUsers.size);

      // Per-user aggregation
      const perUser = new Map<
        string,
        {
          userId: string | null;
          email: string | null;
          pages: Map<string, number>;
          events: { login: number; cadastro: number; download: number; share: number };
          totalViews: number;
          firstSeen: string | null;
          lastSeen: string | null;
        }
      >();
      (rows || []).forEach((r: any) => {
        const uid = r.user_id || r.user_email;
        if (!uid) return; // skip anonymous
        if (!perUser.has(uid)) {
          perUser.set(uid, {
            userId: r.user_id || null,
            email: r.user_email || null,
            pages: new Map(),
            events: { login: 0, cadastro: 0, download: 0, share: 0 },
            totalViews: 0,
            firstSeen: r.visited_at,
            lastSeen: r.visited_at,
          });
        }
        const u = perUser.get(uid)!;
        const p = r.page || "—";
        if (p === "Evento: Login") u.events.login += 1;
        else if (p === "Evento: Cadastro") u.events.cadastro += 1;
        else if (p === "Evento: Baixar Atalho") u.events.download += 1;
        else if (p.startsWith("Evento: Compartilhar")) u.events.share += 1;
        else {
          u.pages.set(p, (u.pages.get(p) || 0) + 1);
          u.totalViews += 1;
        }
        if (!u.firstSeen || r.visited_at < u.firstSeen) u.firstSeen = r.visited_at;
        if (!u.lastSeen || r.visited_at > u.lastSeen) u.lastSeen = r.visited_at;
      });

      // Fetch profile data for these users
      const uids = Array.from(perUser.values())
        .map((v) => v.userId)
        .filter(Boolean) as string[];
      let profilesById = new Map<string, any>();
      if (uids.length > 0) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id,name,email,phone,age_range,role,avatar,created_at")
          .in("id", uids);
        (profs || []).forEach((p: any) => profilesById.set(p.id, p));
      }

      const stats: UserStat[] = Array.from(perUser.entries()).map(([key, v]) => {
        const prof = v.userId ? profilesById.get(v.userId) : null;
        return {
          key,
          name: prof?.name || "(sem cadastro)",
          email: prof?.email || v.email,
          phone: prof?.phone || null,
          ageRange: prof?.age_range || null,
          role: prof?.role || null,
          avatar: prof?.avatar || null,
          createdAt: prof?.created_at || null,
          events: v.events,
          pages: Array.from(v.pages.entries())
            .map(([page, count]) => ({ page, count }))
            .sort((a, b) => b.count - a.count),
          totalViews: v.totalViews,
          firstSeen: v.firstSeen,
          lastSeen: v.lastSeen,
        };
      });
      stats.sort((a, b) => (b.totalViews + b.events.login) - (a.totalViews + a.events.login));
      setUserStats(stats);
    } catch (e) {
      console.error("global analytics", e);
    } finally {
      setLoadingGlobal(false);
    }
  };

  useEffect(() => {
    if (admin) loadGlobal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin, globalRange]);

  const refresh = () => {
    setData(loadAnalytics());
    loadGlobal();
  };

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

        {/* Global cross-user analytics */}
        <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <h3 className="font-display text-lg font-bold text-foreground">
              🌐 O que os usuários mais estão vendo
            </h3>
            <div className="flex gap-1">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setGlobalRange(d as 7 | 30 | 90)}
                  className={`px-3 py-1 rounded-lg text-xs font-display font-bold transition ${
                    globalRange === d
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-3">
            Agregado de <strong>todos os usuários</strong> do site nos últimos {globalRange} dias.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-background/60 rounded-xl p-3 text-center border border-border">
              <p className="font-display text-2xl font-bold text-primary">{globalTotal}</p>
              <p className="font-body text-xs text-muted-foreground">Visualizações totais</p>
            </div>
            <div className="bg-background/60 rounded-xl p-3 text-center border border-border">
              <p className="font-display text-2xl font-bold text-primary">{globalUsers}</p>
              <p className="font-body text-xs text-muted-foreground">Visitantes únicos</p>
            </div>
          </div>
          {loadingGlobal ? (
            <p className="text-sm text-muted-foreground font-body">Carregando…</p>
          ) : globalRows.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body">
              Ainda não há dados globais suficientes. Assim que os usuários navegarem, aparecerá aqui.
            </p>
          ) : (
            <div className="space-y-2">
              {globalRows.map((r) => {
                const max = globalRows[0].total || 1;
                return (
                  <div key={r.page}>
                    <div className="flex justify-between text-sm font-body text-foreground">
                      <span className="truncate">{r.page}</span>
                      <span className="whitespace-nowrap ml-2">
                        <span className="font-display font-bold text-primary">{r.total}</span>
                        <span className="text-xs text-muted-foreground"> visitas · {r.uniqueUsers} pessoas</span>
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-fuchsia-400 to-purple-500"
                        style={{ width: `${(r.total / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                        <img loading="lazy" decoding="async" src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
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

        {/* Per-user panel (all users of the site) */}
        <div className="bg-popover rounded-2xl p-5 shadow-md border border-border mb-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">
            🧑‍🤝‍🧑 Usuários do site — perfil, acessos e navegação
          </h3>
          <p className="text-xs text-muted-foreground font-body mb-3">
            Dados dos últimos {globalRange} dias, agregados por usuário. Inclui
            logins, cadastros e downloads do atalho, além do histórico de páginas
            navegadas.
          </p>
          {userStats.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body">
              Ainda não há atividade suficiente para exibir por usuário.
            </p>
          ) : (
            <div className="space-y-3">
              {userStats.map((u) => {
                const open = expandedUser === u.key;
                return (
                  <div key={u.key} className="rounded-xl border border-border bg-background/60 overflow-hidden">
                    <button
                      onClick={() => setExpandedUser(open ? null : u.key)}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/40 transition"
                    >
                      {u.avatar ? (
                        <img loading="lazy" decoding="async" src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">👤</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-foreground truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground font-body truncate">
                          {u.phone || u.email || "—"}
                        </p>
                      </div>
                      <div className="flex gap-2 text-xs font-body flex-shrink-0">
                        <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800" title="Logins">
                          🔑 {u.events.login}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-sky-100 text-sky-800" title="Cadastros">
                          📝 {u.events.cadastro}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800" title="Downloads do atalho">
                          📥 {u.events.download}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-800" title="Páginas vistas">
                          👁️ {u.totalViews}
                        </span>
                      </div>
                      <span className="ml-2 text-muted-foreground">{open ? "▲" : "▼"}</span>
                    </button>
                    {open && (
                      <div className="p-4 border-t border-border bg-background/30 space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-body">
                          <div><strong>Nome:</strong> {u.name}</div>
                          <div><strong>Celular:</strong> {u.phone || "—"}</div>
                          <div><strong>E-mail:</strong> <span className="break-all">{u.email || "—"}</span></div>
                          <div><strong>Faixa etária:</strong> {u.ageRange || "—"}</div>
                          <div><strong>Função:</strong> {u.role || "—"}</div>
                          <div><strong>Cadastro:</strong> {u.createdAt ? new Date(u.createdAt).toLocaleString("pt-BR") : "—"}</div>
                          <div><strong>1ª atividade:</strong> {u.firstSeen ? new Date(u.firstSeen).toLocaleString("pt-BR") : "—"}</div>
                          <div><strong>Últ. atividade:</strong> {u.lastSeen ? new Date(u.lastSeen).toLocaleString("pt-BR") : "—"}</div>
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm text-foreground mb-2">
                            📄 Páginas visitadas ({u.pages.length})
                          </p>
                          {u.pages.length === 0 ? (
                            <p className="text-xs text-muted-foreground font-body">
                              Nenhuma navegação registrada neste período.
                            </p>
                          ) : (
                            <ul className="space-y-1 text-xs font-body">
                              {u.pages.map((p, i) => (
                                <li key={p.page} className="flex justify-between border-b border-border/40 py-1">
                                  <span className="truncate">
                                    <span className="font-display font-bold text-primary mr-1">{i + 1}º</span>
                                    {p.page}
                                  </span>
                                  <span className="font-display font-bold text-emerald-600 whitespace-nowrap">{p.count}x</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
