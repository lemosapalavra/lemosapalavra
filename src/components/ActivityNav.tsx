import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import iconInicio from "@/assets/icon-inicio.jpg";

interface ActivityNavProps {
  onBack: () => void;
  backLabel?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Minimal header for activity sub-views.
 * Shows ONLY the Início + Voltar buttons (per user request) plus an optional
 * title/subtitle centered. No user info, coin badge, or admin gear.
 */
export default function ActivityNav({ onBack, backLabel = "Voltar às atividades", title, subtitle, className = "" }: ActivityNavProps) {
  const navigate = useNavigate();
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      <button
        onClick={() => navigate("/")}
        aria-label="Início"
        title="Início"
        className="shrink-0 w-11 h-11 rounded-full overflow-hidden bg-white shadow-lg border-2 border-amber-300 animate-[backPulse_2.4s_ease-in-out_infinite] hover:scale-110 transition-transform"
      >
        <img src={iconInicio} alt="Início" className="w-full h-full object-cover" />
      </button>
      <button
        onClick={onBack}
        aria-label="Voltar"
        title={backLabel}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg border-2 border-amber-300 text-amber-900 font-display font-bold text-sm animate-[backPulse_2s_ease-in-out_infinite] hover:scale-105 transition-transform"
      >
        <ArrowLeft className="w-5 h-5 animate-[backNudge_1.4s_ease-in-out_infinite]" />
        <span>Voltar</span>
      </button>
      {(title || subtitle) && (
        <div className="flex-1 min-w-0 text-center px-2">
          {title && (
            <h1 className="font-display font-extrabold text-base sm:text-xl leading-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600">
              {title}
            </h1>
          )}
          {subtitle && <p className="font-body text-[11px] sm:text-xs leading-tight truncate text-amber-900/80">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
