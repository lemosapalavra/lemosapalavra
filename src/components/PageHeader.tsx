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
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
        >
          <img src={iconInicio} alt="Início" className="w-16 h-16 rounded-2xl shadow-lg" />
          <span className="font-display text-xs font-bold text-foreground">Início</span>
        </button>
        {icon && (
          <img src={icon} alt={title} width={64} height={64} className="rounded-full shadow-lg" />
        )}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground font-body text-sm">{subtitle}</p>}
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-display text-sm font-bold text-foreground">{user.name}</p>
            <p className="font-body text-xs text-muted-foreground italic">Que a paz do Senhor esteja conosco.</p>
          </div>
          <img
            src={user.avatar || iconUsuario}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-primary/30 shadow-md"
          />
        </div>
      )}
    </div>
  );
}
