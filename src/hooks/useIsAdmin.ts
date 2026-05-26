import { useEffect, useState } from "react";

const KEY = "lemos_admin_mode";

export function isAdminNow(): boolean {
  return localStorage.getItem(KEY) === "1";
}

export function setAdminMode(v: boolean) {
  if (v) localStorage.setItem(KEY, "1");
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("lemos_admin_change"));
}

export function useIsAdmin() {
  const [admin, setAdmin] = useState<boolean>(() => isAdminNow());
  useEffect(() => {
    const h = () => setAdmin(isAdminNow());
    window.addEventListener("lemos_admin_change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("lemos_admin_change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return admin;
}
