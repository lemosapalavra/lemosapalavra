import { useEffect, useRef, useState } from "react";
import { BookOpen, Download, Gift, LockKeyhole, Sparkles, Star, Trophy, X, Volume2, VolumeX } from "lucide-react";
import { MATERIAIS, STATUS, statusForPoints } from "@/data/tesourosDaPalavra";
import { useRewardExperience } from "@/hooks/useRewardExperience";

export default function TesourosDaPalavra() {
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
    <main className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-[#d8f3ff] via-[#fff0bf] to-[#f5d18c] px-4 pb-28 pt-24 text-amber-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl"/><div className="absolute -right-24 top-[40%] h-80 w-80 rounded-full bg-sky-200/35 blur-3xl"/></div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/tesouros-da-palavra.png')] bg-cover bg-top bg-no-repeat opacity-35" />
      <div className="relative mx-auto max-w-4xl">
        <div className="relative mb-5 overflow-hidden rounded-[30px] border-[5px] border-[#d69a31] bg-gradient-to-b from-[#62c7f4] via-[#b9ebcb] to-[#f8d684] px-4 pb-5 pt-7 text-center shadow-[0_15px_30px_rgba(98,62,16,.28)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[url('/images/tesouros-da-palavra.png')] bg-cover bg-center opacity-35"/>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40" style={{backgroundImage:"radial-gradient(circle at 20% 25%, #fff 0 2px, transparent 4px), radial-gradient(circle at 80% 15%, #fff9b4 0 4px, transparent 8px), radial-gradient(circle at 65% 72%, #fff 0 2px, transparent 5px)",backgroundSize:"85px 95px"}}/>
          <div className="relative mx-auto w-fit rounded-[24px] border-4 border-[#e9b451] bg-gradient-to-b from-[#9b561e] to-[#61300e] px-5 py-3 shadow-[0_8px_0_#8b4c16,0_12px_20px_#6c471f80]"><span className="absolute -top-7 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg">👑</span><h1 className="font-display text-3xl font-black leading-tight text-[#ffdc72] [text-shadow:2px_3px_0_#6d350c] sm:text-5xl">Tesouros<br/>da Palavra</h1></div>
          <p className="relative mx-auto mt-5 max-w-sm rounded-xl bg-white/85 px-3 py-2 text-sm font-extrabold text-amber-950 shadow-sm">Conquiste, aprenda e descubra os tesouros da Bíblia!</p>
          <div className="relative mx-auto mt-3 flex max-w-md items-center justify-center gap-3"><span aria-hidden="true" className="text-5xl drop-shadow-lg sm:text-7xl">📖</span><div className="relative text-7xl drop-shadow-[0_0_18px_rgba(255,208,0,.9)] sm:text-8xl" aria-hidden="true">🧰<Sparkles className="absolute -right-2 -top-2 h-10 w-10 animate-pulse text-yellow-300"/></div><span aria-hidden="true" className="text-5xl drop-shadow-lg sm:text-7xl">🏆</span></div>
          <p className="relative mt-2 text-sm font-black text-[#75410e]">Cada descoberta é um novo tesouro!</p>
        </div>
        <div className="relative overflow-hidden rounded-[30px] border-4 border-amber-400 bg-gradient-to-br from-[#fffef6] via-[#fff0c5] to-[#f9d68a] p-5 shadow-[0_12px_30px_rgba(135,83,14,.18)]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/60 blur-2xl"/>
          <div className="relative flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[28px] border-2 border-amber-300 bg-white/75 shadow-lg sm:h-32 sm:w-32">
              <BookOpen className="absolute bottom-3 h-16 w-16 text-amber-800" strokeWidth={1.6}/>
              <Sparkles className="absolute right-3 top-2 h-8 w-8 animate-pulse text-yellow-500"/>
              <Star className="absolute left-3 top-4 h-6 w-6 fill-yellow-400 text-yellow-500"/>
              <Trophy className="absolute top-5 h-11 w-11 text-amber-600 drop-shadow" strokeWidth={2.2}/>
            </div>
            <div><p className="mb-1 text-xs font-black uppercase tracking-[.2em] text-amber-700">Uma aventura de fé e descobertas</p><h1 className="font-display text-2xl font-black leading-tight sm:text-3xl">Tesouros da Palavra <Sparkles className="inline h-6 w-6 text-amber-500"/></h1>
              <p className="mt-2 text-sm font-medium">Cada história aprendida é uma conquista! Explore a Bíblia, avance de nível e descubra presentes especiais.</p>
            </div>
          </div>
          <div className="relative mt-5 rounded-2xl border-2 border-amber-300 bg-white/90 p-4 shadow-sm">
            <p className="font-bold">Seu status: {storedPoints === null ? "Aguardando ativação" : `${current.name} — ${current.title}`}</p>
            <p className="mt-1 text-sm">{storedPoints === null ? (loading ? "Carregando seus pontos..." : "Pontuação indisponível até a ativação do sistema.") : `${points} pontos de experiência`}</p>
            {storedPoints !== null && next && <p className="mt-1 text-xs">Próximo status: {next.name}, aos {next.min} pontos</p>}
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-amber-500" style={{ width: next ? `${Math.max(0,Math.min(100,(points-current.min)/(next.min-current.min)*100))}%` : "100%" }}/></div>
            <p className="mt-2 text-xs text-amber-800">Os pontos são independentes das moedinhas. A concessão automática por atividades será ativada após validação.</p>
          </div>
        </div>
        <div className="mb-3 mt-8 rounded-2xl border-2 border-amber-500 bg-gradient-to-r from-[#7e3f16] to-[#a85e20] px-4 py-3 text-center text-[#ffe4a1] shadow-lg"><Trophy className="mr-2 inline h-6 w-6"/><h2 className="inline text-xl font-black">Níveis de Conquista</h2></div>
        <p className="mb-4 text-sm text-amber-900">Cada medalha conta um novo capítulo da sua aventura!</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {STATUS.map(s => { const achieved = storedPoints !== null && points >= s.min; const isCurrent = achieved && current.id === s.id; return <div key={s.id} className={`relative rounded-[24px] border-2 p-3 text-center shadow-md transition-transform duration-200 hover:-translate-y-1 ${isCurrent ? "border-amber-500 bg-gradient-to-b from-[#fff5cd] to-white ring-2 ring-amber-300" : "border-amber-200 bg-white/95"}`} style={{ borderTopColor: s.color, borderTopWidth: 5 }}>
            {isCurrent && <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-1 text-[10px] font-black text-white">Meu nível</span>}
            <div className={`mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-amber-50 to-amber-100 p-1 text-2xl ${achieved ? "shadow-[0_0_18px_rgba(251,191,36,.5)]" : ""}`} ><img src={"/images/conquistas/nivel-" + s.id + ".webp"} alt={s.name} className={"h-full w-full object-contain " + (storedPoints === null || points < s.min ? "grayscale opacity-50" : "")} /></div>
            <p className="font-black">{s.name}</p><p className="text-xs">{s.title}</p><p className="mt-1 text-xs font-semibold">{s.min} pontos</p><p className={`mt-2 text-[11px] font-bold ${achieved ? "text-emerald-700" : "text-amber-700"}`}>{achieved ? "★ Conquistado!" : "☆ A conquistar"}</p>
          </div>})}
        </div>
        <div className="relative mt-7 mb-4" onMouseEnter={() => setDownloadHelp(true)} onMouseLeave={() => { stopAudio(); setDownloadHelp(false); }}>
          <button type="button" onClick={() => document.getElementById("biblioteca-premiacoes")?.scrollIntoView({ behavior: "smooth", block: "start" })} onFocus={() => setDownloadHelp(true)} aria-describedby="downloads-explicacao" aria-label="Como funcionam os downloads" className="inline-flex items-center gap-2 rounded-full border-2 border-amber-400 bg-white px-4 py-2 font-extrabold text-amber-900 shadow"><Download size={21}/> Downloads</button>
          {downloadHelp && <div id="downloads-explicacao" role="tooltip" aria-label="Explicação dos downloads" className="relative mt-4 max-w-sm rounded-[20px] border-[3px] border-amber-400 bg-white p-4 text-slate-900 shadow-[0_0_14px_rgba(255,200,35,.8)]">
            <span aria-hidden="true" className="absolute -top-[13px] left-8 h-[22px] w-[22px] rotate-45 border-l-[3px] border-t-[3px] border-amber-400 bg-white"/>
            <div className="relative flex items-start gap-2"><div className="min-w-0 flex-1 text-[13px] font-medium leading-relaxed"><p>Bem-vindo ao Tesouro da Palavra!</p><p className="mt-2">Aqui, cada brincadeira vira uma linda conquista!</p><p className="mt-2">Brinque, aprenda, ganhe pontos e desbloqueie presentes bíblicos para baixar!</p><strong className="mt-2 block font-extrabold text-amber-900">Cada tesouro é uma semente de amor que Deus planta em seu coração!</strong></div><div className="flex shrink-0 flex-col gap-2"><button type="button" onClick={toggleAudio} aria-label={speaking ? "Parar gravação da LIA" : "Ouvir gravação da LIA"} className="rounded-full border-2 border-amber-400 bg-green-700 p-2 text-white shadow">{speaking ? <VolumeX size={18}/> : <Volume2 size={18}/>}</button><button type="button" onClick={() => { stopAudio(); setDownloadHelp(false); }} aria-label="Fechar explicação" className="rounded-full border border-amber-300 bg-white p-2 text-slate-700 shadow"><X size={18}/></button></div></div>
          </div>}
        </div>
        <h2 id="biblioteca-premiacoes" className="mb-3 mt-7 flex scroll-mt-24 items-center justify-center gap-2 rounded-2xl border-2 border-amber-500 bg-gradient-to-r from-[#7e3f16] to-[#a85e20] px-4 py-3 text-xl font-black text-[#ffe4a1] shadow-lg"><Gift className="h-6 w-6 text-amber-600"/> Biblioteca de premiações</h2>
        <p className="mb-4 text-sm">Os materiais serão adicionados gradualmente. As conquistas serão permanentes e cumulativas.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {MATERIAIS.map(m => {
            const required = STATUS.find(s => s.id === m.requiredStatus)!;
            const unlocked = storedPoints !== null && points >= required.min;
            const available = unlocked && !!m.url && m.url.startsWith("/premios/");
            return <article key={m.id} className="rounded-2xl border-2 border-amber-300 bg-white/95 p-4 shadow-md transition-shadow hover:shadow-lg">
              <div className="flex items-start gap-3"><div className="rounded-xl bg-amber-100 p-3">{available ? <Download/> : <LockKeyhole/>}</div><div className="min-w-0 flex-1"><h3 className="font-bold">{m.title}</h3><p className="text-sm text-amber-800">{m.description}</p><p className="mt-1 text-xs font-bold">Status: {required.name}</p></div></div>
              {available ? <a href={m.url} download className="mt-3 block rounded-xl bg-emerald-700 p-2 text-center font-bold text-white">Baixar arquivo</a> : <p className="mt-3 rounded-xl bg-amber-50 p-2 text-center text-xs font-bold text-amber-900">{unlocked ? "Material em preparação" : `Desbloqueia em ${required.name} • material em preparação`}</p>}
            </article>;
          })}
        </div>
      </div>
    </main>
  );
}
