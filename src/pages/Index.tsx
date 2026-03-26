import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrbitMenu from "@/components/OrbitMenu";

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

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

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}
    >
      <div className="scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100">
        <OrbitMenu
          isAuthenticated={!!user}
          userName={user?.name}
          onLoginClick={() => navigate("/login")}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}
