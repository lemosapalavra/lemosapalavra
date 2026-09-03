import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { MessageCircle, Send, Copy, Check } from "lucide-react";

type LemosUser = {
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  ageRange?: string;
  role?: string;
};

const TEMPLATES: { label: string; text: string }[] = [
  {
    label: "Boas-vindas",
    text: "Olá {nome}! 🙏 Bem-vindo(a) ao Lemos a Palavra! Que Deus abençoe seus estudos bíblicos hoje. ✝️📖",
  },
  {
    label: "Lembrete de devocional",
    text: "Olá {nome}! ✨ Não esqueça do seu devocional diário no Lemos a Palavra. Uma nova mensagem te espera hoje! 📖",
  },
  {
    label: "Recompensa de moedas",
    text: "Oi {nome}! 🪙 Você ganhou moedas novas no Lemos a Palavra. Volte ao app para abrir um pacote de figurinhas! 🎁",
  },
  {
    label: "Nova série/filme",
    text: "Olá {nome}! 🎬 Adicionamos um novo conteúdo no Lemos Play. Vem conferir e assistir junto da família! 🍿",
  },
  {
    label: "Aviso geral",
    text: "Olá {nome}! 📣 Temos novidades para você no Lemos a Palavra. Acesse o app para conferir!",
  },
];

function readUsers(): LemosUser[] {
  const list: LemosUser[] = [];
  try {
    const raw = localStorage.getItem("lemos_user");
    if (raw) list.push(JSON.parse(raw));
  } catch {}
  // Also support multi-profile key if present in future
  try {
    const raw = localStorage.getItem("lemos_users");
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) arr.forEach((u) => list.push(u));
    }
  } catch {}
  // Deduplicate by phone+name
  const seen = new Set<string>();
  return list.filter((u) => {
    const k = `${u.phone || ""}|${u.name || ""}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function sanitizePhone(p: string | undefined): string {
  if (!p) return "";
  // Keep only digits; assume Brazil if missing country code
  let d = (p.match(/\d+/g) || []).join("");
  if (!d) return "";
  if (!d.startsWith("55") && d.length <= 11) d = "55" + d;
  return d;
}

export default function AdminWhatsapp() {
  const navigate = useNavigate();
  const admin = useIsAdmin();
  const [users, setUsers] = useState<LemosUser[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customPhone, setCustomPhone] = useState("");
  const [customName, setCustomName] = useState("");
  const [message, setMessage] = useState(TEMPLATES[0].text);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!admin) {
      navigate("/config");
      return;
    }
    setUsers(readUsers());
  }, [admin, navigate]);

  const selected = users[selectedIdx];
  const targetName = (selected?.name || customName || "amigo(a)").trim();
  const targetPhone = sanitizePhone(selected?.phone || customPhone);

  const finalText = useMemo(() => message.split("{nome}").join(targetName), [message, targetName]);
  const waUrl = useMemo(
    () => (targetPhone ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(finalText)}` : ""),
    [targetPhone, finalText]
  );

  const send = () => {
    if (!waUrl) return;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(finalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title="Comunicação WhatsApp" subtitle="Envie mensagens diretas aos usuários cadastrados" />

      <div className="max-w-3xl mx-auto px-4 mt-4 space-y-5">
        {/* Destinatário */}
        <section className="bg-popover rounded-2xl p-5 shadow-md border border-border">
          <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" /> Destinatário
          </h3>

          {users.length > 0 ? (
            <div className="space-y-2 mb-4">
              {users.map((u, i) => {
                const active = i === selectedIdx;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedIdx(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                      active
                        ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300"
                        : "bg-white border-border hover:bg-zinc-50"
                    }`}
                  >
                    {u.avatar ? (
                      <img loading="lazy" decoding="async" src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-800">
                        {(u.name || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-sm truncate">{u.name || "Sem nome"}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {u.role ? `${u.role}` : ""}{u.ageRange ? ` · ${u.ageRange}` : ""}
                        {u.phone ? " · 📱 contato cadastrado" : " · sem contato"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">
              Nenhum usuário cadastrado neste dispositivo. Use os campos abaixo para enviar a um número manual.
            </p>
          )}

          <details className="text-sm">
            <summary className="cursor-pointer font-display font-bold text-foreground">
              ✍️ Enviar para outro número (manual)
            </summary>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <input
                type="text"
                placeholder="Nome (opcional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-white"
              />
              <input
                type="tel"
                placeholder="Telefone (ex: +55 11 9...)"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-white"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Dica: se não incluir o DDI, assumimos +55 (Brasil).
            </p>
          </details>
        </section>

        {/* Templates */}
        <section className="bg-popover rounded-2xl p-5 shadow-md border border-border">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">📋 Modelos de mensagem</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => setMessage(t.text)}
                className="px-3 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-display font-bold border border-emerald-300 transition"
              >
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm font-body"
            placeholder="Escreva sua mensagem. Use {nome} para inserir o nome do usuário."
          />
          <p className="text-xs text-muted-foreground mt-2">
            Variáveis disponíveis: <code className="bg-zinc-100 px-1 rounded">{"{nome}"}</code>
          </p>
        </section>

        {/* Preview & enviar */}
        <section className="bg-popover rounded-2xl p-5 shadow-md border border-border">
          <h3 className="font-display text-lg font-bold text-foreground mb-3">🔍 Pré-visualização</h3>
          <div className="bg-[#e5ddd5] rounded-xl p-4 mb-4">
            <div className="bg-[#dcf8c6] rounded-2xl p-3 max-w-[85%] ml-auto shadow text-sm font-body whitespace-pre-wrap text-zinc-900">
              {finalText || "—"}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            <strong>Para:</strong> {targetName} {targetPhone ? "(contato oculto por privacidade)" : "(sem telefone válido)"}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={send}
              disabled={!targetPhone}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-bold shadow transition"
            >
              <Send className="w-4 h-4" /> Abrir no WhatsApp
            </button>
            <button
              onClick={copy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-foreground font-display font-bold transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado!" : "Copiar mensagem"}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            ⚠️ O envio abre o WhatsApp Web/App com a mensagem já preenchida. Você confirma o disparo manualmente
            — assim respeitamos as políticas do WhatsApp e a privacidade do usuário.
          </p>
        </section>
      </div>

    </div>
  );
}
