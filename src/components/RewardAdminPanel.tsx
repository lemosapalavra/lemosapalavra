import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Admin-only manual XP grants. The database RPC checks the authenticated admin role. */
export default function RewardAdminPanel() {
  const [userId, setUserId] = useState("");
  const [activityKey, setActivityKey] = useState("");
  const [points, setPoints] = useState(10);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const validUser = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId.trim());
  const validKey = activityKey.trim().length >= 3 && activityKey.trim().length <= 200;
  const award = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validUser || !validKey || points < 1 || points > 100) return;
    setBusy(true);
    setMessage("");
    try {
      const { data, error } = await (supabase as any).rpc("admin_award_experience", {
        target_user: userId.trim(), reward_key: activityKey.trim(), reward_points: points,
      });
      if (error) throw error;
      setMessage(data === true ? "Pontos registrados com sucesso! A medalha será atualizada na conta do participante." : "Esta conquista já havia sido registrada; nenhum ponto foi duplicado.");
      if (data === true) window.dispatchEvent(new Event("lemos:reward-experience"));
    } catch (error) {
      setMessage("Não foi possível registrar. Confira a permissão de administrador e se a migração de pontos foi aplicada ao banco. " + (error instanceof Error ? error.message : ""));
    } finally { setBusy(false); }
  };
  return <section className="mb-6 rounded-2xl border border-amber-300 bg-white p-5 text-amber-950 shadow">
    <h3 className="text-lg font-bold">🏆 Pontos de conquista — administração</h3>
    <p className="mt-1 text-sm">Conceda pontos de experiência a um participante identificado pelo ID de autenticação. As moedinhas não são alteradas.</p>
    <p className="mt-1 text-xs text-amber-800">A chave da conquista deve ser única por participante e conclusão (ex.: quiz:2026-10-25:rodada-1). Reutilizar a mesma chave não duplica pontos.</p>
    <form onSubmit={award} className="mt-4 grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-semibold sm:col-span-2">ID do participante (UUID)
        <input className="mt-1 w-full rounded-lg border border-amber-300 p-2 font-normal" value={userId} onChange={e => setUserId(e.target.value)} placeholder="ID de autenticação" required />
      </label>
      <label className="text-sm font-semibold sm:col-span-2">Identificador único da conquista
        <input className="mt-1 w-full rounded-lg border border-amber-300 p-2 font-normal" value={activityKey} onChange={e => setActivityKey(e.target.value)} placeholder="quiz:2026-10-25:rodada-1" required maxLength={200} />
      </label>
      <label className="text-sm font-semibold">Pontos (1 a 100)
        <input type="number" min={1} max={100} value={points} onChange={e => setPoints(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-amber-300 p-2 font-normal" />
      </label>
      <button type="submit" disabled={busy || !validUser || !validKey || points < 1 || points > 100} className="self-end rounded-lg bg-green-800 px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? "Registrando..." : "Conceder pontos"}</button>
    </form>
    {message && <p role="status" className="mt-3 text-sm font-semibold">{message}</p>}
  </section>;
}
