import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import iconInicio from "@/assets/icon-inicio.jpg";
import iconUsuario from "@/assets/icon-usuario.png";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export default function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lemos_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="mb-8">
      {/* Top bar: Início left, User right */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
        >
          <img src={iconInicio} alt="Início" className="w-14 h-14 rounded-2xl shadow-lg" />
          <span className="font-display text-xs font-bold text-foreground">Início</span>
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-display text-sm font-bold text-foreground">{user.name}</p>
              <p className="font-body text-[10px] text-muted-foreground italic">Que a paz do Senhor esteja conosco.</p>
            </div>
            <img
              src={user.avatar || iconUsuario}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-primary/30 shadow-md"
            />
          </div>
        )}
      </div>

      {/* Title centered */}
      <div className="flex flex-col items-center text-center gap-2">
        {icon && (
          <img src={icon} alt={title} width={64} height={64} className="rounded-full shadow-lg" />
        )}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground font-body text-sm">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
