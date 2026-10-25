import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Leitura somente: o navegador não pode conceder pontos a si mesmo. */
export function useRewardExperience() {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (active) setLoading(true);
      const { data: auth } = await supabase.auth.getUser();
      if (!active) return;
      if (!auth.user) { setPoints(null); setLoading(false); return; }
      // Tabela nova pode ainda não existir no ambiente publicado.
      const result = await (supabase as any).from("user_points")
        .select("total_points").eq("user_id", auth.user.id).maybeSingle();
      if (!active) return;
      setPoints(result.error ? null : Number(result.data?.total_points ?? 0));
      setLoading(false);
    };
    void refresh();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => { void refresh(); });
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    window.addEventListener("lemos:reward-experience", onFocus);
    return () => { active = false; subscription.subscription.unsubscribe(); window.removeEventListener("focus", onFocus); window.removeEventListener("lemos:reward-experience", onFocus); };
  }, []);
  return { points, loading };
}
