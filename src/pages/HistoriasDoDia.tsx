import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import CoinBadge from "@/components/CoinBadge";
import { awardOnce, todayKey } from "@/hooks/useCoins";
import { COINS } from "@/data/coinRewards";
import { historiasDoDia, type HistoriaBiblica } from "@/data/historiasBiblicas";
import iconHistoriasDia from "@/assets/historias/icone-historias.png.asset.json";

const HIST_COINS = COINS.devocional;

function StoryCard({ historia, index }: { historia: HistoriaBiblica; index: number }) {
  const [open, setOpen] = useState(index === 0);

  useEffect(() => {
    if (open) awardOnce(todayKey(`historia:${historia.id}`), HIST_COINS, "História lida");
  }, [open, historia.id]);

  return (
    <article className="rounded-[28px] border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 shadow-xl p-5 mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        title={open ? "Fechar história" : "Abrir história"}
        className="w-full text-left flex items-center gap-4"
      >
        <img
          src={historia.imagem}
          alt={historia.titulo}
          loading="lazy"
          decoding="async"
          className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-200 bg-white shrink-0"
        />
        <span className="flex-1">
          <span className="block font-display text-xl sm:text-2xl font-extrabold text-amber-950">{historia.titulo}</span>
          <span className="block font-display text-primary text-xs font-bold mt-0.5">📜 {historia.referencia}</span>
        </span>
        <CoinBadge amount={HIST_COINS} size="xs" label="ao ler" />
      </button>

      {open && (
        <div className="grid gap-3 mt-4">
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-[22px] p-4 border-2 border-amber-200">
            <h4 className="font-display text-sm font-extrabold text-amber-900 mb-1">📖 Versículo-chave</h4>
            <p className="font-body text-amber-950 italic leading-relaxed">{historia.versiculo}</p>
          </div>
          <div className="bg-white rounded-[22px] p-4 border-2 border-sky-200">
            <h4 className="font-display text-sm font-extrabold text-sky-900 mb-1">📚 História resumida</h4>
            <p className="font-body text-sky-950 leading-relaxed">{historia.resumo}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-[22px] p-4 border-2 border-emerald-200">
              <h4 className="font-display text-xs font-extrabold text-emerald-900 mb-1">🔎 Curiosidade bíblica</h4>
              <p className="font-body text-sm text-emerald-950">{historia.curiosidade}</p>
            </div>
            <div className="bg-violet-50 rounded-[22px] p-4 border-2 border-violet-200">
              <h4 className="font-display text-xs font-extrabold text-violet-900 mb-1">💡 O que quase ninguém percebe</h4>
              <p className="font-body text-sm text-violet-950">{historia.percebe}</p>
            </div>
            <div className="bg-rose-50 rounded-[22px] p-4 border-2 border-rose-200">
              <h4 className="font-display text-xs font-extrabold text-rose-900 mb-1">❤️ Aplicação para a vida</h4>
              <p className="font-body text-sm text-rose-950">{historia.aplicacao}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-yellow-50 rounded-[22px] p-4 border-2 border-yellow-200">
              <h4 className="font-display text-xs font-extrabold text-amber-900 mb-1">⭐ Missão da semana</h4>
              <p className="font-body text-sm text-amber-950">{historia.missao}</p>
            </div>
            <div className="bg-sky-50 rounded-[22px] p-4 border-2 border-sky-200">
              <h4 className="font-display text-xs font-extrabold text-sky-900 mb-1">💬 Pergunta para conversar</h4>
              <p className="font-body text-sm text-sky-950">{historia.pergunta}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-[22px] p-4 border-2 border-pink-200">
            <h4 className="font-display text-sm font-extrabold text-pink-900 mb-1">🙏 Vamos orar juntos</h4>
            <p className="font-body text-pink-950 italic leading-relaxed">{historia.oracao}</p>
          </div>
          {historia.frase && (
            <p className="text-center font-display text-sm font-extrabold text-amber-900">✝️ {historia.frase}</p>
          )}

          <ColoringCanvas historia={historia} />
        </div>
      )}
    </article>
  );
}

export default function HistoriasDoDia() {
  const doDia = historiasDoDia();

  return (
    <div
      className="min-h-screen py-6 px-4"
      style={{ background: "linear-gradient(180deg, hsl(195,88%,90%), hsl(44,100%,93%) 42%, hsl(332,86%,92%))" }}
    >
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Histórias" subtitle="Histórias bíblicas para crianças" icon={iconHistoriasDia.url} />

        <section className="rounded-[26px] border-2 border-amber-200 bg-white/80 shadow-md p-5 mb-6 text-center">
          <h2 className="font-display text-2xl font-extrabold text-amber-950 mb-1">📖 Histórias do dia</h2>
          <p className="font-body text-sm text-amber-900">
            Todo dia você encontra <strong>duas histórias diferentes</strong> da Bíblia para ler, conversar em família
           . Volte amanhã: as histórias mudam dia após dia!
          </p>
        </section>

        {doDia.map((h, i) => (
          <StoryCard key={h.id} historia={h} index={i} />
        ))}
      </div>
    </div>
  );
}
