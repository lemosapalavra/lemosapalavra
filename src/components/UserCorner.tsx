import { useIconVisible } from "@/lib/iconVisibility";
import { useEffect, useState } from "react";
import MeuMural from "@/components/MeuMural";
import { useCoins } from "@/hooks/useCoins";
const iconUsuario = "/usuario.png";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Avatar do usuário fixo no canto inferior direito, na mesma linha da LIA.
 * Mostra "Olá, nome" acima, o avatar e as moedinhas abaixo.
 * Ao tocar, abre a janela "Meu Mural".
 */
export default function UserCorner() {
  const { coins } = useCoins();
  const onHome = useLocation().pathname === "/";
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

  if (!visible) return null;

  if (!user?.name) return (
    <a href="/login" aria-label="Entrar ou criar conta" title="Entrar ou criar conta" className="fixed right-1 top-1 z-[75] flex flex-col items-center gap-1">
      <span className="rounded-full border-2 border-amber-300 bg-white p-1 shadow-lg"><img src={iconUsuario} alt="Usuário" className="h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11" /></span>
      <span className="rounded-full border border-amber-300 bg-white px-2 py-1 text-xs font-bold text-amber-900 shadow">Entrar / Cadastrar</span>
    </a>
  );

  const [welcomeGender, setWelcomeGender] = ((): ["feminino" | "masculino" | "", (v:"feminino"|"masculino")=>void] => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lemos_welcome_gender") : null;
    const explicit = saved === "feminino" || saved === "masculino" ? saved : "";
    return [explicit, (v) => { localStorage.setItem("lemos_welcome_gender", v); window.dispatchEvent(new Event("lemos_admin_change")); }];
  })();
  const firstName = (user.name || "").trim().split(/\\s+/)[0].toLocaleLowerCase("pt-BR");
  const feminineNames = ["amanda","ana","maria","marta","mariana","juliana","julia","beatriz","gabriela","fernanda","carolina","camila","isabela","isabella","larissa","leticia","patricia","renata","rebecca","rebeca","sofia","sophia","luiza","luisa","alice","helena","laura","valentina","manuela","clara","cecilia","marcela","marcia","paula","tania","claudia","marisa","rejane"];
  const welcome = welcomeGender === "feminino" || (!welcomeGender && feminineNames.includes(firstName))
    ? "Seja bem-vinda!" : "Seja bem-vindo!";
  const greeting = new Date().getHours() < 12 ? "Bom dia" : new Date().getHours() < 18 ? "Boa tarde" : "Boa noite";
  if (true) return (
    <>
      <div className="fixed right-1 top-1 sm:top-1 z-[75] flex flex-col items-center gap-1">
        <button type="button" onClick={() => setMenu(v => !v)} aria-label="Opções do usuário" aria-expanded={menu}
          className="flex items-center gap-2 rounded-2xl border-[3px] border-amber-400 bg-gradient-to-br from-[#a9652c] via-[#794015] to-[#49250c] px-2 py-1.5 text-left text-amber-50 shadow-[0_4px_12px_rgba(0,0,0,.5)]">
          <img src={user.avatar || iconUsuario} onError={e => { e.currentTarget.src = iconUsuario; }} alt={user.name}
            className="h-9 w-9 sm:h-11 sm:w-11 rounded-full border-[3px] border-amber-300 bg-white object-cover" />
          <span className="max-w-[105px] sm:max-w-[140px] text-[10px] sm:text-sm leading-tight">
            <span className="block">{greeting},</span>
            <strong className="block truncate text-sm sm:text-base">{user.name}</strong>
            <span className="block text-[10px] sm:text-xs">{welcome}</span><span className="block font-extrabold text-yellow-200">🪙 {coins}</span>
          </span>
        </button>
        {menu && <div className="flex flex-wrap justify-center gap-1 rounded-xl bg-white/95 p-1 shadow-lg">
          <Button size="sm" variant="outline" onClick={() => { setOpen(true); setMenu(false); }}>Meu Mural · 🪙 {coins}</Button>
          <Button size="sm" variant="outline" onClick={() => setWelcomeGender("feminino")}>Bem-vinda</Button>
          <Button size="sm" variant="outline" onClick={() => setWelcomeGender("masculino")}>Bem-vindo</Button>
          <Button size="sm" variant="destructive" onClick={logout}>Sair</Button>
        </div>}
      </div>
      <MeuMural open={open} onClose={() => setOpen(false)} />
    </>
  );

  return (
    <>
      <div className="fixed right-2 bottom-3 z-[45] flex flex-col items-center gap-1 sm:right-4">
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
        <span className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] rounded-full bg-white shadow-lg border-2 border-amber-300 overflow-hidden block">
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
