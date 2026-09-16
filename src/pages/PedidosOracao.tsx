import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/hooks/use-toast";
import { awardOnce } from "@/hooks/useCoins";
import iconPedidos from "@/assets/icon-pedidos-oracao.png";
import heroKids from "@/assets/paginas/kids-oracao.png.asset.json";

// Ilustrações bíblicas por tipo de oração.
import imgCriacao from "@/assets/historia-criacao.png";
import imgAdaoEva from "@/assets/historia-adao-eva-1.png";
import imgMoises from "@/assets/historia-moises-1.png";
import imgNoe from "@/assets/historia-noe-1.png";
import imgDavi from "@/assets/historia-davi-golias.png";

const tiposOracao = [
  { id: "adoracao", label: "Oração de Adoração", desc: "Louvor e amor para Deus com um coração alegre.", emoji: "🙌", color: "from-amber-300 to-yellow-400", image: imgCriacao },
  { id: "confissao", label: "Oração de Confissão", desc: "Falar com sinceridade e pedir perdão a Deus.", emoji: "🙏", color: "from-pink-300 to-rose-400", image: imgAdaoEva },
  { id: "peticao", label: "Oração de Petição", desc: "Levar seus pedidos e necessidades para Deus.", emoji: "💛", color: "from-sky-300 to-cyan-400", image: imgMoises },
  { id: "intercessao", label: "Oração de Intercessão", desc: "Orar por amigos, família e outras pessoas.", emoji: "🤝", color: "from-emerald-300 to-teal-400", image: imgNoe },
  { id: "agradecimento", label: "Oração de Agradecimento", desc: "Dizer obrigado pelas bênçãos e pelo cuidado de Deus.", emoji: "🌟", color: "from-violet-300 to-fuchsia-400", image: imgDavi },
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
    awardOnce(`oracao:${Date.now()}`, 5, "Oração registrada com carinho 🙏");
    toast({
      title: "🙏 Oração registrada!",
      description: "Seu pedido foi guardado com carinho no seu mural de oração.",
    });
    setTimeout(() => {
      document.getElementById("mural-oracoes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const getTipo = (id: string) => tiposOracao.find((t) => t.id === id);
  const getTipoLabel = (id: string) => getTipo(id)?.label || id;
  const getTipoEmoji = (id: string) => getTipo(id)?.emoji || "🙏";
  const getTipoColor = (id: string) => getTipo(id)?.color || "from-amber-300 to-yellow-400";

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(198,85%,90%), hsl(45,100%,94%) 45%, hsl(325,80%,92%))" }}>
      <div className="max-w-5xl mx-auto">
        <PageHeader title="Pedidos de Oração" subtitle="Um cantinho de oração com carinho" icon={iconPedidos} />

        <section className="relative overflow-hidden rounded-[28px] border-2 border-amber-200/80 shadow-2xl mb-6 bg-gradient-to-br from-sky-100 via-amber-50 to-pink-100">
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 20%, #fff6bf, transparent 25%), radial-gradient(circle at 80% 25%, #ffd2e1, transparent 22%), radial-gradient(circle at 50% 90%, #b8ecff, transparent 28%)" }} />
          <img
            src={heroKids.url}
            alt="Crianças orando juntas em um campo florido"
            width={1536}
            height={640}
            loading="lazy"
            decoding="async"
            className="relative w-full h-40 sm:h-56 md:h-64 object-cover rounded-t-[26px]"
          />
          <div className="relative px-6 py-7 text-center">
            <div className="flex items-center justify-center gap-3 text-5xl mb-3">
              <span>☁️</span><span>🙏</span><span>✨</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-amber-950 mb-2">Vamos falar com Deus</h2>
            <p className="font-body text-sm sm:text-base text-amber-900/90 max-w-2xl mx-auto leading-relaxed">
              Aqui suas orações ficam guardadas com carinho no seu mural pessoal. Você pode voltar, reler,
              agradecer e continuar conversando com Deus todos os dias.
            </p>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <form onSubmit={handleAdd} className="rounded-[28px] p-6 shadow-xl border-2 border-pink-200 bg-gradient-to-br from-white via-pink-50 to-amber-50">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <p className="font-display text-lg font-extrabold text-foreground">👤 {userName || "Usuário"}</p>
                <p className="font-body text-sm text-muted-foreground">Escolha um tipo de oração e escreva com o coração.</p>
              </div>
              <div className="text-4xl">🕊️</div>
            </div>

            <p className="font-display text-sm font-bold text-foreground mb-3">Tipo de oração</p>
            <div className="grid gap-3 mb-5">
              {tiposOracao.map((tipo) => (
                <button
                  key={tipo.id}
                  type="button"
                  onClick={() => setTipoSelecionado(tipo.id)}
                  className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${
                    tipoSelecionado === tipo.id
                      ? "border-primary bg-primary/10 scale-[1.02] shadow-lg"
                      : "border-border bg-white/80 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`relative w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${tipo.color} shadow-md overflow-hidden`}>
                      <img src={tipo.image} alt={tipo.label} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      <span className="absolute -bottom-0.5 -right-0.5 text-lg drop-shadow">{tipo.emoji}</span>
                    </div>

                    <div>
                      <p className="font-display text-sm font-extrabold text-foreground">{tipo.label}</p>
                      <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{tipo.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva aqui sua oração..."
              rows={5}
              className="w-full rounded-2xl border-2 border-amber-200 bg-white px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-3 shadow-sm"
            />

            <p className="font-body text-xs text-amber-800 italic mb-4 text-center">
              🌈 Deus ouve cada palavra do seu coração.
            </p>

            <button type="submit" className="btn-cartoon px-6 py-3 w-full">🖼️ Colocar no Mural</button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-[28px] p-5 border-2 border-sky-200 bg-gradient-to-br from-sky-50 via-white to-yellow-50 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-300 to-cyan-400 flex items-center justify-center text-3xl shadow-md">💌</div>
                <div>
                  <h3 className="font-display text-lg font-extrabold text-sky-950">Seu mural de oração</h3>
                  <p className="font-body text-xs text-sky-900/75">Guarde seus pedidos, agradecimentos e vitórias.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-white/90 border border-sky-200 p-3">
                  <p className="text-2xl">🙏</p>
                  <p className="font-display text-sm font-extrabold text-sky-950">{pedidos.length}</p>
                  <p className="text-[11px] font-body text-sky-900/70">orações</p>
                </div>
                <div className="rounded-2xl bg-white/90 border border-amber-200 p-3">
                  <p className="text-2xl">🌟</p>
                  <p className="font-display text-sm font-extrabold text-amber-950">1</p>
                  <p className="text-[11px] font-body text-amber-900/70">coração</p>
                </div>
                <div className="rounded-2xl bg-white/90 border border-pink-200 p-3">
                  <p className="text-2xl">🕊️</p>
                  <p className="font-display text-sm font-extrabold text-pink-950">∞</p>
                  <p className="text-[11px] font-body text-pink-900/70">esperança</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] p-5 border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 shadow-lg">
              <h3 className="font-display text-lg font-extrabold text-amber-950 mb-3">✨ Lembretes de fé</h3>
              <div className="space-y-3">
                <div className="rounded-2xl bg-white/90 p-3 border border-amber-200">
                  <p className="font-display text-sm font-bold text-amber-900">💛 Ore com sinceridade</p>
                  <p className="font-body text-xs text-amber-900/75 mt-1">Deus conhece seu coração e cuida de você com amor.</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-3 border border-sky-200">
                  <p className="font-display text-sm font-bold text-sky-900">🌤️ Volte para agradecer</p>
                  <p className="font-body text-xs text-sky-900/75 mt-1">Seu mural também serve para lembrar das bênçãos recebidas.</p>
                </div>
                <div className="rounded-2xl bg-white/90 p-3 border border-pink-200">
                  <p className="font-display text-sm font-bold text-pink-900">🫶 Ore por outras pessoas</p>
                  <p className="font-body text-xs text-pink-900/75 mt-1">Interceder também é uma forma linda de amar.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div id="mural-oracoes" className="space-y-3 mt-8">
          <h2 className="font-display font-extrabold text-xl text-foreground flex items-center gap-2 mb-1">
            📜 Seu mural de orações
            <span className="text-xs font-body font-normal text-muted-foreground">({pedidos.length})</span>
          </h2>
          {pedidos.length === 0 && (
            <div className="rounded-[24px] border-2 border-dashed border-amber-300 bg-white/60 p-8 text-center shadow-sm">
              <p className="text-5xl mb-3">🙏</p>
              <p className="text-center text-muted-foreground font-body">Nenhum pedido ainda. Escreva o seu primeiro!</p>
            </div>
          )}
          {pedidos.map((p, i) => (
            <div key={i} className="rounded-[24px] p-4 shadow-md border-2 border-amber-200 bg-gradient-to-br from-white via-amber-50 to-pink-50">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className={`font-display text-sm font-extrabold px-3 py-1 rounded-full bg-gradient-to-r ${getTipoColor(p.tipo)} text-amber-950 shadow-sm`}>
                  {getTipoEmoji(p.tipo)} {getTipoLabel(p.tipo)}
                </span>
                <span className="font-body text-xs text-muted-foreground">{p.data}</span>
              </div>
              <p className="font-body text-foreground leading-relaxed">{p.texto}</p>
              <p className="font-body text-xs text-muted-foreground mt-2">— {p.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
