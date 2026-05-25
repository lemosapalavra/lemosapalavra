import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: string;
}

export default function PageHeader(_props: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-3 left-3 z-40 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      title="Voltar"
      aria-label="Voltar"
    >
      <ArrowLeft className="w-6 h-6 text-foreground" />
    </button>
  );
}
