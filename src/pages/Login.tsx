import { useEffect, useRef, useState, type FormEvent } from "react";
import loginBackground from "@/assets/login-optimized.webp";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Volume2, VolumeX, X } from "lucide-react";
import InstallShortcut from "@/components/InstallShortcut";

/** Acesso da família por Google ou link de e-mail. */
export default function Login() {
  const [busy, setBusy] = useState<"google" | "email" | null>(null);
  const [pressed, setPressed] = useState<"google" | null>(null);
  const [emailLoginOpen, setEmailLoginOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [liaOpen, setLiaOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const loginHelp = "Oieee! Bem-vindo ao Lemos a Palavra! Para entrar, clique no ícone do Google e escolha sua conta, ou clique no envelope para receber um link de acesso por e-mail. Quer abrir nosso site mais rápido no celular? Toque em Baixar atalho. Deus te abençoe!";
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) { toast({ title: "Leitura em voz alta indisponível neste navegador." }); return; }
    window.speechSynthesis.cancel();
    if (speechRef.current) { speechRef.current = null; setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(loginHelp);
    utterance.lang = "pt-BR";
    utterance.rate = 0.94;
    const voice = window.speechSynthesis.getVoices().find(v => /^pt-BR/i.test(v.lang)) ?? window.speechSynthesis.getVoices().find(v => /^pt/i.test(v.lang));
    if (voice) utterance.voice = voice;
    utterance.onend = utterance.onerror = () => { if (speechRef.current === utterance) { speechRef.current = null; setSpeaking(false); } };
    speechRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => { if (active) setCheckingSession(false); }, 12000);
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      window.clearTimeout(timeout);
      if (data.session?.user) navigate("/", { replace: true });
      else setCheckingSession(false);
    }).catch(() => { if (active) setCheckingSession(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session?.user) navigate("/", { replace: true });
    });
    return () => { active = false; window.clearTimeout(timeout); listener.subscription.unsubscribe(); };
  }, [navigate]);

  const playTap = () => {
    try {
      const AudioContextClass = window.AudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.17);
      oscillator.onended = () => void ctx.close();
    } catch { /* audio may be unavailable */ }
  };

  const animateTap = (provider: "google") => {
    setPressed(provider);
    window.setTimeout(() => setPressed(null), 550);
  };

  const enterWithGoogle = async () => {
    if (busy) return;
    playTap();
    animateTap("google");
    setBusy("google");
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("A conta Google não foi confirmada. Tente novamente.");
      navigate("/");
    } catch (error) {
      toast({
        title: "Não foi possível entrar com Google",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };


  const enterWithEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const email = emailAddress.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Informe um e-mail válido", variant: "destructive" });
      return;
    }
    playTap();
    setBusy("email");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/login", shouldCreateUser: true },
      });
      if (error) throw error;
      toast({ title: "Confira seu e-mail", description: "Se o endereço estiver habilitado, você receberá um link para entrar." });
      setEmailLoginOpen(false);
    } catch (error) {
      toast({ title: "Não foi possível enviar o link", description: error instanceof Error ? error.message : "Tente novamente.", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="fixed inset-0 w-full overflow-y-auto bg-[#1d381c]" aria-label="Entrar no Lemos a Palavra">
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[720px] overflow-hidden">
        <img
          src={loginBackground}
          alt="Imagem de boas-vindas da página de login do Lemos a Palavra"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
        />
        <div className="relative z-10 flex min-h-[100dvh] flex-col items-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex-1 min-h-[8vh]" />
          <style>{`
            @keyframes loginIconFloat { 0%,100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(255,255,255,.3)); } 50% { transform: scale(1.12); filter: drop-shadow(0 0 18px rgba(255,215,70,.9)); } }
            @keyframes loginIconGlow { 0%,100% { opacity: 1; } 50% { opacity: .96; } }
            @keyframes loginIconPop { 0% { transform: scale(1); } 35% { transform: scale(.86) rotate(-8deg); } 65% { transform: scale(1.2) rotate(6deg); } 100% { transform: scale(1); } }
            .google-login-floating { animation: loginIconFloat 2.6s ease-in-out infinite, loginIconGlow 2.6s ease-in-out infinite; will-change: transform; }
            .google-login-pressed { animation: loginIconPop .55s ease-out, loginIconGlow 2.6s ease-in-out infinite; }
            @keyframes loginRingPulse { 0%,100% { transform: scale(.96); opacity: .75; box-shadow: 0 0 12px 3px rgba(255,213,50,.65), inset 0 0 9px rgba(255,247,150,.65); } 50% { transform: scale(1.13); opacity: 1; box-shadow: 0 0 28px 10px rgba(255,220,60,.95), inset 0 0 18px rgba(255,255,190,.9); } }
            .login-glow-ring::before { content: ""; position: absolute; inset: 1px; border-radius: 9999px; border: 3px solid rgba(255,220,65,.95); pointer-events: none; animation: loginRingPulse 2.6s ease-in-out infinite; }
            .login-glow-ring::after { content: "✦"; position: absolute; right: 0; top: -14px; color: #fff8a5; font-size: 25px; text-shadow: 0 0 9px #fff, 0 0 18px #ffd700; pointer-events: none; animation: loginSparkle 2.4s ease-in-out infinite; }
            @keyframes loginArtworkFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
            @keyframes loginSparkle { 0%,100% { opacity: .25; transform: scale(.92); } 50% { opacity: .9; transform: scale(1.13); } }
            .login-artwork-float { animation: loginArtworkFloat 3s ease-in-out infinite; }
            .login-sparkle { animation: loginSparkle 2.4s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) { .login-motion, .login-artwork-float, .login-sparkle { animation: none !important; } }
          `}</style>
          <section className="relative z-20 mt-auto flex w-full max-w-[520px] flex-col items-center" aria-label="Escolha como entrar e conheça a LIA">
            {/* Os ícones superiores já fazem parte da arte de fundo.
                Áreas de toque independentes evitam duplicar Google e e-mail. */}
            <div className="pointer-events-none absolute inset-x-0 top-[-38vh] z-30 mx-auto flex w-[min(76vw,330px)] items-center justify-between">
              <button type="button" disabled={busy !== null || checkingSession} onClick={() => void enterWithGoogle()} aria-label="Entrar com Google" title="Entrar com Google" className="login-motion pointer-events-auto login-glow-ring relative h-[clamp(68px,21vw,108px)] w-[clamp(68px,21vw,108px)] rounded-full border-0 bg-transparent transition-transform hover:scale-110 active:scale-95 disabled:opacity-60" />
              <button type="button" disabled={busy !== null || checkingSession} onClick={() => { playTap(); setEmailLoginOpen(value => !value); }} aria-label="Entrar por e-mail" title="Entrar por e-mail" className="login-motion pointer-events-auto login-glow-ring relative h-[clamp(68px,21vw,108px)] w-[clamp(68px,21vw,108px)] rounded-full border-0 bg-transparent shadow-[0_0_18px_5px_rgba(255,220,75,.24)] disabled:opacity-60" style={{ animationDelay: ".7s" }} />
            </div>
            <button type="button" onClick={() => { playTap(); setLiaOpen(value => !value); }} aria-label="Conversar com a LIA — Posso Ajudar?" title="Posso Ajudar?" className="group relative mt-3 w-[min(62vw,245px)] border-0 bg-transparent p-0">
              <img src="/LIA%20Posso%20Ajudar.webp" alt="LIA — Posso Ajudar?" className="login-artwork-float login-motion h-auto w-full object-contain drop-shadow-[0_0_10px_rgba(255,215,75,.5)] group-hover:brightness-110" />
            </button>
            {emailLoginOpen && (
              <form onSubmit={enterWithEmail} className="fixed left-1/2 top-1/2 z-50 flex w-[min(320px,90vw)] -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-xl border-2 border-amber-300 bg-slate-950/95 p-3 shadow-xl">
                <label htmlFor="lemos-email-login" className="text-center text-xs font-semibold text-white">Receber link de acesso no e-mail</label>
                <input id="lemos-email-login" type="email" autoComplete="email" required value={emailAddress} onChange={event => setEmailAddress(event.target.value)} placeholder="seuemail@exemplo.com" className="h-11 rounded-md border border-slate-300 bg-white px-3 text-slate-950 placeholder:text-slate-500" />
                <button type="submit" disabled={busy !== null} className="rounded-md bg-amber-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60">{busy === "email" ? "Enviando..." : "Enviar link de acesso"}</button>
                <button type="button" onClick={() => setEmailLoginOpen(false)} className="text-sm font-semibold text-white underline">Fechar</button>
              </form>
            )}
            {liaOpen && (
              <div role="dialog" aria-label="Ajuda da LIA no login" className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-[min(320px,90vw)] -translate-x-1/2 rounded-2xl border-2 border-amber-300 bg-[#102f4a]/95 p-3 text-white shadow-[0_0_22px_rgba(255,215,80,.6)]">
                <div className="flex items-center justify-between gap-2 border-b border-white/25 pb-2">
                  <strong className="text-sm text-yellow-300">COMO ACESSAR O SITE</strong>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={toggleSpeech} aria-label={speaking ? "Parar leitura" : "Ouvir orientação da página"} title={speaking ? "Parar leitura" : "Ouvir orientação"} className="rounded-lg bg-white/15 p-2">{speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
                    <button type="button" onClick={() => { setLiaOpen(false); window.speechSynthesis?.cancel(); speechRef.current = null; setSpeaking(false); }} aria-label="Fechar ajuda" className="rounded-lg bg-white/15 p-2"><X size={20} /></button>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed">Oieee! 💛 Para entrar, escolha sua conta no <strong>Google</strong> ou toque no <strong>envelope</strong> para receber um link por e-mail.</p>
                <p className="mt-2 text-sm leading-relaxed">Quer entrar mais rápido pelo celular? Baixe o atalho e abra o Lemos a Palavra pelo ícone!</p>
                <div className="mt-3 rounded-xl border border-sky-400 bg-sky-950/70 p-2 text-center">
                  <InstallShortcut compact />
                  <p className="mt-1 text-xs font-semibold text-white">Baixar atalho para o celular</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
