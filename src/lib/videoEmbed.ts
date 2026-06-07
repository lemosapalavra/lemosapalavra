// Normalize video URLs from YouTube / Vimeo / Bunny / direct mp4 into a
// playable iframe (or <video>) embed URL.
export type VideoKind = "youtube" | "vimeo" | "bunny" | "mp4" | "iframe";

export interface NormalizedVideo {
  kind: VideoKind;
  embedUrl: string;
  watchUrl: string;
  poster?: string;
}

const ytId = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
      const v = u.searchParams.get("v");
      if (v) return v;
    }
  } catch {}
  return null;
};

const vimeoId = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("vimeo.com")) {
      if (u.hostname.startsWith("player.")) {
        const m = u.pathname.match(/\/video\/(\d+)/);
        return m?.[1] ?? null;
      }
      const m = u.pathname.match(/\/(\d+)/);
      return m?.[1] ?? null;
    }
  } catch {}
  return null;
};

export function normalizeVideo(rawUrl: string, autoplay = true): NormalizedVideo {
  const url = (rawUrl || "").trim();

  // YouTube
  const yid = ytId(url);
  if (yid) {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      ...(autoplay ? { autoplay: "1", mute: "0" } : {}),
    });
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yid}?${params.toString()}`,
      watchUrl: `https://www.youtube.com/watch?v=${yid}`,
      poster: `https://img.youtube.com/vi/${yid}/hqdefault.jpg`,
    };
  }

  // Vimeo
  const vid = vimeoId(url);
  if (vid) {
    const params = new URLSearchParams({
      ...(autoplay ? { autoplay: "1" } : {}),
      title: "0",
      byline: "0",
      portrait: "0",
    });
    return {
      kind: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vid}?${params.toString()}`,
      watchUrl: `https://vimeo.com/${vid}`,
    };
  }

  // Bunny iframe.mediadelivery
  if (url.includes("mediadelivery.net")) {
    const sep = url.includes("?") ? "&" : "?";
    const embedUrl = autoplay && !/autoplay=/i.test(url) ? `${url}${sep}autoplay=true` : url;
    return { kind: "bunny", embedUrl, watchUrl: url };
  }

  // Direct mp4 / webm
  if (/\.(mp4|webm|m3u8)(\?|$)/i.test(url)) {
    return { kind: "mp4", embedUrl: url, watchUrl: url };
  }

  return { kind: "iframe", embedUrl: url, watchUrl: url };
}
