import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrbitMenu from "@/components/OrbitMenu";

const labelToRoute: Record<string, string> = {
  "BÍBLIA": "/biblia",
  "LOUVORES": "/louvores",
  "MÚSICAS": "/musicas",
  "DEVOCIONAIS": "/devocionais",
  "PEDIDOS\nDE ORAÇÃO": "/pedidos-oracao",
  "ATIVIDADES": "/atividades",
  "HISTÓRIAS": "/historias",
};

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lemos_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("lemos_user");
    setUser(null);
  };

  const handleItemClick = (label: string) => {
    const route = labelToRoute[label];
    if (route) navigate(route);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
    >
      <div className="scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100">
        <OrbitMenu
          isAuthenticated={!!user}
          userName={user?.name}
          userAvatar={user?.avatar}
          onLoginClick={() => navigate("/login")}
          onLogout={handleLogout}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  );
}
