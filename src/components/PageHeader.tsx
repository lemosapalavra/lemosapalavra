import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import iconInicio from "@/assets/icon-inicio.jpg";
import iconUsuario from "@/assets/icon-usuario.png";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: string;
}

/**
 * Global app header used on every page.
 * - Left: Home button
 * - Center: page name + background image (page icon)
 * - Right: user name + coin count
 */
export default function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  const navigate = useNavigate();
  const { coins } = useCoins();
  const [user, setUser] = useState<{ name?: string; avatar?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lemos_user");
    if (stored) { try { setUser(JSON.parse(stored)); } catch { /* noop */ } }
    const sync = () => {
      const s = localStorage.getItem("lemos_user");
      if (s) { try { setUser(JSON.parse(s)); } catch { /* noop */ } }
    };
    window.addEventListener("storage", sync);
    window.addEventListener("lemos:coins", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("lemos:coins", sync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full mb-3">
      <div className="flex items-stretch gap-2 px-2 py-2 bg-white/70 backdrop-blur-md shadow-lg rounded-b-2xl border-b-2 border-amber-300/60">
        {/* Home */}
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center justify-center gap-0.5 hover:scale-110 transition-transform shrink-0"
          aria-label="Início"
          title="Início"
        >
          <img src={iconInicio} alt="Início" className="w-11 h-11 rounded-xl shadow-md" />
          <span className="font-display text-[10px] font-bold text-foreground leading-none">Início</span>
        </button>

        {/* Center: title with icon background */}
        <div className="relative flex-1 min-w-0 rounded-xl overflow-hidden flex items-center justify-center px-2"
          style={{ background: "linear-gradient(135deg, hsl(36,90%,85%), hsl(45,100%,92%))" }}>
          {icon && (
            <img
              src={icon}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ opacity: 0.28 }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/10 to-white/40 pointer-events-none" />
          <div className="relative text-center min-w-0">
            {title && (
              <h1 className="font-display font-extrabold text-sm sm:text-base md:text-lg leading-tight text-amber-950 truncate drop-shadow-sm">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="font-body text-[10px] sm:text-xs text-amber-900/80 leading-tight truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: user + coins */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 shadow-sm">
            <span className="text-base leading-none">🪙</span>
            <span className="font-display font-extrabold text-sm text-amber-900 tabular-nums">{coins}</span>
          </div>
          {user?.name && (
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xs text-foreground hidden sm:inline max-w-[100px] truncate">
                {user.name}
              </span>
              <img
                src={user.avatar || iconUsuario}
                alt={user.name || "Usuário"}
                className="w-9 h-9 rounded-full border-2 border-amber-300 shadow-sm object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
