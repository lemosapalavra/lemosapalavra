import { useState } from "react";

const tipos = [
  { id: "critica", label: "Crítica", emoji: "📝" },
  { id: "sugestao", label: "Sugestão", emoji: "💡" },
  { id: "elogio", label: "Elogio", emoji: "⭐" },
  { id: "mensagem", label: "Mensagem", emoji: "💬" },
];

export default function FeedbackFooter() {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState("");
  const [texto, setTexto] = useState("");
  const [sent, setSent] = useState(false);

  const userName = (() => {
    try {
      const stored = localStorage.getItem("lemos_user");
      return stored ? JSON.parse(stored).name : "";
    } catch { return ""; }
  })();

  const handleSend = () => {
    if (!tipo || !texto.trim()) return;
    // Store feedback locally for now
    const feedbacks = JSON.parse(localStorage.getItem("lemos_feedbacks") || "[]");
    feedbacks.push({ tipo, texto: texto.trim(), nome: userName, data: new Date().toISOString() });
    localStorage.setItem("lemos_feedbacks", JSON.stringify(feedbacks));
    setSent(true);
    setTimeout(() => { setSent(false); setOpen(false); setTipo(""); setTexto(""); }, 2000);
  };

  return (
    <footer className="w-full bg-popover border-t border-border mt-8">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {!open ? (
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">Lemos a Palavra © 2025</p>
            <button
              onClick={() => setOpen(true)}
              className="btn-cartoon px-4 py-2 text-sm"
            >
              💬 Fale Conosco
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-foreground">💬 Fale Conosco</h3>
            <p className="font-body text-sm text-muted-foreground">Quer deixar uma:</p>
            <div className="flex gap-2 flex-wrap">
              {tipos.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTipo(t.id)}
                  className={`px-4 py-2 rounded-full font-display text-sm font-bold transition-all ${
                    tipo === t.id
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-background text-foreground border border-border hover:border-primary/50"
                  }`}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>

            <p className="font-body text-sm text-muted-foreground">👤 {userName || "Usuário"}</p>

            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Escreva sua mensagem aqui..."
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />

            <div className="flex gap-2">
              <button onClick={handleSend} className="btn-cartoon px-6 py-2 text-sm flex-1" disabled={sent}>
                {sent ? "✅ Enviado!" : "Enviar"}
              </button>
              <button onClick={() => { setOpen(false); setTipo(""); setTexto(""); }} className="px-4 py-2 rounded-xl border border-border font-body text-sm text-muted-foreground hover:bg-accent/20">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
