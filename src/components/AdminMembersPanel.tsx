import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Member = { id: string; name: string | null; email: string | null; membership: string };
const choices = [
  { value: "visitante", label: "Visitante" },
  { value: "familia", label: "Família" },
  { value: "amigos", label: "Amigos" },
  { value: "vip", label: "VIP" },
];

export default function AdminMembersPanel() {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const load = async () => {
    setLoading(true);
    const { data, error: err } = await (supabase as any).rpc("admin_list_members");
    if (err) setError("Não foi possível carregar os usuários. Verifique se a migração de administração foi aplicada: " + err.message);
    else { setMembers((data || []) as Member[]); setError(""); }
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  const change = async (member: Member, membership: string) => {
    if (!window.confirm(`Alterar o status de ${member.name || member.email || "usuário"} para ${choices.find(c => c.value === membership)?.label}?`)) return;
    setSaving(member.id);
    setNotice("");
    const { error: err } = await (supabase as any).rpc("admin_set_membership", { target_user: member.id, new_membership: membership });
    if (err) setError(err.message);
    else {
      setMembers(current => current.map(m => m.id === member.id ? { ...m, membership } : m));
      setError("");
      setNotice("Status atualizado com sucesso.");
    }
    setSaving(null);
  };
  const filtered = members.filter(m => `${m.name || ""} ${m.email || ""}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));
  return (
    <section className="mb-6 rounded-2xl border border-amber-300 bg-white/95 p-4 text-amber-950 shadow-md sm:p-6">
      <h2 className="mb-2 text-xl font-bold">Usuários e níveis de acesso</h2>
      <p className="mb-4 text-sm">Defina o status de cada pessoa: Visitante, Família, Amigos ou VIP. O acesso de administrador é gerenciado separadamente e não pode ser atribuído aqui.</p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nome ou e-mail" aria-label="Buscar usuários" className="min-w-0 flex-1 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-slate-900" />
        <button onClick={() => void load()} className="rounded-lg bg-amber-700 px-3 py-2 text-sm font-bold text-white">Atualizar</button>
      </div>
      {error && <p role="alert" className="mb-3 text-sm font-semibold text-red-700">{error}</p>}
      {notice && <p role="status" className="mb-3 text-sm font-semibold text-green-700">{notice}</p>}
      {loading ? <p>Carregando usuários...</p> : filtered.length === 0 ? <p className="text-sm">Nenhum usuário encontrado.</p> : (
        <div className="max-h-[460px] space-y-2 overflow-y-auto">
          {filtered.map(member => (
            <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold">{member.name || "Sem nome"}</p>
                <p className="break-all text-xs text-amber-900">{member.email || "E-mail não informado"}</p>
              </div>
              <select aria-label={`Status de ${member.name || member.email}`} value={member.membership} disabled={saving === member.id} onChange={e => void change(member, e.target.value)} className="rounded-lg border border-amber-400 bg-white px-2 py-2 text-sm font-bold text-amber-950">
                {choices.map(choice => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
