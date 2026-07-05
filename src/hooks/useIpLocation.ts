import { useEffect, useState } from "react";

export interface IpLocation {
  ip: string;
  location: string;
  loading: boolean;
}

const CACHE_KEY = "lemos_ip_loc_cache_v1";

async function tryFetch(url: string, mapper: (j: any) => { ip: string; loc: string }) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 4000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) throw new Error("bad status");
    const j = await r.json();
    return mapper(j);
  } finally {
    clearTimeout(t);
  }
}

export function useIpLocation(): IpLocation {
  const [ip, setIp] = useState("carregando...");
  const [loc, setLoc] = useState("carregando...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // cache
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const c = JSON.parse(raw);
        if (c.ts && Date.now() - c.ts < 60 * 60 * 1000) {
          setIp(c.ip); setLoc(c.loc); setLoading(false);
          return;
        }
      }
    } catch {}

    const providers: Array<() => Promise<{ ip: string; loc: string }>> = [
      () => tryFetch("https://ipwho.is/", (j) => ({
        ip: j.ip || "—",
        loc: [j.city, j.region, j.country].filter(Boolean).join(", ") || "—",
      })),
      () => tryFetch("https://get.geojs.io/v1/ip/geo.json", (j) => ({
        ip: j.ip || "—",
        loc: [j.city, j.region, j.country].filter(Boolean).join(", ") || "—",
      })),
      () => tryFetch("https://ipapi.co/json/", (j) => ({
        ip: j.ip || "—",
        loc: [j.city, j.region, j.country_name].filter(Boolean).join(", ") || "—",
      })),
      () => tryFetch("https://api.ipify.org?format=json", (j) => ({
        ip: j.ip || "—",
        loc: "Localização indisponível",
      })),
    ];

    (async () => {
      for (const p of providers) {
        try {
          const r = await p();
          if (cancelled) return;
          if (r.ip && r.ip !== "—") {
            setIp(r.ip);
            setLoc(r.loc);
            setLoading(false);
            try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ...r, ts: Date.now() })); } catch {}
            return;
          }
        } catch {}
      }
      if (!cancelled) {
        setIp("indisponível");
        setLoc("indisponível");
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { ip, location: loc, loading };
}
