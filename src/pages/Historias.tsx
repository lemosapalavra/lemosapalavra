import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import iconHistorias from "@/assets/icon-historias.png";

export default function Historias() {
  const [tab, setTab] = useState("criacao");

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="relative z-10">
        <PageHeader title="Histórias Bíblicas" subtitle="Escolha uma história" icon={iconHistorias} />
      </div>
      <div className="flex-1 flex flex-col items-center px-4 py-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="criacao">A Criação</TabsTrigger>
            <TabsTrigger value="jesus">Jesus</TabsTrigger>
            <TabsTrigger value="moises">Moisés</TabsTrigger>
          </TabsList>

          <TabsContent value="criacao" className="mt-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/30 bg-black">
              <video
                src="/videos/a-criacao.mp4"
                controls
                playsInline
                className="w-full h-auto"
              >
                Seu navegador não suporta vídeo.
              </video>
            </div>
            <p className="mt-4 text-center text-muted-foreground font-body">
              A Criação do Mundo
            </p>
          </TabsContent>

          <TabsContent value="jesus" className="mt-6">
            <div className="rounded-2xl border-2 border-dashed border-primary/30 p-12 text-center">
              <p className="text-muted-foreground text-lg font-body">
                Em breve: histórias sobre Jesus.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="moises" className="mt-6">
            <div className="rounded-2xl border-2 border-dashed border-primary/30 p-12 text-center">
              <p className="text-muted-foreground text-lg font-body">
                Em breve: histórias sobre Moisés.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
