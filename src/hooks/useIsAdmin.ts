import { useEffect, useState } from "react";

const KEY = "lemos_admin_mode";
const ADMIN_EMAILS = ["marcello.pertutti@gmail.com"];

function currentUserIsAdminEmail(): boolean {
  try {
    const raw = localStorage.getItem("lemos_user");
    if (!raw) return false;
    const u = JSON.parse(raw);
    return ADMIN_EMAILS.includes(String(u?.email || "").toLowerCase());
  } catch {
    return false;
  }
}

export function isAdminNow(): boolean {
  // Admin gear is ONLY visible to users whose account email is whitelisted
  // AND who have toggled admin mode on this device. This prevents regular
  // users from seeing or activating administrator controls.
  return currentUserIsAdminEmail() && localStorage.getItem(KEY) === "1";
}

export function canBeAdmin(): boolean {
  return currentUserIsAdminEmail();
}

export function setAdminMode(v: boolean) {
  if (v) {
    if (!currentUserIsAdminEmail()) {
      // Refuse to enable admin for non-admin accounts.
      return;
    }
    localStorage.setItem(KEY, "1");
  } else {
    localStorage.removeItem(KEY);
  }
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
