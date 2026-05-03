import { useEffect, useState, useCallback } from "react";

const KEY = "lemos_user";
const INITIAL = 15;

type User = { name?: string; email?: string; avatar?: string; coins?: number };

function read(): User {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function write(u: User) {
  localStorage.setItem(KEY, JSON.stringify(u));
  window.dispatchEvent(new CustomEvent("lemos:coins"));
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
  return { coins, addCoins: useCallback((n: number) => addCoins(n), []), spendCoins: useCallback((n: number) => spendCoins(n), []) };
}
