import { useDedicationLine } from "@/hooks/useDedicationLine";
import { useIconVisible } from "@/lib/iconVisibility";
import { useEffect, useState } from "react";
import MeuMural from "@/components/MeuMural";
import { useCoins } from "@/hooks/useCoins";
import iconUsuario from "@/assets/icon-usuario.png";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/**
 * Avatar do usuário fixo no canto inferior direito, na mesma linha da LIA.
 * Mostra "Olá, nome" acima, o avatar e as moedinhas abaixo.
 * Ao tocar, abre a janela "Meu Mural".
 */
export default function UserCorner() {
  const { coins } = useCoins();
  const dedicationTop = useDedicationLine();
  const [user, setUser] = useState<{ name?: string; avatar?: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        const s = localStorage.getItem("lemos_user");
        setUser(s ? JSON.parse(s) : null);
      } catch { setUser(null); }
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("lemos:coins", sync);
    window.addEventListener("lemos_admin_change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lemos:coins", sync);
      window.removeEventListener("lemos_admin_change", sync);
    };
  }, []);

  const visible = useIconVisible("usuario");
  const [menu, setMenu] = useState(false);

  const logout = async () => {
    try { await supabase.auth.signOut(); } catch {}
    localStorage.removeItem("lemos_user");
    window.dispatchEvent(new Event("lemos_admin_change"));
    window.location.href = "/login";
  };

  if (!user?.name || !visible) return null;

  return (
    <>
      <div className="fixed right-2 top-1/2 z-[45] flex -translate-y-1/2 flex-col items-center gap-1 sm:right-4"
      style={dedicationTop !== null ? { top: dedicationTop } : undefined}>
      <Button variant="ghost"
        onClick={() => setMenu((v) => !v)}
        title="Opções do usuário"
        aria-label="Opções do usuário"
        aria-expanded={menu}
        className="h-auto flex flex-col items-center gap-1 icon-glow"
      >
        <span className="font-display font-extrabold text-[11px] sm:text-xs text-amber-900 bg-white/90 border border-amber-300 rounded-full px-2 py-0.5 shadow max-w-[130px] truncate">
          Olá, {user.name}
        </span>
        <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-lg border-2 border-amber-300 overflow-hidden block">
          <img
            src={user.avatar || iconUsuario}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = iconUsuario; }}
            alt={user.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </span>
        <span className="flex items-center gap-1 font-display font-extrabold text-[11px] sm:text-xs text-amber-900 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-full px-2 py-0.5 shadow">
          🪙 {coins}
        </span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="h-7 rounded-full px-3 font-display font-extrabold text-[11px] shadow">
        Meu Mural
      </Button>
      {menu && (
        <Button variant="destructive" size="sm" onClick={logout} className="h-7 rounded-full px-3 font-display font-extrabold text-[11px] shadow">
          Sair
        </Button>
      )}
      </div>

      <MeuMural open={open} onClose={() => setOpen(false)} />
    </>
  );
}
