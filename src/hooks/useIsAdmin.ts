import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Server-verified admin state. We never trust localStorage for privilege
// decisions — the source of truth is the `user_roles` table on the backend,
// queried via the security-definer `has_role()` RPC.

const CACHE_KEY = "lemos_admin_verified";

async function fetchIsAdmin(): Promise<boolean> {
  const { data: sess } = await supabase.auth.getSession();
  const uid = sess.session?.user?.id;
  if (!uid) return false;
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: uid,
    _role: "admin",
  });
  if (error) return false;
  return data === true;
}

export function canBeAdmin(): boolean {
  // Kept for backwards compatibility with existing callers; the real check
  // is async and lives in useIsAdmin(). This just reflects the cached value.
  try {
    return sessionStorage.getItem(CACHE_KEY) === "1";
  } catch {
    return false;
  }
}

export function isAdminNow(): boolean {
  try {
    return sessionStorage.getItem(CACHE_KEY) === "1";
  } catch {
    return false;
  }
}

// Kept as a no-op for backwards compatibility. Admin state is derived from
// the database, not toggled from the client. Any call to enable admin mode
// without a matching `user_roles` row is silently ignored.
export function setAdminMode(_v: boolean) {
  window.dispatchEvent(new Event("lemos_admin_change"));
}

export function useIsAdmin() {
  const [admin, setAdmin] = useState<boolean>(() => isAdminNow());
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const val = await fetchIsAdmin();
      if (cancelled) return;
      try {
        if (val) sessionStorage.setItem(CACHE_KEY, "1");
        else sessionStorage.removeItem(CACHE_KEY);
      } catch {}
      setAdmin(val);
    };
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    const h = () => refresh();
    window.addEventListener("lemos_admin_change", h);
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      window.removeEventListener("lemos_admin_change", h);
    };
  }, []);
  return admin;
}
