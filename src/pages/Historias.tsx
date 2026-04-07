import PageHeader from "@/components/PageHeader";
import iconHistorias from "@/assets/icon-historias.png";

export default function Historias() {
  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="relative z-10">
        <PageHeader title="Histórias Bíblicas" subtitle="Em breve mais conteúdo" icon={iconHistorias} />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-lg font-body">Nenhuma história disponível no momento.</p>
      </div>
    </div>
  );
}