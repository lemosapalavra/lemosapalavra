import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconPedidos from "@/assets/icon-pedidos-oracao.png";

export default function PedidosOracao() {
  const navigate = useNavigate();
  const [pedido, setPedido] = useState("");
  const [pedidos, setPedidos] = useState<string[]>(() => {
    const stored = localStorage.getItem("lemos_pedidos");
    return stored ? JSON.parse(stored) : [];
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pedido.trim()) return;
    const updated = [pedido, ...pedidos];
    setPedidos(updated);
    localStorage.setItem("lemos_pedidos", JSON.stringify(updated));
    setPedido("");
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")} className="btn-cartoon px-4 py-2 text-sm mb-6">← Voltar</button>
        <div className="flex items-center gap-4 mb-8">
          <img src={iconPedidos} alt="Pedidos de Oração" width={80} height={80} className="rounded-full shadow-lg" />
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Pedidos de Oração</h1>
            <p className="text-muted-foreground font-body">Ore e compartilhe seus pedidos</p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            value={pedido}
            onChange={(e) => setPedido(e.target.value)}
            placeholder="Escreva seu pedido de oração..."
            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="btn-cartoon px-6 py-3">🙏 Enviar</button>
        </form>

        <div className="space-y-3">
          {pedidos.length === 0 && (
            <p className="text-center text-muted-foreground font-body py-8">Nenhum pedido ainda. Escreva o seu primeiro! 🙏</p>
          )}
          {pedidos.map((p, i) => (
            <div key={i} className="bg-popover rounded-2xl p-4 shadow-md border border-border">
              <p className="font-body text-foreground">🙏 {p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
