import { useEffect, useState } from "react";
import MeuMural from "@/components/MeuMural";
import { useCoins } from "@/hooks/useCoins";
import iconUsuario from "@/assets/icon-usuario.png";

/**
 * Avatar do usuário fixo no canto inferior direito, na mesma linha da LIA.
 * Mostra "Olá, nome" acima, o avatar e as moedinhas abaixo.
 * Ao tocar, abre a janela "Meu Mural".
 */
export default function UserCorner() {
  const { coins } = useCoins();
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
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lemos:coins", sync);
    };
  }, []);

  if (!user?.name) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Abrir o Meu Mural"
        aria-label="Abrir o Meu Mural"
        className="fixed bottom-28 right-3 z-[45] flex flex-col items-center gap-1 hover:scale-110 active:scale-95 transition"
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
      </button>

      <MeuMural open={open} onClose={() => setOpen(false)} />
    </>
  );
}
