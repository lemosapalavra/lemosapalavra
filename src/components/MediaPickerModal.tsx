import { useMemo, useRef, useState } from "react";
import { X, Search, Check, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { availableVideos, availablePosters, type MediaItem } from "@/data/availableMedia";

interface Props {
  open: boolean;
  kind: "video" | "image";
  currentUrl?: string;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function MediaPickerModal({ open, kind, currentUrl, onClose, onSelect }: Props) {
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState<number>(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const all = kind === "video" ? availableVideos : availablePosters;

  const handleUpload = async (file: File) => {
    setUploadErr(null);
    setUploading(true);
    setUploadPct(0);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || (kind === "video" ? "mp4" : "png");
      const safe = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60);
      const path = `${kind}/${Date.now()}-${safe}.${ext}`;
      const { error } = await supabase.storage.from("lemos-play-videos").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });
      if (error) throw error;
      // URL assinada de longa duração (10 anos) para reprodução pública controlada.
      const { data: signed, error: sErr } = await supabase.storage
        .from("lemos-play-videos")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (sErr || !signed?.signedUrl) throw sErr ?? new Error("Falha ao gerar URL");
      setUploadPct(100);
      onSelect(signed.signedUrl);
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setUploadErr(msg);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };


  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((m) => m.label.toLowerCase().includes(s) || m.group.toLowerCase().includes(s) || m.url.toLowerCase().includes(s));
  }, [q, all]);

  const grouped = useMemo(() => {
    const map = new Map<string, MediaItem[]>();
    filtered.forEach((m) => {
      const arr = map.get(m.group) ?? [];
      arr.push(m);
      map.set(m.group, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col text-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold">🔎 Procurar {kind === "video" ? "vídeo" : "capa"} no site</h3>
            <p className="text-xs text-zinc-400">Selecione um item existente para usar.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-zinc-800 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, série ou URL..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {grouped.length === 0 && (
            <p className="text-sm text-zinc-500 text-center py-6">Nenhum item encontrado.</p>
          )}
          {grouped.map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-2">{group}</h4>
              <div className="space-y-1.5">
                {items.map((m) => {
                  const active = m.url === currentUrl;
                  return (
                    <button
                      key={m.url}
                      onClick={() => {
                        onSelect(m.url);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded border transition ${
                        active ? "bg-red-900/30 border-red-600" : "bg-zinc-900 border-zinc-800 hover:border-red-600/60 hover:bg-zinc-800"
                      }`}
                    >
                      {m.kind === "image" ? (
                        <img src={m.url} alt="" className="w-10 h-10 rounded object-cover bg-zinc-800" loading="lazy" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-xs">🎬</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{m.label}</div>
                        <div className="text-[11px] text-zinc-500 truncate">{m.url}</div>
                      </div>
                      {active && <Check className="w-4 h-4 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
