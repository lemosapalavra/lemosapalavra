import { useNavigate } from "react-router-dom";
import iconInicio from "@/assets/icon-inicio.jpg";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: string;
}

export default function PageHeader(_props: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="fixed top-3 left-3 z-40 w-12 h-12 rounded-full bg-white/70 hover:bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      title="Início"
    >
      <img src={iconInicio} alt="Início" className="w-10 h-10 rounded-full" />
    </button>
  );
}
