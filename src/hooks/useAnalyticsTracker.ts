import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Local-device analytics tracker.
 * Records page views, time-on-page per route, daily activity, and global clicks.
 * Stored entirely in localStorage under "lemos_analytics_v1".
 */

export interface AnalyticsData {
  pageViews: Record<string, number>;
  timeOnPage: Record<string, number>; // seconds
  clicks: Record<string, number>; // clicks per page
  dailyVisits: Record<string, number>; // YYYY-MM-DD -> count
  dailyTime: Record<string, number>; // YYYY-MM-DD -> seconds
  totalSessions: number;
  totalTime: number;
  firstSeen: string;
  lastSeen: string;
}

const KEY = "lemos_analytics_v1";

export function loadAnalytics(): AnalyticsData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw);
    return {
      pageViews: parsed.pageViews || {},
      timeOnPage: parsed.timeOnPage || {},
      clicks: parsed.clicks || {},
      dailyVisits: parsed.dailyVisits || {},
      dailyTime: parsed.dailyTime || {},
      totalSessions: parsed.totalSessions || 0,
      totalTime: parsed.totalTime || 0,
      firstSeen: parsed.firstSeen || new Date().toISOString(),
      lastSeen: parsed.lastSeen || new Date().toISOString(),
    };
  } catch {
    return {
      pageViews: {},
      timeOnPage: {},
      clicks: {},
      dailyVisits: {},
      dailyTime: {},
      totalSessions: 0,
      totalTime: 0,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    };
  }
}

function save(data: AnalyticsData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function resetAnalytics() {
  localStorage.removeItem(KEY);
}

const pageLabel = (path: string) => {
  const map: Record<string, string> = {
    "/": "Início",
    "/login": "Login",
    "/biblia": "Bíblia",
    "/louvores": "Louvores",
    "/devocionais": "Devocionais",
    "/pedidos-oracao": "Pedidos de Oração",
    "/atividades": "Atividades",
    "/album": "Álbum",
    "/lemosplay": "Lemos Play",
    "/config": "Configurações",
  };
  return map[path] || path;
};

export function useAnalyticsTracker() {
  const location = useLocation();
  const enterRef = useRef<number>(Date.now());
  const currentRef = useRef<string>(location.pathname);

  // Session start (once per mount)
  useEffect(() => {
    const data = loadAnalytics();
    data.totalSessions += 1;
    data.lastSeen = new Date().toISOString();
    if (!data.firstSeen) data.firstSeen = data.lastSeen;
    save(data);
  }, []);

  // Track page change
  useEffect(() => {
    // Flush previous page
    const data = loadAnalytics();
    const prev = currentRef.current;
    const now = Date.now();
    const elapsed = Math.round((now - enterRef.current) / 1000);
    if (elapsed > 0 && elapsed < 60 * 60) {
      const prevLabel = pageLabel(prev);
      data.timeOnPage[prevLabel] = (data.timeOnPage[prevLabel] || 0) + elapsed;
      data.totalTime += elapsed;
      const dateKey = new Date().toISOString().slice(0, 10);
      data.dailyTime[dateKey] = (data.dailyTime[dateKey] || 0) + elapsed;
    }
    // Register new visit
    const label = pageLabel(location.pathname);
    data.pageViews[label] = (data.pageViews[label] || 0) + 1;
    const dateKey = new Date().toISOString().slice(0, 10);
    data.dailyVisits[dateKey] = (data.dailyVisits[dateKey] || 0) + 1;
    data.lastSeen = new Date().toISOString();
    save(data);

    // Mirror to legacy key for existing Configuracao stats
    try {
      const visits = JSON.parse(localStorage.getItem("lemos_page_visits") || "{}");
      visits[label] = (visits[label] || 0) + 1;
      localStorage.setItem("lemos_page_visits", JSON.stringify(visits));
    } catch {}

    currentRef.current = location.pathname;
    enterRef.current = now;
  }, [location.pathname]);

  // Global click tracker
  useEffect(() => {
    const onClick = () => {
      const data = loadAnalytics();
      const label = pageLabel(currentRef.current);
      data.clicks[label] = (data.clicks[label] || 0) + 1;
      save(data);
    };
    window.addEventListener("click", onClick);
    // Flush time on unload
    const onUnload = () => {
      const data = loadAnalytics();
      const elapsed = Math.round((Date.now() - enterRef.current) / 1000);
      if (elapsed > 0 && elapsed < 60 * 60) {
        const label = pageLabel(currentRef.current);
        data.timeOnPage[label] = (data.timeOnPage[label] || 0) + elapsed;
        data.totalTime += elapsed;
        const dateKey = new Date().toISOString().slice(0, 10);
        data.dailyTime[dateKey] = (data.dailyTime[dateKey] || 0) + elapsed;
        save(data);
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, []);
}
