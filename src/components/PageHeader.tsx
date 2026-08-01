import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings, ArrowLeft } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import iconUsuario from "@/assets/icon-usuario.png";
import iconInicio from "@/assets/icon-inicio.jpg";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  /** kept for API compatibility — page icons are no longer rendered */
  icon?: string;
}

/**
 * Global app header.
 * - Left: always-on animated Home icon (hidden on home) + back button
 * - On /lemosplay: Home only, no back arrow; dark theme; no coin tarja
 */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { coins } = useCoins();
  const isAdmin = useIsAdmin();
  const [user, setUser] = useState<{ name?: string; avatar?: string } | null>(null);

  const isHome = location.pathname === "/";
  const isLemosPlay = location.pathname.startsWith("/lemosplay");

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
    <header className={`sticky top-0 z-40 w-screen ml-[calc(50%-50vw)] mb-3 ${isLemosPlay ? "bg-black/60 backdrop-blur" : ""}`}>
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Home icon (always on, hidden only on home itself) */}
        {!isHome ? (
          <button
            onClick={() => navigate("/")}
            aria-label="Início"
            title="Início"
            className="shrink-0 w-11 h-11 rounded-full overflow-hidden bg-white shadow-lg border-2 border-amber-300 animate-[backPulse_2.4s_ease-in-out_infinite] hover:scale-110 transition-transform"
          >
            <img loading="lazy" decoding="async" src={iconInicio} alt="Início" className="w-full h-full object-cover" />
          </button>
        ) : (
          <div className="w-11 h-11 shrink-0" aria-hidden />
        )}

        {/* Back arrow — hidden on Lemos Play (per request) and home */}
        {!isHome && !isLemosPlay && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            title="Voltar"
            className="shrink-0 w-11 h-11 rounded-full bg-white/85 hover:bg-white shadow-lg border-2 border-amber-300 flex items-center justify-center text-amber-900 animate-[backPulse_2s_ease-in-out_infinite] hover:scale-110 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 animate-[backNudge_1.4s_ease-in-out_infinite]" />
          </button>
        )}

        {/* Center: title */}
        <div className="flex-1 min-w-0 flex items-center justify-center text-center px-2">
          <div className="min-w-0">
            {title && (
              isLemosPlay ? (
                <h1 className="font-display font-extrabold text-base sm:text-lg md:text-2xl leading-tight truncate text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] animate-[titleGlow_2.6s_ease-in-out_infinite]">
                  {title}
                </h1>
              ) : (
                <h1 className="font-display font-extrabold text-base sm:text-lg md:text-2xl leading-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 drop-shadow-[0_2px_6px_rgba(180,90,0,0.25)] animate-[titleGlow_2.6s_ease-in-out_infinite]">
                  {title}
                </h1>
              )
            )}
            {subtitle && (
              <p className={`font-body text-[10px] sm:text-xs leading-tight truncate ${isLemosPlay ? "text-white/80" : "text-amber-900/80"}`}>{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: coins + user */}
        <div className="flex items-center gap-2 shrink-0">
          {isLemosPlay ? (
            <div className="flex items-center gap-1">
              <span className="text-base leading-none">🪙</span>
              <span className="font-display font-extrabold text-sm tabular-nums text-white">{coins}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 shadow-sm">
              <span className="text-base leading-none">🪙</span>
              <span className="font-display font-extrabold text-sm text-amber-900 tabular-nums">{coins}</span>
            </div>
          )}
          {user?.name && (
            <div className="flex items-center gap-1.5">
              <span className={`font-display font-bold text-xs max-w-[100px] truncate ${isLemosPlay ? "text-white" : "text-foreground"}`}>
                {user.name}
              </span>
              <img loading="lazy" decoding="async"
                src={user.avatar || iconUsuario}
                alt={user.name || "Usuário"}
                className="w-9 h-9 rounded-full border-2 border-amber-300 shadow-sm object-cover"
              />
            </div>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate("/config")}
              className={`w-9 h-9 rounded-full shadow flex items-center justify-center transition border border-amber-300 ${isLemosPlay ? "bg-white/15 hover:bg-white/30 text-white" : "bg-white/80 hover:bg-white text-foreground"}`}
              title="Configurações (admin)"
              aria-label="Configurações"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Coin reminder */}
      {isLemosPlay ? (
        <div className="px-3 text-center text-[11px] sm:text-xs font-display font-bold text-white/90 drop-shadow">
          🪙 Ganhe moedas completando atividades e assistindo aos vídeos!
        </div>
      ) : (
        <div className="px-3">
          <div className="mx-auto max-w-3xl text-center text-[10px] sm:text-xs font-display font-bold text-amber-900/90 bg-gradient-to-r from-amber-100/80 via-yellow-100/80 to-amber-100/80 rounded-full px-3 py-1 border border-amber-300/70 shadow-sm">
            🪙 Ganhe moedas completando atividades e assistindo aos vídeos!
          </div>
        </div>
      )}

      <style>{`
        @keyframes titleGlow {
          0%,100% { transform: scale(1); filter: drop-shadow(0 2px 4px rgba(180,90,0,0.25)); }
          50% { transform: scale(1.04); filter: drop-shadow(0 6px 14px rgba(180,90,0,0.45)); }
        }
        @keyframes backPulse {
          0%,100% { box-shadow: 0 4px 10px rgba(180,90,0,0.25); }
          50% { box-shadow: 0 8px 20px rgba(180,90,0,0.55); }
        }
        @keyframes backNudge {
          0%,100% { transform: translateX(0); }
          50% { transform: translateX(-3px); }
        }
      `}</style>
    </header>
  );
}
