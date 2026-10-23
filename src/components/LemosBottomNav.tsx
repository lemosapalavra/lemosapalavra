import { NavLink, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { House, BookOpen, Heart, HandHeart, Settings } from "lucide-react";

const items = [
  { label: "Início", path: "/", Icon: House },
  { label: "Bíblia", path: "/biblia", Icon: BookOpen },
  { label: "Devocionais", path: "/devocionais", Icon: Heart },
  { label: "Orar", path: "/pedidos-oracao", Icon: HandHeart },
  { label: "Adm", path: "/config", Icon: Settings },
];

export default function LemosBottomNav() {
  const { pathname } = useLocation();
  if (pathname === "/login" || pathname === "/login-sms") return null;

  return createPortal(
    <nav aria-label="Menu principal Lemos a Palavra" className="fixed inset-x-0 bottom-0 z-[9999] border-t-[3px] border-amber-400 bg-gradient-to-br from-[#a9652c] via-[#794015] to-[#49250c] shadow-[0_-4px_16px_rgba(0,0,0,.5)]" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="mx-auto flex h-[65px] max-w-[640px] items-stretch justify-around">
        {items.map(({ label, path, Icon }) => (
          <NavLink key={path} to={path} end={path === "/"} aria-label={label}
            className={({ isActive }) => `group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 transition-all duration-200 active:scale-95 ${isActive ? "text-[#ffdc71]" : "text-[#f7edce] hover:text-[#ffe5a1]"}`}>
            {({ isActive }) => (
              <>
                <span className={`flex h-9 w-10 items-center justify-center rounded-xl transition-all duration-200 ${isActive ? "bg-amber-200/20 shadow-[0_0_14px_rgba(255,205,71,.55)]" : "group-hover:bg-white/10"}`}>
                  <Icon size={25} strokeWidth={isActive ? 2.6 : 2.1} className={isActive ? "drop-shadow-[0_0_6px_rgba(255,217,89,.8)]" : ""} />
                </span>
                <span className={`text-[10px] font-bold leading-none sm:text-xs ${isActive ? "text-[#ffdf80]" : ""}`}>{label}</span>
                {isActive && <span className="absolute top-0 h-[3px] w-11 rounded-b-full bg-[#ffda68] shadow-[0_0_9px_#ffce43]" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>,
    document.body
  );
}
