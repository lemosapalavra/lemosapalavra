import { useEffect, useState } from "react";
import { toast } from "sonner";
import { loadMural, removeMuralItem, updateMuralItem, MURAL_EVENT, type MuralItem } from "@/lib/mural";

/** Janela "Meu Mural" — atividades salvas pelo usuário (ver, editar nome e compartilhar). */
export default function MeuMural({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<MuralItem[]>([]);
  const [zoom, setZoom] = useState<MuralItem | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const sync = () => setItems(loadMural());
    sync();
    window.addEventListener(MURAL_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(MURAL_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [open]);

  if (!open) return null;

  const share = async (item: MuralItem) => {
    const text = `Olha a minha atividade "${item.title}" no Lemos a Palavra! ✝️`;
    try {
      if (item.image.startsWith("data:") && navigator.canShare) {
        const blob = await (await fetch(item.image)).blob();
        const file = new File([blob], `${item.title}.png`, { type: blob.type || "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text, title: item.title });
          return;
        }
      }
      if (navigator.share) {
        await navigator.share({ text, title: item.title, url: window.location.origin });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      toast.success("Link copiado para compartilhar!");
    } catch { /* cancelado */ }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white border-4 border-amber-300 shadow-2xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-extrabold text-xl text-amber-900">🖼️ Meu Mural</h2>
          <button onClick={onClose} title="Fechar" className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 font-bold text-amber-900">✕</button>
        </div>

        <p className="font-body text-sm text-amber-800 mb-4">
          Aqui ficam as atividades que você salvou. Toque para ver maior, mude o nome ou compartilhe.
        </p>

        {items.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-8">
            Seu mural está vazio. Faça uma atividade e toque em “Salvar no Meu Mural”.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map((it) => (
              <div key={it.id} className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-2 flex flex-col gap-1">
                <button onClick={() => setZoom(it)} className="rounded-xl overflow-hidden bg-white border border-amber-200" title="Ver maior">
                  <img src={it.image} alt={it.title} loading="lazy" className="w-full aspect-square object-contain" />
                </button>
                {editing === it.id ? (
                  <div className="flex gap-1">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-amber-300 px-2 py-1 text-xs font-body"
                      aria-label="Novo nome da atividade"
                    />
                    <button
                      onClick={() => { updateMuralItem(it.id, { title: draft.trim() || it.title }); setEditing(null); }}
                      className="px-2 rounded-lg bg-emerald-500 text-white text-xs font-bold"
                      title="Salvar nome"
                    >✓</button>
                  </div>
                ) : (
                  <p className="font-display font-bold text-[11px] text-amber-900 truncate" title={it.title}>{it.title}</p>
                )}
                <p className="font-body text-[10px] text-muted-foreground">
                  {new Date(it.createdAt).toLocaleDateString("pt-BR")}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(it.id); setDraft(it.title); }} title="Editar nome" className="flex-1 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-bold text-amber-900">✏️</button>
                  <button onClick={() => share(it)} title="Compartilhar" className="flex-1 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-bold text-amber-900">📤</button>
                  <button onClick={() => removeMuralItem(it.id)} title="Apagar" className="flex-1 py-1 rounded-lg bg-white border border-red-300 text-[11px] font-bold text-red-600">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {zoom && (
          <div className="fixed inset-0 z-[90] bg-black/70 flex items-center justify-center p-4" onClick={() => setZoom(null)}>
            <img src={zoom.image} alt={zoom.title} className="max-w-full max-h-[85vh] object-contain rounded-2xl bg-white" />
          </div>
        )}
      </div>
    </div>
  );
}
