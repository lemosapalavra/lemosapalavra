import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import { toast } from "@/hooks/use-toast";
import iconPedidos from "@/assets/icon-pedidos-oracao.png";

const tiposOracao = [
  { id: "adoracao", label: "Oração de Adoração", desc: "Exaltação e louvor a Deus, reconhecendo Sua grandeza e santidade.", emoji: "🙌" },
  { id: "confissao", label: "Oração de Confissão", desc: "Reconhecimento e arrependimento de pecados, buscando perdão e reconciliação com Deus.", emoji: "🙏" },
  { id: "peticao", label: "Oração de Petição", desc: "Pedidos para necessidades espirituais ou físicas, expressando a vontade de Deus.", emoji: "🙇" },
  { id: "intercessao", label: "Oração de Intercessão", desc: "Orar por outras pessoas, pedindo ajuda e proteção.", emoji: "🤝" },
  { id: "agradecimento", label: "Oração de Agradecimento", desc: "Agradecer a Deus por Suas bênçãos e bondade.", emoji: "💛" },
];

interface Pedido {
  tipo: string;
  texto: string;
  nome: string;
  data: string;
}

export default function PedidosOracao() {
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [texto, setTexto] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    const stored = localStorage.getItem("lemos_pedidos_v2");
    return stored ? JSON.parse(stored) : [];
  });
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("lemos_user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.name || "");
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoSelecionado || !texto.trim()) return;
    const novoPedido: Pedido = {
      tipo: tipoSelecionado,
      texto: texto.trim(),
      nome: userName,
      data: new Date().toLocaleDateString("pt-BR"),
    };
    const updated = [novoPedido, ...pedidos];
    setPedidos(updated);
    localStorage.setItem("lemos_pedidos_v2", JSON.stringify(updated));
    setTexto("");
    setTipoSelecionado("");
    toast({
      title: "🙏 Oração registrada!",
      description: "Seu pedido foi guardado no seu mural pessoal abaixo. Deus ouve cada palavra do seu coração.",
    });
    setTimeout(() => {
      document.getElementById("mural-oracoes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const getTipoLabel = (id: string) => tiposOracao.find((t) => t.id === id)?.label || id;
  const getTipoEmoji = (id: string) => tiposOracao.find((t) => t.id === id)?.emoji || "🙏";

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Pedidos de Oração" subtitle="Ore e compartilhe seus pedidos" icon={iconPedidos} />

        <form onSubmit={handleAdd} className="bg-popover rounded-2xl p-6 shadow-lg border border-border mb-8">
          <p className="font-display text-lg font-bold text-foreground mb-1">👤 {userName || "Usuário"}</p>

          <p className="font-body text-sm text-foreground mb-3 mt-4">Tipo de oração:</p>
          <div className="space-y-2 mb-4">
            {tiposOracao.map((tipo) => (
              <button
                key={tipo.id}
                type="button"
                onClick={() => setTipoSelecionado(tipo.id)}
                className={`w-full text-left rounded-xl p-3 border-2 transition-all ${
                  tipoSelecionado === tipo.id
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <p className="font-display text-sm font-bold text-foreground">{tipo.emoji} {tipo.label}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{tipo.desc}</p>
              </button>
            ))}
          </div>

          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Descreva aqui sua oração..."
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-3"
          />

          <p className="font-body text-xs text-muted-foreground italic mb-4">
            A adoração é fundamental para a vida cristã, e ajuda a fortalecer a relação com Deus.
          </p>

          <button type="submit" className="btn-cartoon px-6 py-3 w-full">🙏 Enviar Oração</button>
        </form>

        <div className="space-y-3">
          {pedidos.length === 0 && (
            <p className="text-center text-muted-foreground font-body py-8">Nenhum pedido ainda. Escreva o seu primeiro! 🙏</p>
          )}
          {pedidos.map((p, i) => (
            <div key={i} className="bg-popover rounded-2xl p-4 shadow-md border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-sm font-bold text-primary">{getTipoEmoji(p.tipo)} {getTipoLabel(p.tipo)}</span>
                <span className="font-body text-xs text-muted-foreground">{p.data}</span>
              </div>
              <p className="font-body text-foreground">{p.texto}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">— {p.nome}</p>
            </div>
          ))}
        </div>
      </div>
      <FeedbackFooter />
    </div>
  );
}
