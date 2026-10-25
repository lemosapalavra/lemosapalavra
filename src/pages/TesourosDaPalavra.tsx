import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, LockKeyhole, Trophy, X, Volume2, VolumeX } from "lucide-react";
import { MATERIAIS, STATUS, statusForPoints } from "@/data/tesourosDaPalavra";
import { useRewardExperience } from "@/hooks/useRewardExperience";

export default function TesourosDaPalavra() {
  const navigate = useNavigate();
  const [downloadHelp, setDownloadHelp] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopAudio = () => { audioRef.current?.pause(); audioRef.current = null; setSpeaking(false); };
  useEffect(() => () => { audioRef.current?.pause(); }, []);
  const toggleAudio = () => {
    if (speaking) { stopAudio(); return; }
    const audio = new Audio("/audio/lia/lia-downloads.mp3");
    audioRef.current = audio;
    audio.onended = () => { if (audioRef.current === audio) { audioRef.current = null; setSpeaking(false); } };
    audio.onerror = () => { if (audioRef.current === audio) { audioRef.current = null; setSpeaking(false); } };
    setSpeaking(true);
    void audio.play().catch(() => { if (audioRef.current === audio) { audioRef.current = null; setSpeaking(false); } });
  };
  const { points: storedPoints, loading } = useRewardExperience();
  const points = storedPoints ?? 0;
  const current = statusForPoints(points);
  const next = STATUS.find(s => s.min > points);
  return (
    <main className="min-h-[100dvh] bg-[#f7ecd3] px-4 pb-28 pt-24 text-amber-950">
      <div className="mx-auto max-w-4xl">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-amber-500 bg-white px-4 py-2 font-bold shadow"><ArrowLeft size={18}/> Voltar</button>
        <div className="rounded-3xl border-4 border-amber-500 bg-gradient-to-br from-[#fff8e6] to-[#f5dca5] p-5 shadow-xl">
          <h1 className="flex items-center gap-2 font-display text-2xl font-black"><Trophy className="text-amber-600"/> Tesouros da Palavra</h1>
          <p className="mt-2 text-sm">Aprenda, evolua e conquiste materiais educativos e bíblicos para baixar.</p>
          <div className="mt-4 rounded-2xl border border-amber-400 bg-white/85 p-4">
            <p className="font-bold">Seu status: {storedPoints === null ? "Aguardando ativação" : `${current.name} — ${current.title}`}</p>
            <p className="mt-1 text-sm">{storedPoints === null ? (loading ? "Carregando seus pontos..." : "Pontuação indisponível até a ativação do sistema.") : `${points} pontos de experiência`}</p>
            {storedPoints !== null && next && <p className="mt-1 text-xs">Próximo status: {next.name}, aos {next.min} pontos</p>}
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-amber-500" style={{ width: next ? `${Math.max(0,Math.min(100,(points-current.min)/(next.min-current.min)*100))}%` : "100%" }}/></div>
            <p className="mt-2 text-xs text-amber-800">Os pontos são independentes das moedinhas. A concessão automática por atividades será ativada após validação.</p>
          </div>
        </div>
        <h2 className="mb-3 mt-7 text-xl font-black">Níveis de conquista</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {STATUS.map(s => <div key={s.id} className="rounded-2xl border-2 border-amber-300 bg-white p-3 text-center shadow" style={{ borderTopColor: s.color, borderTopWidth: 5 }}>
            <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full text-2xl" ><img src={"/images/conquistas/nivel-" + s.id + ".webp"} alt={s.name} className={"h-full w-full object-contain " + (storedPoints === null || points < s.min ? "grayscale opacity-50" : "")} /></div>
            <p className="font-black">{s.name}</p><p className="text-xs">{s.title}</p><p className="mt-1 text-xs font-semibold">{s.min} pontos</p>
          </div>)}
        </div>
        <div className="relative mt-7 mb-4" onMouseEnter={() => setDownloadHelp(true)} onMouseLeave={() => { stopAudio(); setDownloadHelp(false); }}>
          <button type="button" onClick={() => document.getElementById("biblioteca-premiacoes")?.scrollIntoView({ behavior: "smooth", block: "start" })} onFocus={() => setDownloadHelp(true)} aria-describedby="downloads-explicacao" aria-label="Como funcionam os downloads" className="inline-flex items-center gap-2 rounded-full border-2 border-amber-400 bg-white px-4 py-2 font-extrabold text-amber-900 shadow"><Download size={21}/> Downloads</button>
          {downloadHelp && <div id="downloads-explicacao" role="tooltip" aria-label="Explicação dos downloads" className="relative mt-4 max-w-sm rounded-[20px] border-[3px] border-amber-400 bg-white p-4 text-slate-900 shadow-[0_0_14px_rgba(255,200,35,.8)]">
            <span aria-hidden="true" className="absolute -top-[13px] left-8 h-[22px] w-[22px] rotate-45 border-l-[3px] border-t-[3px] border-amber-400 bg-white"/>
            <div className="relative flex items-start gap-2"><div className="min-w-0 flex-1 text-[13px] font-medium leading-relaxed"><p>Bem-vindo ao Tesouro da Palavra!</p><p className="mt-2">Aqui, cada brincadeira vira uma linda conquista!</p><p className="mt-2">Brinque, aprenda, ganhe pontos e desbloqueie presentes bíblicos para baixar!</p><strong className="mt-2 block font-extrabold text-amber-900">Cada tesouro é uma semente de amor que Deus planta em seu coração!</strong></div><div className="flex shrink-0 flex-col gap-2"><button type="button" onClick={toggleAudio} aria-label={speaking ? "Parar gravação da LIA" : "Ouvir gravação da LIA"} className="rounded-full border-2 border-amber-400 bg-green-700 p-2 text-white shadow">{speaking ? <VolumeX size={18}/> : <Volume2 size={18}/>}</button><button type="button" onClick={() => { stopAudio(); setDownloadHelp(false); }} aria-label="Fechar explicação" className="rounded-full border border-amber-300 bg-white p-2 text-slate-700 shadow"><X size={18}/></button></div></div>
          </div>}
        </div>
        <h2 id="biblioteca-premiacoes" className="mb-3 mt-7 scroll-mt-24 text-xl font-black">Biblioteca de premiações</h2>
        <p className="mb-4 text-sm">Os materiais serão adicionados gradualmente. As conquistas serão permanentes e cumulativas.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {MATERIAIS.map(m => {
            const required = STATUS.find(s => s.id === m.requiredStatus)!;
            const unlocked = storedPoints !== null && points >= required.min;
            const available = unlocked && !!m.url && m.url.startsWith("/premios/");
            return <article key={m.id} className="rounded-2xl border-2 border-amber-300 bg-white p-4 shadow">
              <div className="flex items-start gap-3"><div className="rounded-xl bg-amber-100 p-3">{available ? <Download/> : <LockKeyhole/>}</div><div className="min-w-0 flex-1"><h3 className="font-bold">{m.title}</h3><p className="text-sm text-amber-800">{m.description}</p><p className="mt-1 text-xs font-bold">Status: {required.name}</p></div></div>
              {available ? <a href={m.url} download className="mt-3 block rounded-xl bg-emerald-700 p-2 text-center font-bold text-white">Baixar arquivo</a> : <p className="mt-3 rounded-xl bg-amber-50 p-2 text-center text-xs font-bold text-amber-900">{unlocked ? "Material em preparação" : `Desbloqueia em ${required.name} • material em preparação`}</p>}
            </article>;
          })}
        </div>
      </div>
    </main>
  );
}
