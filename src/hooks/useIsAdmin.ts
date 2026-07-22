import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Server-verified admin state. We never trust localStorage for privilege
// decisions — the source of truth is the `user_roles` table on the backend,
// queried via the security-definer `has_role()` RPC.
// The `lemos_owner_unlocked` local flag is used strictly for the UI-only
// "owner" convenience mode (site-owner gesture on the login screen) so that
// the site owner can see the gear icons on their own device even when the
// admin role in the database is missing — it does NOT grant server access.

const CACHE_KEY = "lemos_admin_verified";
const OWNER_FLAG_KEY = "lemos_owner_unlocked";

function ownerUnlockedLocal(): boolean {
  try { return localStorage.getItem(OWNER_FLAG_KEY) === "1"; } catch { return false; }
}

async function fetchIsAdmin(): Promise<boolean> {
  const { data: sess } = await supabase.auth.getSession();
  const uid = sess.session?.user?.id;
  if (!uid) return ownerUnlockedLocal();
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: uid,
    _role: "admin",
  });
  if (error) return ownerUnlockedLocal();
  return data === true || ownerUnlockedLocal();
}

export function canBeAdmin(): boolean {
  try {
    return sessionStorage.getItem(CACHE_KEY) === "1" || ownerUnlockedLocal();
  } catch {
    return ownerUnlockedLocal();
  }
}

export function isAdminNow(): boolean {
  try {
    return sessionStorage.getItem(CACHE_KEY) === "1" || ownerUnlockedLocal();
  } catch {
    return ownerUnlockedLocal();
  }
}

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
