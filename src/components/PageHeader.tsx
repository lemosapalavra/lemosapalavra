import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings, ArrowLeft } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import iconUsuario from "@/assets/icon-usuario.png";
import iconInicio from "@/assets/icon-inicio.jpg";
import HomeTopNav from "@/components/HomeTopNav";

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
  // Páginas que já mostram o nome em uma faixa (WavyBanner) não repetem o título.
  const hasBanner = isLemosPlay || location.pathname.startsWith("/atividades");


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
    <>
    {/* espaçador: reserva a altura do cabeçalho fixo */}
    <div aria-hidden className="h-[108px] w-full" />
    <header className={`fixed top-0 left-0 right-0 z-40 w-full ${isLemosPlay ? "bg-black/60 backdrop-blur" : "bg-white/85 backdrop-blur-sm border-b border-amber-200/60"}`}>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        {/* Left: Home + Back */}
        <div className="flex items-center gap-2 shrink-0">
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
        </div>

        {/* Center: main navigation */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <HomeTopNav />
        </div>

        {/* Right: user fixed to the right of the page */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {user?.name && (
            <div className="flex items-center gap-1.5">
              <img loading="lazy" decoding="async"
                src={user.avatar || iconUsuario}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = iconUsuario; }}
                alt={user.name || "Usuário"}
                title={`Seja Bem vindo, ${user.name}`}
                className="w-9 h-9 rounded-full border-2 border-amber-300 shadow-sm object-cover bg-white"
              />
              <span className="leading-tight text-left hidden sm:inline">
                <span className={`block font-display font-bold text-[11px] sm:text-xs max-w-[150px] truncate ${isLemosPlay ? "text-white" : "text-foreground"}`}>
                  Seja Bem vindo, {user.name}
                </span>
                <span className={`block font-body text-[9px] sm:text-[10px] ${isLemosPlay ? "text-white/80" : "text-amber-800"}`}>
                  Deus Seja Louvado!
                </span>
              </span>
            </div>
          )}
          {isLemosPlay ? (
            <div className="flex items-center gap-1" title="Suas moedinhas" aria-label="Suas moedinhas">
              <span className="text-base leading-none">🪙</span>
              <span className="font-display font-extrabold text-sm tabular-nums text-white">{coins}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 shadow-sm" title="Suas moedinhas" aria-label="Suas moedinhas">
              <span className="text-base leading-none">🪙</span>
              <span className="font-display font-extrabold text-sm text-amber-900 tabular-nums">{coins}</span>
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

      {/* Mobile: main navigation centered below */}
      <div className="md:hidden w-full px-3 pb-1.5">
        <HomeTopNav />
      </div>

      {/* Page title kept accessible; visible only when no WavyBanner exists */}
      {(title || subtitle) && (
        <div className="sr-only">
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
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
    </>
  );
}
