import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const KEY = "lemos_user";
const CLAIMS_KEY = "lemos_reward_claims";
const INITIAL = 15;

type User = { name?: string; email?: string; avatar?: string; coins?: number };

function read(): User {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function write(u: User) {
  localStorage.setItem(KEY, JSON.stringify(u));
  window.dispatchEvent(new CustomEvent("lemos:coins"));
}

function readClaims(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(CLAIMS_KEY) || "{}"); } catch { return {}; }
}
function writeClaims(c: Record<string, number>) {
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(c));
}

export function ensureInitialCoins() {
  const u = read();
  if (typeof u.coins !== "number") {
    u.coins = INITIAL;
    write(u);
  }
}

export function addCoins(n: number) {
  const u = read();
  u.coins = (u.coins || 0) + n;
  write(u);
}

export function spendCoins(n: number): boolean {
  const u = read();
  if ((u.coins || 0) < n) return false;
  u.coins = (u.coins || 0) - n;
  write(u);
  return true;
}

/**
 * Award coins exactly once per `key`. Returns true if the reward was granted
 * now, false if it had already been claimed previously (no duplicate credit).
 * Shows a toast notification on success.
 */
export function awardOnce(key: string, amount: number, label?: string): boolean {
  if (!key || amount <= 0) return false;
  const claims = readClaims();
  if (claims[key]) return false;
  claims[key] = Date.now();
  writeClaims(claims);
  addCoins(amount);
  try {
    toast.success(`🪙 +${amount} moedinhas!`, {
      description: label || "Recompensa adicionada à sua carteira.",
      duration: 3500,
    });
  } catch { /* sonner not mounted */ }
  return true;
}

/** Build a key scoped to the current local date (YYYY-MM-DD). */
export function todayKey(prefix: string): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return `${prefix}:${ymd}`;
}

export function hasClaimed(key: string): boolean {
  return !!readClaims()[key];
}

export function useCoins() {
  const [coins, setCoins] = useState<number>(() => read().coins ?? 0);
  useEffect(() => {
    const sync = () => setCoins(read().coins ?? 0);
    window.addEventListener("lemos:coins", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lemos:coins", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return {
    coins,
    addCoins: useCallback((n: number) => addCoins(n), []),
    spendCoins: useCallback((n: number) => spendCoins(n), []),
    awardOnce: useCallback((k: string, n: number, l?: string) => awardOnce(k, n, l), []),
  };
}
