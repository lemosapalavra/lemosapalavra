import { supabase } from "@/integrations/supabase/client";

/**
 * Records a special "event" row in page_analytics so it shows up
 * both in the global aggregate and in the per-user history.
 * Events are prefixed with "Evento:" so they can be filtered easily.
 */
export async function logEvent(
  name: "Login" | "Cadastro" | "Baixar Atalho" | string,
  extra?: { userId?: string | null; email?: string | null }
) {
  try {
    let userId: string | null = extra?.userId ?? null;
    let userEmail: string | null = extra?.email ?? null;
    if (!userId || !userEmail) {
      const { data } = await supabase.auth.getSession();
      userId = userId || data.session?.user?.id || null;
      userEmail = userEmail || data.session?.user?.email || null;
    }
    if (!userEmail) {
      try {
        const raw = localStorage.getItem("lemos_user");
        if (raw) userEmail = JSON.parse(raw)?.email || null;
      } catch {}
    }
    await supabase.from("page_analytics").insert({
      page: `Evento: ${name}`,
      user_id: userId,
      user_email: userEmail,
    });
  } catch {
    // silent
  }
}
